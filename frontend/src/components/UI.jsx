import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { FadeIn } from './Animations';
import { getCloudinaryUrl } from '../lib/cloudinary';

export const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="md:block hidden">
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-blush-deep rounded-full pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2"
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[999998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color,opacity,border-width] duration-150 ${isHovered ? 'w-14 h-14 bg-blush/20' : 'w-10 h-10 border-[1.5px] border-blush-deep opacity-40'}`}
        style={{ x: cursorX, y: cursorY }}
      />
    </div>
  );
};

export const Preloader = () => {
  const { isLoading } = useAuth();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 bg-warm-white flex items-center justify-center z-[99999] transition-all duration-700 ease-out ${!isLoading ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
      <div className="text-center">
        <div className="font-display text-[clamp(2.5rem,6vw,4rem)] font-light tracking-[0.25em] text-charcoal animate-[preloaderPulse_1.6s_ease_infinite]">
          ZENPHIRA
        </div>
        <div className="mx-auto mt-6 w-[120px] h-[2px] bg-beige rounded-sm overflow-hidden">
          <span className="block h-full bg-gradient-to-r from-blush-deep to-sage-deep animate-[preloaderFill_2s_ease_forwards]"></span>
        </div>
      </div>
    </div>
  );
};

export const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('section[id]').forEach(sec => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'glass-panel py-3' : 'py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
          <Link to="/" className="group relative z-[1002] flex items-center">
            <span className="font-display text-2xl md:text-3xl font-light tracking-wider flex items-center">
              <span className="bg-gradient-to-r from-charcoal via-[#5a5a5a] to-charcoal bg-clip-text text-transparent">
                Zenphira
              </span>
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-blush-deep rounded-full ml-2"
              />
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8">
            {[
              user?.role === 'admin' && { name: 'Admin Panel', link: '/admin' },
              user && { name: 'My Orders', link: '/dashboard' },
              { name: 'Home', link: '/' },
              { name: 'Skin Aura', link: '/aura-analysis' },
              { name: 'About', link: '/about' },
              { name: 'Products', link: '/products' },
              { name: 'Reviews', link: '/reviews' }
            ].filter(Boolean).map((item) => {
              const isHashLink = item.link.startsWith('/#');
              const isActive = isHashLink
                ? (activeSection === item.name.toLowerCase() && location.pathname === '/')
                : (location.pathname === item.link);

              return (
                <li key={item.name}>
                  {item.link.startsWith('/#') ? (
                    <a href={item.link} className={`text-sm font-normal tracking-wider transition-colors relative group ${isActive ? 'text-charcoal font-medium' : 'text-mid hover:text-charcoal'}`}>
                      {item.name}
                      <span className={`absolute -bottom-1 left-0 h-[1px] bg-blush-deep transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </a>
                  ) : (
                    <Link to={item.link} className={`text-sm font-normal tracking-wider transition-colors relative group ${isActive ? 'text-charcoal font-medium' : 'text-mid hover:text-charcoal'}`}>
                      {item.name}
                      <span className={`absolute -bottom-1 left-0 h-[1px] bg-blush-deep transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-bold tracking-widest uppercase text-blush-deep bg-blush/10 px-6 py-2.5 rounded-full hover:bg-blush-deep hover:text-white transition-all border border-blush-deep/20">
                    Admin Panel ⚙️
                  </Link>
                )}
                <Link to="/profile" className="text-sm font-medium text-charcoal hover:text-blush-deep transition-colors">{user.name}</Link>
                <button onClick={logout} className="text-xs font-semibold tracking-widest uppercase text-charcoal border border-charcoal/20 px-6 py-2.5 rounded-full hover:bg-charcoal hover:text-white transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-charcoal hover:text-blush-deep transition-colors">Log In</Link>
                <Link to="/register" className="text-xs font-semibold tracking-widest uppercase text-white bg-charcoal px-6 py-2.5 rounded-full hover:bg-blush-deep hover:-translate-y-0.5 shadow-lg shadow-blush-deep/20 transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-[6.5px] p-2 z-[1002]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`block w-6 h-[1.5px] bg-charcoal transition-transform ${mobileMenuOpen ? 'translate-y-[8px] rotate-45' : ''}`}></span>
            <span className={`block w-6 h-[1.5px] bg-charcoal transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-[1.5px] bg-charcoal transition-transform ${mobileMenuOpen ? '-translate-y-[8px] -rotate-45' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-charcoal/10 backdrop-blur-md z-[998] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Side Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-[400px] bg-white z-[1100] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="font-display text-xl tracking-[0.2em] text-charcoal">ZENPHIRA</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-charcoal"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1">
            <ul className="flex flex-col gap-5">
              {[
                user?.role === 'admin' && { name: 'Admin Panel', link: '/admin' },
                user && { name: 'My Orders', link: '/dashboard' },
                { name: 'Home', link: '/' },
                { name: 'Skin Aura', link: '/aura-analysis' },
                { name: 'About', link: '/about' },
                { name: 'Products', link: '/products' },
                { name: 'Reviews', link: '/reviews' }
              ].filter(Boolean).map((item, index) => {
                const isActive = location.pathname === item.link;

                return (
                  <li key={item.name} className="relative overflow-hidden">
                    <Link
                      to={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block font-display text-[1.15rem] tracking-[0.1em] uppercase transition-all duration-500 ease-out ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${isActive ? 'text-blush-deep font-bold' : 'text-charcoal hover:text-blush'}`}
                      style={{ transitionDelay: mobileMenuOpen ? `${(index + 1) * 70}ms` : '0ms' }}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={`pt-10 border-t border-beige transition-all duration-700 delay-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
            {user ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blush/20 flex items-center justify-center text-blush-deep font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold text-charcoal hover:text-blush-deep transition-colors">
                      {user.name}
                    </Link>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-xs text-mid hover:text-blush-deep">View Profile</Link>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-4 rounded-xl border border-charcoal text-charcoal text-sm font-bold tracking-widest uppercase hover:bg-charcoal hover:text-white transition-all"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 rounded-xl bg-charcoal text-white text-sm font-bold tracking-widest uppercase text-center shadow-lg hover:bg-blush-deep transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-4 rounded-xl border border-beige text-mid text-sm font-bold tracking-widest uppercase text-center hover:border-charcoal hover:text-charcoal transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const Hero = () => {
  const { user } = useAuth();

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-28 pb-16 px-4 md:px-10 max-w-7xl mx-auto">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_50%,rgba(242,196,206,0.35)_0%,rgba(181,201,176,0.2)_50%,transparent_70%)] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row items-center w-full gap-12 md:gap-8 z-10">
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <FadeIn direction="none" duration={1}>
            <span className="inline-block text-xs font-semibold tracking-[0.22em] uppercase text-sage-deep bg-sage-deep/20 px-4 py-1.5 rounded-full mb-6">
              {user ? `Welcome Back, ${user.name.split(' ')[0]}` : 'The New Standard'}
            </span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="font-display text-5xl md:text-[5.5rem] font-light leading-[1.08] text-charcoal mb-6">
              {user ? <>Your Personal <em className="italic text-gradient">Skin Ritual</em></> : <>Reveal Your <em className="italic text-gradient">Natural Glow</em></>}
            </h1>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-lg md:text-xl text-mid mb-10 leading-relaxed max-w-xl mx-auto md:mx-0">
              {user
                ? "Continue your journey to radiant skin with your personalized routine and exclusive member benefits."
                : "Formulated with potent botanical extracts and clinically proven actives to transform your skin from within."}
            </p>
          </FadeIn>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to={user ? "/dashboard" : "/products"} className="bg-gradient-to-br from-blush-deep to-[#d4788a] text-white px-8 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-[0_8px_32px_rgba(232,160,176,0.4)] hover:shadow-[0_16px_48px_rgba(232,160,176,0.55)] transition-all block">
                {user ? "View Dashboard" : "Shop Collection"}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/profile" className="border-[1.5px] border-charcoal/20 text-charcoal px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-charcoal hover:text-white transition-all block">
                {user ? "Manage Profile" : "Take Skin Quiz"}
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center items-center min-h-[400px] md:min-h-[500px] w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[radial-gradient(ellipse,rgba(242,196,206,0.5)_0%,rgba(181,201,176,0.3)_50%,transparent_70%)] blob-shape -z-10"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 w-[260px] h-[340px] md:w-[340px] md:h-[420px] rounded-[50%_50%_50%_50%/55%_55%_45%_45%] overflow-hidden shadow-2xl floating"
          >
            <img src={getCloudinaryUrl('v1777614636/hero_skincare_model_1777524128543_kw2lms.jpg')} alt="Skincare Model" className="w-full h-full object-cover object-top" />
          </motion.div>

          {/* Floating Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-10 left-0 md:bottom-16 md:-left-4 bg-warm-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl flex flex-col items-center z-20"
          >
            <span className="font-display text-2xl font-bold text-charcoal leading-none">98%</span>
            <span className="text-[10px] text-mid tracking-wider mt-1 uppercase">Saw Results</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer className="bg-charcoal text-white/75 pt-20 pb-8">
    <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-16">
      <div className="col-span-1 md:col-span-2">
        <div className="font-display text-2xl tracking-[0.18em] text-white mb-4">ZENPHIRA</div>
        <p className="mb-6 leading-relaxed text-sm">Skincare rooted in science,<br />inspired by nature's grace.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold tracking-wider uppercase text-xs mb-5">Products</h4>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">Serums</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Moisturizers</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Toners</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Night Care</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold tracking-wider uppercase text-xs mb-5">Company</h4>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-center md:text-left gap-4">
      <p>© 2025 Zenphira. All rights reserved. | Made with 🌸 for every skin.</p>
      <div className="flex gap-4">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);
