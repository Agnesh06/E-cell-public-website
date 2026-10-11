import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Scale factor for the rocket. Target: roughly 3-4% of viewport width on desktop.
 * Easily adjust this constant to change rocket scale across the application.
 */
export const ROCKET_SCALE = 0.5

export interface FlowArrow3DProps {
  drawnPathRef: React.RefObject<SVGPathElement | null>
  stageRef: React.RefObject<HTMLDivElement | null>
  progressRef?: React.RefObject<number>
  renderRef?: React.MutableRefObject<((p?: number) => void) | null>
  className?: string
}

/**
 * Creates the faceted low-poly paper-plane arrowhead geometry.
 * Local coordinate convention:
 * - Pivot [0, 0, 0] is at the TAIL ANCHOR point (where the trail line connects).
 * - Nose tip extends forward along +X (direction of travel).
 * - Wings flare laterally along ±Y.
 * - Upper ridge crease points towards viewer (+Z).
 * - Lower keel points away from viewer (-Z).
 */
function createArrowGeometry(scale: number): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()

  const s = scale
  // Tail anchor at [0, 0, 0]
  const tail = [0, 0, 0]
  // Forward nose tip
  const tip = [76 * s, 0, 0]
  // Upper central ridge crease
  const ridge = [22 * s, 0, 8 * s]
  // Lower underside keel crease
  const keel = [8 * s, 0, -5 * s]
  // Wing tips (trailing edge at x = 0)
  const leftWing = [0, -28 * s, 1.8 * s]
  const rightWing = [0, 28 * s, 1.8 * s]

  // Face 1: Left wing facets (Main face - exact line color)
  // 1. Top front left fold: tip -> ridge -> leftWing
  // 2. Top rear left fold: ridge -> tail -> leftWing
  // 3. Underside front left fold: tip -> leftWing -> keel
  // 4. Underside rear left fold: leftWing -> tail -> keel
  const leftFaces = [
    ...tip, ...ridge, ...leftWing,
    ...ridge, ...tail, ...leftWing,
    ...tip, ...leftWing, ...keel,
    ...leftWing, ...tail, ...keel,
  ]

  // Face 2: Right wing facets (Darker face - 18% lower lightness)
  // 1. Top front right fold: tip -> rightWing -> ridge
  // 2. Top rear right fold: ridge -> rightWing -> tail
  // 3. Underside front right fold: tip -> keel -> rightWing
  // 4. Underside rear right fold: rightWing -> keel -> tail
  const rightFaces = [
    ...tip, ...rightWing, ...ridge,
    ...ridge, ...rightWing, ...tail,
    ...tip, ...keel, ...rightWing,
    ...rightWing, ...keel, ...tail,
  ]

  const positions = new Float32Array([...leftFaces, ...rightFaces])
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // Multi-material groups:
  // group 0 (material 0: lighter/main face): 12 vertices = 4 triangles
  geom.addGroup(0, 12, 0)
  // group 1 (material 1: darker face): 12 vertices = 4 triangles
  geom.addGroup(12, 12, 1)

  geom.computeVertexNormals()
  return geom
}

/**
 * Creates the thin double-stripe trail streaming behind the wings.
 * Extends backward from x = 0 (the tail anchor) into negative X.
 */
function createTrailGeometry(scale: number): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()

  const s = scale
  const startX = 0
  const endX = -32 * s
  const halfW = 1.0 * s
  const z = 1.8 * s

  // Left stripe centered at y = -12 * s
  const l1 = [startX, -12 * s - halfW, z]
  const l2 = [startX, -12 * s + halfW, z]
  const l3 = [endX, -12 * s + halfW, z]
  const l4 = [endX, -12 * s - halfW, z]

  // Right stripe centered at y = +12 * s
  const r1 = [startX, 12 * s - halfW, z]
  const r2 = [startX, 12 * s + halfW, z]
  const r3 = [endX, 12 * s + halfW, z]
  const r4 = [endX, 12 * s - halfW, z]

  const positions = new Float32Array([
    // Left stripe quad
    ...l1, ...l2, ...l3,
    ...l1, ...l3, ...l4,
    // Right stripe quad
    ...r1, ...r2, ...r3,
    ...r1, ...r3, ...r4,
  ])

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.computeVertexNormals()
  return geom
}

/**
 * Arc-length parameterized curve constructed from the sampled SVG path points.
 * Because the underlying samples are drawn at uniform arc-length increments,
 * getPoint(u) and getPointAt(u) are identical and arc-length uniform.
 */
class PathArcCurve extends THREE.Curve<THREE.Vector3> {
  points: THREE.Vector3[]
  tangents: THREE.Vector3[]

  constructor(points: THREE.Vector3[]) {
    super()
    this.points = points
    this.arcLengthDivisions = points.length

    this.tangents = []
    const count = points.length
    for (let i = 0; i < count; i++) {
      const prev = points[Math.max(0, i - 1)]
      const next = points[Math.min(count - 1, i + 1)]
      const t = new THREE.Vector3().subVectors(next, prev).normalize()
      this.tangents.push(t)
    }
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const clampedT = Math.max(0, Math.min(1, t))
    const index = clampedT * (this.points.length - 1)
    const i = Math.floor(index)
    const f = index - i
    if (i >= this.points.length - 1) {
      return optionalTarget.copy(this.points[this.points.length - 1])
    }
    return optionalTarget.lerpVectors(this.points[i], this.points[i + 1], f)
  }

  getPointAt(u: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    return this.getPoint(u, optionalTarget)
  }

  getTangentAt(u: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const clampedU = Math.max(0, Math.min(1, u))
    const index = clampedU * (this.tangents.length - 1)
    const i = Math.floor(index)
    const f = index - i
    if (i >= this.tangents.length - 1) {
      return optionalTarget.copy(this.tangents[this.tangents.length - 1])
    }
    return optionalTarget.lerpVectors(this.tangents[i], this.tangents[i + 1], f).normalize()
  }
}

/**
 * Reads the actual color used by the line material (--color-blue or --color-primary)
 * to ensure pixel-perfect color matching without hardcoded values.
 */
function getLineColor(): string {
  if (typeof window === 'undefined') return '#2547FF'
  const rootStyles = getComputedStyle(document.documentElement)
  const lineVal =
    rootStyles.getPropertyValue('--color-blue').trim() ||
    rootStyles.getPropertyValue('--color-primary').trim() ||
    '#2547FF'
  return lineVal.startsWith('#') || lineVal.startsWith('rgb') ? lineVal : '#2547FF'
}

/**
 * Samples the curve tangent over a small window [p - 0.005, p + 0.005]
 * and averages them to completely remove micro-jitter.
 */
function getSmoothedTangent(curve: PathArcCurve, p: number): THREE.Vector3 {
  const p1 = Math.max(0, p - 0.005)
  const p2 = p
  const p3 = Math.min(1, p + 0.005)

  const t1 = curve.getTangentAt(p1)
  const t2 = curve.getTangentAt(p2)
  const t3 = curve.getTangentAt(p3)

  return new THREE.Vector3()
    .add(t1)
    .add(t2)
    .add(t3)
    .divideScalar(3)
    .normalize()
}

/**
 * Samples points along the SVG path in stage coordinates to build the PathArcCurve.
 */
function buildCurveFromPath(
  pathEl: SVGPathElement,
  stageEl: HTMLDivElement,
): PathArcCurve | null {
  const pathLength = pathEl.getTotalLength ? pathEl.getTotalLength() : 0
  if (!pathLength) return null

  const svg = pathEl.ownerSVGElement
  if (!svg) return null
  const ctm = pathEl.getScreenCTM()
  if (!ctm) return null

  const stageRect = stageEl.getBoundingClientRect()
  const pPoint = svg.createSVGPoint()

  const SAMPLE_COUNT = 360
  const points: THREE.Vector3[] = []

  for (let i = 0; i < SAMPLE_COUNT; i++) {
    const s = (i / (SAMPLE_COUNT - 1)) * pathLength
    const pt = pathEl.getPointAtLength(s)
    pPoint.x = pt.x
    pPoint.y = pt.y
    const screenPt = pPoint.matrixTransform(ctm)
    points.push(
      new THREE.Vector3(
        screenPt.x - stageRect.left,
        screenPt.y - stageRect.top,
        0,
      ),
    )
  }

  return new PathArcCurve(points)
}

export const FlowArrow3D: React.FC<FlowArrow3DProps> = React.memo(({
  drawnPathRef,
  stageRef,
  progressRef,
  renderRef,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isInitializedRef = useRef<boolean>(false)
  const curveRef = useRef<PathArcCurve | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()

    let width = stage.clientWidth || window.innerWidth
    let height = stage.clientHeight || window.innerHeight

    // Orthographic camera matching stage pixel dimensions:
    // (0,0) is top-left, (width, height) is bottom-right, +Z is towards viewer
    const camera = new THREE.OrthographicCamera(0, width, 0, height, -1000, 1000)
    camera.position.set(0, 0, 500)
    camera.updateProjectionMatrix()

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.setSize(width, height, false)

    // Colors derived directly from the website's theme line color (read once, not per frame)
    const currentLineColor = getLineColor()
    const baseColor = new THREE.Color(currentLineColor)
    const hsl = { h: 0, s: 0, l: 0 }
    baseColor.getHSL(hsl)

    const darkColor = new THREE.Color().setHSL(
      hsl.h,
      hsl.s,
      Math.max(0.08, hsl.l - 0.18),
    )
    const trailColor = new THREE.Color().setHSL(
      hsl.h,
      Math.max(0.2, hsl.s * 0.7),
      Math.min(0.92, hsl.l + 0.35),
    )

    // Using MeshBasicMaterial ensures pixel-perfect color match without light tinting
    const mainMaterial = new THREE.MeshBasicMaterial({
      color: baseColor,
      side: THREE.DoubleSide,
    })

    const darkMaterial = new THREE.MeshBasicMaterial({
      color: darkColor,
      side: THREE.DoubleSide,
    })

    const trailMaterial = new THREE.MeshBasicMaterial({
      color: trailColor,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    })

    // Responsive scaling: desktop roughly 3-4% of viewport width, slightly larger on mobile
    const mobileMultiplier = width < 768 ? 1.25 : 1.0
    const activeScale = ROCKET_SCALE * mobileMultiplier

    const arrowGeom = createArrowGeometry(activeScale)
    const trailGeom = createTrailGeometry(activeScale)

    const arrowMesh = new THREE.Mesh(arrowGeom, [mainMaterial, darkMaterial])
    const trailMesh = new THREE.Mesh(trailGeom, trailMaterial)

    const arrowGroup = new THREE.Group()
    arrowGroup.add(arrowMesh)
    arrowGroup.add(trailMesh)
    scene.add(arrowGroup)

    // Build curve initially
    if (drawnPathRef.current) {
      curveRef.current = buildCurveFromPath(drawnPathRef.current, stage)
    }

    // ── Continuous Smooth Line (TubeGeometry with shader progress reveal) ─────
    // Slightly thinner than rocket wingspan: radius ~4-4.5px (diameter ~8-9px)
    const tubeRadius = Math.max(3.2, 8.5 * activeScale * 0.5)
    const tubularSegments = 360
    const radialSegments = 12

    const lineMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: baseColor },
        uProgress: { value: 0.0 },
        uFadeLength: { value: 0.07 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uProgress;
        uniform float uFadeLength;
        varying vec2 vUv;

        void main() {
          if (uProgress <= 0.0001 || vUv.x > uProgress) {
            discard;
          }

          // Smooth continuous alpha gradient on the oldest (start) end
          float alpha = smoothstep(0.0, uFadeLength, vUv.x);

          // Subpixel antialiased cutoff ending precisely at rocket tail
          float edgeDelta = (uProgress - vUv.x) / max(fwidth(vUv.x), 0.00002);
          alpha *= clamp(edgeDelta, 0.0, 1.0);

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })

    const buildTubeGeometry = (curve: PathArcCurve) => {
      return new THREE.TubeGeometry(
        curve,
        tubularSegments,
        tubeRadius,
        radialSegments,
        false,
      )
    }

    let lineGeom = curveRef.current
      ? buildTubeGeometry(curveRef.current)
      : new THREE.BufferGeometry()

    const lineMesh = new THREE.Mesh(lineGeom, lineMaterial)
    scene.add(lineMesh)

    let lastRenderedProgress = -1
    const targetQuat = new THREE.Quaternion()

    const renderScene = (rawP?: number) => {
      if (!curveRef.current && drawnPathRef.current && stageRef.current) {
        curveRef.current = buildCurveFromPath(drawnPathRef.current, stageRef.current)
      }
      const curve = curveRef.current
      if (!curve) return

      let target = rawP
      if (target === undefined) {
        if (progressRef && typeof progressRef.current === 'number') {
          target = progressRef.current
        } else if (stageRef.current) {
          const dataProgress = stageRef.current.getAttribute('data-progress')
          if (dataProgress !== null) {
            target = parseFloat(dataProgress)
          }
        }
      }
      const p = Math.max(0, Math.min(1, isNaN(target ?? 0) ? 0 : (target ?? 0)))

      if (Math.abs(p - lastRenderedProgress) < 0.00005 && isInitializedRef.current) {
        return
      }
      lastRenderedProgress = p

      const pos = curve.getPointAt(p)
      arrowGroup.position.copy(pos)

      if (typeof window !== 'undefined') {
        ;(window as unknown as { __ROCKET_POS__?: { x: number; y: number }; __ROCKET_PROGRESS__?: number }).__ROCKET_POS__ = { x: pos.x, y: pos.y }
        ;(window as unknown as { __ROCKET_POS__?: { x: number; y: number }; __ROCKET_PROGRESS__?: number }).__ROCKET_PROGRESS__ = p
      }

      const avgTangent = getSmoothedTangent(curve, p)
      const headingAngle = Math.atan2(avgTangent.y, avgTangent.x)
      targetQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), headingAngle)
      arrowGroup.quaternion.copy(targetQuat)
      isInitializedRef.current = true

      if (curve && !(lineGeom instanceof THREE.TubeGeometry)) {
        lineGeom.dispose()
        lineGeom = buildTubeGeometry(curve)
        lineMesh.geometry = lineGeom
      }

      lineMaterial.uniforms.uProgress.value = p
      renderer.render(scene, camera)
    }

    // On-demand rendering: only render when progress changes or on scroll
    let rafId = 0
    const requestRender = (p?: number) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        rafId = 0
        renderScene(p)
      })
    }

    // Connect renderRef if provided
    if (renderRef) {
      renderRef.current = (p?: number) => {
        requestRender(p)
      }
    }

    // Passive scroll listener for demand rendering on scroll
    const onScroll = () => {
      requestRender()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Pre-warm WebGL shader pipeline and render initial frame synchronously on mount
    try {
      renderer.compile(scene, camera)
      renderScene(0)
    } catch {
      // Ignore pre-warm compilation errors on mock or inactive contexts
    }

    const handleResize = () => {
      if (!stageRef.current) return
      width = stageRef.current.clientWidth || window.innerWidth
      height = stageRef.current.clientHeight || window.innerHeight

      camera.right = width
      camera.bottom = height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))

      // Re-sample curve on resize
      if (drawnPathRef.current) {
        curveRef.current = buildCurveFromPath(drawnPathRef.current, stageRef.current)
        if (curveRef.current) {
          lineGeom.dispose()
          lineGeom = buildTubeGeometry(curveRef.current)
          lineMesh.geometry = lineGeom
          lastRenderedProgress = -1
        }
      }
      requestRender()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', handleResize)
      if (renderRef) {
        renderRef.current = null
      }

      arrowGeom.dispose()
      trailGeom.dispose()
      lineGeom.dispose()
      mainMaterial.dispose()
      darkMaterial.dispose()
      trailMaterial.dispose()
      lineMaterial.dispose()
      renderer.dispose()
    }
  }, [drawnPathRef, stageRef, progressRef, renderRef])

  return (
    <canvas
      ref={canvasRef}
      className={`flow-arrow-canvas absolute inset-0 pointer-events-none z-0 w-full h-full select-none [transform:translateZ(0)] ${className}`}
      aria-hidden="true"
    />
  )
})

export default FlowArrow3D



