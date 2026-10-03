import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';
import { COLOR_TOKENS } from '@/lib/constants';
import {
  calculateBulbAppearance,
  calculateLightIntensity,
  calculateFilamentEmissive,
  calculateCameraTransform,
  calculateParticleParams,
  calculateBreathingPulse,
  checkIsLowTier,
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
  const { bulb } = COLOR_TOKENS;
  const groupRef = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const filamentMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glassMatRef = useRef<THREE.MeshPhysicalMaterial | THREE.MeshStandardMaterial>(null);
  const glassOutlineMatRef = useRef<THREE.LineBasicMaterial>(null);
  const baseMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const contactMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const supportMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const supportMatRef2 = useRef<THREE.MeshStandardMaterial>(null);
  const raysMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const raysMatRef2 = useRef<THREE.MeshBasicMaterial>(null);
  const raysMatRef3 = useRef<THREE.MeshBasicMaterial>(null);
  const coreHaloMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const midHaloMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerHaloMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const particlesMatRef = useRef<THREE.PointsMaterial>(null);
  const haloGroupRef = useRef<THREE.Group>(null);
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
  const glassOutlineGeometry = useMemo(() => {
    const outlinePoints = [
      ...bulbPoints,
      ...[...bulbPoints].reverse().map((point) => new THREE.Vector2(-point.x, point.y)),
    ].map((point) => new THREE.Vector3(point.x, point.y, 0));
    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(outlinePoints);
    return geometry;
  }, [bulbPoints]);

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
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.72)');
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.38)');
      grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.1)');
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
      glassOutlineGeometry.dispose();
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
    glassOutlineGeometry,
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
    const breathing = calculateBreathingPulse(p, state.clock.getElapsedTime());

    // Camera updates
    state.camera.position.z = cam.z;
    state.camera.position.y = cam.y;
    state.camera.rotation.x = cam.rotX;
    state.camera.rotation.y = cam.rotY + Math.sin(state.clock.elapsedTime * 0.35) * 0.03;

    // Bulb root group scaling & placement
    if (groupRef.current) {
      groupRef.current.visible = appearance.opacity > 0;
      const baseScale = appearance.scale * (isMobile ? 0.55 : 1);
      groupRef.current.scale.setScalar(baseScale * breathing.pulse);
      groupRef.current.position.y = (isMobile ? 1.9 : 0.05) + breathing.driftY * 0.65;
      groupRef.current.position.x = breathing.driftX * 0.9;
      groupRef.current.rotation.x = -0.05 * p + breathing.driftY * 0.35;
      groupRef.current.rotation.y = 0.08 * Math.sin(p * Math.PI) + breathing.driftX * 0.5;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
    }

    if (haloGroupRef.current) {
      haloGroupRef.current.rotation.z = state.clock.elapsedTime * 0.18 + p * 1.2;
      haloGroupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.04);
    }

    // Glass material opacity & visibility
    if (glassMatRef.current) {
      glassMatRef.current.opacity = 0.1 * appearance.opacity;
    }
    if (glassOutlineMatRef.current) {
      glassOutlineMatRef.current.opacity = 0.42 * appearance.opacity;
    }

    // Point Light intensity
    if (pointLightRef.current) {
      pointLightRef.current.intensity = lightVal * 3.8;
      pointLightRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.18;
      pointLightRef.current.position.y = 0.3 + Math.cos(state.clock.elapsedTime * 1.1) * 0.12;
    }

    // Filament emissive intensity & color
    if (filamentMatRef.current) {
      filamentMatRef.current.emissiveIntensity = emissiveVal * 4.8;
      filamentMatRef.current.opacity = appearance.opacity;
      filamentMatRef.current.color.set(
        emissiveVal > 0 ? bulb.filamentLit : bulb.filamentUnlit
      );
    }
    if (baseMatRef.current) baseMatRef.current.opacity = appearance.opacity;
    if (contactMatRef.current) contactMatRef.current.opacity = appearance.opacity;
    if (supportMatRef.current) supportMatRef.current.opacity = appearance.opacity;
    if (supportMatRef2.current) supportMatRef2.current.opacity = appearance.opacity;

    // Warm alpha layers and rays grow with a softer, more layered glow response.
    const haloPulse = 0.8 + 0.35 * Math.sin(state.clock.elapsedTime * 1.4 + p * 3.2);
    if (raysMatRef.current) raysMatRef.current.opacity = lightVal * 0.72 * haloPulse;
    if (raysMatRef2.current) raysMatRef2.current.opacity = lightVal * 0.68 * (1.15 + 0.22 * Math.sin(state.clock.elapsedTime * 1.3));
    if (raysMatRef3.current) raysMatRef3.current.opacity = lightVal * 0.64 * haloPulse;
    if (coreHaloMatRef.current) coreHaloMatRef.current.opacity = lightVal * 0.42 * haloPulse;
    if (midHaloMatRef.current) midHaloMatRef.current.opacity = lightVal * 0.28 * (1.1 + 0.12 * Math.sin(state.clock.elapsedTime * 1.05));
    if (outerHaloMatRef.current) outerHaloMatRef.current.opacity = lightVal * 0.18 * (1.2 + 0.18 * Math.sin(state.clock.elapsedTime * 0.85));

    // Particles animation
    if (particlesRef.current && particlesMatRef.current) {
      particlesMatRef.current.opacity = particleParams.opacity * (0.8 + 0.2 * Math.sin(state.clock.elapsedTime * 1.5));
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
          color={bulb.core}
          distance={14}
          decay={2}
        />

        {/* 1. Glass Envelope */}
        <mesh geometry={glassGeometry}>
          {isLowTier ? (
            <meshStandardMaterial
              ref={glassMatRef as React.Ref<THREE.MeshStandardMaterial>}
              color={bulb.glass}
              roughness={0.22}
              metalness={0.1}
              transparent
              opacity={0}
              depthWrite={false}
            />
          ) : (
            <meshPhysicalMaterial
              ref={glassMatRef as React.Ref<THREE.MeshPhysicalMaterial>}
              color={bulb.glass}
              roughness={0.22}
              metalness={0.05}
              transmission={0.08}
              ior={1.5}
              transparent
              opacity={0}
              thickness={0.6}
            />
          )}
        </mesh>
        <lineLoop geometry={glassOutlineGeometry} position={[0, 0, 0.02]}>
          <lineBasicMaterial
            ref={glassOutlineMatRef}
            color={bulb.glassEdge}
            transparent
            opacity={0}
            depthTest={false}
          />
        </lineLoop>

        {/* 2. Metal Screw Base */}
        <mesh geometry={screwBaseGeometry} position={[0, -1.25, 0]}>
          <meshStandardMaterial
            ref={baseMatRef}
            color={bulb.metal}
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
            color={bulb.metalShadow}
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
            color={bulb.glassEdge}
            metalness={0.8}
            roughness={0.4}
            transparent
            opacity={0}
          />
        </mesh>
        <mesh geometry={supportWireGeometry} position={[0.16, -0.4, 0]}>
          <meshStandardMaterial
            ref={supportMatRef2}
            color={bulb.glassEdge}
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
            color={bulb.filamentUnlit}
            emissive={bulb.filamentLit}
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
              color={bulb.ray}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.NormalBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={rayPlaneGeometry} rotation={[0, 0, Math.PI / 3]}>
            <meshBasicMaterial
              ref={raysMatRef2}
              color={bulb.ray}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.NormalBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={rayPlaneGeometry} rotation={[0, 0, (2 * Math.PI) / 3]}>
            <meshBasicMaterial
              ref={raysMatRef3}
              color={bulb.ray}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.NormalBlending}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Warm translucent halos use normal alpha blending on the light background. */}
        <group ref={haloGroupRef} position={[0, 0.3, -0.3]}>
          <mesh geometry={rayPlaneGeometry} scale={[0.8, 0.8, 1]}>
            <meshBasicMaterial
              ref={outerHaloMatRef}
              color={bulb.outerHalo}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.NormalBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={rayPlaneGeometry} scale={[0.48, 0.48, 1]}>
            <meshBasicMaterial
              ref={midHaloMatRef}
              color={bulb.midHalo}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.NormalBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={rayPlaneGeometry} scale={[0.22, 0.22, 1]}>
            <meshBasicMaterial
              ref={coreHaloMatRef}
              color={bulb.core}
              map={rayTexture}
              transparent
              opacity={0}
              blending={THREE.NormalBlending}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* 7. Drifting Particles */}
        <points ref={particlesRef} geometry={particleGeometry}>
          <pointsMaterial
            ref={particlesMatRef}
            color={bulb.particle}
            size={0.03}
            transparent
            opacity={0}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </>
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
      </Canvas>
    </div>
  );
};

export default BulbScene3D;
