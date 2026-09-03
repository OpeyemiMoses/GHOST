import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Shield, Lock, Unlock, Cpu, Code2, KeyRound, Sparkles, 
  ExternalLink, Search, Copy, Check, ChevronRight, Layers, Database, 
  ArrowRight, ArrowLeft, AlertTriangle, FileText, Terminal, HelpCircle, 
  CheckCircle2, RefreshCw, Eye, EyeOff, Hash, Clock, Coins, Wallet,
  Zap, Server, GitBranch, ArrowDown, Network, ShieldCheck
} from 'lucide-react';
import { useGhost } from '../context/GhostContext';
import { ScrollReveal } from '../components/ScrollReveal';

interface SubPage {
  id: string;
  title: string;
  description: string;
}

interface DocArea {
  id: string;
  number: string;
  title: string;
  icon: any;
  subpages: SubPage[];
}

export const DocsPage: React.FC = () => {
  const { setCurrentView } = useGhost();
  const [activeAreaId, setActiveAreaId] = useState<string>('overview');
  const [activeSubPageId, setActiveSubPageId] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeDataFlowTab, setActiveDataFlowTab] = useState<'deposit' | 'withdraw' | 'draw' | 'decrypt'>('deposit');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const docAreas: DocArea[] = [
    {
      id: 'overview',
      number: '01',
      title: 'Overview',
      icon: BookOpen,
      subpages: [
        { id: 'intro', title: 'Introduction', description: 'Core principles and protocol summary' },
        { id: 'getting-started', title: 'Getting Started', description: 'Beginner guide to using Ghost on Sepolia' },
        { id: 'why-ghost', title: 'Why Ghost Exists', description: 'The fundamental blockchain privacy problem' },
        { id: 'how-ghost-works', title: 'How Ghost Works', description: 'Flagship 7-step interactive execution journey' },
      ]
    },
    {
      id: 'product',
      number: '02',
      title: 'Product',
      icon: Layers,
      subpages: [
        { id: 'product-overview', title: 'What is Ghost?', description: 'Product philosophy, target, and scope' },
        { id: 'vault', title: 'The Vault', description: 'Core UI, confidential balance, architectural privacy' },
        { id: 'deposits', title: 'Deposits', description: 'Complete deposit lifecycle and ciphertext creation' },
        { id: 'withdrawals', title: 'Withdrawals', description: 'Withdrawal authorization, state updates, and failure handling' },
        { id: 'yield', title: 'Yield', description: 'Continuous homomorphic yield accounting' },
        { id: 'events', title: 'Events', description: 'Zero-loss prize draws and verifiable computation' },
        { id: 'activity', title: 'Activity', description: 'Public blockchain metadata vs confidential records' },
      ]
    },
    {
      id: 'privacy',
      number: '03',
      title: 'Privacy',
      icon: Shield,
      subpages: [
        { id: 'privacy-model', title: 'Ghost Privacy Model', description: 'Architectural privacy vs UI toggles' },
        { id: 'what-is-private', title: 'What Is Private', description: 'Comprehensive confidential state classification table' },
        { id: 'what-is-public', title: 'What Is Public', description: 'Transparent onchain metadata and observer visibility' },
        { id: 'proof-of-privacy', title: 'Proof of Privacy', description: 'Verifying privacy on Sepolia Etherscan' },
        { id: 'fhe', title: 'What is FHE?', description: 'Fully Homomorphic Encryption simplified & technical' },
        { id: 'encryption-lifecycle', title: 'Encryption Lifecycle', description: 'Plaintext to FHE computation to decryption' },
        { id: 'access-control', title: 'Access Control', description: 'Zama ACL, FHE.allow, and permission lifetimes' },
        { id: 'user-decryption', title: 'User Decryption', description: 'Cryptographic client-side unmasking via signatures' },
        { id: 'limitations', title: 'Privacy Limitations', description: 'Confidentiality vs network anonymity' },
      ]
    },
    {
      id: 'protocol',
      number: '04',
      title: 'Protocol',
      icon: Cpu,
      subpages: [
        { id: 'protocol-overview', title: 'Protocol Overview', description: 'Visual system layers and contract hierarchy' },
        { id: 'confidential-state', title: 'Confidential State', description: 'euint64 state variables and storage mechanics' },
        { id: 'confidential-accounting', title: 'Confidential Accounting', description: 'Mathematical precision, rounding, and invariant safety' },
        { id: 'event-lifecycle', title: 'Event Lifecycle', description: 'OPEN to SNAPSHOT, COMPUTATION, and FINALIZED' },
        { id: 'protocol-verification', title: 'Verification', description: 'Third-party outcome auditability without balances' },
      ]
    },
    {
      id: 'architecture',
      number: '05',
      title: 'Architecture',
      icon: Database,
      subpages: [
        { id: 'system-architecture', title: 'System Architecture', description: 'Coprocessor separation, Gateway, and KMS' },
        { id: 'smart-contracts', title: 'Smart Contracts', description: 'GhostVault, GhostPool, GhostDraw, and GhostVerifier' },
        { id: 'fhe-architecture', title: 'FHE Architecture', description: 'Zama tfhe.rs types and coprocessor offloading' },
        { id: 'frontend-architecture', title: 'Frontend Architecture', description: 'Wagmi, Viem, RainbowKit, and dual-key signatures' },
        { id: 'backend-architecture', title: 'Backend Architecture', description: 'Indexers and what is deliberately NOT stored' },
        { id: 'data-flows', title: 'Data Flows', description: 'Visual execution pipelines for all user actions' },
      ]
    },
    {
      id: 'developers',
      number: '06',
      title: 'Developers',
      icon: Code2,
      subpages: [
        { id: 'dev-quickstart', title: 'Quickstart', description: 'Clone, install, compile, test, and run locally' },
        { id: 'dev-setup', title: 'Environment Setup', description: 'Node.js, Hardhat, and .env configuration' },
        { id: 'dev-contracts', title: 'Contract Development', description: 'Compiling with @zama-fhe/fhevm and Hardhat' },
        { id: 'dev-frontend', title: 'Frontend Integration', description: 'Interacting with FHE contracts from TypeScript' },
        { id: 'dev-fhe-guide', title: 'FHE Development Guide', description: 'Best practices for writing confidential Solidity' },
        { id: 'dev-integration', title: 'Integration Guide', description: 'Integrating Ghost into external DeFi protocols' },
        { id: 'dev-api', title: 'API & SDK Reference', description: 'Context hooks, types, and client-side utilities' },
        { id: 'dev-contract-reference', title: 'Contract Reference', description: 'Detailed ABI specification for all public functions' },
        { id: 'dev-deployments', title: 'Live Deployments', description: 'Verified contract addresses on Ethereum Sepolia' },
      ]
    },
    {
      id: 'security',
      number: '07',
      title: 'Security',
      icon: Lock,
      subpages: [
        { id: 'security-model', title: 'Security Model', description: 'Threat model and core cryptographic assumptions' },
        { id: 'threat-matrix', title: 'Threat Matrix', description: 'Attack vectors and architectural mitigations' },
        { id: 'fhe-security', title: 'FHE Security', description: 'Lattice-based cryptography and TFHE noise bounds' },
        { id: 'smart-contract-security', title: 'Contract Security', description: 'Reentrancy, integer bounds, and emergency pausing' },
        { id: 'audits', title: 'Audit Status', description: 'Formal verification roadmap and security milestones' },
        { id: 'bug-bounty', title: 'Bug Bounty', description: 'Responsible disclosure guidelines and scope' },
      ]
    },
    {
      id: 'resources',
      number: '08',
      title: 'Resources',
      icon: FileText,
      subpages: [
        { id: 'glossary', title: 'Glossary', description: '20+ essential FHE and confidential DeFi definitions' },
        { id: 'faq', title: 'FAQ', description: 'Frequently asked technical questions' },
        { id: 'changelog', title: 'Changelog', description: 'Release history from v1.0.0-alpha on Sepolia' },
      ]
    }
  ];

  // Search filtering across all areas and subpages
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { areaId: string; areaTitle: string; subpage: SubPage }[] = [];
    docAreas.forEach((area) => {
      area.subpages.forEach((sub) => {
        if (
          sub.title.toLowerCase().includes(q) || 
          sub.description.toLowerCase().includes(q) ||
          area.title.toLowerCase().includes(q)
        ) {
          results.push({ areaId: area.id, areaTitle: area.title, subpage: sub });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const currentArea = docAreas.find((a) => a.id === activeAreaId) || docAreas[0];
  const currentSubPage = currentArea.subpages.find((s) => s.id === activeSubPageId) || currentArea.subpages[0];

  // Helper for sequential pagination
  const allSubPages = useMemo(() => {
    const list: { areaId: string; subpage: SubPage }[] = [];
    docAreas.forEach((a) => {
      a.subpages.forEach((s) => {
        list.push({ areaId: a.id, subpage: s });
      });
    });
    return list;
  }, []);

  const currentIndex = allSubPages.findIndex((p) => p.subpage.id === activeSubPageId);
  const prevPage = currentIndex > 0 ? allSubPages[currentIndex - 1] : null;
  const nextPage = currentIndex < allSubPages.length - 1 ? allSubPages[currentIndex + 1] : null;

  const navigateTo = (areaId: string, subPageId: string) => {
    setActiveAreaId(areaId);
    setActiveSubPageId(subPageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-zinc-900 pb-24 pt-6 sm:pt-8 px-4 sm:px-8 lg:px-10 selection:bg-zinc-200">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Top Header & Search Bar with Scroll Animation */}
        <ScrollReveal delay={0}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200/80 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5 text-zinc-900" />
                <span>Ghost Protocol · Technical Documentation System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                Protocol Specifications & Reference
              </h1>
              <p className="text-xs text-zinc-500 mt-1">
                Complete architectural documentation for the Zama fhEVM confidential prize-savings protocol on Ethereum Sepolia.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all 35+ topics..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Help Centre Link Button */}
              <button
                onClick={() => setCurrentView('help')}
                className="btn-pill-secondary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-zinc-700" />
                <span>Help Centre</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Grid: Sidebar & Content View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (3/12): Fixed/Sticky Stationary Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-4 sticky top-6 self-start max-h-[calc(100vh-48px)] overflow-y-auto pr-1 select-none">
            
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="p-3 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-1 max-h-72 overflow-y-auto">
                <div className="text-[10px] font-mono text-zinc-400 uppercase px-2 py-1">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.length === 0 ? (
                  <div className="text-xs text-zinc-500 p-2">No matching documentation topics found.</div>
                ) : (
                  searchResults.map((res) => (
                    <button
                      key={res.subpage.id}
                      onClick={() => {
                        navigateTo(res.areaId, res.subpage.id);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-zinc-100 transition-colors text-xs cursor-pointer"
                    >
                      <div className="font-semibold text-zinc-900">{res.subpage.title}</div>
                      <div className="text-[10px] text-zinc-400 truncate">{res.areaTitle} · {res.subpage.description}</div>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* 8 Areas Sidebar Navigation */}
            <div className="p-3.5 bg-white border border-zinc-200/80 rounded-2xl sm:rounded-3xl shadow-xs space-y-1.5">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-zinc-100 mb-1 flex items-center justify-between">
                <span>Documentation Areas</span>
                <span>8 Sections</span>
              </div>

              {docAreas.map((area) => {
                const isAreaActive = activeAreaId === area.id;
                const IconComponent = area.icon;

                return (
                  <div key={area.id} className="space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveAreaId(area.id);
                        setActiveSubPageId(area.subpages[0].id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isAreaActive
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] ${isAreaActive ? 'text-zinc-400' : 'text-zinc-400'}`}>
                          {area.number}
                        </span>
                        <span>{area.title}</span>
                      </div>
                      <IconComponent className={`w-3.5 h-3.5 ${isAreaActive ? 'text-white' : 'text-zinc-400'}`} />
                    </button>

                    {/* Subpages List if Area Active */}
                    {isAreaActive && (
                      <div className="pl-3 pr-1 py-1 space-y-0.5 border-l border-zinc-200 ml-3.5 my-1">
                        {area.subpages.map((sub) => {
                          const isSubActive = activeSubPageId === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setActiveSubPageId(sub.id)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer truncate flex items-center justify-between ${
                                isSubActive
                                  ? 'bg-zinc-100 text-zinc-950 font-bold'
                                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
                              }`}
                            >
                              <span className="truncate">{sub.title}</span>
                              {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 shrink-0 ml-1.5" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Context Card */}
            <div className="p-4 bg-zinc-950 text-white rounded-2xl border border-zinc-800 shadow-xs text-xs space-y-2">
              <div className="font-semibold text-zinc-100 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-emerald-400" />
                </div>
                <span>Production Standard</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Ghost maps its cryptographic state directly onto Zama's official fhEVM ACL, Gateway, and coprocessor standards.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN (9/12): Main Documentation Body */}
          <div className="lg:col-span-9 bg-white border border-zinc-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
            
            {/* Breadcrumb Header */}
            <ScrollReveal delay={50}>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 border-b border-zinc-100 pb-4">
                <span>GHOST DOCS</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-zinc-600 font-semibold">{currentArea.number} {currentArea.title}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-zinc-950 font-bold">{currentSubPage.title}</span>
              </div>
            </ScrollReveal>

            {/* ========================================================================= */}
            {/* AREA 01 — OVERVIEW */}
            {/* ========================================================================= */}
            {activeAreaId === 'overview' && (
              <div className="space-y-8">
                {activeSubPageId === 'intro' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Introduction to Ghost Protocol
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          A confidential, zero-loss prize-savings protocol powered by Torus and Zama fhEVM.
                        </p>
                      </div>

                      <div className="prose prose-zinc text-xs text-zinc-600 leading-relaxed space-y-4">
                        <p>
                          <strong>Ghost</strong> is a decentralized, non-custodial savings protocol engineered on <strong>Ethereum Sepolia</strong>. 
                          In traditional decentralized finance, every account balance, yield accrual event, and transaction amount is publicly exposed in plaintext 
                          ERC-20 transfer logs, subjecting savers to MEV bot surveillance, front-running, and irreversible loss of financial privacy.
                        </p>
                        <p>
                          Ghost resolves this systemic vulnerability by keeping sensitive financial state encrypted while allowing smart contracts to compute over that state 
                          and produce publicly verifiable outcomes. Utilizing <strong>Fully Homomorphic Encryption (FHE)</strong> via Zama's fhEVM and the Torus Network coprocessor, 
                          Ghost executes savings arithmetic, yield distribution, and prize draws over <code>euint64</code> ciphertext handles without ever exposing plaintext numbers.
                        </p>
                      </div>

                      {/* The 3 Core Principles */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-bold text-zinc-950">The Three Core Principles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 hover:border-zinc-300 transition-all">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Principle 01</span>
                            <h4 className="font-bold text-xs text-zinc-900">Private by Default</h4>
                            <p className="text-xs text-zinc-600 leading-relaxed">
                              Financial state isn't published as ordinary plaintext blockchain data. All deposit balances are sealed in cryptographic ciphertext handles onchain.
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 hover:border-zinc-300 transition-all">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Principle 02</span>
                            <h4 className="font-bold text-xs text-zinc-900">Encrypted by Construction</h4>
                            <p className="text-xs text-zinc-600 leading-relaxed">
                              Sensitive values remain encrypted while Ghost performs the computations required by the protocol. Addition, yield math, and random selection occur homomorphically.
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 hover:border-zinc-300 transition-all">
                            <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">Principle 03</span>
                            <h4 className="font-bold text-xs text-zinc-900">Verifiable by Everyone</h4>
                            <p className="text-xs text-zinc-600 leading-relaxed">
                              Ghost doesn't replace transparency with trust. Protocol outcomes and Merkle state roots remain independently verifiable by any third party.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'getting-started' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Getting Started
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          The beginner's guide to using Ghost on Ethereum Sepolia.
                        </p>
                      </div>

                      <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                          <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">1</span>
                            <span>Network & Wallet Requirements</span>
                          </h3>
                          <p>
                            Ghost operates on the <strong>Ethereum Sepolia Testnet (Chain ID: 11155111)</strong>. You can connect using MetaMask, Rainbow, Coinbase Wallet, or any standard injected Web3 wallet.
                          </p>
                          <div className="p-3 bg-white rounded-xl border border-zinc-200 font-mono text-[11px] text-zinc-700">
                            Network: Ethereum Sepolia<br />
                            Chain ID: 11155111<br />
                            Currency: Sepolia ETH (Gas)
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                          <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">2</span>
                            <span>Connecting & Session Authorization</span>
                          </h3>
                          <p>
                            When you connect your wallet, Ghost's gateway prompts for an on-demand cryptographic signature. This establishes an ephemeral, client-side session key to interact with your confidential contracts.
                          </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                          <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">3</span>
                            <span>Minting Testnet cUSDC & Depositing</span>
                          </h3>
                          <p>
                            Navigate to the <strong>Vault</strong> page, switch to the <strong>Faucet</strong> tab, and sign the transaction to mint 1,000 testnet <code>cUSDC</code>. Then enter a deposit amount and click <strong>Deposit Encrypted cUSDC</strong>.
                          </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                          <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">4</span>
                            <span>Decrypting & Re-Sealing Your Position</span>
                          </h3>
                          <p>
                            Your balance displays as sealed ciphertext (<code>••••••••</code>). Click <strong>Decrypt Balance with Wallet Signature</strong> to unmask your balance in your browser. Click <strong>Sign to Lock & Encrypt</strong> at any time to re-seal your state.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'why-ghost' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Why Ghost Exists
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Addressing the fundamental blockchain privacy problem with designed flow architecture.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Designed Card 1: Transparent EVM */}
                        <div className="p-6 rounded-3xl bg-zinc-50 border border-red-200/80 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                              Traditional Transparent Model
                            </span>
                            <Eye className="w-4 h-4 text-red-500" />
                          </div>

                          {/* Visual Pipeline */}
                          <div className="space-y-2 py-2">
                            <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between text-xs font-semibold text-zinc-800">
                              <span>1. User Wallet</span>
                              <span className="text-[10px] font-mono text-zinc-400">0x...</span>
                            </div>
                            <div className="flex justify-center text-zinc-300">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </div>
                            <div className="p-3 bg-red-50/50 rounded-xl border border-red-200/60 flex items-center justify-between text-xs text-red-900 font-semibold">
                              <span>2. Plaintext Transfer Log</span>
                              <span className="text-[10px] font-mono text-red-600 font-bold">$10,000 cUSDC</span>
                            </div>
                            <div className="flex justify-center text-zinc-300">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </div>
                            <div className="p-3 bg-red-100/60 rounded-xl border border-red-300 text-xs text-red-950 space-y-1 font-medium">
                              <div className="font-bold text-red-700">Public Observer Surveillance:</div>
                              <div className="text-[11px] text-red-900 leading-tight">
                                • Balance indexed publicly on Etherscan<br />
                                • Winning odds and ticket weights exposed<br />
                                • MEV bot targeting and front-running risk
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Designed Card 2: Ghost FHE */}
                        <div className="p-6 rounded-3xl bg-zinc-50 border border-emerald-200/80 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              Ghost Confidential Architecture
                            </span>
                            <Lock className="w-4 h-4 text-emerald-600" />
                          </div>

                          {/* Visual Pipeline */}
                          <div className="space-y-2 py-2">
                            <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between text-xs font-semibold text-zinc-800">
                              <span>1. User Wallet</span>
                              <span className="text-[10px] font-mono text-zinc-400">Client Encryption</span>
                            </div>
                            <div className="flex justify-center text-emerald-500">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </div>
                            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-semibold">
                              <span>2. euint64 Ciphertext Handle</span>
                              <span className="text-[10px] font-mono text-emerald-700 font-bold">0x8f4c...3e1a</span>
                            </div>
                            <div className="flex justify-center text-emerald-500">
                              <ArrowDown className="w-3.5 h-3.5" />
                            </div>
                            <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-300 text-xs text-emerald-950 space-y-1 font-medium">
                              <div className="font-bold text-emerald-800">Homomorphic Execution:</div>
                              <div className="text-[11px] text-emerald-900 leading-tight">
                                • Balances remain mathematically sealed<br />
                                • FHE Coprocessor computes yield on ciphertext<br />
                                • Publicly verifiable state roots on Sepolia
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'how-ghost-works' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          How Ghost Works — 7-Step Interactive Journey
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          The complete confidential execution lifecycle from deposit to verifiable outcome.
                        </p>
                      </div>

                      {/* 7-Step Designed Interactive Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { step: '01', title: 'You Deposit', desc: 'Your wallet initiates a non-custodial transaction with testnet cUSDC.', tag: 'User Action', icon: Wallet },
                          { step: '02', title: 'Sensitive Input Encrypted', desc: 'The token amount is encrypted client-side into an euint64 ciphertext handle.', tag: 'Client-Side FHE', icon: Lock },
                          { step: '03', title: 'Ghost Stores Encrypted State', desc: 'Ghost contracts update balance mappings using 32-byte ciphertext pointers.', tag: 'Smart Contract', icon: Database },
                          { step: '04', title: 'Ghost Computes Privately', desc: 'Torus FHE coprocessor computes yield additions and lottery odds directly over encrypted integers.', tag: 'Torus Coprocessor', icon: Cpu },
                          { step: '05', title: 'Protocol Produces Result', desc: 'Ghost outputs a confidential state transition and prize allocation.', tag: 'State Transition', icon: Sparkles },
                          { step: '06', title: 'Result is Verifiable', desc: 'Merkle state roots and randomness commitments are published onchain for independent public audit.', tag: 'Verification', icon: ShieldCheck },
                          { step: '07', title: 'You Access Information', desc: 'You authorize client-side decryption using an ephemeral wallet signature to view your unmasked balance.', tag: 'Dual-Key Decrypt', icon: KeyRound },
                        ].map((s) => {
                          const Icon = s.icon;
                          return (
                            <div key={s.step} className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 transition-all space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="w-7 h-7 rounded-full bg-zinc-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                                  {s.step}
                                </span>
                                <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white border border-zinc-200 text-zinc-600">
                                  {s.tag}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-bold text-xs text-zinc-950 flex items-center gap-1.5">
                                  <Icon className="w-3.5 h-3.5 text-zinc-700" />
                                  <span>{s.title}</span>
                                </h3>
                                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{s.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* AREA 02 — PRODUCT */}
            {/* ========================================================================= */}
            {activeAreaId === 'product' && (
              <div className="space-y-8">
                {activeSubPageId === 'product-overview' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          What is Ghost?
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Product philosophy, scope, and technical design tenets.
                        </p>
                      </div>

                      <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                        <p>
                          Ghost is an institutional-grade prize-savings protocol where depositors pool confidential stablecoin assets, earn continuous yield, 
                          and enter automated, zero-loss prize draws without broadcasting their net worth to public blockchain indexers.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                            <h3 className="font-bold text-xs text-zinc-900">Target Environment</h3>
                            <p className="text-xs text-zinc-600">Ethereum Sepolia Testnet with Zama fhEVM coprocessor infrastructure.</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                            <h3 className="font-bold text-xs text-zinc-900">Underlying Asset</h3>
                            <p className="text-xs text-zinc-600">MockConfidentialToken (cUSDC) with encrypted 6-decimal integer handles.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'vault' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          The Vault
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Core user interface and non-custodial balance accounting.
                        </p>
                      </div>

                      <div className="p-5 rounded-3xl bg-zinc-900 text-white space-y-2 text-xs">
                        <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Architectural Privacy Notice</span>
                        </div>
                        <p className="text-zinc-300 leading-relaxed">
                          Ghost does not have a cosmetic "Hide Balance" or "Reveal Balance" switch. Privacy is architectural by construction. 
                          Your balance is stored as an onchain ciphertext handle and is only unmasked when you cryptographically sign a decryption clearance with your private key.
                        </p>
                      </div>

                      <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
                        <h3 className="font-bold text-xs text-zinc-900">Vault States & Actions</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li><strong>Confidential Balance:</strong> Represented as an <code>euint64</code> ciphertext handle on Sepolia.</li>
                          <li><strong>Live Yield Ticker:</strong> Continuous compounding calculated over encrypted deposit integers.</li>
                          <li><strong>Deposit Form:</strong> Validates wallet balance and initiates encrypted onchain transfer.</li>
                          <li><strong>Withdrawal Form:</strong> Allows instant withdrawal of 100% of your principal without penalties.</li>
                        </ul>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'deposits' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Deposits Lifecycle
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Step-by-step cryptographic lifecycle of a vault deposit.
                        </p>
                      </div>

                      {/* Designed Step Pipeline */}
                      <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 bg-white rounded-xl border border-zinc-200">
                            <div className="font-mono text-[10px] text-zinc-400">STEP 1</div>
                            <div className="font-bold text-zinc-900 mt-0.5">Wallet Select</div>
                            <div className="text-[11px] text-zinc-500 mt-1">Choose cUSDC amount</div>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-zinc-200">
                            <div className="font-mono text-[10px] text-zinc-400">STEP 2</div>
                            <div className="font-bold text-zinc-900 mt-0.5">FHE Encrypt</div>
                            <div className="text-[11px] text-zinc-500 mt-1">Generate euint64 handle</div>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-zinc-200">
                            <div className="font-mono text-[10px] text-zinc-400">STEP 3</div>
                            <div className="font-bold text-zinc-900 mt-0.5">EVM Transfer</div>
                            <div className="text-[11px] text-zinc-500 mt-1">Submit to GhostVault</div>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-zinc-200">
                            <div className="font-mono text-[10px] text-zinc-400">STEP 4</div>
                            <div className="font-bold text-zinc-900 mt-0.5">Vault Sync</div>
                            <div className="text-[11px] text-zinc-500 mt-1">Enters prize pool</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'withdrawals' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Withdrawals
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Instant, non-custodial capital redemption.
                        </p>
                      </div>

                      <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
                        <p>
                          Withdrawals allow you to redeem 100% of your deposited principal back to your connected wallet at any time. 
                          Because Ghost is a zero-loss protocol, your principal is never consumed to fund prize pools.
                        </p>
                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
                          <h3 className="font-bold text-xs text-zinc-900 mb-1.5">Failure Handling & Reversions</h3>
                          <p className="text-xs text-zinc-600">
                            If a withdrawal request exceeds the encrypted balance handle or if gas is insufficient, 
                            the contract strictly reverts without mutating state or deducting user balance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'yield' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Yield Mechanics
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          How continuous homomorphic savings yield is generated and accounted.
                        </p>
                      </div>

                      <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                        <p>
                          In Ghost, yield originates from the collective capital pool deployed in <code>GhostPool.sol</code>. 
                          Torus FHE coprocessors evaluate continuous compound interest formulas over encrypted integer state.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
                            <h3 className="font-bold text-xs text-zinc-900 mb-1">What is Public</h3>
                            <p className="text-xs text-zinc-600">Total global yield pool accumulator and protocol draw interval timers.</p>
                          </div>
                          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
                            <h3 className="font-bold text-xs text-zinc-900 mb-1">What Remains Confidential</h3>
                            <p className="text-xs text-zinc-600">Individual user yield share, accumulated interest amounts, and personal ticket weights.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'events' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Events & Zero-Loss Prize Draws
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Verifiable cryptographic prize distribution mechanism.
                        </p>
                      </div>

                      <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                        <p>
                          Ghost prize draws are funded entirely by the yield generated from the collective pool. 
                          No participant principal is ever wagered or lost. 
                        </p>
                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                          <h3 className="font-bold text-xs text-zinc-900">Event Execution Pipeline</h3>
                          <div className="font-mono text-[11px] text-zinc-700">
                            OPEN Cycle → SNAPSHOT (Root Hash) → FHE Randomness Generation → Blind Winner Selection → VERIFICATION (Proof Written Onchain) → SETTLEMENT (Prize Added to Winner Vault)
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'activity' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Activity Ledger
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Distinguishing public blockchain metadata from confidential financial records.
                        </p>
                      </div>

                      <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
                        <p>
                          The Activity page maintains an immutable ledger of all personal transactions submitted to Sepolia. 
                          Transaction amounts remain encrypted (<code>••••••</code>) until unmasked by your wallet signature.
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* AREA 03 — PRIVACY */}
            {/* ========================================================================= */}
            {activeAreaId === 'privacy' && (
              <div className="space-y-8">
                {activeSubPageId === 'privacy-model' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Ghost Privacy Model
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          The architectural definition of blockchain confidentiality.
                        </p>
                      </div>

                      <div className="p-6 rounded-3xl bg-zinc-900 text-white space-y-2 text-xs">
                        <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                          Core Axiom of Ghost Privacy
                        </div>
                        <p className="text-zinc-200 text-sm leading-relaxed">
                          "Ghost does not attempt to hide the blockchain. Ghost prevents sensitive financial state from being exposed as ordinary plaintext blockchain state."
                        </p>
                      </div>

                      <p className="text-xs text-zinc-600 leading-relaxed">
                        By isolating the computational privacy layer onto Zama's fhEVM, the protocol achieves complete mathematical confidentiality 
                        without sacrificing decentralized consensus, censorship resistance, or non-custodial guarantees.
                      </p>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'what-is-private' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          What Is Private vs. What Is Public
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Explicit data classification table across protocol states.
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-zinc-200 rounded-2xl overflow-hidden">
                          <thead>
                            <tr className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200 text-[11px]">
                              <th className="p-3">Data Point</th>
                              <th className="p-3">Public Blockchain</th>
                              <th className="p-3">Ghost Protection Level</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 text-zinc-700 font-mono">
                            <tr>
                              <td className="p-3 font-semibold text-zinc-900">Contract Addresses</td>
                              <td className="p-3 text-emerald-600">✓ Public</td>
                              <td className="p-3 text-zinc-500">Known protocol addresses on Sepolia</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold text-zinc-900">Transaction Existence</td>
                              <td className="p-3 text-emerald-600">✓ Public</td>
                              <td className="p-3 text-zinc-500">Tx hash published to EVM blocks</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold text-zinc-900">Block Number & Timestamp</td>
                              <td className="p-3 text-emerald-600">✓ Public</td>
                              <td className="p-3 text-zinc-500">Standard EVM block header metadata</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold text-zinc-900">Connected Wallet Address</td>
                              <td className="p-3 text-emerald-600">✓ Public</td>
                              <td className="p-3 text-zinc-500">Transaction sender (msg.sender)</td>
                            </tr>
                            <tr className="bg-emerald-50/50">
                              <td className="p-3 font-bold text-zinc-950">Financial Balance</td>
                              <td className="p-3 text-red-600">✗ Hidden</td>
                              <td className="p-3 text-emerald-700 font-bold">🔒 Encrypted euint64 Ciphertext Handle</td>
                            </tr>
                            <tr className="bg-emerald-50/50">
                              <td className="p-3 font-bold text-zinc-950">Deposit / Withdraw Amount</td>
                              <td className="p-3 text-red-600">✗ Hidden</td>
                              <td className="p-3 text-emerald-700 font-bold">🔒 Encrypted FHE einput Parameter</td>
                            </tr>
                            <tr className="bg-emerald-50/50">
                              <td className="p-3 font-bold text-zinc-950">Yield Allocation Quantity</td>
                              <td className="p-3 text-red-600">✗ Hidden</td>
                              <td className="p-3 text-emerald-700 font-bold">🔒 Homomorphically Evaluated</td>
                            </tr>
                            <tr className="bg-emerald-50/50">
                              <td className="p-3 font-bold text-zinc-950">Prize Draw Tickets / Odds</td>
                              <td className="p-3 text-red-600">✗ Hidden</td>
                              <td className="p-3 text-emerald-700 font-bold">🔒 Blind FHE Random Selection</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'proof-of-privacy' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Proof of Privacy on Sepolia Etherscan
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Verify onchain ciphertext handles directly on the public block explorer.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 text-xs text-zinc-700">
                        <h3 className="font-bold text-xs text-zinc-900">Live Deployed Contract Verification</h3>
                        <p>
                          Inspect our deployed contracts on Sepolia Etherscan. You will notice that balance mappings store only <code>bytes32 / euint64</code> ciphertext handles:
                        </p>
                        <div className="flex items-center gap-2">
                          <a
                            href="https://sepolia.etherscan.io/address/0xA83889ff7D4D78c53A05e050DaE596c9F3058b96"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-pill-primary text-xs font-semibold px-4 py-2 inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Inspect GhostVault on Etherscan</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'fhe' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          What is Fully Homomorphic Encryption (FHE)?
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Computing over encrypted data without decryption.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                          <h3 className="font-bold text-xs text-zinc-900 font-mono">Standard Computation</h3>
                          <div className="font-mono text-xs bg-white p-3 rounded-xl border border-zinc-200 text-zinc-800">
                            10 + 20 = 30<br />
                            <span className="text-red-600 text-[10px]">(All operands exposed in plaintext)</span>
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                          <h3 className="font-bold text-xs text-zinc-900 font-mono">Homomorphic FHE Computation</h3>
                          <div className="font-mono text-xs bg-white p-3 rounded-xl border border-zinc-200 text-zinc-800">
                            Encrypted(10) + Encrypted(20) = Encrypted(30)<br />
                            <span className="text-emerald-600 text-[10px]">(Computed with ZERO plaintext disclosure)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'access-control' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Access Control (Zama ACL)
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Cryptographic permission governance over ciphertext handles.
                        </p>
                      </div>

                      <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
                        <p>
                          Under Zama's fhEVM Access Control List (ACL), a smart contract specifies which addresses hold authorization 
                          to request re-encryption of a given ciphertext handle using <code>FHE.allow(handle, msg.sender)</code>.
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'user-decryption' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          User Decryption Flow
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          How authorized depositors access their private state without onchain leakage.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 font-mono text-xs text-zinc-700 leading-relaxed">
                        Ethereum Sepolia Blockchain (Encrypted State Handle)<br />
                        &nbsp;&nbsp;↓ User requests Decryption Clearance<br />
                        Wallet prompts cryptographic EIP-712 signature<br />
                        &nbsp;&nbsp;↓ KMS / Coprocessor verifies signature against ACL<br />
                        Ephemeral client-side re-encryption ticket issued<br />
                        &nbsp;&nbsp;↓<br />
                        User's browser decrypts and renders plaintext balance locally
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'limitations' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Privacy Limitations
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Confidential financial state is not network-level anonymity.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                        <div className="font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-700" />
                          <span>Crucial Distinction: Confidentiality vs. Anonymity</span>
                        </div>
                        <p className="text-amber-800 leading-relaxed">
                          Ghost encrypts financial balances, deposits, and prize allocations. It does not hide your public wallet address, 
                          gas payments, or IP network traffic. Users requiring network-level anonymity should utilize privacy-focused RPC relays.
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* AREA 04 — PROTOCOL */}
            {/* ========================================================================= */}
            {activeAreaId === 'protocol' && (
              <div className="space-y-8">
                {activeSubPageId === 'protocol-overview' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Protocol Architecture Stack
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Visual hierarchical architecture across client, smart contracts, FHE coprocessor, and verification layers.
                        </p>
                      </div>

                      {/* DESIGNED PROTOCOL ARCHITECTURE STACK */}
                      <div className="space-y-3">
                        {/* Layer 1: Client UI */}
                        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold">
                              <Wallet className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-zinc-400 font-semibold uppercase">Layer 01 · Client Tier</div>
                              <h3 className="font-bold text-xs text-zinc-900">User Interface & Cryptographic Wallet</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-700 font-medium">RainbowKit / Wagmi</span>
                            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">Client Encryption</span>
                          </div>
                        </div>

                        {/* Connector */}
                        <div className="flex justify-center text-zinc-300">
                          <ArrowDown className="w-4 h-4" />
                        </div>

                        {/* Layer 2: EVM Smart Contracts */}
                        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-zinc-400 font-semibold uppercase">Layer 02 · Smart Contract Layer</div>
                              <h3 className="font-bold text-xs text-zinc-900">GhostVault, GhostPool & GhostDraw</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-700 font-medium">Solidity 0.8.24</span>
                            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">Sepolia EVM</span>
                          </div>
                        </div>

                        {/* Connector */}
                        <div className="flex justify-center text-zinc-300">
                          <ArrowDown className="w-4 h-4" />
                        </div>

                        {/* Layer 3: Zama fhEVM Engine */}
                        <div className="p-5 rounded-2xl bg-zinc-950 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-zinc-800">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-emerald-400 font-bold">
                              <Cpu className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-zinc-400 font-semibold uppercase">Layer 03 · Cryptographic Coprocessor</div>
                              <h3 className="font-bold text-xs text-white">Zama fhEVM & Torus FHE Engine</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-zinc-800 px-2.5 py-1 rounded-md text-zinc-300 font-medium">euint64 Types</span>
                            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-md font-medium">Homomorphic Math</span>
                          </div>
                        </div>

                        {/* Connector */}
                        <div className="flex justify-center text-zinc-300">
                          <ArrowDown className="w-4 h-4" />
                        </div>

                        {/* Layer 4: Public Verification */}
                        <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-bold">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-[10px] font-mono text-zinc-400 font-semibold uppercase">Layer 04 · Verification Layer</div>
                              <h3 className="font-bold text-xs text-zinc-900">Merkle State Roots & ZK Commitments</h3>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-700 font-medium">GhostVerifier.sol</span>
                            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">Verifiable Outcomes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'confidential-state' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Confidential State Variables
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Encrypted state variable primitives in Ghost smart contracts.
                        </p>
                      </div>

                      <div className="space-y-3 text-xs text-zinc-600 font-mono">
                        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-1">
                          <div className="font-bold text-zinc-900">mapping(address =&gt; euint64) private _balances;</div>
                          <div className="text-[11px] text-zinc-500 font-sans">Stores the encrypted deposit principal for each participant wallet.</div>
                        </div>
                        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-1">
                          <div className="font-bold text-zinc-900">euint64 private _totalPooledPrincipal;</div>
                          <div className="text-[11px] text-zinc-500 font-sans">Homomorphic sum of all active deposits in the GhostVault.</div>
                        </div>
                        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-1">
                          <div className="font-bold text-zinc-900">euint64 private _currentPrizePool;</div>
                          <div className="text-[11px] text-zinc-500 font-sans">Encrypted yield pool accumulator earmarked for the next prize event.</div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* AREA 05 — ARCHITECTURE */}
            {/* ========================================================================= */}
            {activeAreaId === 'architecture' && (
              <div className="space-y-8">
                {activeSubPageId === 'system-architecture' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          System Architecture Topology
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Decoupled coprocessor design separating consensus from homomorphic polynomial evaluation.
                        </p>
                      </div>

                      {/* 4-NODE INTERACTIVE SYSTEM TOPOLOGY */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Node 1 */}
                        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200/80 space-y-3 hover:border-zinc-300 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">Node A</span>
                            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active Client
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-zinc-700" />
                            <span>Client Web Browser</span>
                          </h3>
                          <p className="text-xs text-zinc-600 leading-relaxed">
                            Handles wallet connection, client-side input encryption via Torus SDK, and cryptographic EIP-712 session signing.
                          </p>
                        </div>

                        {/* Node 2 */}
                        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200/80 space-y-3 hover:border-zinc-300 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">Node B</span>
                            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Sepolia EVM
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                            <Server className="w-4 h-4 text-zinc-700" />
                            <span>Ethereum Sepolia Node</span>
                          </h3>
                          <p className="text-xs text-zinc-600 leading-relaxed">
                            Enforces state transitions, transaction ordering, non-custodial balance ownership, and verified event commitments.
                          </p>
                        </div>

                        {/* Node 3 */}
                        <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 space-y-3 shadow-md">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-800 text-emerald-400">Node C</span>
                            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              FHE Coprocessor
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-emerald-400" />
                            <span>Torus FHE Coprocessor</span>
                          </h3>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            Executes homomorphic arithmetic, encrypted prize draw entropy, and ACL verification off-chain with mathematical proofs.
                          </p>
                        </div>

                        {/* Node 4 */}
                        <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200/80 space-y-3 hover:border-zinc-300 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">Node D</span>
                            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Threshold KMS
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-zinc-950 flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-zinc-700" />
                            <span>Decryption Gateway & KMS</span>
                          </h3>
                          <p className="text-xs text-zinc-600 leading-relaxed">
                            Issues ephemeral re-encryption tickets exclusively to authorized depositors possessing valid cryptographic wallet signatures.
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'smart-contracts' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Smart Contract Topology
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Modular contract responsibilities and Sepolia deployments.
                        </p>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-2">
                          <div className="font-bold text-zinc-950 flex items-center justify-between">
                            <span className="text-sm">GhostVault.sol</span>
                            <span className="font-mono text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">0xA83889...8b96</span>
                          </div>
                          <p className="text-zinc-600 leading-relaxed">Non-custodial vault holding encrypted principal deposits and enforcing zero-loss guarantees.</p>
                        </div>

                        <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-2">
                          <div className="font-bold text-zinc-950 flex items-center justify-between">
                            <span className="text-sm">GhostPool.sol</span>
                            <span className="font-mono text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">0x96e594...0b06</span>
                          </div>
                          <p className="text-zinc-600 leading-relaxed">Homomorphic yield pooling engine and savings rate compounding calculator.</p>
                        </div>

                        <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-2">
                          <div className="font-bold text-zinc-950 flex items-center justify-between">
                            <span className="text-sm">GhostDraw.sol</span>
                            <span className="font-mono text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">0xFFDA13...957F</span>
                          </div>
                          <p className="text-zinc-600 leading-relaxed">Verifiable FHE randomness evaluator and prize dispatcher.</p>
                        </div>

                        <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-2">
                          <div className="font-bold text-zinc-950 flex items-center justify-between">
                            <span className="text-sm">MockConfidentialToken.sol (cUSDC)</span>
                            <span className="font-mono text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">0x65C902...8B03</span>
                          </div>
                          <p className="text-zinc-600 leading-relaxed">Confidential ERC-20 test token supporting encrypted mints and balance transfers.</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'data-flows' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Visual Protocol Data Flows
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Interactive cryptographic state pipelines for core protocol actions.
                        </p>
                      </div>

                      {/* Interactive Flow Tabs */}
                      <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-100 rounded-2xl w-fit">
                        {[
                          { id: 'deposit', label: 'Deposit Pipeline' },
                          { id: 'withdraw', label: 'Withdrawal Pipeline' },
                          { id: 'draw', label: 'Draw Evaluation Pipeline' },
                          { id: 'decrypt', label: 'Decryption Clearance' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setActiveDataFlowTab(t.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              activeDataFlowTab === t.id
                                ? 'bg-white text-zinc-950 shadow-xs'
                                : 'text-zinc-600 hover:text-zinc-950'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Designed Pipeline Visual Box */}
                      <div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-4">
                        {activeDataFlowTab === 'deposit' && (
                          <div className="space-y-3">
                            <div className="font-bold text-xs text-zinc-900 uppercase tracking-wider font-mono">Confidential Deposit Lifecycle</div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">01. BROWSER</span>
                                <div className="font-bold text-zinc-950">Plaintext Input</div>
                                <div className="text-[11px] text-zinc-500">User enters 500 cUSDC in Vault UI</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">02. FHE CLIENT</span>
                                <div className="font-bold text-zinc-950">Encryption</div>
                                <div className="text-[11px] text-zinc-500">Converts to euint64 ciphertext handle</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">03. SEPOLIA EVM</span>
                                <div className="font-bold text-zinc-950">GhostVault Tx</div>
                                <div className="text-[11px] text-zinc-500">Updates balance mapping pointer</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">04. COPROCESSOR</span>
                                <div className="font-bold text-zinc-950">Yield Allocation</div>
                                <div className="text-[11px] text-zinc-500">Adds to homomorphic yield pool</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeDataFlowTab === 'withdraw' && (
                          <div className="space-y-3">
                            <div className="font-bold text-xs text-zinc-900 uppercase tracking-wider font-mono">Non-Custodial Withdrawal Pipeline</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">01. INITIATION</span>
                                <div className="font-bold text-zinc-950">Withdraw Request</div>
                                <div className="text-[11px] text-zinc-500">User selects amount to redeem</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">02. INVARIANT CHECK</span>
                                <div className="font-bold text-zinc-950">Encrypted Balance Proof</div>
                                <div className="text-[11px] text-zinc-500">Contract verifies handle ≥ withdraw amount</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">03. SETTLEMENT</span>
                                <div className="font-bold text-zinc-950">Token Transfer</div>
                                <div className="text-[11px] text-zinc-500">cUSDC tokens sent directly to user wallet</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeDataFlowTab === 'draw' && (
                          <div className="space-y-3">
                            <div className="font-bold text-xs text-zinc-900 uppercase tracking-wider font-mono">Verifiable Prize Draw Evaluation</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">01. TRIGGER</span>
                                <div className="font-bold text-zinc-950">Snapshot State Root</div>
                                <div className="text-[11px] text-zinc-500">Draw interval timer matures onchain</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">02. FHE RANDOMNESS</span>
                                <div className="font-bold text-zinc-950">Blind Selection</div>
                                <div className="text-[11px] text-zinc-500">Entropy compared against encrypted ticket weights</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">03. REWARD</span>
                                <div className="font-bold text-zinc-950">Prize Added to Winner</div>
                                <div className="text-[11px] text-zinc-500">Yield allocated without revealing non-winners</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeDataFlowTab === 'decrypt' && (
                          <div className="space-y-3">
                            <div className="font-bold text-xs text-zinc-900 uppercase tracking-wider font-mono">Dual-Key Decryption Clearance</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">01. WALLET SIGNATURE</span>
                                <div className="font-bold text-zinc-950">EIP-712 Request</div>
                                <div className="text-[11px] text-zinc-500">User confirms on-demand session signing</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-emerald-600 font-bold">02. KMS ACL CHECK</span>
                                <div className="font-bold text-zinc-950">Authorization</div>
                                <div className="text-[11px] text-zinc-500">KMS validates FHE.allow permission</div>
                              </div>
                              <div className="p-4 bg-white rounded-2xl border border-zinc-200 space-y-1">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold">03. LOCAL UNMASKING</span>
                                <div className="font-bold text-zinc-950">Browser Render</div>
                                <div className="text-[11px] text-zinc-500">Plaintext balance rendered locally</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* AREA 06 — DEVELOPERS */}
            {/* ========================================================================= */}
            {activeAreaId === 'developers' && (
              <div className="space-y-8">
                {activeSubPageId === 'dev-quickstart' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Developer Quickstart
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Clone, configure, compile, and run Ghost locally in under 3 minutes.
                        </p>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="space-y-1.5">
                          <div className="font-bold text-zinc-900">1. Clone & Install Dependencies</div>
                          <div className="p-4 bg-zinc-900 text-zinc-200 rounded-2xl font-mono text-[11px] relative">
                            <code>
                              git clone https://github.com/OpeyemiMoses/GHOST.git<br />
                              cd GHOST<br />
                              npm install<br />
                              cd apps/web && npm install && cd ../..
                            </code>
                            <button
                              onClick={() => copyToClipboard('git clone https://github.com/OpeyemiMoses/GHOST.git\ncd GHOST\nnpm install', 'c1')}
                              className="absolute right-3 top-3 p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              {copiedKey === 'c1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="font-bold text-zinc-900">2. Run Hardhat Tests</div>
                          <div className="p-4 bg-zinc-900 text-zinc-200 rounded-2xl font-mono text-[11px]">
                            <code>npx hardhat test</code>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="font-bold text-zinc-900">3. Launch Frontend Development Server</div>
                          <div className="p-4 bg-zinc-900 text-zinc-200 rounded-2xl font-mono text-[11px]">
                            <code>cd apps/web && npm run dev</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'dev-deployments' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Live Sepolia Contract Deployments
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Verified smart contracts on Ethereum Sepolia (Chain ID: 11155111).
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-zinc-200 rounded-2xl overflow-hidden font-mono">
                          <thead>
                            <tr className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200 text-[11px]">
                              <th className="p-3">Contract</th>
                              <th className="p-3">Address</th>
                              <th className="p-3 text-right">Explorer</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 text-zinc-700">
                            <tr>
                              <td className="p-3 font-semibold text-zinc-900">MockConfidentialToken (cUSDC)</td>
                              <td className="p-3">0x65C9020961f4fdF5E0a1fE01dC1225A096408B03</td>
                              <td className="p-3 text-right">
                                <a href="https://sepolia.etherscan.io/address/0x65C9020961f4fdF5E0a1fE01dC1225A096408B03" target="_blank" rel="noopener noreferrer" className="text-zinc-900 underline">View</a>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold text-zinc-900">GhostVault</td>
                              <td className="p-3">0xA83889ff7D4D78c53A05e050DaE596c9F3058b96</td>
                              <td className="p-3 text-right">
                                <a href="https://sepolia.etherscan.io/address/0xA83889ff7D4D78c53A05e050DaE596c9F3058b96" target="_blank" rel="noopener noreferrer" className="text-zinc-900 underline">View</a>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold text-zinc-900">GhostPool</td>
                              <td className="p-3">0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06</td>
                              <td className="p-3 text-right">
                                <a href="https://sepolia.etherscan.io/address/0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06" target="_blank" rel="noopener noreferrer" className="text-zinc-900 underline">View</a>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3 font-semibold text-zinc-900">GhostDraw</td>
                              <td className="p-3">0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F</td>
                              <td className="p-3 text-right">
                                <a href="https://sepolia.etherscan.io/address/0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F" target="_blank" rel="noopener noreferrer" className="text-zinc-900 underline">View</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* AREA 07 — SECURITY */}
            {/* ========================================================================= */}
            {activeAreaId === 'security' && (
              <div className="space-y-8">
                {activeSubPageId === 'threat-matrix' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Threat Matrix & Mitigations
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Systematic risk analysis and architectural defenses.
                        </p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-zinc-200 rounded-2xl overflow-hidden font-mono">
                          <thead>
                            <tr className="bg-zinc-100 text-zinc-900 font-semibold border-b border-zinc-200 text-[11px]">
                              <th className="p-3">Threat Vector</th>
                              <th className="p-3">Architectural Mitigation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 text-zinc-700">
                            <tr>
                              <td className="p-3 font-bold text-red-600">Unauthorized Ciphertext Access</td>
                              <td className="p-3 text-zinc-800 font-sans">Zama Access Control List (ACL) enforces FHE.allow constraints.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-red-600">Unauthorized State Mutation</td>
                              <td className="p-3 text-zinc-800 font-sans">Contract access modifiers and non-custodial balance ownership.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-red-600">Transaction Replay Attacks</td>
                              <td className="p-3 text-zinc-800 font-sans">EVM transaction nonces and timestamped signature clearance messages.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-red-600">Invalid Encrypted Inputs</td>
                              <td className="p-3 text-zinc-800 font-sans">Zama einput encryption proofs validated at smart contract boundary.</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-red-600">Centralized Backend Compromise</td>
                              <td className="p-3 text-zinc-800 font-sans">Zero plaintext database architecture; backend stores zero financial keys.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'bug-bounty' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Bug Bounty & Responsible Disclosure
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Guidelines for security researchers and vulnerability reporting.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
                        <p>
                          We welcome responsible disclosure from security researchers. 
                          If you discover a vulnerability related to ciphertext leakage, contract reentrancy, or ACL flaws, please report privately to our security team.
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* AREA 08 — RESOURCES */}
            {/* ========================================================================= */}
            {activeAreaId === 'resources' && (
              <div className="space-y-8">
                {activeSubPageId === 'glossary' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Protocol Glossary
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Essential cryptographic and decentralized finance terminology.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-mono">
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                          <div className="font-bold text-zinc-900">FHE (Fully Homomorphic Encryption)</div>
                          <div className="text-[11px] text-zinc-500 mt-1 font-sans">A form of encryption that allows computation directly over ciphertexts.</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                          <div className="font-bold text-zinc-900">fhEVM</div>
                          <div className="text-[11px] text-zinc-500 mt-1 font-sans">Zama's EVM integration enabling confidential smart contracts using TFHE.</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                          <div className="font-bold text-zinc-900">euint64</div>
                          <div className="text-[11px] text-zinc-500 mt-1 font-sans">An encrypted 64-bit unsigned integer type managed onchain.</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                          <div className="font-bold text-zinc-900">Ciphertext Handle</div>
                          <div className="text-[11px] text-zinc-500 mt-1 font-sans">A 32-byte cryptographic pointer referencing an off-chain FHE ciphertext.</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                          <div className="font-bold text-zinc-900">Zero-Loss Savings</div>
                          <div className="text-[11px] text-zinc-500 mt-1 font-sans">A mechanism where principal deposits are preserved while collective yield funds prize draws.</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                          <div className="font-bold text-zinc-900">ACL (Access Control List)</div>
                          <div className="text-[11px] text-zinc-500 mt-1 font-sans">Zama's authorization system regulating which wallets can decrypt ciphertexts.</div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {activeSubPageId === 'changelog' && (
                  <ScrollReveal delay={100}>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                          Protocol Changelog
                        </h2>
                        <p className="text-xs text-zinc-500 mt-1">
                          Release history on Ethereum Sepolia.
                        </p>
                      </div>

                      <div className="space-y-3 font-mono text-xs text-zinc-600">
                        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                          <div className="font-bold text-zinc-900">v1.0.0-sepolia (September 2026)</div>
                          <ul className="list-disc pl-5 text-[11px] text-zinc-600 font-sans space-y-1">
                            <li>Deployment of MockConfidentialToken, GhostVault, GhostPool, and GhostDraw contracts.</li>
                            <li>Dual-key cryptographic session clearance for unmasking and re-sealing state.</li>
                            <li>Address-isolated ledger architecture and 8-area technical documentation system.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* Pagination Navigation Footer with ScrollReveal */}
            <ScrollReveal delay={150}>
              <div className="flex items-center justify-between pt-8 border-t border-zinc-200/80">
                {prevPage ? (
                  <button
                    onClick={() => navigateTo(prevPage.areaId, prevPage.subpage.id)}
                    className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous: {prevPage.subpage.title}</span>
                  </button>
                ) : <div />}

                {nextPage ? (
                  <button
                    onClick={() => navigateTo(nextPage.areaId, nextPage.subpage.id)}
                    className="btn-pill-primary text-xs font-semibold px-4 py-2 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Next: {nextPage.subpage.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : <div />}
              </div>
            </ScrollReveal>

          </div>
        </div>

      </div>
    </div>
  );
};
