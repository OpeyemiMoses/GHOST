import React from 'react';

/**
 * Creates an authentic water-drop ripple animation at the exact click coordinates.
 * Aligns with Rule 5 of personal-web-design ("water drop click ripple effects").
 */
export const triggerWaterRipple = (
  e: React.MouseEvent<HTMLElement>,
  isDark = false
) => {
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const size = Math.max(rect.width, rect.height) * 1.5;

  const ripple = document.createElement('span');
  ripple.className = `water-ripple ${isDark ? 'water-ripple-dark' : ''}`;
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x - size / 2}px`;
  ripple.style.top = `${y - size / 2}px`;

  target.appendChild(ripple);
  setTimeout(() => {
    ripple.remove();
  }, 700);
};
