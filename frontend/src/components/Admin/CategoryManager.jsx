import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const snap = await getDocs(collection(db, 'categories'));
            setCategories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory) return;
        try {
            await addDoc(collection(db, 'categories'), { name: newCategory });
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'categories', id));
            fetchCategories();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="max-w-2xl bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h3 className="font-display text-2xl text-charcoal mb-6">Manage Categories</h3>
            <form onSubmit={handleAdd} className="flex gap-4 mb-8">
                <input 
                    type="text" 
                    placeholder="New category name..." 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all"
                />
                <button type="submit" className="bg-charcoal text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blush-deep transition-all">Add</button>
            </form>

            <div className="space-y-3">
                {loading ? <p>Loading...</p> : categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="font-medium text-charcoal">{cat.name}</span>
                        <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 transition-colors">🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryManager;
