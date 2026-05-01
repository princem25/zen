import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useSearchParams, Link } from 'react-router-dom';

export default function EmailVerificationHandler() {
    const { verifyEmail } = useAuth();
    const { id, hash } = useParams();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        verifyEmail({ id, hash, searchParams, setStatus });
    }, [id, hash, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream px-4">
            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/50 text-center">
                <Link to="/" className="font-display text-2xl tracking-[0.2em] text-charcoal block mb-8">
                    ZENPHIRA
                </Link>
                <h2 className="text-2xl font-light text-charcoal mb-4">Verifying your email...</h2>
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 border-2 border-blush-deep border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-mid text-sm">
                    {status || 'Please wait while we confirm your email address.'}
                </p>
            </div>
        </div>
    );
}
