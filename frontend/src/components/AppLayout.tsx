'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUILD_ENV, type BUILD_ENV_TYPE } from "@mocanetwork/airkit";
// import { getEnvironmentConfig } from "@/config/environments";
import { useAirKit } from "@/components/AirKitProvider";

// Get partner IDs from environment variables
const ISSUER_PARTNER_ID = process.env.NEXT_PUBLIC_ISSUER_PARTNER_ID || "66811bd6-dab9-41ef-8146-61f29d038a45";
const VERIFIER_PARTNER_ID = process.env.NEXT_PUBLIC_VERIFIER_PARTNER_ID || "66811bd6-dab9-41ef-8146-61f29d038a45";
// const enableLogging = true;

const ENV_OPTIONS = [
    { label: "Staging", value: BUILD_ENV.STAGING },
    { label: "Sandbox", value: BUILD_ENV.SANDBOX },
];

// Component to get current flow title
const FlowTitle = () => {
    const pathname = usePathname();

    if (pathname === "/issue") {
        return <span className="text-brand-600">Issuance</span>;
    } else if (pathname === "/verify") {
        return <span className="text-verify-600">Verification</span>;
    }

    return <span>AIR Credential Demo</span>;
};

// Function to get default partner ID based on current route
const getDefaultPartnerId = (pathname: string): string => {
    if (pathname === "/issue") {
        return ISSUER_PARTNER_ID;
    } else if (pathname === "/verify") {
        return VERIFIER_PARTNER_ID;
    }
    return ISSUER_PARTNER_ID; // Default to issuer for root route
};

interface NavBarLoginProps {
    isLoading: boolean;
    isInitialized: boolean;
    isLoggedIn: boolean;
    userAddress: string | null;
    onLogin: () => void;
    onLogout: () => void;
    currentEnv: BUILD_ENV_TYPE;
    setCurrentEnv: (env: BUILD_ENV_TYPE) => void;
    envOptions: Array<{ label: string; value: BUILD_ENV_TYPE }>;
}

const NavBarLogin = ({
    isLoading,
    isInitialized,
    isLoggedIn,
    userAddress,
    onLogin,
    onLogout,
    currentEnv,
    setCurrentEnv,
    envOptions,
}: NavBarLoginProps) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        onLogout();
        setShowDropdown(false);
    };

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    if (!isInitialized) {
        return (
            <div className="flex items-center">
                <div className="animate-spin h-4 w-4 text-gray-400 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
                <span className="text-sm text-gray-500">Initializing...</span>
            </div>
        );
    }

    const formatAddress = (address: string) => {
        if (address.length <= 12) return address;
        return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {userAddress && <span className="text-xs font-mono text-gray-600 px-2 py-1 rounded">{formatAddress(userAddress)}</span>}
                    </div>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            ) : (
                <button
                    onClick={onLogin}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Connecting...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            Connect Wallet
                        </>
                    )}
                </button>
            )}

            {/* Dropdown menu for logged in users */}
            {showDropdown && isLoggedIn && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">AIR Wallet</div>
                        <div className="text-xs text-gray-500">Connected</div>
                        {userAddress && (
                            <div className="mt-1">
                                <div className="text-xs text-gray-500">Address:</div>
                                <div className="text-xs font-mono text-gray-700 break-all">{userAddress}</div>
                            </div>
                        )}
                    </div>
                    <div className="px-4 py-2 border-b border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">AIRKit Env:</div>
                        <select
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
                            value={currentEnv}
                            onChange={(e) => setCurrentEnv(e.target.value as BUILD_ENV_TYPE)}
                        >
                            {envOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
};

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { service, isInitialized, isLoggedIn, login, logout } = useAirKit();
    const [currentEnv, setCurrentEnv] = useState<BUILD_ENV_TYPE>(BUILD_ENV.SANDBOX);
    const [partnerId, setPartnerId] = useState<string>(ISSUER_PARTNER_ID);
    const [isLoading, setIsLoading] = useState(false);
    const [userAddress, setUserAddress] = useState<string | null>(null);

    const pathname = usePathname();

    // Get environment config based on current environment
    // const environmentConfig = getEnvironmentConfig(currentEnv);

    // Update partner ID when route changes
    useEffect(() => {
        const defaultPartnerId = getDefaultPartnerId(pathname);
        setPartnerId(defaultPartnerId);
    }, [pathname]);

    // Get user address from service when logged in
    useEffect(() => {
        if (isLoggedIn && service?.loginResult) {
            const result = service.loginResult;
            if (result.abstractAccountAddress) {
                setUserAddress(result.abstractAccountAddress || null);
            }
        } else if (!isLoggedIn) {
            setUserAddress(null);
        }
    }, [isLoggedIn, service]);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await login();
        } catch (err) {
            console.error("Login failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <div
            className={
                "min-h-screen " +
                (pathname.startsWith("/issue")
                    ? "bg-gradient-to-br from-blue-50 to-brand-100"
                    : pathname.startsWith("/verify")
                        ? "bg-gradient-to-br from-verify-50 to-verify-200"
                        : "bg-gradient-to-br from-gray-50 to-gray-200")
            }
        >
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-full sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 gap-2 sm:gap-0 py-2 sm:py-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-6">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                <FlowTitle />
                            </h1>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Partner ID:</span>
                                <input
                                    type="text"
                                    value={partnerId}
                                    onChange={(e) => setPartnerId(e.target.value)}
                                    className="text-xs font-mono text-brand-700 bg-brand-50 px-2 py-1 rounded border border-transparent focus:border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-300 min-w-[200px]"
                                    placeholder="Enter Partner ID"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-8 w-full sm:w-auto">
                            <nav className="flex flex-row space-x-2 sm:space-x-8 w-full sm:w-auto">
                                <Link
                                    href="/issue"
                                    className="flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-center"
                                >
                                    Issuance
                                </Link>
                                <Link
                                    href="/verify"
                                    className="flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-center"
                                >
                                    Verification
                                </Link>
                            </nav>
                            <div className="w-full sm:w-auto">
                                <NavBarLogin
                                    isLoading={isLoading}
                                    isInitialized={isInitialized}
                                    isLoggedIn={isLoggedIn}
                                    userAddress={userAddress}
                                    onLogin={handleLogin}
                                    onLogout={handleLogout}
                                    currentEnv={currentEnv}
                                    setCurrentEnv={setCurrentEnv}
                                    envOptions={ENV_OPTIONS}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-full sm:max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
                    <p className="text-center text-gray-500 text-xs sm:text-sm">Powered by AIR Credential SDK</p>
                </div>
            </footer>
        </div>
    );
}
