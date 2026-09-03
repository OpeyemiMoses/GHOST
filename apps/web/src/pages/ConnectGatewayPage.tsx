import React, { useState, useRef } from 'react';
import { useGhost } from '../context/GhostContext';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ArrowRight, ArrowLeft, Shield, Lock, ShieldCheck, ShieldAlert, Sparkles, Check, X, Wallet, KeyRound, Cpu, Terminal, Radio, RefreshCw } from 'lucide-react';

export const ConnectGatewayPage: React.FC = () => {
  const { walletConnected, userAddress, setCurrentView, isSessionAuthorized, requestSessionAuthorization, isSigning } = useGhost();
  const { openConnectModal } = useConnectModal();

  // Interactive 3D Card Tilt State
  const [rotate, setRotate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 16;
    const rotateY = (x / rect.width) * 16;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const handleAuthorizeAndEnter = async () => {
    const ok = await requestSessionAuthorization();
    if (ok) {
      setCurrentView('vault');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 flex flex-col lg:flex-row selection:bg-zinc-200">
      
      {/* LEFT HALF: Dark Cinematic Showcase with Rise-in Blur Pop Animations */}
      <div className="relative w-full lg:w-[50%] min-h-[580px] lg:min-h-screen bg-black text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
        
        {/* Ambient Volumetric Lighting Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[540px] h-[540px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none animate-ambient-pulse" />
        <div className="absolute bottom-10 -left-20 w-[420px] h-[420px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none animate-ambient-pulse" />

        {/* Animated Background Conic Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(120,80,30,0.12),transparent_70%)] pointer-events-none" />

        {/* Top Header / Brand with Blur Pop Entrance */}
        <div className="relative z-20 flex items-center justify-between animate-rise-blur">
          <button
            onClick={() => setCurrentView('vault')}
            className="flex items-center gap-2 group transition-transform hover:scale-102 cursor-pointer"
          >
            <img
              src="/assets/ghost-logo-lockup-white.png"
              alt="Ghost"
              className="h-8 w-auto object-contain"
            />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-400 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sepolia Testnet</span>
          </div>
        </div>

        {/* Center Visual Photograph / 3D Animated Vault Stage with Staggered Blur Pop */}
        <div
          className="relative z-10 my-auto py-6 flex flex-col items-center justify-center [perspective:1200px] animate-rise-blur-d1"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Floating Telemetry Badge 1 (Top Left) */}
          <div className="absolute -top-3 left-4 sm:left-10 z-30 px-3.5 py-1.5 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-mono shadow-xl flex items-center gap-2 animate-float-1 pointer-events-none">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>euint64 Ciphertext Sealing</span>
          </div>

          {/* Floating Telemetry Badge 2 (Bottom Right) */}
          <div className="absolute -bottom-3 right-4 sm:right-10 z-30 px-3.5 py-1.5 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-mono shadow-xl flex items-center gap-2 animate-float-2 pointer-events-none">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Torus FHE Coprocessor</span>
          </div>

          {/* Expanding Radar Wave Ring */}
          <div className="absolute w-[320px] h-[320px] rounded-full border border-amber-500/20 animate-radar-wave pointer-events-none" />

          {/* 3D Interactive Card Container */}
          <div
            ref={cardRef}
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transition: rotate.x === 0 ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            }}
            className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)] border border-zinc-700/80 group cursor-grab active:cursor-grabbing"
          >
            {/* Vault Photograph */}
            <img
              src="/assets/connect-vault-cinematic.jpg"
              alt="Ghost Confidential Hardware Vault"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Glowing Golden Rim Lighting Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none" />

            {/* Animated High-Tech Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent h-20 w-full animate-scanline pointer-events-none" />

            {/* Bottom In-Card Telemetry Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-zinc-300 shadow-lg">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Zero Plaintext Exposure</span>
              </span>
              <span className="text-zinc-400">Zama fhEVM Core</span>
            </div>
          </div>
        </div>

        {/* Live Cryptographic Stream & Headline with Staggered Blur Pop */}
        <div className="relative z-10 max-w-lg space-y-4 animate-rise-blur-d2">
          
          {/* Live Hash Telemetry Ticker */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-900 w-fit">
            <Terminal className="w-3 h-3 text-emerald-500" />
            <span className="text-zinc-400">0x7f4e...291a · Merkle Root Verified · Homomorphic State Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Zero plaintext leakage. <br />
            Your financial balance is protected.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Non-custodial, homomorphically encrypted prize-savings on Ethereum Sepolia.
          </p>
        </div>

      </div>

      {/* RIGHT HALF: Clean Auth Gateway, Step Guide & Security Matrix with Rise-in Blur Pop */}
      <div className="w-full lg:w-[50%] min-h-screen bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-y-auto">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8 animate-rise-blur">
          <button
            onClick={() => setCurrentView('vault')}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 flex items-center gap-1.5 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <span className="text-xs font-mono text-zinc-400">
            Authorization Gateway
          </span>
        </div>

        {/* Main Content Area */}
        <div className="max-w-md w-full mx-auto my-auto space-y-8">
          
          {/* Header with Rise in Blur Pop */}
          <div className="animate-rise-blur-d1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-2">
              Connect to Ghost
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Establish an authorized Web3 session to view your confidential balances, earn yield, and participate in blind prize events.
            </p>
          </div>

          {/* 3-Step Walkthrough Guide */}
          <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-3.5 hover-elevate animate-rise-blur-d2">
            <div className="text-xs font-semibold text-zinc-900 flex items-center gap-2 pb-2 border-b border-zinc-200/80">
              <Sparkles className="w-4 h-4 text-zinc-700" />
              <span>How Connection Works</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-semibold text-zinc-900 block">Select Web3 Wallet</span>
                  <span className="text-zinc-500 text-[11px]">MetaMask, Rainbow, Coinbase, or WalletConnect.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-semibold text-zinc-900 block">Switch to Ethereum Sepolia</span>
                  <span className="text-zinc-500 text-[11px]">Standard testnet chain (Chain ID 11155111).</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-semibold text-zinc-900 block">Cryptographic Session Signature</span>
                  <span className="text-zinc-500 text-[11px]">Sign a confirmation request to authenticate identity and access your dashboard.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="animate-rise-blur-d3">
            {!walletConnected ? (
              <button
                onClick={openConnectModal}
                className="w-full btn-pill-primary py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            ) : !isSessionAuthorized ? (
              <div className="space-y-3 animate-page-enter">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Awaiting Signature</span>
                  </span>
                  <span>{userAddress}</span>
                </div>
                <button
                  onClick={handleAuthorizeAndEnter}
                  disabled={isSigning}
                  className="w-full btn-pill-primary py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSigning ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <KeyRound className="w-4 h-4" />
                  )}
                  <span>{isSigning ? 'Awaiting Wallet Signature...' : 'Sign Confirmation & Enter Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-page-enter">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between font-mono">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Session Authorized</span>
                  </span>
                  <span>{userAddress}</span>
                </div>
                <button
                  onClick={() => setCurrentView('vault')}
                  className="w-full btn-pill-primary py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Security & Access Breakdown Matrix */}
          <div className="space-y-3 animate-rise-blur-d4">
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider font-mono">
              Permissions & Cryptographic Boundaries
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Allowed Access */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover-elevate">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-800 mb-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Ghost Has Access To</span>
                </div>
                <ul className="space-y-2 text-[11px] text-zinc-600 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    <span>Public address for transaction routing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    <span>Encrypted ciphertext handles (<code className="text-zinc-900 font-semibold">euint64</code>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
                    <span>Public Merkle state root proofs</span>
                  </li>
                </ul>
              </div>

              {/* Forbidden Access */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover-elevate">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-rose-800 mb-2.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Ghost CANNOT Access</span>
                </div>
                <ul className="space-y-2 text-[11px] text-zinc-600 font-mono">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                    <span>Private keys / seed phrases (never leaves wallet)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                    <span>Plaintext balance without your signature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                    <span>Authority to move funds without confirmation</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Disclaimers */}
        <div className="pt-6 border-t border-zinc-100 text-[11px] text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2 animate-rise-blur-d4">
          <span>100% Non-Custodial Protocol</span>
          <span>Audited Zama fhEVM Smart Contracts</span>
        </div>

      </div>

    </div>
  );
};
