import React from 'react';
import { ExternalLink, CheckCircle, Code } from 'lucide-react';

export const ContractsPage: React.FC = () => {
  const contracts = [
    {
      name: 'MockConfidentialToken (cUSDC)',
      role: 'Confidential Token Standard & Minting Faucet',
      address: '0x65C9020961f4fdF5E0a1fE01dC1225A096408B03',
    },
    {
      name: 'GhostVault',
      role: 'Confidential Yield Harvest & Zero-Loss Protection',
      address: '0xA83889ff7D4D78c53A05e050DaE596c9F3058b96',
    },
    {
      name: 'GhostPool',
      role: 'Encrypted Savings Accounting & Balance Tracking',
      address: '0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06',
    },
    {
      name: 'GhostDraw',
      role: 'Onchain FHE Verifiable Random Draw Engine',
      address: '0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F',
    },
    {
      name: 'GhostVerifier',
      role: 'Zero-Knowledge State Root & Solvency Verification',
      address: '0xf41C61D972615D5a8E08b574326B1258013B2B3C',
    },
  ];

  return (
    <div className="w-full min-h-screen p-6 sm:p-8 lg:p-10 space-y-6">
      
      {/* Header */}
      <div className="pb-8 border-b border-zinc-200 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Deployed Contracts
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Smart contract infrastructure deployed on Ethereum Sepolia.
        </p>
      </div>

      {/* Network Metadata */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-zinc-500">Network:</span> <span className="font-semibold text-zinc-900">Ethereum Sepolia (11155111)</span>
        </div>
        <div>
          <span className="text-zinc-500">Coprocessor:</span> <span className="font-semibold text-zinc-900">Zama fhEVM</span>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-3 mb-8">
        {contracts.map((c) => (
          <div
            key={c.name}
            className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Code className="w-4 h-4 text-zinc-600" />
                <span className="font-semibold text-sm text-zinc-950">{c.name}</span>
                <span className="inline-flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Verified</span>
                </span>
              </div>
              <div className="text-xs text-zinc-500 mb-1.5">{c.role}</div>
              <div className="font-mono text-[11px] text-zinc-700 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-200 w-fit">
                {c.address}
              </div>
            </div>

            <a
              href={`https://sepolia.etherscan.io/address/${c.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 w-fit"
            >
              <span>Etherscan</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          </div>
        ))}
      </div>

      {/* Architecture & Interaction Overview */}
      <div className="mt-8 space-y-6">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xs">
          <h2 className="text-base sm:text-lg font-bold text-zinc-950 tracking-tight mb-2">
            Smart Contract Topology & Security Boundaries
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 max-w-3xl">
            The Ghost protocol separates ledger accounting, yield strategies, and cryptographic randomness into modular, single-responsibility contracts to minimize attack surfaces and maintain provable self-custody.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">State Isolation</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Zero Plaintext Storage</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                <code className="font-mono text-zinc-800">GhostPool</code> stores user balances purely as encrypted handles (<code className="font-mono text-zinc-800">euint64</code>). No raw numerical value is ever assigned to an EVM storage slot.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block mb-1">Non-Custodial Flow</span>
              <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Direct Settlement Guarantees</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Users retain permanent direct withdrawal access. No admin key or multi-sig can prevent you from calling <code className="font-mono text-zinc-800">withdraw()</code> to claim your principal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Source Notice */}
      <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-center justify-between">
        <span>MIT License · Fully Verified on Sepolia Etherscan</span>
        <a
          href="https://github.com/2tynm/ghost"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-black hover:underline flex items-center gap-1"
        >
          <span>GitHub</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
