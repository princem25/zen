import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer } from './Animations';
import { getCloudinaryUrl } from '../lib/cloudinary';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import AddressModal from './Checkout/AddressModal';
import { generateWhatsAppOrderLink } from '../lib/whatsapp';

export const Features = React.memo(() => (
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
));

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




export const Products = ({ category = 'All', limitCount = null }) => {
  const { user, updateUserAddress } = useAuth();
  const navigate = useNavigate();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [quantities, setQuantities] = useState({}); // Track quantity per product

  // Filter and format products
  const catMap = {
    'Serums': 'Serum', 'Moisturizers': 'Moisturizer', 'Toners': 'Toner', 'Night Care': 'Night Cream', 'Sun Protection': 'Sun Protection'
  };
  const targetCat = catMap[category] || category;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        let fetchedProducts = snap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          img: getCloudinaryUrl(doc.data().img) 
        }));

        // Filter products
        const catMap = {
          'Serums': 'Serum', 'Moisturizers': 'Moisturizer', 'Toners': 'Toner', 'Night Care': 'Night Cream', 'Sun Protection': 'Sun Protection'
        };
        const targetCat = catMap[category] || category;

        if (targetCat !== 'All') {
          fetchedProducts = fetchedProducts.filter(p => p.category === targetCat || p.cat === targetCat);
        }

        if (limitCount) {
          fetchedProducts = fetchedProducts.slice(0, limitCount);
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limitCount]);

  const handleAddToCart = (product, quantity = 1) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setPendingOrder({ product, qty: quantity });

    // If user already has an address, redirect to WhatsApp immediately
    if (user.address && !isAddressModalOpen) {
      const link = generateWhatsAppOrderLink(product, quantity, user.address);
      
      // We still want to allow changing the address, so we'll show a small confirm or just the modal if requested
      window.open(link, '_blank');
    } else {
      setIsAddressModalOpen(true);
    }
  };

  const handleSaveAddress = async (addressData) => {
    await updateUserAddress(addressData);
    setIsAddressModalOpen(false);
    
    if (pendingOrder) {
      const link = generateWhatsAppOrderLink(pendingOrder.product, pendingOrder.qty, addressData);
      window.open(link, '_blank');
    }
  };

  return (
    <section id="products" className="py-20 md:py-36 bg-cream relative">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-20">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage-deep bg-sage-deep/15 px-4 py-1.5 rounded-full mb-5">Our Collection</span>
          <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-4">Bestselling <em className="italic text-blush-deep">Rituals</em></h2>
          <p className="text-mid text-base md:text-lg">Formulated to transform your skin, morning to night.</p>
        </div>

        <div className="grid grid-cols-1 min-[430px]:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-2 md:px-0">
          {products.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.1}>
              <div className="bg-warm-white rounded-[2rem] overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative">

                {/* Image Section */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />

                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-charcoal px-3 py-1 rounded-full z-10 shadow-sm border border-charcoal/5 text-[0.65rem] font-bold tracking-widest uppercase">
                    {p.category || p.cat}
                  </span>

                  {/* Desktop Full View Overlay */}
                  <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex items-center justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/${p.id}`); }}
                      className="bg-white/95 backdrop-blur-sm text-charcoal px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-blush-deep hover:text-white"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Mobile Quick View Indicator */}
                  <div className="absolute bottom-3 right-3 md:hidden z-10">
                    <div className="bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-charcoal text-lg">👁</span>
                    </div>
                  </div>

                  {p.badge && (
                    <span className={`absolute top-3 right-3 text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm z-10 ${p.badge === 'New' ? 'bg-gradient-to-r from-sage-deep to-[#5a8c54] text-white' : 'bg-blush-deep text-white'}`}>
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <span className="text-[0.7rem] font-bold tracking-widest uppercase text-sage-deep mb-2 block">{p.category || p.cat}</span>
                  <button 
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="text-left group/title"
                  >
                    <h3 className="font-display text-[1.1rem] md:text-[1.25rem] font-medium text-charcoal leading-tight mb-2 group-hover/title:text-blush-deep transition-colors">{p.name}</h3>
                  </button>
                  <p className="text-[0.8rem] md:text-[0.85rem] text-mid mb-5 leading-relaxed line-clamp-2">
                    {p.description || p.desc}
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="font-display text-[1.2rem] md:text-[1.4rem] font-bold text-charcoal">₹{Number(p.price).toLocaleString('en-IN')}</span>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-3 bg-charcoal/5 px-3 py-1.5 rounded-full border border-charcoal/10">
                        <button 
                          onClick={() => setQuantities(prev => ({ ...prev, [p.id]: Math.max(1, (prev[p.id] || 1) - 1) }))}
                          className="text-mid hover:text-charcoal w-4 h-4 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="text-[0.75rem] font-bold w-4 text-center">{quantities[p.id] || 1}</span>
                        <button 
                          onClick={() => setQuantities(prev => ({ ...prev, [p.id]: (prev[p.id] || 1) + 1 }))}
                          className="text-mid hover:text-charcoal w-4 h-4 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(p, quantities[p.id] || 1)}
                      className="btn-primary w-full text-[0.65rem] font-bold uppercase tracking-[0.15em] py-2.5 rounded-full transition-all flex items-center justify-center gap-2"
                    >
                      <span className="text-sm">🛍️</span> Buy Now
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
            className="btn btn-ghost px-12 py-4 shadow-xl"
          >
            Shop Full Collection
          </button>
        </div>
      </div>

      {/* Quick View Modal */}

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialData={user?.address || { name: user?.name || '' }}
      />
    </section>
  );
};

export const Marquee = React.memo(() => (
  <div className="overflow-hidden bg-charcoal py-3.5">
    <div className="flex items-center gap-6 whitespace-nowrap marquee-content w-max">
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
));

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

export const About = React.memo(() => {
  const navigate = useNavigate();
  return (
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
});
