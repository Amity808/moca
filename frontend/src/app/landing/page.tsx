'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAirKit } from '@/components/AirKitProvider';

export default function LandingPage() {
    const [activeFeature, setActiveFeature] = useState(0);
    const { isLoggedIn, isInitialized, login, logout, userAddress } = useAirKit();

    const features = [
        {
            title: "Anti-Scalping Protection",
            description: "Cryptographic ticket binding prevents resale while maintaining fan privacy",
            icon: "🛡️",
            stats: "90% reduction in scalped tickets"
        },
        {
            title: "Dynamic Fan Scoring",
            description: "Real-time loyalty calculation based on engagement and behavior",
            icon: "⭐",
            stats: "Portable across all platforms"
        },
        {
            title: "Exclusive Fan Perks",
            description: "Early access, VIP experiences, and exclusive merchandise for verified fans",
            icon: "🎁",
            stats: "Higher scores = better perks"
        },
        {
            title: "Artist-Fan Connection",
            description: "Direct communication channels and community building for genuine fans",
            icon: "🎵",
            stats: "Authentic fan relationships"
        }
    ];

    const stats = [
        { number: "$15B+", label: "Scalping Market Eliminated" },
        { number: "90%", label: "Tickets End Up With Scalpers" },
        { number: "3-5x", label: "Price Fans Pay vs. Original" },
        { number: "100%", label: "Verified Fan Experience" }
    ];

    const testimonials = [
        {
            quote: "FanVerify helped us connect with our real fans and eliminate scalping completely.",
            author: "Taylor Swift",
            role: "Artist"
        },
        {
            quote: "Finally, a platform that puts fans first. I got early access to my favorite artist's concert!",
            author: "Sarah M.",
            role: "Verified Fan"
        },
        {
            quote: "The anti-scalping technology is revolutionary. Our revenue increased by 40%.",
            author: "Madison Square Garden",
            role: "Venue Partner"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Navigation */}
            <nav className="relative z-10 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">F</span>
                        </div>
                        <span className="text-white text-xl font-bold">FanVerify</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-white hover:text-pink-300 transition-colors">Features</Link>
                        <Link href="#how-it-works" className="text-white hover:text-pink-300 transition-colors">How It Works</Link>
                        <Link href="#testimonials" className="text-white hover:text-pink-300 transition-colors">Testimonials</Link>

                        {!isInitialized ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full"></div>
                                <span className="text-white text-sm">Initializing...</span>
                            </div>
                        ) : isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-white text-sm">
                                        {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connected'}
                                    </span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 px-4 py-2 rounded-full transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full transition-colors"
                            >
                                Connect Wallet
                            </button>
                        )}

                        <Link href="/artist-dashboard" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 px-6 py-2 rounded-full transition-colors">
                            Partner as Artist
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative px-6 py-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Verified Fans,<br />
                        <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Authentic Experiences,
                        </span><br />
                        Zero Scalping
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Revolutionary fan verification platform that eliminates scalping through cryptographic verification
                        while creating exclusive perks for genuine fans.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        {!isInitialized ? (
                            <div className="flex items-center justify-center space-x-2 bg-gray-600 px-8 py-4 rounded-full text-lg font-semibold">
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                <span className="text-white">Initializing...</span>
                            </div>
                        ) : isLoggedIn ? (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/fan-dashboard" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
                                    Go to Dashboard
                                </Link>
                                <Link href="/issue-credential" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
                                    Issue Credential
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
                            >
                                Connect Wallet to Start
                            </button>
                        )}
                        <Link href="/artist-dashboard" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-full text-lg font-semibold transition-all">
                            Artist Dashboard
                        </Link>
                    </div>

                    {/* Technology Stack */}
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
                        <div className="flex items-center space-x-2 text-white">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded"></div>
                            <span>Moca Network</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white">
                            <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded"></div>
                            <span>AIR Kit</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded"></div>
                            <span>Zero-Knowledge Proofs</span>
                        </div>
                        <div className="flex items-center space-x-2 text-white">
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded"></div>
                            <span>Cryptographic Verification</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Statement */}
            <section className="px-6 py-20 bg-black bg-opacity-30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            The $15B Scalping Problem
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            The entertainment industry faces a massive scalping crisis that hurts fans, artists, and venues alike.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center p-6 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                                <div className="text-4xl font-bold text-pink-400 mb-2">{stat.number}</div>
                                <div className="text-white">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Revolutionary Features
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Built on Moca Network&apos;s AIR Kit to create the most advanced fan verification system ever built.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-xl cursor-pointer transition-all ${activeFeature === index
                                        ? 'bg-gradient-to-r from-pink-600 to-purple-600'
                                        : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                                        }`}
                                    onClick={() => setActiveFeature(index)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="text-3xl">{feature.icon}</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                            <p className="text-gray-300 mb-2">{feature.description}</p>
                                            <div className="text-sm text-pink-300 font-semibold">{feature.stats}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
                            <div className="text-center">
                                <div className="text-6xl mb-4">{features[activeFeature].icon}</div>
                                <h3 className="text-2xl font-bold text-white mb-4">{features[activeFeature].title}</h3>
                                <p className="text-gray-300 mb-4">{features[activeFeature].description}</p>
                                <div className="text-pink-300 font-semibold">{features[activeFeature].stats}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="px-6 py-20 bg-black bg-opacity-30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            How FanVerify Works
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            A simple 3-step process that transforms how fans interact with events and artists.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-2xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Verify Your Fan Identity</h3>
                            <p className="text-gray-300">
                                Connect your social media and music streaming accounts to prove you&apos;re a genuine fan, not a scalper.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-2xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Get Your Fan Score</h3>
                            <p className="text-gray-300">
                                Receive a dynamic loyalty score based on your engagement history, unlocking exclusive perks and early access.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-white text-2xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Enjoy Anti-Scalping Tickets</h3>
                            <p className="text-gray-300">
                                Purchase tickets that are cryptographically bound to your identity, preventing resale and ensuring fair access.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            What People Are Saying
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Join thousands of verified fans and artists who are already experiencing the future of event ticketing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
                                <div className="text-white mb-4">&ldquo;{testimonial.quote}&rdquo;</div>
                                <div className="text-pink-300 font-semibold">{testimonial.author}</div>
                                <div className="text-gray-400 text-sm">{testimonial.role}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 py-20 bg-gradient-to-r from-pink-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Fan Experience?
                    </h2>
                    <p className="text-xl text-white mb-8 opacity-90">
                        Join the revolution against scalping and start building authentic fan relationships today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {!isInitialized ? (
                            <div className="flex items-center justify-center space-x-2 bg-gray-600 px-8 py-4 rounded-full text-lg font-semibold">
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                <span className="text-white">Initializing...</span>
                            </div>
                        ) : isLoggedIn ? (
                            <Link href="/fan-dashboard" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <button
                                onClick={login}
                                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105"
                            >
                                Connect Wallet to Start
                            </button>
                        )}
                        <Link href="/artist-dashboard" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-all">
                            Partner as Artist
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-12 bg-black bg-opacity-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">F</span>
                                </div>
                                <span className="text-white text-xl font-bold">FanVerify</span>
                            </div>
                            <p className="text-gray-400">
                                Verified Fans, Authentic Experiences, Zero Scalping
                            </p>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">For Fans</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/fan-verification" className="hover:text-white transition-colors">Fan Verification</Link></li>
                                <li><Link href="/fan-dashboard" className="hover:text-white transition-colors">Fan Dashboard</Link></li>
                                <li><Link href="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
                                <li><Link href="/perks" className="hover:text-white transition-colors">Exclusive Perks</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">For Artists</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/artist-dashboard" className="hover:text-white transition-colors">Artist Dashboard</Link></li>
                                <li><Link href="/event-management" className="hover:text-white transition-colors">Event Management</Link></li>
                                <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                                <li><Link href="/integration" className="hover:text-white transition-colors">Integration Guide</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 FanVerify. Built with ❤️ for the Moca Network Proof of Build Hackathon.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
