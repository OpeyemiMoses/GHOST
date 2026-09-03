import React, { useState, useRef } from 'react';
import { Eye, Lock, Check } from 'lucide-react';

export const PrivacyCardsDeck: React.FC = () => {
  const [activeCard, setActiveCard] = useState<'public' | 'owner'>('owner');
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      // Swiped left -> switch to owner card
      setActiveCard('owner');
    } else if (diff < -40) {
      // Swiped right -> switch to public card
      setActiveCard('public');
    }
  };

  return (
    <div className="w-full select-none py-6">
      
      {/* Cards Deck Container */}
      <div
        className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 min-h-[460px] px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* 1. PUBLIC OBSERVER VIEW (White Card - Rotated Left) */}
        <div
          onClick={() => setActiveCard('public')}
          onMouseEnter={() => setActiveCard('public')}
          className={`w-full max-w-md p-8 rounded-[2.5rem] bg-white border cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between ${
            activeCard === 'public'
              ? 'md:-rotate-1 md:scale-105 z-30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border-zinc-300 ring-2 ring-zinc-950/10 blur-0 opacity-100'
              : 'md:-rotate-6 md:scale-95 z-10 opacity-55 shadow-lg border-zinc-200 blur-[3px] hover:opacity-85 hover:blur-[1px]'
          }`}
          style={{
            minHeight: '400px',
          }}
        >
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center gap-2 text-zinc-600 text-xs font-mono font-semibold">
                <Eye className="w-4 h-4 text-zinc-800" />
                <span>PUBLIC OBSERVER VIEW</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs font-mono text-zinc-700 space-y-3 mb-6 shadow-inner">
              <div className="flex justify-between pb-2 border-b border-zinc-200/60">
                <span className="text-zinc-500">Wallet Address:</span>
                <span className="font-semibold text-zinc-900">0x742d...f44e</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-200/60">
                <span className="text-zinc-500">Financial State:</span>
                <span className="font-semibold text-zinc-900">PRIVATE (euint64)</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-200/60">
                <span className="text-zinc-500">Computation:</span>
                <span className="font-semibold text-zinc-900">Torus FHE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Protocol State:</span>
                <span className="text-zinc-900 font-semibold flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Verified Onchain</span>
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Observers verify mathematical correctness and prize execution roots without accessing individual user deposits.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-100 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
            <span>Merkle State Root</span>
            <span>Sepolia Verified</span>
          </div>
        </div>

        {/* 2. AUTHORIZED OWNER SESSION (Black Card - Rotated Right) */}
        <div
          onClick={() => setActiveCard('owner')}
          onMouseEnter={() => setActiveCard('owner')}
          className={`w-full max-w-md p-8 rounded-[2.5rem] bg-black text-white border cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between ${
            activeCard === 'owner'
              ? 'md:rotate-1 md:scale-105 z-30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-zinc-700 ring-2 ring-white/15 blur-0 opacity-100'
              : 'md:rotate-6 md:scale-95 z-10 opacity-55 shadow-xl border-zinc-900 blur-[3px] hover:opacity-85 hover:blur-[1px]'
          }`}
          style={{
            minHeight: '400px',
          }}
        >
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center gap-2 text-zinc-300 text-xs font-mono font-semibold">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>AUTHORIZED OWNER SESSION</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-200 space-y-3 mb-6 shadow-inner">
              <div className="flex justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-500">Your Real Balance:</span>
                <span className="font-bold text-white text-sm">$4,281.32 cUSDC</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-500">Accrued Yield:</span>
                <span className="font-semibold text-emerald-400">+$64.20 cUSDC</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-500">Pool Position:</span>
                <span className="font-semibold text-white">ACTIVE (ENCRYPTED)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Withdrawal Access:</span>
                <span className="text-emerald-400 font-semibold">100% Unlocked</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Your browser client decrypts your balances using authorized wallet keys under Zama ACL. Same onchain state, confidential view.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono flex items-center justify-between">
            <span>Authorized Session</span>
            <span className="text-emerald-400">Live Decryption</span>
          </div>
        </div>

      </div>

      {/* Mobile Swipe Indicators & Switcher */}
      <div className="flex md:hidden items-center justify-center gap-3 mt-6">
        <button
          onClick={() => setActiveCard('public')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            activeCard === 'public' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
          }`}
        >
          Public View
        </button>
        <button
          onClick={() => setActiveCard('owner')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            activeCard === 'owner' ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-700'
          }`}
        >
          Owner View
        </button>
      </div>

    </div>
  );
};
