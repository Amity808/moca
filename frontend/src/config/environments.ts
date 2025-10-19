import { BUILD_ENV } from "@mocanetwork/airkit";

export interface EnvironmentConfig {
    widgetUrl: string;
    apiUrl: string;
}

export const getEnvironmentConfig = (env: string): EnvironmentConfig => {
    switch (env) {
        case BUILD_ENV.STAGING:
            return {
                widgetUrl: "https://staging-widget.airkit.com",
                apiUrl: "https://staging-api.airkit.com",
            };
        case BUILD_ENV.SANDBOX:
        default:
            return {
                widgetUrl: "https://sandbox-widget.airkit.com",
                apiUrl: "https://sandbox-api.airkit.com",
            };
    }
};
