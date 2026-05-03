import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    sendEmailVerification,
    signInWithPopup,
    confirmPasswordReset,
    verifyPasswordResetCode
} from 'firebase/auth';
import { auth, db, googleProvider } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const loginWithGoogle = async () => {
        try {
            console.log("Attempting Google login...");
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;
            
            const userRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    role: 'user',
                    createdAt: new Date().toISOString()
                });
            }

            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Google login failed:", error);
            if (error.code === 'auth/operation-not-allowed') {
                alert("Google login is not enabled in Firebase Console.");
            } else if (error.code !== 'auth/popup-closed-by-user') {
                alert("Login failed: " + error.message);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional user data from Firestore if needed
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                const userData = userDoc.exists() ? userDoc.data() : {};
                const sanitizedRole = (userData.role || 'user').trim();
                
                console.log("🔥 User Auth State Updated:", {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    role: sanitizedRole
                });

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || userData.name || 'Ritualist',
                    emailVerified: firebaseUser.emailVerified,
                    ...userData,
                    role: sanitizedRole
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async ({ email, password, setErrors }) => {
        setErrors([]);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            // Security Best Practice: Use a generic error message to prevent account enumeration
            setErrors({ email: ['Invalid email or password.'] });
        }
    };

    const register = async ({ name, email, password, setErrors }) => {
        setErrors([]);
        try {
            const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
            
            // Update profile displayName
            await updateProfile(firebaseUser, { displayName: name });
            
            // Create user document in Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                name,
                email,
                role: 'user', // Default role
                createdAt: new Date().toISOString()
            });

            // Send verification email automatically for high security
            await sendEmailVerification(firebaseUser);

            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            let message = 'Registration failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') message = 'This email is already registered.';
            if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
            setErrors({ email: [message] });
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const forgotPassword = async ({ email, setErrors, setStatus }) => {
        setErrors([]);
        setStatus(null);
        try {
            await sendPasswordResetEmail(auth, email);
            setStatus('Password reset link sent! Please check your Inbox and Spam folder.');
        } catch (error) {
            console.error(error);
            let message = 'Failed to send reset link. Please try again.';
            if (error.code === 'auth/user-not-found') message = 'No account found with this email.';
            if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
            setErrors({ email: [message] });
        }
    };

    const resetPassword = async ({ password, oobCode, setErrors, setStatus }) => {
        setErrors([]);
        setStatus(null);
        try {
            await confirmPasswordReset(auth, oobCode, password);
            setStatus('Password successfully reset!');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            console.error(error);
            let message = 'Failed to reset password. The link may have expired.';
            if (error.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
            setErrors({ email: [message] });
        }
    };

    const updateUserAddress = async (addressData) => {
        if (!auth.currentUser) return;
        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await setDoc(userRef, { address: addressData }, { merge: true });
            setUser(prev => ({ ...prev, address: addressData }));
        } catch (error) {
            console.error("Error updating address:", error);
        }
    };

    const resendVerification = async ({ setStatus }) => {
        if (auth.currentUser) {
            try {
                await sendEmailVerification(auth.currentUser);
                setStatus('Verification link sent! Check your Inbox and Spam folder.');
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            login, 
            loginWithGoogle,
            register, 
            logout, 
            forgotPassword,
            resetPassword,
            resendVerification,
            updateUserAddress,
            verifyPasswordResetCode
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
