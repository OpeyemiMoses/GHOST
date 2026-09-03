import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, Search, ChevronDown, ChevronUp, ArrowRight, BookOpen, 
  AlertCircle, CheckCircle2, Shield, Lock, Wallet, Coins, RefreshCw, 
  ExternalLink, KeyRound, ArrowLeft
} from 'lucide-react';
import { useGhost } from '../context/GhostContext';

interface HelpArticle {
  id: string;
  category: string;
  question: string;
  summary: string;
  problem?: string;
  seeing?: string;
  why?: string;
  check?: string[];
  resolve?: string[];
  links?: { title: string; view: string }[];
}

export const HelpPage: React.FC = () => {
  const { setCurrentView } = useGhost();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openArticleId, setOpenArticleId] = useState<string | null>('get-1');

  const categories = [
    'All',
    'Getting Started',
    'Vault',
    'Deposits',
    'Withdrawals',
    'Privacy',
    'Events',
    'Transactions',
    'Wallet & Network',
    'Troubleshooting',
    'Security',
    'Account & Access'
  ];

  const articles: HelpArticle[] = [
    // 1. GETTING STARTED
    {
      id: 'get-1',
      category: 'Getting Started',
      question: 'What is Ghost and how does it work?',
      summary: 'Ghost is a zero-loss confidential savings protocol on Ethereum Sepolia powered by Zama Fully Homomorphic Encryption.',
      why: 'Traditional DeFi savings expose balances in plaintext ERC-20 transfer logs. Ghost computes yield and prize distributions over encrypted integers without exposing your net worth.',
      resolve: [
        'Connect your Web3 wallet (MetaMask, Rainbow, Coinbase Wallet) to Ethereum Sepolia.',
        'Authorize the confidential session via a cryptographic signature request.',
        'Mint testnet cUSDC tokens from the Faucet and deposit into the Vault.',
        'Your deposit continuously earns savings yield and enters zero-loss prize draw cycles.'
      ]
    },
    {
      id: 'get-2',
      category: 'Getting Started',
      question: 'How do I connect my wallet to Ethereum Sepolia?',
      summary: 'Connect using any standard EVM browser extension or mobile wallet.',
      resolve: [
        'Click the "Connect Wallet" button in the top navigation or sidebar.',
        'Select your wallet provider from the RainbowKit modal.',
        'If prompted, switch your network to Ethereum Sepolia (Chain ID: 11155111).',
        'Sign the session authentication message to enter your confidential dashboard.'
      ]
    },
    {
      id: 'get-3',
      category: 'Getting Started',
      question: 'What do I need before using Ghost?',
      summary: 'You only need a Web3 wallet with a small amount of Sepolia ETH for gas.',
      resolve: [
        'A small amount of Sepolia ETH for network gas fees.',
        'Testnet cUSDC tokens (available free on-demand from the built-in Ghost Faucet in the Vault page).'
      ]
    },

    // 2. VAULT
    {
      id: 'vault-1',
      category: 'Vault',
      question: 'Why is my financial state confidential, and why is there no "Hide/Reveal Balance" button?',
      summary: 'Ghost\'s privacy model is architectural by construction, not a cosmetic UI toggle.',
      why: 'In Ghost, privacy is not achieved by blurring HTML text. Your balance is stored as an encrypted euint64 ciphertext handle directly on the Sepolia blockchain. It can only be mathematically unmasked in your browser when you cryptographically sign a decryption clearance ticket.',
      resolve: [
        'To unmask your balance client-side: Click "Decrypt Balance with Wallet Signature".',
        'To re-seal your balance into ciphertext: Click "Sign to Lock & Encrypt".'
      ]
    },
    {
      id: 'vault-2',
      category: 'Vault',
      question: 'Why isn\'t my balance visible on the block explorer (Etherscan)?',
      summary: 'Public block explorers only see 32-byte ciphertext handle pointers, not dollar amounts.',
      why: 'Ghost contracts store euint64 handles rather than plaintext uint256 numbers. When Etherscan reads contract storage, it reads encrypted bytes which are mathematically unintelligible to anyone without your private key.',
      resolve: [
        'View your decrypted balance inside the Ghost web application after signing the clearance request.',
        'Inspect the contract on Etherscan to verify that no plaintext numbers are emitted in event logs.'
      ]
    },

    // 3. DEPOSITS
    {
      id: 'dep-1',
      category: 'Deposits',
      question: 'How do I deposit funds into the Vault?',
      summary: 'Step-by-step guide to encrypting and depositing testnet cUSDC.',
      resolve: [
        'Navigate to the Vault page.',
        'Ensure you have cUSDC tokens in your wallet (mint from the Faucet tab if needed).',
        'Enter the amount you wish to deposit in the Deposit form.',
        'Click "Deposit Encrypted cUSDC" and confirm the transaction in your wallet.'
      ]
    },
    {
      id: 'dep-2',
      category: 'Deposits',
      question: 'My transaction succeeded on Etherscan but my Vault hasn\'t updated. What should I do?',
      summary: 'How to refresh and resync your confidential onchain state.',
      problem: 'Transaction confirmed onchain, but UI shows previous balance.',
      why: 'Network RPC indexing delays on Sepolia can occasionally take a few seconds to propagate newly updated ciphertext handles.',
      check: [
        'Check your transaction hash on Sepolia Etherscan to ensure status is Success.',
        'Verify your wallet is still connected to the same account.'
      ],
      resolve: [
        'Wait 5–10 seconds for the next Sepolia block confirmation.',
        'Click the Decrypt button or switch tabs to re-trigger state synchronization.'
      ]
    },

    // 4. WITHDRAWALS
    {
      id: 'with-1',
      category: 'Withdrawals',
      question: 'How do I withdraw my deposited principal?',
      summary: 'Withdraw 100% of your funds instantly with zero penalties.',
      resolve: [
        'Go to the Vault page and select the "Withdraw" tab in the action box.',
        'Enter the amount of cUSDC you wish to withdraw (or click Max).',
        'Click "Withdraw to Wallet" and confirm the onchain transaction in your wallet.',
        'Your principal is transferred back to your wallet and updated in your confidential balance.'
      ]
    },
    {
      id: 'with-2',
      category: 'Withdrawals',
      question: 'Why did my withdrawal fail or revert?',
      summary: 'Common causes for withdrawal rejections on Sepolia.',
      why: 'The smart contract enforces strict non-custodial balance checks. If the requested withdrawal amount exceeds your encrypted balance handle or if your wallet runs out of gas, the transaction reverts.',
      resolve: [
        'Verify that your withdrawal amount is less than or equal to your decrypted Vault balance.',
        'Ensure you have sufficient Sepolia ETH in your wallet to cover gas.',
        'Retry the withdrawal with default gas settings.'
      ]
    },

    // 5. PRIVACY
    {
      id: 'priv-1',
      category: 'Privacy',
      question: 'What does Ghost keep private vs. what remains public?',
      summary: 'Explicit breakdown of onchain confidential state vs. transparent metadata.',
      resolve: [
        'WHAT GHOST PROTECTS (Confidential): Financial balance, deposit/withdrawal amounts, yield accrual shares, lottery tickets, and private draw payouts.',
        'WHAT REMAINS PUBLIC (Blockchain Metadata): Your wallet address, transaction existence, block number, gas spent, and public verification state roots.'
      ]
    },
    {
      id: 'priv-2',
      category: 'Privacy',
      question: 'Can Ghost team members or validators see my balance?',
      summary: 'No. Decryption keys are mathematically exclusive to your wallet.',
      why: 'Ghost operates on Zama\'s fhEVM Access Control List (ACL). Decryption requires a cryptographic signature matching the exact msg.sender holding authorization. Neither node operators, validators, nor protocol developers possess the keys to decrypt your balance.'
    },

    // 6. EVENTS
    {
      id: 'ev-1',
      category: 'Events',
      question: 'What are Ghost Events and how does the prize draw work?',
      summary: 'Zero-loss prize distributions funded entirely by collective pool savings yield.',
      why: 'Unlike traditional lotteries where participant principal is wagered and lost, Ghost pools the yield generated by deposits. Your principal is 100% safe. Periodic draws evaluate encrypted odds homomorphically and dispatch the accumulated prize yield to the winner.'
    },
    {
      id: 'ev-2',
      category: 'Events',
      question: 'How do I verify an Event draw outcome independently?',
      summary: 'Verify Merkle state roots and randomness commitments on the Verify page.',
      resolve: [
        'Navigate to the Verify page in the sidebar.',
        'Inspect the Randomness Commitment hash and Verified State Root for the completed event cycle.',
        'Verify the transaction hash directly on Sepolia Etherscan.'
      ]
    },

    // 7. TRANSACTIONS
    {
      id: 'tx-1',
      category: 'Transactions',
      question: 'What do transaction statuses mean (Pending, Confirmed, Failed)?',
      summary: 'Understanding transaction lifecycle indicators.',
      resolve: [
        'Pending: The transaction has been broadcast to the Sepolia mempool and is awaiting inclusion in a block.',
        'Confirmed: The transaction has been finalized in an Ethereum Sepolia block with verifiable state update.',
        'Failed / Reverted: The transaction was rejected due to gas exhaustion, user rejection, or contract constraint violation.'
      ]
    },

    // 8. WALLET & NETWORK
    {
      id: 'wal-1',
      category: 'Wallet & Network',
      question: 'Why does Ghost say I am on the wrong network?',
      summary: 'Ghost currently operates on Ethereum Sepolia (Chain ID: 11155111).',
      resolve: [
        'Open your wallet extension (MetaMask / Rainbow).',
        'Switch your active network to "Sepolia" or "Sepolia Testnet".',
        'If Sepolia is not listed, enable test networks in your wallet settings.'
      ]
    },

    // 9. TROUBLESHOOTING
    {
      id: 'tb-1',
      category: 'Troubleshooting',
      question: 'My wallet rejected the signature request. How do I re-authenticate?',
      summary: 'Resolution steps when a cryptographic signature request is cancelled.',
      problem: 'Signature rejected error in console or dashboard remains locked.',
      why: 'Ghost requires an on-demand cryptographic signature to unmask your onchain ciphertext handles. If you click Cancel in your wallet, the session remains safely sealed.',
      resolve: [
        'Click the "Decrypt Balance with Wallet Signature" or "Authorize Decryption" button in the Vault or Activity page.',
        'Confirm the signature request in the wallet pop-up window.'
      ]
    },
    {
      id: 'tb-2',
      category: 'Troubleshooting',
      question: 'Transaction stuck or taking a long time to confirm on Sepolia.',
      summary: 'How to speed up or clear a stuck Ethereum testnet transaction.',
      resolve: [
        'Check Sepolia network congestion on Etherscan Gas Tracker.',
        'Use the "Speed Up" feature in MetaMask to increase the gas priority fee.',
        'Ensure you have sufficient Sepolia ETH balance in your wallet.'
      ]
    },

    // 10. SECURITY
    {
      id: 'sec-1',
      category: 'Security',
      question: 'How does Ghost protect against reentrancy and unauthorized withdrawals?',
      summary: 'Smart contract security architecture and invariant verification.',
      why: 'All vault and pool contracts implement OpenZeppelin ReentrancyGuard, strict Checks-Effects-Interactions patterns, and Zama FHE input verification proofs.'
    },

    // 11. ACCOUNT & ACCESS
    {
      id: 'acc-1',
      category: 'Account & Access',
      question: 'How does Ghost isolate data when I switch between multiple wallets?',
      summary: 'Address-isolated ledger architecture.',
      why: 'Ghost scopes all balances, decrypted session keys, and transaction ledgers strictly to the active lowercase wallet address (0x...). Switching wallets immediately unloads the previous account state and prompts fresh authentication for the newly connected address.'
    }
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() || 
        art.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-zinc-900 pb-28 pt-20 px-4 sm:px-8 lg:px-12 selection:bg-zinc-200">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-600 font-semibold uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-900" />
            <span>Ghost Help Centre</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            What do you need help with?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Practical troubleshooting guides, step-by-step solutions, and diagnostic workflows.
          </p>

          {/* Search Bar */}
          <div className="pt-2 relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search troubleshooting articles (e.g. 'deposit failed', 'why no hide button', 'wrong network')..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Accordion List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 px-1 pb-1">
            <span>Showing {filteredArticles.length} troubleshooting guides</span>
            <span>Category: {selectedCategory}</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center bg-white border border-zinc-200 rounded-3xl space-y-2 text-xs text-zinc-500">
              <AlertCircle className="w-6 h-6 text-zinc-400 mx-auto" />
              <div className="font-semibold text-zinc-900">No matching articles found</div>
              <p>Try searching for different keywords or select "All" categories.</p>
            </div>
          ) : (
            filteredArticles.map((art) => {
              const isOpen = openArticleId === art.id;

              return (
                <div
                  key={art.id}
                  className="bg-white border border-zinc-200/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenArticleId(isOpen ? null : art.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 font-semibold text-zinc-900 text-xs sm:text-sm hover:bg-zinc-50/50 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200/60 font-medium">
                          {art.category}
                        </span>
                      </div>
                      <div className="text-zinc-950 font-bold sm:text-base">{art.question}</div>
                      <div className="text-zinc-500 text-xs font-normal">{art.summary}</div>
                    </div>

                    <span className="shrink-0 p-1.5 rounded-full bg-zinc-100 text-zinc-600 mt-1">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-100 text-xs text-zinc-600 space-y-4">
                      {art.problem && (
                        <div className="p-3 bg-red-50/60 border border-red-200/60 rounded-xl space-y-1 text-red-900">
                          <div className="font-bold text-[11px] uppercase">Problem Diagnosis</div>
                          <div>{art.problem}</div>
                        </div>
                      )}

                      {art.why && (
                        <div className="space-y-1">
                          <div className="font-bold text-zinc-900">Why this happens:</div>
                          <p className="leading-relaxed text-zinc-600">{art.why}</p>
                        </div>
                      )}

                      {art.check && (
                        <div className="space-y-1.5">
                          <div className="font-bold text-zinc-900">What to check:</div>
                          <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                            {art.check.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {art.resolve && (
                        <div className="space-y-1.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                          <div className="font-bold text-zinc-950 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>How to resolve it:</span>
                          </div>
                          <ol className="list-decimal pl-5 space-y-1.5 text-zinc-700 font-medium">
                            {art.resolve.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Cross-link to Technical Docs */}
        <div className="p-6 sm:p-8 bg-zinc-900 text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-base text-white">Looking for technical protocol specifications?</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Explore smart contract references, Zama FHE architecture, and developer quickstarts in the Docs.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('docs')}
            className="btn-pill-primary text-xs font-semibold px-5 py-2.5 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Open Protocol Docs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
