'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAirKit } from '@/components/AirKitProvider';

export default function FanVerification() {
    const { isLoggedIn, login, logout } = useAirKit();
    const [currentStep, setCurrentStep] = useState(0);
    const [verificationData, setVerificationData] = useState({
        socialMedia: {
            twitter: false,
            instagram: false,
            spotify: false
        },
        musicStreaming: {
            hours: 0,
            artists: [],
            genres: []
        },
        fanEngagement: {
            concertHistory: [],
            merchandisePurchases: 0,
            socialShares: 0
        }
    });

    const steps = [
        {
            title: "Connect Your Accounts",
            description: "Link your social media and music streaming accounts to verify your fan identity",
            icon: "🔗"
        },
        {
            title: "Music Streaming Analysis",
            description: "We'll analyze your music listening habits to determine your fan authenticity",
            icon: "🎵"
        },
        {
            title: "Social Media Verification",
            description: "Verify your engagement with artists and music content on social platforms",
            icon: "📱"
        },
        {
            title: "Fan Engagement Review",
            description: "Review your concert history and merchandise purchases",
            icon: "🎫"
        },
        {
            title: "Credential Issuance",
            description: "Receive your verified fan credential with loyalty score",
            icon: "🏆"
        }
    ];

    const [fanScore, setFanScore] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);

    const calculateFanScore = () => {
        setIsCalculating(true);

        // Simulate score calculation
        setTimeout(() => {
            let score = 0;

            // Social media verification (30 points)
            const socialCount = Object.values(verificationData.socialMedia).filter(Boolean).length;
            score += socialCount * 10;

            // Music streaming (40 points)
            if (verificationData.musicStreaming.hours > 100) score += 20;
            else if (verificationData.musicStreaming.hours > 50) score += 15;
            else if (verificationData.musicStreaming.hours > 20) score += 10;

            // Fan engagement (30 points)
            score += Math.min(verificationData.fanEngagement.concertHistory.length * 5, 15);
            score += Math.min(verificationData.fanEngagement.merchandisePurchases * 2, 10);
            score += Math.min(verificationData.fanEngagement.socialShares * 1, 5);

            setFanScore(Math.min(score, 100));
            setIsCalculating(false);
        }, 2000);
    };

    const handleSocialMediaConnect = (platform: string) => {
        setVerificationData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [platform]: true
            }
        }));
    };

    const handleMusicStreamingUpdate = (hours: number) => {
        setVerificationData(prev => ({
            ...prev,
            musicStreaming: {
                ...prev.musicStreaming,
                hours
            }
        }));
    };

    const handleFanEngagementUpdate = (field: string, value: string | number | string[]) => {
        setVerificationData(prev => ({
            ...prev,
            fanEngagement: {
                ...prev.fanEngagement,
                [field]: value
            }
        }));
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 80) return 'text-blue-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBadge = (score: number) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 80) return 'bg-blue-500';
        if (score >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Please Log In</h1>
                    <p className="text-gray-300 mb-8">You need to be logged in to start fan verification.</p>
                    <button
                        onClick={login}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full transition-colors"
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <header className="bg-black bg-opacity-30 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">F</span>
                            </div>
                            <span className="text-white text-xl font-bold">FanVerify</span>
                        </div>
                        <button
                            onClick={logout}
                            className="text-white hover:text-pink-300 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-white">Fan Verification</h1>
                        <div className="text-white">
                            Step {currentStep + 1} of {steps.length}
                        </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Steps Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-4">Verification Steps</h3>
                            <div className="space-y-4">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg cursor-pointer transition-all ${index === currentStep
                                            ? 'bg-gradient-to-r from-pink-600 to-purple-600'
                                            : index < currentStep
                                                ? 'bg-green-500 bg-opacity-20'
                                                : 'bg-white bg-opacity-5 hover:bg-opacity-10'
                                            }`}
                                        onClick={() => setCurrentStep(index)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="text-2xl">{step.icon}</div>
                                            <div>
                                                <div className="text-white font-semibold">{step.title}</div>
                                                <div className="text-gray-300 text-sm">{step.description}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
                            {/* Step 1: Connect Accounts */}
                            {currentStep === 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Connect Your Accounts</h2>
                                    <p className="text-gray-300 mb-6">
                                        Link your social media and music streaming accounts to verify your fan identity.
                                        We use this data to calculate your fan authenticity score.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">🐦</div>
                                                <div>
                                                    <div className="text-white font-semibold">Twitter</div>
                                                    <div className="text-gray-300 text-sm">Connect your Twitter account</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSocialMediaConnect('twitter')}
                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${verificationData.socialMedia.twitter
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    }`}
                                            >
                                                {verificationData.socialMedia.twitter ? 'Connected' : 'Connect'}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">📷</div>
                                                <div>
                                                    <div className="text-white font-semibold">Instagram</div>
                                                    <div className="text-gray-300 text-sm">Connect your Instagram account</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSocialMediaConnect('instagram')}
                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${verificationData.socialMedia.instagram
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    }`}
                                            >
                                                {verificationData.socialMedia.instagram ? 'Connected' : 'Connect'}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <div className="text-2xl">🎵</div>
                                                <div>
                                                    <div className="text-white font-semibold">Spotify</div>
                                                    <div className="text-gray-300 text-sm">Connect your Spotify account</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSocialMediaConnect('spotify')}
                                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${verificationData.socialMedia.spotify
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    }`}
                                            >
                                                {verificationData.socialMedia.spotify ? 'Connected' : 'Connect'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Music Streaming Analysis */}
                            {currentStep === 1 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Music Streaming Analysis</h2>
                                    <p className="text-gray-300 mb-6">
                                        Tell us about your music listening habits. This helps us verify your genuine interest in music.
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-white font-semibold mb-2">
                                                How many hours do you listen to music per month?
                                            </label>
                                            <input
                                                type="number"
                                                value={verificationData.musicStreaming.hours}
                                                onChange={(e) => handleMusicStreamingUpdate(parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                placeholder="Enter hours per month"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white font-semibold mb-2">
                                                Your favorite artists (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                placeholder="Taylor Swift, Billie Eilish, The Weeknd"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white font-semibold mb-2">
                                                Your favorite genres
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'R&B', 'Country', 'Jazz', 'Classical'].map((genre) => (
                                                    <label key={genre} className="flex items-center space-x-2 p-2 bg-white bg-opacity-5 rounded-lg cursor-pointer hover:bg-opacity-10">
                                                        <input type="checkbox" className="rounded" />
                                                        <span className="text-white text-sm">{genre}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Social Media Verification */}
                            {currentStep === 2 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Social Media Verification</h2>
                                    <p className="text-gray-300 mb-6">
                                        We&apos;ll analyze your social media activity to verify your engagement with music content.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-green-500 bg-opacity-20 rounded-lg">
                                            <div className="text-green-300 text-sm mb-2">✓ Twitter Analysis Complete</div>
                                            <div className="text-white">Found 45 music-related posts and 12 artist interactions</div>
                                        </div>

                                        <div className="p-4 bg-green-500 bg-opacity-20 rounded-lg">
                                            <div className="text-green-300 text-sm mb-2">✓ Instagram Analysis Complete</div>
                                            <div className="text-white">Found 23 concert photos and 8 artist story shares</div>
                                        </div>

                                        <div className="p-4 bg-blue-500 bg-opacity-20 rounded-lg">
                                            <div className="text-blue-300 text-sm mb-2">⏳ Spotify Analysis in Progress</div>
                                            <div className="text-white">Analyzing your listening history and playlist data</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Fan Engagement Review */}
                            {currentStep === 3 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Fan Engagement Review</h2>
                                    <p className="text-gray-300 mb-6">
                                        Review your concert history and merchandise purchases to boost your fan score.
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-white font-semibold mb-2">
                                                Concerts attended in the last 2 years
                                            </label>
                                            <input
                                                type="number"
                                                value={verificationData.fanEngagement.concertHistory.length}
                                                onChange={(e) => handleFanEngagementUpdate('concertHistory', Array(parseInt(e.target.value) || 0).fill(''))}
                                                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                placeholder="Number of concerts"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white font-semibold mb-2">
                                                Merchandise purchases
                                            </label>
                                            <input
                                                type="number"
                                                value={verificationData.fanEngagement.merchandisePurchases}
                                                onChange={(e) => handleFanEngagementUpdate('merchandisePurchases', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                placeholder="Number of purchases"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-white font-semibold mb-2">
                                                Social media shares about music
                                            </label>
                                            <input
                                                type="number"
                                                value={verificationData.fanEngagement.socialShares}
                                                onChange={(e) => handleFanEngagementUpdate('socialShares', parseInt(e.target.value) || 0)}
                                                className="w-full px-4 py-3 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                                placeholder="Number of shares"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Credential Issuance */}
                            {currentStep === 4 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Your Fan Credential</h2>

                                    {!isCalculating && fanScore === 0 && (
                                        <div className="text-center">
                                            <p className="text-gray-300 mb-6">
                                                Ready to calculate your fan score and receive your verified fan credential?
                                            </p>
                                            <button
                                                onClick={calculateFanScore}
                                                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
                                            >
                                                Calculate Fan Score
                                            </button>
                                        </div>
                                    )}

                                    {isCalculating && (
                                        <div className="text-center">
                                            <div className="animate-spin w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                            <p className="text-gray-300">Calculating your fan score...</p>
                                        </div>
                                    )}

                                    {!isCalculating && fanScore > 0 && (
                                        <div className="text-center">
                                            <div className={`text-6xl font-bold mb-4 ${getScoreColor(fanScore)}`}>
                                                {fanScore}
                                            </div>
                                            <div className="text-white text-xl mb-2">Fan Loyalty Score</div>
                                            <div className={`px-4 py-2 rounded-full text-lg font-semibold ${getScoreBadge(fanScore)} text-white mb-6`}>
                                                {fanScore >= 90 ? 'Elite Fan' : fanScore >= 80 ? 'Super Fan' : fanScore >= 70 ? 'Loyal Fan' : 'New Fan'}
                                            </div>

                                            <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-6">
                                                <h3 className="text-xl font-bold text-white mb-4">Your Verified Fan Credential</h3>
                                                <div className="text-gray-300 mb-4">
                                                    You&apos;ve successfully received your verified fan credential! This credential:
                                                </div>
                                                <ul className="text-left text-gray-300 space-y-2">
                                                    <li>• Proves your fan authenticity without revealing personal data</li>
                                                    <li>• Grants access to exclusive perks and early ticket sales</li>
                                                    <li>• Is portable across all FanVerify-enabled platforms</li>
                                                    <li>• Uses zero-knowledge proofs for privacy protection</li>
                                                </ul>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Link href="/fan-dashboard" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
                                                    Go to Dashboard
                                                </Link>
                                                <Link href="/events" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-full text-lg font-semibold transition-all">
                                                    Browse Events
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                    disabled={currentStep === 0}
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                >
                                    Previous
                                </button>

                                {currentStep < steps.length - 1 && (
                                    <button
                                        onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                                        className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-lg transition-colors"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
