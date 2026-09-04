import React, { useState, useRef } from 'react';
import { useGhost } from '../context/GhostContext';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { 
  ArrowRight, ArrowLeft, Shield, Lock, ShieldCheck, ShieldAlert, Sparkles, 
  Check, X, Wallet, KeyRound, Cpu, Terminal, Radio, RefreshCw, Mail, 
  AlertCircle, LogOut, CheckCircle2, UserCheck, Key
} from 'lucide-react';

export const ConnectGatewayPage: React.FC = () => {
  const { 
    walletConnected, 
    userAddress, 
    rawAddress,
    setCurrentView, 
    isSessionAuthorized, 
    requestSessionAuthorization, 
    isSigning,
    currentUser,
    registerAccount,
    loginAccount,
    logoutAccount,
    bindWalletToAccount,
    isWalletMatchingBound,
    isWrongNetwork,
    switchToSepolia,
  } = useGhost();

  const { openConnectModal } = useConnectModal();

  // Auth Form State
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [bindLoading, setBindLoading] = useState<boolean>(false);
  const [bindSuccessMessage, setBindSuccessMessage] = useState<string | null>(null);

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          setAuthError('Passwords do not match. Please verify.');
          setAuthLoading(false);
          return;
        }
        const res = await registerAccount(email, password);
        if (!res.success) {
          setAuthError(res.error || 'Failed to register account.');
        }
      } else {
        const res = await loginAccount(email, password);
        if (!res.success) {
          setAuthError(res.error || 'Invalid email or password.');
        }
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleBindWallet = async () => {
    if (!rawAddress) return;
    setBindLoading(true);
    setAuthError(null);
    try {
      const res = await bindWalletToAccount(rawAddress);
      if (!res.success) {
        setAuthError(res.error || 'Failed to bind wallet.');
      } else {
        setBindSuccessMessage(`Wallet ${rawAddress.slice(0, 6)}...${rawAddress.slice(-4)} successfully bound!`);
        setTimeout(() => setBindSuccessMessage(null), 4000);
      }
    } finally {
      setBindLoading(false);
    }
  };

  const handleAuthorizeAndEnter = async () => {
    const ok = await requestSessionAuthorization();
    if (ok) {
      setCurrentView('vault');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-zinc-900 flex flex-col lg:flex-row selection:bg-zinc-200">
      
      {/* LEFT HALF: Dark Cinematic Showcase (Bottom on mobile, Left on desktop) */}
      <div className="order-2 lg:order-1 relative w-full lg:w-[48%] min-h-[480px] lg:min-h-screen bg-black text-white p-6 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
        
        {/* Ambient Volumetric Lighting Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[540px] h-[540px] bg-amber-600/15 rounded-full blur-[140px] pointer-events-none animate-ambient-pulse" />
        <div className="absolute bottom-10 -left-20 w-[420px] h-[420px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none animate-ambient-pulse" />

        {/* Animated Background Conic Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(120,80,30,0.12),transparent_70%)] pointer-events-none" />

        {/* Top Header / Brand */}
        <div className="relative z-20 flex items-center justify-between pb-6 sm:pb-8">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2 group transition-transform hover:scale-102 cursor-pointer"
          >
            <img
              src="/assets/ghost-logo-lockup-white.png"
              alt="Ghost"
              className="h-5 sm:h-6 w-auto object-contain"
            />
          </button>
          
          {isWrongNetwork ? (
            <button
              onClick={switchToSepolia}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/90 border border-red-800 text-[10px] sm:text-[11px] font-mono text-red-300 shadow-md cursor-pointer hover:bg-red-900 transition-colors animate-pulse"
              title="Click to switch to Ethereum Sepolia"
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Switch to Sepolia</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[10px] sm:text-[11px] font-mono text-zinc-400 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sepolia Testnet</span>
            </div>
          )}
        </div>

        {/* Center Visual Photograph / 3D Animated Vault Stage */}
        <div
          className="relative z-10 my-auto py-8 sm:py-10 flex flex-col items-center justify-center [perspective:1200px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Floating Telemetry Badge 1 */}
          <div className="absolute top-1 left-2 sm:left-6 z-30 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] sm:text-[11px] font-mono shadow-xl flex items-center gap-1.5 pointer-events-none">
            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span>Dual-Key Account Lock</span>
          </div>

          {/* Floating Telemetry Badge 2 */}
          <div className="absolute bottom-1 right-2 sm:right-6 z-30 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-[11px] font-mono shadow-xl flex items-center gap-1.5 pointer-events-none">
            <Cpu className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            <span>Zero Onchain Plaintext</span>
          </div>

          {/* Expanding Radar Wave Ring */}
          <div className="absolute w-[300px] sm:w-[320px] h-[300px] sm:h-[320px] rounded-full border border-amber-500/20 animate-radar-wave pointer-events-none" />

          {/* 3D Interactive Card Container */}
          <div
            ref={cardRef}
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transition: rotate.x === 0 ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            }}
            className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-[2.5rem] overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)] border border-zinc-700/80 group cursor-grab active:cursor-grabbing"
          >
            <img
              src="/assets/connect-vault-cinematic.jpg"
              alt="Ghost Confidential Hardware Vault"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-zinc-300 shadow-lg">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Client Enclave Bound</span>
              </span>
              <span className="text-zinc-400">Zama fhEVM</span>
            </div>
          </div>
        </div>

        {/* Live Cryptographic Stream & Headline */}
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-900 w-fit">
            <Terminal className="w-3 h-3 text-emerald-500" />
            <span className="text-zinc-400">0x7f4e...291a · Merkle Root Verified · Homomorphic State Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Confidential Savings. <br />
            Protected by Dual-Factor Auth.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Email authentication paired with non-custodial Web3 wallet binding.
          </p>
        </div>

      </div>

      {/* RIGHT HALF: Clean Auth Gateway & Wallet Binding Portal (Top on mobile, Right on desktop) */}
      <div className="order-1 lg:order-2 w-full lg:w-[52%] min-h-screen bg-white p-6 sm:p-10 lg:p-16 flex flex-col justify-between overflow-y-auto">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-950 flex items-center gap-1.5 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </button>

          <span className="text-xs font-mono text-zinc-400">
            Confidential Portal
          </span>
        </div>

        {/* Main Content Form Area */}
        <div className="max-w-md w-full mx-auto my-auto space-y-6">
          
          {/* STAGE 1: NOT LOGGED IN — EMAIL & PASSWORD AUTHENTICATION */}
          {!currentUser ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mb-1.5">
                  {authMode === 'signin' ? 'Welcome back to Ghost' : 'Create your Ghost account'}
                </h1>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {authMode === 'signin' 
                    ? 'Sign in with your email and password to access your bound confidential vault.'
                    : 'Set up an email account and bind your Web3 wallet for confidential savings.'}
                </p>
              </div>

              {/* Mode Switch Tabs */}
              <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    authMode === 'signin' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                  className={`py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    authMode === 'signup' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Error Alert */}
              {authError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-800">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-800">Password</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                </div>

                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800">Confirm Password</label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full btn-pill-primary py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 mt-2"
                >
                  {authLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{authMode === 'signin' ? 'Sign In to Account' : 'Create Account & Continue'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Zero-Knowledge Security Callout */}
              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 flex items-start gap-3 text-xs text-zinc-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-zinc-500">
                  <strong className="text-zinc-900">Zero Onchain Knowledge:</strong> Your email and password are never broadcasted to the blockchain. They reside exclusively in client-side cryptographic enclaves.
                </p>
              </div>
            </div>
          ) : !currentUser.boundWalletAddress ? (
            
            /* STAGE 2: LOGGED IN — NO WALLET BOUND YET */
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[11px] font-semibold mb-2">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated: {currentUser.email}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                  Bind Your Web3 Wallet
                </h1>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Link your Ethereum Sepolia wallet to this email account. Once bound, this account will strictly only authorize sessions from this address.
                </p>
              </div>

              {authError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {bindSuccessMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{bindSuccessMessage}</span>
                </div>
              )}

              <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700">Connected Wallet:</span>
                  {rawAddress ? (
                    <span className="font-mono text-xs text-zinc-950 font-bold bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
                      {rawAddress.slice(0, 6)}...{rawAddress.slice(-4)}
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-xs">No wallet connected</span>
                  )}
                </div>

                {!rawAddress ? (
                  <button
                    onClick={openConnectModal}
                    className="w-full btn-pill-primary py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet to Bind</span>
                  </button>
                ) : (
                  <button
                    onClick={handleBindWallet}
                    disabled={bindLoading}
                    className="w-full btn-pill-primary py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {bindLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock & Bind {rawAddress.slice(0, 6)}...{rawAddress.slice(-4)} to Account</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={logoutAccount}
                  className="text-xs text-zinc-500 hover:text-zinc-950 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out & use different email</span>
                </button>
              </div>
            </div>
          ) : (
            
            /* STAGE 3: WALLET BOUND — VERIFY & ENTER DASHBOARD */
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-mono text-[11px] font-semibold mb-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-900" />
                  <span>{currentUser.email}</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                  Wallet Authorization
                </h1>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Verify your bound wallet address and authorize your confidential session.
                </p>
              </div>

              {/* Bound Wallet Badge Box */}
              <div className="p-5 rounded-3xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Bound Address:</span>
                  <span className="font-mono font-bold text-zinc-900 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 text-xs">
                    {currentUser.boundWalletAddress.slice(0, 6)}...{currentUser.boundWalletAddress.slice(-4)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Connected Wallet:</span>
                  {rawAddress ? (
                    <span className={`font-mono font-bold px-2.5 py-1 rounded-lg border text-xs ${
                      isWalletMatchingBound 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                      {rawAddress.slice(0, 6)}...{rawAddress.slice(-4)}
                    </span>
                  ) : (
                    <span className="text-zinc-400">Not connected</span>
                  )}
                </div>

                {/* Status Indicator */}
                {rawAddress && isWalletMatchingBound && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Wallet verified and matches bound account address.</span>
                  </div>
                )}

                {rawAddress && !isWalletMatchingBound && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      <span>Wallet Mismatch Detected</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      This account is locked to <strong>{currentUser.boundWalletAddress.slice(0, 8)}...</strong>. Please switch accounts in your MetaMask/Rainbow extension to continue.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!rawAddress ? (
                <button
                  onClick={openConnectModal}
                  className="w-full btn-pill-primary py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet ({currentUser.boundWalletAddress.slice(0, 6)}...)</span>
                </button>
              ) : isWalletMatchingBound ? (
                <button
                  onClick={handleAuthorizeAndEnter}
                  disabled={isSigning}
                  className="w-full btn-pill-primary py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSigning && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Authorize Session & Enter Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={openConnectModal}
                  className="w-full btn-pill-secondary py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Switch Connected Account</span>
                </button>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={logoutAccount}
                  className="text-xs text-zinc-500 hover:text-zinc-950 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out & use different account</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Technical Verification */}
        <div className="pt-6 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Client-Side SHA-256 + EIP-712 Dual Key</span>
          <span>Zero Server Storage</span>
        </div>

      </div>
    </div>
  );
};
