import React, { useRef, useEffect } from 'react';

interface AudioWaveOrbitParticlesProps {
  isHovered: boolean;
}

interface Particle {
  id: number;
  spokeIndex: number;
  segmentIndex: number;
  totalSegments: number;
  // Rest (Wave) configuration
  angle: number;
  restRadius: number;
  // 3D Orbit configuration
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitInclination: number; // inclination angle in radians
  orbitAzimuth: number;
  orbitZOffset: number;
  size: number;
  colorType: 'gold' | 'emerald' | 'cyan' | 'carbon';
}

export const AudioWaveOrbitParticles: React.FC<AudioWaveOrbitParticlesProps> = ({ isHovered }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 540);
    let height = (canvas.height = 540);

    const centerX = width / 2;
    const centerY = height / 2;

    const SPOKES_COUNT = 68;
    const MAX_SEGMENTS_PER_SPOKE = 8;
    const BASE_RADIUS = 138;
    const SEGMENT_SPACING = 5.2;

    const particles: Particle[] = [];
    let pId = 0;

    for (let s = 0; s < SPOKES_COUNT; s++) {
      const angle = (s / SPOKES_COUNT) * Math.PI * 2;
      for (let seg = 0; seg < MAX_SEGMENTS_PER_SPOKE; seg++) {
        // Random color distribution for 3D space particles
        const rand = Math.random();
        let colorType: 'gold' | 'emerald' | 'cyan' | 'carbon' = 'carbon';
        if (rand < 0.35) colorType = 'gold';
        else if (rand < 0.55) colorType = 'emerald';
        else if (rand < 0.7) colorType = 'cyan';

        const orbitRadius = BASE_RADIUS + 30 + Math.random() * 85;
        const orbitSpeed = (0.4 + Math.random() * 0.8) * (Math.random() > 0.5 ? 1 : -1);
        const orbitInclination = (Math.random() - 0.5) * Math.PI * 0.65;
        const orbitAzimuth = Math.random() * Math.PI * 2;
        const orbitZOffset = (Math.random() - 0.5) * 140;

        particles.push({
          id: pId++,
          spokeIndex: s,
          segmentIndex: seg,
          totalSegments: MAX_SEGMENTS_PER_SPOKE,
          angle,
          restRadius: BASE_RADIUS + seg * SEGMENT_SPACING,
          orbitRadius,
          orbitSpeed,
          orbitPhase: Math.random() * Math.PI * 2,
          orbitInclination,
          orbitAzimuth,
          orbitZOffset,
          size: 2.2 + Math.random() * 2.2,
          colorType,
        });
      }
    }

    let hoverTransition = 0; // 0 = rest wave, 1 = 3D orbit
    let time = 0;

    const render = () => {
      time += 0.024;

      // Smooth interpolation for hover state
      const targetHover = isHovered ? 1 : 0;
      hoverTransition += (targetHover - hoverTransition) * 0.085;

      ctx.clearRect(0, 0, width, height);

      // Precalculate dynamic wave heights per spoke for the audio waveform
      const spokeHeights: number[] = [];
      for (let s = 0; s < SPOKES_COUNT; s++) {
        const theta = (s / SPOKES_COUNT) * Math.PI * 2;
        // Complex layered audio frequencies
        const f1 = Math.sin(theta * 4 + time * 3.2);
        const f2 = Math.cos(theta * 2 - time * 2.1);
        const f3 = Math.sin(theta * 8 + time * 5.0) * 0.5;
        const f4 = Math.sin(theta * 14 - time * 1.5) * 0.3;
        const rawAmp = (f1 + f2 + f3 + f4 + 2.5) / 4.8;
        const clampedAmp = Math.max(0.15, Math.min(1.0, rawAmp));
        spokeHeights.push(Math.round(clampedAmp * (MAX_SEGMENTS_PER_SPOKE - 1)));
      }

      // Sort particles by Z-depth when in 3D orbit mode so foreground particles overlap background
      const renderedParticles: {
        x: number;
        y: number;
        z: number;
        w: number;
        h: number;
        rot: number;
        alpha: number;
        color: string;
        glow: boolean;
        isSegment: boolean;
      }[] = [];

      for (const p of particles) {
        const activeSegments = spokeHeights[p.spokeIndex];
        const isSegmentVisibleInWave = p.segmentIndex <= activeSegments;

        // --- 1. WAVE POSITION (2D Radial Equalizer) ---
        const waveX = centerX + Math.cos(p.angle) * p.restRadius;
        const waveY = centerY + Math.sin(p.angle) * p.restRadius;
        const waveZ = 0;

        // Wave segment geometry
        const segWidth = 3.2;
        const segHeight = 2.0;
        const waveAlpha = isSegmentVisibleInWave ? 0.88 : 0.0;

        // --- 2. 3D ORBITAL PARTICLE POSITION ---
        const orbitAngle = p.orbitPhase + time * p.orbitSpeed;
        
        // 3D Orbital Coordinate calculation with inclination
        const localX = Math.cos(orbitAngle) * p.orbitRadius;
        const localY = Math.sin(orbitAngle) * p.orbitRadius * Math.sin(p.orbitInclination) + Math.sin(orbitAngle * 2 + p.id) * 15;
        const localZ = Math.sin(orbitAngle) * p.orbitRadius * Math.cos(p.orbitInclination) + p.orbitZOffset;

        // Overall continuous global 3D precession rotation
        const globalRotY = time * 0.45;
        const globalRotX = 0.28 + Math.sin(time * 0.2) * 0.1;

        // Rotate around Y
        const cosY = Math.cos(globalRotY);
        const sinY = Math.sin(globalRotY);
        const rotX1 = localX * cosY - localZ * sinY;
        const rotZ1 = localX * sinY + localZ * cosY;

        // Rotate around X
        const cosX = Math.cos(globalRotX);
        const sinX = Math.sin(globalRotX);
        const rotY2 = localY * cosX - rotZ1 * sinX;
        const rotZ2 = localY * sinX + rotZ1 * cosX;

        // 3D Perspective Projection
        const fov = 420;
        const perspective = fov / (fov + rotZ2);
        const orbitScreenX = centerX + rotX1 * perspective;
        const orbitScreenY = centerY + rotY2 * perspective;
        const orbitZ = rotZ2;

        // --- 3. MORPH / BLEND BETWEEN WAVE AND 3D ORBIT ---
        const curX = waveX + (orbitScreenX - waveX) * hoverTransition;
        const curY = waveY + (orbitScreenY - waveY) * hoverTransition;
        const curZ = waveZ + (orbitZ - waveZ) * hoverTransition;

        // Alpha calculation: in rest wave, hide inactive segments; in hover orbit, show all orbiting particles!
        const orbitAlpha = Math.max(0.25, Math.min(1.0, (curZ + 180) / 360));
        const finalAlpha = waveAlpha + (orbitAlpha - waveAlpha) * hoverTransition;

        if (finalAlpha <= 0.01) continue;

        // Color transition
        let color = 'rgba(24, 24, 27, '; // Carbon by default
        let isGlow = false;

        if (hoverTransition > 0.15) {
          if (p.colorType === 'gold') {
            color = 'rgba(245, 158, 11, ';
            isGlow = true;
          } else if (p.colorType === 'emerald') {
            color = 'rgba(16, 185, 129, ';
            isGlow = true;
          } else if (p.colorType === 'cyan') {
            color = 'rgba(6, 182, 212, ';
            isGlow = true;
          } else {
            color = 'rgba(39, 39, 42, ';
          }
        }

        // Particle shape transition: from rotated rectangle to glowing sphere/pill
        const curW = segWidth + (p.size * perspective - segWidth) * hoverTransition;
        const curH = segHeight + (p.size * perspective - segHeight) * hoverTransition;
        const curRot = p.angle + Math.PI / 2 + (orbitAngle - (p.angle + Math.PI / 2)) * hoverTransition;

        renderedParticles.push({
          x: curX,
          y: curY,
          z: curZ,
          w: Math.max(1.2, curW),
          h: Math.max(1.2, curH),
          rot: curRot,
          alpha: finalAlpha,
          color,
          glow: isGlow && hoverTransition > 0.4,
          isSegment: hoverTransition < 0.35,
        });
      }

      // Sort by Z for proper 3D depth rendering
      renderedParticles.sort((a, b) => a.z - b.z);

      // Draw faint 3D orbital trajectory guide rings when hovering
      if (hoverTransition > 0.25) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time * 0.12);
        
        // Ring 1 (Gold)
        ctx.beginPath();
        ctx.ellipse(0, 0, 195, 80, -Math.PI / 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.12 * hoverTransition})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        // Ring 2 (Cyan/Emerald)
        ctx.beginPath();
        ctx.ellipse(0, 0, 175, 65, Math.PI / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.14 * hoverTransition})`;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([6, 8]);
        ctx.stroke();

        ctx.restore();
      }

      // Draw each particle
      for (const pt of renderedParticles) {
        ctx.save();
        ctx.translate(pt.x, pt.y);

        if (pt.glow) {
          ctx.shadowBlur = 8 * hoverTransition;
          ctx.shadowColor = pt.color + '0.8)';
        }

        ctx.fillStyle = `${pt.color}${pt.alpha})`;

        if (pt.isSegment) {
          // Draw rotated rectangular equalizer bar segment
          ctx.rotate(pt.rot);
          ctx.fillRect(-pt.w / 2, -pt.h / 2, pt.w, pt.h);
        } else {
          // Draw 3D glowing orbital space particle
          ctx.beginPath();
          ctx.arc(0, 0, pt.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};
