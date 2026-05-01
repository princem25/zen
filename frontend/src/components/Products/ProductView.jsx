import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn } from '../Animations';
import { useAuth } from '../../context/AuthContext';
import { getCloudinaryUrl } from '../../lib/cloudinary';

const productsData = [
  { id: 1, name: 'Petal Glow Serum', cat: 'Serum', price: '₹1,499', img: getCloudinaryUrl('/product_glow_serum_1777524145107.png'), badge: 'Bestseller', desc: 'Rose hip & vitamin C brightening serum for luminous skin. Infused with pure Bulgarian Rose extracts and high-potency Vitamin C to reveal your most radiant, petal-soft complexion.' },
  { id: 2, name: 'Dew Veil Moisturizer', cat: 'Moisturizer', price: '₹1,899', img: getCloudinaryUrl('/product_veil_moisturizer_1777524161649.png'), badge: 'New', desc: 'Hyaluronic acid & ceramide blend for 48-hour deep hydration. This lightweight yet intense cream creates a breathable veil of moisture that locks in hydration all day long.' },
  { id: 3, name: 'Calm & Clear Toner', cat: 'Toner', price: '₹999', img: getCloudinaryUrl('/product_clear_toner_1777524178937.png'), badge: null, desc: 'Niacinamide & green tea essence to minimize pores, balance skin. A soothing, alcohol-free formula that removes impurities while calming inflammation and refining skin texture.' },
  { id: 4, name: 'Velvet Night Repair', cat: 'Night Cream', price: '₹2,299', img: getCloudinaryUrl('/product_night_repair_1777524200469.png'), badge: null, desc: 'Retinol & bakuchiol restorative cream — wake up to softer skin. A potent nighttime treatment that accelerates cellular turnover and collagen production while you sleep.' }
];

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    alert(`Added ${qty} x ${product.name} to cart!`);
  };

  useEffect(() => {
    const found = productsData.find(p => p.id === parseInt(id));
    if (found) {
      setProduct(found);
    } else {
      navigate('/products');
    }
  }, [id, navigate]);

  if (!product) return null;

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-mid hover:text-charcoal mb-12 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Image Gallery */}
          <FadeIn direction="right">
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-charcoal/5 shadow-2xl">
              <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
              {product.badge && (
                <span className={`absolute top-6 left-6 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full z-10 ${product.badge === 'New' ? 'bg-gradient-to-r from-sage-deep to-[#5a8c54] text-white' : 'bg-blush-deep text-white'}`}>
                  {product.badge}
                </span>
              )}
            </div>
          </FadeIn>

          {/* Product Details */}
          <FadeIn direction="left">
            <div className="flex flex-col h-full py-4">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-sage-deep bg-sage-deep/15 px-4 py-1.5 rounded-full mb-6 w-fit">
                {product.cat}
              </span>
              <h1 className="font-display text-4xl md:text-6xl text-charcoal mb-4">{product.name}</h1>
              <p className="font-display text-3xl font-semibold text-blush-deep mb-8">{product.price}</p>
              
              <div className="w-16 h-[3px] bg-sage-deep/30 mb-10"></div>
              
              <div className="prose prose-neutral mb-12">
                <p className="text-mid text-lg leading-relaxed">{product.desc}</p>
              </div>

              {/* Perks */}
              <div className="flex flex-wrap gap-3 mb-12">
                <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-charcoal/5 px-5 py-2 rounded-full"><span>🌿</span> 100% Natural</div>
                <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-charcoal/5 px-5 py-2 rounded-full"><span>🐰</span> Cruelty-Free</div>
                <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-charcoal/5 px-5 py-2 rounded-full"><span>✨</span> Dermatologist Tested</div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-5 mt-auto">
                <div className="flex items-center justify-between border border-charcoal/15 rounded-full px-6 py-4 sm:w-40">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-2xl text-mid hover:text-charcoal w-8 flex justify-center transition-colors">-</button>
                  <span className="font-bold text-lg w-12 text-center text-charcoal">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="text-2xl text-mid hover:text-charcoal w-8 flex justify-center transition-colors">+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-primary flex-1 text-base uppercase tracking-[0.15em] py-5"
                >
                  Add to Cart ✦
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-16 grid grid-cols-2 gap-8 pt-8 border-t border-charcoal/10">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-mid mb-2">Usage</h4>
                  <p className="text-sm text-charcoal">Apply morning and night to cleansed skin.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-mid mb-2">Shipping</h4>
                  <p className="text-sm text-charcoal">Free express delivery on orders over ₹2000.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Suggested Section */}
      <section className="mt-32 border-t border-charcoal/5 pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <h2 className="font-display text-3xl text-charcoal mb-12">Complete the <em className="italic text-blush-deep">Ritual</em></h2>
          <div className="grid grid-cols-1 min-[430px]:grid-cols-2 md:grid-cols-4 gap-6">
            {productsData.filter(p => p.id !== product.id).slice(0, 4).map(p => (
              <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer group">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-4 relative">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700" />
                </div>
                <h4 className="font-display text-lg text-charcoal group-hover:text-blush-deep transition-colors">{p.name}</h4>
                <p className="text-xs text-mid">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductView;
