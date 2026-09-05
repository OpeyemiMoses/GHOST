import React, { useState } from 'react';
import { useGhost } from '../context/GhostContext';
import { HeroAndExplodedSection } from '../components/HeroAndExplodedSection';
import {
  ArrowRight,
  Lock,
  Eye,
  Shield,
  Cpu,
  Check,
  Timer,
  RotateCcw,
  TrendingUp,
  KeyRound,
  Unlock,
  Layers,
  Sparkles,
  ShieldAlert,
  Clock,
  Coins
} from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { PrivacyCardsDeck } from '../components/PrivacyCardsDeck';
import { Foundations3DCarousel } from '../components/Foundations3DCarousel';

export const LandingPage: React.FC = () => {
  const { setCurrentView } = useGhost();
  const [demoDecrypted, setDemoDecrypted] = useState(false);

  return (
    <div className="w-full min-h-screen selection:bg-zinc-200 bg-white">
      
      {/* 1. HERO (WHITE) & 2. HARDWARE DISASSEMBLY (GREY) */}
      <HeroAndExplodedSection onExploreClick={() => setCurrentView('vault')} />

      {/* 3. CRYPTOGRAPHIC FOUNDATIONS (CREAM SECTION - bg-[#faf8f5]) */}
      <section id="foundations-section" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-[#faf8f5] text-zinc-900 border-b border-[#eee9df]">
        <div className="max-w-6xl mx-auto">

          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-200/80 border border-zinc-300/80 text-zinc-800 font-mono text-xs font-semibold mb-4">
              <Cpu className="w-3.5 h-3.5 text-zinc-700" />
              <span>Zama fhEVM + Torus Coprocessor</span>
            </div>
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

      {/* 4. [NEW] ENCRYPTED TIME-WEIGHTED AVERAGE BALANCE (TWAB) SECTION (WHITE) */}
      <section id="twab-section" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-6xl mx-auto">
          
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono text-xs font-semibold mb-4">
              <Clock className="w-3.5 h-3.5 text-zinc-700" />
              <span>Anti-Mercenary Liquidity Engine</span>
            </div>
            <div className="max-w-3xl mb-14">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4 leading-tight">
                Encrypted Time-Weighted Draw Weight (TWAB)
              </h2>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                Ghost does not calculate draw weights from point-in-time balance snapshots. Snapshots favor mercenary capital deposited seconds before a draw. Instead, draw weight is earned continuously over the entire epoch.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Traditional vs Ghost Comparison Cards */}
            <div className="lg:col-span-6 space-y-5">
              
              <ScrollReveal delay={100}>
                <div className="p-6 sm:p-7 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-zinc-500 uppercase">Flawed Conventional DeFi</span>
                    <span className="text-xs font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Snapshots</span>
                  </div>
                  <h3 className="font-bold text-base text-zinc-950">Point-in-Time Snapshot Vulnerability</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    A $10,000 deposit made 30 seconds before draw closure receives the exact same winning weight as a $10,000 deposit held for 24 hours. Capital providers who commit sustained liquidity are diluted by last-second snipers.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950 border border-zinc-800 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Ghost Cryptographic TWAB</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Continuous Integration</span>
                  </div>
                  <h3 className="font-bold text-base text-white">Weight = Capital × Time Held</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Draw weight is integrated continuously: <code className="text-emerald-300 font-mono">Weight = ∫ balance(t) dt</code> over encrypted deposit tranches. Capital held longer earns proportionally higher winning odds while keeping balances 100% sealed.
                  </p>
                </div>
              </ScrollReveal>

            </div>

            {/* Right: Technical TWAB Architecture Details */}
            <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200/90 shadow-xs">
              <ScrollReveal delay={150}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase">
                    <Layers className="w-4 h-4 text-zinc-700" />
                    <span>How Ghost TWAB Operates Onchain</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950">
                    Homomorphic Tranche Integration
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Every deposit is stamped with an immutable timestamp onchain. When a prize draw is executed, the Torus FHE coprocessor computes each saver’s time-weight product across their encrypted tranches without unmasking individual values to validators or mempools.
                  </p>

                  {/* Visual TWAB Metric Matrix */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">Deposit Early (Day 1)</div>
                      <div className="text-sm font-bold text-zinc-900 mt-1 font-mono">100% Time-Weight</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Maximum draw weight & continuous yield accrual</div>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase">Deposit Late (Hour 23)</div>
                      <div className="text-sm font-bold text-zinc-900 mt-1 font-mono">4.1% Time-Weight</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Proportional credit strictly for elapsed duration</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={250}>
                <div className="pt-6 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>Privacy Standard: Zama euint64</span>
                  <span className="text-emerald-700 font-semibold">Zero-Knowledge Odds</span>
                </div>
              </ScrollReveal>
            </div>

          </div>

        </div>
      </section>

      {/* 5. [NEW] AUTONOMOUS $500 PRIZE KEEPER & ROLLOVER ENGINE (DARK - bg-zinc-950) */}
      <section id="keeper-section" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-zinc-950 text-white border-b border-zinc-900">
        <div className="max-w-6xl mx-auto">
          
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-amber-400 font-mono text-xs font-semibold mb-4">
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Autonomous Keeper Protocol</span>
            </div>
            <div className="max-w-3xl mb-14">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                Autonomous Execution & $500 Minimum Prize Floor
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Ghost eliminates trivial, fraction-of-a-cent micro-draws. The autonomous keeper enforces a strict $500.00 minimum prize floor, automatically rolling over and compounding yield until substantial prizes are formed.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: $500 Minimum Floor */}
            <ScrollReveal delay={50}>
              <div className="p-7 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-400 mb-5">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase mb-2 block">$500.00 Prize Floor</span>
                  <h3 className="font-bold text-base text-white mb-2">Meaningful Prize Pools</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Draws execute onchain only when the accumulated homomorphic yield reaches or exceeds the $500.00 threshold at the end of the 24-hour cycle.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                  threshold: 500 cUSDC
                </div>
              </div>
            </ScrollReveal>

            {/* Pillar 2: Automatic Rollover Compounding */}
            <ScrollReveal delay={150}>
              <div className="p-7 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 mb-5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase mb-2 block">Zero-Reset Compounding</span>
                  <h3 className="font-bold text-base text-white mb-2">Continuous Rollover Cycles</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    If the 24h timer expires and yield is under $500, the pool rolls over into the next cycle. Existing savers retain their cumulative time-weight advantage without resetting.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                  rollover: cycle + 1
                </div>
              </div>
            </ScrollReveal>

            {/* Pillar 3: Zama FHE Randomness */}
            <ScrollReveal delay={250}>
              <div className="p-7 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 mb-5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-300 uppercase mb-2 block">Blind Winner Selection</span>
                  <h3 className="font-bold text-base text-white mb-2">Cryptographic Randomness</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    When the threshold is satisfied at cycle expiration, the keeper broadcasts onchain execution with Zama FHE randomness. Winning selection remains confidential until claimed.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono">
                  coprocessor: Torus FHE Engine
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Keeper Execution Logic Workflow */}
          <ScrollReveal delay={200}>
            <div className="mt-12 p-6 sm:p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-zinc-500 uppercase">Keeper Rulebook</div>
                  <div className="text-sm font-bold text-white mt-0.5">Autonomous Evaluation at Timer Expiration (0:00:00)</div>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-emerald-400">Yield ≥ $500 → Execute Draw</span>
                  <span className="px-3 py-1 rounded bg-zinc-800 border border-zinc-700 text-amber-400">Yield &lt; $500 → Rollover 24h</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 6. THE 4-STEP PROTOCOL LIFECYCLE (BLACK SECTION - bg-black) */}
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
              <div className="p-7 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
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
              <div className="p-7 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
                <div>
                  <span className="text-xs font-mono font-bold text-zinc-500 mb-4 block">02</span>
                  <h3 className="font-bold text-base text-white mb-2">Earn Yield</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                    Deposited capital generates continuous savings yield. Yield allocations accrue confidentially without disclosing individual amounts publicly.
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
                  GhostVault.harvest()
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={250}>
              <div className="p-7 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
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
              <div className="p-7 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-full hover:border-zinc-700 transition-colors">
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
            <div className="mt-14 p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-4">
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

      {/* 7. [NEW] CRYPTOGRAPHIC CLEARANCE & CLIENT-SIDE UNMASKING (CREAM SECTION - bg-[#faf8f5]) */}
      <section id="clearance-section" className="relative w-full py-24 px-6 sm:px-12 lg:px-20 bg-[#faf8f5] text-zinc-900 border-b border-[#eee9df]">
        <div className="max-w-6xl mx-auto">
          
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-200/80 border border-zinc-300/80 text-zinc-800 font-mono text-xs font-semibold mb-4">
              <KeyRound className="w-3.5 h-3.5 text-zinc-700" />
              <span>Client-Side Cryptographic Clearance</span>
            </div>
            <div className="max-w-3xl mb-14">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4 leading-tight">
                Self-Custodial Decryption Clearance
              </h2>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                Your plaintext balances never touch backend databases or validator nodes. Ciphertexts are unmasked strictly inside your local browser sandbox via cryptographic wallet signatures.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Security Mechanics */}
            <div className="lg:col-span-7 space-y-6">
              
              <ScrollReveal delay={100}>
                <div className="p-6 rounded-2xl bg-white border border-[#eae2d5] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Cryptographic Signature Authority</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Accessing your confidential balance requires an EIP-712 cryptographic signature from your connected Web3 wallet. Without your private key, onchain observers and RPC nodes only see opaque 256-bit ciphertext handles.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="p-6 rounded-2xl bg-white border border-[#eae2d5] shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-zinc-950 font-bold text-sm">
                    <Lock className="w-4 h-4 text-zinc-800" />
                    <span>Instant Re-Sealing on Demand</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Whenever you step away or lock your session, your decrypted view is purged from browser state, instantly re-sealing all balances back into secure ciphertexts.
                  </p>
                </div>
              </ScrollReveal>

            </div>

            {/* Right Column: Interactive Interactive Clearance Simulation Card */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={200}>
                <div className="p-7 rounded-2xl bg-white border border-[#eae2d5] shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-500 uppercase">Live Decryption Demo</span>
                    <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${demoDecrypted ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-zinc-600 bg-zinc-100 border-zinc-200'}`}>
                      {demoDecrypted ? '● Decrypted Session' : '🔒 euint64 Sealed'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                    <div className="text-[11px] font-mono text-zinc-500">Confidential Vault Position</div>
                    <div className="text-2xl font-bold font-mono text-zinc-950">
                      {demoDecrypted ? '$25,000.00 cUSDC' : '0x7f4e8b91...c2d3 (Sealed)'}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      {demoDecrypted ? 'Unmasked via Client Signature' : 'Protected by Zama FHE Ciphertext Handle'}
                    </div>
                  </div>

                  <button
                    onClick={() => setDemoDecrypted(!demoDecrypted)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold font-mono bg-zinc-900 text-white hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {demoDecrypted ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sign to Re-Seal Ciphertext</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Simulate Wallet Decryption</span>
                      </>
                    )}
                  </button>
                </div>
              </ScrollReveal>
            </div>

          </div>

        </div>
      </section>

      {/* 8. PRIVACY BY ARCHITECTURE (WHITE SECTION - bg-white) */}
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

      {/* 9. SECURITY & BOUNDARIES (CREAM SECTION - bg-[#faf8f5]) */}
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
              <div className="p-8 rounded-2xl bg-white border border-[#eae2d5] shadow-xs">
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
              <div className="p-8 rounded-2xl bg-white border border-[#eae2d5] shadow-xs">
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

      {/* 10. FINAL CALL TO ACTION (BLACK SECTION - bg-zinc-950) */}
      <section className="relative w-full py-32 px-6 sm:px-12 lg:px-20 bg-zinc-950 text-white text-center overflow-hidden">
        
        {/* Massive Ambient Background Wordmark */}
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
              className="px-8 py-3.5 rounded-xl bg-white text-zinc-950 text-sm font-semibold inline-flex items-center gap-2 shadow-xl hover:bg-zinc-100 transition-colors cursor-pointer"
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
