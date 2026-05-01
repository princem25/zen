import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await forgotPassword({ email, setErrors, setStatus });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream relative overflow-hidden px-4">
            {/* Background Ornaments */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[radial-gradient(ellipse,rgba(242,196,206,0.4)_0%,rgba(181,201,176,0.1)_50%,transparent_70%)] blob-shape -z-10 blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[radial-gradient(ellipse,rgba(181,201,176,0.4)_0%,rgba(242,196,206,0.1)_50%,transparent_70%)] blob-shape -z-10 blur-3xl opacity-50" />

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/50 z-10 relative">
                <div className="text-center mb-10">
                    <Link to="/" className="font-display text-2xl tracking-[0.2em] text-charcoal block mb-8">
                        ZENPHIRA
                    </Link>
                    <h2 className="text-3xl font-light text-charcoal mb-2">Reset Password</h2>
                    <p className="text-mid text-sm">Forgot your password? No problem. Just let us know your email address and we will email you a password reset link.</p>
                </div>

                {status && (
                    <div className="mb-6 p-4 bg-sage-deep/10 border border-sage-deep/20 text-sage-deep text-sm rounded-xl text-center">
                        {status}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-charcoal uppercase mb-2">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-cream/50 border border-beige rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-blush-deep focus:ring-1 focus:ring-blush-deep transition-all placeholder:text-mid/50"
                            placeholder="hello@example.com"
                            required
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email[0]}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-charcoal text-white rounded-xl py-3.5 text-sm font-medium tracking-wide hover:bg-blush-deep transition-all disabled:opacity-70 mt-4 shadow-lg shadow-charcoal/10 hover:shadow-blush-deep/20"
                    >
                        {isSubmitting ? 'Sending link...' : 'Email Password Reset Link'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-mid">
                    Remember your password? <Link to="/login" className="text-charcoal font-medium hover:text-blush-deep transition-colors">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
