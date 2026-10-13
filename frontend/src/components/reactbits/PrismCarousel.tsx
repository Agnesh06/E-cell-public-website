'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export interface PrismCarouselItem {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  href?: string;
}

export interface PrismCarouselRef {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
}

export interface PrismCarouselProps {
  items?: PrismCarouselItem[];
  startIndex?: number;
  aspect?: number;
  size?: number;
  neighborScale?: number;
  gap?: number;
  radius?: number;
  saturation?: number;
  dim?: number;
  sweep?: number;
  sweepDuration?: number;
  dispersion?: number;
  autoplay?: boolean;
  interval?: number;
  loop?: boolean;
  captions?: boolean;
  controls?: boolean;
  draggable?: boolean;
  wheel?: boolean;
  pauseOnHover?: boolean;
  backgroundColor?: string;
  paused?: boolean;
  dpr?: number;
  ariaLabel?: string;
  onIndexChange?: (index: number) => void;
  onSelect?: (item: PrismCarouselItem, index: number) => void;
  className?: string;
  style?: CSSProperties;
}

export const DEFAULT_PRISM_ITEMS: PrismCarouselItem[] = [
  {
    src: 'https://pro.reactbits.dev/demo-media/abstract-rose-balance.webp',
    alt: 'Tilted raspberry rounded rectangle and tangerine disc on a rose-pink field',
    title: 'Rose balance',
    subtitle: 'A bright point of balance',
  },
  {
    src: 'https://pro.reactbits.dev/demo-media/abstract-pink-eclipse.webp',
    alt: 'Coral-pink disc crossing a violet diagonal plane on a grainy purple field',
    title: 'Pink eclipse',
    subtitle: 'A disc across the diagonal',
  },
  {
    src: 'https://pro.reactbits.dev/demo-media/abstract-amber-loop.webp',
    alt: 'Tilted golden-amber loop on a grainy raspberry-purple field',
    title: 'Amber loop',
    subtitle: 'Warmth around an open center',
  },
  {
    src: 'https://pro.reactbits.dev/demo-media/abstract-coral-fold.webp',
    alt: 'Broad vermilion and orange folded plane over deep plum with fine grain',
    title: 'Coral fold',
    subtitle: 'A bold change of direction',
  },
  {
    src: 'https://pro.reactbits.dev/demo-media/abstract-fuchsia-wave.webp',
    alt: 'Broad fuchsia S-shaped band with a coral gradient across deep plum',
    title: 'Fuchsia wave',
    subtitle: 'One continuous curve',
  },
  {
    src: 'https://pro.reactbits.dev/demo-media/abstract-orchid-orbit.webp',
    alt: 'Fuchsia ring and peach crescent on a grainy orchid-purple field',
    title: 'Orchid orbit',
    subtitle: 'Color in orbit',
  },
  {
    src: 'https://pro.reactbits.dev/demo-media/abstract-plum-ribbon.webp',
    alt: 'Intersecting pink and plum diagonal ribbons on a coral-magenta field',
    title: 'Plum ribbon',
    subtitle: 'Two ribbons, one crossing',
  },
  {
    src: 'https://pro.reactbits.dev/demo-media/abstract-violet-steps.webp',
    alt: 'Three interlocking violet and pink stepped planes with an amber edge',
    title: 'Violet steps',
    subtitle: 'Three planes in rhythm',
  },
];

export const PRISM_PRESETS = {
  prism: { aspect: 1.5, size: 0.62, neighborScale: 0.66, saturation: 0, dim: 0.2, sweep: 1, sweepDuration: 1.1, dispersion: 1 },
  vivid: { aspect: 1.5, size: 0.62, neighborScale: 0.66, saturation: 1, dim: 0.15, sweep: 0.7, sweepDuration: 1, dispersion: 1 },
  cinema: { aspect: 2.1, size: 0.56, neighborScale: 0.7, saturation: 0, dim: 0.35, sweep: 1, sweepDuration: 1.3, dispersion: 0.8 },
  portrait: { aspect: 0.75, size: 0.74, neighborScale: 0.74, saturation: 0, dim: 0.2, sweep: 1, sweepDuration: 1.1, dispersion: 1 },
  quiet: { aspect: 1.5, size: 0.62, neighborScale: 0.66, saturation: 0.25, dim: 0.25, sweep: 0, sweepDuration: 1.1, dispersion: 0 },
  spectrum: { aspect: 1.5, size: 0.62, neighborScale: 0.66, saturation: 0, dim: 0.2, sweep: 1.7, sweepDuration: 1.5, dispersion: 2 },
};

const TWO_PI = 2 * Math.PI;

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

const smoothstep = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

const bend = (x: number) => {
  if (x >= 1) return 0.5;
  if (x <= -1) return -0.5;
  return x - (x * Math.abs(x)) / 2;
};

const pulse = (x: number) => (bend(x + 0.35) - bend(x - 0.35)) / 0.7;

const subscribeReducedMotion = (cb: () => void) => {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const spring = (pos: number, vel: number, target: number, dt: number, period: number, damping = 1): [number, number] => {
  const omega = TWO_PI / Math.max(period, 0.02);
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const subDt = dt / steps;
  let v = vel;
  let p = pos;
  for (let i = 0; i < steps; i++) {
    v += (omega * omega * (target - p) - 2 * damping * omega * v) * subDt;
    p += v * subDt;
  }
  return [p, v];
};

const srOnlyStyle: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const touchOverlayStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  touchAction: 'pan-y',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
};

const controlBtnBg = 'color-mix(in oklch, currentColor 10%, transparent)';
const controlBtnHoverBg = 'color-mix(in oklch, currentColor 17%, transparent)';

const controlBtnStyle: CSSProperties = {
  width: 32,
  height: 32,
  display: 'grid',
  placeItems: 'center',
  padding: 0,
  borderRadius: 999,
  border: 0,
  background: controlBtnBg,
  color: 'inherit',
  cursor: 'pointer',
  transition: 'background-color 160ms ease',
};

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform sampler2D uImage;
uniform float uImageAspect;
uniform vec2 uSize;
uniform float uRadius;
uniform float uLoaded;
uniform float uBase;
uniform float uReveal;
uniform float uDirection;
uniform float uBand;
uniform float uSweep;
uniform float uSpreadPx;
uniform float uBright;
uniform float uAlpha;
varying vec2 vUv;

float roundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 spectrum(float t) {
  return clamp(0.5 + 0.5 * cos(6.2831853 * (t + vec3(0.0, 0.33, 0.67))), 0.0, 1.0);
}

vec3 sampleImage(vec2 uv) {
  float spread = uSpreadPx / max(uSize.x, uSize.y * uImageAspect);
  if (abs(spread) < 0.0004) return texture2D(uImage, uv).rgb;
  float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  vec3 total = vec3(0.0);
  vec3 weights = vec3(0.0);
  for (int k = 0; k < 9; k++) {
    float t = (float(k) + jitter) / 9.0;
    vec3 w = spectrum(t * 0.82);
    total += texture2D(uImage, uv + vec2((t - 0.5) * spread, 0.0)).rgb * w;
    weights += w;
  }
  return total / weights;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float d = roundBox(p, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float aa = max(fwidth(d), 1e-3) * 0.75;
  float mask = 1.0 - smoothstep(-aa, aa, d);
  if (mask * uAlpha < 0.002) discard;

  float cardAspect = uSize.x / max(uSize.y, 1.0);
  vec2 uv = vUv - 0.5;
  if (cardAspect > uImageAspect) {
    uv.y *= uImageAspect / cardAspect;
  } else {
    uv.x *= cardAspect / uImageAspect;
  }
  uv += 0.5;

  vec3 full = sampleImage(uv);
  float luma = dot(full, vec3(0.2126, 0.7152, 0.0722));
  vec3 gray = vec3(luma);

  float along = uDirection > 0.0 ? vUv.x : 1.0 - vUv.x;
  float front = uReveal;
  float behind = uReveal < -0.5 ? 0.0 : 1.0 - smoothstep(front - uBand, front, along);
  float amount = max(uBase, behind);
  vec3 color = mix(gray, full, amount);
  if (uReveal > -0.5) {
    float mid = front - uBand * 0.5;
    float bandShape = exp(-pow((along - mid) / (uBand * 0.42), 2.0));
    vec3 light = spectrum(clamp((along - front + uBand) / uBand, 0.0, 1.0) * 0.82);
    color += light * bandShape * uSweep * 0.28 * (1.0 - uBase);
  }
  color *= uBright;

  vec3 placeholder = vec3(0.5);
  float loaded = clamp(uLoaded, 0.0, 1.0);
  vec3 rgb = mix(placeholder, color, loaded);
  float alpha = mask * uAlpha * mix(0.12, 1.0, loaded);
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

export const PrismCarousel = forwardRef<PrismCarouselRef, PrismCarouselProps>(function PrismCarousel(
  {
    items = DEFAULT_PRISM_ITEMS,
    startIndex = 0,
    aspect = 1.5,
    size = 0.62,
    neighborScale = 0.66,
    gap = 14,
    radius = 18,
    saturation = 0,
    dim = 0.2,
    sweep = 1,
    sweepDuration = 1.1,
    dispersion = 1,
    autoplay = true,
    interval = 4.5,
    loop = true,
    captions = true,
    controls = true,
    draggable = true,
    wheel = true,
    pauseOnHover = true,
    backgroundColor = 'transparent',
    paused = false,
    dpr = 2,
    ariaLabel = 'Prism carousel. Scroll, drag or use the arrow keys to move between images.',
    onIndexChange,
    onSelect,
    className,
    style,
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<{
    sync: () => void;
    step: (dir: number) => void;
    goTo: (idx: number) => void;
    destroy: () => void;
  } | null>(null);

  const isReduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  const effectiveItems = items.length ? items : DEFAULT_PRISM_ITEMS;
  const itemsRef = useRef(effectiveItems);

  const [initialIndex] = useState(() => clamp(Math.round(startIndex), 0, Math.max(effectiveItems.length - 1, 0)));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isFallback, setIsFallback] = useState(false);

  const propsSnapshot = {
    items: effectiveItems,
    aspect,
    size,
    neighborScale,
    gap,
    radius,
    saturation,
    dim,
    sweep,
    sweepDuration,
    dispersion,
    autoplay,
    interval,
    loop,
    captions,
    controls,
    draggable,
    wheel,
    pauseOnHover,
    backgroundColor,
    paused,
    dpr,
    reduced: isReduced,
  };

  const propsRef = useRef(propsSnapshot);
  const callbacksRef = useRef({ onIndexChange, onSelect });

  useEffect(() => {
    propsRef.current = propsSnapshot;
    itemsRef.current = effectiveItems;
    callbacksRef.current = { onIndexChange, onSelect };
    controllerRef.current?.sync();
  });

  useEffect(() => {
    const rootEl = rootRef.current;
    const canvasContainerEl = canvasContainerRef.current;
    if (!rootEl || !canvasContainerEl) return;

    const setup = (
      root: HTMLDivElement,
      container: HTMLDivElement,
      latestProps: typeof propsRef,
      latestItems: typeof itemsRef,
      startIndexVal: number,
      callbacks: {
        onActive: (idx: number) => void;
        onSelect: (idx: number) => void;
      },
    ) => {
      let renderer: THREE.WebGLRenderer;
      const canvas = root.ownerDocument.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: false,
          premultipliedAlpha: true,
          powerPreference: 'high-performance',
        });
      } catch {
        return null;
      }
      container.appendChild(canvas);
      renderer.setClearColor(0, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
      const geom = new THREE.PlaneGeometry(1, 1);
      const placeholderTex = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1);
      placeholderTex.needsUpdate = true;

      const meshes = Array.from({ length: 11 }, () => {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uImage: { value: placeholderTex },
            uImageAspect: { value: 1.5 },
            uSize: { value: new THREE.Vector2(1, 1) },
            uRadius: { value: 16 },
            uLoaded: { value: 0 },
            uBase: { value: 0 },
            uReveal: { value: -1 },
            uDirection: { value: 1 },
            uBand: { value: 0.24 },
            uSweep: { value: 1 },
            uSpreadPx: { value: 0 },
            uBright: { value: 1 },
            uAlpha: { value: 1 },
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          transparent: true,
          premultipliedAlpha: true,
          depthTest: false,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.frustumCulled = false;
        mesh.visible = false;
        scene.add(mesh);
        return {
          mesh,
          index: 0,
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          visible: false,
        };
      });

      let textures: {
        image: HTMLImageElement;
        texture: THREE.Texture;
        aspect: number;
        ready: boolean;
        fade: number;
      }[] = [];
      let prevSrcKey = '';

      let containerW = 1;
      let containerH = 1;
      let pixelRatio = 1;

      let posCurrent = startIndexVal;
      let velCurrent = 0;
      let posTarget = startIndexVal;
      let isDragging = false;
      let isWheeling = false;
      let wheelLastTime = 0;
      let activeRoundIdx = Math.round(startIndexVal);
      let reportedActiveIdx = NaN;
      let sweepTargetIdx = activeRoundIdx;
      let sweepStartTime = -10;
      let sweepDir = 1;
      let activeHoverCard: number | null = null;
      let isHovered = false;
      let animTime = 0;
      let autoplayElapsed = 0;
      let rafId = 0;
      let autoplayTimer = 0;
      let lastRenderTime = 0;
      let isIntersecting = false;
      let isDestroyed = false;
      let isContextLost = false;
      let suppressClick = false;

      const cardStates = new Map<number, { value: number; velocity: number }>();
      const cardPositions = new Float64Array(12);
      const cardWidths = new Float64Array(12);
      let stepDistance = 1;
      let activeCardH = 1;
      let neighborCardH = 1;
      let spacingKey = '';
      let lastSampleTime = 0;
      let pointerState: {
        id: number;
        x: number;
        lastX: number;
        moved: boolean;
        samples: { t: number; d: number }[];
      } | null = null;

      const itemCount = () => Math.max(latestItems.current.length, 1);
      const wrapIndex = (idx: number) => ((idx % itemCount()) + itemCount()) % itemCount();

      const loadTextures = () => {
        const currentItems = latestItems.current;
        const srcKey = currentItems.map((item) => item.src).join('\0');
        if (srcKey === prevSrcKey) return;
        prevSrcKey = srcKey;
        textures.forEach((entry) => {
          entry.image.onload = null;
          entry.texture.dispose();
        });
        textures = currentItems.map((item) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.decoding = 'async';
          const tex = new THREE.Texture(img);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          const entry = {
            image: img,
            texture: tex,
            aspect: 1.5,
            ready: false,
            fade: 0,
          };
          img.onload = () => {
            if (isDestroyed) return;
            entry.aspect = img.naturalWidth / Math.max(img.naturalHeight, 1);
            entry.ready = true;
            tex.needsUpdate = true;
            requestRender();
          };
          img.src = item.src;
          return entry;
        });
      };

      const updateSize = () => {
        const props = latestProps.current;
        const rect = root.getBoundingClientRect();
        const dprVal = Math.min(window.devicePixelRatio || 1, Math.max(props.dpr, 0.5));
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));
        if (w !== containerW || h !== containerH || dprVal !== pixelRatio) {
          containerW = w;
          containerH = h;
          pixelRatio = dprVal;
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(containerW, containerH, false);
          camera.left = -containerW / 2;
          camera.right = containerW / 2;
          camera.top = containerH / 2;
          camera.bottom = -containerH / 2;
          camera.updateProjectionMatrix();
          return true;
        }
        return false;
      };

      const computeLayout = () => {
        const props = latestProps.current;
        const asp = clamp(props.aspect, 0.5, 3);
        const bottomSpace = 46 * (props.captions ? 1 : 0) + 46 * (props.controls ? 1 : 0);
        const availH = Math.max(containerH - bottomSpace, 0.5 * containerH);
        const widthFactor = 0.62 + 0.22 * smoothstep((900 - containerW) / 500);
        const activeH = Math.min(availH * clamp(props.size, 0.2, 0.98), (containerW * widthFactor) / asp);
        const neighborH = activeH * clamp(props.neighborScale, 0.3, 1);
        return {
          activeH,
          neighborH,
          widths: [activeH * asp, 0.72 * neighborH, 0.24 * neighborH, 0.08 * neighborH, 0],
          gap: Math.max(props.gap, 0),
          lift: (containerH - availH) / 2,
        };
      };

      const solveSpacing = () => {
        const layout = computeLayout();
        const activeH = layout.activeH;
        const neighborH = layout.neighborH;
        const widths = layout.widths;
        const gap = layout.gap;
        activeCardH = activeH;
        neighborCardH = neighborH;
        const key = `${activeH}|${neighborH}|${widths.join(',')}|${gap}`;
        if (key !== spacingKey) {
          spacingKey = key;
          for (let i = 0; i <= 11; i++) cardWidths[i] = widths[i] ?? 0;
          for (let iter = 0; iter < 60; iter++) {
            for (let i = 0; i <= 10; i++) {
              const targetW = widths[i] ?? 0;
              const prev = i === 0 ? cardWidths[1] : cardWidths[i - 1];
              cardWidths[i] = Math.max(0, (targetW - 0.0875 * (prev + cardWidths[i + 1])) / 0.825);
            }
          }
          cardWidths[11] = 0;
          cardPositions[0] = 0;
          for (let i = 1; i <= 11; i++) {
            cardPositions[i] = cardPositions[i - 1] + (cardWidths[i - 1] + cardWidths[i]) / 2 + gap;
          }
          stepDistance = cardPositions[1];
        }
      };

      const interpolate = (arr: Float64Array, offset: number, signed: boolean) => {
        let sum = 0;
        const start = Math.ceil(offset - 1 - 0.35);
        const end = Math.floor(offset + 1 + 0.35);
        for (let idx = start; idx <= end; idx++) {
          const w = pulse(offset - idx);
          if (w <= 0) continue;
          const val = arr[Math.min(Math.abs(idx), 11)];
          sum += w * (signed && idx < 0 ? -val : val);
        }
        return sum;
      };

      const getCardTransform = (offset: number) => {
        const smooth = smoothstep(Math.abs(offset));
        return {
          x: interpolate(cardPositions, offset, true),
          w: Math.max(interpolate(cardWidths, offset, false), 0),
          h: activeCardH + (neighborCardH - activeCardH) * smooth,
        };
      };

      const getStepDistance = () => {
        solveSpacing();
        return stepDistance;
      };

      const clampTarget = (idx: number) => (latestProps.current.loop ? idx : clamp(idx, 0, itemCount() - 1));

      const step = (dir: number) => {
        posTarget = clampTarget(Math.round(posTarget) + dir);
        autoplayElapsed = 0;
        requestRender();
      };

      const requestRender = () => {
        if (isDestroyed || isContextLost || !isIntersecting || rafId) return;
        if (autoplayTimer) {
          window.clearTimeout(autoplayTimer);
          autoplayTimer = 0;
        }
        rafId = requestAnimationFrame(render);
      };

      const getCardState = (idx: number) => {
        let state = cardStates.get(idx);
        if (!state) {
          state = { value: latestProps.current.saturation, velocity: 0 };
          cardStates.set(idx, state);
        }
        return state;
      };

      function render(timestamp: number) {
        rafId = 0;
        if (isDestroyed || isContextLost) return;
        const props = latestProps.current;
        const dt = lastRenderTime ? Math.min(Math.max((timestamp - lastRenderTime) / 1000, 0), 0.05) : 1 / 60;
        lastRenderTime = timestamp;
        animTime += dt;

        const reduced = props.reduced;
        let needsNextFrame = false;
        const hoverPaused = props.pauseOnHover && isHovered;

        if (props.autoplay && !props.paused && !reduced && !hoverPaused && !pointerState && itemCount() > 1) {
          autoplayElapsed += dt;
          if (autoplayElapsed >= Math.max(props.interval, 1)) {
            autoplayElapsed = 0;
            posTarget =
              !props.loop && Math.round(posTarget) >= itemCount() - 1 ? 0 : clampTarget(Math.round(posTarget) + 1);
          }
        }

        if (isWheeling && !pointerState && timestamp - wheelLastTime > 140) {
          isWheeling = false;
          posTarget = clampTarget(Math.round(posTarget));
        }

        if (isDragging) {
          velCurrent *= Math.exp(-6 * dt);
          needsNextFrame = true;
        } else {
          [posCurrent, velCurrent] = spring(posCurrent, velCurrent, posTarget, dt, reduced ? 0.05 : 0.62, 0.92);
          if (Math.abs(posCurrent - posTarget) < 1e-4 && Math.abs(velCurrent) < 1e-4) {
            posCurrent = posTarget;
            velCurrent = 0;
          } else {
            needsNextFrame = true;
          }
        }

        const roundPos = Math.round(posCurrent);
        if (roundPos !== activeRoundIdx) {
          sweepDir = roundPos > activeRoundIdx ? 1 : -1;
          const oldState = getCardState(activeRoundIdx);
          const tSweep = clamp((animTime - sweepStartTime) / Math.max(props.sweepDuration, 0.1), 0, 1);
          oldState.value = Math.max(oldState.value, tSweep);
          sweepTargetIdx = activeRoundIdx = roundPos;
          sweepStartTime = animTime;
        }

        const activeIdxWrapped = wrapIndex(activeRoundIdx);
        if (activeIdxWrapped !== reportedActiveIdx) {
          reportedActiveIdx = activeIdxWrapped;
          callbacks.onActive(activeIdxWrapped);
        }

        const { activeH, lift } = computeLayout();
        solveSpacing();

        const centerIdx = Math.round(posCurrent);
        const sweepDurationSafe = Math.max(props.sweepDuration, 0.1);
        const sweepProgress = reduced ? 2 : (animTime - sweepStartTime) / sweepDurationSafe;
        if (sweepProgress < 1.4) needsNextFrame = true;

        const velPx = Math.abs(velCurrent) * getStepDistance();
        const dispersionPx = reduced
          ? 0
          : clamp(0.006 * velPx * Math.max(props.dispersion, 0), 0, 22) * Math.sign(velCurrent);

        for (let i = 0; i < 11; i++) {
          const m = meshes[i];
          const meshIdx = centerIdx - 5 + i;
          const offset = meshIdx - posCurrent;
          const transform = getCardTransform(offset);
          const cardW = transform.w;
          const cardH = transform.h;
          const inRange = props.loop || (meshIdx >= 0 && meshIdx < itemCount());
          const alphaFade = smoothstep((3.6 - Math.abs(offset)) / 0.8);

          m.visible = inRange && cardW > 0.5 && alphaFade > 0.002 && textures.length > 0;
          m.mesh.visible = m.visible;
          m.index = meshIdx;

          if (!m.visible) continue;

          m.x = transform.x;
          m.y = lift;
          m.w = cardW;
          m.h = cardH;
          m.mesh.position.set(transform.x, lift, 0);
          m.mesh.scale.set(cardW, cardH, 1);

          const texEntry = textures[wrapIndex(meshIdx)];
          const uniforms = m.mesh.material.uniforms;

          if (texEntry) {
            uniforms.uImage.value = texEntry.texture;
            uniforms.uImageAspect.value = texEntry.aspect;
            if (texEntry.ready && texEntry.fade < 1) {
              texEntry.fade = reduced ? 1 : Math.min(1, texEntry.fade + dt / 0.45);
              needsNextFrame = true;
            }
            uniforms.uLoaded.value = texEntry.ready ? texEntry.fade : 0;
          }

          uniforms.uSize.value.set(cardW, cardH);
          uniforms.uRadius.value = clamp(props.radius, 0, 200) * (cardH / activeH);
          uniforms.uAlpha.value = alphaFade;
          uniforms.uBright.value = 1 - clamp(props.dim, 0, 1) * smoothstep(Math.abs(offset));
          uniforms.uSpreadPx.value = dispersionPx * (1 - smoothstep((Math.abs(offset) - 0.5) / 1.5));
          uniforms.uSweep.value = clamp(props.sweep, 0, 3);
          uniforms.uBand.value = 0.26;
          uniforms.uDirection.value = sweepDir;

          const cState = getCardState(meshIdx);
          const hoverBoost = 0.6 * (activeHoverCard === meshIdx && meshIdx !== activeRoundIdx ? 1 : 0);
          const baseSat = clamp(props.saturation, 0, 1);

          if (meshIdx === sweepTargetIdx && meshIdx === activeRoundIdx) {
            uniforms.uBase.value = Math.max(Math.min(cState.value, 1), baseSat);
            if (sweepProgress >= 1.26 || props.sweep <= 0) {
              cState.value = 1;
              cState.velocity = 0;
              uniforms.uReveal.value = -1;
              uniforms.uBase.value = 1;
            } else {
              uniforms.uReveal.value = 1.26 * sweepProgress;
            }
          } else {
            [cState.value, cState.velocity] = spring(
              cState.value,
              cState.velocity,
              Math.max(baseSat, hoverBoost),
              dt,
              reduced ? 0.05 : hoverBoost > 0 ? 0.45 : 0.7,
            );
            if (Math.abs(cState.value - Math.max(baseSat, hoverBoost)) > 0.001) {
              needsNextFrame = true;
            }
            uniforms.uBase.value = clamp(cState.value, 0, 1);
            uniforms.uReveal.value = -1;
          }
        }

        for (const k of Array.from(cardStates.keys())) {
          if (Math.abs(k - posCurrent) > 8) cardStates.delete(k);
        }

        root.style.setProperty('--prism-caption-y', `${containerH / 2 - lift + activeH / 2 + 16}px`);
        renderer.render(scene, camera);

        if (needsNextFrame || isDragging || pointerState || isHovered) {
          requestRender();
        } else if (props.autoplay && !props.paused && !reduced && itemCount() > 1) {
          const remainingTime = Math.max(props.interval - autoplayElapsed, 0);
          autoplayTimer = window.setTimeout(() => {
            autoplayTimer = 0;
            lastRenderTime = 0;
            autoplayElapsed = props.interval;
            requestRender();
          }, 1000 * remainingTime);
        }
      }

      const hitTest = (clientX: number, clientY: number): number | null => {
        const rect = root.getBoundingClientRect();
        const relX = clientX - rect.left - containerW / 2;
        const relY = -(clientY - rect.top - containerH / 2);
        let closestIndex: number | null = null;
        let closestDist = Infinity;
        for (const m of meshes) {
          if (m.visible && !(m.w < 6) && Math.abs(relX - m.x) <= m.w / 2 && Math.abs(relY - m.y) <= m.h / 2) {
            const dist = Math.abs(m.index - posCurrent);
            if (dist < closestDist) {
              closestDist = dist;
              closestIndex = m.index;
            }
          }
        }
        return closestIndex;
      };

      const onPointerMove = (ev: PointerEvent) => {
        if (ev.pointerType !== 'touch') {
          isHovered = true;
          const hoveredIdx = hitTest(ev.clientX, ev.clientY);
          if (hoveredIdx !== activeHoverCard) {
            activeHoverCard = hoveredIdx;
            root.style.cursor = hoveredIdx !== null ? 'pointer' : latestProps.current.draggable ? 'grab' : '';
          }
        }
        if (pointerState && pointerState.id === ev.pointerId) {
          const deltaX = ev.clientX - pointerState.lastX;
          if (!pointerState.moved && Math.abs(ev.clientX - pointerState.x) > 6) {
            pointerState.moved = true;
            isDragging = true;
            activeHoverCard = null;
            root.style.cursor = 'grabbing';
            try {
              container.setPointerCapture(ev.pointerId);
            } catch {
              // ignore pointer capture error
            }
          }
          if (pointerState.moved) {
            const cardDelta = -deltaX / (solveSpacing(), stepDistance);
            let newPos = posCurrent + cardDelta;
            if (!latestProps.current.loop) {
              const overscroll = newPos < 0 ? newPos : newPos > itemCount() - 1 ? newPos - (itemCount() - 1) : 0;
              if (overscroll !== 0) {
                newPos = posCurrent + 0.35 * cardDelta;
              }
            }
            const now = performance.now();
            const dt = Math.max((now - lastSampleTime) / 1000, 1 / 240);
            lastSampleTime = now;
            velCurrent += ((newPos - posCurrent) / dt - velCurrent) * 0.5;
            pointerState.samples.push({ t: now, d: newPos - posCurrent });
            while (pointerState.samples.length && now - pointerState.samples[0].t > 100) {
              pointerState.samples.shift();
            }
            posCurrent = newPos;
          }
          pointerState.lastX = ev.clientX;
        }
        requestRender();
      };

      const onPointerDown = (ev: PointerEvent) => {
        if (latestProps.current.draggable && ev.isPrimary && !(ev.button > 0)) {
          pointerState = {
            id: ev.pointerId,
            x: ev.clientX,
            lastX: ev.clientX,
            moved: false,
            samples: [],
          };
          suppressClick = false;
          velCurrent = 0;
          requestRender();
        }
      };

      const onPointerUp = (ev: PointerEvent) => {
        if (!pointerState || pointerState.id !== ev.pointerId) return;
        const state = pointerState;
        pointerState = null;
        try {
          if (container.hasPointerCapture(ev.pointerId)) {
            container.releasePointerCapture(ev.pointerId);
          }
        } catch {
          // ignore pointer release error
        }
        if (state.moved) {
          suppressClick = true;
          isDragging = false;
          const now = performance.now();
          const recent = state.samples.filter((s) => now - s.t < 100);
          let sampleVel = 0;
          if (recent.length > 1) {
            const dur = Math.max((recent[recent.length - 1].t - recent[0].t) / 1000, 1 / 60);
            sampleVel = recent.reduce((sum, s) => sum + s.d, 0) / dur;
          }
          velCurrent = clamp(sampleVel, -12, 12);
          posTarget = clampTarget(Math.round(posCurrent + 0.18 * clamp(sampleVel, -12, 12)));
          autoplayElapsed = 0;
          root.style.cursor = '';
        }
        requestRender();
      };

      const onClick = (ev: MouseEvent) => {
        if (suppressClick) {
          suppressClick = false;
          return;
        }
        const clickedIdx = hitTest(ev.clientX, ev.clientY);
        if (clickedIdx !== null) {
          if (clickedIdx === Math.round(posTarget)) {
            callbacks.onSelect(wrapIndex(clickedIdx));
          } else {
            posTarget = clampTarget(clickedIdx);
            autoplayElapsed = 0;
            requestRender();
          }
        }
      };

      const onPointerLeave = (ev: PointerEvent) => {
        if (pointerState && pointerState.id === ev.pointerId) return;
        isHovered = false;
        activeHoverCard = null;
        root.style.cursor = '';
        requestRender();
      };

      const onWheel = (ev: WheelEvent) => {
        if (!latestProps.current.wheel) return;
        ev.preventDefault();
        const factor = ev.deltaMode === 1 ? 16 : ev.deltaMode === 2 ? containerH : 1;
        const delta = clamp((ev.deltaY + ev.deltaX) * factor, -240, 240);
        posTarget = clampTarget((isWheeling ? posTarget : Math.round(posTarget)) + delta / 100);
        isWheeling = true;
        wheelLastTime = performance.now();
        autoplayElapsed = 0;
        requestRender();
      };

      const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'ArrowRight') {
          ev.preventDefault();
          step(1);
        } else if (ev.key === 'ArrowLeft') {
          ev.preventDefault();
          step(-1);
        } else if (ev.key === 'Enter' && ev.target === root) {
          ev.preventDefault();
          callbacks.onSelect(wrapIndex(Math.round(posTarget)));
        }
      };

      container.addEventListener('pointerdown', onPointerDown);
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerup', onPointerUp);
      container.addEventListener('pointercancel', onPointerUp);
      container.addEventListener('pointerleave', onPointerLeave);
      container.addEventListener('click', onClick);
      container.addEventListener('wheel', onWheel, { passive: false });
      root.addEventListener('keydown', onKeyDown);

      const resizeObserver = new ResizeObserver(() => {
        if (updateSize()) requestRender();
      });
      resizeObserver.observe(root);

      const intersectionObserver =
        typeof IntersectionObserver === 'undefined'
          ? null
          : new IntersectionObserver(
              ([entry]) => {
                if ((isIntersecting = entry.isIntersecting)) {
                  lastRenderTime = 0;
                  requestRender();
                } else {
                  if (rafId) cancelAnimationFrame(rafId);
                  rafId = 0;
                  if (autoplayTimer) window.clearTimeout(autoplayTimer);
                  autoplayTimer = 0;
                }
              },
              { rootMargin: '80px' },
            );
      if (intersectionObserver) {
        intersectionObserver.observe(root);
      } else {
        isIntersecting = true;
      }

      const onContextLost = (ev: Event) => {
        ev.preventDefault();
        isContextLost = true;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      };

      const onContextRestored = () => {
        isContextLost = false;
        prevSrcKey = '';
        loadTextures();
        requestRender();
      };

      canvas.addEventListener('webglcontextlost', onContextLost);
      canvas.addEventListener('webglcontextrestored', onContextRestored);

      updateSize();
      loadTextures();
      sweepStartTime = latestProps.current.reduced ? -10 : 0.35;
      requestRender();

      return {
        sync: () => {
          updateSize();
          loadTextures();
          if (!latestProps.current.loop) posTarget = clampTarget(posTarget);
          lastRenderTime = 0;
          requestRender();
        },
        step,
        goTo: (idx: number) => {
          if (latestProps.current.loop) {
            const count = itemCount();
            const rounded = Math.round(posTarget);
            const delta = ((((idx - wrapIndex(rounded)) % count) + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
            posTarget = rounded + delta;
          } else {
            posTarget = clamp(idx, 0, itemCount() - 1);
          }
          autoplayElapsed = 0;
          requestRender();
        },
        destroy: () => {
          isDestroyed = true;
          if (rafId) cancelAnimationFrame(rafId);
          if (autoplayTimer) window.clearTimeout(autoplayTimer);
          intersectionObserver?.disconnect();
          resizeObserver.disconnect();
          container.removeEventListener('pointerdown', onPointerDown);
          container.removeEventListener('pointermove', onPointerMove);
          container.removeEventListener('pointerup', onPointerUp);
          container.removeEventListener('pointercancel', onPointerUp);
          container.removeEventListener('pointerleave', onPointerLeave);
          container.removeEventListener('click', onClick);
          container.removeEventListener('wheel', onWheel);
          root.removeEventListener('keydown', onKeyDown);
          root.style.cursor = '';
          canvas.removeEventListener('webglcontextlost', onContextLost);
          canvas.removeEventListener('webglcontextrestored', onContextRestored);
          textures.forEach((t) => {
            t.image.onload = null;
            t.texture.dispose();
          });
          meshes.forEach((m) => m.mesh.material.dispose());
          placeholderTex.dispose();
          geom.dispose();
          renderer.dispose();
          if (!renderer.getContext().isContextLost()) {
            renderer.forceContextLoss();
          }
          canvas.remove();
        },
      };
    };

    const controller = setup(rootEl, canvasContainerEl, propsRef, itemsRef, initialIndex, {
      onActive: (idx: number) => {
        setActiveIndex(idx);
        callbacksRef.current.onIndexChange?.(idx);
      },
      onSelect: (idx: number) => {
        const item = itemsRef.current[idx];
        if (item) {
          callbacksRef.current.onSelect?.(item, idx);
          if (item.href) {
            window.location.assign(item.href);
          }
        }
      },
    });

    if (!controller) {
      const frameId = requestAnimationFrame(() => setIsFallback(true));
      return () => cancelAnimationFrame(frameId);
    }

    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [initialIndex]);

  useEffect(() => {
    const el = captionRef.current;
    if (el && !isReduced) {
      el.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      );
    }
  }, [activeIndex, isReduced]);

  useImperativeHandle(
    ref,
    () => ({
      next: () => controllerRef.current?.step(1),
      previous: () => controllerRef.current?.step(-1),
      goTo: (idx: number) => controllerRef.current?.goTo(idx),
    }),
    [],
  );

  const cleanBg = backgroundColor.trim().toLowerCase();
  const isTransparent = cleanBg === 'transparent' || cleanBg === '';
  const isLightBg =
    !isTransparent &&
    ((colorStr: string) => {
      const hex = colorStr.replace('#', '');
      if (!/^[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(hex)) return false;
      const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex;
      return (
        (0.2126 * Number.parseInt(full.slice(0, 2), 16) +
          0.7152 * Number.parseInt(full.slice(2, 4), 16) +
          0.0722 * Number.parseInt(full.slice(4, 6), 16)) /
          255 >
        0.6
      );
    })(cleanBg);

  const currentItem = effectiveItems[activeIndex] ?? effectiveItems[0];

  return (
    <div
      ref={rootRef}
      className={cn('relative h-full min-h-[420px] w-full overflow-hidden', className)}
      style={{
        backgroundColor: isTransparent ? undefined : backgroundColor,
        color: isTransparent ? 'currentColor' : isLightBg ? '#0a0a0a' : '#fafafa',
        ...style,
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div ref={canvasContainerRef} style={touchOverlayStyle} />

      {isFallback && currentItem && (
        <div style={{ position: 'absolute', inset: '12%', display: 'grid', placeItems: 'center' }}>
          <img
            src={currentItem.src}
            alt={currentItem.alt}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover', borderRadius: radius }}
          />
        </div>
      )}

      <ul style={srOnlyStyle}>
        {effectiveItems.map((item, idx) => (
          <li key={item.src} aria-current={idx === activeIndex ? 'true' : undefined}>
            {item.title ? `${item.title}: ${item.alt}` : item.alt}
          </li>
        ))}
      </ul>

      {(captions || controls) && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 'var(--prism-caption-y, 82%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            pointerEvents: 'none',
          }}
        >
          {captions && currentItem && (
            <div
              ref={captionRef}
              aria-live="polite"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center' }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>
                {currentItem.title ?? currentItem.alt}
              </span>
              {currentItem.subtitle && (
                <span style={{ fontSize: 13, opacity: 0.6, lineHeight: 1.35 }}>{currentItem.subtitle}</span>
              )}
            </div>
          )}

          {controls && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                pointerEvents: 'auto',
                fontSize: 12,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <button
                type="button"
                aria-label="Previous"
                onClick={() => controllerRef.current?.step(-1)}
                onPointerEnter={(e) => {
                  e.currentTarget.style.background = controlBtnHoverBg;
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.background = controlBtnBg;
                }}
                style={controlBtnStyle}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <span style={{ opacity: 0.6, minWidth: 52, textAlign: 'center' }}>
                {String(activeIndex + 1).padStart(2, '0')} / {String(effectiveItems.length).padStart(2, '0')}
              </span>
              <button
                type="button"
                aria-label="Next"
                onClick={() => controllerRef.current?.step(1)}
                onPointerEnter={(e) => {
                  e.currentTarget.style.background = controlBtnHoverBg;
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.background = controlBtnBg;
                }}
                style={controlBtnStyle}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

PrismCarousel.displayName = 'PrismCarousel';

export default PrismCarousel;
