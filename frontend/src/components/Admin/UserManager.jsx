import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion } from 'framer-motion';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const snap = await getDocs(collection(db, 'users'));
            setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAdmin = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Are you sure you want to make ${user.name} a ${newRole}?`)) return;
        
        try {
            await updateDoc(doc(db, 'users', user.id), { role: newRole });
            setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        } catch (error) {
            alert("Error updating role: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-mid">
                            <tr>
                                <th className="px-6 py-5">User</th>
                                <th className="px-6 py-5">Email</th>
                                <th className="px-6 py-5">Role</th>
                                <th className="px-6 py-5">Joined</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center"><div className="w-8 h-8 border-2 border-blush-deep border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : users.map((u) => (
                                <tr key={u.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center font-bold text-xs text-charcoal">
                                                {u.name?.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-charcoal">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-mid">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {u.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-mid">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => toggleAdmin(u)}
                                            className={`text-xs font-bold uppercase tracking-widest transition-colors ${u.role === 'admin' ? 'text-red-400 hover:text-red-600' : 'text-blush-deep hover:text-charcoal'}`}
                                        >
                                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManager;
