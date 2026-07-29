'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * ArchShell — extruded stone arch mesh.
 * Builds the vaulted museum doorway geometry from a THREE.Shape
 * with a semicircular hole for the portal opening.
 */
export default function ArchShell() {
  const { shape, geomArgs } = useMemo(() => {
    const s = new THREE.Shape();

    // Outer boundary: classic European museum portal
    s.moveTo(-3.8, -3);
    s.lineTo(-3.8, 1.2);
    s.quadraticCurveTo(-3.8, 4.2, 0, 4.2);
    s.quadraticCurveTo(3.8, 4.2, 3.8, 1.2);
    s.lineTo(3.8, -3);
    s.lineTo(-3.8, -3);

    // Doorway cutout (semicircular arch)
    const hole = new THREE.Path();
    hole.moveTo(-1.3, -3);
    hole.lineTo(-1.3, 1.2);
    hole.quadraticCurveTo(-1.3, 3.4, 0, 3.4);
    hole.quadraticCurveTo(1.3, 3.4, 1.3, 1.2);
    hole.lineTo(1.3, -3);
    s.holes.push(hole);

    return {
      shape: s,
      geomArgs: { depth: 0.7, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.06, bevelSegments: 6 },
    };
  }, []);

  return (
    <mesh receiveShadow>
      <extrudeGeometry args={[shape, geomArgs]} />
      <meshStandardMaterial
        color="#D8D3C8"
        roughness={0.92}
        metalness={0.03}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
