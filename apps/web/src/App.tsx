import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { config, queryClient } from './lib/wagmi';
import { GhostProvider, useGhost } from './context/GhostContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { VaultPage } from './pages/VaultPage';
import { ActivityPage } from './pages/ActivityPage';
import { EventsPage } from './pages/EventsPage';
import { VerifyPage } from './pages/VerifyPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { SecurityPage } from './pages/SecurityPage';
import { ContractsPage } from './pages/ContractsPage';
import { ConnectGatewayPage } from './pages/ConnectGatewayPage';
import { DocsPage } from './pages/DocsPage';
import { HelpPage } from './pages/HelpPage';

const AppContent: React.FC = () => {
  const { currentView, currentUser, isWalletMatchingBound, isSessionAuthorized } = useGhost();

  if (currentView === 'connect') {
    return (
      <div key="connect" className="animate-page-enter w-full min-h-screen">
        <ConnectGatewayPage />
      </div>
    );
  }

  // Protected Private Views: Require Email Login + Bound Wallet + Session Authorization
  const isPrivateView = currentView === 'vault' || currentView === 'dashboard' || currentView === 'activity';
  if (isPrivateView && (!currentUser || !currentUser.boundWalletAddress || !isWalletMatchingBound || !isSessionAuthorized)) {
    return (
      <div key="connect-gate" className="animate-page-enter w-full min-h-screen">
        <ConnectGatewayPage />
      </div>
    );
  }

  const isHome = currentView === 'landing';

  if (isHome) {
    return (
      <div key="landing" className="animate-page-enter min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-zinc-200">
        <Navbar />
        <main className="flex-1">
          <LandingPage />
        </main>
        <Footer />
      </div>
    );
  }

  // In-App Experience with Left Floating Sidebar Navigation
  const isDocsView = currentView === 'docs';

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-zinc-900 selection:bg-zinc-200 p-2 sm:p-3 pt-15 md:pt-3 flex flex-col md:flex-row gap-2.5 sm:gap-3">
      <Sidebar />
      <main className={`flex-1 h-[calc(100vh-76px)] md:h-[calc(100vh-24px)] bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/80 flex flex-col justify-between shadow-xs ${
        isDocsView ? 'overflow-hidden' : 'overflow-y-auto'
      }`}>
        <div key={currentView} className={`animate-page-enter flex-1 w-full ${isDocsView ? 'h-full overflow-hidden' : ''}`}>
          {(currentView === 'vault' || currentView === 'dashboard') && <VaultPage />}
          {currentView === 'activity' && <ActivityPage />}
          {(currentView === 'events' || currentView === 'draws') && <EventsPage />}
          {currentView === 'verify' && <VerifyPage />}
          {currentView === 'docs' && <DocsPage />}
          {currentView === 'help' && <HelpPage />}
          {currentView === 'how-it-works' && <HowItWorksPage />}
          {currentView === 'security' && <SecurityPage />}
          {currentView === 'contracts' && <ContractsPage />}
        </div>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#000000',
            accentColorForeground: '#ffffff',
            borderRadius: 'large',
            fontStack: 'system',
          })}
        >
          <GhostProvider>
            <AppContent />
          </GhostProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
