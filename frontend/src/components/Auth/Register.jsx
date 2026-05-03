import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Register() {
    const { register, loginWithGoogle } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register({ name, email, password, password_confirmation, setErrors });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fix for Firebase Popup Delay: Reset loading state if window regains focus
    useEffect(() => {
        const handleFocus = () => {
            if (isSubmitting) {
                setTimeout(() => setIsSubmitting(false), 600);
            }
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [isSubmitting]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream relative overflow-hidden px-4 py-12">
            {/* Background Ornaments */}
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[radial-gradient(ellipse,rgba(181,201,176,0.4)_0%,rgba(242,196,206,0.1)_50%,transparent_70%)] blob-shape -z-10 blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[radial-gradient(ellipse,rgba(242,196,206,0.4)_0%,rgba(181,201,176,0.1)_50%,transparent_70%)] blob-shape -z-10 blur-3xl opacity-50" />

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/50 z-10 relative">
                <div className="text-center mb-10">
                    <Link to="/" className="font-display text-2xl tracking-[0.2em] text-charcoal block mb-8">
                        ZENPHIRA
                    </Link>
                    <h2 className="text-3xl font-light text-charcoal mb-2">Create Account</h2>
                    <p className="text-mid text-sm">Join us for your skincare journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-charcoal uppercase mb-2">Full Name</label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-cream/50 border border-beige rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-blush-deep focus:ring-1 focus:ring-blush-deep transition-all placeholder:text-mid/50"
                            placeholder="Jane Doe"
                            required
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>}
                    </div>

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
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-charcoal uppercase mb-2">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-cream/50 border border-beige rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-blush-deep focus:ring-1 focus:ring-blush-deep transition-all"
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold tracking-wider text-charcoal uppercase mb-2">Confirm Password</label>
                        <input 
                            type="password"
                            value={password_confirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full bg-cream/50 border border-beige rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-blush-deep focus:ring-1 focus:ring-blush-deep transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-charcoal text-white rounded-xl py-3.5 text-sm font-medium tracking-wide hover:bg-blush-deep transition-all disabled:opacity-70 mt-6 shadow-lg shadow-charcoal/10 hover:shadow-blush-deep/20"
                    >
                        {isSubmitting ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-8 flex items-center gap-4 text-mid/30">
                    <div className="h-[1px] flex-1 bg-current"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-mid">Or continue with</span>
                    <div className="h-[1px] flex-1 bg-current"></div>
                </div>

                <button 
                    onClick={async () => {
                        setIsSubmitting(true);
                        try {
                            await loginWithGoogle();
                        } finally {
                            setIsSubmitting(false);
                        }
                    }}
                    disabled={isSubmitting}
                    className="w-full mt-8 flex items-center justify-center gap-3 bg-white border border-beige rounded-xl py-3 text-sm font-medium text-charcoal hover:bg-cream transition-all group disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-charcoal border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                        </span>
                    ) : (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>Google</span>
                        </>
                    )}
                </button>

                <div className="mt-8 text-center text-sm text-mid">
                    Already have an account? <Link to="/login" className="text-charcoal font-medium hover:text-blush-deep transition-colors">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
