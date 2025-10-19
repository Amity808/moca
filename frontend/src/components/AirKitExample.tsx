'use client';

import { useAirKit } from '@/components/AirKitProvider';
// import { Creden}

export default function AirKitExample() {
    const { isInitialized, isLoggedIn, login, logout } = useAirKit();

    if (!isInitialized) {
        return <div>Initializing AirKit...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">AirKit Integration</h1>

            <div className="mb-4">
                <p>Status: {isLoggedIn ? 'Logged In' : 'Not Logged In'}</p>
            </div>

            <div className="space-x-4">
                {!isLoggedIn ? (
                    <button
                        onClick={login}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Login with AirKit
                    </button>
                ) : (
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                )}
            </div>
        </div>
    );
}
