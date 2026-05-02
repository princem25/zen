import React, { useState, useEffect } from 'react';
import { Features, Products, About, Marquee, Reviews, MemberBenefits } from './components/Sections';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import VerifyEmail from './components/Auth/VerifyEmail';
import EmailVerificationHandler from './components/Auth/EmailVerificationHandler';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Dashboard/Profile';

import { CustomCursor, Preloader, Navbar, Hero, Footer } from './components/UI';
import ProductsPage from './components/Products/ProductsPage';
import ProductView from './components/Products/ProductView';
import AboutPage from './components/About/AboutPage';
import ReviewsPage from './components/Reviews/ReviewsPage';
import SkinAura from './components/Aura/SkinAura';
import { useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { PageTransition } from './components/Animations';
import { AnimatePresence } from 'framer-motion';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <main>
        <Hero />
        <Marquee />
        <Features />
        <MemberBenefits />
        <Products />
        
        {/* Personalized Skin Profile Prompt */}
        <section className="py-20 bg-warm-white">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <div className="bg-cream rounded-[3rem] p-10 md:p-20 flex flex-col md:flex-row items-center gap-12 border border-beige shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blush/20 to-transparent pointer-events-none"></div>
              <div className="flex-1 relative z-10">
                <span className="text-xs font-semibold tracking-widest uppercase text-blush-deep mb-4 block">Personalization</span>
                <h2 className="text-4xl md:text-5xl font-display text-charcoal mb-6">
                  {user ? `Your Skin Profile is Ready, ${user.name.split(' ')[0]}` : "Identify Your Unique Skin Type"}
                </h2>
                <p className="text-mid text-lg mb-10 max-w-xl">
                  {user 
                    ? "We've analyzed your preferences and curated a selection of products just for you. Keep your profile updated for better recommendations."
                    : "Join Zenphira to take our expert skin quiz and get a personalized routine tailored specifically for your concerns."}
                </p>
                <button 
                  onClick={() => navigate(user ? '/profile' : '/login')}
                  className="bg-charcoal text-white px-10 py-4 rounded-full text-sm font-medium hover:bg-blush-deep transition-all shadow-xl"
                >
                  {user ? "View My Profile" : "Login to Start Quiz"}
                </button>
              </div>
              <div className="w-full md:w-1/3 aspect-square bg-white rounded-[2.5rem] flex items-center justify-center text-8xl shadow-inner relative z-10">
                {user ? "✨" : "🔒"}
              </div>
            </div>
          </div>
        </section>

        <About />
        <Reviews />
      </main>
    </>
  );
};

function App() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Protect auth routes
    const authRoutes = ['/dashboard', '/profile'];
    if (!isLoading && !user && authRoutes.includes(location.pathname)) {
      navigate('/login', { state: { from: location } });
    }
  }, [user, isLoading, location.pathname, navigate]);

  const showNavAndFooter = !['/login', '/register', '/forgot-password', '/password-reset', '/verify-email'].some(path => location.pathname.startsWith(path));

  return (
    <div className="font-body text-charcoal bg-cream min-h-screen">
      <ScrollToTop />
      <Preloader />
      <CustomCursor />
      {showNavAndFooter && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email/:id/:hash" element={<EmailVerificationHandler />} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/products" element={<PageTransition><ProductsPage /></PageTransition>} />
          <Route path="/product/:id" element={<PageTransition><ProductView /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/reviews" element={<PageTransition><ReviewsPage /></PageTransition>} />
          <Route path="/aura-analysis" element={<PageTransition><SkinAura /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      {showNavAndFooter && <Footer />}
    </div>
  );
}

export default App;
