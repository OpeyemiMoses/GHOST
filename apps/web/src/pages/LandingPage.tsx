import React from 'react';
import { useGhost } from '../context/GhostContext';
import { HeroAndExplodedSection } from '../components/HeroAndExplodedSection';
import { ArrowRight, Lock, Eye, Shield, Cpu, Check } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { PrivacyCardsDeck } from '../components/PrivacyCardsDeck';
import { Foundations3DCarousel } from '../components/Foundations3DCarousel';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useGhost();

  return (
    <div className="w-full min-h-screen selection:bg-zinc-200">
      
      {/* 1. HERO (WHITE) & 2. HARDWARE DISASSEMBLY (GREY) */}
      <HeroAndExplodedSection onExploreClick={() => setCurrentView('vault')} />

      {/* 3. CRYPTOGRAPHIC FOUNDATIONS (CREAM SECTION - bg-[#faf8f5]) */}
      <section id="foundations-section" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-[#faf8f5] text-zinc-900 border-b border-[#eee9df]">
        <div className="max-w-6xl mx-auto">

          <ScrollReveal delay={0}>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-5 leading-tight max-w-2xl">
              Blockchains are transparent by design. <br />
              <span className="text-zinc-500 font-normal">Your financial balance doesn't need to be.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-12 max-w-3xl">
              In conventional DeFi protocols, user balances, deposits, and pool weights are exposed to all observers. 
              Ghost integrates Zama Fully Homomorphic Encryption (FHE) to allow smart contracts to compute state transitions directly on encrypted ciphertexts.
            </p>
          </ScrollReveal>

          {/* 3D Immersive Depth Carousel with Infinite Rollover */}
          <ScrollReveal delay={150}>
            <Foundations3DCarousel />
          </ScrollReveal>

        </div>
      </section>

      {/* 4. THE 4-STEP PROTOCOL LIFECYCLE (BLACK SECTION - bg-black) */}
      <section id="lifecycle-section" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-black text-white border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          
          <ScrollReveal delay={0}>
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
                How Ghost Operates
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Four deterministic stages ensuring complete financial privacy with verifiable mathematical execution.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <ScrollReveal delay={50}>
              <div className="p-7 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-500 mb-4 block">01</span>
                  <h3 className="font-bold text-base text-white mb-2">Deposit</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Deposit assets into the Ghost Pool. Your deposited amount is encrypted client-side into an <code className="text-zinc-200 font-mono">euint64</code> handle before broadcast.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                  GhostPool.deposit()
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className="p-7 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-500 mb-4 block">02</span>
                  <h3 className="font-bold text-base text-white mb-2">Earn Yield</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Deposited capital generates yield in the background. Yield allocations accrue confidentially without disclosing individual amounts publicly.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                  GhostVault.harvest()
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <div className="p-7 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-500 mb-4 block">03</span>
                  <h3 className="font-bold text-base text-white mb-2">Confidential Draw</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Periodic prize events evaluate randomly across encrypted ticket weights using Torus FHE coprocessors on Sepolia.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                  GhostDraw.execute()
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={350}>
              <div className="p-7 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-500 mb-4 block">04</span>
                  <h3 className="font-bold text-base text-white mb-2">Withdraw Anytime</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Withdraw principal and accrued earnings on demand. Ghost smart contracts are non-custodial and never lock your assets.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                  GhostPool.withdraw()
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Technical Specifications Matrix */}
          <ScrollReveal delay={200}>
            <div className="mt-14 p-6 rounded-3xl bg-zinc-950 border border-zinc-800/80 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-zinc-500 block text-[10px]">NETWORK</span>
                <span className="text-zinc-200 font-semibold">Sepolia (11155111)</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">ENCRYPTION</span>
                <span className="text-zinc-200 font-semibold">Zama FHE euint64</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">STATE PROOF</span>
                <span className="text-emerald-400 font-semibold">Merkle Root Verified</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">CUSTODY</span>
                <span className="text-zinc-200 font-semibold">100% Non-Custodial</span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 5. PRIVACY BY ARCHITECTURE (WHITE SECTION - bg-white) */}
      <section id="privacy-section" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-6xl mx-auto">
          
          <ScrollReveal delay={0}>
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-3">
                Privacy by Architecture
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Ghost does not hide public data behind frontend UI toggles. Plaintext balances never exist onchain in the first place.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <PrivacyCardsDeck />
          </ScrollReveal>

        </div>
      </section>

      {/* 6. SECURITY & BOUNDARIES (CREAM SECTION - bg-[#faf8f5]) */}
      <section id="security-section" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-[#faf8f5] text-zinc-900 border-b border-[#eee9df]">
        <div className="max-w-6xl mx-auto">
          
          <ScrollReveal delay={0}>
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-3">
                Cryptographic Boundaries
              </h2>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                Clear distinction between protected confidential state and public blockchain metadata.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <ScrollReveal delay={100}>
              <div className="p-8 rounded-3xl bg-white border border-[#eae2d5] shadow-xs">
                <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm mb-4">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Confidential State (Protected)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 font-mono">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Individual balances (<code className="text-zinc-950 font-semibold">euint64</code>)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Deposit and withdrawal amounts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Ticket weights during prize evaluations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Accrued individual yield harvest</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="p-8 rounded-3xl bg-white border border-[#eae2d5] shadow-xs">
                <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm mb-4">
                  <Eye className="w-4 h-4 text-zinc-600" />
                  <span>Public Metadata (Verifiable)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-600 font-mono">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                    <span>Connected wallet address & transaction hash</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                    <span>Gas payment & block timestamp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                    <span>Deployed contract bytecode on Sepolia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block" />
                    <span>Draw state root commitments</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION (BLACK SECTION - bg-zinc-950) */}
      <section className="relative w-full py-32 px-6 sm:px-12 lg:px-20 bg-zinc-950 text-white text-center overflow-hidden">
        
        {/* Massive Ambient Background Wordmark (Subtle & Transparent at the back of everything) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
          <img
            src="/assets/ghost-wordmark-white.png"
            alt=""
            aria-hidden="true"
            className="w-[95%] max-w-5xl opacity-[0.05] filter blur-[0.5px] scale-110 object-contain"
          />
        </div>

        <div className="relative max-w-2xl mx-auto z-10">

          <ScrollReveal delay={100}>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Private money. <br />
              <span className="text-zinc-400 font-normal">Verifiable outcomes.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
              Participate in confidential onchain savings on Ethereum Sepolia.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <button
              onClick={() => {
                setCurrentView('vault');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-pill-white px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2 shadow-xl hover:scale-102 transition-transform"
            >
              <span>Launch Ghost Vault</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </ScrollReveal>

        </div>
      </section>

    </div>
  );
};
