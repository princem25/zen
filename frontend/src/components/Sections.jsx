import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer } from './Animations';

export const Features = () => (
  <section className="py-20 md:py-36 bg-warm-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 md:px-10">
      <StaggerContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
          {[
            { icon: '✨', title: 'Clinically Proven', desc: 'Dermatologist tested formulas with visible results in 14 days.' },
            { icon: '🌿', title: '100% Vegan', desc: 'Ethically sourced plant-based ingredients. Never tested on animals.' },
            { icon: '💧', title: 'Deep Hydration', desc: 'Micro-molecular weight hyaluronic acid for cellular penetration.' },
            { icon: '🌸', title: 'Sensorial Texture', desc: 'Lightweight, fast-absorbing serums that feel like velvet.' }
          ].map((feat, i) => (
            <FadeIn key={i} delay={i * 0.1} distance={30}>
              <div className="bg-cream rounded-2xl md:rounded-3xl p-6 md:p-10 text-center border-[1.5px] border-blush-deep/15 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(232,160,176,0.2)] hover:border-blush-deep/40 transition-all duration-400 group relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blush-deep/10 to-sage-deep/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-4xl md:text-5xl mb-4 md:mb-5 block drop-shadow-md relative z-10">{feat.icon}</span>
                <h3 className="font-display text-lg md:text-xl font-medium mb-2 md:mb-3 relative z-10">{feat.title}</h3>
                <p className="text-xs md:text-sm text-mid leading-relaxed relative z-10">{feat.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </StaggerContainer>
    </div>
  </section>
);

export const MemberBenefits = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <section className="py-12 bg-sage-deep/5 border-y border-sage-deep/10">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">🎁</div>
            <div>
              <h3 className="text-xl font-display font-medium text-charcoal">Unlock Member Exclusive Perks</h3>
              <p className="text-sm text-mid mt-1">Join our community for 15% off your first order and personalized skin routines.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-blush-deep transition-all shadow-lg"
          >
            Join Zenphira Club
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-sage-deep/10 to-blush-deep/10 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-5%] w-[30vw] h-[30vw] bg-white/20 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-sage-deep">Member Dashboard</span>
          <h2 className="text-4xl font-display text-charcoal mt-2">Your Exclusive <em className="italic text-blush-deep">Benefits</em></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🌟', title: '15% Member Discount', desc: 'Applied automatically at checkout on all full-priced items.' },
            { icon: '🧪', title: 'Skin Profile Analysis', desc: 'View your personalized routine based on your skin type.' },
            { icon: '🚚', title: 'Priority Shipping', desc: 'Complimentary express shipping on all orders over ₹1500.' }
          ].map((item, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-sm hover:shadow-xl transition-all">
              <span className="text-3xl mb-4 block">{item.icon}</span>
              <h4 className="text-lg font-display font-medium mb-2">{item.title}</h4>
              <p className="text-sm text-mid leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const productsData = [
  { id: 1, name: 'Petal Glow Serum', cat: 'Serum', price: '₹1,499', img: '/product_glow_serum_1777524145107.png', badge: 'Bestseller', desc: 'Rose hip & vitamin C brightening serum for luminous skin.' },
  { id: 2, name: 'Dew Veil Moisturizer', cat: 'Moisturizer', price: '₹1,899', img: '/product_veil_moisturizer_1777524161649.png', badge: 'New', desc: 'Hyaluronic acid & ceramide blend for 48-hour deep hydration.' },
  { id: 3, name: 'Calm & Clear Toner', cat: 'Toner', price: '₹999', img: '/product_clear_toner_1777524178937.png', badge: null, desc: 'Niacinamide & green tea essence to minimize pores, balance skin.' },
  { id: 4, name: 'Velvet Night Repair', cat: 'Night Cream', price: '₹2,299', img: '/product_night_repair_1777524200469.png', badge: 'Limited', desc: 'Retinol & bakuchiol restorative cream — wake up to softer skin.' }
];

export const Products = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickView, setQuickView] = useState(null);
  const [qty, setQty] = useState(1);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Add to cart logic would go here
    alert(`Added ${product.name} to cart!`);
  };

  return (
    <section id="products" className="py-20 md:py-36 bg-cream relative">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage-deep bg-sage-deep/15 px-4 py-1.5 rounded-full mb-5">Our Collection</span>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">Bestselling <em className="italic text-blush-deep">Rituals</em></h2>
          <p className="text-mid text-base md:text-lg">Formulated to transform your skin, morning to night.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {productsData.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.1}>
              <div className="bg-warm-white rounded-2xl md:rounded-3xl overflow-hidden border-[1.5px] border-charcoal/5 hover:-translate-y-1.5 hover:shadow-[0_12px_48px_rgba(42,42,42,0.10)] transition-all group flex flex-col h-full">
                <div className="relative aspect-square md:aspect-auto md:h-[260px] overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-charcoal/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setQuickView(p); setQty(1); }} className="bg-white/95 text-charcoal px-5 py-2.5 rounded-full text-[0.8rem] font-semibold tracking-wider translate-y-4 group-hover:translate-y-0 hover:bg-blush-deep hover:text-white transition-all">
                      Quick View
                    </button>
                  </div>
                  {p.badge && <span className={`absolute top-3 md:top-4 left-3 md:left-4 text-[0.68rem] font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-white ${p.badge === 'New' ? 'bg-gradient-to-br from-sage-deep to-[#5a8c54]' : 'bg-charcoal'}`}>{p.badge}</span>}
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[0.65rem] md:text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-sage-deep block">{p.cat}</span>
                    {user && <span className="text-[0.6rem] font-bold text-blush-deep bg-blush/20 px-2 py-0.5 rounded-full">Member Price</span>}
                  </div>
                  <h3 className="font-display text-[1.1rem] md:text-[1.25rem] font-medium mb-1.5">{p.name}</h3>
                  <p className="text-[0.8rem] md:text-[0.85rem] text-mid mb-4 line-clamp-2 leading-[1.7]">{p.desc}</p>
                  <div className="mt-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                    <div className="flex flex-col">
                      <span className="font-display text-[1.2rem] md:text-[1.3rem] font-semibold">{p.price}</span>
                      {user && <span className="text-[0.7rem] text-mid line-through opacity-60 italic">Regular Price</span>}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(p)}
                      className="w-fit px-6 py-2.5 text-[0.7rem] md:text-[0.78rem] font-semibold tracking-[0.06em] text-white bg-gradient-to-br from-blush-deep to-[#c9607a] rounded-full hover:scale-105 hover:shadow-[0_6px_20px_rgba(232,160,176,0.5)] transition-all text-center whitespace-nowrap"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <button 
            onClick={() => navigate('/products')}
            className="border-[1.5px] border-charcoal/20 text-charcoal px-12 py-4 rounded-full text-sm font-semibold tracking-widest uppercase hover:bg-charcoal hover:text-white transition-all shadow-xl"
          >
            Shop Full Collection
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      <div className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-all duration-400 ${quickView ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-md" onClick={() => setQuickView(null)}></div>
        {quickView && (
          <div className="relative bg-warm-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl transition-transform duration-400 scale-100">
            <button onClick={() => setQuickView(null)} className="absolute top-2 right-4 text-4xl text-charcoal/40 hover:text-charcoal z-10 transition-colors">&times;</button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-[250px] md:h-full min-h-[300px] relative">
                <img src={quickView.img} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-6 md:p-12 flex flex-col">
                <span className="text-[0.7rem] font-semibold tracking-widest uppercase text-sage-deep mb-3 md:mb-4 block">{quickView.cat}</span>
                <h2 className="font-display text-3xl md:text-4xl font-normal text-charcoal mb-2">{quickView.name}</h2>
                <p className="font-display text-2xl font-semibold text-blush-deep mb-4 md:mb-6">{quickView.price}</p>
                <div className="w-10 h-[2px] bg-sage-deep/30 mb-4 md:mb-6"></div>
                <p className="text-sm md:text-base text-mid leading-relaxed mb-6 md:mb-8">{quickView.desc}</p>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
                  <div className="flex items-center gap-2 text-xs font-medium text-charcoal bg-charcoal/5 px-3 py-1.5 rounded-full"><span>🌿</span> Natural</div>
                  <div className="flex items-center gap-2 text-xs font-medium text-charcoal bg-charcoal/5 px-3 py-1.5 rounded-full"><span>🐰</span> Cruelty-Free</div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-auto">
                  <div className="flex items-center justify-center border border-charcoal/15 rounded-full px-4 py-2">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-xl text-mid hover:text-charcoal w-6 flex justify-center">-</button>
                    <span className="font-semibold w-8 text-center">{qty}</span>
                    <button onClick={() => setQty(q => q + 1)} className="text-xl text-mid hover:text-charcoal w-6 flex justify-center">+</button>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(quickView)}
                    className="flex-1 bg-gradient-to-br from-blush-deep to-[#c9607a] text-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Add to Cart ✦
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const Marquee = () => (
  <div className="overflow-hidden bg-charcoal py-3.5">
    <div className="flex items-center gap-6 whitespace-nowrap animate-[marquee_28s_linear_infinite] w-max">
      {[...Array(3)].map((_, i) => (
        <React.Fragment key={i}>
          <span className="text-[0.78rem] font-normal tracking-[0.14em] uppercase text-white/80">Free Shipping Over ₹2000</span>
          <span className="text-blush">•</span>
          <span className="text-[0.78rem] font-normal tracking-[0.14em] uppercase text-white/80">Cruelty Free</span>
          <span className="text-blush">•</span>
          <span className="text-[0.78rem] font-normal tracking-[0.14em] uppercase text-white/80">Clinically Tested</span>
          <span className="text-blush">•</span>
          <span className="text-[0.78rem] font-normal tracking-[0.14em] uppercase text-white/80">100% Vegan</span>
          <span className="text-blush">•</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const Reviews = () => {
  const navigate = useNavigate();
  const [index, setIndex] = React.useState(0);
  
  const reviews = [
    { name: 'Sarah J.', text: "The Petal Glow Serum completely transformed my skin texture. My pores are visibly smaller and I have this constant, natural radiance. I've never received so many compliments.", avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
    { name: 'Michael K.', text: "Finally found a moisturizer that doesn't make me look like a grease ball. The Dew Veil is lightweight but incredibly hydrating. A staple in my routine now.", avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
    { name: 'Elena R.', text: "As someone with extreme sensitivity, I was hesitant. But the Calm & Clear Toner is so soothing. No redness, just fresh, balanced skin every single day.", avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' }
  ];

  const next = () => setIndex((index + 1) % reviews.length);
  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="py-20 md:py-36 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
        <FadeIn direction="none">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage-deep bg-sage-deep/15 px-4 py-1.5 rounded-full mb-5">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-12 md:mb-20">Real <em className="italic text-blush-deep">Stories</em></h2>
        </FadeIn>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-10">
            <motion.button 
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-beige text-charcoal hover:bg-blush-deep hover:text-white transition-colors"
            >
              ←
            </motion.button>
          </div>
          <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-10">
            <motion.button 
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-beige text-charcoal hover:bg-blush-deep hover:text-white transition-colors"
            >
              →
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="bg-warm-white rounded-[2.5rem] p-8 md:p-14 border-[1.5px] border-charcoal/5 shadow-xl text-left relative"
            >
              <div className="text-gold text-xl tracking-[0.1em] mb-5">★★★★★</div>
              <p className="font-display text-[1.1rem] md:text-[1.5rem] font-light italic leading-[1.65] text-charcoal mb-8 max-w-[680px]">
                "{reviews[index].text}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={reviews[index].avatar} alt={reviews[index].name} className="w-[52px] h-[52px] rounded-full object-cover border-2 border-blush" />
                  <div>
                    <strong className="block text-[0.95rem]">{reviews[index].name}</strong>
                    <span className="text-[0.8rem] text-light">Verified Buyer</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/reviews')}
                  className="text-xs font-bold tracking-widest uppercase text-blush-deep hover:underline transition-all"
                >
                  Full Journey →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button 
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === i ? 'w-8 bg-blush-deep' : 'bg-charcoal/10'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const About = () => (
  <section id="about" className="py-20 md:py-36 bg-warm-white">
    <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
      <div className="relative">
        <div className="relative h-[380px] md:h-[520px]">
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80" alt="Lab formulation" className="w-full md:w-[80%] h-full object-cover rounded-2xl md:rounded-3xl shadow-2xl" />
          <img src="https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=300&q=80" alt="Natural ingredients" className="absolute w-[44%] h-[200px] object-cover rounded-2xl bottom-8 right-0 shadow-xl border-4 border-warm-white floating-slow hidden md:block" />
        </div>
        <div className="absolute bottom-4 right-4 md:top-8 md:right-12 md:bottom-auto bg-warm-white/90 backdrop-blur-md rounded-2xl p-4 md:p-5 text-center shadow-lg">
          <strong className="block font-display text-2xl md:text-3xl font-semibold text-charcoal">12+</strong>
          <span className="text-[10px] md:text-xs text-mid tracking-widest uppercase">Years of Research</span>
        </div>
      </div>
      <div>
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage-deep bg-sage-deep/15 px-4 py-1.5 rounded-full mb-4">Our Philosophy</span>
        <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-6">Beauty Born from<br /><em className="italic text-blush-deep">Science & Soul</em></h2>
        <p className="text-mid mb-8 leading-relaxed text-sm md:text-base">Zenphira is where nature's wisdom meets dermatological precision. Every formula is a love letter to your skin, crafted with ethically sourced bioactive botanicals and clinically-validated actives.</p>
        <div className="flex flex-wrap gap-3 mb-10">
          <div className="flex items-center gap-2 bg-sage-deep/15 border border-sage-deep/40 rounded-full px-4 py-2 text-xs md:text-sm font-medium text-charcoal">🌍 Sustainably Sourced</div>
          <div className="flex items-center gap-2 bg-sage-deep/15 border border-sage-deep/40 rounded-full px-4 py-2 text-xs md:text-sm font-medium text-charcoal">🧪 Clinically Validated</div>
        </div>
        <button 
          onClick={() => navigate('/about')}
          className="bg-gradient-to-br from-blush-deep to-[#d4788a] text-white px-10 py-4 rounded-full text-sm font-medium tracking-wide shadow-lg hover:-translate-y-1 transition-all"
        >
          Read Our Full Story
        </button>
      </div>
    </div>
  </section>
);

