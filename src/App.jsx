import React, { useState, useEffect } from 'react';
import { Features, Products, About, Footer, Marquee, Reviews } from './components/Sections';

const CustomCursor = () => {
// ... existing code ...
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const onMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('a') || e.target.closest('button')) {
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
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-blush-deep rounded-full pointer-events-none z-[999999] transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div 
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[999998] transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 ${isHovered ? 'w-14 h-14 bg-blush opacity-30 border-transparent' : 'w-9 h-9 border-[1.5px] border-blush-deep opacity-60'}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
};

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-warm-white flex items-center justify-center z-[99999] transition-all duration-700 ease-out ${loading ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
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

const Navbar = () => {
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
          <a href="#" className="font-display text-2xl md:text-3xl font-light tracking-[0.18em] text-charcoal relative z-[1002]">ZENPHIRA</a>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Products', 'Reviews'].map((item) => {
              const isActive = activeSection === item.toLowerCase();
              return (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className={`text-sm font-normal tracking-wider transition-colors relative group ${isActive ? 'text-charcoal font-medium' : 'text-mid hover:text-charcoal'}`}>
                    {item}
                    <span className={`absolute -bottom-1 left-0 h-[1px] bg-blush-deep transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </a>
                </li>
              );
            })}
          </ul>
          
          <button className="hidden md:block text-xs font-semibold tracking-widest uppercase text-white bg-charcoal px-6 py-2.5 rounded-full hover:bg-blush-deep hover:-translate-y-0.5 shadow-lg shadow-blush-deep/20 transition-all">
            Shop Now
          </button>

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

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 w-[100vw] h-[100vh] bg-[rgba(253,250,246,0.97)] backdrop-blur-[20px] z-[999] flex flex-col items-center justify-center ${mobileMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
        style={{ 
          clipPath: mobileMenuOpen ? 'circle(150% at 100% 0)' : 'circle(0% at 100% 0)',
          transition: 'opacity 0.5s ease, visibility 0.5s ease, clip-path 0.6s cubic-bezier(0.8, 0, 0.2, 1)'
        }}
      >
        <ul className="flex flex-col items-center gap-10 m-0 p-0">
          {['Home', 'About', 'Products', 'Reviews'].map((item, index) => {
            const isActive = activeSection === item.toLowerCase();
            return (
              <li key={item} className="relative">
                <a 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block font-body text-[1.6rem] sm:text-[1.4rem] tracking-[0.08em] transition-all duration-400 ease-out ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${isActive ? 'text-charcoal' : 'text-mid'}`}
                  style={{ transitionDelay: mobileMenuOpen ? `${(index + 1) * 50}ms` : '0ms' }}
                >
                  {isActive && (
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-[1.2rem] text-blush-deep">✦</span>
                  )}
                  {item}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden pt-28 pb-16 px-4 md:px-10 max-w-7xl mx-auto">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_70%_50%,rgba(242,196,206,0.35)_0%,rgba(181,201,176,0.2)_50%,transparent_70%)] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row items-center w-full gap-12 md:gap-8 z-10">
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <span className="inline-block text-xs font-semibold tracking-[0.22em] uppercase text-sage-deep bg-sage-deep/20 px-4 py-1.5 rounded-full mb-6">
            The New Standard
          </span>
          <h1 className="font-display text-5xl md:text-[5.5rem] font-light leading-[1.08] text-charcoal mb-6">
            Reveal Your <em className="italic text-gradient">Natural Glow</em>
          </h1>
          <p className="text-lg md:text-xl text-mid mb-10 leading-relaxed max-w-xl mx-auto md:mx-0">
            Formulated with potent botanical extracts and clinically proven actives to transform your skin from within.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button className="bg-gradient-to-br from-blush-deep to-[#d4788a] text-white px-8 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-[0_8px_32px_rgba(232,160,176,0.4)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(232,160,176,0.55)] transition-all">
              Shop Collection
            </button>
            <button className="border-[1.5px] border-charcoal/20 text-charcoal px-8 py-3.5 rounded-full text-sm font-medium tracking-wide hover:bg-charcoal hover:text-white hover:-translate-y-1 transition-all">
              Take Skin Quiz
            </button>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center items-center min-h-[400px] md:min-h-[500px] w-full">
          <div className="absolute w-[300px] h-[300px] md:w-[480px] md:h-[480px] bg-[radial-gradient(ellipse,rgba(242,196,206,0.5)_0%,rgba(181,201,176,0.3)_50%,transparent_70%)] blob-shape -z-10" />
          <div className="relative z-10 w-[260px] h-[340px] md:w-[340px] md:h-[420px] rounded-[50%_50%_50%_50%/55%_55%_45%_45%] overflow-hidden shadow-2xl floating">
            <img src="/hero_skincare_model_1777524128543.png" alt="Skincare Model" className="w-full h-full object-cover object-top" />
          </div>
          
          {/* Floating Badges */}
          <div className="absolute bottom-10 left-0 md:bottom-16 md:-left-4 bg-warm-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl flex flex-col items-center z-20">
            <span className="font-display text-2xl font-bold text-charcoal leading-none">98%</span>
            <span className="text-[10px] text-mid tracking-wider mt-1 uppercase">Saw Results</span>
          </div>
        </div>
      </div>
    </section>
  );
};

function App() {
  return (
    <div className="font-body text-charcoal bg-cream min-h-screen">
      <Preloader />
      <CustomCursor />
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
    </div>
  );
}

export default App;
