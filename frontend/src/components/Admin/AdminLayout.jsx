import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { name: 'Overview', path: '/admin', icon: '📊' },
        { name: 'Products', path: '/admin/products', icon: '🛍️' },
        { name: 'Orders', path: '/admin/orders', icon: '📦' },
        { name: 'Users', path: '/admin/users', icon: '👥' },
    ];

    return (
        <div className="min-h-screen bg-[#f0f2f5] font-body text-charcoal">
            {/* Top Navigation */}
            <nav className="bg-charcoal text-white h-20 px-4 md:px-10 flex items-center justify-between sticky top-0 z-[1000] shadow-xl">
                <div className="flex items-center gap-12">
                    <Link to="/admin" className="flex items-center gap-3">
                        <span className="font-display text-2xl tracking-widest text-blush">ZEN ADMIN</span>
                        <span className="px-2 py-0.5 bg-blush-deep/20 border border-blush-deep/30 rounded text-[10px] font-bold text-blush tracking-widest uppercase">Console</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isActive ? 'bg-white/10 text-blush shadow-inner' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span>{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-xs font-bold text-white/90">{user?.name}</span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-blush/60">System Administrator</span>
                    </div>
                    
                    <Link to="/" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 group relative" title="View Store">
                        <span>🏪</span>
                    </Link>

                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-red-500/20"
                    >
                        <span>🚪</span>
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu (Bottom Tabs for convenience) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-charcoal border-t border-white/5 px-6 py-4 flex justify-between items-center z-[1000] backdrop-blur-xl bg-opacity-95">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${isActive ? 'text-blush' : 'text-white/40'}`}>
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Content Area */}
            <main className="max-w-7xl mx-auto p-4 md:p-10 pb-24 lg:pb-10">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
