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
  Radio,
  BookOpen,
  Mail,
  LogOut,
  Menu,
  X,
  Gift
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, isDecrypted, currentUser, logoutAccount, unclaimedPrizes } = useGhost();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'vault', label: 'Overview', icon: LayoutDashboard },
    { id: 'claim', label: 'Claim Prizes', icon: Gift, badge: unclaimedPrizes.length > 0 ? `${unclaimedPrizes.length}` : undefined },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'events', label: 'Events & Draws', icon: Trophy },
    { id: 'verify', label: 'Verify State', icon: ShieldCheck },
    { id: 'contracts', label: 'Contracts', icon: FileCode },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'docs', label: 'Protocol Docs', icon: BookOpen },
    { id: 'help', label: 'Help Centre', icon: HelpCircle },
  ];

  const currentNav = navItems.find((n) => n.id === currentView || (n.id === 'vault' && currentView === 'dashboard')) || navItems[0];

  const handleNavClick = (id: string) => {
    // Protocol Docs and Help Centre are always publicly accessible
    if (id === 'docs' || id === 'help') {
      setCurrentView(id);
    } else if (!currentUser) {
      // If user is not logged in, all other buttons route to Email Sign In / Account creation
      setCurrentView('connect');
    } else {
      setCurrentView(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* MOBILE TOP BAR (Fixed height with clear spacing) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 z-40 bg-[#0c0c0e] text-white px-4 flex items-center justify-between border-b border-zinc-800/90 shadow-md">
        <button
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img
            src="/assets/ghost-logo-lockup-white.png"
            alt="Ghost"
            className="h-6 w-auto object-contain"
          />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentNav.label}</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER MODAL */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-[#0c0c0e] text-white h-full p-5 flex flex-col justify-between border-r border-zinc-800 shadow-2xl z-10 animate-page-enter">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800">
                <img
                  src="/assets/ghost-logo-lockup-white.png"
                  alt="Ghost"
                  className="h-6 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id || (item.id === 'vault' && currentView === 'dashboard');

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'bg-zinc-850 text-white font-semibold shadow-xs border border-zinc-750'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold font-mono shadow-xs">
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Account & Connect Block */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              {currentUser ? (
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px] truncate max-w-[170px]">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        logoutAccount();
                        setMobileMenuOpen(false);
                      }}
                      title="Sign Out"
                      className="text-zinc-500 hover:text-red-400 p-1 rounded-md transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {currentUser.boundWalletAddress && (
                    <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-0.5">
                      <span>Bound:</span>
                      <span className="text-zinc-300">{currentUser.boundWalletAddress.slice(0, 6)}...{currentUser.boundWalletAddress.slice(-4)}</span>
                    </div>
                  )}
                </div>
              ) : null}

              {!currentUser ? (
                <button
                  onClick={() => {
                    setCurrentView('connect');
                    setMobileMenuOpen(false);
                  }}
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-black shrink-0" />
                  <span>Sign In to Account</span>
                </button>
              ) : (
                <ConnectButton.Custom>
                  {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                    const ready = mounted;
                    const connected = ready && account && chain;

                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                        >
                          <Wallet className="w-3.5 h-3.5 text-black shrink-0" />
                          <span>Connect Wallet</span>
                        </button>
                      );
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-white flex items-center justify-between transition-colors shadow-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="truncate">{account.displayName}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-sans">Sepolia</span>
                      </button>
                    );
                  }}
                </ConnectButton.Custom>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR (Visible on screens >= md) */}
      <aside
        className={`hidden md:flex relative sticky top-2 sm:top-3 h-[calc(100vh-16px)] sm:h-[calc(100vh-24px)] bg-[#0c0c0e] text-white rounded-3xl border border-zinc-800/80 flex-col justify-between shrink-0 select-none transition-all duration-300 z-30 shadow-xl ${
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
                  onClick={() => handleNavClick(item.id)}
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

                  {!collapsed && (
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold font-mono">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Bottom Account & Web3 Wallet Block */}
        <div className="pt-3 border-t border-zinc-800/80 space-y-2">
          {/* User Account Card */}
          {currentUser && !collapsed && (
            <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px] truncate max-w-[130px]">
                  <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
                <button
                  onClick={logoutAccount}
                  title="Sign Out"
                  className="text-zinc-500 hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
              {currentUser.boundWalletAddress && (
                <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between pt-0.5">
                  <span>Bound:</span>
                  <span className="text-zinc-300">{currentUser.boundWalletAddress.slice(0, 6)}...{currentUser.boundWalletAddress.slice(-4)}</span>
                </div>
              )}
            </div>
          )}

          {!currentUser ? (
            <button
              onClick={() => setCurrentView('connect')}
              type="button"
              className={`w-full py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer ${
                collapsed ? 'px-2' : 'px-4'
              }`}
              title="Sign In to Account"
            >
              <Mail className="w-3.5 h-3.5 text-black shrink-0" />
              {!collapsed && <span>Sign In to Account</span>}
            </button>
          ) : (
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
                            onClick={openConnectModal}
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
          )}
        </div>

      </aside>
    </>
  );
};
