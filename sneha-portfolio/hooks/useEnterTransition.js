'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * useEnterTransition — Sets up GSAP + ScrollTrigger camera zoom and fade.
 *
 * Returns a `triggerTransition` function callable on both click and scroll.
 *
 * Flow:
 *   1. Waits for cameraRef.current to be populated (by DoorwayScene).
 *   2. Builds a GSAP timeline: camera zoom → canvas fade → gallery reveal.
 *   3. Wires ScrollTrigger so scrolling past the viewport triggers the timeline.
 *   4. Returns the play function so EntranceGate can also call it on click.
 */
export function useEnterTransition({
  cameraRef,
  canvasWrapRef,
  galleryRef,
  onEnterComplete,
}) {
  const tlRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    let gsap, ScrollTrigger;
    let timeline = null;
    let mounted = true;

    async function setup() {
      // Dynamic import so it degrades gracefully if GSAP isn't installed
      const gsapModule = await import('gsap').catch(() => null);
      if (!gsapModule || !mounted) return;

      gsap = gsapModule.default || gsapModule;
      const stModule = await import('gsap/ScrollTrigger').catch(() => null);
      if (stModule) {
        ScrollTrigger = stModule.default || stModule;
        gsap.registerPlugin(ScrollTrigger);
      }

      // Wait for camera to be populated by DoorwayScene (max ~3 s)
      let attempts = 0;
      const poll = setInterval(() => {
        attempts++;
        if (cameraRef.current && canvasWrapRef.current) {
          clearInterval(poll);
          if (mounted) buildTimeline(gsap, ScrollTrigger);
        } else if (attempts > 60) {
          clearInterval(poll);
        }
      }, 50);
    }

    function buildTimeline(gsap, ScrollTrigger) {
      const camera = cameraRef.current;
      const canvasEl = canvasWrapRef.current;
      const galleryEl = galleryRef.current;

      if (!camera || !canvasEl || !galleryEl) return;

      // Ensure the gallery starts hidden
      gsap.set(galleryEl, { opacity: 0, y: 40 });

      timeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          readyRef.current = false;
          if (onEnterComplete) onEnterComplete();
        },
      });

      // 1. Camera zoom forward through the doorway
      timeline.to(camera.position, {
        z: 2.2,
        duration: 1.6,
        ease: 'power2.inOut',
      });

      // 2. Slight camera lift for a "stepping through" feel
      timeline.to(camera.position, {
        y: 1.0,
        duration: 0.6,
        ease: 'power1.out',
      }, '-=0.8');

      // 3. Fade the canvas wrapper
      timeline.to(canvasEl, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.in',
      }, '-=0.3');

      // 4. Reveal gallery content
      timeline.to(galleryEl, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'y',
      }, '-=0.4');

      tlRef.current = timeline;
      readyRef.current = true;

      // ---- ScrollTrigger ----
      if (ScrollTrigger) {
        ScrollTrigger.create({
          trigger: canvasEl,
          start: 'top -1px',
          onUpdate: (self) => {
            if (
              self.direction === 1 &&
              self.progress > 0 &&
              readyRef.current
            ) {
              readyRef.current = false;
              timeline.play();
            }
          },
        });
      }

      // ---- Scroll event fallback (works even without ScrollTrigger) ----
      let scrollTriggered = false;
      const onScroll = () => {
        if (
          !scrollTriggered &&
          window.scrollY > 20 &&
          readyRef.current
        ) {
          scrollTriggered = true;
          readyRef.current = false;
          timeline.play();
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true, once: false });

      // Cleanup on unmount
      const cleanup = () => {
        window.removeEventListener('scroll', onScroll);
        if (timeline) timeline.kill();
        if (ScrollTrigger) {
          ScrollTrigger.getAll().forEach((st) => st.kill());
        }
      };

      // Store cleanup on the timeline
      timeline._cleanup = cleanup;
    }

    setup();

    return () => {
      mounted = false;
      if (tlRef.current) {
        if (tlRef.current._cleanup) tlRef.current._cleanup();
        tlRef.current.kill();
      }
    };
  }, [cameraRef, canvasWrapRef, galleryRef, onEnterComplete]);

  // Return a stable trigger function for click events
  const trigger = useCallback(() => {
    if (tlRef.current && readyRef.current) {
      readyRef.current = false;
      tlRef.current.play();
    }
  }, []);

  return trigger;
}
