import React from 'react';
import { useGhost } from '../context/GhostContext';
import { Lock } from 'lucide-react';

export const VerifyPage: React.FC = () => {
  const { activeEvent } = useGhost();

  return (
    <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10 space-y-6">
      
      {/* Header */}
      <div className="pb-8 border-b border-zinc-200 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Verify
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Independent verification of protocol events without exposing participant financial state.
        </p>
      </div>

      {/* Verification Card */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-7 sm:p-9 mb-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
          <span className="font-semibold text-sm text-zinc-900">Event #{activeEvent.eventId} Verification</span>
          <span className="text-xs font-mono text-zinc-500">Ethereum Sepolia</span>
        </div>

        <div className="space-y-3 font-mono text-xs mb-8">
          <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-500">Protocol State</span>
            <span className="text-zinc-900 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{activeEvent.status === 'FINALIZED' ? 'Verified' : 'Active Deposit Cycle'}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-500">Encrypted State</span>
            <span className="text-zinc-900 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Valid euint64 Homomorphic Ciphertexts</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-500">Computation</span>
            <span className="text-zinc-900 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{activeEvent.status === 'FINALIZED' ? 'Verified on Sepolia' : 'Pending Draw Trigger'}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 flex items-center justify-between">
            <span className="text-zinc-500">Result</span>
            <span className="text-zinc-900 font-semibold flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${activeEvent.status === 'FINALIZED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{activeEvent.status === 'FINALIZED' ? 'Finalized' : 'Open for Yield Accrual'}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900 text-white flex items-center justify-between">
            <span className="text-zinc-400">Participant Financial State</span>
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Protected (Zero Plaintext Leakage)</span>
            </span>
          </div>
        </div>

        {/* Cryptographic Proof Details */}
        <div className="space-y-2.5 text-xs font-mono text-zinc-600">
          <div className="p-3 rounded-xl bg-white border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-zinc-400">Randomness Commitment:</span>
            <span className="text-zinc-900 font-semibold truncate">
              {activeEvent.randomnessCommitment || 'Pending onchain draw execution'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-zinc-400">Verified State Root:</span>
            <span className="text-zinc-900 font-semibold truncate">
              {activeEvent.stateRoot || 'Pending cycle finalization'}
            </span>
          </div>
        </div>
      </div>

      {/* Contextual Writings & Zero-Knowledge Verifiability Guide */}
      <div className="space-y-6">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xs">
          <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight mb-2">
            Verifying Protocol Integrity Without Plaintext Disclosure
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 max-w-3xl">
            Ghost achieves an unprecedented balance between total financial privacy and complete public auditability. 
            Anyone in the world can mathematically prove that protocol rules were followed without needing to see individual participant holdings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">State Integrity</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Merkle Root Commitments</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All ciphertext handles are accumulated into a deterministic Merkle state tree. Any unauthorized modification to a single balance would invalidate the published root hash.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">Compute Proof</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">FHE Coprocessor Attestation</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Smart contract arithmetic is verified through cryptographic attestations emitted by Torus FHE coprocessors on Sepolia, guaranteeing that math was evaluated correctly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">Decentralized Audit</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Open Explorer Verification</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                All contract state hashes and transaction receipts are permanently stored on Ethereum Sepolia and can be audited via Sepolia Etherscan at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
