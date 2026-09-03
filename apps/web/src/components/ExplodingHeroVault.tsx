import React, { useState } from 'react';
import { AudioWaveOrbitParticles } from './AudioWaveOrbitParticles';

export const ExplodingHeroVault: React.FC = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className="relative w-full max-w-[520px] aspect-square flex items-center justify-center select-none cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
    >
      {/* 3D Audio Waveform & Orbital Space Particles */}
      <AudioWaveOrbitParticles isHovered={isHovered} />

      {/* 3D Perspective Stage */}
      <div className="relative w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] flex items-center justify-center [perspective:1200px] z-20">
        
        {/* Layer 4: Titanium Base Chassis (GhostPool) */}
        <div
          style={{
            transform: isHovered
              ? 'translate3d(18px, 65px, -60px) rotateX(12deg) rotateY(-8deg) scale(0.92)'
              : 'translate3d(0, 0, 0) scale(1)',
            transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <img
            src="/assets/vault.png"
            alt="Base Chassis"
            className="w-full h-full object-contain drop-shadow-2xl opacity-35 brightness-75 filter blur-[0.5px]"
          />

          {/* Floating Tag */}
          <div
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            }}
            className="absolute -bottom-3 right-2 bg-black text-white px-3 py-1 rounded-full text-[10px] font-mono border border-zinc-700 shadow-xl flex items-center gap-1.5 z-40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span>04. GhostPool (euint64 Ledger)</span>
          </div>
        </div>

        {/* Layer 3: Confidential Yield Chamber (GhostVault) */}
        <div
          style={{
            transform: isHovered
              ? 'translate3d(-20px, 20px, -20px) rotateX(10deg) rotateY(-5deg) scale(0.98)'
              : 'translate3d(0, 0, 0) scale(1)',
            transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className={`w-[78%] h-[78%] rounded-3xl border-2 transition-all duration-700 ${
              isHovered
                ? 'border-emerald-500/80 bg-emerald-500/10 backdrop-blur-xs shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                : 'border-transparent'
            }`}
          />

          {/* Floating Tag */}
          <div
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
            }}
            className="absolute -left-6 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 rounded-full text-[10px] font-mono border border-emerald-800 shadow-xl flex items-center gap-1.5 z-40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>03. GhostVault (Yield Chamber)</span>
          </div>
        </div>

        {/* Layer 2: Torus FHE Randomness Rotor (GhostDraw) */}
        <div
          style={{
            transform: isHovered
              ? 'translate3d(35px, -25px, 45px) rotateX(6deg) rotateY(-12deg) rotateZ(45deg) scale(1.04)'
              : 'translate3d(0, 0, 0) rotateZ(0deg) scale(1)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className={`w-[60%] h-[60%] rounded-full border-2 border-dashed transition-all duration-700 flex items-center justify-center ${
              isHovered
                ? 'border-amber-400/80 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.25)] animate-spin-slow'
                : 'border-transparent'
            }`}
          >
            {isHovered && (
              <div className="w-[82%] h-[82%] rounded-full border border-amber-300/40" />
            )}
          </div>

          {/* Floating Tag */}
          <div
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
            className="absolute -top-3 right-0 bg-black text-white px-3 py-1 rounded-full text-[10px] font-mono border border-amber-700 shadow-xl flex items-center gap-1.5 z-40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>02. GhostDraw (FHE Rotor)</span>
          </div>
        </div>

        {/* Layer 1: Front Bezel & Verifier Dial (GhostVerifier) */}
        <div
          style={{
            transform: isHovered
              ? 'translate3d(-25px, -65px, 95px) rotateX(4deg) rotateY(6deg) scale(1.08)'
              : 'translate3d(0, 0, 0) scale(1)',
            transition: 'all 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src="/assets/vault.png"
            alt="Ghost Vault"
            className={`w-full h-full object-contain drop-shadow-2xl transition-all duration-700 ${
              isHovered ? 'brightness-110 drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)]' : ''
            }`}
          />

          {/* Floating Tag */}
          <div
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
            }}
            className="absolute -top-7 -left-2 bg-white text-black px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold border border-zinc-300 shadow-2xl flex items-center gap-1.5 z-50 ring-2 ring-black/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
            <span>01. GhostVerifier (State Verifier)</span>
          </div>
        </div>

        {/* Blueprint Connection Lines during hover */}
        {isHovered && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 opacity-60">
            <line x1="120" y1="90" x2="200" y2="170" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="280" y1="120" x2="210" y2="190" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="90" y1="210" x2="180" y2="220" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="250" y1="300" x2="200" y2="240" stroke="#71717a" strokeWidth="1.2" strokeDasharray="3 3" />
          </svg>
        )}

      </div>

    </div>
  );
};
