import React from 'react';
import { useGhost } from '../context/GhostContext';
import { GhostLogo } from './GhostLogo';
import { ExternalLink, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useGhost();

  return (
    <footer className="relative w-full bg-zinc-50 border-t border-zinc-200 text-zinc-600 pt-16 pb-12 px-6 sm:px-12 lg:px-20 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-zinc-200 text-xs">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/assets/ghost-logo-lockup-black.png"
                  alt="Ghost"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-zinc-500 text-xs max-w-sm leading-relaxed mb-4">
                Confidential onchain savings protocol powered by Zama FHE. Private money. Verifiable outcomes.
              </p>
            </div>

            <div className="text-zinc-400 text-[11px] font-mono">
              Ethereum Sepolia · Zama fhEVM
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-3 gap-6">
            
            <div>
              <div className="font-semibold text-zinc-900 mb-3 uppercase tracking-wider text-[11px]">
                Protocol
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('vault');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black transition-colors"
                  >
                    Vault
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('activity');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black transition-colors"
                  >
                    Activity
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('events');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black transition-colors"
                  >
                    Events
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('verify');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black transition-colors"
                  >
                    Verify
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-zinc-900 mb-3 uppercase tracking-wider text-[11px]">
                Information
              </div>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('how-it-works');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black transition-colors"
                  >
                    How Ghost Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('security');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black transition-colors"
                  >
                    Security
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('contracts');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-black transition-colors"
                  >
                    Contracts
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-zinc-900 mb-3 uppercase tracking-wider text-[11px]">
                Development
              </div>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/2tynm/ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black transition-colors flex items-center gap-1"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.zama.ai/fhevm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black transition-colors flex items-center gap-1"
                  >
                    <span>Zama fhEVM Docs</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © {new Date().getFullYear()} Ghost. Built for Zama Developer Program Mainnet Season 4.
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-zinc-500" />
            <span>Private by default. Encrypted by construction.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
