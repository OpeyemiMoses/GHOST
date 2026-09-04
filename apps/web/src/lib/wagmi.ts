import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';
import { QueryClient } from '@tanstack/react-query';

export const config = getDefaultConfig({
  appName: 'Ghost',
  projectId: '2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d', // Standard WalletConnect Cloud Project ID
  chains: [sepolia, mainnet],
  ssr: false,
});

export const queryClient = new QueryClient();
