import { AirService, BUILD_ENV } from "@mocanetwork/airkit";

const service = new AirService({
    partnerId: process.env.NEXT_PUBLIC_AIRKIT_PARTNER_ID as string, // Replace with your actual Partner ID

});

// Trigger the login flow
await service.init({
    buildEnv: BUILD_ENV.SANDBOX,
    enableLogging: true,
    skipRehydration: false,
});
await service.login({});