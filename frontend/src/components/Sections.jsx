import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Features = () => (
  <section className="py-20 md:py-36 bg-warm-white">
    <div className="max-w-7xl mx-auto px-4 md:px-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-7">
        {[
          { icon: '✨', title: 'Clinically Proven', desc: 'Dermatologist tested formulas with visible results in 14 days.' },
          { icon: '🌿', title: '100% Vegan', desc: 'Ethically sourced plant-based ingredients. Never tested on animals.' },
          { icon: '💧', title: 'Deep Hydration', desc: 'Micro-molecular weight hyaluronic acid for cellular penetration.' },
          { icon: '🌸', title: 'Sensorial Texture', desc: 'Lightweight, fast-absorbing serums that feel like velvet.' }
        ].map(feat => (
          <div key={feat.title} className="bg-cream rounded-2xl md:rounded-3xl p-6 md:p-10 text-center border-[1.5px] border-blush-deep/15 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(232,160,176,0.2)] hover:border-blush-deep/40 transition-all duration-400 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blush-deep/10 to-sage-deep/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-4xl md:text-5xl mb-4 md:mb-5 block drop-shadow-md relative z-10">{feat.icon}</span>
            <h3 className="font-display text-lg md:text-xl font-medium mb-2 md:mb-3 relative z-10">{feat.title}</h3>
            <p className="text-xs md:text-sm text-mid leading-relaxed relative z-10">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

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
          {productsData.map(p => (
            <div key={p.id} className="bg-warm-white rounded-2xl md:rounded-3xl overflow-hidden border-[1.5px] border-charcoal/5 hover:-translate-y-1.5 hover:shadow-[0_12px_48px_rgba(42,42,42,0.10)] transition-all group flex flex-col">
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
                <span className="text-[0.65rem] md:text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-sage-deep mb-1.5 block">{p.cat}</span>
                <h3 className="font-display text-[1.1rem] md:text-[1.25rem] font-medium mb-1.5">{p.name}</h3>
                <p className="text-[0.8rem] md:text-[0.85rem] text-mid mb-4 line-clamp-2 leading-[1.7]">{p.desc}</p>
                <div className="mt-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
                  <span className="font-display text-[1.2rem] md:text-[1.3rem] font-semibold">{p.price}</span>
                  <button 
                    onClick={() => handleAddToCart(p)}
                    className="w-full md:w-auto text-[0.78rem] font-semibold tracking-[0.06em] text-white bg-gradient-to-br from-blush-deep to-[#c9607a] px-4 md:px-5 py-2.5 rounded-full hover:scale-105 hover:shadow-[0_6px_20px_rgba(232,160,176,0.5)] transition-all text-center"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
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

export const Reviews = () => (
  <section id="reviews" className="py-20 md:py-36 bg-cream">
    <div className="max-w-7xl mx-auto px-4 md:px-10 text-center">
      <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage-deep bg-sage-deep/15 px-4 py-1.5 rounded-full mb-5">Testimonials</span>
      <h2 className="font-display text-4xl md:text-5xl text-charcoal mb-12 md:mb-20">Real <em className="italic text-blush-deep">Results</em></h2>
      
      <div className="max-w-4xl mx-auto bg-warm-white rounded-3xl p-8 md:p-14 border-[1.5px] border-charcoal/5 shadow-sm text-left relative">
        <div className="text-gold text-xl tracking-[0.1em] mb-5">★★★★★</div>
        <p className="font-display text-[1.1rem] md:text-[1.5rem] font-light italic leading-[1.65] text-charcoal mb-8 max-w-[680px]">
          "The Petal Glow Serum completely transformed my skin texture. My pores are visibly smaller and I have this constant, natural radiance. I've never received so many compliments."
        </p>
        <div className="flex items-center gap-4">
          <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" alt="Sarah J." className="w-[52px] h-[52px] rounded-full object-cover border-2 border-blush" />
          <div>
            <strong className="block text-[0.95rem]">Sarah J.</strong>
            <span className="text-[0.8rem] text-light">Verified Buyer</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

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
        <p className="text-mid mb-5 leading-relaxed text-sm md:text-base">At Zenphira, we believe that true beauty is the union of nature's wisdom and modern science. Founded by a team of dermatologists and botanists, every formula is a love letter to your skin.</p>
        <p className="text-mid mb-8 leading-relaxed text-sm md:text-base">We reject harmful fillers, harsh synthetics, and empty promises. Instead, we source the world's finest bioactive botanicals and pair them with clinically-validated compounds — giving you skincare that is both gentle and genuinely effective.</p>
        <div className="flex flex-wrap gap-3 mb-10">
          <div className="flex items-center gap-2 bg-sage-deep/15 border border-sage-deep/40 rounded-full px-4 py-2 text-xs md:text-sm font-medium text-charcoal"><span>🌍</span> Sustainably Sourced</div>
          <div className="flex items-center gap-2 bg-sage-deep/15 border border-sage-deep/40 rounded-full px-4 py-2 text-xs md:text-sm font-medium text-charcoal"><span>🧪</span> Clinically Validated</div>
        </div>
        <button className="bg-gradient-to-br from-blush-deep to-[#d4788a] text-white px-8 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-lg hover:-translate-y-1 transition-all">
          Discover Our Story
        </button>
      </div>
    </div>
  </section>
);

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
