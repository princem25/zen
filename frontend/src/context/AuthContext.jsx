import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Mock check if user is logged in on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('zen_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async ({ email, password, setErrors }) => {
        setErrors([]);
        setIsLoading(true);
        try {
            // Mock login success
            const mockUser = {
                id: 1,
                name: 'Guest User',
                email: email,
                email_verified_at: new Date().toISOString()
            };
            setUser(mockUser);
            localStorage.setItem('zen_user', JSON.stringify(mockUser));
            
            // Redirect to intended page or home
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            setErrors({ email: ['Invalid credentials (Mock)'] });
        } finally {
            setIsLoading(false);
        }
    };

    const register = async ({ name, email, password, password_confirmation, setErrors }) => {
        setErrors([]);
        setIsLoading(true);
        try {
            // Mock register success
            const mockUser = {
                id: 1,
                name: name,
                email: email,
                email_verified_at: new Date().toISOString()
            };
            setUser(mockUser);
            localStorage.setItem('zen_user', JSON.stringify(mockUser));
            navigate('/dashboard');
        } catch (error) {
            setErrors({ email: ['Registration failed (Mock)'] });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('zen_user');
        navigate('/login');
    };

    const forgotPassword = async ({ email, setErrors, setStatus }) => {
        setErrors([]);
        setStatus('If your email is registered, you will receive a reset link (Mock)');
    };

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        setErrors([]);
        setStatus('Password has been reset successfully (Mock)');
        setTimeout(() => navigate('/login'), 3000);
    };

    const resendVerification = async ({ setStatus }) => {
        setStatus('Verification link sent (Mock)');
    };

    const verifyEmail = async ({ id, hash, searchParams, setStatus }) => {
        setStatus('Email verified successfully (Mock)');
        if (user) {
            const updatedUser = { ...user, email_verified_at: new Date().toISOString() };
            setUser(updatedUser);
            localStorage.setItem('zen_user', JSON.stringify(updatedUser));
        }
        setTimeout(() => navigate('/dashboard'), 3000);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword, resendVerification, verifyEmail, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
