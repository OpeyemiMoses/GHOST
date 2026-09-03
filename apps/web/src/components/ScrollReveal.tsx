import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // In milliseconds
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Detect nearest scroll container or fall back to window
    let scrollParent: HTMLElement | Window = window;
    let parent = el.parentElement;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        scrollParent = parent;
        break;
      }
      parent = parent.parentElement;
    }

    const checkVisibility = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const parentRect =
        scrollParent instanceof HTMLElement
          ? scrollParent.getBoundingClientRect()
          : { top: 0, bottom: window.innerHeight };

      // Element enters into view
      const isVisible = rect.top < parentRect.bottom - 15 && rect.bottom > parentRect.top;
      if (isVisible) {
        setIsRevealed(true);
      }
    };

    // Immediate check + short raf timer for layout stabilization
    checkVisibility();
    const rafId = requestAnimationFrame(checkVisibility);
    const timer = setTimeout(checkVisibility, 60);

    const target = scrollParent instanceof HTMLElement ? scrollParent : window;
    target.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      target.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`scroll-pop-reveal ${isRevealed ? 'is-revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
