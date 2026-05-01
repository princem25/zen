import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer } from '../Animations';

const reviewsData = [
  { id: 1, name: 'Sarah J.', skinType: 'Dry', rating: 5, text: "The Petal Glow Serum completely transformed my skin texture. My pores are visibly smaller and I have this constant, natural radiance.", date: '2 days ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80' },
  { id: 2, name: 'Michael K.', skinType: 'Oily', rating: 5, text: "Finally found a moisturizer that doesn't make me look like a grease ball. The Dew Veil is lightweight but incredibly hydrating.", date: '1 week ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' },
  { id: 3, name: 'Elena R.', skinType: 'Sensitive', rating: 4, text: "As someone with extreme sensitivity, I was hesitant. But the Calm & Clear Toner is so soothing. No redness, just fresh skin.", date: '2 weeks ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80' },
  { id: 4, name: 'David W.', skinType: 'Combination', rating: 5, text: "The Velvet Night Repair is worth every penny. I wake up looking like I've had 10 hours of sleep every single night.", date: '1 month ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
  { id: 5, name: 'Amina B.', skinType: 'Dry', rating: 5, text: "Luxury in a bottle. The packaging, the scent, and most importantly, the results are top-tier. My skin has never been softer.", date: '1 month ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
  { id: 6, name: 'Julian M.', skinType: 'Normal', rating: 5, text: "The consistency of these products is amazing. Not sticky, absorbs instantly, and the results are cumulative. Highly recommend.", date: '2 months ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80' }
];

const ReviewsPage = () => {
  const [filter, setFilter] = useState('All');

  const filteredReviews = filter === 'All' 
    ? reviewsData 
    : reviewsData.filter(r => r.skinType === filter);

  return (
    <div className="bg-cream min-h-screen">
      <main className="pt-32 pb-20">
        <section className="px-4 md:px-10 max-w-7xl mx-auto mb-20 text-center">
          <FadeIn direction="none" duration={1}>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sage-deep mb-6 block">Community Voices</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="font-display text-5xl md:text-7xl font-light text-charcoal mb-8">
              Real Results, <em className="italic text-blush-deep">Real Stories</em>
            </h1>
          </FadeIn>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-12"
          >
            {['All', 'Dry', 'Oily', 'Sensitive', 'Combination', 'Normal'].map(type => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-full text-xs font-medium tracking-wider transition-all border ${filter === type ? 'bg-charcoal text-white border-charcoal' : 'bg-white text-mid border-beige hover:border-charcoal'}`}
              >
                {type}
              </motion.button>
            ))}
          </motion.div>
        </section>

        <section className="px-4 md:px-10 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredReviews.map((review, i) => (
                <FadeIn key={review.id} delay={i * 0.1}>
                  <motion.div 
                    layout
                    className="bg-white p-8 rounded-[2rem] border border-beige shadow-sm hover:shadow-xl transition-all flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-blush/20" />
                        <div>
                          <strong className="block text-sm text-charcoal">{review.name}</strong>
                          <span className="text-[10px] uppercase tracking-widest text-mid">{review.skinType} Skin</span>
                        </div>
                      </div>
                      <div className="text-gold text-xs">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                      </div>
                    </div>
                    <p className="text-mid italic leading-relaxed mb-6 flex-1 italic">
                      "{review.text}"
                    </p>
                    <div className="pt-6 border-t border-beige flex justify-between items-center">
                      <span className="text-[10px] text-mid/60 uppercase tracking-widest">{review.date}</span>
                      <span className="text-[10px] text-sage-deep font-bold uppercase tracking-widest bg-sage-deep/10 px-2 py-1 rounded-full">Verified Buyer</span>
                    </div>
                  </motion.div>
                </FadeIn>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Share Your Story */}
        <section className="mt-32 px-4 md:px-10 max-w-4xl mx-auto text-center bg-warm-white rounded-[3rem] p-12 md:p-20 border border-beige shadow-inner">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">Want to share your journey?</h2>
          <p className="text-mid mb-10">We love hearing how Zenphira has helped you achieve your skin goals. Share your results with our community.</p>
          <button className="bg-gradient-to-br from-blush-deep to-[#d4788a] text-white px-10 py-4 rounded-full text-sm font-semibold shadow-xl hover:scale-105 transition-all">
            Write a Review
          </button>
        </section>
      </main>
    </div>
  );
};

export default ReviewsPage;
