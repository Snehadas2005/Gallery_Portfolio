'use client';

import { Html } from '@react-three/drei';

/**
 * LeftPanel — "Armémuseum" headline + subhead rendered as a crisp
 * Html overlay positioned over the 3D red wall panel inside the arch.
 */
export default function LeftPanel() {
  return (
    <Html
      transform
      position={[-2.88, 1.8, -0.15]}
      distanceFactor={1.8}
    >
      <div className="entrance-left-panel">
        <span className="entrance-left-panel__badge">✦ Est. 2024</span>

        <h1 className="entrance-left-panel__headline">
          <span className="entrance-left-panel__headline-main">Armémuseum</span>
          <span className="entrance-left-panel__headline-sep" aria-hidden="true">—</span>
          <span className="entrance-left-panel__headline-sub">Sneha Das</span>
        </h1>

        <p className="entrance-left-panel__tagline">
          A showcase of work — design, direction &amp; the spaces between.
        </p>

        <div className="entrance-left-panel__divider" aria-hidden="true">
          <span className="entrance-left-panel__divider-line" />
          <span className="entrance-left-panel__divider-dot">◈</span>
          <span className="entrance-left-panel__divider-line" />
        </div>
      </div>
    </Html>
  );
}
