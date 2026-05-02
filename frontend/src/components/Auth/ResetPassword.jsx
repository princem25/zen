import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResetPassword() {
    const { resetPassword, verifyPasswordResetCode } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const oobCode = searchParams.get('oobCode');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isCodeValid, setIsCodeValid] = useState(false);

    useEffect(() => {
        const validateCode = async () => {
            if (!oobCode) {
                setTimeout(() => {
                    setIsValidating(false);
                    setIsCodeValid(false);
                }, 1000);
                return;
            }

            try {
                const userEmail = await verifyPasswordResetCode(auth, oobCode);
                setEmail(userEmail);
                setIsCodeValid(true);
            } catch (error) {
                console.error("Invalid reset code:", error);
                setIsCodeValid(false);
            } finally {
                setIsValidating(false);
            }
        };

        validateCode();
    }, [oobCode, verifyPasswordResetCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (password.length < 6) {
            setErrors({ password: ['Password must be at least 6 characters.'] });
            return;
        }

        if (password !== password_confirmation) {
            setErrors({ password_confirmation: ['Passwords do not match.'] });
            return;
        }

        setIsSubmitting(true);
        await resetPassword({ 
            oobCode, 
            password, 
            setErrors, 
            setStatus 
        });
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream relative overflow-hidden px-4">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(ellipse,rgba(242,196,206,0.25)_0%,transparent_70%)] blob-shape -z-10 blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(ellipse,rgba(181,201,176,0.2)_0%,transparent_70%)] blob-shape -z-10 blur-3xl" />

            <AnimatePresence mode="wait">
                {isValidating ? (
                    <motion.div 
                        key="validating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <div className="w-12 h-12 border-2 border-blush-deep border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <p className="font-display text-xl text-charcoal tracking-widest uppercase">Verifying Ritual Link</p>
                    </motion.div>
                ) : !isCodeValid ? (
                    <motion.div 
                        key="invalid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full glass-panel p-10 md:p-14 rounded-[2.5rem] text-center"
                    >
                        <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <span className="text-3xl text-blush-deep">✧</span>
                        </div>
                        <h2 className="font-display text-3xl text-charcoal mb-4">Link Expired</h2>
                        <p className="text-mid text-sm leading-relaxed mb-10 font-light">
                            This secure link has either expired or been used. For your security, please request a new password reset link.
                        </p>
                        <Link to="/forgot-password" title="Return to forgot password" id="forgot-password-link" className="btn btn-primary w-full">
                            Request New Link
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md glass-panel p-8 md:p-12 rounded-[2.5rem] relative"
                    >
                        <div className="text-center mb-10">
                            <Link to="/" className="font-display text-2xl tracking-[0.3em] text-charcoal block mb-8 hover:text-gold transition-colors">
                                ZENPHIRA
                            </Link>
                            <h2 className="font-display text-4xl text-charcoal mb-3">Restore Access</h2>
                            <p className="text-mid text-sm font-light">
                                Set a new secret for <span className="text-charcoal font-medium">{email}</span>
                            </p>
                        </div>

                        {status && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-4 bg-sage/10 border border-sage/20 text-sage-deep text-sm rounded-2xl text-center font-medium"
                            >
                                ✨ {status} Redirecting to login...
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-bold tracking-[0.2em] text-charcoal/60 uppercase mb-2 ml-1">New Password</label>
                                <div className="relative">
                                    <input 
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/40 border border-beige rounded-2xl px-5 py-4 text-charcoal focus:outline-none focus:border-gold focus:ring-0 transition-all placeholder:text-light"
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                </div>
                                {errors.password && <p className="text-blush-deep text-[11px] mt-2 ml-1">{errors.password[0]}</p>}
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold tracking-[0.2em] text-charcoal/60 uppercase mb-2 ml-1">Confirm Password</label>
                                <input 
                                    type="password"
                                    value={password_confirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full bg-white/40 border border-beige rounded-2xl px-5 py-4 text-charcoal focus:outline-none focus:border-gold focus:ring-0 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password_confirmation && <p className="text-blush-deep text-[11px] mt-2 ml-1">{errors.password_confirmation[0]}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="btn btn-primary w-full mt-8 py-4 text-xs font-bold tracking-[0.15em] uppercase"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                        
                        <div className="mt-8 text-center">
                            <Link to="/login" className="text-[11px] text-light hover:text-charcoal transition-colors tracking-widest uppercase font-bold">
                                Back to Sign In
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
