import React from 'react';
import { triggerWaterRipple } from '../utils/ripple';

export const SignalPathPipeline: React.FC = () => {
  const gauges = [
    { label: 'CONFIDENTIALITY', value: '100%', progress: '100%' },
    { label: 'FHE BIT-WIDTH', value: '64-BIT', progress: '85%' },
    { label: 'PLAINTEXT LEAK', value: '0.00%', progress: '0%' },
    { label: 'DRAW CADENCE', value: '7 DAYS', progress: '65%' },
    { label: 'LATTICE SECURITY', value: '128-BIT', progress: '100%' },
    { label: 'TARGET NETWORK', value: 'SEPOLIA', progress: '90%' },
  ];

  const pipelineSteps = [
    {
      num: '01',
      title: 'CLIENT ENCRYPTION',
      desc: 'User inputs deposit amount. Client-side Zama SDK compiles ciphertext and generates zero-knowledge proof of knowledge.',
      tech: 'TFHE-rs Client'
    },
    {
      num: '02',
      title: 'HOMOMORPHIC POOL',
      desc: 'GhostPool receives ciphertext. Balance addition executes directly over encrypted integers: Enc(bal) + Enc(dep) = Enc(new).',
      tech: 'GhostPool'
    },
    {
      num: '03',
      title: 'VAULT YIELD ACCRUAL',
      desc: 'Shared capital generates yield. Interest accumulates confidentially into the encrypted prize pool without public balances.',
      tech: 'GhostVault'
    },
    {
      num: '04',
      title: 'SECURE FHE PRNG',
      desc: 'When draw triggers, onchain Zama PRNG generates cryptographically secure encrypted random number FHE.randEuint64().',
      tech: 'FHE.randEuint64()'
    },
    {
      num: '05',
      title: 'WINNER SELECTION',
      desc: 'Winner determined using random seed modulo confidential participant weights. Balances remain strictly encrypted.',
      tech: 'GhostDraw'
    },
    {
      num: '06',
      title: 'PUBLIC COMMITMENT',
      desc: 'Root hash and randomness commitments are immutably written to GhostVerifier. Anyone can verify outcome with 0 wallet auth.',
      tech: 'GhostVerifier'
    },
  ];

  return (
    <section className="relative w-full py-24 bg-[#07080a] border-t border-white/10 px-6 sm:px-12 lg:px-20 text-white select-none">
      
      {/* 1. PARAMETER GAUGES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
        {gauges.map((g, idx) => (
          <div key={idx} className="font-mono">
            <div className="w-full h-[2px] bg-white/10 mb-3 overflow-hidden">
              <div
                className="h-full bg-amber-400"
                style={{ width: g.progress }}
              />
            </div>
            <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">
              {g.label}
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display">
              {g.value}
            </div>
          </div>
        ))}
      </div>

      {/* 2. SECTION TITLE & EXPLANATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
            <span className="w-4 h-[2px] bg-amber-400 inline-block" />
            <span>03 · FHE SIGNAL PATHWAY</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            WHAT HAPPENS TO <br />
            AN ENCRYPTED DEPOSIT.
          </h2>
        </div>

        <div className="lg:col-span-6 pt-3">
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-sans">
            Deposit capital and it travels this chain, left to right, entirely inside the shielded domain.
            Every stage executes mathematical homomorphic transformations without decryption.
            The interface is the cryptographic circuit.
          </p>
        </div>
      </div>

      {/* 3. 6 SEQUENTIAL STEP CARDS - Geometric rounded-sm (Rule 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {pipelineSteps.map((step) => (
          <div
            key={step.num}
            onClick={(e) => triggerWaterRipple(e)}
            className="p-5 rounded-sm bg-[#0e1117] border border-white/10 hover:border-amber-400/70 transition-all flex flex-col justify-between ripple-container cursor-pointer"
          >
            <div>
              <div className="font-mono text-xs font-bold text-amber-400 mb-3">
                {step.num}
              </div>
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-2">
                {step.title}
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed font-sans mb-4">
                {step.desc}
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 font-mono text-[10px] text-emerald-400 font-semibold">
              {step.tech}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
