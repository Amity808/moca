import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { airConnector } from "@mocanetwork/airkit-connector";
import { BUILD_ENV } from "@mocanetwork/airkit";
// update

export const wagmiConfig = createConfig({
    chains: [mainnet, sepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
    },
    connectors: [
        airConnector({
            partnerId: "643f36f7-fff3-4e60-ac7a-8fecaaa39ddf",
            buildEnv: BUILD_ENV.SANDBOX,
            enableLogging: true,
        }),
    ],
});
