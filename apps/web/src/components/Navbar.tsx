import React from 'react';
import { useGhost } from '../context/GhostContext';
import { ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, currentUser } = useGhost();

  // Top navbar only renders on the Landing page. In-app views use the Stylized Sidebar.
  if (currentView !== 'landing') {
    return null;
  }

  const handleLaunch = () => {
    if (!currentUser) {
      setCurrentView('connect');
    } else {
      setCurrentView('vault');
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'hardware-section', label: 'Disassembly' },
    { id: 'foundations-section', label: 'Foundations' },
    { id: 'lifecycle-section', label: 'Mechanics' },
    { id: 'privacy-section', label: 'Privacy' },
    { id: 'security-section', label: 'Security' },
  ];

  return (
    <header className="fixed top-5 left-0 w-full z-40 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-6 px-4 py-2 rounded-full nav-pill-container max-w-4xl w-full shadow-md bg-white/90 backdrop-blur-md border border-zinc-200/80">
        
        {/* Brand */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center shrink-0 px-2 py-1 rounded-full hover:bg-black/5 transition-colors"
        >
          <img
            src="/assets/ghost-logo-lockup-black.png"
            alt="Ghost"
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </button>

        {/* Section Navigation Links */}
        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => setCurrentView('docs')}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer"
          >
            Docs
          </button>
          <button
            onClick={() => setCurrentView('help')}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer"
          >
            Help
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLaunch}
            className="btn-pill-primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </nav>
    </header>
  );
};
