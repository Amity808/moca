# Smart Contract Integration with AIR Kit SDKs

## Overview

The `FanRegistry.sol` smart contract serves as the **on-chain backbone** of the FanVerify platform, complementing the AIR Kit SDKs to create a comprehensive fan verification and anti-scalping system. This document explains how the smart contract integrates with both AIR Account Services and AIR Credential Services.

## 🏗️ Architecture Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    FanVerify Platform                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Next.js + AIR Kit SDKs)                        │
│  ├── AIR Account Services (SSO, Wallet Management)        │
│  ├── AIR Credential Services (Issue, Verify)              │
│  └── User Interface Components                            │
├─────────────────────────────────────────────────────────────┤
│  Smart Contract Layer (FanRegistry.sol)                   │
│  ├── Fan Registration & Verification                      │
│  ├── Event Management                                     │
│  ├── Ticket Issuance & Transfer                           │
│  └── Anti-Scalping Mechanisms                             │
├─────────────────────────────────────────────────────────────┤
│  Moca Chain / Ethereum / Polygon                           │
│  ├── On-chain State Management                            │
│  ├── Cryptographic Verification                          │
│  └── Immutable Records                                     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Integration Flow

### 1. **Fan Registration Process**

#### AIR Kit SDK Side:

```typescript
// Step 1: User login with AIR Account Services
const airService = new AirService({ partnerId: process.env.MOCA_PARTNER_ID });
await airService.init({ buildEnv: BUILD_ENV.SANDBOX });

const loginResult = await airService.login({
  authToken: await generatePartnerJWT(),
});

// Step 2: Issue fan verification credential
const fanCredential = await airService.issueCredential({
  authToken: await generatePartnerJWT(),
  credentialId: "fan_authenticity_program",
  credentialSubject: {
    fanScore: 85,
    engagementLevel: "high",
    musicStreamingHours: 120,
    socialMediaEngagement: "verified",
  },
  issuerDid: "did:example:fanverify_issuer",
});
```

#### Smart Contract Side:

```solidity
// Step 3: Register fan on-chain with AIR Kit credential verification
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

### 2. **Ticket Purchase & Anti-Scalping**

#### AIR Kit SDK Side:

```typescript
// Step 1: Verify fan credential before ticket purchase
const verificationResult = await airService.verifyCredential({
  authToken: await generatePartnerJWT(),
  programId: "fan_verification_program",
  redirectUrl: "http://localhost:8080/issue",
});

if (verificationResult.status === "Compliant") {
  // Step 2: Issue event-specific ticket credential
  const ticketCredential = await airService.issueCredential({
    authToken: await generatePartnerJWT(),
    credentialId: "event_ticket_program",
    credentialSubject: {
      eventId: eventDetails.id,
      eventName: eventDetails.name,
      nonTransferable: true,
      timeBound: true,
      expiresAt: eventDetails.date + 86400000,
    },
    issuerDid: "did:example:event_organizer",
  });
}
```

#### Smart Contract Side:

```solidity
// Step 3: Purchase ticket on-chain with AIR Kit verification
function purchaseTicket(
    uint256 eventId,
    string memory credentialHash,  // Hash of AIR Kit ticket credential
    bytes memory signature         // Signature from AIR Kit verifier
) external payable {
    // Verify AIR Kit credential signature
    bytes32 messageHash = keccak256(abi.encodePacked(
        fanProfiles[msg.sender].fanDid,
        eventId,
        credentialHash,
        block.chainid
    ));
    bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
    address signer = ethSignedMessageHash.recover(signature);
    require(signer == airKitVerifier, "Invalid AIR Kit signature");

    // Issue non-transferable ticket
    uint256 ticketId = nextTicketId++;
    tickets[ticketId] = Ticket({
        ticketId: ticketId,
        eventId: eventId,
        owner: msg.sender,
        issueTime: block.timestamp,
        isUsed: false,
        isTransferable: false,  // Anti-scalping: non-transferable
        transferCount: 0,
        credentialHash: credentialHash
    });
}
```

## 🛡️ Anti-Scalping Mechanisms

### 1. **Cryptographic Binding**

- **AIR Kit Credentials**: Provide zero-knowledge proof of fan authenticity
- **Smart Contract**: Enforces cryptographic binding between fan identity and tickets
- **Result**: Tickets cannot be transferred without proper AIR Kit verification

### 2. **Transfer Limitations**

```solidity
// Anti-scalping: Limit ticket transfers
uint256 public constant MAX_TRANSFER_COUNT = 1;
uint256 public constant TRANSFER_COOLDOWN = 24 hours;

function transferTicket(uint256 ticketId, address to) external {
    require(ticket.transferCount < MAX_TRANSFER_COUNT, "Max transfers exceeded");
    require(block.timestamp >= ticket.lastTransferTime + TRANSFER_COOLDOWN, "Transfer cooldown");

    // Verify new owner through AIR Kit
    require(fanProfiles[to].isVerified, "New owner must be verified fan");
}
```

### 3. **Blacklist System**

```solidity
// Anti-scalping: Blacklist suspicious accounts
function blacklistFan(address fan, string memory reason) external onlyOwner {
    fanProfiles[fan].isBlacklisted = true;
    emit FanBlacklisted(fan, reason, block.timestamp);
}

modifier onlyVerifiedFan(address fan) {
    require(fanProfiles[fan].isVerified, "Fan not verified");
    require(!fanProfiles[fan].isBlacklisted, "Fan is blacklisted");
    _;
}
```

## 🔐 Security Features

### 1. **Credential Replay Protection**

```solidity
mapping(bytes32 => bool) public usedCredentialHashes;

function _verifyCredential(string memory credentialHash) internal {
    bytes32 credentialHashBytes = keccak256(abi.encodePacked(credentialHash));
    require(!usedCredentialHashes[credentialHashBytes], "Credential already used");
    usedCredentialHashes[credentialHashBytes] = true;
}
```

### 2. **Signature Verification**

```solidity
function _verifySignature(
    string memory fanDid,
    uint256 fanScore,
    string memory credentialHash,
    bytes memory signature
) internal view returns (bool) {
    bytes32 messageHash = keccak256(abi.encodePacked(fanDid, fanScore, credentialHash, block.chainid));
    bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
    address signer = ethSignedMessageHash.recover(signature);
    return signer == airKitVerifier;
}
```

### 3. **Multi-Factor Verification**

- **AIR Kit**: Provides zero-knowledge proof of fan authenticity
- **Smart Contract**: Enforces on-chain verification and anti-scalping rules
- **Combined**: Creates tamper-proof fan verification system

## 📊 Data Flow Integration

### 1. **Fan Score Updates**

```typescript
// AIR Kit SDK: Update fan score based on engagement
const updatedCredential = await airService.issueCredential({
  authToken: await generatePartnerJWT(),
  credentialId: "fan_loyalty_update_program",
  credentialSubject: {
    fanDid: fanDid,
    newScore: calculateNewScore(engagementData),
    engagementHistory: [...getEngagementHistory(fanDid), newEngagementData],
  },
  issuerDid: "did:example:fanverify_issuer",
});
```

```solidity
// Smart Contract: Update on-chain fan score
function updateFanScore(
    address fan,
    uint256 newScore,
    string memory credentialHash,
    bytes memory signature
) external onlyOwner {
    // Verify AIR Kit credential signature
    require(_verifySignature(fanProfiles[fan].fanDid, newScore, credentialHash, signature), "Invalid signature");

    // Update on-chain score
    uint256 oldScore = fanProfiles[fan].fanScore;
    fanProfiles[fan].fanScore = newScore;

    emit FanScoreUpdated(fan, oldScore, newScore, block.timestamp);
}
```

### 2. **Event Attendance Tracking**

```solidity
// Smart Contract: Track fan attendance for reputation building
function verifyTicket(uint256 ticketId, string memory credentialHash, bytes memory signature) external {
    // Verify AIR Kit credential
    require(_verifySignature(fanProfiles[ticket.owner].fanDid, ticketId, credentialHash, signature), "Invalid signature");

    // Mark ticket as used and update attendance
    ticket.isUsed = true;
    fanProfiles[ticket.owner].eventAttendance[ticket.eventId] = true;
    fanProfiles[ticket.owner].totalEventsAttended++;
}
```

## 🎯 Key Benefits of Integration

### 1. **Complementary Strengths**

- **AIR Kit SDKs**: Provide privacy-preserving verification and user experience
- **Smart Contract**: Provides on-chain enforcement and anti-scalping mechanisms
- **Combined**: Creates comprehensive fan verification system

### 2. **Privacy + Security**

- **AIR Kit**: Zero-knowledge proofs protect user privacy
- **Smart Contract**: Cryptographic verification ensures security
- **Result**: Privacy-preserving yet secure fan verification

### 3. **Scalability**

- **AIR Kit**: Handles complex verification logic off-chain
- **Smart Contract**: Provides efficient on-chain state management
- **Result**: Scalable system that can handle millions of fans

### 4. **Interoperability**

- **AIR Kit**: Cross-platform credential portability
- **Smart Contract**: Cross-chain compatibility (Ethereum, Polygon, Moca Chain)
- **Result**: Universal fan verification system

## 🚀 Implementation Example

### Complete Fan Registration Flow:

```typescript
// 1. AIR Kit: User login and credential issuance
const airService = new AirService({ partnerId: process.env.MOCA_PARTNER_ID });
await airService.init({ buildEnv: BUILD_ENV.SANDBOX });

const loginResult = await airService.login({ authToken: await generatePartnerJWT() });
const fanCredential = await airService.issueCredential({...});

// 2. Smart Contract: On-chain registration
const fanRegistry = new ethers.Contract(FAN_REGISTRY_ADDRESS, FanRegistryABI, signer);
await fanRegistry.registerFan(
    fanCredential.fanDid,
    fanCredential.fanScore,
    fanCredential.credentialHash,
    fanCredential.signature
);

// 3. Combined: Fan is now verified both off-chain (AIR Kit) and on-chain (Smart Contract)
```

### Complete Ticket Purchase Flow:

```typescript
// 1. AIR Kit: Verify fan and issue ticket credential
const verificationResult = await airService.verifyCredential({...});
const ticketCredential = await airService.issueCredential({...});

// 2. Smart Contract: Purchase ticket with anti-scalping protection
await fanRegistry.purchaseTicket(
    eventId,
    ticketCredential.credentialHash,
    ticketCredential.signature,
    { value: ticketPrice }
);

// 3. Combined: Ticket is cryptographically bound to verified fan identity
```

## 🏆 Innovation Highlights

### 1. **First-of-its-kind Integration**

- **Hybrid approach**: Combines AIR Kit's privacy-preserving verification with smart contract enforcement
- **Dual verification**: Both off-chain (AIR Kit) and on-chain (Smart Contract) verification
- **Cryptographic binding**: Tickets are cryptographically tied to verified fan identity

### 2. **Anti-Scalping Innovation**

- **Non-transferable tickets**: Cryptographically bound to fan identity
- **Transfer limitations**: Maximum transfer count and cooldown periods
- **Blacklist system**: Real-time detection and prevention of scalping behavior

### 3. **Privacy-Preserving Security**

- **Zero-knowledge proofs**: Prove fan authenticity without exposing personal data
- **Selective disclosure**: Fans control what information to share
- **Cryptographic guarantees**: Tamper-proof verification using blockchain technology

This integration creates a **revolutionary fan verification system** that eliminates scalping while maintaining user privacy and providing seamless user experience through the AIR Kit SDKs.
