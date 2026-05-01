import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer } from '../Animations';

const AboutPage = () => {
  return (
    <div className="bg-warm-white min-h-screen">
      
      <main className="pt-32">
        {/* Story Header */}
        <section className="px-4 md:px-10 max-w-7xl mx-auto mb-20 md:mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn direction="left">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sage-deep mb-6 block">Our Genesis</span>
                <h1 className="font-display text-5xl md:text-7xl font-light leading-tight text-charcoal mb-8">
                  Skincare for the <em className="italic text-blush-deep">Modern Soul</em>
                </h1>
                <p className="text-lg text-mid leading-relaxed mb-8">
                  Zenphira was born in a small botanical laboratory with a singular vision: to bridge the gap between ancient plant wisdom and cutting-edge dermatological science.
                </p>
                <div className="h-[1px] w-20 bg-sage-deep/30 mb-8"></div>
                <p className="text-mid leading-relaxed">
                  We believe that your skin is a living mirror of your internal well-being. Our formulations are designed not just to treat symptoms, but to nourish the cellular foundation of your radiance.
                </p>
              </FadeIn>
            </div>
            <div className="relative">
              <FadeIn direction="right" delay={0.3}>
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5 }}
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80" 
                    alt="Laboratory" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-10 -left-10 w-48 h-48 bg-cream rounded-full hidden md:flex items-center justify-center p-8 text-center shadow-xl border border-beige"
                >
                  <span className="font-display text-sm italic text-charcoal">"Beauty in Balance"</span>
                </motion.div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Philosophy Grid */}
        <section className="bg-cream py-24 md:py-36 border-y border-beige">
          <div className="px-4 md:px-10 max-w-7xl mx-auto text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl text-charcoal">The Three Pillars</h2>
          </div>
          <div className="px-4 md:px-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Purity', desc: 'Every ingredient is ethically sourced and 100% vegan. We reject over 2,000 potentially harmful synthetics.', icon: '🌿' },
              { title: 'Potency', desc: 'Clinically validated concentrations of active botanicals ensure visible results within your first 14 days.', icon: '🧪' },
              { title: 'Ritual', desc: 'Skincare is self-care. We craft sensorial textures and natural scents that turn your routine into a daily sanctuary.', icon: '✨' }
            ].map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.2} distance={40}>
                <div className="bg-white/50 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white hover:shadow-xl transition-all text-center h-full group">
                  <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform">{pillar.icon}</span>
                  <h3 className="font-display text-2xl font-medium mb-4">{pillar.title}</h3>
                  <p className="text-sm text-mid leading-relaxed">{pillar.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Timeline / Heritage */}
        <section className="py-24 md:py-36 px-4 md:px-10 max-w-5xl mx-auto">
          <div className="space-y-24 relative before:absolute before:left-[19px] md:before:left-1/2 before:top-0 before:bottom-0 before:w-[1px] before:bg-beige">
            {[
              { year: '2012', title: 'The Lab', desc: 'Our lead scientist, Dr. Elena Thorne, begins research on bio-active peptide extraction from desert succulents.' },
              { year: '2015', title: 'First Formula', desc: 'The Petal Glow Serum is perfected after 427 iterations, achieving 48-hour hydration levels.' },
              { year: '2018', title: 'Zenphira Home', desc: 'We open our first flagship boutique, designed as a sensory sanctuary for skin consultation.' },
              { year: '2024', title: 'Global Impact', desc: 'Transitioned to 100% biodegradable packaging and carbon-neutral distribution.' }
            ].map((event, i) => (
              <FadeIn key={i} direction={i % 2 === 0 ? 'left' : 'right'} distance={50}>
                <div className={`flex flex-col md:flex-row items-start gap-8 relative ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="w-10 h-10 bg-white border-2 border-blush-deep rounded-full flex items-center justify-center z-10 shrink-0">
                    <div className="w-2 h-2 bg-blush-deep rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-beige hover:shadow-md transition-shadow">
                    <span className="text-blush-deep font-display text-2xl font-semibold mb-2 block">{event.year}</span>
                    <h4 className="text-xl font-medium mb-3">{event.title}</h4>
                    <p className="text-sm text-mid leading-relaxed">{event.desc}</p>
                  </div>
                  <div className="hidden md:block flex-1"></div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal text-white py-24 md:py-36 text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <h2 className="font-display text-4xl md:text-6xl font-light mb-8 italic">Ready to start your ritual?</h2>
            <p className="text-white/60 mb-12 text-lg">Explore our collection of science-backed botanical skincare.</p>
            <button className="bg-white text-charcoal px-10 py-4 rounded-full text-sm font-semibold hover:bg-blush hover:text-white transition-all shadow-2xl">
              Shop the Collection
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
