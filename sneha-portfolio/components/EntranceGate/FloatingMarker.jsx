'use client';

import { useMemo, forwardRef } from 'react';
import * as THREE from 'three';
import { Float, Text } from '@react-three/drei';

/**
 * FloatingMarker — pulsing 3D "CLICK OR SCROLL TO ENTER" chevron + label
 * positioned in the center of the doorway opening.
 */
const FloatingMarker = forwardRef(function FloatingMarker({ onEnter }, ref) {
  const arrowGroupRef = useMemo(() => ({ current: null }), []);

  return (
    <group ref={ref}>
      <Float speed={1.8} rotationIntensity={0} floatIntensity={0.6}>
        <group position={[0, -0.6, 0.3]}>
          {/* Glow ring behind arrow */}
          <mesh>
            <ringGeometry args={[0.18, 0.28, 32]} />
            <meshBasicMaterial
              color="#d4a853"
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Arrow shaft */}
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.18]} />
            <meshStandardMaterial
              color="#e8e0d0"
              emissive="#d4a853"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Arrow head */}
          <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.06, 0.1, 8]} />
            <meshStandardMaterial
              color="#d4a853"
              emissive="#d4a853"
              emissiveIntensity={0.6}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>

          {/* Outer ring glow */}
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[0.2, 0.35, 32]} />
            <meshBasicMaterial
              color="#d4a853"
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </Float>

      {/* "ENTER" label below arrow */}
      <Text
        position={[0, -1.2, 0.3]}
        fontSize={0.12}
        color="#9a8f7f"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.25}
        font={undefined}
      >
        CLICK OR SCROLL TO ENTER
      </Text>

      {/* Invisible click plane */}
      <mesh
        position={[0, -0.6, 0.3]}
        onClick={onEnter}
        onPointerDown={onEnter}
        style={{ cursor: 'pointer' }}
      >
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
});

export default FloatingMarker;
