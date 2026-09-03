import React from 'react';
import { useGhost } from '../context/GhostContext';
import { History, CheckCircle, AlertCircle, ExternalLink, Lock, Unlock, KeyRound } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const { walletConnected, transactions, isDecrypted, isSigning, decryptSession, lockSession } = useGhost();

  return (
    <div className="w-full min-h-screen p-8 sm:p-12 lg:p-14 w-full">
      
      {/* Header */}
      <div className="pb-8 border-b border-zinc-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Activity
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Your personal confidential transactions on Ethereum Sepolia.
          </p>
        </div>

        {/* Cryptographic Session Clearance Controls */}
        {walletConnected && (
          <div className="flex items-center gap-3">
            {!isDecrypted ? (
              <button
                onClick={decryptSession}
                disabled={isSigning}
                className="btn-pill-primary text-xs font-semibold py-2 px-4 flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSigning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing Decryption...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Decrypt Amounts with Wallet</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Amounts Decrypted</span>
                </span>
                <button
                  onClick={lockSession}
                  disabled={isSigning}
                  className="btn-pill-secondary text-xs font-semibold py-1.5 px-3.5 flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSigning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                      <span>Signing Re-Seal...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Sign to Lock & Encrypt</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-zinc-200 rounded-3xl p-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
          <div className="flex items-center gap-2 font-semibold text-sm text-zinc-900">
            <History className="w-4 h-4 text-zinc-500" />
            <span>Transaction History</span>
          </div>
          <span className="text-xs text-zinc-400">{transactions.length} total</span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-xs flex flex-col items-center justify-center gap-1.5">
            <AlertCircle className="w-5 h-5 text-zinc-300" />
            <span>No transactions yet.</span>
            <span className="text-zinc-500 text-[11px]">
              {walletConnected
                ? 'Make a deposit in the Vault to view your activity.'
                : 'Connect your wallet in the sidebar to view your history.'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-100 text-[11px]">
                  <th className="pb-2.5 font-medium">Type</th>
                  <th className="pb-2.5 font-medium">Amount</th>
                  <th className="pb-2.5 font-medium">Ciphertext Reference</th>
                  <th className="pb-2.5 font-medium">Tx Hash</th>
                  <th className="pb-2.5 font-medium">Time</th>
                  <th className="pb-2.5 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3.5 font-semibold text-zinc-900 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          tx.type === 'Deposit'
                            ? 'bg-emerald-500'
                            : tx.type === 'Prize Won'
                            ? 'bg-amber-500'
                            : 'bg-zinc-800'
                        }`}
                      />
                      <span>{tx.type}</span>
                    </td>
                    <td className="py-3.5 font-semibold">
                      {isDecrypted ? (
                        <span>${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cUSDC</span>
                      ) : (
                        <span className="text-zinc-400 font-mono flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500 inline" />
                          <span>••••••</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 font-mono text-zinc-400 max-w-[160px] truncate">{tx.encryptedHandle}</td>
                    <td className="py-3.5 font-mono text-zinc-500">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black flex items-center gap-1"
                      >
                        <span className="truncate max-w-[120px]">{tx.txHash}</span>
                        <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3.5 text-zinc-400">
                      {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1.5 text-zinc-700 font-medium text-xs font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{tx.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contextual Writings & Ledger Architecture */}
      <div className="mt-8 space-y-6">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xs">
          <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight mb-2">
            Confidential Transaction Ledger Mechanics
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 max-w-3xl">
            In standard EVM transactions, input amounts and state changes are publicly decoded in ERC-20 Transfer logs. 
            On Ghost, every action emits an authentic onchain state receipt while maintaining complete financial privacy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">State Receipts</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Ciphertext Handles</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                The ciphertext handle is a unique cryptographic pointer on Sepolia that allows smart contracts to reference your encrypted balance without decrypting it.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">Explorer Visibility</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Zero Plaintext In Logs</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Public blockchain indexers can verify transaction gas, timestamps, and contract function execution, but token quantities remain unreadable to everyone except you.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">Auditability</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Cryptographic Proofs</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Every transaction generates an irreversible Ethereum transaction hash, allowing you to prove execution and historical ownership at any future time.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
