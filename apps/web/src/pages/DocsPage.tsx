import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, Shield, Lock, Unlock, Cpu, Code2, KeyRound, Sparkles, 
  ExternalLink, Search, Copy, Check, ChevronRight, Layers, Database, 
  ArrowRight, ArrowLeft, AlertTriangle, FileText, Terminal, HelpCircle, 
  CheckCircle2, RefreshCw, Eye, EyeOff, Hash, Clock, Coins, Wallet,
  Zap, Server, GitBranch, ArrowDown, Network, ShieldCheck,
  ChevronDown, ChevronUp, X, Menu
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  
  const viewportRef = useRef<HTMLDivElement>(null);
  const isClickScrolling = useRef<boolean>(false);

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
        { id: 'dev-quickstart', title: 'Quickstart & Setup', description: 'Clone, configure, compile, and run with GitHub README' },
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

  // Current Area and Subpages
  const currentAreaIndex = docAreas.findIndex((a) => a.id === activeAreaId);
  const currentArea = docAreas[currentAreaIndex] || docAreas[0];
  
  // Previous and Next MAIN Sections
  const prevArea = currentAreaIndex > 0 ? docAreas[currentAreaIndex - 1] : null;
  const nextArea = currentAreaIndex < docAreas.length - 1 ? docAreas[currentAreaIndex + 1] : null;

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

  // Set default subpage when area changes
  useEffect(() => {
    if (currentArea.subpages.length > 0) {
      setActiveSubPageId(currentArea.subpages[0].id);
    }
  }, [activeAreaId]);

  // SCROLL-SPY: Track active subpage as user scrolls down the page
  useEffect(() => {
    const container = viewportRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const subpageElements = currentArea.subpages
        .map((sub) => document.getElementById(sub.id))
        .filter(Boolean) as HTMLElement[];

      const containerTop = container.getBoundingClientRect().top;

      let currentId = currentArea.subpages[0].id;
      for (const el of subpageElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= 180) {
          currentId = el.id;
        }
      }

      setActiveSubPageId(currentId);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [activeAreaId, currentArea]);

  const scrollToSubPage = (subPageId: string) => {
    setActiveSubPageId(subPageId);
    isClickScrolling.current = true;
    const element = document.getElementById(subPageId);
    if (element && viewportRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 700);
    }
  };

  const switchMainArea = (areaId: string, subPageId?: string) => {
    setActiveAreaId(areaId);
    if (subPageId) {
      setActiveSubPageId(subPageId);
    }
    // Instantly reset scroll to top on all viewport references and windows
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
      viewportRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const mainParent = document.querySelector('main');
    if (mainParent) {
      mainParent.scrollTop = 0;
      mainParent.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const currentSubPage = currentArea.subpages.find((s) => s.id === activeSubPageId) || currentArea.subpages[0];

  return (
    <div className="w-full h-full min-h-[calc(100vh-16px)] sm:min-h-[calc(100vh-24px)] flex flex-col bg-white text-zinc-900 overflow-hidden">
      
      {/* Top Fixed Header & Search Bar (Sticky so it stays pinned) */}
      <div className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-8 py-3 sm:py-4 border-b border-zinc-200/80 bg-white shrink-0 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-semibold text-zinc-500 uppercase tracking-wider mb-0.5">
            <BookOpen className="w-3.5 h-3.5 text-zinc-900" />
            <span>Ghost Protocol · Technical Docs</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-zinc-950">
            Protocol Specifications & Reference
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 38+ topics..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 shadow-xs"
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
            className="btn-pill-secondary text-xs font-semibold px-3 sm:px-4 py-2 flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-700" />
            <span className="hidden sm:inline">Help Centre</span>
            <span className="sm:hidden">Help</span>
          </button>
        </div>
      </div>

      {/* Mobile Area Picker Bar (Visible on screens < lg) */}
      <div className="lg:hidden px-4 py-2.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs shrink-0 z-10">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 font-semibold text-zinc-900 bg-white border border-zinc-200/90 px-3 py-1.5 rounded-xl shadow-xs cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-600" />
          <span>{currentArea.number} {currentArea.title}</span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[140px]">
          {currentSubPage.title}
        </span>
      </div>

      {/* Mobile Area Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full p-5 flex flex-col justify-between overflow-y-auto border-r border-zinc-200 z-10 animate-page-enter">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <div className="font-bold text-sm text-zinc-950">Documentation Areas</div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-100 text-zinc-500 hover:text-zinc-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {docAreas.map((area) => {
                  const isCurrent = area.id === activeAreaId;
                  const Icon = area.icon;

                  return (
                    <div key={area.id} className="space-y-1">
                      <button
                        onClick={() => {
                          switchMainArea(area.id);
                          setMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isCurrent ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{area.number} {area.title}</span>
                        </div>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>

                      {isCurrent && (
                        <div className="pl-4 space-y-1 pt-1 border-l-2 border-zinc-200 ml-3">
                          {area.subpages.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                scrollToSubPage(sub.id);
                                setMobileDrawerOpen(false);
                              }}
                              className={`block w-full text-left text-[11px] py-1 px-2 rounded-lg transition-colors ${
                                activeSubPageId === sub.id
                                  ? 'text-zinc-950 font-bold bg-zinc-100'
                                  : 'text-zinc-500 hover:text-zinc-900'
                              }`}
                            >
                              {sub.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dual-Panel Layout: Fixed Sub-Navbar on Left & Scrollable Viewport on Right */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* LEFT PANEL: Completely Fixed/Static Sub-Navigation Bar */}
        <aside className="hidden lg:block w-72 sm:w-80 shrink-0 h-full overflow-y-auto border-r border-zinc-200/80 p-4 sm:p-5 bg-[#fafafa] select-none space-y-4">
          
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
                      switchMainArea(res.areaId, res.subpage.id);
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
          <div className="p-3 bg-white border border-zinc-200/80 rounded-2xl shadow-xs space-y-1">
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
                    onClick={() => switchMainArea(area.id)}
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
                            onClick={() => scrollToSubPage(sub.id)}
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
        </aside>

        {/* RIGHT PANEL: One Full Scrollable Page per Section */}
        <main 
          ref={viewportRef}
          id="docs-content-viewport" 
          className="flex-1 min-w-0 h-full overflow-y-auto p-6 sm:p-10 bg-white space-y-8 selection:bg-zinc-200 scroll-smooth"
        >
          
          {/* Top Dynamic Breadcrumbs */}
          <div className="py-2 border-b border-zinc-100 flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>GHOST DOCS</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-600 font-semibold">{currentArea.number} {currentArea.title}</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-950 font-bold transition-all">{currentSubPage.title}</span>
          </div>

          {/* Keyed Section Content for Animated Rise-In */}
          <div key={activeAreaId} className="animate-page-enter space-y-16">

            {/* ========================================================================= */}
            {/* SECTION 01 — OVERVIEW (ALL SUBPAGES) */}
            {/* ========================================================================= */}
            {activeAreaId === 'overview' && (
              <div className="space-y-16">
                
                {/* 01.1 Intro */}
                <ScrollReveal>
  <section id="intro" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">01.1 · Introduction</div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
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
                </section>
</ScrollReveal>

                {/* 01.2 Getting Started */}
                <ScrollReveal>
  <section id="getting-started" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">01.2 · Getting Started</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Getting Started on Ethereum Sepolia
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      The complete step-by-step guide to connecting, minting, and depositing.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                      <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">1</span>
                        <span>Zero-Knowledge Email Profile Creation</span>
                      </h3>
                      <p>
                        Open the <strong>Connect Gateway</strong> and enter your email address to create an account with a password. Ghost creates a client-side SHA-256 salted hash in your browser’s private enclave. <strong>Your email is never broadcasted to the public Ethereum Sepolia blockchain.</strong>
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                      <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">2</span>
                        <span>1:1 Web3 Wallet Binding & Network Selection</span>
                      </h3>
                      <p>
                        Connect your Web3 wallet (MetaMask, Rainbow, Coinbase Wallet) on <strong>Ethereum Sepolia (Chain ID: 11155111)</strong> and click <strong>"Lock & Bind Wallet to Account"</strong>. This establishes a strict 1:1 bond between your email account and that wallet address.
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-zinc-200 font-mono text-[11px] text-zinc-700">
                        Network: Ethereum Sepolia<br />
                        Chain ID: 11155111<br />
                        Security: Dual-Key Client Enclave + EIP-712 Signature
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                      <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">3</span>
                        <span>Cryptographic Session Authorization</span>
                      </h3>
                      <p>
                        Click <strong>"Authorize Session & Enter Vault"</strong> to sign an on-demand cryptographic verification message. If your connected wallet does not match your bound address, Ghost blocks the request with a <em>Wallet Mismatch</em> alert to keep your encrypted assets safe.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                      <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">4</span>
                        <span>Minting Testnet cUSDC & Depositing</span>
                      </h3>
                      <p>
                        Navigate to the <strong>Vault</strong> page, switch to the <strong>Faucet</strong> tab, and mint 1,000 testnet <code>cUSDC</code>. Enter your deposit amount and confirm. Your deposit is sealed into <code>euint64</code> ciphertext handles onchain.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                      <h3 className="font-bold text-xs text-zinc-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center font-mono text-[10px]">5</span>
                        <span>Decrypting & Re-Sealing Your Position</span>
                      </h3>
                      <p>
                        Your balance displays as sealed ciphertext (<code>••••••••</code>). Click <strong>Decrypt Balance with Wallet Signature</strong> to unmask your balance in your browser. Click <strong>Sign to Lock & Encrypt</strong> at any time to re-seal your state.
                      </p>
                    </div>
                  </div>
                </section>
</ScrollReveal>

                {/* 01.3 Why Ghost Exists */}
                <ScrollReveal>
  <section id="why-ghost" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">01.3 · Why Ghost Exists</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Why Ghost Exists
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Addressing the fundamental blockchain privacy problem with designed flow architecture.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-zinc-50 border border-red-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                          Traditional Transparent Model
                        </span>
                        <Eye className="w-4 h-4 text-red-500" />
                      </div>

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

                    <div className="p-6 rounded-3xl bg-zinc-50 border border-emerald-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          Ghost Confidential Architecture
                        </span>
                        <Lock className="w-4 h-4 text-emerald-600" />
                      </div>

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
                </section>
</ScrollReveal>

                {/* 01.4 How Ghost Works */}
                <ScrollReveal>
  <section id="how-ghost-works" className="space-y-6 pt-4 pb-8">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">01.4 · How Ghost Works</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      How Ghost Works — 7-Step Interactive Journey
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      The complete confidential execution lifecycle from deposit to verifiable outcome.
                    </p>
                  </div>

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
                </section>
</ScrollReveal>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 02 — PRODUCT (ALL SUBPAGES) */}
            {/* ========================================================================= */}
            {activeAreaId === 'product' && (
              <div className="space-y-16">
                
                {/* 02.1 Overview */}
                <ScrollReveal>
  <section id="product-overview" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">02.1 · Overview</div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
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
                </section>
</ScrollReveal>

                {/* 02.2 The Vault */}
                <ScrollReveal>
  <section id="vault" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">02.2 · The Vault</div>
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
                </section>
</ScrollReveal>

                {/* 02.3 Deposits */}
                <ScrollReveal>
  <section id="deposits" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">02.3 · Deposits</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Deposits Lifecycle
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Step-by-step cryptographic lifecycle of a vault deposit.
                    </p>
                  </div>

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
                </section>
</ScrollReveal>

                {/* 02.4 Withdrawals */}
                <ScrollReveal>
  <section id="withdrawals" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">02.4 · Withdrawals</div>
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
                </section>
</ScrollReveal>

                {/* 02.5 Yield */}
                <ScrollReveal>
  <section id="yield" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">02.5 · Yield</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Yield Mechanics
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      How continuous homomorphic savings yield is generated and accounted.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                    <p>
                      In Ghost, yield originates from the collective capital pool deployed in <code>GhostPool</code>. 
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
                </section>
</ScrollReveal>

                {/* 02.6 Events */}
                <ScrollReveal>
  <section id="events" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">02.6 · Events</div>
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
                </section>
</ScrollReveal>

                {/* 02.7 Activity */}
                <ScrollReveal>
  <section id="activity" className="space-y-6 pt-4 pb-8">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">02.7 · Activity</div>
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
                </section>
</ScrollReveal>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 03 — PRIVACY (ALL SUBPAGES) */}
            {/* ========================================================================= */}
            {activeAreaId === 'privacy' && (
              <div className="space-y-16">
                
                {/* 03.1 Privacy Model */}
                <ScrollReveal>
  <section id="privacy-model" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.1 · Model</div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
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
                </section>
</ScrollReveal>

                {/* 03.2 What Is Private */}
                <ScrollReveal>
  <section id="what-is-private" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.2 · Classification</div>
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
                </section>
</ScrollReveal>

                {/* 03.3 What Is Public */}
                <ScrollReveal>
  <section id="what-is-public" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.3 · Public Metadata</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      What Remains Public on Ethereum Sepolia
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Transparent onchain data visible to all node operators and indexers.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
                    <p>
                      Ghost intentionally preserves decentralized auditability. The public EVM state records:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 font-mono text-[11px] text-zinc-700">
                      <li>Transaction Hash, Nonce, and Block Number</li>
                      <li>Gas Consumed and Priority Fee</li>
                      <li>Sender Wallet Address (msg.sender)</li>
                      <li>GhostVault Contract Execution Selectors</li>
                    </ul>
                  </div>
                </section>
</ScrollReveal>

                {/* 03.4 Proof of Privacy */}
                <ScrollReveal>
  <section id="proof-of-privacy" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.4 · Proof</div>
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
                </section>
</ScrollReveal>

                {/* 03.5 What is FHE */}
                <ScrollReveal>
  <section id="fhe" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.5 · FHE</div>
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
                </section>
</ScrollReveal>

                {/* 03.6 Encryption Lifecycle */}
                <ScrollReveal>
  <section id="encryption-lifecycle" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.6 · Lifecycle</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      The Encryption Lifecycle
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      From client-side integer to cryptographic ciphertext handle on EVM.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 leading-relaxed font-mono">
                    Plaintext Number (User Input)<br />
                    &nbsp;&nbsp;↓ Client-side SDK encryption via Torus Web3 Provider<br />
                    euint64 Ciphertext Handle generated with ZK proof<br />
                    &nbsp;&nbsp;↓ Submitted onchain to GhostVault<br />
                    Smart Contract updates mappings homomorphically<br />
                    &nbsp;&nbsp;↓<br />
                    Decryption requires EIP-712 wallet signature verification
                  </div>
                </section>
</ScrollReveal>

                {/* 03.7 Access Control */}
                <ScrollReveal>
  <section id="access-control" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.7 · Access Control</div>
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
                </section>
</ScrollReveal>

                {/* 03.8 User Decryption */}
                <ScrollReveal>
  <section id="user-decryption" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.8 · Decryption</div>
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
                </section>
</ScrollReveal>

                {/* 03.9 Limitations */}
                <ScrollReveal>
  <section id="limitations" className="space-y-6 pt-4 pb-8">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">03.9 · Limitations</div>
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
                </section>
</ScrollReveal>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 04 — PROTOCOL (ALL SUBPAGES) */}
            {/* ========================================================================= */}
            {activeAreaId === 'protocol' && (
              <div className="space-y-16">
                
                {/* 04.1 Overview Stack */}
                <ScrollReveal>
  <section id="protocol-overview" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">04.1 · Stack</div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                      Protocol Architecture Stack
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Visual hierarchical architecture across client, smart contracts, FHE coprocessor, and verification layers.
                    </p>
                  </div>

                  <div className="space-y-3">
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

                    <div className="flex justify-center text-zinc-300">
                      <ArrowDown className="w-4 h-4" />
                    </div>

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

                    <div className="flex justify-center text-zinc-300">
                      <ArrowDown className="w-4 h-4" />
                    </div>

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

                    <div className="flex justify-center text-zinc-300">
                      <ArrowDown className="w-4 h-4" />
                    </div>

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
                        <span className="text-[10px] font-mono bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-700 font-medium">GhostVerifier</span>
                        <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">Verifiable Outcomes</span>
                      </div>
                    </div>
                  </div>
                </section>
</ScrollReveal>

                {/* 04.2 Confidential State */}
                <ScrollReveal>
  <section id="confidential-state" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">04.2 · State</div>
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
                </section>
</ScrollReveal>

                {/* 04.3 Confidential Accounting */}
                <ScrollReveal>
  <section id="confidential-accounting" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">04.3 · Accounting</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Confidential Accounting & Invariant Safety
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Homomorphic fixed-point arithmetic without plaintext precision leakage.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
                    <p>
                      Ghost contracts execute additions, sub-fractions, and proportional prize shares directly on <code>euint64</code> variables. 
                      Because conditional branching in Solidity cannot directly read ciphertexts without decryption, Ghost uses homomorphic multiplexing: <code>FHE.select(condition, ifTrue, ifFalse)</code>.
                    </p>
                  </div>
                </section>
</ScrollReveal>

                {/* 04.4 Event Lifecycle */}
                <ScrollReveal>
  <section id="event-lifecycle" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">04.4 · Lifecycle</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Event Lifecycle State Transitions
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      State transitions from open deposit cycle to finalized settlement.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 font-mono text-xs text-zinc-700 leading-relaxed">
                    OPEN (Deposits active & accumulating yield)<br />
                    &nbsp;&nbsp;↓ Snapshot trigger reached<br />
                    STATE COMMITMENT (Merkle root hash committed)<br />
                    &nbsp;&nbsp;↓ Coprocessor request dispatched<br />
                    FHE COMPUTATION (Blind winner selection)<br />
                    &nbsp;&nbsp;↓ Randomness receipt confirmed<br />
                    RESULT GENERATED & VERIFIED (State proof published)<br />
                    &nbsp;&nbsp;↓<br />
                    SETTLEMENT & FINALIZED (Prize added to winner ciphertext)
                  </div>
                </section>
</ScrollReveal>

                {/* 04.5 Verification */}
                <ScrollReveal>
  <section id="protocol-verification" className="space-y-6 pt-4 pb-8">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">04.5 · Verification</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Public Protocol Verification
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Third-party outcome auditability without balance disclosure.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs text-zinc-600">
                    <p>
                      Any third party or participant can verify that:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>The randomness source was provably unbiasable.</li>
                      <li>The winner selection matched the committed state root.</li>
                      <li>Zero unauthorized minting or balance extraction occurred.</li>
                    </ul>
                  </div>
                </section>
</ScrollReveal>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 05 — ARCHITECTURE (ALL SUBPAGES) */}
            {/* ========================================================================= */}
            {activeAreaId === 'architecture' && (
              <div className="space-y-16">
                
                {/* 05.1 System Architecture */}
                <ScrollReveal>
  <section id="system-architecture" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">05.1 · Topology</div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                      System Architecture Topology
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Decoupled coprocessor design separating consensus from homomorphic polynomial evaluation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </section>
</ScrollReveal>

                {/* 05.2 Smart Contracts */}
                <ScrollReveal>
  <section id="smart-contracts" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">05.2 · Contracts</div>
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
                        <span className="text-sm">GhostVault</span>
                        <span className="font-mono text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">0xA83889...8b96</span>
                      </div>
                      <p className="text-zinc-600 leading-relaxed">Non-custodial vault holding encrypted principal deposits and enforcing zero-loss guarantees.</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="font-bold text-zinc-950 flex items-center justify-between">
                        <span className="text-sm">GhostPool</span>
                        <span className="font-mono text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">0x96e594...0b06</span>
                      </div>
                      <p className="text-zinc-600 leading-relaxed">Homomorphic yield pooling engine and savings rate compounding calculator.</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="font-bold text-zinc-950 flex items-center justify-between">
                        <span className="text-sm">GhostDraw</span>
                        <span className="font-mono text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">0xFFDA13...957F</span>
                      </div>
                      <p className="text-zinc-600 leading-relaxed">Verifiable FHE randomness evaluator and prize dispatcher.</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="font-bold text-zinc-950 flex items-center justify-between">
                        <span className="text-sm">MockConfidentialToken (cUSDC)</span>
                        <span className="font-mono text-[10px] text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">0x65C902...8B03</span>
                      </div>
                      <p className="text-zinc-600 leading-relaxed">Confidential ERC-20 test token supporting encrypted mints and balance transfers.</p>
                    </div>
                  </div>
                </section>
</ScrollReveal>

                {/* 05.3 FHE Architecture */}
                <ScrollReveal>
  <section id="fhe-architecture" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">05.3 · FHE Architecture</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      FHE Types & Coprocessor Offloading
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Under-the-hood mechanics of Zama's TFHE rust library.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Ghost uses 64-bit encrypted integers (<code>euint64</code>) backed by Torus FHE lattice cryptography. Complex ciphertext multiplications and noise-reduction bootstrapping routines are delegated to the asynchronous coprocessor network to keep EVM gas low.
                  </p>
                </section>
</ScrollReveal>

                {/* 05.4 Frontend Architecture */}
                <ScrollReveal>
  <section id="frontend-architecture" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">05.4 · Frontend</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Frontend State & Cryptographic Signatures
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Integrating Wagmi, Viem, and dual-key browser unmasking.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    The web application utilizes RainbowKit and Wagmi v2 for multi-wallet connectivity. Decryption and re-sealing state is governed by on-demand cryptographic signatures (`signMessageAsync`), creating an address-isolated local storage vault scoped per user.
                  </p>
                </section>
</ScrollReveal>

                {/* 05.5 Backend Architecture */}
                <ScrollReveal>
  <section id="backend-architecture" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">05.5 · Backend</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Backend Indexers & Zero Plaintext DB
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      What indexers store vs. what is deliberately NOT stored.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-zinc-900 text-white space-y-2 text-xs">
                    <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                      Zero Plaintext Database Principle
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      Ghost's backend and indexer infrastructure deliberately does NOT store a centralized database of user balances or plaintext amounts. 
                      Indexers process only public block timestamps, transaction hashes, and ciphertext handle pointers.
                    </p>
                  </div>
                </section>
</ScrollReveal>

                {/* 05.6 Data Flows */}
                <ScrollReveal>
  <section id="data-flows" className="space-y-6 pt-4 pb-8">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">05.6 · Pipelines</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Visual Protocol Data Flows
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Interactive cryptographic state pipelines for core protocol actions.
                    </p>
                  </div>

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
                </section>
</ScrollReveal>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 06 — DEVELOPERS (ALL SUBPAGES) */}
            {/* ========================================================================= */}
            {activeAreaId === 'developers' && (
              <div className="space-y-16">
                
                {/* 06.1 Quickstart & Setup (Linked to README) */}
                <ScrollReveal>
                  <section id="dev-quickstart" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                    <div>
                      <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">06.1 · Quickstart & Setup</div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                        Developer Quickstart & Repository Setup
                      </h2>
                      <p className="text-xs text-zinc-500 mt-1">
                        Complete environment configuration, local deployment scripts, and test suite instructions.
                      </p>
                    </div>

                    <div className="p-6 sm:p-8 rounded-3xl bg-black text-white border border-zinc-800 space-y-5 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                          <Code2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Full Developer Guide & Environment Specs</h3>
                          <p className="text-xs text-zinc-400">Maintained in the official Ghost Protocol GitHub repository.</p>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                        Step-by-step instructions for cloning the monorepo, installing Hardhat & React dependencies, configuring environment RPCs (<code>.env.example</code>), running confidential FHE unit tests, and launching local dev servers are documented in the root README.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a
                          href="https://github.com/OpeyemiMoses/GHOST#local-development--setup"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill-white text-xs font-semibold px-5 py-2.5 flex items-center gap-2 shadow-md hover:scale-102 transition-transform cursor-pointer"
                        >
                          <span>Open Local Setup Guide in README</span>
                          <ExternalLink className="w-3.5 h-3.5 text-black" />
                        </a>

                        <a
                          href="https://github.com/OpeyemiMoses/GHOST"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <span>GitHub Repository</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                        </a>
                      </div>
                    </div>
                  </section>
                </ScrollReveal>

                {/* 06.3 Contracts */}
                <ScrollReveal>
  <section id="dev-contracts" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">06.3 · Contracts</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Contract Compilation & Testing
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Compiling confidential Solidity using `@zama-fhe/fhevm`.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Ghost contracts require the fhEVM Solidity library. Run <code>npx hardhat compile</code> to compile all contracts with the Zama FHE compiler plugin.
                  </p>
                </section>
</ScrollReveal>

                {/* 06.4 Frontend */}
                <ScrollReveal>
  <section id="dev-frontend" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">06.4 · Frontend Integration</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Frontend SDK Integration
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Connecting React to Ghost's onchain contracts with Viem and Wagmi.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Use Ghost's React context hook <code>useGhost()</code> to access deposit, withdrawal, and balance decryption methods anywhere in your component tree.
                  </p>
                </section>
</ScrollReveal>

                {/* 06.5 FHE Guide */}
                <ScrollReveal>
  <section id="dev-fhe-guide" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">06.5 · FHE Guide</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      FHE Development Best Practices
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Writing gas-efficient and secure confidential smart contracts.
                    </p>
                  </div>

                  <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1.5">
                    <li>Always grant <code>FHE.allow</code> explicitly to msg.sender for newly generated ciphertexts.</li>
                    <li>Avoid unnecessary homomorphic divisions; multiply by constants where possible.</li>
                    <li>Use <code>euint64</code> for currency integers and <code>ebool</code> for confidential predicates.</li>
                  </ul>
                </section>
</ScrollReveal>

                {/* 06.6 Integration */}
                <ScrollReveal>
  <section id="dev-integration" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">06.6 · Integration</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Third-Party Protocol Integration
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Integrating Ghost prize vaults into external yield aggregators.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    DeFi protocols can route user funds into <code>GhostVault</code> to offer zero-loss prize savings as an underlying yield strategy while preserving depositor privacy.
                  </p>
                </section>
</ScrollReveal>

                {/* 06.7 API & SDK */}
                <ScrollReveal>
  <section id="dev-api" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">06.7 · API & SDK</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      API & SDK Reference
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      TypeScript definitions and context exports.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900 text-zinc-200 rounded-2xl font-mono text-[11px]">
                    depositEncrypted(amount: bigint): Promise&lt;string&gt;<br />
                    withdrawEncrypted(amount: bigint): Promise&lt;string&gt;<br />
                    decryptSession(): Promise&lt;void&gt;<br />
                    lockSession(): Promise&lt;void&gt;
                  </div>
                </section>
</ScrollReveal>

                {/* 06.8 Contract Reference */}
                <ScrollReveal>
  <section id="dev-contract-reference" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">06.8 · Reference</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Smart Contract Function Reference
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      ABI signatures for all public protocol entry points.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900">function deposit(bytes calldata encryptedAmount) external</div>
                    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900">function withdraw(uint256 amount) external</div>
                    <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900">function executeDraw() external</div>
                  </div>
                </section>
</ScrollReveal>

                {/* 06.9 Deployments */}
                <ScrollReveal>
  <section id="dev-deployments" className="space-y-6 pt-4 pb-8">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">06.9 · Deployments</div>
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
                </section>
</ScrollReveal>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 07 — SECURITY (ALL SUBPAGES) */}
            {/* ========================================================================= */}
            {activeAreaId === 'security' && (
              <div className="space-y-16">
                
                {/* 07.1 Security Model */}
                <ScrollReveal>
  <section id="security-model" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">07.1 · Model</div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                      Security Model & Trust Assumptions
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Cryptographic guarantees and decentralized trust topology.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Ghost combines Ethereum's consensus security with Zama's lattice-based cryptography. Depositor funds are strictly non-custodial; protocol administrators cannot freeze, re-route, or arbitrarily decrypt user assets.
                  </p>
                </section>
</ScrollReveal>

                {/* 07.2 Threat Matrix */}
                <ScrollReveal>
  <section id="threat-matrix" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">07.2 · Matrix</div>
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
                </section>
</ScrollReveal>

                {/* 07.3 FHE Security */}
                <ScrollReveal>
  <section id="fhe-security" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">07.3 · FHE Cryptography</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      FHE Cryptographic Security Parameters
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      128-bit quantum-resistant lattice parameters and TFHE noise bounds.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Ghost uses Learning With Errors (LWE) and Torus FHE parameters calibrated for 128 bits of post-quantum cryptographic security under standard lattice reduction attacks.
                  </p>
                </section>
</ScrollReveal>

                {/* 07.4 Contract Security */}
                <ScrollReveal>
  <section id="smart-contract-security" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">07.4 · Contract Security</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Smart Contract Invariant Protections
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Reentrancy protection, integer bounds, and emergency pausing.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    All pool and vault contracts implement OpenZeppelin ReentrancyGuard, strict Checks-Effects-Interactions patterns, and access control boundaries.
                  </p>
                </section>
</ScrollReveal>

                {/* 07.5 Audits */}
                <ScrollReveal>
  <section id="audits" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">07.5 · Audits</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Audit Status & Verification Roadmap
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Formal verification and third-party security review milestones.
                    </p>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Smart contracts are compiled for the Zama Developer Program Season 4 with comprehensive unit tests and fuzzing suites. Formal verification of FHE invariant properties is scheduled prior to Ethereum mainnet deployment.
                  </p>
                </section>
</ScrollReveal>

                {/* 07.6 Bug Bounty */}
                <ScrollReveal>
  <section id="bug-bounty" className="space-y-6 pt-4 pb-8">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">07.6 · Bug Bounty</div>
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
                </section>
</ScrollReveal>

              </div>
            )}

            {/* ========================================================================= */}
            {/* SECTION 08 — RESOURCES (ALL SUBPAGES) */}
            {/* ========================================================================= */}
            {activeAreaId === 'resources' && (
              <div className="space-y-16">
                
                {/* 08.1 Glossary */}
                <ScrollReveal>
  <section id="glossary" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">08.1 · Glossary</div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
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
                </section>
</ScrollReveal>

                {/* 08.2 FAQ */}
                <ScrollReveal>
  <section id="faq" className="space-y-6 pt-4 border-b border-zinc-100 pb-16">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">08.2 · FAQ</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Technical and operational protocol questions answered.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                      <div className="font-bold text-zinc-950">How is yield distributed without revealing individual amounts?</div>
                      <p className="text-zinc-600">The Torus coprocessor computes compound yield directly across the encrypted total pool, crediting each participant's euint64 balance homomorphically.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                      <div className="font-bold text-zinc-950">Can node operators inspect my transaction parameters?</div>
                      <p className="text-zinc-600">No. All parameters are submitted as 32-byte opaque ciphertext handles validated by zero-knowledge encryption proofs.</p>
                    </div>
                  </div>
                </section>
</ScrollReveal>

                {/* 08.3 Changelog */}
                <ScrollReveal>
  <section id="changelog" className="space-y-6 pt-4 pb-8">
                  <div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mb-1">08.3 · Changelog</div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                      Protocol Changelog
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Release history on Ethereum Sepolia.
                    </p>
                  </div>

                  <div className="space-y-4 font-mono text-xs text-zinc-600">
                    <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-900">v1.1.0-sepolia (Latest Release)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">Active</span>
                      </div>
                      <ul className="list-disc pl-5 text-[11px] text-zinc-600 font-sans space-y-1">
                        <li><strong>Dual-Factor Zero-Knowledge Authentication:</strong> Client-side SHA-256 salted account profile creation without leaking emails onchain.</li>
                        <li><strong>1:1 Strict Web3 Wallet Binding:</strong> Permanent address locking with automatic session signature revert on wallet mismatch.</li>
                        <li><strong>Mobile-First Responsive Interface:</strong> Slide-over navigation drawer, touch documentation area switcher, and full-width responsive viewports.</li>
                        <li><strong>Kinematic Motion System:</strong> Route-level rise-in blur-pop page transitions and container-aware scroll reveal observers.</li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-50/60 border border-zinc-200 space-y-2">
                      <div className="font-bold text-zinc-900">v1.0.0-sepolia (Genesis Deployment)</div>
                      <ul className="list-disc pl-5 text-[11px] text-zinc-600 font-sans space-y-1">
                        <li>Deployment of MockConfidentialToken, GhostVault, GhostPool, and GhostDraw contracts.</li>
                        <li>Dual-key cryptographic session clearance for unmasking and re-sealing state.</li>
                        <li>Address-isolated ledger architecture and 8-area technical documentation system.</li>
                      </ul>
                    </div>
                  </div>
                </section>
</ScrollReveal>

              </div>
            )}

          </div>

          {/* Pagination Navigation Footer: SWITCHES MAIN SECTIONS */}
          <div className="flex items-center justify-between pt-10 border-t border-zinc-200/80">
            {prevArea ? (
              <button
                onClick={() => switchMainArea(prevArea.id)}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer p-2 rounded-xl hover:bg-zinc-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Section: {prevArea.number} {prevArea.title}</span>
              </button>
            ) : <div />}

            {nextArea ? (
              <button
                onClick={() => switchMainArea(nextArea.id)}
                className="btn-pill-primary text-xs font-semibold px-4 py-2 flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Next Section: {nextArea.number} {nextArea.title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : <div />}
          </div>

        </main>
      </div>
    </div>
  );
};
