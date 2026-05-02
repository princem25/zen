import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            alert("Error updating status: " + error.message);
        }
    };

    const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-600';
            case 'shipped': return 'bg-blue-100 text-blue-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-amber-100 text-amber-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status ? 'bg-charcoal text-white shadow-lg' : 'bg-white text-mid border border-gray-100 hover:border-blush-deep'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-mid">
                            <tr>
                                <th className="px-6 py-5">Order ID</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5">Customer</th>
                                <th className="px-6 py-5">Total</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="p-10 text-center"><div className="w-8 h-8 border-2 border-blush-deep border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : filteredOrders.map((o) => (
                                <tr key={o.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-mid">#{o.id.slice(-8)}</td>
                                    <td className="px-6 py-4 text-xs text-charcoal">{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-charcoal">{o.customerName || 'Guest'}</p>
                                        <p className="text-[10px] text-mid">{o.customerEmail}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-charcoal">₹{o.total}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(o.status)}`}>
                                            {o.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedOrder(o)}
                                            className="text-xs font-bold text-blush-deep hover:underline"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 md:p-12 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-display text-3xl text-charcoal">Order Details</h3>
                                <button onClick={() => setSelectedOrder(null)} className="text-3xl text-light hover:text-charcoal transition-colors">×</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-mid mb-4">Customer Info</h4>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-charcoal">{selectedOrder.customerName}</p>
                                        <p className="text-sm text-mid">{selectedOrder.customerEmail}</p>
                                        <p className="text-sm text-mid mt-2">{selectedOrder.address}</p>
                                        <p className="text-sm text-mid">{selectedOrder.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-mid mb-4">Order Status</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['pending', 'shipped', 'delivered', 'cancelled'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedOrder.status === status ? getStatusColor(status) : 'bg-gray-50 text-mid border border-transparent hover:border-gray-200'}`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-mid mb-6">Order Items</h4>
                                <div className="space-y-4">
                                    {selectedOrder.items?.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-cream overflow-hidden">
                                                    <img src={item.img} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-charcoal">{item.name}</p>
                                                    <p className="text-xs text-mid">{item.qty} x ₹{item.price}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-charcoal">₹{item.qty * item.price}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-display text-xl text-charcoal">Total Amount</span>
                                    <span className="font-display text-2xl font-bold text-blush-deep">₹{selectedOrder.total}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderManager;
