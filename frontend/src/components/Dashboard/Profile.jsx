import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Add profile update logic here if needed
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
    <div className="min-h-screen bg-cream">
      <main className="max-w-4xl mx-auto px-4 md:px-10 pt-32 pb-20">
                <header className="mb-10">
                    <h1 className="text-4xl font-display font-light text-charcoal">Profile Settings</h1>
                    <p className="text-mid mt-1">Manage your account information and preferences.</p>
                </header>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-beige p-8 md:p-12">
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="flex items-center gap-8 pb-8 border-b border-beige">
                            <div className="w-24 h-24 bg-sage-deep/20 rounded-full flex items-center justify-center text-sage-deep text-3xl font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div>
                                <button type="button" className="text-sm font-semibold text-blush-deep hover:underline">Change Photo</button>
                                <p className="text-xs text-mid mt-2">JPG, GIF or PNG. Max size 2MB.</p>
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
                            <label className="block text-xs font-semibold tracking-[0.15em] text-charcoal uppercase mb-3">Skin Journey Bio</label>
                            <textarea 
                                className="w-full bg-cream/50 border border-beige rounded-2xl px-5 py-4 text-charcoal focus:outline-none focus:border-blush-deep focus:ring-1 focus:ring-blush-deep transition-all h-32 resize-none"
                                placeholder="Tell us about your skin concerns..."
                            ></textarea>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-beige">
                            <Link to="/dashboard" className="text-sm font-medium text-mid hover:text-charcoal transition-colors order-2 sm:order-1">
                                ← Back to My Orders
                            </Link>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
                                <button 
                                    onClick={logout}
                                    type="button"
                                    className="px-8 py-4 rounded-full text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-all text-center"
                                >
                                    Sign Out
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="bg-charcoal text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-blush-deep transition-all disabled:opacity-70 shadow-lg"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
