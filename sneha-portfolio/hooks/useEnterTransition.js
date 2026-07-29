'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * useEnterTransition — bidirectional GSAP entrance transition.
 *
 * On scroll down past threshold → timeline plays forward (camera zoom, canvas
 * fade, gallery reveal). On scroll back up before threshold → timeline reverses,
 * restoring the entrance scene. Clicking the arrow does the same as scrolling
 * down (and also smooth-scrolls the page).
 */
export function useEnterTransition({
  cameraRef,
  canvasWrapRef,
  galleryRef,
  onEnterComplete,
  onReverseComplete,
}) {
  const tlRef = useRef(null);
  const readyRef = useRef(false);
  const stateRef = useRef('idle'); // 'idle' | 'playing' | 'reversing' | 'done'

  useEffect(() => {
    let gsap;
    let timeline = null;
    let mounted = true;

    async function setup() {
      const gsapModule = await import('gsap').catch(() => null);
      if (!gsapModule || !mounted) return;

      gsap = gsapModule.default || gsapModule;

      // Poll for camera (set by DoorwayScene after Canvas mount)
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        if (cameraRef.current && canvasWrapRef.current && galleryRef.current) {
          clearInterval(poll);
          if (mounted) buildTimeline(gsap);
        } else if (attempts > 60) {
          clearInterval(poll);
        }
      }, 50);
    }

    function buildTimeline(gsap) {
      const camera = cameraRef.current;
      const canvasEl = canvasWrapRef.current;
      const galleryEl = galleryRef.current;

      if (!camera || !canvasEl || !galleryEl) return;

      // Ensure gallery starts hidden
      gsap.set(galleryEl, { opacity: 0, y: 40 });

      timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          stateRef.current = 'done';
          if (onEnterComplete) onEnterComplete();
        },
        onReverseComplete: () => {
          stateRef.current = 'idle';
          if (onReverseComplete) onReverseComplete();
        },
      });

      // 1. Camera zoom forward through the doorway
      timeline.to(camera.position, {
        z: 2.5,
        duration: 1.6,
        ease: 'power2.inOut',
      });

      // 2. Slight camera lift — "stepping through" feel
      timeline.to(camera.position, {
        y: 0.8,
        duration: 0.6,
        ease: 'power1.out',
      }, '-=0.8');

      // 3. Fade the 3D canvas wrapper
      timeline.to(canvasEl, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.in',
      }, '-=0.3');

      // 4. Reveal gallery content (slide up + fade in)
      timeline.to(galleryEl, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'y',
      }, '-=0.4');

      tlRef.current = timeline;
      readyRef.current = true;

      // ---- Scroll listener (bidirectional) ----
      const SCROLL_THRESHOLD = 150; // px
      let lastScrollY = window.scrollY;

      const onScroll = () => {
        const sy = window.scrollY;
        const goingDown = sy > lastScrollY + 5;
        const goingUp = sy < lastScrollY - 5;
        const pastThreshold = sy > SCROLL_THRESHOLD;
        const progress = timeline.progress();

        // Scrolling down past threshold → play forward
        if (goingDown && pastThreshold && progress < 1) {
          if (stateRef.current !== 'playing') {
            stateRef.current = 'playing';
            timeline.play();
          }
        }

        // Scrolling back up before threshold → reverse
        if (goingUp && !pastThreshold && progress > 0) {
          if (stateRef.current !== 'reversing') {
            stateRef.current = 'reversing';
            timeline.reverse();
          }
        }

        lastScrollY = sy;
      };

      window.addEventListener('scroll', onScroll, { passive: true });

      // Cleanup
      timeline._cleanup = () => {
        window.removeEventListener('scroll', onScroll);
        timeline.kill();
      };
    }

    setup();

    return () => {
      mounted = false;
      if (tlRef.current) {
        if (tlRef.current._cleanup) tlRef.current._cleanup();
        tlRef.current.kill();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click trigger — scroll the page down (so the scroll handler also sees it)
  const trigger = useCallback(() => {
    const tl = tlRef.current;
    if (!tl || !readyRef.current) return;

    const progress = tl.progress();
    if (progress < 1 && stateRef.current !== 'playing') {
      stateRef.current = 'playing';
      // Smooth-scroll the page toward the gallery area
      window.scrollTo({
        top: window.innerHeight + 80,
        behavior: 'smooth',
      });
      tl.play();
    }
  }, []);

  return trigger;
}
