import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddressModal({ isOpen, onClose, onSave, initialData = {} }) {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        phone: initialData.phone || '',
        addressLine: initialData.addressLine || '',
        city: initialData.city || '',
        state: initialData.state || '',
        pincode: initialData.pincode || ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Required';
        if (!formData.phone || formData.phone.length < 10) newErrors.phone = 'Valid phone required';
        if (!formData.addressLine) newErrors.addressLine = 'Required';
        if (!formData.city) newErrors.city = 'Required';
        if (!formData.state) newErrors.state = 'Required';
        if (!formData.pincode || formData.pincode.length < 6) newErrors.pincode = 'Valid pincode required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-charcoal/60 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-warm-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-lg p-6 md:p-12 shadow-2xl z-10 overflow-y-auto max-h-[90vh]"
                    >
                        <div className="text-center mb-8">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blush-deep mb-2 block">Shipping Details</span>
                            <h3 className="font-display text-3xl text-charcoal">Where shall we send your ritual?</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-mid ml-1">Full Name</label>
                                    <input 
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className={`w-full px-4 py-3 bg-cream/50 border ${errors.name ? 'border-red-300' : 'border-beige'} rounded-xl focus:outline-none focus:border-blush-deep transition-all`}
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-mid ml-1">Phone Number</label>
                                    <input 
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className={`w-full px-4 py-3 bg-cream/50 border ${errors.phone ? 'border-red-300' : 'border-beige'} rounded-xl focus:outline-none focus:border-blush-deep transition-all`}
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-mid ml-1">Address Line</label>
                                <textarea 
                                    rows="2"
                                    value={formData.addressLine}
                                    onChange={e => setFormData({...formData, addressLine: e.target.value})}
                                    className={`w-full px-4 py-3 bg-cream/50 border ${errors.addressLine ? 'border-red-300' : 'border-beige'} rounded-xl focus:outline-none focus:border-blush-deep transition-all resize-none`}
                                    placeholder="House No, Street, Landmark"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-mid ml-1">City</label>
                                    <input 
                                        value={formData.city}
                                        onChange={e => setFormData({...formData, city: e.target.value})}
                                        className={`w-full px-4 py-3 bg-cream/50 border ${errors.city ? 'border-red-300' : 'border-beige'} rounded-xl focus:outline-none focus:border-blush-deep transition-all`}
                                        placeholder="Mumbai"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-mid ml-1">State</label>
                                    <input 
                                        value={formData.state}
                                        onChange={e => setFormData({...formData, state: e.target.value})}
                                        className={`w-full px-4 py-3 bg-cream/50 border ${errors.state ? 'border-red-300' : 'border-beige'} rounded-xl focus:outline-none focus:border-blush-deep transition-all`}
                                        placeholder="MH"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-mid ml-1">Pincode</label>
                                    <input 
                                        type="number"
                                        value={formData.pincode}
                                        onChange={e => setFormData({...formData, pincode: e.target.value})}
                                        className={`w-full px-4 py-3 bg-cream/50 border ${errors.pincode ? 'border-red-300' : 'border-beige'} rounded-xl focus:outline-none focus:border-blush-deep transition-all`}
                                        placeholder="400001"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                <button 
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-2xl border border-beige text-charcoal text-xs font-bold uppercase tracking-widest hover:bg-cream transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-[2] py-4 rounded-2xl bg-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-blush-deep shadow-xl transition-all"
                                >
                                    Save & Open WhatsApp 💬
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
