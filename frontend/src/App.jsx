import React, { useState, useEffect } from 'react';
import { Features, Products, About, Footer, Marquee, Reviews } from './components/Sections';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import VerifyEmail from './components/Auth/VerifyEmail';
import EmailVerificationHandler from './components/Auth/EmailVerificationHandler';
import Dashboard from './components/Dashboard/Dashboard';

import { CustomCursor, Preloader, Navbar, Hero } from './components/UI';
import ProductsPage from './components/Products/ProductsPage';
import { useAuth } from './context/AuthContext';

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Features />
        <Products />
        <About />
        <Reviews />
      </main>
      <Footer />
    </>
  );
};

function App() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && user && !user.email_verified_at && location.pathname !== '/verify-email' && !location.pathname.startsWith('/verify-email/')) {
      navigate('/verify-email');
    }
    
    // Protect dashboard
    if (!isLoading && !user && location.pathname === '/dashboard') {
      navigate('/login');
    }
  }, [user, isLoading, location.pathname, navigate]);

  return (
    <div className="font-body text-charcoal bg-cream min-h-screen">
      <Preloader />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:token" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email/:id/:hash" element={<EmailVerificationHandler />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </div>
  );
}

export default App;
