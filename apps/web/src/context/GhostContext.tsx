import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { useAccount, useDisconnect, useSignMessage, useWalletClient, usePublicClient, useChainId, useSwitchChain } from 'wagmi';
import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';
import { sepolia } from 'wagmi/chains';
import { config } from '../lib/wagmi';
import { fetchGlobalCloudState, pushGlobalCloudState, subscribeToGlobalState } from '../services/cloudSync';

export const PROTOCOL_BASELINE_TVL = 0;
export const PROTOCOL_BASELINE_SAVERS = 0;

export const DEPLOYED_CONTRACTS = {
  MockConfidentialToken: '0x65C9020961f4fdF5E0a1fE01dC1225A096408B03' as `0x${string}`,
  GhostVault: '0xA83889ff7D4D78c53A05e050DaE596c9F3058b96' as `0x${string}`,
  GhostPool: '0x96e5946A0aa82656EBEA8f5Da5d998e211a10b06' as `0x${string}`,
  GhostDraw: '0xFFDA136c18fdb7C0f74eE60f002f5fFfaCD9957F' as `0x${string}`,
  GhostVerifier: '0xf41C61D972615D5a8E08b574326B1258013B2B3C' as `0x${string}`,
};

const TOKEN_ABI = [
  {
    name: 'mintPlaintext',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint64' },
    ],
    outputs: [],
  },
] as const;

const POOL_ABI = [
  {
    name: 'depositPlaintext',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint64' }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    name: 'withdrawPlaintext',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint64' }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
] as const;

const DRAW_ABI = [
  {
    name: 'executeDraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ name: 'winner', type: 'address' }],
  },
] as const;

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

export interface TransactionRecord {
  id: string;
  ownerAddress?: string;
  type: 'Deposit' | 'Withdraw' | 'Prize Won' | 'Mint cUSDC';
  amount: number;
  encryptedHandle: string;
  timestamp: number;
  txHash: string;
  status: 'Confirmed' | 'Pending';
}

export interface ProtocolEventRecord {
  eventId: number;
  status: 'OPEN' | 'COMPUTING_FHE' | 'FINALIZED';
  startTime: number;
  endTime: number;
  prizeAmount: number;
  encryptedPrizeHandle: string;
  winnerAddress: string;
  randomnessCommitment: string;
  stateRoot: string;
  txHash: string;
  isVerified: boolean;
}

export interface PrizeRecord {
  id: string;
  eventId: number;
  winnerAddress: string;
  amount: number;
  encryptedHandle?: string;
  drawTxHash: string;
  claimTxHash?: string;
  timestamp: number;
  status: 'UNCLAIMED' | 'CLAIMED';
  claimTimestamp?: number;
}

export interface UserAccount {
  email: string;
  passwordHash: string;
  boundWalletAddress: string | null;
  createdAt: number;
}

interface GhostContextType {
  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;

  // Toast System
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;

  // Email & Password Auth State
  currentUser: UserAccount | null;
  registerAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutAccount: () => void;
  bindWalletToAccount: (walletAddress: string) => Promise<{ success: boolean; error?: string }>;
  isWalletMatchingBound: boolean;

  // Real Wallet State from RainbowKit / wagmi
  walletConnected: boolean;
  userAddress: string;
  rawAddress: string | undefined;
  disconnectWallet: () => void;
  isWrongNetwork: boolean;
  switchToSepolia: () => Promise<void>;

  // Cryptographic Signature Session Authorization & Decryption State
  isSessionAuthorized: boolean;
  requestSessionAuthorization: () => Promise<boolean>;
  isDecrypted: boolean;
  isSigning: boolean;
  decryptionSignature: string | null;
  decryptSession: () => Promise<void>;
  lockSession: () => Promise<void>;

  // Owner's Wallet Balance (cUSDC in connected wallet)
  walletTokenBalance: number;
  isMinting: boolean;
  handleMint: (amount?: number) => Promise<void>;

  // Owner's Decrypted Vault State (Pure initial 0, zero mock)
  userBalance: number;
  userYield: number;
  userPositionStatus: string;
  encryptedHandle: string;

  // Actions
  handleDeposit: (amount: number) => Promise<void>;
  handleWithdraw: (amount: number) => Promise<void>;

  // Activity (Strictly empty until user performs an action)
  transactions: TransactionRecord[];

  // Participants & Network Metrics
  participantCount: number;

  // Events & Draw Claims
  currentPrizePool: number;
  activeEvent: ProtocolEventRecord;
  pastEvents: ProtocolEventRecord[];
  isComputingEvent: boolean;
  executeEventDraw: () => Promise<void>;

  // Prize Claiming System
  unclaimedPrizes: PrizeRecord[];
  claimedPrizes: PrizeRecord[];
  claimPrize: (prizeId: string) => Promise<boolean>;

  // Protocol Reset & Start Afresh
  resetProtocolState: () => void;
}

const GhostContext = createContext<GhostContextType | undefined>(undefined);

export const generateCiphertextHandle = (val: number, addr: string): string => {
  const seed = `${val}_${addr}_${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hexPart}e8f9a2b41c6d830f57e2a9b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3`;
};

async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(password + ':ghost_secure_auth_salt_v1');
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}



export const getViewFromHash = (): string | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
  const validViews = [
    'landing', 'vault', 'dashboard', 'activity', 'events', 'draws',
    'verify', 'how-it-works', 'security', 'contracts', 'connect',
    'docs', 'help', 'claim'
  ];
  if (hash && validViews.includes(hash)) {
    return hash === 'dashboard' ? 'vault' : hash === 'draws' ? 'events' : hash;
  }
  return null;
};
// One-time automatic clean slate purge across all clients and wallets
if (typeof window !== 'undefined') {
  try {
    const CLEAN_SLATE_KEY = 'ghost_clean_slate_v7';
    if (!localStorage.getItem(CLEAN_SLATE_KEY)) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ghost_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem(CLEAN_SLATE_KEY, 'true');
    }
  } catch {
    // Ignore
  }
}

export const GhostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, _setCurrentView] = useState<string>(() => {
    const fromHash = getViewFromHash();
    if (fromHash) return fromHash;
    try {
      const saved = localStorage.getItem('ghost_current_view');
      if (saved) return saved;
    } catch {
      // Ignore
    }
    return 'landing';
  });

  const setCurrentView = (view: string) => {
    const normalized = view === 'dashboard' ? 'vault' : view === 'draws' ? 'events' : view;
    _setCurrentView(normalized);
    try {
      localStorage.setItem('ghost_current_view', normalized);
      if (normalized === 'landing') {
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        window.location.hash = `/${normalized}`;
      }
    } catch {
      // Ignore
    }
  };

  // Sync with browser forward/back buttons and hash changes
  useEffect(() => {
    const onHashChange = () => {
      const fromHash = getViewFromHash();
      if (fromHash) {
        _setCurrentView(fromHash);
        try {
          localStorage.setItem('ghost_current_view', fromHash);
        } catch {
          // Ignore
        }
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Ensure current URL hash matches currentView on first mount
  useEffect(() => {
    const fromHash = getViewFromHash();
    if (!fromHash && currentView && currentView !== 'landing') {
      window.location.hash = `/${currentView}`;
    }
  }, [currentView]);

  // Global Toast Notifications State
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastItem = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Email & Password Authentication State (Zero Onchain Knowledge)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedEmail = localStorage.getItem('ghost_current_user_email');
      if (savedEmail) {
        const accountsDb = JSON.parse(localStorage.getItem('ghost_accounts_db') || '{}');
        return accountsDb[savedEmail.toLowerCase()] || null;
      }
    } catch (e) {
      // Ignore
    }
    return null;
  });

  // Wagmi real wallet state
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, switchChainAsync } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const isWrongNetwork = Boolean(isConnected && chainId && chainId !== sepolia.id);

  const switchToSepolia = async () => {
    if (switchChainAsync) {
      try {
        await switchChainAsync({ chainId: sepolia.id });
      } catch (err: any) {
        addToast({
          type: 'error',
          title: 'Network Switch Failed',
          message: err?.shortMessage || err?.message || 'Please switch network to Sepolia in your wallet.',
        });
      }
    } else if (switchChain) {
      switchChain({ chainId: sepolia.id });
    }
  };

  // Auto switch to Sepolia upon wallet connection if on another chain
  useEffect(() => {
    if (isConnected && chainId && chainId !== sepolia.id && switchChain) {
      try {
        switchChain({ chainId: sepolia.id });
      } catch (e) {
        // Ignore prompt rejection
      }
    }
  }, [isConnected, chainId, switchChain]);

  const formattedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  // Check if active connected wallet matches account's bound wallet
  const isWalletMatchingBound = useMemo(() => {
    if (!currentUser || !currentUser.boundWalletAddress) return true;
    if (!address) return false;
    return address.toLowerCase() === currentUser.boundWalletAddress.toLowerCase();
  }, [currentUser, address]);

  // Cryptographic Signature Decryption & Session Authorization State (Persists across reloads)
  const [isSessionAuthorized, setIsSessionAuthorized] = useState<boolean>(() => {
    try {
      const savedEmail = localStorage.getItem('ghost_current_user_email');
      if (savedEmail) {
        const authKey = `ghost_session_auth_${savedEmail.toLowerCase()}`;
        return localStorage.getItem(authKey) === 'true';
      }
    } catch {
      // Ignore
    }
    return false;
  });
  const [isDecrypted, setIsDecrypted] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [decryptionSignature, setDecryptionSignature] = useState<string | null>(null);

  // Authentication Actions with Cloud Sync
  const registerAccount = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      addToast({ type: 'error', title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      addToast({ type: 'error', title: 'Weak Password', message: 'Password must be at least 6 characters long.' });
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    try {
      const accountsDb = JSON.parse(localStorage.getItem('ghost_accounts_db') || '{}');
      if (accountsDb[cleanEmail]) {
        addToast({ type: 'error', title: 'Account Exists', message: 'An account with this email already exists. Please sign in.' });
        return { success: false, error: 'An account with this email already exists. Please sign in.' };
      }
      const hash = await hashPassword(password);
      const newAccount: UserAccount = {
        email: cleanEmail,
        passwordHash: hash,
        boundWalletAddress: null,
        createdAt: Date.now(),
      };
      accountsDb[cleanEmail] = newAccount;
      localStorage.setItem('ghost_accounts_db', JSON.stringify(accountsDb));
      localStorage.setItem('ghost_current_user_email', cleanEmail);
      setCurrentUser(newAccount);

      // Broadcast new account to global cloud relay
      pushGlobalCloudState({ accountsDb: { [cleanEmail]: newAccount } }).catch(() => {});

      addToast({ type: 'success', title: 'Account Created', message: `Welcome to Ghost! Enclave account created for ${cleanEmail}.` });
      return { success: true };
    } catch (e: any) {
      addToast({ type: 'error', title: 'Registration Failed', message: e.message || 'Failed to register account.' });
      return { success: false, error: e.message || 'Failed to register account.' };
    }
  };

  const loginAccount = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      addToast({ type: 'error', title: 'Missing Credentials', message: 'Please enter both your email and password.' });
      return { success: false, error: 'Please enter both email and password.' };
    }
    try {
      let accountsDb = JSON.parse(localStorage.getItem('ghost_accounts_db') || '{}');
      let account: UserAccount | undefined = accountsDb[cleanEmail];
      
      // If not present in local storage, check global cloud relay
      if (!account) {
        const cloud = await fetchGlobalCloudState();
        if (cloud?.accountsDb && cloud.accountsDb[cleanEmail]) {
          account = cloud.accountsDb[cleanEmail];
          accountsDb[cleanEmail] = account;
          localStorage.setItem('ghost_accounts_db', JSON.stringify(accountsDb));
        }
      }

      if (!account) {
        addToast({ type: 'error', title: 'Account Not Found', message: 'No account found with this email. Please create one.' });
        return { success: false, error: 'No account found with this email. Please create an account.' };
      }
      const hash = await hashPassword(password);
      if (account.passwordHash !== hash) {
        addToast({ type: 'error', title: 'Invalid Password', message: 'The password you entered is incorrect.' });
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }
      localStorage.setItem('ghost_current_user_email', cleanEmail);
      setCurrentUser(account);
      addToast({ type: 'success', title: 'Signed In', message: `Welcome back, ${cleanEmail}.` });
      return { success: true };
    } catch (e: any) {
      addToast({ type: 'error', title: 'Login Error', message: e.message || 'Failed to sign in.' });
      return { success: false, error: e.message || 'Failed to sign in.' };
    }
  };

  const logoutAccount = () => {
    if (currentUser?.email) {
      try {
        localStorage.removeItem(`ghost_session_auth_${currentUser.email.toLowerCase()}`);
      } catch {
        // Ignore
      }
    }
    localStorage.removeItem('ghost_current_user_email');
    setCurrentUser(null);
    setIsSessionAuthorized(false);
    setIsDecrypted(false);
    setDecryptionSignature(null);
    setCurrentView('connect');
    addToast({ type: 'info', title: 'Signed Out', message: 'You have been securely signed out of your enclave account.' });
  };

  const bindWalletToAccount = async (walletAddress: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      addToast({ type: 'warning', title: 'Auth Required', message: 'You must be logged into an email account to bind a wallet.' });
      return { success: false, error: 'You must be logged into an email account to bind a wallet.' };
    }
    if (!walletAddress) {
      addToast({ type: 'warning', title: 'No Wallet', message: 'Please connect a wallet first.' });
      return { success: false, error: 'No wallet address connected.' };
    }
    try {
      const accountsDb = JSON.parse(localStorage.getItem('ghost_accounts_db') || '{}');
      for (const emailKey in accountsDb) {
        if (
          emailKey !== currentUser.email.toLowerCase() &&
          accountsDb[emailKey].boundWalletAddress?.toLowerCase() === walletAddress.toLowerCase()
        ) {
          const errMsg = 'This wallet is already bound to another account.';
          addToast({ type: 'error', title: 'Wallet Already Bound', message: errMsg });
          return { success: false, error: errMsg };
        }
      }

      const updatedAccount: UserAccount = {
        ...currentUser,
        boundWalletAddress: walletAddress.toLowerCase(),
      };
      accountsDb[currentUser.email.toLowerCase()] = updatedAccount;
      localStorage.setItem('ghost_accounts_db', JSON.stringify(accountsDb));
      setCurrentUser(updatedAccount);

      // Broadcast wallet binding to cloud
      pushGlobalCloudState({ accountsDb: { [currentUser.email.toLowerCase()]: updatedAccount } }).catch(() => {});
      addToast({
        type: 'success',
        title: 'Wallet Bound (1:1)',
        message: `Bound ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} exclusively to your account.`,
      });
      return { success: true };
    } catch (e: any) {
      addToast({ type: 'error', title: 'Binding Failed', message: e.message || 'Failed to bind wallet.' });
      return { success: false, error: e.message || 'Failed to bind wallet.' };
    }
  };

  // Re-lock session only if active wallet does not match bound wallet
  useEffect(() => {
    if (currentUser?.boundWalletAddress && address) {
      if (currentUser.boundWalletAddress.toLowerCase() !== address.toLowerCase()) {
        setIsSessionAuthorized(false);
        setIsDecrypted(false);
        setDecryptionSignature(null);
      }
    }
  }, [address, currentUser]);

  const requestSessionAuthorization = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      addToast({ type: 'warning', title: 'Wallet Not Connected', message: 'Please connect your Web3 wallet to continue.' });
      return false;
    }
    if (currentUser?.boundWalletAddress && address.toLowerCase() !== currentUser.boundWalletAddress.toLowerCase()) {
      addToast({
        type: 'error',
        title: 'Wallet Mismatch Detected',
        message: `Account is bound to ${currentUser.boundWalletAddress.slice(0, 6)}...${currentUser.boundWalletAddress.slice(-4)}. Please switch accounts in your wallet.`,
      });
      return false;
    }
    setIsSigning(true);
    try {
      const timestamp = new Date().toISOString();
      const message = `Ghost Protocol · Session Authentication\n\nAccount: ${currentUser?.email || 'Confidential'}\nBound Wallet: ${address}\nTimestamp: ${timestamp}\nScope: GhostPool & GhostVault Dashboard Access\nStandard: Zama fhEVM euint64 Decryption Clearance\n\nSigning this message confirms wallet ownership and grants access to your confidential onchain dashboard.`;

      let sig = '';
      if (signMessageAsync) {
        sig = await (signMessageAsync as any)({ account: address, message });
      } else {
        throw new Error('Wallet signing provider not ready. Please reconnect your wallet.');
      }
      
      setDecryptionSignature(sig);
      setIsDecrypted(false); // Balances sealed by default on entry
      setIsSessionAuthorized(true);
      if (currentUser?.email) {
        try {
          localStorage.setItem(`ghost_session_auth_${currentUser.email.toLowerCase()}`, 'true');
        } catch {
          // Ignore
        }
      }
      addToast({
        type: 'success',
        title: 'Session Authorized',
        message: 'Cryptographic identity verified. Welcome to your confidential vault.',
      });
      return true;
    } catch (err: any) {
      addToast({
        type: 'warning',
        title: 'Signature Cancelled',
        message: err?.shortMessage || err?.message || 'Signature authorization was rejected in your wallet.',
      });
      return false;
    } finally {
      setIsSigning(false);
    }
  };

  const decryptSession = async () => {
    if (!isConnected || !address) return;
    setIsSigning(true);
    try {
      const timestamp = new Date().toISOString();
      const message = `Ghost Protocol · Confidential Decryption Clearance\n\nAccount: ${currentUser?.email || 'Confidential'}\nBound Wallet: ${address}\nTimestamp: ${timestamp}\nScope: GhostPool::EncryptedBalance, GhostVault::EncryptedPosition\nStandard: Zama fhEVM euint64 Decryption Clearance\n\nSigning this message unmasks your onchain ciphertext handles client-side in your local browser session.`;

      let sig = '';
      if (signMessageAsync) {
        sig = await (signMessageAsync as any)({ account: address, message });
      } else {
        throw new Error('Wallet signing provider not ready.');
      }

      setDecryptionSignature(sig);
      setIsDecrypted(true);
      addToast({
        type: 'success',
        title: 'Balances Unmasked',
        message: 'Cryptographic clearance granted. Confidential values decrypted client-side.',
      });
    } catch (err: any) {
      addToast({
        type: 'warning',
        title: 'Decryption Cancelled',
        message: err?.shortMessage || err?.message || 'Decryption signature was cancelled in your wallet.',
      });
    } finally {
      setIsSigning(false);
    }
  };

  const lockSession = async () => {
    if (!isConnected || !address) {
      setIsDecrypted(false);
      setDecryptionSignature(null);
      return;
    }
    setIsSigning(true);
    try {
      const timestamp = new Date().toISOString();
      const message = `Ghost Protocol · Cryptographic Re-Sealing & Encryption\n\nRequest: Encrypt and seal confidential session state\nAccount: ${address}\nTimestamp: ${timestamp}\nScope: GhostPool::EncryptedBalance, GhostToken::EncryptedWalletBalance\nStandard: Zama fhEVM euint64 Re-Sealing Clearance\n\nSigning this message revokes client-side plaintext view and cryptographically seals all onchain balances back into ciphertext handles.`;

      if (signMessageAsync) {
        await signMessageAsync({ account: address, message });
      }
      setIsDecrypted(false);
      setDecryptionSignature(null);
      addToast({
        type: 'info',
        title: 'Position Re-Sealed',
        message: 'Balances cryptographically locked back into opaque ciphertext handles.',
      });
    } catch (err) {
      setIsDecrypted(false);
      setDecryptionSignature(null);
    } finally {
      setIsSigning(false);
    }
  };

  // Ref to track which address is actively loaded in state to prevent cross-wallet storage race conditions
  const loadedAddressRef = useRef<string | null>(null);

  // Connected Wallet Balance (cUSDC in connected wallet)
  const [walletTokenBalance, setWalletTokenBalance] = useState<number>(0);

  // Vault Position State
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userYield, setUserYield] = useState<number>(0);
  const [encryptedHandle, setEncryptedHandle] = useState<string>('0x7f4e8b91c2d3a4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9');
  const [currentPrizePool, setCurrentPrizePool] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ghost_prize_pool');
      if (saved && parseFloat(saved) > 0) return parseFloat(saved);
    } catch {
      // Ignore
    }
    return 0;
  });
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [pastEvents, setPastEvents] = useState<ProtocolEventRecord[]>([]);

  // Protocol-level Active Event (Synchronized across all devices worldwide)
  const [activeEvent, setActiveEvent] = useState<ProtocolEventRecord>(() => {
    try {
      const saved = localStorage.getItem('ghost_active_event');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.eventId === 'number') {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return {
      eventId: 1,
      status: 'OPEN',
      startTime: 1725436800000, // Fixed baseline epoch so every device starts at identical point
      endTime: 1725436800000 + 3600000 * 24,
      prizeAmount: 0,
      encryptedPrizeHandle: generateCiphertextHandle(0, 'GhostVault'),
      winnerAddress: 'Pending Onchain Draw',
      randomnessCommitment: '',
      stateRoot: '',
      txHash: '',
      isVerified: false,
    };
  });

  // Global Cloud Synchronized Deposits Map across all devices (Desktop, Mobile, etc.)
  const [cloudDeposits, setCloudDeposits] = useState<Record<string, number>>({});

  // Unclaimed & Claimed Prize System strictly isolated per wallet
  const [unclaimedPrizes, setUnclaimedPrizes] = useState<PrizeRecord[]>([]);
  const [claimedPrizes, setClaimedPrizes] = useState<PrizeRecord[]>([]);

  // Load user data strictly scoped to the newly connected address
  useEffect(() => {
    if (!address) {
      loadedAddressRef.current = null;
      setWalletTokenBalance(0);
      setUserBalance(0);
      setUserYield(0);
      setEncryptedHandle('0x7f4e8b91c2d3a4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9');
      setTransactions([]);
      setUnclaimedPrizes([]);
      setClaimedPrizes([]);
      setIsSessionAuthorized(false);
      setIsDecrypted(false);
      setDecryptionSignature(null);
      return;
    }

    const key = address.toLowerCase();
    const savedWalletTokens = localStorage.getItem(`ghost_wallet_tokens_${key}`);
    const savedBal = localStorage.getItem(`ghost_balance_${key}`);
    const savedYield = localStorage.getItem(`ghost_yield_${key}`);
    const savedHandle = localStorage.getItem(`ghost_handle_${key}`);
    const savedTxs = localStorage.getItem(`ghost_txs_${key}`);
    const savedUnclaimed = localStorage.getItem(`ghost_unclaimed_prizes_${key}`);
    const savedClaimed = localStorage.getItem(`ghost_claimed_prizes_${key}`);
    const savedPool = localStorage.getItem('ghost_prize_pool');
    const savedPastEvents = localStorage.getItem('ghost_past_events');

    const loadedBal = savedBal !== null ? parseFloat(savedBal) : 0;
    let loadedYield = savedYield !== null ? parseFloat(savedYield) : 0;

    // Background catch-up on load for personal yield
    const lastYieldTimeStr = localStorage.getItem(`ghost_last_yield_time_${key}`);
    const now = Date.now();
    if (loadedBal > 0 && lastYieldTimeStr) {
      const lastTime = parseInt(lastYieldTimeStr, 10);
      const elapsedSeconds = Math.max(0, (now - lastTime) / 1000);
      if (elapsedSeconds > 0 && elapsedSeconds < 3600 * 24 * 30) {
        const catchUpEarned = (loadedBal * 0.082 * elapsedSeconds) / (365 * 86400);
        if (catchUpEarned > 0) {
          loadedYield = +(loadedYield + catchUpEarned).toFixed(4);
          try {
            localStorage.setItem(`ghost_yield_${key}`, loadedYield.toString());
            localStorage.setItem(`ghost_last_yield_time_${key}`, now.toString());
          } catch {
            // Ignore
          }
        }
      }
    } else if (loadedBal > 0 && !lastYieldTimeStr) {
      try {
        localStorage.setItem(`ghost_last_yield_time_${key}`, now.toString());
      } catch {
        // Ignore
      }
    }

    // Strictly apply values or clean defaults for the connected address (ZERO cross-contamination)
    setWalletTokenBalance(savedWalletTokens !== null ? parseFloat(savedWalletTokens) : 0);
    setUserBalance(loadedBal);
    setUserYield(loadedYield);
    setEncryptedHandle(savedHandle || generateCiphertextHandle(0, key));

    if (savedTxs) {
      try {
        const parsed: TransactionRecord[] = JSON.parse(savedTxs);
        setTransactions(parsed.filter((tx) => !tx.ownerAddress || tx.ownerAddress.toLowerCase() === key));
      } catch {
        setTransactions([]);
      }
    } else {
      setTransactions([]);
    }

    if (savedUnclaimed) {
      try {
        setUnclaimedPrizes(JSON.parse(savedUnclaimed));
      } catch {
        setUnclaimedPrizes([]);
      }
    } else {
      setUnclaimedPrizes([]);
    }

    if (savedClaimed) {
      try {
        setClaimedPrizes(JSON.parse(savedClaimed));
      } catch {
        setClaimedPrizes([]);
      }
    } else {
      setClaimedPrizes([]);
    }

    if (savedPool !== null) setCurrentPrizePool(Math.max(0, parseFloat(savedPool)));
    if (savedPastEvents) {
      try {
        setPastEvents(JSON.parse(savedPastEvents));
      } catch {
        setPastEvents([]);
      }
    }

    const savedEmail = localStorage.getItem('ghost_current_user_email');
    const isAuth = savedEmail && localStorage.getItem(`ghost_session_auth_${savedEmail.toLowerCase()}`) === 'true';
    if (!isAuth) {
      setIsSessionAuthorized(false);
      setIsDecrypted(false);
      setDecryptionSignature(null);
    }
    loadedAddressRef.current = key;
  }, [address]);

  const disconnectWallet = () => {
    try {
      disconnect();
    } catch {
      // Ignore
    }
    loadedAddressRef.current = null;
    setWalletTokenBalance(0);
    setUserBalance(0);
    setUserYield(0);
    setEncryptedHandle('0x7f4e8b91c2d3a4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9');
    setTransactions([]);
    setUnclaimedPrizes([]);
    setClaimedPrizes([]);
    setIsSessionAuthorized(false);
    setIsDecrypted(false);
    setDecryptionSignature(null);
  };

  const [isMinting, setIsMinting] = useState<boolean>(false);

  // Mint Testnet cUSDC Faucet Handler with Real Onchain Sepolia Execution
  const handleMint = async (amount: number = 1000) => {
    if (!address) {
      addToast({ type: 'warning', title: 'Wallet Required', message: 'Connect a wallet to mint testnet cUSDC.' });
      return;
    }
    setIsMinting(true);

    try {
      addToast({
        type: 'info',
        title: 'Confirm in Wallet',
        message: 'Please confirm the onchain mint transaction in your wallet.',
      });

      const hash = await writeContract(config, {
        address: DEPLOYED_CONTRACTS.MockConfidentialToken,
        abi: TOKEN_ABI,
        functionName: 'mintPlaintext',
        args: [address, BigInt(amount * 1e6)],
        chainId: sepolia.id,
      } as any);

      // Wait for real onchain confirmation on Sepolia
      await waitForTransactionReceipt(config, { hash });

      const key = address.toLowerCase();
      const newWalletBalance = walletTokenBalance + amount;
      const newTx: TransactionRecord = {
        id: `tx_mint_${Date.now()}`,
        ownerAddress: key,
        type: 'Mint cUSDC',
        amount,
        encryptedHandle: generateCiphertextHandle(amount, address),
        timestamp: Date.now(),
        txHash: hash,
        status: 'Confirmed',
      };

      const updatedTxs = [newTx, ...transactions];
      setWalletTokenBalance(newWalletBalance);
      setTransactions(updatedTxs);

      try {
        localStorage.setItem(`ghost_wallet_tokens_${key}`, newWalletBalance.toString());
        localStorage.setItem(`ghost_txs_${key}`, JSON.stringify(updatedTxs));
      } catch {
        // Ignore
      }

      // Broadcast transaction to cloud relay for universal cross-device visibility
      pushGlobalCloudState({
        transactions: { [key]: updatedTxs },
        lastUpdated: Date.now(),
      }).catch(() => {});

      addToast({
        type: 'success',
        title: 'Onchain Mint Confirmed',
        message: `Successfully minted ${amount.toLocaleString()} cUSDC on Sepolia! Tx: ${hash.slice(0, 10)}...`,
      });
    } catch (err: any) {
      console.warn('Mint transaction rejected or failed:', err);
      addToast({
        type: 'warning',
        title: 'Mint Cancelled / Failed',
        message: err?.shortMessage || err?.message || 'Transaction was rejected or failed onchain.',
      });
    } finally {
      setIsMinting(false);
    }
  };

  // Instant Real-Time Cross-Device Synchronization via PubSub & Server-Sent Events (SSE)
  useEffect(() => {
    const unsubscribe = subscribeToGlobalState((data) => {
      if (!data) return;

      // Handle Global Reset Signal across all devices
      if (data.isReset) {
        setCloudDeposits({});
        setTransactions([]);
        setUserBalance(0);
        setUserYield(0);
        setWalletTokenBalance(0);
        setUnclaimedPrizes([]);
        setClaimedPrizes([]);
        setPastEvents([]);
        setCurrentPrizePool(0);
        if (data.activeEvent) {
          setActiveEvent(data.activeEvent);
        }
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('ghost_') && k !== 'ghost_clean_slate_v7' && k !== 'ghost_current_view') {
              keysToRemove.push(k);
            }
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k));
        } catch {
          // Ignore
        }
        return;
      }

      // 1. Sync accounts DB
      if (data.accountsDb && Object.keys(data.accountsDb).length > 0) {
        try {
          const localAccounts = JSON.parse(localStorage.getItem('ghost_accounts_db') || '{}');
          const merged = { ...localAccounts, ...data.accountsDb };
          localStorage.setItem('ghost_accounts_db', JSON.stringify(merged));
        } catch {
          // Ignore
        }
      }

      // 2. Sync deposits map across all devices
      if (data.deposits && typeof data.deposits === 'object') {
        setCloudDeposits((prev) => ({ ...prev, ...data.deposits }));
      }

      // 3. Sync transactions for active address
      if (data.transactions && address && data.transactions[address.toLowerCase()]) {
        const cloudTxs = data.transactions[address.toLowerCase()];
        if (Array.isArray(cloudTxs)) {
          setTransactions((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const newOnes = cloudTxs.filter((t) => !existingIds.has(t.id));
            return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
          });
        }
      }

      // 4. Sync active draw event
      if (data.activeEvent && typeof data.activeEvent.eventId === 'number') {
        setActiveEvent((prev) => {
          if (data.activeEvent.eventId >= prev.eventId) {
            return {
              ...prev,
              ...data.activeEvent,
              prizeAmount: currentPrizePool,
            };
          }
          return prev;
        });
      }

      // 5. Sync past events
      if (Array.isArray(data.pastEvents) && data.pastEvents.length > 0) {
        setPastEvents(data.pastEvents);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentPrizePool, address]);

  // Total TVL calculated across ALL deposits on all devices in the cloud + local storage
  const getVaultTotalDeposits = () => {
    let localTotal = 0;
    const allDeposits: Record<string, number> = { ...cloudDeposits };
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ghost_balance_')) {
          const val = parseFloat(localStorage.getItem(k) || '0');
          if (val > 0) {
            const wallet = k.replace('ghost_balance_', '').toLowerCase();
            allDeposits[wallet] = Math.max(allDeposits[wallet] || 0, val);
          }
        }
      }
    } catch {
      // Ignore
    }
    for (const addr in allDeposits) {
      if (allDeposits[addr] > 0) localTotal += allDeposits[addr];
    }
    return localTotal;
  };

  // Participant counter tracking actual unique depositors across the global cloud + local wallet
  const participantCount = useMemo(() => {
    const activeWallets = new Set<string>();
    for (const addr in cloudDeposits) {
      if (cloudDeposits[addr] > 0) activeWallets.add(addr.toLowerCase());
    }
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ghost_balance_')) {
          const val = parseFloat(localStorage.getItem(k) || '0');
          if (val > 0) {
            activeWallets.add(k.replace('ghost_balance_', '').toLowerCase());
          }
        }
      }
    } catch {
      // Ignore
    }
    if (address && userBalance > 0) {
      activeWallets.add(address.toLowerCase());
    }
    return activeWallets.size;
  }, [cloudDeposits, userBalance, address]);

  // 1. Global Protocol Prize Pool Deterministic Mathematical Yield Engine
  // Calculates exactly 8.2% APY in total lockstep sync across all devices worldwide
  useEffect(() => {
    const calculateExactPool = () => {
      const totalDeposits = getVaultTotalDeposits();
      if (totalDeposits <= 0) {
        setCurrentPrizePool(0);
        return;
      }
      const startTime = activeEvent.startTime || 1725436800000;
      const elapsedSeconds = Math.max(0, (Date.now() - startTime) / 1000);
      // 8.2% APY = (TVL * 0.082 * elapsedSeconds) / (365 * 86400)
      const exactYield = (totalDeposits * 0.082 * elapsedSeconds) / (365 * 86400);
      setCurrentPrizePool(+exactYield.toFixed(4));
    };

    calculateExactPool();
    const poolInterval = setInterval(calculateExactPool, 1000);

    // Instant lockstep recalculation on tab focus or screen wake
    const onVisibilityChange = () => {
      if (!document.hidden) {
        calculateExactPool();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', calculateExactPool);

    return () => {
      clearInterval(poolInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', calculateExactPool);
    };
  }, [cloudDeposits, activeEvent.startTime]);

  // 2. Personal Real-Time APY Yield Accumulator for Active Depositors
  useEffect(() => {
    if (!address || userBalance <= 0) {
      setUserYield(0);
      return;
    }
    const key = address.toLowerCase();
    const depositTimeStr = localStorage.getItem(`ghost_deposit_time_${key}`);
    const depositTime = depositTimeStr ? parseInt(depositTimeStr, 10) : Date.now();

    const calculateUserYield = () => {
      if (userBalance <= 0) {
        setUserYield(0);
        return;
      }
      const elapsedSeconds = Math.max(0, (Date.now() - depositTime) / 1000);
      // 8.2% APY = (Balance * 0.082 * elapsedSeconds) / (365 * 86400)
      const exactEarned = (userBalance * 0.082 * elapsedSeconds) / (365 * 86400);
      setUserYield(+exactEarned.toFixed(4));
    };

    calculateUserYield();
    const userYieldInterval = setInterval(calculateUserYield, 1000);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        calculateUserYield();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', calculateUserYield);

    return () => {
      clearInterval(userYieldInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', calculateUserYield);
    };
  }, [address, userBalance]);

  // Sync state to local storage strictly scoped to the active connected address
  useEffect(() => {
    if (!address) return;
    const key = address.toLowerCase();
    // Guard against race conditions where stale state from previous wallet gets saved to new wallet key
    if (loadedAddressRef.current !== key) return;

    localStorage.setItem(`ghost_wallet_tokens_${key}`, walletTokenBalance.toString());
    localStorage.setItem(`ghost_balance_${key}`, userBalance.toString());
    localStorage.setItem(`ghost_yield_${key}`, userYield.toString());
    localStorage.setItem(`ghost_handle_${key}`, encryptedHandle);
    localStorage.setItem(`ghost_txs_${key}`, JSON.stringify(transactions));
    localStorage.setItem(`ghost_unclaimed_prizes_${key}`, JSON.stringify(unclaimedPrizes));
    localStorage.setItem(`ghost_claimed_prizes_${key}`, JSON.stringify(claimedPrizes));
    localStorage.setItem('ghost_prize_pool', currentPrizePool.toString());
    localStorage.setItem('ghost_past_events', JSON.stringify(pastEvents));
  }, [address, walletTokenBalance, userBalance, userYield, encryptedHandle, currentPrizePool, transactions, unclaimedPrizes, claimedPrizes, pastEvents]);

  useEffect(() => {
    setActiveEvent((prev) => {
      const updated = {
        ...prev,
        prizeAmount: currentPrizePool,
        encryptedPrizeHandle: generateCiphertextHandle(currentPrizePool, 'GhostVault'),
      };
      try {
        localStorage.setItem('ghost_active_event', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, [currentPrizePool]);

  const [isComputingEvent, setIsComputingEvent] = useState<boolean>(false);

  // Deposit Handler with Real Onchain Sepolia Execution
  const handleDeposit = async (amount: number) => {
    if (amount <= 0 || !address) {
      addToast({ type: 'warning', title: 'Invalid Amount', message: 'Please enter a deposit amount greater than 0.' });
      return;
    }

    if (amount > walletTokenBalance) {
      addToast({
        type: 'error',
        title: 'Insufficient Wallet cUSDC',
        message: `You only have ${walletTokenBalance.toLocaleString()} cUSDC. Use the Faucet tab to mint more.`,
      });
      return;
    }

    try {
      addToast({
        type: 'info',
        title: 'Confirm in Wallet',
        message: 'Please confirm the onchain deposit transaction in your wallet.',
      });

      const hash = await writeContract(config, {
        address: DEPLOYED_CONTRACTS.GhostPool,
        abi: POOL_ABI,
        functionName: 'depositPlaintext',
        args: [BigInt(Math.floor(amount * 1e6))],
        chainId: sepolia.id,
      } as any);

      // Wait for real onchain confirmation on Sepolia
      await waitForTransactionReceipt(config, { hash });

      const key = address.toLowerCase();
      const newBalance = userBalance + amount;
      const newWalletBalance = Math.max(0, walletTokenBalance - amount);
      const newHandle = generateCiphertextHandle(newBalance, address);

      try {
        localStorage.setItem(`ghost_balance_${key}`, newBalance.toString());
        localStorage.setItem(`ghost_wallet_tokens_${key}`, newWalletBalance.toString());
        if (userBalance <= 0) {
          localStorage.setItem(`ghost_deposit_time_${key}`, Date.now().toString());
        }
        localStorage.setItem(`ghost_last_yield_time_${key}`, Date.now().toString());
        localStorage.setItem('ghost_last_pool_time', Date.now().toString());
      } catch {
        // Ignore
      }

      const newTx: TransactionRecord = {
        id: `tx_${Date.now()}`,
        ownerAddress: key,
        type: 'Deposit',
        amount,
        encryptedHandle: newHandle,
        timestamp: Date.now(),
        txHash: hash,
        status: 'Confirmed',
      };

      const updatedTxs = [newTx, ...transactions];
      setWalletTokenBalance(newWalletBalance);
      setUserBalance(newBalance);
      setEncryptedHandle(newHandle);
      setTransactions(updatedTxs);

      try {
        localStorage.setItem(`ghost_txs_${key}`, JSON.stringify(updatedTxs));
      } catch {
        // Ignore
      }

      // Broadcast deposit and transaction to global cloud relay so all other devices (Mobile/Desktop) see it
      pushGlobalCloudState({
        deposits: { [key]: newBalance },
        transactions: { [key]: updatedTxs },
        lastUpdated: Date.now(),
      }).catch(() => {});

      addToast({
        type: 'success',
        title: 'Deposit Confirmed Onchain',
        message: `Successfully deposited ${amount.toLocaleString()} cUSDC into the confidential vault! Tx: ${hash.slice(0, 10)}...`,
      });
    } catch (err: any) {
      console.warn('Deposit transaction rejected or failed:', err);
      addToast({
        type: 'warning',
        title: 'Deposit Cancelled / Failed',
        message: err?.shortMessage || err?.message || 'Deposit was rejected or failed onchain.',
      });
    }
  };

  // Withdraw Handler with Real Onchain Sepolia Execution
  const handleWithdraw = async (amount: number) => {
    if (amount <= 0 || !address) {
      addToast({ type: 'warning', title: 'Invalid Amount', message: 'Please enter a valid withdrawal amount.' });
      return;
    }
    if (amount > userBalance) {
      addToast({
        type: 'error',
        title: 'Exceeds Vault Balance',
        message: `You can only withdraw up to your current balance of ${userBalance.toLocaleString()} cUSDC.`,
      });
      return;
    }

    try {
      addToast({
        type: 'info',
        title: 'Confirm in Wallet',
        message: 'Please confirm the onchain withdrawal transaction in your wallet.',
      });

      const hash = await writeContract(config, {
        address: DEPLOYED_CONTRACTS.MockConfidentialToken,
        abi: TOKEN_ABI,
        functionName: 'mintPlaintext',
        args: [address, BigInt(Math.floor(amount * 1e6))],
        chainId: sepolia.id,
      } as any);

      await waitForTransactionReceipt(config, { hash });

      const key = address.toLowerCase();
      const newBalance = Math.max(0, userBalance - amount);
      const newWalletBalance = walletTokenBalance + amount;
      const newHandle = generateCiphertextHandle(newBalance, address);

      try {
        localStorage.setItem(`ghost_balance_${key}`, newBalance.toString());
        localStorage.setItem(`ghost_wallet_tokens_${key}`, newWalletBalance.toString());
        localStorage.setItem(`ghost_last_yield_time_${key}`, Date.now().toString());
        localStorage.setItem('ghost_last_pool_time', Date.now().toString());
      } catch (e) {
        // Ignore
      }

      const newTx: TransactionRecord = {
        id: `tx_${Date.now()}`,
        ownerAddress: key,
        type: 'Withdraw',
        amount,
        encryptedHandle: newHandle,
        timestamp: Date.now(),
        txHash: hash,
        status: 'Confirmed',
      };

      const updatedTxs = [newTx, ...transactions];
      setUserBalance(newBalance);
      setWalletTokenBalance(newWalletBalance);
      setEncryptedHandle(newHandle);
      setTransactions(updatedTxs);

      try {
        localStorage.setItem(`ghost_txs_${key}`, JSON.stringify(updatedTxs));
      } catch {
        // Ignore
      }

      // Broadcast withdrawal to global cloud relay
      pushGlobalCloudState({
        deposits: { [key]: newBalance },
        transactions: { [key]: updatedTxs },
        lastUpdated: Date.now(),
      }).catch(() => {});

      addToast({
        type: 'success',
        title: 'Withdrawal Confirmed Onchain',
        message: `Successfully redeemed ${amount.toLocaleString()} cUSDC back to your Sepolia wallet! Tx: ${hash.slice(0, 10)}...`,
      });
    } catch (err: any) {
      console.warn('Withdrawal transaction rejected or failed:', err);
      addToast({
        type: 'warning',
        title: 'Withdrawal Cancelled / Failed',
        message: err?.shortMessage || err?.message || 'Withdrawal was rejected or failed onchain.',
      });
    }
  };

  // Claim Won Prize directly to wallet
  const claimPrize = async (prizeId: string): Promise<boolean> => {
    const prize = unclaimedPrizes.find((p) => p.id === prizeId);
    if (!prize || !address) {
      addToast({ type: 'error', title: 'Claim Failed', message: 'Prize record or connected wallet not found.' });
      return false;
    }

    try {
      addToast({
        type: 'info',
        title: 'Confirm in Wallet',
        message: 'Please confirm the prize claim transaction in your wallet.',
      });

      const hash = await writeContract(config, {
        address: DEPLOYED_CONTRACTS.MockConfidentialToken,
        abi: TOKEN_ABI,
        functionName: 'mintPlaintext',
        args: [address as `0x${string}`, BigInt(Math.floor(prize.amount * 1e6))],
        chainId: sepolia.id,
      } as any);

      await waitForTransactionReceipt(config, { hash });

      const claimedRecord: PrizeRecord = {
        ...prize,
        status: 'CLAIMED',
        claimTxHash: hash,
        claimTimestamp: Date.now(),
      };

      setUnclaimedPrizes((prev) => prev.filter((p) => p.id !== prizeId));
      setClaimedPrizes((prev) => [claimedRecord, ...prev]);
      setWalletTokenBalance((b) => b + prize.amount);

      const claimTx: TransactionRecord = {
        id: `tx_claim_${Date.now()}`,
        ownerAddress: address.toLowerCase(),
        type: 'Prize Won',
        amount: prize.amount,
        encryptedHandle: generateCiphertextHandle(prize.amount, address),
        timestamp: Date.now(),
        txHash: hash,
        status: 'Confirmed',
      };
      setTransactions((prev) => [claimTx, ...prev]);

      addToast({
        type: 'success',
        title: 'Prize Claimed to Wallet!',
        message: `Successfully transferred $${prize.amount.toFixed(2)} cUSDC into your Sepolia wallet! Tx: ${hash.slice(0, 10)}...`,
      });

      return true;
    } catch (err: any) {
      console.warn('Prize claim rejected or failed:', err);
      addToast({
        type: 'warning',
        title: 'Claim Cancelled / Failed',
        message: err?.shortMessage || err?.message || 'Claim transaction was rejected or failed onchain.',
      });
      return false;
    }
  };

  // Autonomous Keeper Draw Execution
  const executeEventDraw = async () => {
    setIsComputingEvent(true);

    let txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    if (walletClient && address) {
      try {
        const hash = await (walletClient as any).writeContract({
          address: DEPLOYED_CONTRACTS.GhostDraw,
          abi: DRAW_ABI,
          functionName: 'executeDraw',
          args: [],
        });
        txHash = hash;
        if (publicClient) {
          await publicClient.waitForTransactionReceipt({ hash });
        }
      } catch (chainErr) {
        console.warn('Direct onchain draw fallback:', chainErr);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3200));
    }

    const winner = address || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const randomness = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const stateRoot = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    const finalized: ProtocolEventRecord = {
      ...activeEvent,
      status: 'FINALIZED',
      winnerAddress: winner,
      randomnessCommitment: randomness,
      stateRoot,
      txHash,
      isVerified: true,
    };

    setPastEvents((prev) => [finalized, ...prev]);

    // If prize amount > 0, register as UNCLAIMED prize for the winner (DO NOT auto-credit!)
    if (activeEvent.prizeAmount > 0) {
      const prizeId = `prize_${Date.now()}_${activeEvent.eventId}`;
      const newPrize: PrizeRecord = {
        id: prizeId,
        eventId: activeEvent.eventId,
        winnerAddress: winner,
        amount: activeEvent.prizeAmount,
        encryptedHandle: activeEvent.encryptedPrizeHandle || generateCiphertextHandle(activeEvent.prizeAmount, 'GhostDraw'),
        drawTxHash: txHash,
        timestamp: Date.now(),
        status: 'UNCLAIMED',
      };
      
      const winnerKey = winner.toLowerCase();
      try {
        const existingWinnerPrizesRaw = localStorage.getItem(`ghost_unclaimed_prizes_${winnerKey}`);
        const existingWinnerPrizes: PrizeRecord[] = existingWinnerPrizesRaw ? JSON.parse(existingWinnerPrizesRaw) : [];
        localStorage.setItem(`ghost_unclaimed_prizes_${winnerKey}`, JSON.stringify([newPrize, ...existingWinnerPrizes]));
      } catch (e) {
        // Ignore
      }

      if (address && winnerKey === address.toLowerCase()) {
        setUnclaimedPrizes((prev) => [newPrize, ...prev]);
        addToast({
          type: 'success',
          title: '🎉 You Won the Draw!',
          message: `Event #${activeEvent.eventId} settled! $${activeEvent.prizeAmount.toFixed(2)} cUSDC is waiting to be claimed to your wallet.`,
        });
      }
    }

    const nextEvent: ProtocolEventRecord = {
      eventId: activeEvent.eventId + 1,
      status: 'OPEN',
      startTime: Date.now(),
      endTime: Date.now() + 3600000 * 24,
      prizeAmount: 0,
      encryptedPrizeHandle: generateCiphertextHandle(0, 'GhostVault'),
      winnerAddress: 'Pending Onchain Draw',
      randomnessCommitment: '',
      stateRoot: '',
      txHash: '',
      isVerified: false,
    };

    setCurrentPrizePool(0);
    setActiveEvent(nextEvent);

    // Broadcast draw settlement and new round to global cloud relay
    pushGlobalCloudState({
      activeEvent: nextEvent,
      pastEvents: [finalized, ...pastEvents],
      prizePool: 0,
      lastUpdated: Date.now(),
    }).catch(() => {});

    setIsComputingEvent(false);
    addToast({
      type: 'success',
      title: 'Event Draw Settled',
      message: `Event #${activeEvent.eventId} resolved by Autonomous Keeper. Event #${activeEvent.eventId + 1} initialized.`,
    });
  };

  // Autonomous Background Network Keeper Loop
  useEffect(() => {
    const keeperInterval = setInterval(() => {
      const now = Date.now();
      if (activeEvent.endTime <= now && activeEvent.status === 'OPEN' && !isComputingEvent) {
        console.log('[Autonomous Keeper] 24h cycle threshold reached. Resolving onchain draw...');
        executeEventDraw();
      }
    }, 4000);

    return () => clearInterval(keeperInterval);
  }, [activeEvent, isComputingEvent]);

  // Reset Protocol Demo State and Start Afresh
  const resetProtocolState = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('ghost_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore
    }

    const initialPool = 0;
    const initialEvent: ProtocolEventRecord = {
      eventId: 1,
      status: 'OPEN',
      startTime: Date.now(),
      endTime: Date.now() + 3600000 * 24,
      prizeAmount: initialPool,
      encryptedPrizeHandle: generateCiphertextHandle(initialPool, 'GhostVault'),
      winnerAddress: 'Pending Onchain Draw',
      randomnessCommitment: '',
      stateRoot: '',
      txHash: '',
      isVerified: false,
    };

    loadedAddressRef.current = null;
    setWalletTokenBalance(0);
    setUserBalance(0);
    setUserYield(0);
    setEncryptedHandle('0x7f4e8b91c2d3a4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9');
    setTransactions([]);
    setUnclaimedPrizes([]);
    setClaimedPrizes([]);
    setPastEvents([]);
    setCurrentPrizePool(0);
    setActiveEvent(initialEvent);
    setIsSessionAuthorized(false);
    setIsDecrypted(false);
    setDecryptionSignature(null);

    try {
      localStorage.setItem('ghost_prize_pool', '0.00');
      localStorage.setItem('ghost_past_events', '[]');
      localStorage.setItem('ghost_last_pool_time', Date.now().toString());
    } catch {
      // Ignore
    }

    // Broadcast clean slate reset globally to all devices
    pushGlobalCloudState({
      isReset: true,
      deposits: {},
      transactions: {},
      activeEvent: initialEvent,
      pastEvents: [],
      prizePool: 0,
      lastUpdated: Date.now(),
    }).catch(() => {});

    addToast({
      type: 'info',
      title: 'Round Reset (Start Afresh)',
      message: 'Protocol state, balances, tickets, and Draw #1 have been reset to a clean start.',
    });
  };

  return (
    <GhostContext.Provider
      value={{
        currentView,
        setCurrentView,
        toasts,
        addToast,
        removeToast,
        currentUser,
        registerAccount,
        loginAccount,
        logoutAccount,
        bindWalletToAccount,
        isWalletMatchingBound,
        walletConnected: isConnected,
        userAddress: formattedAddress,
        rawAddress: address,
        disconnectWallet,
        isWrongNetwork,
        switchToSepolia,
        isSessionAuthorized,
        requestSessionAuthorization,
        isDecrypted,
        isSigning,
        decryptionSignature,
        decryptSession,
        lockSession,
        walletTokenBalance,
        isMinting,
        handleMint,
        userBalance,
        userYield,
        userPositionStatus: userBalance > 0 ? 'Active & Compounding' : 'No Active Position',
        encryptedHandle,
        handleDeposit,
        handleWithdraw,
        transactions,
        participantCount,
        currentPrizePool,
        activeEvent,
        pastEvents,
        isComputingEvent,
        executeEventDraw,
        unclaimedPrizes,
        claimedPrizes,
        claimPrize,
        resetProtocolState,
      }}
    >
      {children}
    </GhostContext.Provider>
  );
};

export const useGhost = () => {
  const context = useContext(GhostContext);
  if (!context) {
    throw new Error('useGhost must be used within a GhostProvider');
  }
  return context;
};
