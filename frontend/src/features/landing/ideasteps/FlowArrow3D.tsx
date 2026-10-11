import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface FlowArrow3DProps {
  drawnPathRef: React.RefObject<SVGPathElement | null>
  stageRef: React.RefObject<HTMLDivElement | null>
  progressRef?: React.RefObject<number>
  className?: string
}

/**
 * Creates the low-poly faceted 3D paper-plane / arrowhead geometry.
 * Local orientation:
 * - Forward direction: +X (tip points along +X)
 * - Lateral span: Y axis (left wing is -Y, right wing is +Y)
 * - Depth/normal: Z axis (ridge points towards viewer at +Z)
 */
function createArrowGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()

  const tipX = 24
  const ridgeX = -12
  const ridgeZ = 6.0
  const keelX = -10
  const keelZ = -4.5
  const wingX = -16
  const wingHalfSpan = 15
  const wingZ = 1.2
  const notchX = -4
  const notchZ = 2.0

  const tip = [tipX, 0, 0]
  const ridge = [ridgeX, 0, ridgeZ]
  const keel = [keelX, 0, keelZ]
  const leftWing = [wingX, -wingHalfSpan, wingZ]
  const rightWing = [wingX, wingHalfSpan, wingZ]
  const notch = [notchX, 0, notchZ]

  // Face 1: Upper-left wing facets (lighter sky blue face)
  // 1. Top left main fold: tip -> ridge -> leftWing
  // 2. Rear left inner fold: ridge -> notch -> leftWing
  // 3. Underside left fold: tip -> leftWing -> keel
  const leftFaces = [
    ...tip, ...ridge, ...leftWing,
    ...ridge, ...notch, ...leftWing,
    ...tip, ...leftWing, ...keel,
  ]

  // Face 2: Upper-right wing facets & underside (deeper blue face)
  // 1. Top right main fold: tip -> rightWing -> ridge
  // 2. Rear right inner fold: ridge -> rightWing -> notch
  // 3. Underside right fold: tip -> keel -> rightWing
  const rightFaces = [
    ...tip, ...rightWing, ...ridge,
    ...ridge, ...rightWing, ...notch,
    ...tip, ...keel, ...rightWing,
  ]

  const positions = new Float32Array([...leftFaces, ...rightFaces])
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // Multi-material groups:
  // group 0 (material 0: lighter face): 9 vertices = 3 triangles
  geom.addGroup(0, 9, 0)
  // group 1 (material 1: deeper blue face): 9 vertices = 3 triangles
  geom.addGroup(9, 9, 1)

  geom.computeVertexNormals()
  return geom
}

/**
 * Creates the aerodynamic double-stripe trail geometry trailing behind the wings.
 */
function createTrailGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry()

  const startX = -10
  const endX = -38
  const halfW = 1.1
  const z = 1.2

  // Left stripe
  const l1 = [startX, -6 - halfW, z]
  const l2 = [startX, -6 + halfW, z]
  const l3 = [endX, -6 + halfW, z]
  const l4 = [endX, -6 - halfW, z]

  // Right stripe
  const r1 = [startX, 6 - halfW, z]
  const r2 = [startX, 6 + halfW, z]
  const r3 = [endX, 6 + halfW, z]
  const r4 = [endX, 6 - halfW, z]

  const positions = new Float32Array([
    // Left quad
    ...l1, ...l2, ...l3,
    ...l1, ...l3, ...l4,
    // Right quad
    ...r1, ...r2, ...r3,
    ...r1, ...r3, ...r4,
  ])

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geom.computeVertexNormals()
  return geom
}

/**
 * Reads website theme colors dynamically from CSS variables.
 * Falls back to reference palette (#5B8DEF, #6CCBF5) if theme is blue,
 * or derives matching shades if another theme color is configured.
 */
function getThemeColors(): { main: string; light: string; trail: string } {
  if (typeof window === 'undefined') {
    return { main: '#5B8DEF', light: '#6CCBF5', trail: '#9CE0FF' }
  }

  const rootStyles = getComputedStyle(document.documentElement)
  const primaryRaw =
    rootStyles.getPropertyValue('--color-blue').trim() ||
    rootStyles.getPropertyValue('--color-primary').trim() ||
    '#2547FF'

  const base = new THREE.Color(
    primaryRaw.startsWith('#') || primaryRaw.startsWith('rgb') ? primaryRaw : '#2547FF',
  )
  const hsl = { h: 0, s: 0, l: 0 }
  base.getHSL(hsl)

  // If site primary is a blue hue (hue in range ~0.55 to 0.72):
  // Preserve reference image palette: royal blue #5B8DEF and light sky blue #6CCBF5
  if (hsl.h >= 0.55 && hsl.h <= 0.72) {
    return {
      main: '#5B8DEF',
      light: '#6CCBF5',
      trail: '#9CE0FF',
    }
  }

  // Otherwise dynamically adapt to the active theme color
  const mainHex = '#' + base.getHexString()
  const lightColor = new THREE.Color().setHSL(
    hsl.h,
    Math.max(0.4, hsl.s * 0.85),
    Math.min(0.85, hsl.l + 0.28),
  )
  const trailColor = new THREE.Color().setHSL(
    hsl.h,
    Math.max(0.3, hsl.s * 0.7),
    0.85,
  )

  return {
    main: mainHex,
    light: '#' + lightColor.getHexString(),
    trail: '#' + trailColor.getHexString(),
  }
}

function normalizeAngle(angle: number): number {
  let a = angle
  while (a > Math.PI) a -= 2 * Math.PI
  while (a < -Math.PI) a += 2 * Math.PI
  return a
}

export const FlowArrow3D: React.FC<FlowArrow3DProps> = ({
  drawnPathRef,
  stageRef,
  progressRef,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prevAngleRef = useRef<number | null>(null)
  const isInitializedRef = useRef<boolean>(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Initialize Three.js scene
    const scene = new THREE.Scene()

    let width = stage.clientWidth || window.innerWidth
    let height = stage.clientHeight || window.innerHeight

    // Orthographic camera matching stage pixel dimensions:
    // (0,0) is top-left, (width, height) is bottom-right, +Z is towards camera
    const camera = new THREE.OrthographicCamera(0, width, 0, height, -1000, 1000)
    camera.position.set(0, 0, 500)
    camera.updateProjectionMatrix()

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height, false)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
    keyLight.position.set(-200, -300, 450)
    const fillLight = new THREE.DirectionalLight(0x7fbfff, 0.6)
    fillLight.position.set(300, 250, 200)

    scene.add(ambientLight, keyLight, fillLight)

    // Arrow and trail meshes
    const colors = getThemeColors()
    const arrowGeom = createArrowGeometry()
    const trailGeom = createTrailGeometry()

    const lightMaterial = new THREE.MeshStandardMaterial({
      color: colors.light,
      flatShading: true,
      roughness: 0.35,
      metalness: 0.1,
    })

    const deepMaterial = new THREE.MeshStandardMaterial({
      color: colors.main,
      flatShading: true,
      roughness: 0.35,
      metalness: 0.1,
    })

    const trailMaterial = new THREE.MeshBasicMaterial({
      color: colors.trail,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })

    const arrowMesh = new THREE.Mesh(arrowGeom, [lightMaterial, deepMaterial])
    const trailMesh = new THREE.Mesh(trailGeom, trailMaterial)

    const arrowGroup = new THREE.Group()
    arrowGroup.add(arrowMesh)
    arrowGroup.add(trailMesh)
    scene.add(arrowGroup)

    let animationFrameId: number
    const targetQuat = new THREE.Quaternion()

    const updateArrow = () => {
      const pathEl = drawnPathRef.current
      const stageEl = stageRef.current
      if (!pathEl || !stageEl) return

      // Read current progress clamped to [0, 1]
      let rawProgress = 0
      if (progressRef && typeof progressRef.current === 'number') {
        rawProgress = progressRef.current
      } else {
        const dataProgress = stageEl.getAttribute('data-progress')
        if (dataProgress !== null) {
          rawProgress = parseFloat(dataProgress)
        }
      }

      const p = Math.max(0, Math.min(1, isNaN(rawProgress) ? 0 : rawProgress))
      const pathLength = pathEl.getTotalLength ? pathEl.getTotalLength() : 3000
      const currentDist = p * pathLength

      // Position along SVG path
      const pt = pathEl.getPointAtLength(currentDist)

      // Tangent computation using forward/backward samples along curve
      const delta = Math.min(5, Math.max(1, pathLength * 0.003))
      const ptAhead = pathEl.getPointAtLength(Math.min(pathLength, currentDist + delta))
      const ptBehind = pathEl.getPointAtLength(Math.max(0, currentDist - delta))

      // Transform to stage pixel space
      const svg = pathEl.ownerSVGElement
      if (svg) {
        const ctm = pathEl.getScreenCTM()
        if (ctm) {
          const stageRect = stageEl.getBoundingClientRect()
          const pPoint = svg.createSVGPoint()

          pPoint.x = pt.x
          pPoint.y = pt.y
          const screenPt = pPoint.matrixTransform(ctm)

          pPoint.x = ptAhead.x
          pPoint.y = ptAhead.y
          const screenAhead = pPoint.matrixTransform(ctm)

          pPoint.x = ptBehind.x
          pPoint.y = ptBehind.y
          const screenBehind = pPoint.matrixTransform(ctm)

          const posX = screenPt.x - stageRect.left
          const posY = screenPt.y - stageRect.top

          const tx = screenAhead.x - screenBehind.x
          const ty = screenAhead.y - screenBehind.y
          const tangentLen = Math.hypot(tx, ty) || 1
          const normTx = tx / tangentLen
          const normTy = ty / tangentLen

          // Forward heading angle in 2D screen coordinates (+X right, +Y down)
          const headingAngle = Math.atan2(normTy, normTx)

          // 3D banking / roll into turns for realistic aerodynamics
          let rollAngle = 0
          if (prevAngleRef.current !== null && !isReducedMotion) {
            const deltaAngle = normalizeAngle(headingAngle - prevAngleRef.current)
            rollAngle = Math.max(-0.35, Math.min(0.35, deltaAngle * 10))
          }
          prevAngleRef.current = headingAngle

          // Construct target orientation quaternion
          targetQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), headingAngle)
          const rollQuat = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            rollAngle,
          )
          targetQuat.multiply(rollQuat)

          // Position exactly at the tip of the line
          arrowGroup.position.set(posX, posY, 0)

          // Orientation: instant on first frame, smoothed with slerp thereafter
          if (!isInitializedRef.current) {
            arrowGroup.quaternion.copy(targetQuat)
            isInitializedRef.current = true
          } else {
            arrowGroup.quaternion.slerp(targetQuat, 0.22)
          }
        }
      }

      renderer.render(scene, camera)
    }

    const renderLoop = () => {
      updateArrow()
      animationFrameId = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    const handleResize = () => {
      if (!stageRef.current) return
      width = stageRef.current.clientWidth || window.innerWidth
      height = stageRef.current.clientHeight || window.innerHeight

      camera.right = width
      camera.bottom = height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    }

    window.addEventListener('resize', handleResize)

    // Cleanup and disposal on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)

      arrowGeom.dispose()
      trailGeom.dispose()
      lightMaterial.dispose()
      deepMaterial.dispose()
      trailMaterial.dispose()
      renderer.dispose()
    }
  }, [drawnPathRef, stageRef, progressRef])

  return (
    <canvas
      ref={canvasRef}
      className={`flow-arrow-canvas absolute inset-0 pointer-events-none z-10 w-full h-full select-none ${className}`}
      aria-hidden="true"
    />
  )
}

export default FlowArrow3D

