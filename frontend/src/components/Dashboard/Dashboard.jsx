import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-beige flex flex-col p-6">
                <Link to="/" className="font-display text-xl tracking-[0.2em] text-charcoal mb-10 block">
                    ZENPHIRA
                </Link>
                
                <nav className="flex-1 space-y-2">
                    <Link to="/dashboard" className="block px-4 py-2 rounded-lg bg-blush-deep/10 text-blush-deep font-medium">
                        Dashboard
                    </Link>
                    <a href="#" className="block px-4 py-2 rounded-lg text-mid hover:bg-cream transition-all">
                        My Orders
                    </a>
                    <a href="#" className="block px-4 py-2 rounded-lg text-mid hover:bg-cream transition-all">
                        Skin Profile
                    </a>
                    <a href="#" className="block px-4 py-2 rounded-lg text-mid hover:bg-cream transition-all">
                        Settings
                    </a>
                </nav>

                <button 
                    onClick={logout}
                    className="mt-auto px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-50 rounded-lg transition-all text-left"
                >
                    Log Out
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:p-12 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-light text-charcoal">Welcome, {user?.name}</h1>
                        <p className="text-mid mt-1">Here is what is happening with your skincare journey.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-sage-deep/20 rounded-full flex items-center justify-center text-sage-deep font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige">
                        <span className="text-xs font-semibold text-mid uppercase tracking-wider">Total Orders</span>
                        <div className="text-2xl font-bold text-charcoal mt-1">0</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige">
                        <span className="text-xs font-semibold text-mid uppercase tracking-wider">Loyalty Points</span>
                        <div className="text-2xl font-bold text-charcoal mt-1">150</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-beige">
                        <span className="text-xs font-semibold text-mid uppercase tracking-wider">Next Routine</span>
                        <div className="text-2xl font-bold text-charcoal mt-1">Morning</div>
                    </div>
                </div>

                {/* Recent Activity / Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-beige p-8">
                    <h3 className="text-lg font-medium text-charcoal mb-6">Recent Activity</h3>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-beige">✦</span>
                        </div>
                        <p className="text-mid text-sm">No recent orders yet. Start your journey by exploring our collection.</p>
                        <Link to="/" className="mt-4 text-blush-deep font-medium hover:underline">
                            Browse Products
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
