'use client';

import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * EngravingPattern — generates a canvas texture with vintage
 * ornamental engraving line-art. Applied as an overlay on the
 * red left wall panel.
 */
export default function EngravingPattern({ width = 1024, height = 1200 }) {
  const canvasRef = useRef(null);
  const textureRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // Transparent background — the red wall shows through
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;

    // —— Central filigree medallion ——
    const cx = width / 2;
    const cy = height * 0.28;

    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.stroke();

    // Petals around medallion
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = cx + 72 * Math.cos(angle);
      const py = cy + 72 * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.stroke();
    }

    // —— Decorative scrollwork ——
    ctx.lineWidth = 1;
    const drawScroll = (startX, startY, dir) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (let t = 0; t < 3; t++) {
        const ox = t * 40 * dir;
        ctx.quadraticCurveTo(
          startX + ox + 20 * dir, startY - 30 - t * 20,
          startX + ox + 40 * dir, startY - t * 15
        );
      }
      ctx.stroke();
    };

    drawScroll(80, height * 0.5, 1);
    drawScroll(width - 80, height * 0.5, -1);

    // —— Horizontal ornamental bands ——
    for (let row = 0; row < 3; row++) {
      const y = height * (0.6 + row * 0.12);
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.moveTo(40, y);
      for (let x = 40; x < width - 40; x += 24) {
        ctx.lineTo(x + 12, y - 6);
        ctx.lineTo(x + 24, y);
      }
      ctx.stroke();
    }

    // —— Corner fleur-de-lis style accents ——
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 1.2;
    const corners = [
      [80, 60], [width - 80, 60],
      [80, height - 60], [width - 80, height - 60],
    ];
    for (const [cx2, cy2] of corners) {
      for (let ring = 0; ring < 3; ring++) {
        ctx.beginPath();
        ctx.arc(cx2, cy2, 20 + ring * 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // —— Diamond stud accents ——
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 14; i++) {
      const dx = 80 + (i % 7) * ((width - 160) / 6);
      const dy = height * 0.85 + (i >= 7 ? 30 : 0);
      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(Math.PI / 4);
      ctx.strokeRect(-5, -5, 10, 10);
      ctx.restore();
    }

    ctx.globalAlpha = 1;

    // Create Three.js texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    textureRef.current = texture;
  }, [width, height]);

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
}

/**
 * Hook to get the generated engraving texture for use as a material map.
 */
export function useEngravingTexture() {
  const texture = useRef(null);

  const Comp = useMemo(() => {
    return function EngravingTextureGenerator() {
      const localRef = useRef(null);

      useEffect(() => {
        if (localRef.current) {
          const canvas = localRef.current;
          const ctx = canvas.getContext('2d');
          const w = 1024, h = 1200;
          canvas.width = w;
          canvas.height = h;

          ctx.clearRect(0, 0, w, h);
          ctx.strokeStyle = 'rgba(255,215,0,0.2)';
          ctx.lineWidth = 1.5;

          const cx = w / 2;
          const cy = h * 0.28;
          ctx.beginPath();
          ctx.arc(cx, cy, 60, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy, 42, 0, Math.PI * 2);
          ctx.stroke();

          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const px = cx + 72 * Math.cos(a);
            const py = cy + 72 * Math.sin(a);
            ctx.beginPath();
            ctx.arc(px, py, 12, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Horizontal bands
          ctx.globalAlpha = 0.12;
          for (let row = 0; row < 3; row++) {
            const y = h * (0.6 + row * 0.12);
            ctx.beginPath();
            ctx.moveTo(40, y);
            for (let x = 40; x < w - 40; x += 24) {
              ctx.lineTo(x + 12, y - 6);
              ctx.lineTo(x + 24, y);
            }
            ctx.stroke();
          }

          ctx.globalAlpha = 1;
          const tex = new THREE.CanvasTexture(canvas);
          tex.needsUpdate = true;
          texture.current = tex;
        }
      }, []);

      return <canvas ref={localRef} style={{ display: 'none' }} />;
    };
  }, []);

  return { texture, Generator: Comp };
}
