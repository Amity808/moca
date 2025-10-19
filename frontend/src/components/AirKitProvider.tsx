'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AirService, BUILD_ENV } from '@mocanetwork/airkit';

interface AirKitContextType {
    service: AirService | null;
    isInitialized: boolean;
    isLoggedIn: boolean;
    userAddress: string | null;
    loginResult: LoginResult | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

interface LoginResult {
    id: string;
    abstractAccountAddress?: string;
    token: string;
    isLoggedIn: boolean;
    isMFASetup?: boolean;
}

const AirKitContext = createContext<AirKitContextType | undefined>(undefined);

export const useAirKit = () => {
    const context = useContext(AirKitContext);
    if (!context) {
        throw new Error('useAirKit must be used within an AirKitProvider');
    }
    return context;
};

interface AirKitProviderProps {
    children: ReactNode;
}

export const AirKitProvider = ({ children }: AirKitProviderProps) => {
    const [service, setService] = useState<AirService | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);
    const [loginResult, setLoginResult] = useState<LoginResult | null>(null);

    useEffect(() => {
        const initializeService = async () => {
            try {
                const airService = new AirService({
                    partnerId: "643f36f7-fff3-4e60-ac7a-8fecaaa39ddf",
                });

                await airService.init({
                    buildEnv: BUILD_ENV.SANDBOX,
                    enableLogging: true,
                    skipRehydration: false,
                });

                setService(airService);
                setIsInitialized(true);
                console.log('AirService initialized');
            } catch (error) {
                console.error('Failed to initialize AirKit service:', error);
            }
        };

        initializeService();
    }, []);

    const login = async () => {
        if (!service) return;

        try {
            const result = await service.login({});
            setIsLoggedIn(true);
            setLoginResult(result as LoginResult);
            if (result?.abstractAccountAddress) {
                setUserAddress(result.abstractAccountAddress);
            }
            console.log('Login successful:', result);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = async () => {
        if (!service) return;

        try {
            await service.logout();
            setIsLoggedIn(false);
            setUserAddress(null);
            setLoginResult(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const value: AirKitContextType = {
        service,
        isInitialized,
        isLoggedIn,
        userAddress,
        loginResult,
        login,
        logout,
    };

    return (
        <AirKitContext.Provider value={value}>
            {children}
        </AirKitContext.Provider>
    );
};
