import React from 'react';

export const TechnicalSpecsMatrix: React.FC = () => {
  const specs = [
    {
      label: 'FHE COPROCESSOR',
      value: 'Zama fhEVM Sepolia Coprocessor · TFHE-rs integer arithmetic over 2048-bit lattice-based security'
    },
    {
      label: 'ENCRYPTED TYPES',
      value: 'euint64 (ciphertext handle) · ebool (encrypted comparison condition) · inEuint64 (ZK-proven client input)'
    },
    {
      label: 'SMART CONTRACTS',
      value: 'GhostPool · GhostVault · GhostDraw · GhostVerifier · MockConfidentialToken (Solidity 0.8.24 viaIR)'
    },
    {
      label: 'ACCESS CONTROL (ACL)',
      value: 'Zama EIP-712 KMS threshold re-encryption signatures · strictly scoped onchain via FHE.allow(handle, user)'
    },
    {
      label: 'ONCHAIN RANDOMNESS',
      value: 'FHE.randEuint64() cryptographically secure pseudo-random number generator seeded with block.prevrandao'
    },
    {
      label: 'PUBLIC AUDITABILITY',
      value: 'Immutable stateRoot Merkle hash commitments + randomness commitments stored onchain in GhostVerifier'
    },
    {
      label: 'ZERO PLAINTEXT LEAK',
      value: '0.00% plaintext bits leaked in contract state or event logs · verified by automated Hardhat zero-leakage regression audit'
    },
    {
      label: 'BOUNTY TARGET',
      value: 'Zama Developer Program Season 4: Confidential Prize-Savings Protocol · Target Network: Ethereum Sepolia'
    },
  ];

  return (
    <section className="relative w-full py-24 bg-[#07080a] border-t border-white/10 px-6 sm:px-12 lg:px-20 text-white select-none">
      
      {/* SECTION TITLE & DESCRIPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        <div className="lg:col-span-6">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
            <span className="w-4 h-[2px] bg-amber-400 inline-block" />
            <span>04 · SPECIFICATION</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            WHAT IS <br />
            ACTUALLY HERE.
          </h2>
        </div>

        <div className="lg:col-span-6 pt-3">
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-sans">
            Everything is mathematically enforced onchain. Sensitive user balances exist only as ciphertext
            handles. The interface inspects real smart contract state commitments on Ethereum Sepolia.
          </p>
        </div>
      </div>

      {/* HORIZONTAL RULE */}
      <div className="w-full h-[1px] bg-white/10 mb-8" />

      {/* 2-COLUMN MONOSPACE SPEC ROWS */}
      <div className="space-y-4 font-mono text-xs">
        {specs.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-3.5 border-b border-white/5 hover:bg-[#0e1117] transition-colors px-2 rounded-sm"
          >
            <div className="md:col-span-3 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
              {item.label}
            </div>
            <div className="md:col-span-9 text-slate-300 leading-relaxed text-[12px]">
              {item.value}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
