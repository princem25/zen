import React, { useState, useEffect } from 'react';
import { collectionGroup, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const ReviewManager = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Using collectionGroup to find reviews across all products
            const snap = await getDocs(collectionGroup(db, 'reviews'));
            setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data(), ref: doc.ref })));
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (review) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            await deleteDoc(review.ref);
            setReviews(reviews.filter(r => r.id !== review.id));
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-mid">
                        <tr>
                            <th className="px-6 py-5">Product</th>
                            <th className="px-6 py-5">Customer</th>
                            <th className="px-6 py-5">Rating</th>
                            <th className="px-6 py-5">Comment</th>
                            <th className="px-6 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="5" className="p-10 text-center">Loading reviews...</td></tr>
                        ) : reviews.map((r) => (
                            <tr key={r.id} className="text-sm">
                                <td className="px-6 py-4 font-bold text-charcoal">{r.productName || 'Unknown'}</td>
                                <td className="px-6 py-4 text-mid">{r.userName || 'Anonymous'}</td>
                                <td className="px-6 py-4 text-amber-500 font-bold">{r.rating} ⭐</td>
                                <td className="px-6 py-4 max-w-xs text-mid truncate">{r.comment}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(r)} className="text-red-400 hover:text-red-600 transition-colors">🗑️ Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReviewManager;
