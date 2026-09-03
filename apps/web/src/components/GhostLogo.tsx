import React from 'react';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
  showText?: boolean;
}

export const GhostLogo: React.FC<LogoProps> = ({
  className = 'w-5 h-5',
  theme = 'auto',
  showText = false,
}) => {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <img
        src="/assets/ghost-emblem-black.png"
        alt="Ghost Emblem"
        className={`object-contain dark:hidden ${className}`}
      />
      <img
        src="/assets/ghost-emblem-white.png"
        alt="Ghost Emblem"
        className={`object-contain hidden dark:block ${className}`}
      />
      {showText && (
        <img
          src="/assets/ghost-wordmark-black.png"
          alt="Ghost"
          className="h-5 w-auto object-contain"
        />
      )}
    </div>
  );
};

export const GhostWordmark: React.FC<{ className?: string; theme?: 'light' | 'dark' }> = ({
  className = 'h-8 w-auto',
  theme = 'dark',
}) => {
  return (
    <img
      src={theme === 'light' ? '/assets/ghost-wordmark-black.png' : '/assets/ghost-wordmark-white.png'}
      alt="Ghost"
      className={`object-contain select-none ${className}`}
    />
  );
};

export const GhostIconOnly: React.FC<{ className?: string; theme?: 'light' | 'dark' }> = ({
  className = 'w-6 h-6',
  theme = 'dark',
}) => {
  return (
    <img
      src={theme === 'light' ? '/assets/ghost-emblem-black.png' : '/assets/ghost-emblem-white.png'}
      alt="Ghost"
      className={`object-contain select-none ${className}`}
    />
  );
};
