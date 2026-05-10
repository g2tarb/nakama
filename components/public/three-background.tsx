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

/* ──────────────── N letter — 3 box (2 barres + diagonale) ────────────────
   Construction simple et lisible : la lettre est un Group de 3 mesh.
   Les box sont biseautés avec depth via boxGeometry pour avoir du volume.
   Géométries partagées entre toutes les instances pour la perf.
   ──────────────────────────────────────────────────── */
function useNGeometries() {
  return useMemo(() => {
    // Constantes du N
    const BAR_WIDTH = 2.4;
    const HEIGHT = 8;
    const DEPTH = 1.6;
    const SPAN = 5; // distance entre les 2 barres (gauche/droite)

    // Barre verticale (gauche et droite — même geom)
    const bar = new THREE.BoxGeometry(BAR_WIDTH, HEIGHT, DEPTH);

    // Diagonale (longueur = hypoténuse, on la rotate ensuite)
    const diagLength = Math.sqrt(SPAN * SPAN + HEIGHT * HEIGHT);
    const diagonal = new THREE.BoxGeometry(BAR_WIDTH, diagLength, DEPTH);

    return { bar, diagonal, BAR_WIDTH, HEIGHT, DEPTH, SPAN, diagLength };
  }, []);
}

interface NLetterProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isGold: boolean;
  speed: number;
  rotationSpeed: number;
  geos: ReturnType<typeof useNGeometries>;
}

function NLetter({
  position,
  rotation,
  scale,
  isGold,
  speed,
  rotationSpeed,
  geos,
}: NLetterProps) {
  const ref = useRef<THREE.Group>(null);
  const initialY = position[1];
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = initialY + Math.sin(t * speed + phase) * 0.6;
    ref.current.rotation.x += rotationSpeed * 0.4;
    ref.current.rotation.y += rotationSpeed;
    ref.current.rotation.z += rotationSpeed * 0.2;
  });

  const material = isGold ? (
    <meshStandardMaterial
      color={COLORS.gold}
      emissive={COLORS.gold}
      emissiveIntensity={0.18}
      metalness={0.85}
      roughness={0.22}
    />
  ) : (
    <meshStandardMaterial color={COLORS.blueDark} metalness={0.5} roughness={0.55} />
  );

  // Angle de la diagonale (de top-left bar à bottom-right bar)
  const diagAngle = Math.atan2(geos.SPAN, geos.HEIGHT);

  const groupProps: ThreeElements['group'] = {
    ref,
    position,
    rotation,
    scale,
  };

  return (
    <group {...groupProps}>
      {/* Barre verticale gauche */}
      <mesh
        position={[-geos.SPAN / 2, 0, 0]}
        geometry={geos.bar}
        castShadow
        receiveShadow
      >
        {material}
      </mesh>
      {/* Barre verticale droite */}
      <mesh position={[geos.SPAN / 2, 0, 0]} geometry={geos.bar} castShadow receiveShadow>
        {material}
      </mesh>
      {/* Diagonale (de haut-gauche vers bas-droit) */}
      <mesh
        rotation={[0, 0, -diagAngle]}
        geometry={geos.diagonal}
        castShadow
        receiveShadow
      >
        {material}
      </mesh>
    </group>
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
  const geos = useNGeometries();
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
        <NLetter key={i} {...p} geos={geos} />
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
