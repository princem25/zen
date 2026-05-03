import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn } from '../Animations';
import { useAuth } from '../../context/AuthContext';
import { getCloudinaryUrl } from '../../lib/cloudinary';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, getDocs, limit, query, where } from 'firebase/firestore';
import AddressModal from '../Checkout/AddressModal';
import { generateWhatsAppOrderLink } from '../../lib/whatsapp';

const productsData = [
  { id: '1', name: 'Petal Glow Serum', cat: 'Serum', price: '₹1,499', img: 'v1777614636/product_glow_serum_1777524145107_icb4ur.jpg', badge: 'Bestseller', desc: 'Rose hip & vitamin C brightening serum for luminous skin. Infused with pure Bulgarian Rose extracts and high-potency Vitamin C to reveal your most radiant, petal-soft complexion.' },
  { id: '2', name: 'Dew Veil Moisturizer', cat: 'Moisturizer', price: '₹1,899', img: 'v1777614637/product_veil_moisturizer_1777524161649_ponzaw.jpg', badge: 'New', desc: 'Hyaluronic acid & ceramide blend for 48-hour deep hydration. This lightweight yet intense cream creates a breathable veil of moisture that locks in hydration all day long.' },
  { id: '3', name: 'Calm & Clear Toner', cat: 'Toner', price: '₹999', img: 'v1777614637/product_clear_toner_1777524178937_kgqmao.jpg', badge: null, desc: 'Niacidamide & green tea essence to minimize pores, balance skin. A soothing, alcohol-free formula that removes impurities while calming inflammation and refining skin texture.' },
  { id: '4', name: 'Velvet Night Repair', cat: 'Night Cream', price: '₹2,299', img: 'v1777614636/product_night_repair_1777524200469_ehcvkx.jpg', badge: null, desc: 'Retinol & bakuchiol restorative cream — wake up to softer skin. A potent nighttime treatment that accelerates cellular turnover and collagen production while you sleep.' }
];

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserAddress } = useAuth();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggested, setSuggested] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { 
            id: docSnap.id, 
            ...docSnap.data(),
            img: getCloudinaryUrl(docSnap.data().img)
          };
          setProduct(data);

          // Fetch suggested products
          const q = query(
            collection(db, 'products'),
            where('category', '==', data.category),
            limit(5)
          );
          const suggestSnap = await getDocs(q);
          setSuggested(
            suggestSnap.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(p => p.id !== id)
          );
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blush-deep border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return null;

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.address) {
      const link = generateWhatsAppOrderLink(product, qty, user.address);
      window.open(link, '_blank');
    } else {
      setIsAddressModalOpen(true);
    }
  };

  const handleSaveAddress = async (addressData) => {
    await updateUserAddress(addressData);
    setIsAddressModalOpen(false);
    const link = generateWhatsAppOrderLink(product, qty, addressData);
    window.open(link, '_blank');
  };

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-mid hover:text-charcoal mb-12 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Collection
        </button>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image Gallery - Sticky on Desktop */}
          <FadeIn direction="right" className="md:sticky md:top-32">
            <div className="space-y-6 max-w-md mx-auto md:mx-0">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-charcoal/5 shadow-xl">
                <img src={product.img} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                {product.badge && (
                  <span className={`absolute top-6 left-6 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full z-10 ${product.badge === 'New' ? 'bg-gradient-to-r from-sage-deep to-[#5a8c54] text-white' : 'bg-blush-deep text-white'}`}>
                    {product.badge}
                  </span>
                )}
              </div>
              {/* Thumbnail Gallery (Setup for multiple images) */}
              <div className="flex gap-3 px-1">
                {[product.img, product.img, product.img].map((img, i) => (
                  <div key={i} className={`w-14 h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${i === 0 ? 'border-blush-deep' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Product Details - Right Side on Desktop */}
          <FadeIn direction="left">
            <div className="flex flex-col h-full py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-sage-deep bg-sage-deep/15 px-4 py-1.5 rounded-full w-fit">
                  {product.category || product.cat}
                </span>
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < 4 ? "text-gold" : "text-beige"}>★</span>
                  ))}
                  <button 
                    onClick={() => navigate('/reviews')}
                    className="text-[10px] text-mid font-bold ml-2 tracking-widest hover:text-blush-deep transition-colors"
                  >
                    4.8 (120+ Reviews)
                  </button>
                </div>
              </div>
              <h1 className="font-display text-4xl md:text-6xl text-charcoal mb-4">{product.name}</h1>
              <p className="font-display text-3xl font-semibold text-blush-deep mb-8">₹{Number(product.price).toLocaleString('en-IN')}</p>
              
              <div className="w-16 h-[3px] bg-sage-deep/30 mb-10"></div>
              
              <div className="prose prose-neutral mb-8">
                <p className="text-mid text-lg leading-relaxed">{product.description || product.desc}</p>
              </div>

              {product.ingredients && (
                <div className="mb-8">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-mid mb-3">Key Ingredients</h4>
                  <p className="text-sm text-charcoal leading-relaxed">{product.ingredients}</p>
                </div>
              )}

              {/* Perks */}
              <div className="flex flex-wrap gap-3 mb-12">
                <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-charcoal/5 px-5 py-2 rounded-full"><span>🌿</span> 100% Natural</div>
                <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-charcoal/5 px-5 py-2 rounded-full"><span>🐰</span> Cruelty-Free</div>
                <div className="flex items-center gap-2 text-sm font-medium text-charcoal bg-charcoal/5 px-5 py-2 rounded-full"><span>✨</span> Dermatologist Tested</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 mt-8 mb-12">
                <div className="flex items-center justify-between border border-charcoal/15 rounded-full px-6 py-4 sm:w-40">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-2xl text-mid hover:text-charcoal w-8 flex justify-center transition-colors">-</button>
                  <span className="font-bold text-lg w-12 text-center text-charcoal">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="text-2xl text-mid hover:text-charcoal w-8 flex justify-center transition-colors">+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-primary flex-1 text-sm uppercase tracking-[0.15em] py-4 flex items-center justify-center gap-3"
                >
                  <span className="text-lg">🛍️</span> Buy Now
                </button>
              </div>

              {user?.address && (
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-mid hover:text-blush-deep transition-colors text-left"
                >
                  Shipping to: {user.address.city} (Change)
                </button>
              )}

              {/* Details Accordion / Specification */}
              <div className="mt-12 space-y-6">
                <details className="group border-b border-charcoal/10 pb-4" open>
                  <summary className="list-none flex justify-between items-center cursor-pointer font-bold text-[10px] uppercase tracking-widest text-charcoal">
                    Detailed Specification
                    <span className="group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <div className="mt-4 text-sm text-mid leading-relaxed space-y-3">
                    <div className="flex justify-between border-b border-beige/50 pb-2">
                      <span className="font-medium">Skin Type</span>
                      <span>{product.skinType || 'All Skin Types'}</span>
                    </div>
                    <div className="flex justify-between border-b border-beige/50 pb-2">
                      <span className="font-medium">Volume</span>
                      <span>30ml / 1.0 fl.oz</span>
                    </div>
                    <div className="flex justify-between border-b border-beige/50 pb-2">
                      <span className="font-medium">PH Level</span>
                      <span>5.5 (Balanced)</span>
                    </div>
                  </div>
                </details>
                
                <details className="group border-b border-charcoal/10 pb-4">
                  <summary className="list-none flex justify-between items-center cursor-pointer font-bold text-[10px] uppercase tracking-widest text-charcoal">
                    How to Use
                    <span className="group-open:rotate-180 transition-transform">↓</span>
                  </summary>
                  <div className="mt-4 text-sm text-mid leading-relaxed">
                    Apply 2-3 drops to clean, damp skin. Gently press into face and neck until fully absorbed. Follow with moisturizer.
                  </div>
                </details>
              </div>

              {/* Additional Info */}
              <div className="mt-16 grid grid-cols-2 gap-8 pt-8 border-t border-charcoal/10">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-mid mb-2">Shipping</h4>
                  <p className="text-sm text-charcoal">Free express delivery on orders over ₹2000.</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-mid mb-2">Returns</h4>
                  <p className="text-sm text-charcoal">Easy 7-day returns for unopened products.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Suggested Section */}
      {suggested.length > 0 && (
        <section className="mt-32 border-t border-charcoal/5 pt-24">
          <div className="max-w-7xl mx-auto px-4 md:px-10">
            <h2 className="font-display text-3xl text-charcoal mb-12">Complete the <em className="italic text-blush-deep">Ritual</em></h2>
            <div className="grid grid-cols-1 min-[430px]:grid-cols-2 md:grid-cols-4 gap-6">
              {suggested.map(p => (
                <div key={p.id} onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer group">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-4 relative">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700" />
                  </div>
                  <h4 className="font-display text-lg text-charcoal group-hover:text-blush-deep transition-colors">{p.name}</h4>
                  <p className="text-xs text-mid">₹{Number(p.price).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleSaveAddress}
        initialData={user?.address || { name: user?.name || '' }}
      />
    </div>
  );
};

export default ProductView;
