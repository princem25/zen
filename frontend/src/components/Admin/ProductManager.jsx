import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadToCloudinary, getCloudinaryUrl } from '../../lib/cloudinary';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Serum',
        stock: '',
        skinType: 'All',
        ingredients: '',
        badge: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const snap = await getDocs(collection(db, 'products'));
            setProducts(snap.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                img: getCloudinaryUrl(doc.data().img) 
            })));
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Cleanup old preview URL to prevent memory leaks
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let imageUrl = editingProduct?.img || '';

            if (imageFile) {
                try {
                    imageUrl = await uploadToCloudinary(imageFile);
                } catch (err) {
                    console.error("Cloudinary Upload Error:", err);
                    throw new Error(err.message || "Failed to upload to Cloudinary.");
                }
            } else if (formData.img) {
                imageUrl = formData.img;
            }

            const data = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                img: imageUrl,
                updatedAt: new Date().toISOString()
            };

            if (editingProduct) {
                await updateDoc(doc(db, 'products', editingProduct.id), data);
            } else {
                await addDoc(collection(db, 'products'), { ...data, createdAt: new Date().toISOString() });
            }

            setIsModalOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert("Error saving product: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', category: 'Serum', stock: '', skinType: 'All', ingredients: '', badge: '' });
        setEditingProduct(null);
        setImageFile(null);
        setImagePreview('');
    };

    const handleEdit = (p) => {
        setEditingProduct(p);
        setFormData({ ...p });
        setImagePreview(p.img);
        setIsModalOpen(true);
    };

    const handleDelete = async (p) => {
        if (!window.confirm(`Are you sure you want to delete ${p.name}?`)) return;
        setDeletingId(p.id);
        try {
            await deleteDoc(doc(db, 'products', p.id));
            fetchProducts();
        } catch (error) {
            alert("Error deleting product: " + error.message);
        } finally {
            setDeletingId(null);
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blush-deep/20 transition-all"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mid">🔍</span>
                </div>
                <button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-charcoal text-white px-8 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-blush-deep shadow-lg transition-all"
                >
                    + Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-widest text-mid">
                            <tr>
                                <th className="px-6 py-5">Image</th>
                                <th className="px-6 py-5">Name & Category</th>
                                <th className="px-6 py-5">Price</th>
                                <th className="px-6 py-5">Stock</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="p-10 text-center"><div className="w-8 h-8 border-2 border-blush-deep border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                            ) : filteredProducts.map((p) => (
                                <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream border border-gray-100">
                                            <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-charcoal text-sm">{p.name}</p>
                                        <span className="text-[10px] font-bold text-mid uppercase tracking-widest">{p.category}</span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-charcoal">₹{p.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-medium ${p.stock < 10 ? 'text-red-500 font-bold' : 'text-charcoal'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            {deletingId === p.id ? (
                                                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                            ) : (
                                                <>
                                                    <a href={`/product/${p.id}`} target="_blank" rel="noreferrer" title="View Product" className="p-2 hover:bg-cream text-charcoal rounded-lg transition-colors border border-transparent hover:border-beige">👁️</a>
                                                    <button onClick={() => handleEdit(p)} title="Edit Product" className="p-2 hover:bg-cream text-charcoal rounded-lg transition-colors border border-transparent hover:border-beige">✏️</button>
                                                    <button onClick={() => handleDelete(p)} title="Delete Product" className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100">🗑️</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-12 shadow-2xl"
                        >
                            <h3 className="font-display text-3xl text-charcoal mb-8">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Product Name</label>
                                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Category</label>
                                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all">
                                            <option>Serum</option>
                                            <option>Moisturizer</option>
                                            <option>Toner</option>
                                            <option>Night Cream</option>
                                            <option>Cleanser</option>
                                            <option>Sun Protection</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Price (₹)</label>
                                        <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Stock Quantity</label>
                                        <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Product Badge (Optional)</label>
                                        <input placeholder="e.g. Bestseller, New" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Target Skin Type</label>
                                        <select value={formData.skinType} onChange={e => setFormData({...formData, skinType: e.target.value})} className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all">
                                            <option>All Skin Types</option>
                                            <option>Oily</option>
                                            <option>Dry</option>
                                            <option>Sensitive</option>
                                            <option>Combination</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Full Ingredients List</label>
                                    <textarea rows="2" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all resize-none"></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Description</label>
                                    <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all resize-none"></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-mid">Product Image</label>
                                    <div className="flex flex-col gap-4">
                                        {/* File Upload */}
                                        <div className="flex items-center gap-6 p-4 bg-cream/30 border border-beige rounded-2xl">
                                            <div className="w-20 h-20 rounded-xl bg-white border-2 border-dashed border-beige overflow-hidden flex items-center justify-center group relative flex-shrink-0">
                                                {imagePreview ? (
                                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                                ) : editingProduct?.img ? (
                                                    <img src={editingProduct.img} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl text-beige group-hover:scale-110 transition-transform">📸</span>
                                                )}
                                                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold text-mid uppercase tracking-widest mb-1">Upload File</p>
                                                <p className="text-[9px] text-mid/60 leading-tight mb-3">Recommended: 1000x1000px. (Requires Storage CORS setup)</p>
                                                {imageFile && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => { setImageFile(null); setImagePreview(''); }}
                                                        className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:underline"
                                                    >
                                                        Remove Selected File
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="h-[1px] bg-beige flex-1"></div>
                                            <span className="text-[10px] font-bold text-beige uppercase tracking-widest">OR</span>
                                            <div className="h-[1px] bg-beige flex-1"></div>
                                        </div>

                                        {/* URL Paste */}
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-mid uppercase tracking-widest">Image URL (Fallback)</p>
                                            <input 
                                                type="text" 
                                                placeholder="https://images.unsplash.com/..." 
                                                value={formData.img || ''} 
                                                onChange={e => {
                                                    setFormData({...formData, img: e.target.value});
                                                    setImagePreview(e.target.value);
                                                    setImageFile(null); // Clear file if URL is pasted
                                                }} 
                                                className="w-full px-4 py-3 bg-cream/50 border border-beige rounded-xl focus:outline-none focus:border-blush-deep transition-all text-xs"
                                            />
                                            <p className="text-[9px] text-mid/60">Paste a link from Pinterest, Unsplash, or Cloudinary here.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 rounded-2xl border border-beige text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-cream transition-all"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-[2] py-4 rounded-2xl bg-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-blush-deep shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            editingProduct ? 'Update Product' : 'Create Product'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManager;
