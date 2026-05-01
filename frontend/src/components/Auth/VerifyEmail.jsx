import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function VerifyEmail() {
    const { resendVerification, logout } = useAuth();
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleResend = async () => {
        setIsSubmitting(true);
        await resendVerification({ setStatus });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream relative overflow-hidden px-4">
            {/* Background Ornaments */}
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[radial-gradient(ellipse,rgba(181,201,176,0.4)_0%,rgba(242,196,206,0.1)_50%,transparent_70%)] blob-shape -z-10 blur-3xl opacity-50" />
            
            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/50 z-10 relative">
                <div className="text-center mb-8">
                    <Link to="/" className="font-display text-2xl tracking-[0.2em] text-charcoal block mb-8">
                        ZENPHIRA
                    </Link>
                    <h2 className="text-3xl font-light text-charcoal mb-4">Verify Email</h2>
                    <p className="text-mid text-sm leading-relaxed">
                        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-6 p-4 bg-sage-deep/10 border border-sage-deep/20 text-sage-deep text-sm rounded-xl text-center">
                        A new verification link has been sent to the email address you provided during registration.
                    </div>
                )}

                <div className="space-y-4">
                    <button 
                        onClick={handleResend}
                        disabled={isSubmitting}
                        className="w-full bg-charcoal text-white rounded-xl py-3.5 text-sm font-medium tracking-wide hover:bg-blush-deep transition-all disabled:opacity-70 shadow-lg shadow-charcoal/10 hover:shadow-blush-deep/20"
                    >
                        {isSubmitting ? 'Sending...' : 'Resend Verification Email'}
                    </button>

                    <button 
                        onClick={logout}
                        className="w-full bg-transparent text-charcoal border border-charcoal/10 rounded-xl py-3 text-sm font-medium hover:bg-cream transition-all"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
