import React, { useState, useEffect } from 'react';
import { useGhost } from '../context/GhostContext';
import { RefreshCw, Sparkles, ExternalLink, Clock, Lock, Wallet, AlertCircle, Users, Gift } from 'lucide-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export const EventsPage: React.FC = () => {
  const { setCurrentView, walletConnected, activeEvent, pastEvents, isComputingEvent, executeEventDraw, participantCount, unclaimedPrizes } = useGhost();
  const { openConnectModal } = useConnectModal();

  // Real-time Countdown Timer calculation
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = activeEvent.endTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeEvent.endTime]);

  const totalUnclaimed = unclaimedPrizes.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10 space-y-6">
      
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Events & Draws
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Confidential prize draw cycles computed over encrypted ticket weights.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('claim')}
          className="px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold border border-zinc-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Gift className="w-3.5 h-3.5 text-amber-600" />
          <span>Claim Winnings {unclaimedPrizes.length > 0 && `(${unclaimedPrizes.length})`}</span>
        </button>
      </div>

      {/* Unclaimed Prizes Alert Banner */}
      {unclaimedPrizes.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-amber-500/20 via-amber-500/10 to-amber-500/5 border border-amber-500/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-950">
                🎉 You have {unclaimedPrizes.length} unclaimed prize{unclaimedPrizes.length === 1 ? '' : 's'} (${totalUnclaimed.toFixed(2)} cUSDC)!
              </h3>
              <p className="text-xs text-zinc-600">
                Winnings are reserved onchain. Click below to claim the funds directly to your wallet.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('claim')}
            className="px-5 py-2.5 rounded-full bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            Claim Now →
          </button>
        </div>
      )}

      {/* Active Event Card */}
      <div className="bg-black text-white rounded-3xl p-7 sm:p-9 shadow-xl mb-10 hover-elevate-dark border border-zinc-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800 mb-6">
          <div>
            <div className="text-xs text-zinc-400 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Event · #{activeEvent.eventId}</span>
            </div>
            <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              ${activeEvent.prizeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              <span className="text-base font-normal text-zinc-400">cUSDC</span>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-md">
              Accumulated prize yield evaluated blindly via Torus FHE coprocessor.
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-3">
            {/* Live Time-Lock Countdown Indicator */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400">Cycle Countdown:</span>
              <span className="text-emerald-400 font-semibold">
                {timeLeft.isExpired
                  ? 'Ready for Draw'
                  : `${String(timeLeft.hours).padStart(2, '0')}h ${String(timeLeft.minutes).padStart(2, '0')}m ${String(timeLeft.seconds).padStart(2, '0')}s`}
              </span>
            </div>

            {/* Autonomous Network Keeper Status Indicator (Zero manual execution required) */}
            {isComputingEvent ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono shadow-md animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Keeper Resolving Homomorphic Draw...</span>
              </div>
            ) : (
              <div className="flex flex-col sm:items-end gap-1.5">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-mono shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold">Autonomous Keeper Active</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  Executed automatically onchain · Zero user gas required
                </span>
              </div>
            )}
          </div>
        </div>

        {/* References */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase">Lifecycle Status</div>
            <div className="text-white font-semibold text-xs mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeEvent.status}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase flex items-center gap-1">
              <Users className="w-3 h-3 text-zinc-400" />
              <span>Active Savers in Pool</span>
            </div>
            <div className="text-white font-semibold text-xs mt-1">
              {participantCount.toLocaleString()} Savers
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase">Randomness Commitment</div>
            <div className="text-zinc-400 text-xs mt-1 truncate">
              {activeEvent.randomnessCommitment ? (
                <span className="text-white font-semibold">{activeEvent.randomnessCommitment}</span>
              ) : (
                <span className="italic text-zinc-500">Generated onchain upon draw</span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase">Merkle State Root</div>
            <div className="text-zinc-400 text-xs mt-1 truncate">
              {activeEvent.stateRoot ? (
                <span className="text-white font-semibold">{activeEvent.stateRoot}</span>
              ) : (
                <span className="italic text-zinc-500">Finalized upon draw</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Past Events */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
          <div className="font-semibold text-sm text-zinc-900">
            Finalized History
          </div>
          <span className="text-xs text-zinc-400">{pastEvents.length} completed</span>
        </div>

        {pastEvents.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs flex flex-col items-center justify-center gap-1.5">
            <AlertCircle className="w-5 h-5 text-zinc-300" />
            <span>No finalized events yet.</span>
            <span className="text-zinc-500 text-[11px]">
              Finalized prize history will be recorded onchain here after the first cycle draw is executed.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-100 text-[11px]">
                  <th className="pb-2.5 font-medium">Event ID</th>
                  <th className="pb-2.5 font-medium">Prize</th>
                  <th className="pb-2.5 font-medium">Winner</th>
                  <th className="pb-2.5 font-medium">Tx Hash</th>
                  <th className="pb-2.5 font-medium text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {pastEvents.map((e) => (
                  <tr key={e.eventId} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3.5 font-semibold text-zinc-900">#{e.eventId}</td>
                    <td className="py-3.5 font-semibold">${e.prizeAmount.toLocaleString()} cUSDC</td>
                    <td className="py-3.5 font-mono text-zinc-600">{e.winnerAddress}</td>
                    <td className="py-3.5 font-mono text-zinc-500">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${e.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black flex items-center gap-1"
                      >
                        <span>{e.txHash}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1.5 text-zinc-700 font-medium text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contextual Writings & Cryptographic Mechanics */}
      <div className="mt-8 space-y-6">
        
        {/* Time-Lock & Gas Execution Security Section */}
        <div className="p-7 rounded-3xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center gap-2 font-bold text-sm text-zinc-950 mb-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Smart Contract Execution Requirements</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed max-w-3xl">
            Executing an onchain prize cycle requires a connected Web3 wallet to sign the Ethereum transaction and pay gas for the Torus FHE coprocessor computation. 
            Furthermore, the <code className="text-zinc-900 font-mono font-semibold">GhostDraw</code> contract strictly rejects any premature execution attempts prior to timestamp expiration (<code className="text-zinc-900 font-mono">block.timestamp &gt;= eventEndTime</code>).
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xs">
          <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight mb-2">
            Verifiable Blind Prize-Draw Mechanics
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 max-w-3xl">
            Conventional prize-savings protocols leak participant ticket counts and odds to all observers. 
            Ghost evaluates prize drawings entirely under encryption using Torus FHE coprocessors and verifiable randomness on Ethereum Sepolia.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">Coprocessor</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Encrypted Weighted Sampling</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Ticket quantities are evaluated in ciphertext space. The probability of winning scales proportionally with your deposit without revealing how much you have saved.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">Randomness</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Commitment Scheme</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Random seeds are committed onchain prior to the draw cycle. Neither nodes nor smart contracts can manipulate or bias the outcome in advance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">Automatic Settlement</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Encrypted Distribution</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                When a draw is finalized, the prize sum is homomorphically added to the winning participant’s balance ciphertext, requiring no manual claims.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
