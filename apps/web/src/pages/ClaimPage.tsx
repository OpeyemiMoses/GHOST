import React, { useState } from 'react';
import { useGhost, PrizeRecord } from '../context/GhostContext';
import { 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Gift, 
  Coins, 
  HelpCircle,
  Lock,
  Unlock,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClaimPage: React.FC = () => {
  const { 
    unclaimedPrizes, 
    claimedPrizes, 
    claimPrize, 
    userAddress, 
    rawAddress,
    setCurrentView,
    isDecrypted,
    isSigning,
    decryptSession
  } = useGhost();

  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (prize: PrizeRecord) => {
    if (!isDecrypted) {
      await decryptSession();
      return;
    }
    setClaimingId(prize.id);
    try {
      const success = await claimPrize(prize.id);
      if (success) {
        // Trigger celebratory confetti cannon
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ffffff', '#000000'],
        });
      }
    } finally {
      setClaimingId(null);
    }
  };

  const totalUnclaimedAmount = unclaimedPrizes.reduce((sum, p) => sum + p.amount, 0);
  const totalClaimedAmount = claimedPrizes.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Gift className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
              Claim Prize Winnings
            </h1>
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm max-w-xl">
            Ghost prize draws settle homomorphically on Sepolia. Winning allocations are stored encrypted onchain and require your private EIP-712 decryption clearance before claiming to your wallet.
          </p>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">
            Unclaimed Prizes
          </span>
          <div className="flex items-baseline gap-2">
            {isDecrypted ? (
              <span className="text-2xl sm:text-3xl font-bold text-amber-600">
                ${totalUnclaimedAmount.toFixed(2)}
              </span>
            ) : (
              <span className="font-mono text-sm sm:text-base font-semibold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>0x7f4e...9b12</span>
              </span>
            )}
            <span className="text-xs text-zinc-500 font-mono">
              {isDecrypted ? 'cUSDC' : 'cUSDC (Sealed)'}
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            {unclaimedPrizes.length} pending claim{unclaimedPrizes.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">
            Lifetime Claimed
          </span>
          <div className="flex items-baseline gap-2">
            {isDecrypted ? (
              <span className="text-2xl sm:text-3xl font-bold text-zinc-900">
                ${totalClaimedAmount.toFixed(2)}
              </span>
            ) : (
              <span className="font-mono text-sm sm:text-base font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-lg inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>0x3c2a...4d8e</span>
              </span>
            )}
            <span className="text-xs text-zinc-500 font-mono">cUSDC</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block">
            {claimedPrizes.length} settled payout{claimedPrizes.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">
            Connected Wallet
          </span>
          <div className="font-mono text-xs sm:text-sm font-semibold text-zinc-800 truncate">
            {rawAddress || 'No Wallet Connected'}
          </div>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Eligible for cryptographic verification</span>
          </span>
        </div>

      </div>

      {/* UNCLAIMED PRIZES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
            <span>Pending Unclaimed Prizes</span>
            {unclaimedPrizes.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-mono font-bold">
                {unclaimedPrizes.length} NEW
              </span>
            )}
          </h2>

          {unclaimedPrizes.length > 0 && !isDecrypted && (
            <button
              onClick={decryptSession}
              disabled={isSigning}
              className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isSigning ? 'Signing...' : 'Decrypt All Winnings (EIP-712)'}</span>
            </button>
          )}
        </div>

        {unclaimedPrizes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {unclaimedPrizes.map((prize) => (
              <div 
                key={prize.id}
                className="relative overflow-hidden p-6 rounded-3xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-500/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-md">
                    <Trophy className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 text-[11px] font-mono font-bold">
                        Event #{prize.eventId} Winner
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(prize.timestamp).toLocaleDateString()} at {new Date(prize.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {isDecrypted ? (
                      <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 flex items-center gap-2">
                        <span>${prize.amount.toFixed(2)}</span>
                        <span className="text-base text-zinc-500 font-normal">cUSDC</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Unmasked
                        </span>
                      </h3>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm sm:text-base font-bold text-amber-800 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg inline-flex items-center gap-2">
                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{prize.encryptedHandle ? `${prize.encryptedHandle.slice(0, 10)}...${prize.encryptedHandle.slice(-6)}` : '0x7f4e...9b12'}</span>
                          </span>
                          <span className="text-xs text-zinc-400 font-mono">cUSDC (euint64 Sealed)</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-500">
                      <span>Draw Tx:</span>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${prize.drawTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-zinc-700 hover:text-black underline flex items-center gap-1"
                      >
                        <span>{prize.drawTxHash.slice(0, 10)}...{prize.drawTxHash.slice(-8)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions: Decrypt First or Claim */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
                  {!isDecrypted ? (
                    <button
                      disabled={isSigning}
                      onClick={decryptSession}
                      className="w-full md:w-auto px-7 py-3.5 rounded-full bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isSigning ? 'Signing EIP-712 Clearance...' : 'Decrypt Prize (EIP-712)'}</span>
                    </button>
                  ) : (
                    <button
                      disabled={claimingId === prize.id}
                      onClick={() => handleClaim(prize)}
                      className="w-full md:w-auto px-7 py-3.5 rounded-full bg-black hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                    >
                      {claimingId === prize.id ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                          <span>Claiming Onchain...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Claim ${prize.amount.toFixed(2)} to Wallet</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-3xl bg-zinc-50 border border-zinc-200/80 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-zinc-200/80 text-zinc-500 flex items-center justify-center mb-3">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 mb-1">
              No Pending Unclaimed Prizes
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed mb-5 max-w-md">
              You currently have no uncollected winnings. Deposit assets into the Ghost Pool to participate in the ongoing 24-hour confidential prize draw!
            </p>
            <button
              onClick={() => setCurrentView('vault')}
              className="px-5 py-2.5 rounded-full bg-black hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Go to Savings Vault</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* CLAIMED HISTORY SECTION */}
      <div className="space-y-4 pt-6 border-t border-zinc-200">
        <h2 className="text-lg font-bold text-zinc-950 flex items-center gap-2">
          <span>Claimed Payouts History</span>
          <span className="text-xs text-zinc-500 font-normal">({claimedPrizes.length})</span>
        </h2>

        {claimedPrizes.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 text-zinc-600 font-mono border-b border-zinc-200">
                <tr>
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Prize Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Claimed Date</th>
                  <th className="py-3 px-4">Claim Tx Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono">
                {claimedPrizes.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4 font-bold text-zinc-900">Event #{p.eventId}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">${p.amount.toFixed(2)} cUSDC</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                        Claimed to Wallet
                      </span>
                    </td>
                    <td className="py-3 px-4 text-zinc-500">
                      {p.claimTimestamp ? new Date(p.claimTimestamp).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {p.claimTxHash ? (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${p.claimTxHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-600 hover:text-black underline flex items-center gap-1"
                        >
                          <span>{p.claimTxHash.slice(0, 8)}...{p.claimTxHash.slice(-6)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-zinc-400">Onchain Mint</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center text-xs text-zinc-400">
            No previous prize payouts claimed yet.
          </div>
        )}
      </div>

      {/* Protocol Explanation Box */}
      <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#eee9df] text-zinc-700 text-xs space-y-2">
        <div className="font-bold text-zinc-950 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-zinc-500" />
          <span>How Ghost Prize Claims Work:</span>
        </div>
        <p className="leading-relaxed text-zinc-600">
          When the Autonomous Keeper evaluates the draw using Zama Fully Homomorphic Encryption (FHE), the winner is selected homomorphically without decrypting participant balances. 
          To prevent unexpected onchain state changes, winning funds are not automatically transferred until you trigger the <strong>Claim Prize</strong> action, which mints and credits the assets directly into your connected Web3 address on Sepolia.
        </p>
      </div>

    </div>
  );
};
