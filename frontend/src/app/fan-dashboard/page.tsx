'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAirKit } from '@/components/AirKitProvider';

export default function FanDashboard() {
    const { isLoggedIn, userAddress, logout } = useAirKit();
    const [fanScore] = useState(85);
    const [verificationStatus] = useState({
        fanAuthenticity: true,
        eventAttendance: true,
        loyaltyScore: true,
        socialMedia: false
    });

    const [upcomingEvents] = useState([
        {
            id: 1,
            name: "Taylor Swift - The Eras Tour",
            date: "2024-03-15",
            venue: "Madison Square Garden",
            fanScoreRequired: 80,
            earlyAccess: true,
            perks: ["Early Access", "VIP Lounge", "Meet & Greet"]
        },
        {
            id: 2,
            name: "Billie Eilish - Happier Than Ever",
            date: "2024-04-22",
            venue: "Hollywood Bowl",
            fanScoreRequired: 70,
            earlyAccess: true,
            perks: ["Early Access", "Exclusive Merch"]
        },
        {
            id: 3,
            name: "The Weeknd - After Hours Til Dawn",
            date: "2024-05-10",
            venue: "SoFi Stadium",
            fanScoreRequired: 75,
            earlyAccess: false,
            perks: ["VIP Package"]
        }
    ]);

    const [fanHistory] = useState([
        {
            event: "Ariana Grande - Sweetener World Tour",
            date: "2023-12-15",
            score: 90,
            perks: ["Early Access", "VIP Lounge"]
        },
        {
            event: "Drake - It's All A Blur Tour",
            date: "2023-11-20",
            score: 85,
            perks: ["Early Access"]
        },
        {
            event: "Olivia Rodrigo - Sour Tour",
            date: "2023-10-08",
            score: 88,
            perks: ["Meet & Greet", "Exclusive Merch"]
        }
    ]);

    const [availablePerks] = useState([
        {
            name: "Early Access Pass",
            description: "Get 24-hour early access to ticket sales",
            scoreRequired: 80,
            available: true
        },
        {
            name: "VIP Lounge Access",
            description: "Exclusive VIP area at concerts",
            scoreRequired: 90,
            available: true
        },
        {
            name: "Meet & Greet",
            description: "Backstage meet and greet with artists",
            scoreRequired: 95,
            available: false
        },
        {
            name: "Exclusive Merch Drop",
            description: "Limited edition merchandise",
            scoreRequired: 70,
            available: true
        }
    ]);

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
                    <p className="text-gray-300 mb-8">You need to be logged in to access your fan dashboard.</p>
                    <Link href="/landing" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full transition-colors">
                        Go to Landing Page
                    </Link>
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
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-white text-sm">
                                    {userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : 'Connected'}
                                </span>
                            </div>
                            <button
                                onClick={logout}
                                className="text-white hover:text-pink-300 transition-colors px-3 py-1 rounded-lg hover:bg-white hover:bg-opacity-10"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Fan Profile Section */}
                <div className="bg-white bg-opacity-10 rounded-xl p-8 mb-8 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">👤</span>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-black mb-2">Verified Fan</h1>
                                <p className="text-gray-300">Member since March 2024</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className={`text-4xl font-bold mb-2 ${getScoreColor(fanScore)}`}>
                                {fanScore}
                            </div>
                            <div className="text-white mb-2">Fan Loyalty Score</div>
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBadge(fanScore)} text-white`}>
                                {fanScore >= 90 ? 'Elite Fan' : fanScore >= 80 ? 'Super Fan' : fanScore >= 70 ? 'Loyal Fan' : 'New Fan'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Status */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {Object.entries(verificationStatus).map(([key, verified]) => (
                        <div key={key} className={`p-4 rounded-xl border ${verified ? 'bg-green-500 bg-opacity-20 border-green-400' : 'bg-red-500 bg-opacity-20 border-red-400'} backdrop-blur-sm`}>
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${verified ? 'bg-green-500' : 'bg-red-500'}`}>
                                    <span className="text-white text-sm font-bold">{verified ? '✓' : '✗'}</span>
                                </div>
                                <div>
                                    <div className="text-white font-semibold capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div className={`text-sm ${verified ? 'text-green-300' : 'text-red-300'}`}>
                                        {verified ? 'Verified' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Upcoming Events */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-15 transition-all">
                                    <div className="flex flex-col md:flex-row items-start justify-between">
                                        <div className="mb-4 md:mb-0 flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                                            <div className="text-gray-300 mb-3">{event.date} • {event.venue}</div>
                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="text-sm text-gray-300">
                                                    Required Score: <span className="text-pink-400 font-semibold">{event.fanScoreRequired}</span>
                                                </div>
                                                {event.earlyAccess && (
                                                    <div className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                        Early Access
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4">
                                                <div className="text-sm text-gray-300 mb-2">Available Perks:</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {event.perks.map((perk, index) => (
                                                        <div key={index} className="bg-purple-500 bg-opacity-30 text-purple-200 px-3 py-1 rounded-full text-xs font-medium border border-purple-400 border-opacity-30">
                                                            {perk}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-3 min-w-[140px]">
                                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${fanScore >= event.fanScoreRequired
                                                ? 'bg-green-500 text-white'
                                                : 'bg-red-500 text-white'
                                                }`}>
                                                {fanScore >= event.fanScoreRequired ? 'Eligible' : 'Score Too Low'}
                                            </div>
                                            <button className={`px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105 ${fanScore >= event.fanScoreRequired
                                                ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-lg'
                                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                                }`}>
                                                {fanScore >= event.fanScoreRequired ? 'Get Tickets' : 'Improve Score'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Available Perks */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <h3 className="text-xl font-bold text-white mb-4">Available Perks</h3>
                            <div className="space-y-3">
                                {availablePerks.map((perk, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${perk.available ? 'bg-green-500 bg-opacity-20 border-green-400' : 'bg-gray-500 bg-opacity-20 border-gray-400'}`}>
                                        <div className="text-white font-semibold mb-2">{perk.name}</div>
                                        <div className="text-gray-300 text-sm mb-2">{perk.description}</div>
                                        <div className="text-xs text-gray-400">
                                            Score Required: <span className="font-semibold">{perk.scoreRequired}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fan History */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <h3 className="text-xl font-bold text-white mb-4">Fan History</h3>
                            <div className="space-y-3">
                                {fanHistory.map((event, index) => (
                                    <div key={index} className="p-4 bg-white bg-opacity-5 rounded-lg border border-white border-opacity-10 hover:bg-opacity-10 transition-all">
                                        <div className="text-white font-semibold mb-2">{event.event}</div>
                                        <div className="text-gray-300 text-sm mb-3">{event.date}</div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-400">
                                                Score: <span className="font-semibold text-pink-400">{event.score}</span>
                                            </div>
                                            <div className="text-xs text-purple-300">
                                                {event.perks.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link href="/fan-verification" className="block w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg text-center transition-all transform hover:scale-105 shadow-lg">
                                    Improve Fan Score
                                </Link>
                                <Link href="/events" className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-3 rounded-lg text-center transition-all transform hover:scale-105 shadow-lg">
                                    Browse All Events
                                </Link>
                                <Link href="/perks" className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg text-center transition-all transform hover:scale-105 shadow-lg">
                                    View All Perks
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
