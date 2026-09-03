import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { triggerWaterRipple } from '../utils/ripple';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const docSections = [
    { id: 'intro', title: '1. EXECUTIVE SUMMARY' },
    { id: 'architecture', title: '2. SMART CONTRACT ARCHITECTURE' },
    { id: 'privacy', title: '3. THE 3-LAYER PRIVACY MODEL' },
    { id: 'fhe', title: '4. ZAMA FHE MATHEMATICAL PRIMITIVES' },
    { id: 'threat', title: '5. THREAT MODEL & MITIGATIONS' },
    { id: 'verification', title: '6. PUBLIC VERIFICATION SPEC' },
    { id: 'deploy', title: '7. SEPOLIA DEPLOYMENT & TESTING' },
  ];

  return (
    <div className="min-h-screen bg-[#07080a] py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Docs Header */}
        <div className="pb-8 border-b border-white/10 mb-10">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-widest mb-1.5">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>TECHNICAL SPECIFICATIONS & PROTOCOL DOCUMENTATION</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
            GHOST PROTOCOL DOCS
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-sans">
            Comprehensive reference manual for the Zama Developer Program Season 4 bounty implementation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Docs Sidebar Navigation (Geometric rounded-sm, zero pills) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-1 font-mono text-xs bg-[#0e1117] border border-white/10 rounded-sm p-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest px-3 py-2 border-b border-white/5 mb-2 font-bold">
                DOCUMENTATION INDEX
              </div>
              {docSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={(e) => {
                    triggerWaterRipple(e);
                    setActiveSection(sec.id);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-sm transition-colors ripple-container ${
                    activeSection === sec.id
                      ? 'bg-amber-400 text-black font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          {/* Docs Content Body */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Section 1: Executive Summary */}
            {activeSection === 'intro' && (
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
                  1. EXECUTIVE SUMMARY & BOUNTY CHALLENGE
                </h2>
                
                <p className="text-slate-300 leading-relaxed font-sans text-sm">
                  <strong>Ghost</strong> is a confidential prize-savings protocol engineered for the <strong>Zama Developer Program Season 4</strong> bounty.
                  Traditional prize-savings protocols like PoolTogether are completely transparent: every wallet balance, deposit amount, participant odds,
                  and prize win are publicly readable by anyone observing the mempool and blockchain.
                </p>

                <div className="p-6 rounded-sm bg-[#151921] border border-amber-500/40 text-amber-300 font-mono text-xs leading-relaxed">
                  <div className="font-bold text-amber-400 uppercase mb-1">THE CENTRAL GHOST PRINCIPLE:</div>
                  "Ghost allows the blockchain to verify what happened without revealing users' financial positions."
                </div>

                <h3 className="font-display text-xl font-bold text-white uppercase mt-6">
                  Core Protocol Capabilities
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <li className="p-4 rounded-sm bg-[#0e1117] border border-white/10">
                    <span className="text-amber-400 font-bold block mb-1">1. CONFIDENTIAL BALANCES</span>
                    Stored purely as Zama euint64 ciphertexts. Zero plaintext integers stored onchain.
                  </li>
                  <li className="p-4 rounded-sm bg-[#0e1117] border border-white/10">
                    <span className="text-amber-400 font-bold block mb-1">2. CONFIDENTIAL COMPUTATION</span>
                    Yield accrual, balance additions, and prize distribution execute homomorphically over encrypted state.
                  </li>
                  <li className="p-4 rounded-sm bg-[#0e1117] border border-white/10">
                    <span className="text-amber-400 font-bold block mb-1">3. CONFIDENTIAL PARTICIPATION</span>
                    Individual odds and ticket weights remain mathematically hidden during draw execution.
                  </li>
                  <li className="p-4 rounded-sm bg-[#0e1117] border border-white/10">
                    <span className="text-amber-400 font-bold block mb-1">4. PUBLIC VERIFIABILITY</span>
                    Draw state roots, randomness commitments, and winner allocations are verifiable by third parties.
                  </li>
                </ul>
              </div>
            )}

            {/* Section 2: Architecture */}
            {activeSection === 'architecture' && (
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
                  2. SMART CONTRACT ARCHITECTURE
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed font-sans">
                  The protocol is divided into four clean smart contracts adhering to strict separation of concerns:
                </p>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-5 rounded-sm bg-[#0e1117] border border-white/10">
                    <div className="font-bold text-white text-sm mb-1 text-amber-400">GhostPool</div>
                    <p className="text-slate-400 leading-relaxed font-sans">
                      Maintains <code className="text-slate-200">mapping(address =&gt; euint64) private _encryptedBalances</code>.
                      Handles <code className="text-slate-200">deposit(bytes encryptedAmount, bytes proof)</code> and <code className="text-slate-200">withdraw</code>.
                      Enforces the <strong>Zero Plaintext Principle</strong>: strictly emits 32-byte opaque ciphertext handles in event logs.
                    </p>
                  </div>

                  <div className="p-5 rounded-sm bg-[#0e1117] border border-white/10">
                    <div className="font-bold text-white text-sm mb-1 text-amber-400">GhostVault</div>
                    <p className="text-slate-400 leading-relaxed font-sans">
                      Manages the yield strategy and accumulates yield into an encrypted prize pool (<code className="text-slate-200">euint64 _encryptedPrizePool</code>).
                      Supplies prize allocations to GhostDraw upon draw finalization.
                    </p>
                  </div>

                  <div className="p-5 rounded-sm bg-[#0e1117] border border-white/10">
                    <div className="font-bold text-white text-sm mb-1 text-amber-400">GhostDraw</div>
                    <p className="text-slate-400 leading-relaxed font-sans">
                      Coordinates the confidential draw lifecycle. Invokes Zama's onchain PRNG <code className="text-slate-200">FHE.randEuint64()</code>,
                      hashes the participant balance handles into an immutable stateRoot, determines the winner without decrypting participant balances,
                      and credits the prize with ACL permissions restricted solely to the winner.
                    </p>
                  </div>

                  <div className="p-5 rounded-sm bg-[#0e1117] border border-white/10">
                    <div className="font-bold text-white text-sm mb-1 text-amber-400">GhostVerifier</div>
                    <p className="text-slate-400 leading-relaxed font-sans">
                      Public registry storing draw commitments: stateRoot, randomnessCommitment, winnerAddress, and encryptedPrizeHandle.
                      Exposes <code className="text-slate-200">verifyDraw(uint256 drawId)</code> for independent third-party auditing with zero wallet authentication.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Privacy Model */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
                  3. THE THREE-LAYER PRIVACY MODEL
                </h2>
                
                <p className="text-slate-300 text-sm leading-relaxed font-sans">
                  Ghost demonstrates technical maturity by explicitly differentiating between what FHE protects versus what the host blockchain exposes:
                </p>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-5 rounded-sm bg-[#0e1117] border border-amber-500/30">
                    <div className="text-amber-400 font-bold uppercase text-sm mb-1">LAYER 1: BALANCE PRIVACY</div>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      Balances, deposit amounts, and winning payouts are stored exclusively as <code>euint64</code> ciphertexts.
                      An outside observer querying storage or transaction events sees only opaque 32-byte handles. Only the owner with the private key can decrypt via Zama KMS.
                    </p>
                  </div>

                  <div className="p-5 rounded-sm bg-[#0e1117] border border-blue-500/30">
                    <div className="text-blue-400 font-bold uppercase text-sm mb-1">LAYER 2: COMPUTATION PRIVACY</div>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      Calculations occur directly over encrypted data: <br />
                      <code>Enc(balance) + Enc(yield) = Enc(newBalance)</code>.<br />
                      The contract never decrypts sensitive intermediate state simply for computational convenience.
                    </p>
                  </div>

                  <div className="p-5 rounded-sm bg-[#0e1117] border border-white/10">
                    <div className="text-slate-400 font-bold uppercase text-sm mb-1">LAYER 3: METADATA TRANSPARENCY</div>
                    <p className="text-slate-300 font-sans leading-relaxed">
                      FHE does not hide wallet addresses, gas consumption, or transaction hashes on Ethereum Sepolia.
                      Ghost does not make false claims of complete network anonymity; it guarantees financial state confidentiality with verifiable fairness.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: FHE */}
            {activeSection === 'fhe' && (
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
                  4. ZAMA FHE MATHEMATICAL PRIMITIVES
                </h2>
                <p className="text-slate-300 text-sm font-sans leading-relaxed">
                  Ghost is built on the <strong>Zama fhEVM</strong> framework using TFHE (Torus Fully Homomorphic Encryption) over 2048-bit lattices:
                </p>

                <div className="p-6 rounded-sm bg-[#07080a] border border-white/10 font-mono text-xs space-y-4">
                  <div>
                    <span className="text-amber-400 font-bold">1. Input Verification:</span>
                    <p className="text-slate-400 mt-1">
                      <code>euint64 amount = FHE.asEuint64(encryptedAmount, proof);</code><br />
                      Verifies client-side zero-knowledge proof of ciphertext validity before casting.
                    </p>
                  </div>

                  <div>
                    <span className="text-amber-400 font-bold">2. Homomorphic Arithmetic:</span>
                    <p className="text-slate-400 mt-1">
                      <code>_encryptedBalances[user] = FHE.add(_encryptedBalances[user], amount);</code><br />
                      Computes addition over ciphertexts without revealing underlying values.
                    </p>
                  </div>

                  <div>
                    <span className="text-amber-400 font-bold">3. Access Control (ACL):</span>
                    <p className="text-slate-400 mt-1">
                      <code>FHE.allow(_encryptedBalances[user], user);</code><br />
                      Authorizes the user's address to decrypt the ciphertext via Zama KMS re-encryption.
                    </p>
                  </div>

                  <div>
                    <span className="text-amber-400 font-bold">4. Onchain PRNG:</span>
                    <p className="text-slate-400 mt-1">
                      <code>euint64 rand = FHE.randEuint64();</code><br />
                      Generates onchain encrypted randomness seeded with block.prevrandao.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Threat Model */}
            {activeSection === 'threat' && (
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
                  5. THREAT MODEL & MITIGATIONS
                </h2>
                
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-sm bg-[#0e1117] border border-white/10">
                    <div className="text-amber-400 font-bold mb-1">THREAT: UNAUTHORIZED BALANCE DECRYPTION</div>
                    <p className="text-slate-400 font-sans text-xs">
                      <strong>Mitigation:</strong> Zama's KMS requires an EIP-712 cryptographic signature proving that the caller is the authorized owner.
                      Unauthorized requests are rejected at the threshold KMS level.
                    </p>
                  </div>

                  <div className="p-4 rounded-sm bg-[#0e1117] border border-white/10">
                    <div className="text-amber-400 font-bold mb-1">THREAT: SENSITIVE EVENT LOG LEAKAGE</div>
                    <p className="text-slate-400 font-sans text-xs">
                      <strong>Mitigation:</strong> Ghost enforces a strict Zero Plaintext Event Policy. All events emit only 32-byte ciphertext handles.
                      Verified by automated regression tests in <code className="text-slate-200">PrivacyIntegrity.test.ts</code>.
                    </p>
                  </div>

                  <div className="p-4 rounded-sm bg-[#0e1117] border border-white/10">
                    <div className="text-amber-400 font-bold mb-1">THREAT: RIGGED WINNER SELECTION</div>
                    <p className="text-slate-400 font-sans text-xs">
                      <strong>Mitigation:</strong> Winner selection executes entirely onchain using FHE.randEuint64() and state root commitments.
                      Commitments are immutably written to GhostVerifier at execution block, preventing post-hoc manipulation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Verification */}
            {activeSection === 'verification' && (
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
                  6. PUBLIC VERIFICATION SPECIFICATION
                </h2>
                <p className="text-slate-300 text-sm font-sans leading-relaxed">
                  Anyone can query the public verification contract on Sepolia without connecting a wallet:
                </p>

                <div className="p-6 rounded-sm bg-[#07080a] border border-white/10 font-mono text-xs">
                  <div className="text-emerald-400 font-bold mb-2">CLI COMMAND:</div>
                  <pre className="text-slate-200 overflow-x-auto p-3 rounded-sm bg-[#151921] border border-white/5">
                    cast call 0xVERIFIER "verifyDraw(uint256)" 20 --rpc-url https://rpc.sepolia.org
                  </pre>
                  <div className="text-slate-400 mt-4">
                    Returns: (bool isValid, bytes32 stateRoot, bytes32 randomnessCommitment, address winner, bytes32 encryptedPrizeHandle, uint256 timestamp)
                  </div>
                </div>
              </div>
            )}

            {/* Section 7: Deployment */}
            {activeSection === 'deploy' && (
              <div className="space-y-6">
                <h2 className="font-display text-3xl font-black text-white uppercase tracking-tight">
                  7. SEPOLIA DEPLOYMENT & TESTING
                </h2>
                <p className="text-slate-300 text-sm font-sans leading-relaxed">
                  To run all automated tests and deploy to Ethereum Sepolia:
                </p>

                <div className="p-6 rounded-sm bg-[#07080a] border border-white/10 font-mono text-xs space-y-4">
                  <div>
                    <div className="text-amber-400 font-bold">1. Run Full Test Suite:</div>
                    <pre className="text-slate-200 bg-[#151921] p-2.5 rounded-sm border border-white/5 mt-1">npm test</pre>
                  </div>
                  <div>
                    <div className="text-amber-400 font-bold">2. Run Privacy Audit Test (0 Plaintext Leakage):</div>
                    <pre className="text-slate-200 bg-[#151921] p-2.5 rounded-sm border border-white/5 mt-1">npm run test:privacy</pre>
                  </div>
                  <div>
                    <div className="text-amber-400 font-bold">3. Deploy to Sepolia:</div>
                    <pre className="text-slate-200 bg-[#151921] p-2.5 rounded-sm border border-white/5 mt-1">npm run deploy:sepolia</pre>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
