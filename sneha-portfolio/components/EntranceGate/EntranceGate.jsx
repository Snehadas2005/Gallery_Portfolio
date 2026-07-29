'use client';

import { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { useEnterTransition } from '@/hooks/useEnterTransition';
import '@/styles/entrance-gate.css';

const DoorwayScene = dynamic(() => import('./DoorwayScene'), { ssr: false });

/**
 * EntranceGate — fullscreen immersive landing page.
 *
 * Layout:
 *   - Fixed full-viewport 3D Canvas (the entrance scene)
 *   - Invisible scroll-spacer div so the browser has scrollable height
 *   - Gallery div (initially opacity: 0) revealed after the GSAP transition
 *
 * Scroll down OR click the floating arrow → GSAP camera zoom → canvas fades
 * out → gallery slides in. Scroll back up to reverse and restore the entrance.
 */
export default function EntranceGate() {
  const cameraRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const galleryRef = useRef(null);

  // useEnterTransition builds the GSAP timeline and returns the click trigger
  const startTransition = useEnterTransition({
    cameraRef,
    canvasWrapRef,
    galleryRef,
  });

  const handleEnter = useCallback(() => {
    startTransition();
  }, [startTransition]);

  return (
    <div className="entrance-gate-root">
      {/* ----- 3D Canvas (fixed, fullscreen) ----- */}
      <div ref={canvasWrapRef} className="entrance-gate-canvas-wrap">
        <Canvas
          camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 30 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          className="entrance-gate-canvas"
        >
          <DoorwayScene
            onEnter={handleEnter}
            cameraRef={cameraRef}
          />
        </Canvas>
      </div>

      {/* ----- Scroll spacer (invisible, enables scroll) ----- */}
      <div className="entrance-gate-spacer" aria-hidden="true" />

      {/* ----- Gallery content (revealed after entrance transition) ----- */}
      <div
        ref={galleryRef}
        className="entrance-gate-gallery"
        style={{ opacity: 0 }}
      >
        <div className="entrance-gate-gallery__inner">
          <div className="entrance-gate-gallery__badge">✦ Welcome</div>
          <h1 className="entrance-gate-gallery__title">
            The Gallery
          </h1>
          <p className="entrance-gate-gallery__desc">
            Explore a curated selection of projects spanning museum
            installations, digital experiences, and editorial design.
          </p>
          <div className="entrance-gate-gallery__grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="entrance-gate-gallery__card">
                <div className="entrance-gate-gallery__card-image" />
                <div className="entrance-gate-gallery__card-info">
                  <h3>Project {i}</h3>
                  <p>Category • 2026</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
