import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import AddressModal from '../Checkout/AddressModal';

export default function Profile() {
    const { user, logout, updateUserAddress } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Add profile update logic here if needed
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleAddressSave = async (addressData) => {
        await updateUserAddress(addressData);
        setIsAddressModalOpen(false);
    };

    return (
    <div className="min-h-screen bg-cream">
      <main className="max-w-4xl mx-auto px-4 md:px-10 pt-32 pb-20">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-light text-charcoal">Profile Settings</h1>
                    <p className="text-sm md:text-lg text-mid mt-2">Manage your account and rituals.</p>
                </header>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-beige p-8 md:p-12">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 pb-8 border-b border-beige">
                            <div className="w-20 h-20 md:w-28 md:h-28 bg-sage-deep/20 rounded-full flex items-center justify-center text-sage-deep text-2xl md:text-4xl font-bold border-2 border-white shadow-lg">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="text-center sm:text-left">
                                <button type="button" className="text-sm font-semibold text-blush-deep hover:underline">Change Photo</button>
                                <p className="text-[10px] md:text-xs text-mid mt-1 uppercase tracking-widest">Max size 2MB (JPG/PNG)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-semibold tracking-[0.15em] text-charcoal uppercase mb-3">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-cream/50 border border-beige rounded-2xl px-5 py-4 text-charcoal focus:outline-none focus:border-blush-deep focus:ring-1 focus:ring-blush-deep transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold tracking-[0.15em] text-charcoal uppercase mb-3">Email Address</label>
                                <input 
                                    type="email" 
                                    value={email}
                                    disabled
                                    className="w-full bg-beige/30 border border-beige rounded-2xl px-5 py-4 text-mid cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold tracking-[0.15em] text-charcoal uppercase mb-4">Saved Shipping Address</label>
                            {user?.address ? (
                                <div className="bg-cream/40 border border-beige rounded-[2rem] p-5 md:p-8 relative">
                                    <div className="space-y-1 mb-4 md:mb-0">
                                        <p className="font-bold text-charcoal">{user.address.name}</p>
                                        <p className="text-sm text-mid">{user.address.phone}</p>
                                        <p className="text-sm text-mid">{user.address.addressLine}</p>
                                        <p className="text-sm text-mid">{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="md:absolute md:top-8 md:right-8 text-[10px] font-bold uppercase tracking-widest text-blush-deep bg-blush/10 md:bg-transparent px-4 py-2 md:px-0 md:py-0 rounded-full md:rounded-none hover:text-charcoal transition-colors w-fit"
                                    >
                                        Edit Address
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-cream/40 border border-beige border-dashed rounded-[2rem] p-8 text-center">
                                    <p className="text-mid text-sm mb-4">No shipping address saved yet.</p>
                                    <button 
                                        type="button"
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal border border-charcoal/20 px-6 py-2 rounded-full hover:bg-charcoal hover:text-white transition-all"
                                    >
                                        + Add Address
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-6 pt-10 mt-4 border-t border-beige">
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 bg-charcoal text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-blush-deep transition-all disabled:opacity-70 shadow-lg"
                                >
                                    {isSaving ? 'Saving Changes...' : 'Save Profile'}
                                </button>
                                <button 
                                    onClick={logout}
                                    type="button"
                                    className="flex-1 px-8 py-4 rounded-full text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-all text-center border border-red-100"
                                >
                                    Sign Out
                                </button>
                            </div>
                            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-xs font-bold uppercase tracking-[0.2em] text-mid hover:text-charcoal transition-colors text-center">
                                ← Back to {user?.role === 'admin' ? 'Admin Panel' : 'My Orders'}
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            <AddressModal 
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onSave={handleAddressSave}
                initialData={user?.address || { name: user?.name || '' }}
            />
        </div>
    );
}
