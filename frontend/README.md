# FanVerify - Verified Fans, Authentic Experiences, Zero Scalping

FanVerify is a revolutionary fan verification platform built on Moca Network's AIR Kit that eliminates scalping through cryptographic verification while creating exclusive perks for genuine fans.

## 🎵 Overview

FanVerify addresses the $15B scalping problem in the entertainment industry by:

- **Anti-Scalping Protection**: Cryptographic ticket binding prevents resale while maintaining fan privacy
- **Dynamic Fan Scoring**: Real-time loyalty calculation based on engagement and behavior
- **Exclusive Fan Perks**: Early access, VIP experiences, and exclusive merchandise for verified fans
- **Artist-Fan Connection**: Direct communication channels and community building for genuine fans

## 🚀 Features

### For Fans

- **Fan Verification**: Connect social media and music streaming accounts to prove authenticity
- **Fan Dashboard**: View loyalty scores, verification status, and exclusive perks
- **Anti-Scalping Tickets**: Purchase tickets cryptographically bound to your identity
- **Portable Credentials**: Use your fan verification across all FanVerify-enabled platforms

### For Artists

- **Artist Dashboard**: Analytics and event management tools
- **Fan Analytics**: Understand your genuine fan base
- **Direct Communication**: Connect with verified fans
- **Revenue Protection**: Eliminate scalping and maximize fan engagement

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **Blockchain**: Moca Network
- **Identity**: AIR Kit for cryptographic verification
- **Authentication**: Wagmi integration for wallet connectivity
- **UI**: Tailwind CSS with glass-morphism design
- **Verification**: Zero-Knowledge Proofs for privacy-preserving verification

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Modern web browser with wallet support

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd moca/frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
NEXT_PUBLIC_AIRKIT_PARTNER_ID=your_partner_id
NEXT_PUBLIC_ISSUER_DID=your_issuer_did
NEXT_PUBLIC_CREDENTIAL_ID=your_credential_id
NEXT_PUBLIC_PRIVATE_KEY=your_private_key
NEXT_PUBLIC_JWT_ALGORITHM=RS256
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## 📱 Pages & Features

### Landing Page (`/`)

- Hero section with key value propositions
- Feature showcase with interactive elements
- Problem statement highlighting the scalping crisis
- Testimonials from artists and fans
- Call-to-action for both fans and artists

### Fan Dashboard (`/fan-dashboard`)

- Loyalty score display
- Verification status badges
- Upcoming events with exclusive access
- Available perks and rewards
- Fan history and engagement metrics

### Fan Verification (`/fan-verification`)

- Multi-step verification process
- Social media integration
- Music streaming account verification
- Fan engagement scoring
- Credential issuance

### Credential Issuance (`/issue-credential`)

- Interactive credential creation
- JWT token management
- Real-time credential status
- Debug information for developers

### Artist Dashboard (`/artist-dashboard`)

- Analytics and insights
- Event management tools
- Fan engagement metrics
- Revenue tracking

## 🔧 Architecture

### Core Components

- **AirKitProvider**: Manages AIR Kit service initialization and authentication
- **WagmiClientProvider**: Optional Wagmi integration for enhanced wallet management
- **useWagmiAirKit**: Custom hook for Wagmi + AIR Kit integration

### Key Features

- **Server-Side Safe**: Core functionality works without client-side dependencies
- **Graceful Fallbacks**: Wagmi integration is optional and fails gracefully
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error handling and user feedback

## 🔐 Security & Privacy

- **Zero-Knowledge Proofs**: Verify fan authenticity without revealing personal data
- **Cryptographic Binding**: Tickets are cryptographically bound to fan identity
- **Privacy-Preserving**: Fan data remains private while enabling verification
- **Anti-Scalping**: Technical measures prevent ticket resale

## 🎯 Use Cases

### Event Ticketing

- Concert tickets with anti-scalping protection
- Sports event tickets for genuine fans
- Festival passes with loyalty rewards

### Fan Engagement

- Exclusive merchandise access
- Early ticket sales for verified fans
- VIP experiences and meet-and-greets
- Direct artist-fan communication

### Artist Revenue

- Eliminate scalping revenue loss
- Increase genuine fan engagement
- Better fan analytics and insights
- Direct fan relationship building

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Moca Network Proof of Build Hackathon
- Powered by Moca Network's AIR Kit
- Inspired by the need to solve the scalping crisis in entertainment

## 📞 Support

For support, email support@fanverify.com or join our Discord community.

---

**FanVerify** - Verified Fans, Authentic Experiences, Zero Scalping 🎵✨
