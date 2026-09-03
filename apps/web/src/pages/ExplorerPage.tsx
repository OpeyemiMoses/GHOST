import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const ExplorerPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white text-zinc-900 pt-28 pb-20 px-6 sm:px-12 lg:px-20 selection:bg-zinc-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-200 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Privacy Explorer
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Compare what the public Ethereum blockchain observes versus what an authorized owner sees.
            </p>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Public Block Explorer View */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-7 sm:p-9">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-5 text-xs">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                <Eye className="w-4 h-4 text-zinc-500" />
                <span>Public Observer (Etherscan)</span>
              </div>
              <span className="text-zinc-400">Zero Auth</span>
            </div>

            <p className="text-zinc-600 text-xs sm:text-sm mb-5 leading-relaxed">
              When an external auditor or competitor inspects the Ethereum mempool and event logs:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200">
                <div className="text-zinc-400 text-[10px] uppercase">Deposit Value</div>
                <div className="text-zinc-900 font-semibold text-xs mt-0.5 truncate">
                  0x8f2a1b9c4d5e6f7a...0f1a
                </div>
                <div className="text-emerald-600 text-[11px] font-medium mt-0.5">Encrypted (Plaintext hidden)</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200">
                <div className="text-zinc-400 text-[10px] uppercase">Participant Ticket Weight</div>
                <div className="text-zinc-900 font-semibold text-xs mt-0.5 truncate">
                  0x3c4d5e6f7a8b9c0d...1a2b
                </div>
                <div className="text-emerald-600 text-[11px] font-medium mt-0.5">Weighted blindly in FHE</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200">
                <div className="text-zinc-400 text-[10px] uppercase">Winner Prize Accrual</div>
                <div className="text-zinc-900 font-semibold text-xs mt-0.5 truncate">
                  0x1a2b3c4d5e6f7a8b...3c4d
                </div>
                <div className="text-emerald-600 text-[11px] font-medium mt-0.5">Distributed in ciphertext</div>
              </div>
            </div>
          </div>

          {/* Authorized Depositor View */}
          <div className="bg-black text-white rounded-3xl p-7 sm:p-9 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-5 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <EyeOff className="w-4 h-4 text-emerald-400" />
                <span>Authorized Owner (Vault)</span>
              </div>
              <span className="text-emerald-400 font-medium">Decrypted</span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm mb-5 leading-relaxed">
              Only the depositor wallet can decrypt their own position in their private browser session:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="text-zinc-500 text-[10px] uppercase">Your Real Balance</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  Decrypted in Vault
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">Torus FHE ACL verified</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="text-zinc-500 text-[10px] uppercase">Actual Ticket Weight</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  1 Ticket per 1 cUSDC
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">Evaluated blindly onchain</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="text-zinc-500 text-[10px] uppercase">Withdrawal Access</div>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">
                  Instant & Non-Custodial
                </div>
                <div className="text-zinc-400 text-[11px] mt-0.5">No permissions required</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
