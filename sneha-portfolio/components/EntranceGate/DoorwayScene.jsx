'use client';

import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

import ArchShell from './ArchShell';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import FloatingMarker from './FloatingMarker';

/**
 * DoorwayScene — the complete 3D entrance gate.
 * Composes arch geometry, red wall, dark board,
 * floor, doorway glow, floating marker, and lighting.
 */
export default function DoorwayScene({ onEnter, cameraRef }) {
  const { camera, gl } = useThree();

  // Expose camera for GSAP transitions in the parent hook
  useEffect(() => {
    if (cameraRef) {
      cameraRef.current = camera;
    }
  }, [camera, cameraRef]);

  // Left red wall: an arched shape filling the left half of the interior
  const leftWallShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-3.5, -2.9);
    s.lineTo(-3.5, 1.1);
    s.quadraticCurveTo(-3.5, 4.0, 0, 4.0);
    s.lineTo(0, 4.0);
    s.lineTo(0, -2.9);
    s.closePath();
    return s;
  }, []);

  // Right panel (dark exhibition board) geometry
  const rightBoardShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -2.5);
    s.lineTo(0, 3.2);
    s.lineTo(0.01, 3.2);
    s.lineTo(0.01, -2.5);
    s.closePath();
    return s;
  }, []);

  return (
    <group>
      {/* ===== LIGHTING ===== */}
      <ambientLight intensity={0.25} color="#f0e8d8" />
      <directionalLight
        position={[4, 6, 4]}
        intensity={1.2}
        color="#ffdbb5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[-3, 2, -1]}
        intensity={0.3}
        color="#6688bb"
      />
      {/* Warm threshold light glowing from the doorway */}
      <pointLight
        position={[0, 0.8, -1.8]}
        intensity={1.0}
        distance={5}
        decay={2}
        color="#f5c882"
      />
      {/* Fill light for the interior */}
      <pointLight
        position={[0, 1.5, -3]}
        intensity={0.5}
        distance={6}
        color="#f5d7a0"
      />

      {/* ===== FLOOR ===== */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.95, -0.8]}
        receiveShadow
      >
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          color="#8b7f6e"
          roughness={0.95}
          metalness={0}
        />
      </mesh>

      {/* ===== STONE ARCH FRAME ===== */}
      <group position={[0, 0, 0]}>
        <ArchShell />
      </group>

      {/* ===== LEFT RED WALL (crimson curved panel) ===== */}
      <mesh
        position={[0, 0, -0.3]}
        receiveShadow
      >
        <shapeGeometry args={[leftWallShape]} />
        <meshStandardMaterial
          color="#C81D25"
          roughness={0.55}
          metalness={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Red wall gradient accent — a subtle inner glow plane */}
      <mesh position={[-1.6, 0.5, -0.28]}>
        <planeGeometry args={[2.8, 5.0]} />
        <meshBasicMaterial
          color="#A8131A"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ===== RIGHT DARK EXHIBITION BOARD ===== */}
      <group position={[2.1, -0.15, -0.3]}>
        {/* Main board */}
        <mesh receiveShadow>
          <boxGeometry args={[1.7, 4.8, 0.08]} />
          <meshStandardMaterial
            color="#18181C"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>
        {/* Subtle edge highlight */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.6, 4.6]} />
          <meshBasicMaterial
            color="#2a2a30"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Thin gold border */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.62, 4.62]} />
          <meshBasicMaterial
            color="#d4a853"
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ===== DOORWAY WARM GLOW ===== */}
      <mesh position={[0, 0.6, -1.2]}>
        <planeGeometry args={[2.0, 4.0]} />
        <meshBasicMaterial
          color="#f5d7a0"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bright threshold strip at floor level */}
      <mesh position={[0, -2.6, -0.8]}>
        <planeGeometry args={[2.4, 0.6]} />
        <meshBasicMaterial
          color="#fae6c8"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* ===== TEXT OVERLAYS (via Html) ===== */}
      <LeftPanel />
      <RightPanel />

      {/* ===== FLOATING INTERACTION MARKER ===== */}
      <FloatingMarker onEnter={onEnter} />

      {/* ===== ENVIRONMENT (subtle IBL) ===== */}
      <Environment preset="studio" />
    </group>
  );
}
