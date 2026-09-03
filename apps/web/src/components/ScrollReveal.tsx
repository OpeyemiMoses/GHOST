import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // In milliseconds
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.08,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Find nearest scrollable parent or default to viewport
    let scrollParent: Element | null = null;
    let parent = el.parentElement;
    while (parent) {
      const overflowY = window.getComputedStyle(parent).overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll') {
        scrollParent = parent;
        break;
      }
      parent = parent.parentElement;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: scrollParent,
        threshold,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(el);

    // Fallback if already visible on mount
    const checkImmediateVisibility = () => {
      const rect = el.getBoundingClientRect();
      const parentRect = scrollParent ? scrollParent.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
      if (rect.top < parentRect.bottom && rect.bottom > parentRect.top) {
        setIsRevealed(true);
      }
    };
    checkImmediateVisibility();

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

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
