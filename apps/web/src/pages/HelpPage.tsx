import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useGhost } from '../context/GhostContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const HelpPage: React.FC = () => {
  const { setCurrentView } = useGhost();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FAQItem[] = [
    {
      category: 'Privacy',
      question: 'How does Ghost keep balances completely private?',
      answer: 'Ghost utilizes Torus Fully Homomorphic Encryption (FHE). When you deposit funds, your device encrypts the balance client-side into an euint64 ciphertext. The smart contracts compute additions, yield accrual, and lottery weights directly on the ciphertext without ever decrypting it onchain.',
    },
    {
      category: 'Privacy',
      question: 'Can bots front-run or spy on my transactions?',
      answer: 'No. Because all transaction parameters and state changes are opaque 32-byte ciphertext handles, MEV bots and node operators see zero plaintext numbers. There is no information to extract or front-run.',
    },
    {
      category: 'Security',
      question: 'Who can decrypt my funds?',
      answer: 'Only you. Under the Zama Access Control List (ACL), only the depositor wallet address holds decryption authorization (FHE.allow). Your balance is decrypted seamlessly in your browser when you connect.',
    },
    {
      category: 'Draws',
      question: 'How does the confidential prize draw select a winner fairly?',
      answer: 'GhostDraw requests verifiable onchain randomness via Zama FHE.randEuint64(). The contract compares encrypted random entropy against participant ticket weights homomorphically, awarding the prize to the matching ticket holder while keeping non-winning balances private.',
    },
    {
      category: 'Security',
      question: 'Is Ghost non-custodial?',
      answer: 'Yes. You retain full cryptographic control over your principal. You can withdraw your confidential funds at any time directly through GhostPool without requiring permission from protocol administrators.',
    },
  ];

  const categories = ['All', 'Privacy', 'Security', 'Draws'];

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter((f) => f.category === selectedCategory);

  return (
    <div className="w-full min-h-screen bg-white text-zinc-900 pt-28 pb-20 px-6 sm:px-12 lg:px-20 selection:bg-zinc-200">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-zinc-200 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
              Help Center & FAQ
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Frequently asked questions about Ghost's confidential prize savings protocol.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3 mb-12">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-zinc-200/80 bg-zinc-50 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-zinc-900 text-sm sm:text-base hover:bg-zinc-100/50 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 p-1 rounded-full bg-zinc-200 text-zinc-700">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200/60 mt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="bg-black text-white rounded-3xl p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div>
            <h3 className="font-bold text-lg text-white mb-1">
              Ready to save confidentially?
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md">
              Launch the vault to connect your wallet, deposit testnet assets, and enter prize draws.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('dashboard')}
            className="btn-pill-white px-6 py-3 text-xs font-semibold flex items-center gap-2 shrink-0 shadow-md"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
