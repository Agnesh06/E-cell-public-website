import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { COLOR_TOKENS } from '@/lib/constants';
import {
  hexToVec3,
  readCssColorToken,
  selectRendererQuality,
  type ColorVector,
  type RendererQuality,
} from './lineWavesHelpers';

// Adapted from React Bits LineWaves by David H. Dev.
export type LineWavesMode = 'animated' | 'static' | 'fallback';

interface LineWavesProps {
  speed?: number;
  innerLineCount?: number;
  outerLineCount?: number;
  warpIntensity?: number;
  rotation?: number;
  edgeFadeWidth?: number;
  colorCycleSpeed?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  baseColorTop?: string;
  baseColorBottom?: string;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
  lightMode?: boolean;
  reducedMotion?: boolean;
  className?: string;
  onModeChange?: (mode: LineWavesMode) => void;
}

interface UniformValue<T> {
  value: T;
}

interface LineWavesUniforms {
  uTime: UniformValue<number>;
  uResolution: UniformValue<[number, number, number]>;
  uSpeed: UniformValue<number>;
  uInnerLines: UniformValue<number>;
  uOuterLines: UniformValue<number>;
  uWarpIntensity: UniformValue<number>;
  uRotation: UniformValue<number>;
  uEdgeFadeWidth: UniformValue<number>;
  uColorCycleSpeed: UniformValue<number>;
  uBrightness: UniformValue<number>;
  uColor1: UniformValue<ColorVector>;
  uColor2: UniformValue<ColorVector>;
  uColor3: UniformValue<ColorVector>;
  uBaseTop: UniformValue<ColorVector>;
  uBaseBottom: UniformValue<ColorVector>;
  uMouse: UniformValue<Float32Array>;
  uMouseInfluence: UniformValue<number>;
  uEnableMouse: UniformValue<boolean>;
  uLightMode: UniformValue<number>;
}

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarpIntensity;
uniform float uRotation;
uniform float uEdgeFadeWidth;
uniform float uColorCycleSpeed;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBaseTop;
uniform vec3 uBaseBottom;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;
uniform float uLightMode;

#define HALF_PI 1.5707963

float hashF(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

float displaceA(float coord, float t) {
  float result = sin(coord * 2.123) * 0.2;
  result += sin(coord * 3.234 + t * 4.345) * 0.1;
  result += sin(coord * 0.589 + t * 0.934) * 0.5;
  return result;
}

float displaceB(float coord, float t) {
  float result = sin(coord * 1.345) * 0.3;
  result += sin(coord * 2.734 + t * 3.345) * 0.2;
  result += sin(coord * 0.189 + t * 0.934) * 0.3;
  return result;
}

vec2 rotate2D(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution.xy;
  coords = coords * 2.0 - 1.0;
  coords = rotate2D(coords, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;

  float mouseWarp = 0.0;
  if (uEnableMouse) {
    vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
    float mDist = length(coords - mPos);
    mouseWarp = uMouseInfluence * exp(-mDist * mDist * 4.0);
  }

  float warpAx = coords.x + displaceA(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpAy = coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity;
  float warpBx = coords.x + displaceB(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpBy = coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity;

  vec2 fieldA = vec2(warpAx, warpAy);
  vec2 fieldB = vec2(warpBx, warpBy);
  vec2 blended = mix(fieldA, fieldB, mix(fieldA, fieldB, 0.5));

  float fadeTop = smoothstep(uEdgeFadeWidth, uEdgeFadeWidth + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
  float vMask = 1.0 - max(fadeTop, fadeBottom);

  float tileCount = mix(uOuterLines, uInnerLines, vMask);
  float scaledY = blended.y * tileCount;
  float nY = smoothNoise(abs(scaledY));

  float ridge = pow(
    step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)),
    5.0
  );

  float lines = 0.0;
  for (float i = 1.0; i < 3.0; i += 1.0) {
    lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
  }

  float pattern = vMask * lines;

  float cycleT = fullT * uColorCycleSpeed;
  float rChannel = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
  float gChannel = (pattern + vMask * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
  float bChannel = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

  vec3 col = (rChannel * uColor1 + gChannel * uColor2 + bChannel * uColor3) * uBrightness;
  float alpha = clamp(length(col), 0.0, 1.0);

  if (uLightMode > 0.5) {
    vec3 weights = pow(max(vec3(rChannel, gChannel, bChannel), vec3(0.0)), vec3(3.0));
    float weightSum = max(weights.r + weights.g + weights.b, 0.0001);
    vec3 chroma = (weights.r * uColor1 + weights.g * uColor2 + weights.b * uColor3) / weightSum;
    float neutral = min(chroma.r, min(chroma.g, chroma.b));
    chroma = max(chroma - vec3(neutral * 0.92), vec3(0.0));
    float peak = max(chroma.r, max(chroma.g, chroma.b));
    chroma = pow(clamp(chroma / max(peak, 0.0001), 0.0, 1.0), vec3(1.08));
    float ink = clamp(max(rChannel, max(gChannel, bChannel)) * uBrightness * 1.15, 0.0, 0.92);
    gl_FragColor = vec4(mix(mix(uBaseBottom, uBaseTop, gl_FragCoord.y / uResolution.y), chroma, ink), 1.0);
  } else {
    gl_FragColor = vec4(col, alpha);
  }
}
`;

export default function LineWaves({
  speed = 0.3,
  innerLineCount = 32,
  outerLineCount = 36,
  warpIntensity = 1,
  rotation = -45,
  edgeFadeWidth = 0,
  colorCycleSpeed = 1,
  brightness = 0.2,
  color1 = COLOR_TOKENS.lineWaves.lineBlue1,
  color2 = COLOR_TOKENS.lineWaves.lineBlue2,
  color3 = COLOR_TOKENS.lineWaves.lineBlue3,
  baseColorTop = COLOR_TOKENS.lineWaves.bgTop,
  baseColorBottom = COLOR_TOKENS.lineWaves.bgBottom,
  enableMouseInteraction = true,
  mouseInfluence = 2,
  lightMode = false,
  reducedMotion = false,
  className = 'h-full w-full',
  onModeChange,
}: LineWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const programRef = useRef<Program | null>(null);
  const uniformsRef = useRef<LineWavesUniforms | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const geometryRef = useRef<Triangle | null>(null);
  const frameRef = useRef<number | null>(null);
  const renderRequestRef = useRef<(() => void) | null>(null);
  const modeRef = useRef<LineWavesMode>('fallback');
  const onModeChangeRef = useRef(onModeChange);
  const reducedMotionRef = useRef(reducedMotion);
  const mouseEnabledRef = useRef(enableMouseInteraction);
  const mouseRef = useRef({ currentX: 0.5, currentY: 0.5, targetX: 0.5, targetY: 0.5 });

  onModeChangeRef.current = onModeChange;
  reducedMotionRef.current = reducedMotion;
  mouseEnabledRef.current = enableMouseInteraction;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let program: Program | null = null;
    let geometry: Triangle | null = null;
    let mesh: Mesh | null = null;
    let gl: Renderer['gl'] | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let destroyed = false;
    let contextLost = false;
    let inView = true;
    let documentVisible = !document.hidden;

    const setMode = (mode: LineWavesMode) => {
      if (destroyed || modeRef.current === mode) return;
      modeRef.current = mode;
      container.dataset.mode = mode;
      onModeChangeRef.current?.(mode);
    };

    const stopLoop = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const drawFrame = (time: number) => {
      if (destroyed || contextLost || !renderer || !mesh) return;
      const uniforms = uniformsRef.current;
      if (!uniforms) return;

      uniforms.uTime.value = reducedMotionRef.current ? 0 : time * 0.001;
      if (mouseEnabledRef.current) {
        const pointer = mouseRef.current;
        pointer.currentX += 0.05 * (pointer.targetX - pointer.currentX);
        pointer.currentY += 0.05 * (pointer.targetY - pointer.currentY);
        uniforms.uMouse.value[0] = pointer.currentX;
        uniforms.uMouse.value[1] = pointer.currentY;
      } else {
        uniforms.uMouse.value[0] = 0.5;
        uniforms.uMouse.value[1] = 0.5;
      }

      try {
        renderer.render({ scene: mesh });
      } catch {
        contextLost = true;
        stopLoop();
        setMode('fallback');
      }
    };

    const canAnimate = () =>
      !destroyed &&
      !contextLost &&
      !reducedMotionRef.current &&
      inView &&
      documentVisible;

    const animate = (time: number) => {
      frameRef.current = null;
      if (!canAnimate()) return;
      drawFrame(time);
      if (canAnimate()) frameRef.current = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (canAnimate() && frameRef.current === null) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    const renderSingleFrame = () => {
      if (destroyed || contextLost || !renderer || !mesh) return;
      stopLoop();
      frameRef.current = requestAnimationFrame((time) => {
        frameRef.current = null;
        drawFrame(time);
      });
    };

    const updateActivity = () => {
      if (contextLost || !renderer) return;
      if (reducedMotionRef.current) {
        setMode('static');
        renderSingleFrame();
      } else if (canAnimate()) {
        setMode('animated');
        startLoop();
      } else {
        renderSingleFrame();
      }
    };

    const updateActivityRef = () => updateActivity();
    renderRequestRef.current = updateActivityRef;

    const cleanup = () => {
      if (destroyed) return;
      destroyed = true;
      stopLoop();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resize);
      canvasRef.current?.removeEventListener('webglcontextlost', handleContextLost);
      if (canvasRef.current) {
        if (canvasRef.current.parentElement === container) container.removeChild(canvasRef.current);
      }
      program?.remove();
      geometry?.remove();
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      rendererRef.current = null;
      programRef.current = null;
      uniformsRef.current = null;
      meshRef.current = null;
      geometryRef.current = null;
      canvasRef.current = null;
      renderRequestRef.current = null;
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stopLoop();
      setMode('fallback');
    };

    const handleVisibilityChange = () => {
      documentVisible = !document.hidden;
      if (documentVisible) updateActivity();
      else stopLoop();
    };

    const resize = () => {
      if (!renderer || !gl || contextLost) return;
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      const quality: RendererQuality = selectRendererQuality({
        viewportWidth: window.innerWidth,
        devicePixelRatio: window.devicePixelRatio || 1,
        hasCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
        hardwareConcurrency: navigator.hardwareConcurrency,
      });
      renderer.dpr = quality.dpr;
      renderer.setSize(width, height);
      if (uniformsRef.current) {
        uniformsRef.current.uResolution.value = [
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ];
      }
      updateActivity();
    };

    try {
      const quality = selectRendererQuality({
        viewportWidth: window.innerWidth,
        devicePixelRatio: window.devicePixelRatio || 1,
        hasCoarsePointer: window.matchMedia('(pointer: coarse)').matches,
        hardwareConcurrency: navigator.hardwareConcurrency,
      });
      renderer = new Renderer({
        alpha: true,
        dpr: quality.dpr,
        premultipliedAlpha: false,
        powerPreference: 'high-performance',
      });
      rendererRef.current = renderer;
      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);

      const topToken = readCssColorToken(container, '--line-waves-bg-top', baseColorTop);
      const bottomToken = readCssColorToken(container, '--line-waves-bg-bottom', baseColorBottom);
      geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: [1, 1, 1] },
          uSpeed: { value: speed },
          uInnerLines: { value: innerLineCount },
          uOuterLines: { value: outerLineCount },
          uWarpIntensity: { value: warpIntensity },
          uRotation: { value: (rotation * Math.PI) / 180 },
          uEdgeFadeWidth: { value: edgeFadeWidth },
          uColorCycleSpeed: { value: colorCycleSpeed },
          uBrightness: { value: brightness },
          uColor1: { value: hexToVec3(color1) },
          uColor2: { value: hexToVec3(color2) },
          uColor3: { value: hexToVec3(color3) },
          uBaseTop: { value: hexToVec3(topToken) },
          uBaseBottom: { value: hexToVec3(bottomToken) },
          uMouse: { value: new Float32Array([0.5, 0.5]) },
          uMouseInfluence: { value: mouseInfluence },
          uEnableMouse: { value: enableMouseInteraction },
          uLightMode: { value: lightMode ? 1 : 0 },
        },
      });
      programRef.current = program;
      uniformsRef.current = program.uniforms as LineWavesUniforms;
      mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;
      geometryRef.current = geometry;
      canvasRef.current = gl.canvas;
      gl.canvas.style.display = 'block';
      gl.canvas.style.height = '100%';
      gl.canvas.style.width = '100%';
      container.appendChild(gl.canvas);
      gl.canvas.addEventListener('webglcontextlost', handleContextLost);

      document.addEventListener('visibilitychange', handleVisibilityChange);
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);
      } else {
        window.addEventListener('resize', resize);
      }
      if (typeof IntersectionObserver !== 'undefined') {
        intersectionObserver = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          if (inView) updateActivity();
          else stopLoop();
        });
        intersectionObserver.observe(container);
      }

      resize();
      updateActivity();
    } catch {
      cleanup();
      modeRef.current = 'fallback';
      container.dataset.mode = 'fallback';
      onModeChangeRef.current?.('fallback');
    }

    return cleanup;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const program = programRef.current;
    const uniforms = uniformsRef.current;
    if (!container || !program || !uniforms) return;

    const topToken = readCssColorToken(container, '--line-waves-bg-top', baseColorTop);
    const bottomToken = readCssColorToken(container, '--line-waves-bg-bottom', baseColorBottom);
    uniforms.uSpeed.value = speed;
    uniforms.uInnerLines.value = innerLineCount;
    uniforms.uOuterLines.value = outerLineCount;
    uniforms.uWarpIntensity.value = warpIntensity;
    uniforms.uRotation.value = (rotation * Math.PI) / 180;
    uniforms.uEdgeFadeWidth.value = edgeFadeWidth;
    uniforms.uColorCycleSpeed.value = colorCycleSpeed;
    uniforms.uBrightness.value = brightness;
    uniforms.uColor1.value = hexToVec3(color1);
    uniforms.uColor2.value = hexToVec3(color2);
    uniforms.uColor3.value = hexToVec3(color3);
    uniforms.uBaseTop.value = hexToVec3(topToken);
    uniforms.uBaseBottom.value = hexToVec3(bottomToken);
    uniforms.uMouseInfluence.value = mouseInfluence;
    uniforms.uEnableMouse.value = enableMouseInteraction;
    uniforms.uLightMode.value = lightMode ? 1 : 0;
    renderRequestRef.current?.();
  }, [
    baseColorBottom,
    baseColorTop,
    brightness,
    color1,
    color2,
    color3,
    colorCycleSpeed,
    edgeFadeWidth,
    enableMouseInteraction,
    innerLineCount,
    lightMode,
    mouseInfluence,
    outerLineCount,
    reducedMotion,
    rotation,
    speed,
    warpIntensity,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !enableMouseInteraction) return;
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouseRef.current.targetX = (event.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = 1 - (event.clientY - rect.top) / rect.height;
    };
    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0.5;
      mouseRef.current.targetY = 0.5;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableMouseInteraction]);

  return <div ref={containerRef} className={className} data-mode="fallback" />;
}
