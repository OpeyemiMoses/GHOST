import React, { useState } from 'react';
import { useGhost } from '../context/GhostContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  LayoutDashboard,
  Vault, 
  Activity, 
  Trophy, 
  ShieldCheck, 
  HelpCircle, 
  Shield, 
  FileCode,
  ArrowLeft,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Check,
  Settings,
  Flame,
  Radio
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, isDecrypted } = useGhost();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const navItems = [
    { id: 'vault', label: 'Overview', icon: LayoutDashboard },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'events', label: 'Events & Draws', icon: Trophy },
    { id: 'verify', label: 'Verify State', icon: ShieldCheck },
    { id: 'contracts', label: 'Contracts', icon: FileCode },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'how-it-works', label: 'Architecture', icon: HelpCircle },
  ];

  return (
    <aside
      className={`relative sticky top-2 sm:top-3 h-[calc(100vh-16px)] sm:h-[calc(100vh-24px)] bg-[#0c0c0e] text-white rounded-3xl border border-zinc-800/80 flex flex-col justify-between shrink-0 select-none transition-all duration-300 z-30 shadow-xl ${
        collapsed ? 'w-16 p-2.5' : 'w-56 p-4'
      }`}
    >
      {/* Collapse / Expand Toggle Button on Edge */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-40 cursor-pointer"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top Section */}
      <div>
        
        {/* Brand Header */}
        <div className={`flex items-center pb-4 mb-4 border-b border-zinc-800/80 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer overflow-hidden"
            title="Ghost"
          >
            {collapsed ? (
              <img
                src="/assets/ghost-emblem-white.png"
                alt="Ghost Emblem"
                className="h-7 w-7 object-contain mx-auto group-hover:scale-105 transition-transform"
              />
            ) : (
              <img
                src="/assets/ghost-logo-lockup-white.png"
                alt="Ghost"
                className="h-7 w-auto object-contain group-hover:scale-102 transition-transform"
              />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'vault' && currentView === 'dashboard');

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-850 text-white font-semibold shadow-xs border border-zinc-750'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                } ${collapsed ? 'justify-center px-0' : 'justify-between'}`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </div>

                {!collapsed && isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Account & Web3 Wallet Block */}
      <div className="pt-4 border-t border-zinc-800/80">
        <ConnectButton.Custom>
          {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={() => setCurrentView('connect')}
                        type="button"
                        className={`w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                          collapsed ? 'px-2' : 'px-4'
                        }`}
                        title="Connect Wallet"
                      >
                        <Wallet className="w-3.5 h-3.5 text-black shrink-0" />
                        {!collapsed && <span>Connect Wallet</span>}
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="w-full py-2.5 px-2 rounded-xl bg-red-950/80 border border-red-800 text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      >
                        {!collapsed ? <span>Switch to Sepolia</span> : <span>⚠️</span>}
                      </button>
                    );
                  }

                  return (
                    <div className="flex flex-col gap-2 w-full">
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className={`w-full py-2 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-mono font-medium text-white flex items-center justify-between transition-colors shadow-xs group ${
                          collapsed ? 'justify-center' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          {!collapsed && <span className="group-hover:text-zinc-200 truncate max-w-[90px]">{account.displayName}</span>}
                        </div>
                        {!collapsed && <span className="text-[10px] text-zinc-500 font-sans">Sepolia</span>}
                      </button>

                      {!collapsed && (
                        <div className="flex items-center justify-between px-2 py-0.5 text-[10px] font-mono text-zinc-500">
                          <span>Clearance:</span>
                          {isDecrypted ? (
                            <span className="text-emerald-400 font-semibold">🔓 Decrypted</span>
                          ) : (
                            <span className="text-amber-400">🔒 Encrypted</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>

    </aside>
  );
};
