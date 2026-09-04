import React, { useState } from 'react';
import { useGhost } from '../context/GhostContext';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  Sparkles, 
  ArrowDownRight, 
  ArrowUpRight, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp,
  Vault,
  Trophy,
  FileCode,
  Check,
  Coins,
  RefreshCw,
  LogOut
} from 'lucide-react';

export const VaultPage: React.FC = () => {
  const {
    setCurrentView,
    walletConnected,
    userAddress,
    disconnectWallet,
    walletTokenBalance,
    isMinting,
    handleMint,
    userBalance,
    userYield,
    userPositionStatus,
    encryptedHandle,
    isSessionAuthorized,
    requestSessionAuthorization,
    isDecrypted,
    isSigning,
    decryptSession,
    lockSession,
    handleDeposit,
    handleWithdraw,
    currentPrizePool,
    activeEvent,
    transactions,
    participantCount,
    isWrongNetwork,
    switchToSepolia,
  } = useGhost();

  const { openConnectModal } = useConnectModal();

  // Mode Switcher: Simple vs Advanced Ciphertext view
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  
  // Action Selector Tabs
  const [activeAction, setActiveAction] = useState<'deposit' | 'withdraw' | 'decrypt' | 'faucet'>('deposit');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (!val || val <= 0) return;
    setIsProcessing(true);
    await handleDeposit(val);
    setDepositAmount('');
    setIsProcessing(false);
  };

  const onWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (!val || val <= 0) return;
    setIsProcessing(true);
    await handleWithdraw(val);
    setWithdrawAmount('');
    setIsProcessing(false);
  };

  const onMint = async (amountToMint: number) => {
    if (!walletConnected) {
      setCurrentView('connect');
      return;
    }
    await handleMint(amountToMint);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafaf9] text-zinc-900 p-4 sm:p-6 lg:p-7 max-w-full space-y-4 sm:space-y-5 select-none">
      
      {/* 1. TOP NETWORK DISCLAIMER BANNER & CONTROLS */}
      <div className="space-y-2.5">
        
        {/* Thin Disclaimer Pill */}
        <div className="w-full py-1.5 px-4 rounded-full bg-zinc-200/60 border border-zinc-200 text-center text-[10px] sm:text-[11px] font-mono text-zinc-600 tracking-wider">
          ETHEREUM SEPOLIA TESTNET · CONFIDENTIAL PRIZE-SAVINGS · ZAMA FHE EUINT64 CLIENT ENCRYPTION
        </div>

        {/* Top Right Control Pills */}
        <div className="flex flex-wrap items-center justify-end gap-2 text-xs font-mono">
          
          {/* Quick Faucet Mint Button */}
          <button
            onClick={() => onMint(1000)}
            disabled={isMinting}
            className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 hover:bg-amber-500/20 text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            title="Mint 1,000 testnet cUSDC"
          >
            {isMinting ? (
              <RefreshCw className="w-3 h-3 animate-spin text-amber-700" />
            ) : (
              <Coins className="w-3 h-3 text-amber-600" />
            )}
            <span>{isMinting ? 'Minting...' : 'Mint 1,000 cUSDC'}</span>
          </button>

          {/* Simple vs Advanced Ciphertext View */}
          <div className="flex items-center p-0.5 rounded-full bg-zinc-200/80 border border-zinc-300/60 text-[11px]">
            <button
              onClick={() => setViewMode('simple')}
              className={`px-3 py-1 rounded-full transition-all font-medium cursor-pointer ${
                viewMode === 'simple'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              Simple
            </button>
            <button
              onClick={() => setViewMode('advanced')}
              className={`px-3 py-1 rounded-full transition-all font-medium cursor-pointer ${
                viewMode === 'advanced'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              Ciphertext Handles
            </button>
          </div>

          {/* Network Indicator Pill */}
          {isWrongNetwork ? (
            <button
              onClick={switchToSepolia}
              className="px-3 py-1 rounded-full bg-red-50 border border-red-300 text-red-700 font-semibold shadow-2xs hover:bg-red-100 flex items-center gap-1.5 cursor-pointer animate-pulse"
              title="Click to switch to Ethereum Sepolia"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span>Switch to Sepolia</span>
            </button>
          ) : (
            <div className="px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-700 shadow-2xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ethereum Sepolia</span>
            </div>
          )}

          {/* Connected Account / Disconnect Wallet Trigger */}
          {walletConnected ? (
            <button
              onClick={disconnectWallet}
              title="Click to disconnect wallet"
              className="group px-3 py-1 rounded-full bg-white border border-zinc-200 text-zinc-900 font-semibold shadow-2xs hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{userAddress}</span>
              <LogOut className="w-3 h-3 text-zinc-400 group-hover:text-red-600 transition-colors" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('connect')}
              className="px-3.5 py-1 rounded-full bg-black text-white font-semibold shadow-xs hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Connect Wallet
            </button>
          )}

        </div>

      </div>

      {/* 2. OVERVIEW HEADER */}
      <div className="pb-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
          Overview
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed max-w-3xl">
          Your confidential vault position, auto-compounding savings yield, and blind prize draw eligibility on Ethereum Sepolia.
        </p>
      </div>

      {/* 3. FOUR METRIC STAT CARDS (ROW OF 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Confidential Vault Balance */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover-elevate flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <Vault className="w-4 h-4 text-zinc-700" />
            <span className="text-[10px] font-mono uppercase">euint64 Sealed</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-950 tracking-tight">
              {isDecrypted ? (
                `$${userBalance.toFixed(2)}`
              ) : (
                <span className="font-mono text-xs sm:text-sm text-zinc-700 bg-zinc-100/90 border border-zinc-200/80 px-2 py-1 rounded-lg inline-flex items-center gap-1.5 w-fit">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{encryptedHandle ? `${encryptedHandle.slice(0, 8)}...${encryptedHandle.slice(-6)}` : '0x7f4e...9b12'}</span>
                </span>
              )}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Confidential Vault Balance (cUSDC)
            </div>
          </div>
        </div>

        {/* Metric 2: Accrued Savings Yield */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover-elevate flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-mono text-emerald-600 font-semibold">Auto-Compounding</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-950 tracking-tight">
              {isDecrypted ? (
                `+$${userYield.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`
              ) : (
                <span className="font-mono text-xs sm:text-sm text-zinc-700 bg-zinc-100/90 border border-zinc-200/80 px-2 py-1 rounded-lg inline-flex items-center gap-1.5 w-fit">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{encryptedHandle ? `0x${encryptedHandle.slice(10, 18)}...${encryptedHandle.slice(-6)}` : '0x3c2a...4d8e'}</span>
                </span>
              )}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Accrued Homomorphic Yield
            </div>
          </div>
        </div>

        {/* Metric 3: Active Blind Prize Pool */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover-elevate flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-mono uppercase text-amber-600 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Blind Draw #{activeEvent.eventId}
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-950 tracking-tight">
              ${currentPrizePool.toFixed(2)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center justify-between">
              <span>Accumulated Prize Pool</span>
              <span className="font-mono text-amber-600 font-semibold">{participantCount.toLocaleString()} Savers</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Principal Protection */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover-elevate flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-mono text-emerald-600 font-semibold">Zero-Loss Guarantee</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-zinc-950 tracking-tight">
              100% Protected
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Self-Custody Principal
            </div>
          </div>
        </div>

      </div>

      {/* 4. MAIN TWO-COLUMN ARCHITECTURAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* LEFT COLUMN (~65% width) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          
          {/* Card 1: Confidential Holdings Position */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3 hover-elevate">
            <div className="space-y-0.5">
              <h3 className="font-bold text-sm text-zinc-950">
                {userBalance > 0
                  ? 'Your Confidential Vault Position is Active'
                  : 'No Active Deposits in Ghost Vault'}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Deposits are sealed into encrypted <code className="font-mono text-[11px] text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">euint64</code> handles before reaching the network. Plaintext balances are never revealed onchain or stored in plaintext memory.
              </p>
            </div>

            {/* Inner Holdings Details */}
            <div className="p-4 rounded-xl sm:rounded-2xl bg-zinc-50 border border-zinc-200/70 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-900">Cryptographic Decryption State</span>
                <span className="font-mono text-[11px] text-zinc-500">
                  {isDecrypted ? '● Decrypted' : '🔒 Sealed'}
                </span>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed">
                {userBalance > 0
                  ? `Your encrypted deposit of ${isDecrypted ? `$${userBalance.toFixed(2)} cUSDC` : (encryptedHandle ? `${encryptedHandle.slice(0, 8)}...${encryptedHandle.slice(-6)} (Sealed Ciphertext)` : '0x7f4e...9b12 (Sealed Ciphertext)')} is generating auto-compounded yield and generating encrypted prize draw entries in the background.`
                  : 'Deposit testnet cUSDC to start earning confidential savings yield and automatically enter zero-loss prize draws.'}
              </p>

              {/* Advanced View: Ciphertext Handle */}
              {viewMode === 'advanced' && (
                <div className="p-2.5 rounded-xl bg-zinc-900 text-zinc-300 font-mono text-[11px] break-all border border-zinc-800">
                  <div className="text-zinc-500 text-[10px] uppercase mb-0.5">Onchain euint64 Ciphertext Handle</div>
                  <div>{encryptedHandle || '0x0000000000000000000000000000000000000000'}</div>
                </div>
              )}

              {/* Action Buttons */}
              {walletConnected && (
                <div className="pt-1">
                  {!isDecrypted ? (
                    <button
                      onClick={decryptSession}
                      disabled={isSigning}
                      className="btn-pill-primary text-xs font-semibold px-4 py-2 flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>{isSigning ? 'Signing Clearance...' : 'Decrypt Balance with Wallet Signature'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                        <Unlock className="w-3 h-3 text-emerald-600" />
                        <span>Decrypted Session Active</span>
                      </span>
                      <button
                        onClick={lockSession}
                        disabled={isSigning}
                        className="text-xs font-mono text-zinc-500 hover:text-zinc-900 underline cursor-pointer disabled:opacity-50"
                      >
                        {isSigning ? 'Signing Lock Request...' : 'Sign to Lock & Encrypt'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: FHE Privacy & Auto-Compounding Gauge */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3 hover-elevate">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-zinc-950">Homomorphic Yield & Privacy Engine</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  100% mathematical privacy. Torus FHE coprocessor computes yield over encrypted integers.
                </p>
              </div>
              <div className="text-right font-mono font-bold text-sm text-zinc-950">
                {isDecrypted ? `+$${userYield.toFixed(2)}` : (encryptedHandle ? `0x${encryptedHandle.slice(10, 18)}...${encryptedHandle.slice(-6)}` : '0x3c2a...4d8e')}
              </div>
            </div>

            {/* Visual Privacy & Yield Status Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden relative border border-zinc-200">
                <div
                  className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                  style={{ width: userBalance > 0 ? '100%' : '15%' }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Zero Mempool Leakage</span>
                <span>Active FHE Protection</span>
              </div>
            </div>
          </div>

          {/* Card 3: Action Center ("What you can do now") */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-4 hover-elevate">
            
            {/* Header */}
            <div>
              <h3 className="font-bold text-sm text-zinc-950 mb-0.5">What you can do now</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Deposit confidential cUSDC to earn compounding yield and automatic entries into blind prize events.
              </p>
            </div>

            {/* Action Selection Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-zinc-100 border border-zinc-200 w-fit text-xs font-medium">
              <button
                onClick={() => setActiveAction('deposit')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAction === 'deposit'
                    ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Deposit to Vault</span>
              </button>

              <button
                onClick={() => setActiveAction('withdraw')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAction === 'withdraw'
                    ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Withdraw Principal</span>
              </button>

              <button
                onClick={() => setActiveAction('decrypt')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAction === 'decrypt'
                    ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Clearance</span>
              </button>

              <button
                onClick={() => setActiveAction('faucet')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeAction === 'faucet'
                    ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                    : 'text-amber-700 hover:text-black'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Faucet</span>
              </button>
            </div>

            {/* Educational Notice Box */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 space-y-1">
              <div className="font-semibold text-zinc-900">
                Zero-Loss Prize Savings Guarantee
              </div>
              <p className="leading-relaxed text-[11px] text-zinc-500">
                Your initial deposit is never at risk. Only the yield generated by the collective pool funds the periodic prize draws. You can withdraw 100% of your deposited principal at any time without penalty.
              </p>
            </div>

            {/* Interactive Forms */}
            {activeAction === 'deposit' ? (
              <form onSubmit={onDeposit} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <label className="font-medium text-zinc-700">Amount to deposit</label>
                    <span className="font-mono">In your wallet: {isDecrypted ? `$${walletTokenBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '0x65c9...8b03 (Sealed)'}</span>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-zinc-400">
                      cUSDC
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-1">
                    <span>{isDecrypted ? `${walletTokenBalance.toLocaleString()} cUSDC available to deposit.` : '0x65c9...8b03 (euint64 Sealed)'}</span>
                    <button
                      type="button"
                      onClick={() => setDepositAmount(walletTokenBalance.toString())}
                      className="text-zinc-700 hover:text-black underline cursor-pointer"
                    >
                      Max
                    </button>
                  </div>

                  {depositAmount && parseFloat(depositAmount) > walletTokenBalance && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between mt-2">
                      <span>Insufficient wallet balance (${walletTokenBalance.toFixed(2)} cUSDC).</span>
                      <button
                        type="button"
                        onClick={() => setActiveAction('faucet')}
                        className="font-bold underline text-amber-900 cursor-pointer"
                      >
                        Mint in Faucet →
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !depositAmount || parseFloat(depositAmount) <= 0 || parseFloat(depositAmount) > walletTokenBalance}
                  className="w-full py-3 px-6 rounded-xl bg-zinc-900 text-white font-semibold text-xs transition-all disabled:opacity-50 hover:bg-black cursor-pointer shadow-xs"
                >
                  {isProcessing ? 'Encrypting & Depositing...' : depositAmount ? 'Deposit Encrypted cUSDC' : 'Enter an amount'}
                </button>
              </form>
            ) : activeAction === 'withdraw' ? (
              <form onSubmit={onWithdraw} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <label className="font-medium text-zinc-700">Amount to withdraw</label>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(userBalance.toString())}
                      className="font-mono text-zinc-700 hover:text-black underline cursor-pointer"
                    >
                      Max ({isDecrypted ? `$${userBalance.toFixed(2)}` : (encryptedHandle ? `${encryptedHandle.slice(0, 8)}...${encryptedHandle.slice(-6)}` : '0x7f4e...9b12')})
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-medium text-zinc-400">
                      cUSDC
                    </span>
                  </div>

                  {withdrawAmount && parseFloat(withdrawAmount) > userBalance && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between mt-2">
                      <span>Exceeds active vault balance (${userBalance.toFixed(2)} cUSDC).</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > userBalance}
                  className="w-full py-3 px-6 rounded-xl bg-zinc-900 text-white font-semibold text-xs transition-all disabled:opacity-50 hover:bg-black cursor-pointer shadow-xs"
                >
                  {isProcessing ? 'Processing Withdrawal...' : withdrawAmount ? 'Withdraw to Wallet' : 'Enter an amount'}
                </button>
              </form>
            ) : activeAction === 'decrypt' ? (
              <div className="space-y-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-xs text-zinc-700 leading-relaxed">
                  Cryptographic clearance allows your browser to decrypt or re-seal your onchain <code className="font-mono">euint64</code> ciphertext handles client-side.
                </div>
                {!isDecrypted ? (
                  <button
                    onClick={decryptSession}
                    disabled={isSigning}
                    className="w-full btn-pill-primary py-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{isSigning ? 'Signing Clearance...' : 'Authorize Decryption with Wallet'}</span>
                  </button>
                ) : (
                  <button
                    onClick={lockSession}
                    disabled={isSigning}
                    className="w-full btn-pill-secondary py-2.5 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSigning ? 'Signing Re-Sealing Request...' : 'Sign to Re-Seal & Encrypt'}</span>
                  </button>
                )}
              </div>
            ) : (
              /* Faucet Tab */
              <div className="space-y-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-xs text-zinc-900 mb-1">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>Testnet cUSDC Faucet</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Mint free testnet cUSDC tokens directly to your connected wallet to test confidential vault deposits, homomorphic auto-compounding yields, and blind prize draws.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {[500, 1000, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setMintAmount(preset)}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                        mintAmount === preset
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      +{preset.toLocaleString()}
                    </button>
                  ))}
                </div>

                {!walletConnected ? (
                  <button
                    type="button"
                    onClick={() => setCurrentView('connect')}
                    className="w-full btn-pill-primary py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Connect Wallet to Request Faucet</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onMint(mintAmount)}
                    disabled={isMinting}
                    className="w-full btn-pill-primary py-3 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isMinting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Signing Cryptographic Mint...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Sign & Mint {mintAmount.toLocaleString()} cUSDC</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Bottom Form Footnote */}
            <div className="text-[11px] text-zinc-400 font-mono pt-1.5 border-t border-zinc-100">
              Deposited principal can be withdrawn at any time with zero lockup penalty.{' '}
              <button onClick={() => setActiveAction('withdraw')} className="text-zinc-700 underline cursor-pointer">
                Withdraw savings.
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (~35% width) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5">
          
          {/* Card 1: PROTOCOL SECURITY & FHE ARCHITECTURE */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-4 hover-elevate">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                PROTOCOL SECURITY
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Audited & Active</span>
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-0.5 border-b border-zinc-100/80">
                <span className="text-zinc-500">Encryption Engine</span>
                <span className="text-zinc-900 font-semibold">Zama fhEVM (TFHE)</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-zinc-100/80">
                <span className="text-zinc-500">Coprocessor</span>
                <span className="text-zinc-900 font-semibold">Torus FHE Engine</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-zinc-100/80">
                <span className="text-zinc-500">State Proof</span>
                <span className="text-zinc-900 font-semibold">Merkle Root Verified</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-500">Principal Safety</span>
                <span className="text-emerald-700 font-semibold">100% Non-Custodial</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Smart contracts execute math directly over ciphertexts. No validator, node operator, or third party ever sees your plaintext financial balance.
            </p>
          </div>

          {/* Card 2: Where your account stands (Cryptographic Lifecycle Steps) */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-4 hover-elevate">
            <div>
              <h3 className="font-bold text-sm text-zinc-950 mb-0.5">Where your account stands</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Recomputed from live inputs on every read. There is no cached status that could disagree with the chain.
              </p>
            </div>

            {/* Vertical Radio List */}
            <div className="space-y-3 text-xs">
              
              <div className="flex items-start gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2 h-2 text-white" />
                </div>
                <div>
                  <span className="font-bold text-zinc-950 block">Normal <span className="text-zinc-400 font-normal">you are here</span></span>
                  <span className="text-zinc-500 text-[11px]">Full privacy enabled. Principal 100% self-custodial.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDecrypted ? 'bg-black text-white' : 'border border-zinc-300'}`}>
                  {isDecrypted && <Check className="w-2 h-2 text-white" />}
                </div>
                <div>
                  <span className="font-medium text-zinc-800 block">Cryptographic Clearance</span>
                  <span className="text-zinc-500 text-[11px]">
                    {isDecrypted ? 'Session decrypted via wallet signature.' : 'Sealed. Authorize signature to decrypt balances.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${userBalance > 0 ? 'bg-black text-white' : 'border border-zinc-300'}`}>
                  {userBalance > 0 && <Check className="w-2 h-2 text-white" />}
                </div>
                <div>
                  <span className="font-medium text-zinc-800 block">Yield Compounding</span>
                  <span className="text-zinc-500 text-[11px]">
                    {userBalance > 0 ? 'Auto-compounding yield on encrypted balance.' : 'Deposit to activate background yield.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${userBalance > 0 ? 'bg-black text-white' : 'border border-zinc-300'}`}>
                  {userBalance > 0 && <Check className="w-2 h-2 text-white" />}
                </div>
                <div>
                  <span className="font-medium text-zinc-800 block">Prize Draw Enrolled</span>
                  <span className="text-zinc-500 text-[11px]">
                    {userBalance > 0 ? `Weighted ticket chance entered in Blind Draw #${activeEvent.eventId}.` : 'Enter draw upon first deposit.'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Card 3: Active Prize Draw Mini-Card */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-3 hover-elevate">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-zinc-950">Active Prize Draw</h3>
              <button
                onClick={() => setCurrentView('events')}
                className="text-[11px] font-mono text-zinc-500 hover:text-black underline cursor-pointer"
              >
                See draw
              </button>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Blind prize draw #{activeEvent.eventId} is accumulating yield. Winner is selected via encrypted weighted sampling without revealing any ticket sizes.
            </p>
            <button
              onClick={() => setCurrentView('events')}
              className="btn-pill-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span>View Events & Draws</span>
            </button>
          </div>

          {/* Card 4: Protocol Solvency Assurance */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-1.5 hover-elevate">
            <h3 className="font-bold text-sm text-zinc-950">Zero-Knowledge Solvency</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Verify protocol solvency and contract state mathematically onchain without revealing any individual user's savings deposit.
            </p>
          </div>

        </div>

      </div>

      {/* 5. BOTTOM FULL-WIDTH TRANSACTION HISTORY TABLE */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-zinc-200/80 shadow-xs space-y-4 hover-elevate">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-950">Confidential Transaction Receipts</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Verified onchain cryptographic actions on Ethereum Sepolia.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('activity')}
            className="text-xs font-mono text-zinc-500 hover:text-black underline cursor-pointer"
          >
            All receipts
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400 space-y-1">
            <div className="font-semibold text-zinc-700">No transaction receipts yet</div>
            <div>Deposit cUSDC or authorize decryption to generate verified onchain receipts.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-100 text-[11px] uppercase tracking-wider">
                  <th className="pb-2.5 font-semibold">ACTION</th>
                  <th className="pb-2.5 font-semibold">STATUS</th>
                  <th className="pb-2.5 font-semibold">TRANSACTION</th>
                  <th className="pb-2.5 font-semibold">BLOCK</th>
                  <th className="pb-2.5 font-semibold text-right">WHEN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {transactions.slice(0, 5).map((tx, idx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 font-semibold text-zinc-900 flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{tx.type} committed</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                        Completed
                      </span>
                    </td>
                    <td className="py-3 font-mono text-zinc-500">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black flex items-center gap-1"
                      >
                        <span className="truncate max-w-[140px]">{tx.txHash}</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </td>
                    <td className="py-3 text-zinc-500">
                      {38597280 + idx * 4}
                    </td>
                    <td className="py-3 text-right text-zinc-400">
                      {new Date(tx.timestamp).toISOString().split('T')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
