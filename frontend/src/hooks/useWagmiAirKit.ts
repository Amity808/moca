'use client';

import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { useMemo } from 'react';
import { AirConnector, AirConnectorProperties } from '@mocanetwork/airkit-connector';
import { Connector } from 'wagmi';

export const useWagmiAirKit = () => {
    // Always call hooks at the top level
    const wagmiConnect = useConnect();
    const wagmiAccount = useAccount();
    const wagmiDisconnect = useDisconnect();

    // Check if we're in a Wagmi context by checking if the hooks returned valid data
    const isWagmiAvailable = wagmiConnect && wagmiAccount && wagmiDisconnect;

    const connect = isWagmiAvailable ? wagmiConnect.connect : () => Promise.resolve();
    const connectors = useMemo(() => isWagmiAvailable ? wagmiConnect.connectors : [], [isWagmiAvailable, wagmiConnect.connectors]);
    const connectError = isWagmiAvailable ? wagmiConnect.error : null;
    const isPending = isWagmiAvailable ? wagmiConnect.isPending : false;

    const addresses = isWagmiAvailable ? wagmiAccount.addresses : [];
    const connector = isWagmiAvailable ? wagmiAccount.connector : null;
    const isConnected = isWagmiAvailable ? wagmiAccount.isConnected : false;

    const disconnect = isWagmiAvailable ? wagmiDisconnect.disconnect : () => Promise.resolve();

    // Check if the current connector is the AirKit connector
    const isAirWalletConnector = useMemo(() => {
        return (connector as Connector & AirConnectorProperties)?.isMocaNetwork;
    }, [connector]);

    // Get the AirKit connector instance
    const airConnector = useMemo<AirConnector | null>(() => {
        if (isAirWalletConnector && connector) {
            return connector as AirConnector;
        }
        return null;
    }, [connector, isAirWalletConnector]);

    // Get the AirService from the connector
    const airService = useMemo(() => {
        return airConnector?.airService || null;
    }, [airConnector]);

    // Get the AirKit connector from the available connectors
    const airKitConnector = useMemo(() => {
        if (!isWagmiAvailable) return null;
        return connectors.find((c) => (c as Connector & AirConnectorProperties)?.isMocaNetwork);
    }, [connectors, isWagmiAvailable]);

    // Connect to AirKit wallet
    const connectAirKit = async () => {
        if (airKitConnector) {
            await connect({ connector: airKitConnector });
        }
    };

    // Disconnect from AirKit wallet
    const disconnectAirKit = async () => {
        await disconnect();
    };

    return {
        // Wagmi state
        isConnected,
        addresses,
        connector,
        connectError,
        isPending,

        // AirKit specific
        isAirWalletConnector,
        airConnector,
        airService,
        airKitConnector,

        // Actions
        connectAirKit,
        disconnectAirKit,
        connect,
        disconnect,
    };
};
