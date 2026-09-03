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
  orbitInclination: number;
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
    const width = (canvas.width = 640);
    const height = (canvas.height = 640);

    const centerX = width / 2;
    const centerY = height / 2;

    const SPOKES_COUNT = 84;
    const MAX_SEGMENTS_PER_SPOKE = 10;
    // Outer perimeter start radius (just outside the ~280-300px vault box)
    const BASE_RADIUS = 162;
    const SEGMENT_SPACING = 5.6;

    // Generate fixed rhythmic spectrum profile (peaks and valleys matching reference image)
    const baseSpectrumProfile: number[] = [];
    for (let s = 0; s < SPOKES_COUNT; s++) {
      const theta = (s / SPOKES_COUNT) * Math.PI * 2;
      // Realistic equalizer frequency distribution
      const p1 = Math.exp(-Math.pow((theta - 0.75) / 0.45, 2)) * 8.5;
      const p2 = Math.exp(-Math.pow((theta - 2.15) / 0.5, 2)) * 9.5;
      const p3 = Math.exp(-Math.pow((theta - 3.75) / 0.45, 2)) * 8.0;
      const p4 = Math.exp(-Math.pow((theta - 5.05) / 0.55, 2)) * 10.0;
      const base = 2.8 + Math.sin(theta * 6) * 1.3 + Math.cos(theta * 12) * 0.9;
      const rawCount = base + p1 + p2 + p3 + p4;
      baseSpectrumProfile.push(Math.max(2, Math.min(MAX_SEGMENTS_PER_SPOKE, Math.round(rawCount))));
    }

    const particles: Particle[] = [];
    let pId = 0;

    for (let s = 0; s < SPOKES_COUNT; s++) {
      // Start from top (-PI/2) and go clockwise
      const angle = -Math.PI / 2 + (s / SPOKES_COUNT) * Math.PI * 2;
      for (let seg = 0; seg < MAX_SEGMENTS_PER_SPOKE; seg++) {
        const rand = Math.random();
        let colorType: 'gold' | 'emerald' | 'cyan' | 'carbon' = 'carbon';
        if (rand < 0.4) colorType = 'gold';
        else if (rand < 0.6) colorType = 'emerald';
        else if (rand < 0.75) colorType = 'cyan';

        const orbitRadius = BASE_RADIUS + 30 + Math.random() * 95;
        const orbitSpeed = (0.35 + Math.random() * 0.75) * (Math.random() > 0.5 ? 1 : -1);
        const orbitInclination = (Math.random() - 0.5) * Math.PI * 0.75;
        const orbitAzimuth = Math.random() * Math.PI * 2;
        const orbitZOffset = (Math.random() - 0.5) * 160;

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
          size: 2.4 + Math.random() * 2.5,
          colorType,
        });
      }
    }

    let hoverTransition = 0;
    let time = 0;

    const render = () => {
      time += 0.024;

      // Smooth hover interpolation
      const targetHover = isHovered ? 1 : 0;
      hoverTransition += (targetHover - hoverTransition) * 0.085;

      ctx.clearRect(0, 0, width, height);

      // --- LOOPING SEQUENTIAL BEAT WAVE CYCLE (Every 3.6 seconds) ---
      const CYCLE_DURATION = 3.6;
      const cycleTime = time % CYCLE_DURATION;
      const progressInCycle = cycleTime / CYCLE_DURATION;

      // Phase 1: 0.0 -> 0.72 (Spokes sweep and appear clockwise around the vault)
      // Phase 2: 0.72 -> 0.95 (Full circle formed and pulsating to the audio beat)
      // Phase 3: 0.95 -> 1.0 (Smooth transition into next cycle)
      const sweepHead = Math.min(1.0, progressInCycle / 0.72);
      const activeMaxSpoke = Math.floor(sweepHead * SPOKES_COUNT);

      // Audio beat pulsing multiplier
      const beatPulse = Math.sin(time * 8.5) * 0.22 + Math.sin(time * 17) * 0.12;

      // Rendered particle buffer for sorting by Z-depth
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
        // In rest wave mode, spoke only renders if the sweep has reached it
        const isSpokeActivated = p.spokeIndex <= activeMaxSpoke;
        
        // Base height from spectrum profile + beat oscillation
        const baseHeight = baseSpectrumProfile[p.spokeIndex];
        const dynamicHeight = Math.max(1, Math.min(MAX_SEGMENTS_PER_SPOKE, Math.round(baseHeight + beatPulse * baseHeight)));

        // Reveal animation as the sweep hits this spoke: popping outwards
        const spokeRevealProgress = Math.max(0, Math.min(1, (activeMaxSpoke - p.spokeIndex) / 3.5));
        const effectiveSegments = Math.round(dynamicHeight * (progressInCycle > 0.72 ? 1 : spokeRevealProgress));

        const isSegmentVisibleInWave = isSpokeActivated && p.segmentIndex < effectiveSegments;

        // --- 1. WAVE POSITION (Outer Radial Equalizer Segments) ---
        const waveX = centerX + Math.cos(p.angle) * p.restRadius;
        const waveY = centerY + Math.sin(p.angle) * p.restRadius;
        const waveZ = 0;

        // Discrete rectangular block matching reference image
        const segWidth = 4.2;
        const segHeight = 2.4;
        const waveAlpha = isSegmentVisibleInWave ? 0.96 : 0.0;

        // --- 2. 3D ORBITAL PARTICLE POSITION ---
        const orbitAngle = p.orbitPhase + time * p.orbitSpeed;
        
        const localX = Math.cos(orbitAngle) * p.orbitRadius;
        const localY = Math.sin(orbitAngle) * p.orbitRadius * Math.sin(p.orbitInclination) + Math.sin(orbitAngle * 2 + p.id) * 18;
        const localZ = Math.sin(orbitAngle) * p.orbitRadius * Math.cos(p.orbitInclination) + p.orbitZOffset;

        // 3D Orbital precession & continuous rotation
        const globalRotY = time * 0.45;
        const globalRotX = 0.28 + Math.sin(time * 0.22) * 0.1;

        const cosY = Math.cos(globalRotY);
        const sinY = Math.sin(globalRotY);
        const rotX1 = localX * cosY - localZ * sinY;
        const rotZ1 = localX * sinY + localZ * cosY;

        const cosX = Math.cos(globalRotX);
        const sinX = Math.sin(globalRotX);
        const rotY2 = localY * cosX - rotZ1 * sinX;
        const rotZ2 = localY * sinX + rotZ1 * cosX;

        // Perspective Projection
        const fov = 440;
        const perspective = fov / (fov + rotZ2);
        const orbitScreenX = centerX + rotX1 * perspective;
        const orbitScreenY = centerY + rotY2 * perspective;
        const orbitZ = rotZ2;

        // --- 3. MORPH / BLEND BETWEEN WAVE AND 3D ORBIT ---
        const curX = waveX + (orbitScreenX - waveX) * hoverTransition;
        const curY = waveY + (orbitScreenY - waveY) * hoverTransition;
        const curZ = waveZ + (orbitZ - waveZ) * hoverTransition;

        const orbitAlpha = Math.max(0.3, Math.min(1.0, (curZ + 190) / 380));
        const finalAlpha = waveAlpha + (orbitAlpha - waveAlpha) * hoverTransition;

        if (finalAlpha <= 0.01) continue;

        // Color transition
        let color = 'rgba(0, 0, 0, '; // Solid jet black for the outer wave
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
            color = 'rgba(24, 24, 27, ';
          }
        }

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
        ctx.ellipse(0, 0, 215, 88, -Math.PI / 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.14 * hoverTransition})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        // Ring 2 (Emerald)
        ctx.beginPath();
        ctx.ellipse(0, 0, 195, 75, Math.PI / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(16, 185, 129, ${0.16 * hoverTransition})`;
        ctx.lineWidth = 1.0;
        ctx.setLineDash([6, 8]);
        ctx.stroke();

        ctx.restore();
      }

      // Draw each particle / segment
      for (const pt of renderedParticles) {
        ctx.save();
        ctx.translate(pt.x, pt.y);

        if (pt.glow) {
          ctx.shadowBlur = 9 * hoverTransition;
          ctx.shadowColor = pt.color + '0.85)';
        }

        ctx.fillStyle = `${pt.color}${pt.alpha})`;

        if (pt.isSegment) {
          // Discrete solid black rectangular audio equalizer segment block
          ctx.rotate(pt.rot);
          ctx.fillRect(-pt.w / 2, -pt.h / 2, pt.w, pt.h);
        } else {
          // 3D glowing orbital space particle
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
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
};
