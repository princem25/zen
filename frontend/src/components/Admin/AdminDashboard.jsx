import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pSnap, oSnap, uSnap] = await Promise.all([
                    getDocs(collection(db, 'products')),
                    getDocs(collection(db, 'orders')),
                    getDocs(collection(db, 'users'))
                ]);

                setStats({
                    products: pSnap.size,
                    orders: oSnap.size,
                    users: uSnap.size,
                    revenue: oSnap.docs.reduce((acc, doc) => acc + (doc.data().total || 0), 0)
                });

                // Fetch recent orders
                const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
                const recentSnap = await getDocs(q);
                setRecentOrders(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Products', value: stats.products, icon: '🛍️', color: 'bg-blue-500' },
        { title: 'Total Orders', value: stats.orders, icon: '📦', color: 'bg-green-500' },
        { title: 'Customers', value: stats.users, icon: '👥', color: 'bg-purple-500' },
        { title: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: 'bg-amber-500' },
    ];

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blush-deep border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6"
                    >
                        <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg shadow-${card.color.split('-')[1]}-500/20`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-mid uppercase tracking-widest">{card.title}</p>
                            <h3 className="text-2xl font-bold text-charcoal mt-1">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-charcoal">Recent Orders</h3>
                        <button className="text-xs font-bold text-blush-deep hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] font-bold uppercase tracking-widest text-mid">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.length > 0 ? recentOrders.map((order) => (
                                    <tr key={order.id} className="text-sm hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-mid">#{order.id.slice(-8)}</td>
                                        <td className="px-6 py-4 font-medium text-charcoal">{order.customerName || 'Guest'}</td>
                                        <td className="px-6 py-4 font-bold text-charcoal">₹{order.total}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-600' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                                {order.status || 'pending'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-mid italic">No recent orders yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-charcoal mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-3 rounded-xl bg-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-blush-deep transition-all">Add New Product</button>
                            <button className="w-full py-3 rounded-xl bg-white border border-beige text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-cream transition-all">Export Orders</button>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blush-deep to-[#d4788a] p-6 rounded-3xl text-white shadow-xl shadow-blush-deep/20">
                        <h3 className="font-bold mb-2">Inventory Alert</h3>
                        <p className="text-sm text-white/80 mb-4">5 products are currently low in stock and need replenishment.</p>
                        <button className="text-xs font-bold underline">Check Inventory</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
