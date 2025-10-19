'use client';

import { useAirKit } from "@/components/AirKitProvider";
import CredentialVerification from "@/components/verification/CredentialVerification";
import { getEnvironmentConfig } from "@/config/environments";
import { BUILD_ENV } from "@mocanetwork/airkit";

export default function VerifyPage() {
    const { service, isLoggedIn } = useAirKit();

    // Get environment config - you might want to make this dynamic based on user selection
    const environmentConfig = getEnvironmentConfig(BUILD_ENV.SANDBOX);

    // Get partner ID from environment or use default
    const partnerId = process.env.NEXT_PUBLIC_VERIFIER_PARTNER_ID || "66811bd6-dab9-41ef-8146-61f29d038a45";

    return (
        <CredentialVerification
            airService={service}
            isLoggedIn={isLoggedIn}
            partnerId={partnerId}
            environmentConfig={environmentConfig}
        />
    );
}
