import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import {
  calculateBulbAppearance,
  calculateLightIntensity,
  calculateFilamentEmissive,
  calculateBloomParams,
  calculateCameraTransform,
  calculateParticleParams,
  checkIsLowTier,
  type BloomParams,
  type BulbAppearance,
  type CameraTransform,
  type ParticleParams,
} from './bulb3DHelpers';

interface BulbScene3DProps {
  progress: MotionValue<number>;
  onContextLost?: () => void;
}

// -------------------------------------------------------------
// Inner 3D Bulb Object & Lights
// -------------------------------------------------------------
interface BulbModelProps {
  progress: MotionValue<number>;
  isLowTier: boolean;
  isMobile: boolean;
}

const BulbModel: React.FC<BulbModelProps> = ({ progress, isLowTier, isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const filamentMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glassMatRef = useRef<THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial>(null);
  const baseMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const contactMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const supportMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const supportMatRef2 = useRef<THREE.MeshStandardMaterial>(null);
  const raysMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const raysMatRef2 = useRef<THREE.MeshBasicMaterial>(null);
  const raysMatRef3 = useRef<THREE.MeshBasicMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const particlesMatRef = useRef<THREE.PointsMaterial>(null);
  const appearanceRef = useRef<BulbAppearance>({ opacity: 0, scale: 0.85 });
  const cameraTransformRef = useRef<CameraTransform>({ z: 0, y: 0, rotX: 0, rotY: 0 });
  const particleParamsRef = useRef<ParticleParams>({ opacity: 0, size: 0.02 });

  // 1. Bulb Glass Envelope Geometry (Lathe profile)
  const bulbPoints = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0, 1.35));
    pts.push(new THREE.Vector2(0.35, 1.3));
    pts.push(new THREE.Vector2(0.75, 1.15));
    pts.push(new THREE.Vector2(1.05, 0.85));
    pts.push(new THREE.Vector2(1.15, 0.45));
    pts.push(new THREE.Vector2(1.02, 0.1));
    pts.push(new THREE.Vector2(0.75, -0.3));
    pts.push(new THREE.Vector2(0.55, -0.65));
    pts.push(new THREE.Vector2(0.46, -0.85));
    pts.push(new THREE.Vector2(0.44, -1.0));
    return pts;
  }, []);

  const glassGeometry = useMemo(() => new THREE.LatheGeometry(bulbPoints, 36), [bulbPoints]);

  // 2. Base & Solder Contacts
  const screwBaseGeometry = useMemo(() => new THREE.CylinderGeometry(0.44, 0.41, 0.5, 32), []);
  const contactGeometry = useMemo(() => new THREE.CylinderGeometry(0.28, 0.12, 0.16, 32), []);

  // 3. Support Wires & Filament Curve
  const supportWireGeometry = useMemo(() => new THREE.CylinderGeometry(0.015, 0.015, 0.75, 8), []);

  const filamentGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.16, -0.05, 0),
      new THREE.Vector3(-0.18, 0.35, 0.05),
      new THREE.Vector3(-0.08, 0.55, -0.05),
      new THREE.Vector3(0, 0.42, 0.04),
      new THREE.Vector3(0.08, 0.55, -0.05),
      new THREE.Vector3(0.18, 0.35, 0.05),
      new THREE.Vector3(0.16, -0.05, 0),
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.022, 8, false);
  }, []);

  // 4. Offline Radial Light Rays Texture
  const rayTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      grad.addColorStop(0.35, 'rgba(147, 197, 253, 0.4)');
      grad.addColorStop(0.75, 'rgba(59, 130, 246, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  const rayPlaneGeometry = useMemo(() => new THREE.PlaneGeometry(5.5, 5.5), []);

  // 5. Particles Geometry
  const particleCount = isLowTier ? 50 : 200;
  const [particlePositions, particleVelocities] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.5 + 0.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;

      vel[i * 3] = (Math.random() - 0.5) * 0.08;
      vel[i * 3 + 1] = (Math.random() * 0.06 + 0.02);
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    return [pos, vel];
  }, [particleCount]);

  const particleGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    return geom;
  }, [particlePositions]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      glassGeometry.dispose();
      screwBaseGeometry.dispose();
      contactGeometry.dispose();
      supportWireGeometry.dispose();
      filamentGeometry.dispose();
      rayPlaneGeometry.dispose();
      particleGeometry.dispose();
      rayTexture.dispose();
    };
  }, [
    glassGeometry,
    screwBaseGeometry,
    contactGeometry,
    supportWireGeometry,
    filamentGeometry,
    rayPlaneGeometry,
    particleGeometry,
    rayTexture,
  ]);

  // 6. Mutate materials/transforms per frame without React setState or allocations
  useFrame((state, delta) => {
    const p = progress.get();
    const appearance = calculateBulbAppearance(p, appearanceRef.current);
    const lightVal = calculateLightIntensity(p);
    const emissiveVal = calculateFilamentEmissive(p);
    const cam = calculateCameraTransform(p, isMobile, cameraTransformRef.current);
    const particleParams = calculateParticleParams(p, particleParamsRef.current);

    // Camera updates
    state.camera.position.z = cam.z;
    state.camera.position.y = cam.y;
    state.camera.rotation.x = cam.rotX;
    state.camera.rotation.y = cam.rotY;

    // Bulb root group scaling & placement
    if (groupRef.current) {
      groupRef.current.visible = appearance.opacity > 0;
      groupRef.current.scale.setScalar(appearance.scale * (isMobile ? 0.55 : 1));
      groupRef.current.position.y = isMobile ? 1.9 : 0.05;
      groupRef.current.rotation.x = -0.05 * p;
      groupRef.current.rotation.y = 0.08 * Math.sin(p * Math.PI);
    }

    // Glass material opacity & visibility
    if (glassMatRef.current) {
      glassMatRef.current.opacity = isLowTier
        ? 0.35 * appearance.opacity
        : 0.95 * appearance.opacity;
    }

    // Point Light intensity
    if (pointLightRef.current) {
      pointLightRef.current.intensity = lightVal * 3.5;
    }

    // Filament emissive intensity & color
    if (filamentMatRef.current) {
      filamentMatRef.current.emissiveIntensity = emissiveVal * 4.5;
      filamentMatRef.current.opacity = appearance.opacity;
      if (emissiveVal > 0) {
        filamentMatRef.current.color.setRGB(1.0, 0.95, 0.65);
      } else {
        filamentMatRef.current.color.setRGB(0.55, 0.6, 0.65);
      }
    }
    if (baseMatRef.current) baseMatRef.current.opacity = appearance.opacity;
    if (contactMatRef.current) contactMatRef.current.opacity = appearance.opacity;
    if (supportMatRef.current) supportMatRef.current.opacity = appearance.opacity;
    if (supportMatRef2.current) supportMatRef2.current.opacity = appearance.opacity;

    // Keep the light rays deterministic while their additive opacity follows the glow.
    if (raysMatRef.current) raysMatRef.current.opacity = lightVal * 0.65;
    if (raysMatRef2.current) raysMatRef2.current.opacity = lightVal * 0.65;
    if (raysMatRef3.current) raysMatRef3.current.opacity = lightVal * 0.65;

    // Particles animation
    if (particlesRef.current && particlesMatRef.current) {
      particlesMatRef.current.opacity = particleParams.opacity;
      particlesMatRef.current.size = particleParams.size;

      // Update positions
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVelocities[i * 3 + 1] * delta;
        // Wrap around vertically
        if (positions[i * 3 + 1] > 2.8) {
          positions[i * 3 + 1] = -1.8;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 4]} intensity={0.7} />
      <directionalLight position={[-4, -2, -3]} intensity={0.25} />

      {/* Main Bulb Assembly */}
      <group ref={groupRef}>
        {/* Core Point Light inside bulb */}
        <pointLight
          ref={pointLightRef}
          position={[0, 0.3, 0]}
          color="#fff3b0"
          distance={14}
          decay={2}
        />

        {/* 1. Glass Envelope */}
        <mesh geometry={glassGeometry}>
          {isLowTier ? (
            <meshStandardMaterial
              ref={glassMatRef as React.Ref<THREE.MeshStandardMaterial>}
              color="#dbeafe"
              roughness={0.15}
              metalness={0.1}
              transparent
              opacity={0}
              depthWrite={false}
            />
          ) : (
            <meshPhysicalMaterial
              ref={glassMatRef as React.Ref<THREE.MeshPhysicalMaterial>}
              color="#ffffff"
              roughness={0.08}
              metalness={0.05}
              transmission={0.92}
              ior={1.5}
              transparent
              opacity={0}
              thickness={0.6}
            />
          )}
        </mesh>

        {/* 2. Metal Screw Base */}
        <mesh geometry={screwBaseGeometry} position={[0, -1.25, 0]}>
          <meshStandardMaterial
            ref={baseMatRef}
            color="#94a3b8"
            metalness={0.85}
            roughness={0.3}
            transparent
            opacity={0}
          />
        </mesh>

        {/* 3. Bottom Black Contact */}
        <mesh geometry={contactGeometry} position={[0, -1.55, 0]}>
          <meshStandardMaterial
            ref={contactMatRef}
            color="#1e293b"
            metalness={0.2}
            roughness={0.6}
            transparent
            opacity={0}
          />
        </mesh>

        {/* 4. Support Wires */}
        <mesh geometry={supportWireGeometry} position={[-0.16, -0.4, 0]}>
          <meshStandardMaterial
            ref={supportMatRef}
            color="#64748b"
            metalness={0.8}
            roughness={0.4}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh geometry={supportWireGeometry} position={[0.16, -0.4, 0]}>
          <meshStandardMaterial
            ref={supportMatRef2}
            color="#64748b"
            metalness={0.8}
            roughness={0.4}
            transparent
            opacity={0}
          />
        </mesh>

        {/* 5. Glowing Filament */}
        <mesh geometry={filamentGeometry}>
          <meshStandardMaterial
            ref={filamentMatRef}
            color="#64748b"
            emissive="#fde047"
            emissiveIntensity={0}
            roughness={0.3}
            transparent
            opacity={0}
          />
        </mesh>

        {/* 6. Additive Light Rays */}
        <group position={[0, 0.35, 0]}>
          <mesh geometry={rayPlaneGeometry}>
            <meshBasicMaterial
              ref={raysMatRef}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={rayPlaneGeometry} rotation={[0, 0, Math.PI / 3]}>
            <meshBasicMaterial
              ref={raysMatRef2}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={rayPlaneGeometry} rotation={[0, 0, (2 * Math.PI) / 3]}>
            <meshBasicMaterial
              ref={raysMatRef3}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* 7. Drifting Particles */}
        <points ref={particlesRef} geometry={particleGeometry}>
          <pointsMaterial
            ref={particlesMatRef}
            color="#93c5fd"
            size={0.03}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
};

// -------------------------------------------------------------
// Bloom Post-Processing Controller
// -------------------------------------------------------------
interface BloomControllerProps {
  progress: MotionValue<number>;
  isLowTier: boolean;
}

import type { BloomEffect } from 'postprocessing';

const BloomController: React.FC<BloomControllerProps> = ({ progress, isLowTier }) => {
  const bloomRef = useRef<InstanceType<typeof BloomEffect>>(null);
  const paramsRef = useRef<BloomParams>({ intensity: 0, luminanceThreshold: 1 });

  useFrame(() => {
    if (isLowTier || !bloomRef.current) return;
    const p = progress.get();
    const params = calculateBloomParams(p, false, paramsRef.current);
    bloomRef.current.intensity = params.intensity;
    if (bloomRef.current.luminanceMaterial) {
      bloomRef.current.luminanceMaterial.threshold = params.luminanceThreshold;
    }
  });

  if (isLowTier) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        ref={bloomRef as unknown as React.ComponentProps<typeof Bloom>['ref']}
        intensity={0}
        luminanceThreshold={0.85}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
};

interface ProgressFrameSchedulerProps {
  progress: MotionValue<number>;
  enabled: boolean;
}

const ProgressFrameScheduler: React.FC<ProgressFrameSchedulerProps> = ({
  progress,
  enabled,
}) => {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!enabled) return;
    const unsubscribe = progress.on('change', () => invalidate());
    invalidate();
    return unsubscribe;
  }, [enabled, invalidate, progress]);

  return null;
};

// -------------------------------------------------------------
// Root BulbScene3D Component
// -------------------------------------------------------------
export const BulbScene3D: React.FC<BulbScene3DProps> = ({ progress, onContextLost }) => {
  const [isLowTier, setIsLowTier] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = isInView && isDocumentVisible;

  useEffect(() => {
    setIsLowTier(checkIsLowTier());
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsLowTier(checkIsLowTier());
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pause rendering when tab is hidden or canvas is out of viewport
  useEffect(() => {
    const handleVisibility = () => {
      setIsDocumentVisible(document.visibilityState === 'visible');
    };
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);

    let observer: IntersectionObserver | null = null;
    if (containerRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting);
      });
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        dpr={isLowTier ? [1, 1.2] : [1, 1.5]}
        gl={{
          alpha: true,
          antialias: !isLowTier,
          powerPreference: 'high-performance',
        }}
        frameloop={isActive ? 'demand' : 'never'}
        onCreated={({ gl }) => {
          const dom = gl.domElement;
          const handleLoss = (e: Event) => {
            e.preventDefault();
            onContextLost?.();
          };
          dom.addEventListener('webglcontextlost', handleLoss);
        }}
      >
        <ProgressFrameScheduler progress={progress} enabled={isActive} />
        <BulbModel progress={progress} isLowTier={isLowTier} isMobile={isMobile} />
        <BloomController progress={progress} isLowTier={isLowTier} />
      </Canvas>
    </div>
  );
};

export default BulbScene3D;
