import React from 'react';
import { HeroAndExplodedSection } from './HeroAndExplodedSection';

interface VaultExplosionProps {
  onExploreClick?: () => void;
}

export const VaultExplosion: React.FC<VaultExplosionProps> = (props) => {
  return <HeroAndExplodedSection {...props} />;
};
