import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('/api/user');
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const login = async ({ email, password, setErrors }) => {
        setErrors([]);
        try {
            await csrf();
            await axios.post('/login', { email, password });
            await checkAuth();
            
            // Redirect to intended page or home
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const register = async ({ name, email, password, password_confirmation, setErrors }) => {
        setErrors([]);
        try {
            await csrf();
            await axios.post('/register', {
                name,
                email,
                password,
                password_confirmation
            });
            await checkAuth();
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const logout = async () => {
        try {
            await axios.post('/logout');
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error(error);
        }
    };

    const forgotPassword = async ({ email, setErrors, setStatus }) => {
        setErrors([]);
        setStatus(null);
        try {
            await csrf();
            const response = await axios.post('/forgot-password', { email });
            setStatus(response.data.status);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const resetPassword = async ({ setErrors, setStatus, ...props }) => {
        setErrors([]);
        setStatus(null);
        try {
            await csrf();
            const response = await axios.post('/reset-password', { token: props.token, ...props });
            setStatus(response.data.status);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const resendVerification = async ({ setStatus }) => {
        try {
            const response = await axios.post('/email/verification-notification');
            setStatus(response.data.status);
        } catch (error) {
            console.error(error);
        }
    };

    const verifyEmail = async ({ id, hash, searchParams, setStatus }) => {
        try {
            const response = await axios.get(`/verify-email/${id}/${hash}?${searchParams.toString()}`);
            setStatus(response.data.status);
            await checkAuth();
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (error) {
            console.error(error);
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword, resendVerification, verifyEmail, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
