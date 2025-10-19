'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAirKit } from '@/components/AirKitProvider';

interface Event {
    id: number;
    name: string;
    date: string;
    venue: string;
    ticketsSold: number;
    totalTickets: number;
    revenue: number;
    minFanScore: number;
    status: 'upcoming' | 'ongoing' | 'completed';
}

interface FanAnalytics {
    totalVerifiedFans: number;
    averageFanScore: number;
    topFansCount: number;
    newFansThisMonth: number;
    totalRevenue: number;
    ticketsSold: number;
}

export default function ArtistDashboard() {
    const { isLoggedIn, userAddress, logout } = useAirKit();
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'fans' | 'credentials'>('overview');
    
    // Mock data - in production, fetch from backend/smart contract
    const [analytics] = useState<FanAnalytics>({
        totalVerifiedFans: 15420,
        averageFanScore: 78,
        topFansCount: 2340,
        newFansThisMonth: 1250,
        totalRevenue: 458900,
        ticketsSold: 8450,
    });

    const [events] = useState<Event[]>([
        {
            id: 1,
            name: "Summer Tour 2025 - Los Angeles",
            date: "2025-07-15",
            venue: "SoFi Stadium",
            ticketsSold: 45000,
            totalTickets: 50000,
            revenue: 2250000,
            minFanScore: 70,
            status: 'upcoming'
        },
        {
            id: 2,
            name: "Acoustic Sessions - New York",
            date: "2025-08-20",
            venue: "Madison Square Garden",
            ticketsSold: 18000,
            totalTickets: 20000,
            revenue: 900000,
            minFanScore: 80,
            status: 'upcoming'
        },
        {
            id: 3,
            name: "Festival Headliner - Miami",
            date: "2025-09-10",
            venue: "Miami Beach",
            ticketsSold: 0,
            totalTickets: 30000,
            revenue: 0,
            minFanScore: 60,
            status: 'upcoming'
        }
    ]);

    const [topFans] = useState([
        { address: '0x1234...5678', score: 98, eventsAttended: 12, totalSpent: 4500 },
        { address: '0x2345...6789', score: 96, eventsAttended: 10, totalSpent: 3800 },
        { address: '0x3456...7890', score: 94, eventsAttended: 9, totalSpent: 3200 },
        { address: '0x4567...8901', score: 92, eventsAttended: 8, totalSpent: 2900 },
        { address: '0x5678...9012', score: 90, eventsAttended: 7, totalSpent: 2500 },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-500';
            case 'ongoing': return 'bg-green-500';
            case 'completed': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 80) return 'text-blue-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Header */}
            <header className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-white border-opacity-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/landing" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">F</span>
                                </div>
                                <span className="text-white text-xl font-bold">FanVerify</span>
                            </Link>
                            <span className="text-gray-400">|</span>
                            <span className="text-white font-semibold">Artist Dashboard</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isLoggedIn ? (
                                <>
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
                                </>
                            ) : (
                                <Link href="/landing" className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full transition-colors">
                                    Connect Wallet
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-4 px-2 border-b-2 transition-colors ${
                                activeTab === 'overview'
                                    ? 'border-pink-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`py-4 px-2 border-b-2 transition-colors ${
                                activeTab === 'events'
                                    ? 'border-pink-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Events
                        </button>
                        <button
                            onClick={() => setActiveTab('fans')}
                            className={`py-4 px-2 border-b-2 transition-colors ${
                                activeTab === 'fans'
                                    ? 'border-pink-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Fan Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab('credentials')}
                            className={`py-4 px-2 border-b-2 transition-colors ${
                                activeTab === 'credentials'
                                    ? 'border-pink-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}
                        >
                            Credentials
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Welcome Section */}
                        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-8 text-white">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, Artist! 🎵</h1>
                            <p className="text-lg opacity-90">
                                Manage your events, connect with verified fans, and grow your authentic fanbase.
                            </p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300">Verified Fans</span>
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">
                                    {analytics.totalVerifiedFans.toLocaleString()}
                                </div>
                                <div className="text-green-400 text-sm">+{analytics.newFansThisMonth} this month</div>
                            </div>

                            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300">Avg Fan Score</span>
                                    <span className="text-2xl">⭐</span>
                                </div>
                                <div className={`text-3xl font-bold mb-1 ${getScoreColor(analytics.averageFanScore)}`}>
                                    {analytics.averageFanScore}
                                </div>
                                <div className="text-gray-400 text-sm">Out of 100</div>
                            </div>

                            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300">Total Revenue</span>
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">
                                    ${analytics.totalRevenue.toLocaleString()}
                                </div>
                                <div className="text-gray-400 text-sm">{analytics.ticketsSold} tickets sold</div>
                            </div>

                            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300">Top Fans</span>
                                    <span className="text-2xl">🏆</span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">
                                    {analytics.topFansCount.toLocaleString()}
                                </div>
                                <div className="text-gray-400 text-sm">Score 90+</div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-105 text-left">
                                    <div className="text-2xl mb-2">🎫</div>
                                    <div className="font-semibold">Create New Event</div>
                                    <div className="text-sm opacity-80">Set up your next concert</div>
                                </button>
                                <Link href="/issue-credential" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-105 text-left block">
                                    <div className="text-2xl mb-2">🎖️</div>
                                    <div className="font-semibold">Issue Credentials</div>
                                    <div className="text-sm opacity-80">Reward your top fans</div>
                                </Link>
                                <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-105 text-left">
                                    <div className="text-2xl mb-2">📊</div>
                                    <div className="font-semibold">View Analytics</div>
                                    <div className="text-sm opacity-80">Deep dive into fan data</div>
                                </button>
                            </div>
                        </div>

                        {/* Recent Events */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">Recent Events</h2>
                                <button
                                    onClick={() => setActiveTab('events')}
                                    className="text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                    View All →
                                </button>
                            </div>
                            <div className="space-y-4">
                                {events.slice(0, 3).map(event => (
                                    <div key={event.id} className="bg-white bg-opacity-5 rounded-lg p-4 hover:bg-opacity-10 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-grow">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)} text-white`}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                                <div className="text-gray-300 text-sm space-y-1">
                                                    <div>📍 {event.venue}</div>
                                                    <div>📅 {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                                    <div>🎫 {event.ticketsSold.toLocaleString()} / {event.totalTickets.toLocaleString()} tickets sold ({Math.round((event.ticketsSold / event.totalTickets) * 100)}%)</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-green-400">${event.revenue.toLocaleString()}</div>
                                                <div className="text-gray-400 text-sm">Revenue</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Events Tab */}
                {activeTab === 'events' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Event Management</h2>
                            <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-full transition-all transform hover:scale-105">
                                + Create New Event
                            </button>
                        </div>

                        {events.map(event => (
                            <div key={event.id} className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-2xl font-bold text-white">{event.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)} text-white`}>
                                                {event.status}
                                            </span>
                                        </div>
                                        <div className="text-gray-300 space-y-1">
                                            <div>📍 {event.venue}</div>
                                            <div>📅 {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-green-400">${event.revenue.toLocaleString()}</div>
                                        <div className="text-gray-400">Total Revenue</div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                        <div className="text-gray-300 text-sm mb-1">Tickets Sold</div>
                                        <div className="text-2xl font-bold text-white">{event.ticketsSold.toLocaleString()}</div>
                                        <div className="text-gray-400 text-sm">of {event.totalTickets.toLocaleString()}</div>
                                        <div className="mt-2 bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all"
                                                style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                        <div className="text-gray-300 text-sm mb-1">Min Fan Score</div>
                                        <div className={`text-2xl font-bold ${getScoreColor(event.minFanScore)}`}>{event.minFanScore}</div>
                                        <div className="text-gray-400 text-sm">Required to purchase</div>
                                    </div>
                                    <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                        <div className="text-gray-300 text-sm mb-1">Anti-Scalping</div>
                                        <div className="text-2xl font-bold text-green-400">✓ Active</div>
                                        <div className="text-gray-400 text-sm">AIR Kit verified</div>
                                    </div>
                                </div>

                                <div className="flex space-x-3">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                        Edit Event
                                    </button>
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                        View Analytics
                                    </button>
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                                        Issue Credentials
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Fan Analytics Tab */}
                {activeTab === 'fans' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">Fan Analytics</h2>

                        {/* Fan Score Distribution */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <h3 className="text-xl font-bold text-white mb-4">Fan Score Distribution</h3>
                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4">
                                    <div className="text-green-400 text-3xl font-bold mb-1">2,340</div>
                                    <div className="text-white font-semibold">Elite Fans</div>
                                    <div className="text-gray-300 text-sm">Score 90-100</div>
                                </div>
                                <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-4">
                                    <div className="text-blue-400 text-3xl font-bold mb-1">5,680</div>
                                    <div className="text-white font-semibold">Super Fans</div>
                                    <div className="text-gray-300 text-sm">Score 80-89</div>
                                </div>
                                <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
                                    <div className="text-yellow-400 text-3xl font-bold mb-1">4,920</div>
                                    <div className="text-white font-semibold">Loyal Fans</div>
                                    <div className="text-gray-300 text-sm">Score 70-79</div>
                                </div>
                                <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4">
                                    <div className="text-red-400 text-3xl font-bold mb-1">2,480</div>
                                    <div className="text-white font-semibold">New Fans</div>
                                    <div className="text-gray-300 text-sm">Score 0-69</div>
                                </div>
                            </div>
                        </div>

                        {/* Top Fans */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <h3 className="text-xl font-bold text-white mb-4">Top Fans 🏆</h3>
                            <div className="space-y-3">
                                {topFans.map((fan, index) => (
                                    <div key={fan.address} className="bg-white bg-opacity-5 rounded-lg p-4 hover:bg-opacity-10 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                                                <div>
                                                    <div className="text-white font-semibold">{fan.address}</div>
                                                    <div className="text-gray-400 text-sm">
                                                        {fan.eventsAttended} events attended • ${fan.totalSpent.toLocaleString()} spent
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-3xl font-bold ${getScoreColor(fan.score)}`}>{fan.score}</div>
                                                <div className="text-gray-400 text-sm">Fan Score</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fan Engagement Trends */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <h3 className="text-xl font-bold text-white mb-4">Engagement Trends</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                    <div className="text-gray-300 text-sm mb-1">New Fans This Month</div>
                                    <div className="text-3xl font-bold text-green-400">+1,250</div>
                                    <div className="text-gray-400 text-sm">↑ 15% from last month</div>
                                </div>
                                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                    <div className="text-gray-300 text-sm mb-1">Avg Events per Fan</div>
                                    <div className="text-3xl font-bold text-blue-400">3.2</div>
                                    <div className="text-gray-400 text-sm">↑ 8% from last month</div>
                                </div>
                                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                    <div className="text-gray-300 text-sm mb-1">Fan Retention Rate</div>
                                    <div className="text-3xl font-bold text-purple-400">87%</div>
                                    <div className="text-gray-400 text-sm">↑ 5% from last month</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Credentials Tab */}
                {activeTab === 'credentials' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Credential Management</h2>
                            <Link href="/issue-credential" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-full transition-all transform hover:scale-105">
                                + Issue New Credential
                            </Link>
                        </div>

                        {/* Credential Types */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-3xl">🎖️</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Fan Verification</h3>
                                        <p className="text-gray-300 text-sm">Verify authentic fans through AIR Kit</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Issued</span>
                                        <span className="text-white font-semibold">15,420</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Active</span>
                                        <span className="text-green-400 font-semibold">14,892</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Revoked</span>
                                        <span className="text-red-400 font-semibold">528</span>
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    Manage Credentials
                                </button>
                            </div>

                            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-3xl">🎫</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Event Tickets</h3>
                                        <p className="text-gray-300 text-sm">Anti-scalping ticket credentials</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Issued</span>
                                        <span className="text-white font-semibold">8,450</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Used</span>
                                        <span className="text-green-400 font-semibold">6,230</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Pending</span>
                                        <span className="text-yellow-400 font-semibold">2,220</span>
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    View Tickets
                                </button>
                            </div>

                            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-3xl">⭐</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Loyalty Rewards</h3>
                                        <p className="text-gray-300 text-sm">VIP and exclusive access credentials</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Elite Tier</span>
                                        <span className="text-white font-semibold">2,340</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">VIP Tier</span>
                                        <span className="text-blue-400 font-semibold">5,680</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Standard Tier</span>
                                        <span className="text-gray-400 font-semibold">7,400</span>
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    Manage Rewards
                                </button>
                            </div>

                            <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-3xl">🎁</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Exclusive Perks</h3>
                                        <p className="text-gray-300 text-sm">Special access and merchandise</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Meet & Greet</span>
                                        <span className="text-white font-semibold">450</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Backstage Pass</span>
                                        <span className="text-purple-400 font-semibold">280</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Merch Discount</span>
                                        <span className="text-pink-400 font-semibold">3,120</span>
                                    </div>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                    Create Perks
                                </button>
                            </div>
                        </div>

                        {/* Recent Credential Activity */}
                        <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20">
                            <h3 className="text-xl font-bold text-white mb-4">Recent Credential Activity</h3>
                            <div className="space-y-3">
                                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">🎖️</span>
                                            <div>
                                                <div className="text-white font-semibold">Fan Verification Issued</div>
                                                <div className="text-gray-400 text-sm">0x1234...5678 • 2 hours ago</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                            Issued
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">🎫</span>
                                            <div>
                                                <div className="text-white font-semibold">Event Ticket Verified</div>
                                                <div className="text-gray-400 text-sm">0x2345...6789 • 5 hours ago</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                                            Verified
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">⭐</span>
                                            <div>
                                                <div className="text-white font-semibold">VIP Access Granted</div>
                                                <div className="text-gray-400 text-sm">0x3456...7890 • 1 day ago</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                                            Granted
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

