'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

const COLORS = {
  gold: '#C9B27A',
  goldHot: '#FFD277',
  blueDark: '#243140',
  blueMid: '#3A4A5E',
  background: '#1E2A3A',
};

/* ──────────────── N letter geometry ────────────────
   Path SVG du logo Nakama (32x32) :
   M6 6 L16 22 L26 6 L26 26 L20 26 L20 18 L16 24 L12 18 L12 26 L6 26 Z
   Recentré et extrudé en 3D.
   ──────────────────────────────────────────────────── */
function useNGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    // Path original (centré sur 16,16)
    const points: Array<[number, number]> = [
      [6, 6],
      [16, 22],
      [26, 6],
      [26, 26],
      [20, 26],
      [20, 18],
      [16, 24],
      [12, 18],
      [12, 26],
      [6, 26],
    ];
    // Recentre autour de 0 et inverse Y (Three.js a Y vers le haut)
    const center = 16;
    shape.moveTo(points[0]![0] - center, center - points[0]![1]);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i]![0] - center, center - points[i]![1]);
    }
    shape.closePath();

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 4,
      bevelEnabled: true,
      bevelThickness: 0.6,
      bevelSize: 0.6,
      bevelSegments: 4,
      curveSegments: 1,
    });
    geom.center();
    return geom;
  }, []);
}

interface NLetterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isGold: boolean;
  speed: number;
  rotationSpeed: number;
  geometry: THREE.ExtrudeGeometry;
}

function NLetter({
  position,
  rotation,
  scale,
  isGold,
  speed,
  rotationSpeed,
  geometry,
}: NLetterProps) {
  const ref = useRef<THREE.Mesh>(null);
  const initialY = position[1];
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Float vertical sinusoidal
    ref.current.position.y = initialY + Math.sin(t * speed + phase) * 0.6;
    // Rotation continue
    ref.current.rotation.x += rotationSpeed * 0.4;
    ref.current.rotation.y += rotationSpeed;
    ref.current.rotation.z += rotationSpeed * 0.2;
  });

  const meshProps: ThreeElements['mesh'] = {
    ref,
    position,
    rotation,
    scale,
    geometry,
    castShadow: true,
    receiveShadow: true,
  };

  return (
    <mesh {...meshProps}>
      {isGold ? (
        <meshStandardMaterial
          color={COLORS.gold}
          emissive={COLORS.gold}
          emissiveIntensity={0.18}
          metalness={0.85}
          roughness={0.22}
        />
      ) : (
        <meshStandardMaterial color={COLORS.blueDark} metalness={0.5} roughness={0.55} />
      )}
    </mesh>
  );
}

function CameraRig() {
  useFrame((state) => {
    const x = state.pointer.x * 1.8;
    const y = state.pointer.y * 1.0;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x, 0.04);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y, 0.04);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

interface ParticleConfig {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isGold: boolean;
  speed: number;
  rotationSpeed: number;
}

function generateParticles(count = 36): ParticleConfig[] {
  const particles: ParticleConfig[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      position: [
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 14 - 2,
      ],
      rotation: [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ],
      scale: 0.06 + Math.random() * 0.13,
      isGold: Math.random() > 0.55,
      speed: 0.4 + Math.random() * 0.6,
      rotationSpeed: 0.0008 + Math.random() * 0.003,
    });
  }
  return particles;
}

function Scene() {
  const geometry = useNGeometry();
  const particles = useMemo(() => generateParticles(36), []);

  return (
    <>
      <fog attach="fog" args={[COLORS.background, 18, 35]} />
      <ambientLight intensity={0.35} color={COLORS.blueMid} />

      {/* Key light or chaud */}
      <directionalLight position={[10, 12, 6]} intensity={1.6} color={COLORS.goldHot} />
      {/* Rim light bleu froid */}
      <directionalLight position={[-10, -6, -4]} intensity={0.9} color="#5B7CA0" />
      {/* Spot ponctuel pour faire scintiller le gold */}
      <pointLight
        position={[0, 4, 8]}
        intensity={1.2}
        color={COLORS.gold}
        distance={20}
      />

      {particles.map((p, i) => (
        <NLetter key={i} {...p} geometry={geometry} />
      ))}

      <CameraRig />
    </>
  );
}

export function ThreeBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 55 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
      style={{
        position: 'absolute',
        inset: 0,
        background: COLORS.background,
      }}
    >
      <Scene />
    </Canvas>
  );
}
