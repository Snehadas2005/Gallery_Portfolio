'use client';

import { Html } from '@react-three/drei';

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com', icon: 'GH' },
  { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'LI' },
  { label: 'Email', url: 'mailto:hello@snehadas.com', icon: '✉' },
  { label: 'X / Twitter', url: 'https://x.com', icon: '𝕏' },
];

/**
 * RightPanel — dark exhibition board rendered as a crisp Html
 * overlay in 3D space, containing the about copy + social pills.
 */
export default function RightPanel() {
  return (
    <Html
      transform
      position={[2.05, 1.15, -0.15]}
      distanceFactor={1.8}
    >
      <div className="entrance-right-panel">
        <div className="entrance-right-panel__board">
          <h2 className="entrance-right-panel__heading">About</h2>

          <p className="entrance-right-panel__text">
            B.Tech CSE (AI/ML) Student &amp; Frontend Developer.
            Passionate about crafting immersive digital experiences
            at the intersection of design and technology.
          </p>

          <p className="entrance-right-panel__text entrance-right-panel__text--focus">
            Currently focused on Full-Stack Web Development,
            Open Source contributions, and Machine Learning.
          </p>

          <div className="entrance-right-panel__meta">
            <div className="entrance-right-panel__meta-row">
              <span className="entrance-right-panel__meta-label">Location</span>
              <span className="entrance-right-panel__meta-value">Stockholm, SE</span>
            </div>
            <div className="entrance-right-panel__meta-row">
              <span className="entrance-right-panel__meta-label">Focus</span>
              <span className="entrance-right-panel__meta-value">Full-Stack · AI · Design</span>
            </div>
            <div className="entrance-right-panel__meta-row">
              <span className="entrance-right-panel__meta-label">Role</span>
              <span className="entrance-right-panel__meta-value">Frontend Developer</span>
            </div>
          </div>

          <div className="entrance-right-panel__socials">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="entrance-right-panel__pill"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="entrance-right-panel__pill-icon">{link.icon}</span>
                {link.label}
                <span className="entrance-right-panel__pill-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Html>
  );
}
