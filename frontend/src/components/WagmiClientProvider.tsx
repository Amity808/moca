'use client';

import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/config/wagmi';

interface WagmiClientProviderProps {
    children: React.ReactNode;
}

export const WagmiClientProvider = ({ children }: WagmiClientProviderProps) => {
    return (
        <WagmiProvider config={wagmiConfig}>
            {children}
        </WagmiProvider>
    );
};
