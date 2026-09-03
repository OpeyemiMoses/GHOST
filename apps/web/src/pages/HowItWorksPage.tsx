import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useGhost } from '../context/GhostContext';

export const HowItWorksPage: React.FC = () => {
  const { setCurrentView } = useGhost();

  return (
    <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10 space-y-6">
      
      {/* Header */}
      <div className="pb-8 border-b border-zinc-200 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          How Ghost Works
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Confidential computation and public verifiability on Ethereum.
        </p>
      </div>

      {/* Core Principle */}
      <div className="p-8 sm:p-10 rounded-3xl bg-zinc-50 border border-zinc-200 mb-8">
        <div className="text-lg sm:text-xl font-bold text-zinc-950 leading-tight mb-3">
          "Blockchains are transparent by design. Ghost makes sensitive financial computation confidential without giving up verifiability."
        </div>
        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-6">
          Ghost uses Fully Homomorphic Encryption (FHE) so smart contracts compute yield and random draws on encrypted numbers.
        </p>

        {/* Architecture Flow Diagram */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 font-mono text-xs text-zinc-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">1</span>
            <span>YOUR DATA</span>
          </div>
          <div className="pl-2.5 text-zinc-400 text-[10px]">↓</div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">2</span>
            <span>ENCRYPTED (Client-side euint64)</span>
          </div>
          <div className="pl-2.5 text-zinc-400 text-[10px]">↓</div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">3</span>
            <span>FHE COMPUTATION (Zama Coprocessor)</span>
          </div>
          <div className="pl-2.5 text-zinc-400 text-[10px]">↓</div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">4</span>
            <span className="font-bold text-emerald-700">VERIFIABLE RESULT</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-zinc-600 leading-relaxed mb-8">
        <h2 className="text-base font-bold text-zinc-950">Why Ghost Needs FHE</h2>
        <p>
          Standard encryption makes data hidden but unusable onchain. Fully Homomorphic Encryption allows contracts to compute directly on ciphertexts without decrypting them.
        </p>
      </div>

      <div className="pt-6 border-t border-zinc-200 flex justify-between items-center">
        <span className="text-xs text-zinc-500">Ready to save?</span>
        <button
          onClick={() => setCurrentView('vault')}
          className="btn-pill-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
        >
          <span>Enter Vault</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
