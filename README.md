# FanVerify Platform 🎵✨

**Verified Fans, Authentic Experiences, Zero Scalping**

A revolutionary fan verification platform built on Moca Network's AIR Kit that creates unique perks for verified fans while preventing scalping through zero-knowledge proofs and decentralized identity.

## 🎯 Problem Statement

The entertainment industry faces a massive scalping problem where:

- **90% of tickets** end up in scalpers' hands instead of real fans
- **Fans pay 3-5x** the original price for tickets
- **Artists lose connection** with their actual fanbase
- **Venues struggle** to identify genuine fans vs. scalpers

## 💡 Our Solution: FanVerify Platform

FanVerify leverages Moca Network's AIR Kit to create a **verifiable fan identity system** that:

1. **Proves fan authenticity** without revealing personal data
2. **Prevents scalping** through cryptographic verification
3. **Creates exclusive perks** for verified fans
4. **Builds lasting fan-artist relationships**

## 🏗️ Architecture Overview

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    FanVerify Platform                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)                                        │
│  ├── Fan Dashboard                                         │
│  ├── Artist Dashboard                                      │
│  └── Event Management                                      │
├─────────────────────────────────────────────────────────────┤
│  AIR Account Services Integration                          │
│  ├── Single Sign-On (SSO)                                 │
│  ├── Wallet Management                                     │
│  └── User Authentication                                   │
├─────────────────────────────────────────────────────────────┤
│  AIR Credential Services Integration                       │
│  ├── Fan Verification Credentials                          │
│  ├── Event Attendance Proofs                               │
│  ├── Fan Loyalty Scores                                    │
│  └── Anti-Scalping Verification                            │
├─────────────────────────────────────────────────────────────┤
│  Moca Chain Integration                                    │
│  ├── Smart Contracts                                       │
│  ├── Zero-Knowledge Proofs                                 │
│  └── Decentralized Storage                                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 AIR Account Services Integration

### Single Sign-On (SSO) Implementation

**How it works:**

- Fans create a **single AIR identity** that works across all events and platforms
- **One-click login** to any FanVerify-enabled event or artist platform
- **Cross-platform fan history** maintained securely

**Technical Implementation:**

```typescript
// AIR Account Services Integration
import { AirService, BUILD_ENV } from "@mocanetwork/airkit";

// Initialize AIR Service with Partner ID
const airService = new AirService({
  partnerId: process.env.MOCA_PARTNER_ID, // Replace with your actual Partner ID
});

// Initialize the service with environment configuration
await airService.init({
  buildEnv: BUILD_ENV.SANDBOX, // or BUILD_ENV.PRODUCTION
  enableLogging: true,
});

// Fan Login Flow - Default AIR login dialog with multiple options
const loginResult = await airService.login({
  authToken: jwt, // Optional: Partner JWT for authentication
});

// Custom Auth Integration (Bring your own Auth)
const customJWT = {
  partnerId: "YOUR_PARTNER_ID",
  partnerUserId: "fan_12345", // Optional: Your internal user ID
  email: "fan@example.com", // Optional: User's email
  exp: Math.floor(Date.now() / 1000) + 5 * 60, // 5 minutes expiry
  iat: Math.floor(Date.now() / 1000),
};

// Login with custom authentication
const customLoginResult = await airService.login({
  authToken: customJWT,
});

// Session Management
const isLoggedIn = await airService.isLoggedIn();
if (!isLoggedIn) {
  await airService.login();
}

// User Information Retrieval
const userInfo = await airService.getUserInfo();
console.log(userInfo);
// Returns: { partnerId, partnerUserId, airId, user: { id, abstractAccountAddress, email, isMFASetup } }

// Multi-Factor Authentication Setup
if (!userInfo.user.isMFASetup) {
  await airService.setupOrUpdateMfa();
  // Abstract account address will now be available
}

// Logout
await airService.logout();
```

**Benefits:**

- **Seamless experience** - fans don't need multiple accounts
- **Reduced friction** - faster event registration
- **Unified fan profile** - comprehensive fan history

### Wallet Management Services

**Features:**

- **Embedded wallet** capabilities without Web3 complexity
- **Gas sponsorship** for fan transactions
- **Multi-chain support** for different event types
- **Secure key management** with AIR infrastructure

**Use Cases:**

- Fans can **purchase tickets** directly through AIR wallet
- **Receive NFT rewards** for event attendance
- **Trade fan tokens** and exclusive merchandise
- **Participate in fan governance** for artist decisions

## 🎫 AIR Credential Services Integration

### Fan Verification Credentials

**Credential Types:**

1. **Fan Authenticity Credential**

   - Proves genuine fan interest (not scalper)
   - Based on social media engagement, music streaming history
   - **Zero-knowledge proof** - reveals only "is genuine fan" without exposing personal data

2. **Event Attendance Credential**

   - Cryptographic proof of event attendance
   - **Portable across platforms** - use at future events
   - **Builds fan reputation** over time

3. **Fan Loyalty Score Credential**

   - Dynamic score based on engagement history
   - **Higher scores = better perks** (early access, VIP treatment)
   - **Prevents gaming** through cryptographic verification

4. **Anti-Scalping Verification Credential**
   - **Unique per-event** credential that cannot be transferred
   - **Time-bound** - expires after event
   - **Prevents resale** through cryptographic binding

### Technical Implementation

```typescript
// AIR Credential Services Integration
import { AirService, BUILD_ENV } from "@mocanetwork/airkit";
import jwt from "jsonwebtoken";
import fs from "fs";

// Initialize AIR Service (same instance for both Account and Credential services)
const airService = new AirService({
  partnerId: process.env.MOCA_PARTNER_ID,
});

await airService.init({
  buildEnv: BUILD_ENV.SANDBOX,
  enableLogging: true,
});

// JWT Generation for Credential Operations
const generateJWT = async ({ partnerId, privateKey }) => {
  const payload = {
    partnerId: partnerId,
    exp: Math.floor(Date.now() / 1000) + 5 * 60, // 5 minutes expiry
    iat: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    header: {
      kid: "your-key-id", // Key ID for JWKS verification
    },
  });

  return token;
};

// Issue Fan Verification Credential
const issueFanCredential = async () => {
  try {
    // Generate authentication JWT
    const authToken = await generateJWT({
      partnerId: process.env.MOCA_PARTNER_ID,
      privateKey: fs.readFileSync("path/to/private.key"),
    });

    // Configuration from Developer Dashboard
    const config = {
      issuerDid: "did:example:issuer123", // From Developer Dashboard
      credentialId: "c21hc0g4joevn0015479aK", // Program ID from Dashboard
    };

    // Credential subject data
    const credentialSubject = {
      fanScore: 85,
      engagementLevel: "high",
      verificationMethod: "social_media_analysis",
      musicStreamingHours: 120,
      socialMediaEngagement: "verified",
      fanSince: "2023-01-15",
    };

    // Issue the credential
    const result = await airService.issueCredential({
      authToken: authToken,
      credentialId: config.credentialId,
      credentialSubject: credentialSubject,
      issuerDid: config.issuerDid,
    });

    console.log("Credential issued successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to issue credential:", error);
    throw error;
  }
};

// Issue Anti-Scalping Event Ticket Credential
const issueEventTicketCredential = async (fanDid, eventDetails) => {
  const authToken = await generateJWT({
    partnerId: process.env.MOCA_PARTNER_ID,
    privateKey: fs.readFileSync("path/to/private.key"),
  });

  const ticketCredential = {
    authToken: authToken,
    credentialId: "event_ticket_anti_scalping_program",
    credentialSubject: {
      eventId: eventDetails.id,
      eventName: eventDetails.name,
      eventDate: eventDetails.date,
      seatNumber: eventDetails.seat,
      nonTransferable: true,
      timeBound: true,
      expiresAt: eventDetails.date + 86400000, // 24 hours after event
      fanDid: fanDid,
      cryptographicBinding: "bound_to_fan_identity",
    },
    issuerDid: "did:example:event_organizer",
  };

  return await airService.issueCredential(ticketCredential);
};

// Verify Fan Credential (Anti-Scalping Check)
const verifyFanCredential = async () => {
  try {
    // Generate verification JWT
    const authToken = await generateJWT({
      partnerId: process.env.MOCA_PARTNER_ID,
      privateKey: fs.readFileSync("path/to/private.key"),
    });

    // Verification configuration
    const config = {
      verifierDid: "did:example:verifier123", // From Developer Dashboard
      programId: "c21hc030kb5iu0030224Qs", // Verification program ID
      redirectUrlForIssuer: "http://localhost:8080/issue", // Redirect if credential doesn't exist
    };

    // Verify the credential
    const result = await airService.verifyCredential({
      authToken: authToken,
      programId: config.programId,
      redirectUrl: config.redirectUrlForIssuer,
    });

    // Handle verification results
    const status = result.status; // "Compliant", "NonCompliant", "Expired", "Revoked"
    const payload = result.payload;

    console.log("Verification result:", { status, payload });
    return { status, payload };
  } catch (error) {
    console.error("Verification failed:", error);
    throw error;
  }
};

// Status handling helper functions
const getStatusColor = (status) => {
  const colors = {
    Compliant: "green",
    NonCompliant: "red",
    Expired: "orange",
    Revoked: "gray",
  };
  return colors[status] || "gray";
};

const getStatusIcon = (status) => {
  const icons = {
    Compliant: "✅",
    NonCompliant: "❌",
    Expired: "⏰",
    Revoked: "🚫",
  };
  return icons[status] || "❓";
};

const getStatusDescription = (status) => {
  const descriptions = {
    Compliant: "Credential is valid and meets all requirements",
    NonCompliant: "Credential does not meet verification criteria",
    Expired: "Credential has expired and is no longer valid",
    Revoked: "Credential has been revoked by the issuer",
  };
  return descriptions[status] || "Unknown status";
};
```

## 🚀 Key Features & Innovation

### 1. **Cryptographic Anti-Scalping**

- **Non-transferable credentials** - tickets bound to verified fan identity
- **Zero-knowledge proofs** - prove ticket ownership without revealing identity
- **Time-bound verification** - credentials expire after event
- **Cross-platform enforcement** - scalpers can't use tickets on any platform

### 2. **Dynamic Fan Scoring**

- **Real-time calculation** based on engagement metrics
- **Privacy-preserving** - only score revealed, not underlying data
- **Portable reputation** - fans carry their score across all events
- **Gamification** - encourages genuine fan behavior

### 3. **Exclusive Fan Perks**

- **Early access** to tickets for high-score fans
- **VIP experiences** based on loyalty credentials
- **Exclusive merchandise** drops for verified fans
- **Meet & greet** opportunities for top fans

### 4. **Artist-Fan Connection**

- **Direct communication** channels for verified fans
- **Fan feedback** collection through verified channels
- **Community building** around shared fan credentials
- **Monetization** opportunities for artists

## 🎨 User Experience Flow

### For Fans:

1. **Sign up** with AIR Account Services (one-time setup)
2. **Verify fan authenticity** through social media/music streaming
3. **Receive fan credential** with loyalty score
4. **Access exclusive perks** based on verification level
5. **Purchase tickets** with anti-scalping protection
6. **Attend events** and earn attendance credentials
7. **Build reputation** across multiple events/artists

### For Artists/Event Organizers:

1. **Integrate FanVerify** into their platform
2. **Set verification requirements** for their events
3. **Define fan perks** based on loyalty scores
4. **Issue event-specific credentials** to verified fans
5. **Prevent scalping** through cryptographic verification
6. **Build authentic fan community**

## 🔒 Privacy & Security Features

### Zero-Knowledge Proofs

- **Prove fan authenticity** without revealing personal data
- **Verify ticket ownership** without exposing identity
- **Maintain privacy** while ensuring security

### Decentralized Identity

- **User-controlled** identity and data
- **No central authority** can revoke or modify credentials
- **Cross-platform portability** without vendor lock-in

### Cryptographic Guarantees

- **Tamper-proof** credentials using blockchain technology
- **Non-repudiation** - cannot deny credential ownership
- **Immutable fan history** - cannot be falsified

## 🏆 Alignment with Judging Criteria

### 🎯 Innovation & Novelty (25%)

**Revolutionary Anti-Scalping Approach:**

- **First-of-its-kind** cryptographic ticket binding that prevents resale while maintaining privacy
- **Behavioral fan verification** using music streaming patterns and social media engagement
- **Dynamic fan scoring algorithm** that evolves with fan behavior over time
- **Cross-platform fan reputation system** - portable credentials work across all events and platforms
- **Zero-knowledge proof integration** for privacy-preserving fan verification

**Novel Technical Concepts:**

- **Hybrid verification system** combining social proof with cryptographic guarantees
- **Non-transferable credential architecture** specifically designed for event tickets
- **Real-time fan loyalty calculation** with privacy-preserving data analysis
- **Cryptographic binding** between fan identity and event tickets

### 🔧 Technical Robustness & Implementation (30%)

**AIR Kit Integration Excellence:**

- **Dual service utilization**: Seamlessly integrates both AIR Account Services and AIR Credential Services
- **Production-ready JWT authentication** with RS256 encryption and JWKS verification
- **Comprehensive error handling** with status management and user feedback
- **Multi-factor authentication** integration for enhanced security
- **Session management** with automatic rehydration and logout capabilities
- **Smart contract integration**: On-chain enforcement complements AIR Kit's off-chain verification
- **Cryptographic binding**: Tickets are cryptographically tied to verified fan identity through smart contracts

**Architecture Highlights:**

```typescript
// Unified AIR Service Integration
const airService = new AirService({
  partnerId: process.env.MOCA_PARTNER_ID,
});

// Account Services: SSO, Wallet Management, User Authentication
await airService.init({ buildEnv: BUILD_ENV.SANDBOX });
const loginResult = await airService.login({ authToken: jwt });
const userInfo = await airService.getUserInfo();

// Credential Services: Issue, Verify, Zero-Knowledge Proofs
const credential = await airService.issueCredential({
  authToken: jwt,
  credentialId: "fan_verification_program",
  credentialSubject: { fanScore: 85, engagementLevel: "high" },
  issuerDid: "did:example:issuer",
});

const verification = await airService.verifyCredential({
  authToken: jwt,
  programId: "anti_scalping_verification",
  redirectUrl: "http://localhost:8080/issue",
});
```

**Security Implementation:**

- **JWT-based authentication** with 5-minute expiry and proper key management
- **JWKS endpoint integration** for secure token verification
- **Private key protection** with backend JWT generation
- **Cryptographic credential binding** preventing unauthorized transfers
- **Smart contract verification**: On-chain signature verification of AIR Kit credentials
- **Anti-scalping enforcement**: Transfer limitations, blacklist system, and non-transferable tickets
- **Credential replay protection**: Prevents reuse of AIR Kit credentials across different transactions

### 🎨 User Experience & Design (20%)

**Seamless Fan Journey:**

1. **One-click registration** with AIR Account Services
2. **Intuitive fan verification** through social media/music streaming
3. **Real-time credential issuance** with immediate feedback
4. **Simplified ticket purchasing** with embedded wallet capabilities
5. **Cross-platform experience** - same identity works everywhere

**Artist/Organizer Dashboard:**

- **Event management interface** for setting verification requirements
- **Fan analytics dashboard** showing verified fan metrics
- **Perk distribution system** based on loyalty scores
- **Anti-scalping monitoring** with real-time verification status

**Design Philosophy:**

- **Web3-native UX** without Web3 complexity
- **Mobile-first responsive design** for accessibility
- **Progressive disclosure** - show only relevant information
- **Gamified elements** to encourage fan engagement

### 🔒 Privacy & Trustlessness (15%)

**Zero-Knowledge Proof Implementation:**

- **Privacy-preserving fan verification** - proves authenticity without exposing personal data
- **Cryptographic ticket ownership** - verifies ownership without revealing identity
- **Selective disclosure** - fans control what information to share
- **Decentralized credential storage** - no central authority controls fan data

**User Data Sovereignty:**

- **User-controlled identity** through AIR Account Services
- **Portable credentials** that fans own and control
- **No vendor lock-in** - credentials work across all platforms
- **Immutable fan history** - cannot be falsified or manipulated

**Trustless Architecture:**

- **Cryptographic guarantees** for all verification processes
- **Smart contract integration** for automated perk distribution
- **Decentralized verification** - no single point of failure
- **Transparent algorithms** - fan scoring methodology is open and auditable

### 📈 Potential Impact & Scalability (10%)

**Immediate Market Impact:**

- **$15B+ scalping market** elimination through cryptographic prevention
- **Artist revenue increase** by reaching genuine fans instead of scalpers
- **Fan satisfaction improvement** through fair ticket access
- **Platform cost reduction** via automated verification

**Scalability Architecture:**

- **Multi-chain support** - works across Ethereum, Polygon, Moca Chain
- **Cross-industry adoption** - sports, gaming, entertainment, education
- **API-first design** - easy integration with existing platforms
- **Modular credential system** - customizable for different use cases

**Ecosystem Growth:**

- **Network effects** - more fans and artists create more value
- **Developer ecosystem** - open APIs for third-party integrations
- **Global reach** - works across different countries and regulations
- **Long-term sustainability** - creates ongoing value for all participants

## 🌟 Innovation Highlights

### Novel Approaches:

1. **Behavioral Analysis** - Uses music streaming patterns to verify fan authenticity
2. **Dynamic Scoring** - Real-time fan loyalty calculation
3. **Cross-Platform Enforcement** - Anti-scalping works across all platforms
4. **Privacy-Preserving Verification** - Proves authenticity without exposing data
5. **Portable Reputation** - Fans carry their status everywhere

### Technical Innovation:

1. **Hybrid Verification** - Combines social proof with cryptographic verification
2. **Smart Contract Integration** - Automated perk distribution
3. **Multi-Chain Support** - Works across different blockchain networks
4. **Real-Time Updates** - Dynamic credential updates based on behavior

## 🎯 Target Impact

### Immediate Benefits:

- **Eliminate scalping** for FanVerify-enabled events
- **Increase fan satisfaction** through fair ticket access
- **Boost artist revenue** by reaching real fans
- **Reduce platform costs** through automated verification

### Long-term Vision:

- **Industry standard** for fan verification
- **Cross-industry adoption** (sports, gaming, entertainment)
- **Global fan ecosystem** with portable reputation
- **New business models** for artists and platforms

## 🛠️ Technical Stack & Implementation

### Core Technologies

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Identity Infrastructure**: Moca Network AIR Kit (Account + Credential Services)
- **Smart Contracts**: Solidity contracts for on-chain fan verification and anti-scalping
- **Blockchain**: Moca Chain, Ethereum, Polygon
- **Storage**: IPFS for credential metadata
- **Authentication**: JWT with RS256 encryption and JWKS verification
- **Verification**: Zero-knowledge proofs via AIR Credential Services

### Smart Contract Integration

The FanVerify platform includes a comprehensive smart contract (`FanRegistry.sol`) that complements the AIR Kit SDKs:

#### **Key Smart Contract Features:**

- **Fan Registration**: On-chain fan profiles with AIR Kit credential verification
- **Event Management**: Create and manage events with fan score requirements
- **Ticket Issuance**: Cryptographically bound tickets to verified fan identity
- **Anti-Scalping Mechanisms**: Transfer limitations, blacklist system, non-transferable tickets
- **Attendance Tracking**: Build fan reputation through event attendance records

#### **Integration with AIR Kit SDKs:**

```solidity
// Smart contract verifies AIR Kit credentials on-chain
function registerFan(
    string memory fanDid,           // From AIR Kit credential
    uint256 fanScore,              // From AIR Kit credential
    string memory credentialHash,   // Hash of AIR Kit credential
    bytes memory signature         // Signature from AIR Kit verifier
) external {
    // Verify AIR Kit credential signature
    bytes32 messageHash = keccak256(abi.encodePacked(fanDid, fanScore, credentialHash, block.chainid));
    bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
    address signer = ethSignedMessageHash.recover(signature);
    require(signer == airKitVerifier, "Invalid AIR Kit signature");

    // Register fan on-chain
    fanProfiles[msg.sender] = FanProfile({
        fanDid: fanDid,
        fanScore: fanScore,
        registrationTime: block.timestamp,
        isVerified: true,
        isBlacklisted: false,
        totalEventsAttended: 0
    });
}
```

#### **Anti-Scalping Mechanisms:**

```solidity
// Non-transferable tickets bound to fan identity
struct Ticket {
    uint256 ticketId;
    uint256 eventId;
    address owner;
    uint256 issueTime;
    bool isUsed;
    bool isTransferable;              // Anti-scalping: can ticket be transferred?
    uint256 transferCount;             // Track transfer attempts
    string credentialHash;             // AIR Kit credential hash
}

// Transfer limitations
uint256 public constant MAX_TRANSFER_COUNT = 1;
uint256 public constant TRANSFER_COOLDOWN = 24 hours;
```

### AIR Kit Implementation Workflow

#### 1. **SDK Initialization & Configuration**

```typescript
// Complete AIR Kit setup with environment configuration
import { AirService, BUILD_ENV } from "@mocanetwork/airkit";

const airService = new AirService({
  partnerId: process.env.MOCA_PARTNER_ID,
});

await airService.init({
  buildEnv: BUILD_ENV.SANDBOX, // Production: BUILD_ENV.PRODUCTION
  enableLogging: true,
});
```

#### 2. **JWT Authentication Setup**

```typescript
// Production-ready JWT generation with proper security
const generatePartnerJWT = async () => {
  const privateKey = fs.readFileSync("path/to/private.key");

  const payload = {
    partnerId: process.env.MOCA_PARTNER_ID,
    exp: Math.floor(Date.now() / 1000) + 5 * 60, // 5 minutes expiry
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    header: { kid: "your-key-id" }, // Required for JWKS verification
  });
};
```

#### 3. **Fan Onboarding Flow**

```typescript
// Complete fan registration and verification process
const onboardFan = async () => {
  // Step 1: Login with AIR Account Services
  const loginResult = await airService.login({
    authToken: await generatePartnerJWT(),
  });

  // Step 2: Setup MFA for enhanced security
  const userInfo = await airService.getUserInfo();
  if (!userInfo.user.isMFASetup) {
    await airService.setupOrUpdateMfa();
  }

  // Step 3: Issue fan verification credential
  const fanCredential = await airService.issueCredential({
    authToken: await generatePartnerJWT(),
    credentialId: "fan_authenticity_program",
    credentialSubject: {
      fanScore: calculateFanScore(),
      engagementLevel: "verified",
      musicStreamingHours: getUserStreamingData(),
      socialMediaEngagement: "high",
    },
    issuerDid: "did:example:fanverify_issuer",
  });

  return { loginResult, fanCredential };
};
```

#### 4. **Anti-Scalping Ticket System**

```typescript
// Cryptographic ticket binding to prevent scalping
const issueAntiScalpingTicket = async (fanDid, eventDetails) => {
  const authToken = await generatePartnerJWT();

  // Create non-transferable, time-bound ticket credential
  const ticketCredential = await airService.issueCredential({
    authToken: authToken,
    credentialId: "anti_scalping_ticket_program",
    credentialSubject: {
      eventId: eventDetails.id,
      eventName: eventDetails.name,
      eventDate: eventDetails.date,
      seatNumber: eventDetails.seat,
      // Anti-scalping properties
      nonTransferable: true,
      timeBound: true,
      expiresAt: eventDetails.date + 86400000, // 24 hours after event
      fanDid: fanDid,
      cryptographicBinding: "bound_to_fan_identity",
      // Zero-knowledge proof data
      zkProof: generateZKProof(fanDid, eventDetails.id),
    },
    issuerDid: "did:example:event_organizer",
  });

  return ticketCredential;
};
```

#### 5. **Real-Time Verification System**

```typescript
// Live verification for event entry and anti-scalping checks
const verifyTicketAtEvent = async (ticketCredentialId) => {
  const authToken = await generatePartnerJWT();

  const verificationResult = await airService.verifyCredential({
    authToken: authToken,
    programId: "event_entry_verification_program",
    redirectUrl: "http://localhost:8080/issue", // Redirect if credential missing
  });

  // Handle verification status
  const { status, payload } = verificationResult;

  switch (status) {
    case "Compliant":
      return {
        access: true,
        message: "Welcome to the event!",
        fanLevel: payload.fanScore,
      };
    case "NonCompliant":
      return {
        access: false,
        message: "Ticket verification failed",
        reason: "Invalid or tampered credential",
      };
    case "Expired":
      return {
        access: false,
        message: "Ticket has expired",
        reason: "Event has passed",
      };
    case "Revoked":
      return {
        access: false,
        message: "Ticket has been revoked",
        reason: "Credential revoked by issuer",
      };
  }
};
```

#### 6. **Cross-Platform Fan Reputation**

```typescript
// Portable fan reputation across all platforms
const updateFanReputation = async (fanDid, newEngagementData) => {
  const authToken = await generatePartnerJWT();

  // Update fan loyalty score based on new engagement
  const updatedCredential = await airService.issueCredential({
    authToken: authToken,
    credentialId: "fan_loyalty_update_program",
    credentialSubject: {
      fanDid: fanDid,
      previousScore: getCurrentFanScore(fanDid),
      newScore: calculateNewScore(newEngagementData),
      engagementHistory: [...getEngagementHistory(fanDid), newEngagementData],
      lastUpdated: new Date().toISOString(),
      // Cross-platform compatibility
      portableAcrossPlatforms: true,
      verificationMethod: "behavioral_analysis",
    },
    issuerDid: "did:example:fanverify_issuer",
  });

  return updatedCredential;
};
```

### Security & Privacy Implementation

#### **JWT Security Best Practices**

- **5-minute token expiry** to minimize exposure window
- **RS256 encryption** with proper key management
- **JWKS endpoint integration** for secure verification
- **Backend JWT generation** to protect private keys
- **Key rotation support** for enhanced security

#### **Zero-Knowledge Proof Integration**

- **Privacy-preserving verification** without exposing personal data
- **Selective disclosure** allowing fans to control information sharing
- **Cryptographic binding** between fan identity and credentials
- **Tamper-proof verification** using blockchain technology

#### **Multi-Factor Authentication**

- **Passkey integration** through AIR Account Services
- **Automatic MFA setup** for enhanced security
- **Abstract account address** generation after MFA completion
- **Seamless user experience** with minimal friction

## 🚀 Getting Started

### Prerequisites:

- Node.js 16+
- Moca Network Partner ID
- Wallet with testnet tokens

### Installation:

```bash
npm install @mocanetwork/airkit
npm install next react typescript
```

### Environment Setup:

```env
MOCA_PARTNER_ID=your_partner_id
MOCA_PRIVATE_KEY=your_private_key
MOCA_ENVIRONMENT=testnet
```

## 📈 Scalability & Future Roadmap

### Phase 1: Core Platform

- Fan verification system
- Basic anti-scalping features
- Artist dashboard

### Phase 2: Advanced Features

- Dynamic fan scoring
- Cross-platform integration
- Advanced perks system

### Phase 3: Ecosystem Expansion

- Sports team integration
- Gaming platform support
- Global fan marketplace

## 🤝 Community & Support

- **Discord**: Join Moca Network community
- **Documentation**: [AIR Kit Docs](https://docs.moca.network/airkit/)
- **GitHub**: Open source contributions welcome
- **Telegram**: Developer support channel

## 📄 License

MIT License - Open source for community benefit

---

**Built with ❤️ for the Moca Network Proof of Build Hackathon**

_Creating a future where fans are verified, artists are connected, and scalping is impossible._
