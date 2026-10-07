import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface ReadyWordRef {
  updateProgress: (progress: number) => void;
}

export interface ReadyWordProps {
  word?: string;
  focusChar?: string;
  className?: string;
}

/** Smoothstep curve for organic transitions */
function smoothStep(min: number, max: number, v: number): number {
  const x = Math.min(1, Math.max(0, (v - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/** Finds largest inscribed solid ink circle inside a glyph using dynamic programming */
function findLetterInk(
  char: string,
  fontSize: number,
  fontFamily: string,
  fontWeight: number = 700
): { x: number; y: number; radius: number } {
  const offscreen = document.createElement("canvas");
  const ctx = offscreen.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { x: fontSize * 0.18, y: fontSize * 0.45, radius: fontSize * 0.12 };
  }

  // Scan at 3x resolution for sub-pixel precision
  const scanScale = 3;
  const scanSize = fontSize * scanScale;
  const font = `${fontWeight} ${scanSize}px ${fontFamily}`;
  ctx.font = font;
  ctx.textBaseline = "top";

  const metrics = ctx.measureText(char);
  const pad = 16;
  const w = Math.ceil(metrics.width + pad * 2);
  const h = Math.ceil(scanSize * 1.2 + pad * 2);

  offscreen.width = Math.max(1, w);
  offscreen.height = Math.max(1, h);

  ctx.font = font;
  ctx.textBaseline = "top";
  ctx.fillStyle = "#000000";
  ctx.fillText(char, pad, pad);

  const pixels = ctx.getImageData(0, 0, w, h).data;
  const rows = new Uint16Array(w + 1);
  let maxSize = 0;
  let bestX = 0;
  let bestY = 0;

  for (let y = 0; y < h; y++) {
    let diagonal = 0;
    for (let x = 0; x < w; x++) {
      const above = rows[x + 1];
      const alpha = pixels[(y * w + x) * 4 + 3];
      // Test opaque ink pixels
      if (alpha > 240) {
        const val = Math.min(above, rows[x], diagonal) + 1;
        rows[x + 1] = val;
        if (val > maxSize) {
          maxSize = val;
          bestX = x;
          bestY = y;
        }
      } else {
        rows[x + 1] = 0;
      }
      diagonal = above;
    }
  }

  if (maxSize < 3) {
    return { x: fontSize * 0.18, y: fontSize * 0.45, radius: fontSize * 0.12 };
  }

  // Convert back to 1x scale coordinates relative to character top-left
  const centerX = (bestX + 1 - maxSize / 2 - pad) / scanScale;
  const centerY = (bestY + 1 - maxSize / 2 - pad) / scanScale;
  const radius = (maxSize / 2 - 1) / scanScale;

  return { x: centerX, y: centerY, radius };
}

const ReadyWord = forwardRef<ReadyWordRef, ReadyWordProps>(function ReadyWord(
  { word = "READY", focusChar = "E", className = "" },
  ref
) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const staticWordRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  // Layout metrics measured at rest from the static inline element
  const metricsRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
    fontWeight: number;
    focusX: number;
    focusY: number;
    inkRadius: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    fontSize: 76,
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    fontWeight: 700,
    focusX: 0,
    focusY: 0,
    inkRadius: 10,
  });

  const progressRef = useRef(0);
  const rafIdRef = useRef(0);

  // Measure the static inline element's exact position on screen at rest
  const measure = useCallback(() => {
    if (!staticWordRef.current) return;
    const rect = staticWordRef.current.getBoundingClientRect();
    const computed = window.getComputedStyle(staticWordRef.current);
    const fontSize = parseFloat(computed.fontSize) || 76;
    const fontFamily = computed.fontFamily || '"Plus Jakarta Sans", sans-serif';
    const fontWeight = parseInt(computed.fontWeight, 10) || 700;

    // Character index of focusChar (default 'E')
    const charIndex = Math.max(0, word.indexOf(focusChar));
    const targetChar = word[charIndex] || "E";
    const prefix = word.slice(0, charIndex);

    // Measure prefix width using Canvas context
    const offscreen = document.createElement("canvas");
    const ctx = offscreen.getContext("2d");
    let prefixWidth = 0;
    if (ctx) {
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.letterSpacing = computed.letterSpacing || "-0.035em";
      prefixWidth = ctx.measureText(prefix).width;
    } else {
      prefixWidth = (rect.width / word.length) * charIndex;
    }

    // Locate the deepest solid ink of letter 'E'
    const ink = findLetterInk(targetChar, fontSize, fontFamily, fontWeight);

    /* =========================================================================
       OLD TARGET AREA (PRESERVED FOR FALLBACK AS REQUESTED)
       const inkRadius = Math.max(6, ink.radius);
       const focusX = rect.left + prefixWidth + ink.x;
       const focusY = rect.top + ink.y;
       ========================================================================= */

    // NEW TARGET AREA: True vertical center of the solid vertical stem of 'E'
    // For letter 'E' in "Plus Jakarta Sans", the vertical stem is at ink.x horizontally,
    // and vertically spans the full cap-height (~0.75 * fontSize).
    // The vertical center of the stem is at 50% of cap-height (0.375 * fontSize from top),
    // placing the zoom target exactly halfway between the top and bottom edges of 'E'.
    const trueStemCenterY = fontSize * 0.375;
    const inkRadius = Math.max(7, ink.radius);
    const focusX = rect.left + prefixWidth + ink.x;
    const focusY = targetChar === "E" ? (rect.top + trueStemCenterY) : (rect.top + ink.y);

    metricsRef.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      fontSize,
      fontFamily,
      fontWeight,
      focusX,
      focusY,
      inkRadius,
    };
  }, [word, focusChar]);

  useEffect(() => {
    setMounted(true);
    // Initial measurement
    const timer = setTimeout(measure, 50);

    // Re-measure once fonts load
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (progressRef.current <= 0.001) {
          measure();
        }
      });
    }

    const handleResize = () => {
      // Only re-measure if at rest
      if (progressRef.current <= 0.001) {
        measure();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [measure]);

  // Render vector-crisp frame onto full-screen canvas
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const p = progressRef.current;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // At rest: show static inline text, hide canvas
    if (p <= 0.001) {
      if (canvas.style.display !== "none") {
        canvas.style.display = "none";
      }
      if (staticWordRef.current && staticWordRef.current.style.visibility !== "visible") {
        staticWordRef.current.style.visibility = "visible";
      }
      return;
    }

    // Zoom phase calculations matching GlyphPortal easing
    const zoomEnd = 0.36;
    const t = Math.min(1, Math.max(0, p / zoomEnd));
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

    const m = metricsRef.current;
    // Corner-to-corner full fill scale with generous margin so all 4 screen corners are 100% engulfed
    const cornerDist = Math.hypot(width, height);
    const endScale = Math.max(80, (cornerDist / m.inkRadius) * 2.0);
    // Exponential optical zoom
    const scale = Math.exp(Math.log(1) + Math.log(endScale) * eased);

    // Perspective blend and panning towards screen center
    const blend = endScale <= 1 ? 0 : (1 / scale - 1) / (1 / endScale - 1);
    const targetScreenX = m.focusX + (width * 0.5 - m.focusX) * blend;
    const targetScreenY = m.focusY + (height * 0.5 - m.focusY) * blend;

    // Cinematic camera roll (-4° banking curve returning smoothly to 0°)
    const roll = -4 * smoothStep(0.06, 0.5, t) * (1 - smoothStep(0.62, 0.92, t));

    // The letter E NEVER fades out - it stays 100% solid, fully opaque royal blue at all times.
    // Once letter ink has completely filled the screen (t >= 1 / p >= zoomEnd),
    // the canvas hands off cleanly to the identical #2547FF portal field directly underneath,
    // allowing the 3 feature cards to pop up and rise seamlessly on the filled ink.
    if (t >= 1) {
      if (canvas.style.display !== "none") {
        canvas.style.display = "none";
      }
      return;
    }

    // Ensure canvas is visible and static inline text is hidden during zoom
    if (canvas.style.display !== "block") {
      canvas.style.display = "block";
    }
    if (staticWordRef.current && staticWordRef.current.style.visibility !== "hidden") {
      staticWordRef.current.style.visibility = "hidden";
    }

    // Resize canvas buffer if needed
    const requiredBufferW = Math.round(width * dpr);
    const requiredBufferH = Math.round(height * dpr);
    if (canvas.width !== requiredBufferW || canvas.height !== requiredBufferH) {
      canvas.width = requiredBufferW;
      canvas.height = requiredBufferH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Solid opaque royal blue ink - ZERO opacity fading
    ctx.globalAlpha = 1.0;

    // If letter ink has fully expanded to fill the entire viewport, paint solid royal blue
    if (t >= 0.98) {
      ctx.fillStyle = "#2547FF";
      ctx.fillRect(0, 0, width, height);
    } else {
      // Camera transformation:
      // 1. Move camera to interpolated viewport position
      ctx.translate(targetScreenX, targetScreenY);
      // 2. Apply banking roll and exponential zoom
      ctx.rotate((roll * Math.PI) / 180);
      ctx.scale(scale, scale);
      // 3. Move target focus point to origin
      ctx.translate(-m.focusX, -m.focusY);

      // Font typography matching headline
      ctx.font = `${m.fontWeight} ${m.fontSize}px ${m.fontFamily}`;
      ctx.textBaseline = "top";
      ctx.letterSpacing = "-0.035em";

      // Destination page royal blue (#2547FF) matching portal field - razor sharp vector edges
      ctx.fillStyle = "#2547FF";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw the word at exact inline position
      ctx.fillText(word, m.left, m.top);
    }

    ctx.restore();
  }, [word]);

  // Imperative handle called by Hero.tsx onProgress at 60fps
  useImperativeHandle(
    ref,
    () => ({
      updateProgress: (nextProgress: number) => {
        // If transitioning from rest, ensure fresh measurement
        if (progressRef.current <= 0.001 && nextProgress > 0.001) {
          measure();
        }
        progressRef.current = nextProgress;
        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = 0;
            renderFrame();
          });
        }
      },
    }),
    [renderFrame, measure]
  );

  return (
    <>
      <span
        ref={containerRef}
        className={`hero-ready-wrapper relative inline-block align-baseline ${className}`}
      >
        {/* 
          Static inline text:
          - Occupies exact intrinsic layout space in headline flow
          - 0px layout shift for surrounding sentence ("Build before you're " and ".")
          - Styled with solid royal blue (#2547FF) matching the scroll destination page
        */}
        <span
          ref={staticWordRef}
          className="hero-ready-static select-text inline-block"
          style={{
            color: "#2547FF",
            letterSpacing: "-0.035em",
          }}
        >
          {word}
        </span>
      </span>

      {/* 
        Full-screen vector canvas rendered in document.body via Portal:
        - Avoids containing block issues caused by ancestor CSS transforms
        - True viewport coordinates matching getBoundingClientRect()
        - Eliminates GPU raster texture pixelation
      */}
      {mounted &&
        createPortal(
          <canvas
            ref={canvasRef}
            className="hero-ready-zoom-canvas pointer-events-none fixed inset-0 z-30 select-none"
            style={{
              display: "none",
              width: "100vw",
              height: "100vh",
            }}
            aria-hidden="true"
          />,
          document.body
        )}
    </>
  );
});

export default ReadyWord;
