import React from 'react';
import { Lock, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10 space-y-6">
      
      {/* Header */}
      <div className="pb-8 border-b border-zinc-200 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Security & Privacy Model
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Cryptographic boundaries and threat model on Ethereum Sepolia.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs mb-2.5">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>What Ghost Encrypts</span>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-600 font-mono">
            <li>• Individual balance (<code className="text-zinc-900">euint64</code>)</li>
            <li>• Individual deposit and withdrawal amounts</li>
            <li>• Individual ticket weights and positions</li>
            <li>• Intermediate calculations during draws</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs mb-2.5">
            <Eye className="w-4 h-4 text-zinc-500" />
            <span>What Remains Public</span>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-600 font-mono">
            <li>• Wallet addresses & transaction hashes</li>
            <li>• Block numbers & gas payments</li>
            <li>• Contract bytecode & deployment addresses</li>
            <li>• Verification state root commitments</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs mb-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>What FHE Provides</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Blind computation on encrypted values onchain without exposing plaintext.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs mb-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Privacy Is Not Anonymity</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Ghost protects financial state. It does not hide your wallet address from Ethereum RPC nodes.
          </p>
        </div>

      </div>

      {/* User Responsibility */}
      <div className="p-6 rounded-3xl bg-black text-white text-xs space-y-1.5">
        <div className="font-semibold text-xs text-white">User Responsibility</div>
        <p className="text-zinc-400 leading-relaxed">
          Wallet security and private key custody remain your responsibility. Ghost contracts are non-custodial and open source.
        </p>
      </div>

    </div>
  );
};
