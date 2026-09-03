import React, { useState, useEffect } from 'react';
import { ArrowRight, Layers, Shield, Cpu, Lock, CheckCircle, RefreshCw } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { ExplodingHeroVault } from './ExplodingHeroVault';

interface HeroProps {
  onExploreClick?: () => void;
}

export const HeroAndExplodedSection: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [disassemblyFactor, setDisassemblyFactor] = useState<number>(0);
  const [isAutoAnimating, setIsAutoAnimating] = useState<boolean>(true);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  // Gentle auto pulse between assembled and disassembled when in view
  useEffect(() => {
    if (!isAutoAnimating) return;
    const interval = setInterval(() => {
      setDisassemblyFactor((prev) => (prev === 0 ? 80 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoAnimating]);

  const layers = [
    {
      id: 1,
      name: 'GhostVerifier',
      role: 'Outer Optical Bezel · Public State Root Verifier',
      description: 'Publishes cryptographic commitments and state roots to Ethereum Sepolia without revealing confidential values.',
      badge: 'Public Layer',
      offsetY: -80,
    },
    {
      id: 2,
      name: 'GhostDraw',
      role: 'Torus FHE Rotor · Blind Draw Evaluator',
      description: 'Executes homomorphic random selection across encrypted ticket weights without decrypting user balances.',
      badge: 'FHE Computation',
      offsetY: -25,
    },
    {
      id: 3,
      name: 'GhostVault',
      role: 'Confidential Yield Chamber · Harvest Engine',
      description: 'Accumulates protocol yield and routes prize disbursements into recipient encrypted accounts.',
      badge: 'Confidential Yield',
      offsetY: 30,
    },
    {
      id: 4,
      name: 'GhostPool',
      role: 'Titanium Base Chassis · euint64 Ledger',
      description: 'Core encrypted accounting contract storing user balances and positions strictly as ciphertexts.',
      badge: 'Encrypted Core',
      offsetY: 85,
    },
  ];

  return (
    <div className="w-full select-none">
      
      {/* 1. HERO SECTION (WHITE SECTION) */}
      <section className="relative w-full min-h-[85vh] flex items-center pt-28 pb-16 px-6 sm:px-12 lg:px-20 bg-white text-zinc-900 border-b border-zinc-200/80">
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Clean typography with Scroll Blur-to-Pop */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-xl">
            
            <ScrollReveal delay={0}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 leading-tight mb-5">
                The blockchain knows. <br />
                <span className="text-zinc-500 font-normal">Nobody else does.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={120}>
              <p className="text-zinc-600 text-base sm:text-lg leading-relaxed mb-8">
                Ghost is a confidential savings protocol built on Fully Homomorphic Encryption (FHE).
                Your balance, yield, and tickets remain completely encrypted onchain while prize draws execute with verifiable mathematical fairness.
              </p>
            </ScrollReveal>

            {/* Pill Action Button */}
            <ScrollReveal delay={240}>
              <div className="flex items-center gap-3 mb-8">
                <button
                  onClick={onExploreClick}
                  className="btn-pill-primary px-6 py-3 text-sm font-semibold flex items-center gap-2 shadow-sm"
                >
                  <span>Launch App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>

            {/* Quick Stats */}
            <ScrollReveal delay={480}>
              <div className="flex items-center gap-8 pt-6 border-t border-zinc-100 text-xs text-zinc-500">
                <div>
                  <span className="block font-semibold text-zinc-900 text-sm">euint64</span>
                  <span>FHE Standard</span>
                </div>
                <div>
                  <span className="block font-semibold text-emerald-600 text-sm">0.00%</span>
                  <span>Plaintext Leakage</span>
                </div>
                <div>
                  <span className="block font-semibold text-zinc-900 text-sm">Sepolia</span>
                  <span>Testnet</span>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Interactive 3D Exploding Vault on Hover */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <ScrollReveal delay={200} className="w-full flex justify-center">
              <ExplodingHeroVault />
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* 2. HARDWARE DISASSEMBLING ANIMATION SECTION (GREY SECTION) */}
      <section id="hardware-section" className="relative w-full py-20 px-6 sm:px-12 lg:px-20 bg-zinc-100/90 text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <ScrollReveal delay={0}>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-2">
                  Deconstructed Hardware Architecture
                </h2>
                <p className="text-zinc-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Interactive mechanical disassembly of the Ghost vault, exposing the 4 discrete smart contracts powering confidential accounting and blind draws.
                </p>
              </div>
            </ScrollReveal>

            {/* Interactive Disassembly Controller */}
            <ScrollReveal delay={150}>
              <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-zinc-200 shadow-xs">
                <button
                  onClick={() => {
                    setIsAutoAnimating(false);
                    setDisassemblyFactor(0);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    disassemblyFactor === 0
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  Assembled
                </button>
                <button
                  onClick={() => {
                    setIsAutoAnimating(false);
                    setDisassemblyFactor(100);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    disassemblyFactor > 0
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  Disassembled
                </button>
                <button
                  onClick={() => setIsAutoAnimating((prev) => !prev)}
                  title="Toggle Auto Animation"
                  className={`p-1.5 rounded-xl border transition-colors ${
                    isAutoAnimating
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                      : 'border-zinc-200 text-zinc-400 hover:text-black'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAutoAnimating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive 3D Disassembly Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Visual Exploded Layers View (RESTORED SLEEK BLACK CARD) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-black rounded-3xl min-h-[460px] shadow-xl relative overflow-hidden vault-3d-stage">
              
              {/* Background Blueprint Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

              <div className="relative w-full max-w-sm h-[320px] flex items-center justify-center">
                
                {/* Layer 1: GhostVerifier */}
                <div
                  style={{
                    transform: `translateY(${(layers[0].offsetY * disassemblyFactor) / 100}px) scale(${1 + (disassemblyFactor * 0.05) / 100})`,
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={() => setHoveredLayer(1)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`absolute w-44 h-12 rounded-2xl border flex items-center justify-center font-mono text-[11px] font-semibold cursor-pointer z-40 transition-all shadow-lg ${
                    hoveredLayer === 1
                      ? 'bg-white text-black border-white ring-4 ring-white/20 scale-105'
                      : 'bg-zinc-800/90 text-zinc-200 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <span>1. GhostVerifier</span>
                </div>

                {/* Layer 2: GhostDraw */}
                <div
                  style={{
                    transform: `translateY(${(layers[1].offsetY * disassemblyFactor) / 100}px) scale(${1 + (disassemblyFactor * 0.03) / 100})`,
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={() => setHoveredLayer(2)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`absolute w-52 h-14 rounded-2xl border flex items-center justify-center font-mono text-[11px] font-semibold cursor-pointer z-30 transition-all shadow-lg ${
                    hoveredLayer === 2
                      ? 'bg-white text-black border-white ring-4 ring-white/20 scale-105'
                      : 'bg-zinc-850 text-zinc-200 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  <span>2. GhostDraw (FHE Rotor)</span>
                </div>

                {/* Layer 3: GhostVault */}
                <div
                  style={{
                    transform: `translateY(${(layers[2].offsetY * disassemblyFactor) / 100}px) scale(${1 + (disassemblyFactor * 0.02) / 100})`,
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={() => setHoveredLayer(3)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`absolute w-60 h-14 rounded-2xl border flex items-center justify-center font-mono text-[11px] font-semibold cursor-pointer z-20 transition-all shadow-lg ${
                    hoveredLayer === 3
                      ? 'bg-white text-black border-white ring-4 ring-white/20 scale-105'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <span>3. GhostVault (Yield Harvest)</span>
                </div>

                {/* Layer 4: GhostPool */}
                <div
                  style={{
                    transform: `translateY(${(layers[3].offsetY * disassemblyFactor) / 100}px)`,
                    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={() => setHoveredLayer(4)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`absolute w-68 h-16 rounded-2xl border flex items-center justify-center font-mono text-[11px] font-semibold cursor-pointer z-10 transition-all shadow-lg ${
                    hoveredLayer === 4
                      ? 'bg-white text-black border-white ring-4 ring-white/20 scale-105'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <span>4. GhostPool (euint64 Ledger)</span>
                </div>

              </div>

              {/* Status Ribbon */}
              <div className="w-full pt-4 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                <span>Disassembly: {disassemblyFactor}%</span>
                <span>Exploded Isometric Schematic</span>
              </div>
            </div>

            {/* Right Column: Layer Details Cards on Grey Background */}
            <div className="lg:col-span-6 space-y-3">
              {layers.map((l, idx) => (
                <ScrollReveal key={l.id} delay={idx * 80}>
                  <div
                    onMouseEnter={() => {
                      setHoveredLayer(l.id);
                      if (disassemblyFactor === 0) setDisassemblyFactor(60);
                    }}
                    onMouseLeave={() => setHoveredLayer(null)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                      hoveredLayer === l.id
                        ? 'bg-black text-white border-black shadow-md scale-[1.01]'
                        : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-sm tracking-tight">{l.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          hoveredLayer === l.id
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {l.badge}
                      </span>
                    </div>
                    <div
                      className={`text-xs font-semibold mb-1 ${
                        hoveredLayer === l.id ? 'text-zinc-300' : 'text-zinc-700'
                      }`}
                    >
                      {l.role}
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        hoveredLayer === l.id ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      {l.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
