import React, { useState } from 'react';
import { Products } from '../Sections';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer } from '../Animations';

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeSort, setActiveSort] = useState('Featured');
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const categories = ['All', 'Serums', 'Moisturizers', 'Toners', 'Night Care', 'Sun Protection'];
    const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Bestsellers'];

    return (
        <div className="font-body text-charcoal bg-warm-white min-h-screen" onClick={() => setSortOpen(false)}>
            <main className="pt-32 pb-20">
                {/* Hero Header */}
                <header className="px-4 md:px-10 max-w-7xl mx-auto mb-20 text-center">
                    <FadeIn direction="none" duration={1}>
                        <span className="text-xs font-semibold tracking-[0.22em] uppercase text-sage-deep mb-6 block">The Collection</span>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <h1 className="font-display text-5xl md:text-7xl font-light text-charcoal mb-8">
                            Elevate Your <em className="italic text-blush-deep">Ritual</em>
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <p className="text-mid text-lg max-w-2xl mx-auto leading-relaxed">
                            Precision-engineered formulas crafted with rare botanicals and clinical actives to reveal your most radiant skin yet.
                        </p>
                    </FadeIn>
                </header>

                {/* Filter / Category Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="sticky top-20 z-40 bg-warm-white/80 backdrop-blur-md border-y border-beige py-4 md:py-6 mb-16"
                >
                    <div className="max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between">
                        {/* Mobile Filter Button */}
                        <div className="flex md:hidden items-center w-full justify-between">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setMobileFilterOpen(true); }}
                                className="flex items-center gap-3 text-xs font-bold tracking-[0.15em] uppercase text-charcoal"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" y1="21" x2="4" y2="14" />
                                    <line x1="4" y1="10" x2="4" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12" y2="3" />
                                    <line x1="20" y1="21" x2="20" y2="16" />
                                    <line x1="20" y1="12" x2="20" y2="3" />
                                    <line x1="1" y1="14" x2="7" y2="14" />
                                    <line x1="9" y1="8" x2="15" y2="8" />
                                    <line x1="17" y1="16" x2="23" y2="16" />
                                </svg>
                                <span>Filters</span>
                            </button>
                            
                            <div className="relative">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setSortOpen(!sortOpen); }}
                                    className="flex items-center gap-2 text-[10px] font-bold text-mid uppercase tracking-widest bg-beige/30 px-3 py-1.5 rounded-full"
                                >
                                    <span>{activeSort}</span>
                                    <motion.svg 
                                        animate={{ rotate: sortOpen ? 180 : 0 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <path d="M6 9l6 6 6-6" />
                                    </motion.svg>
                                </button>

                                <AnimatePresence>
                                    {sortOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-xl border border-beige p-2 z-[2100]"
                                        >
                                            {sortOptions.map(opt => (
                                                <button 
                                                    key={opt}
                                                    onClick={() => { setActiveSort(opt); setSortOpen(false); }}
                                                    className={`w-full text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-colors ${activeSort === opt ? 'bg-cream text-blush-deep' : 'text-mid hover:bg-cream hover:text-charcoal'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Desktop Filter List */}
                        <div className="hidden md:flex items-center gap-8 md:gap-12 whitespace-nowrap">
                            {categories.map((cat) => (
                                <motion.button
                                    key={cat}
                                    whileHover={{ y: -2 }}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-xs font-semibold tracking-widest uppercase transition-all relative group ${activeCategory === cat ? 'text-charcoal' : 'text-mid/60 hover:text-charcoal'}`}
                                >
                                    {cat}
                                    <span className={`absolute -bottom-2 left-0 h-[1.5px] bg-blush-deep transition-all duration-300 ${activeCategory === cat ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Desktop Sort Dropdown */}
                        <div className="hidden md:flex items-center gap-6 relative">
                            <span className="text-xs font-semibold text-mid/60 uppercase tracking-widest">Sort By:</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setSortOpen(!sortOpen); }}
                                className="flex items-center gap-3 text-xs font-bold text-charcoal group"
                            >
                                <span>{activeSort}</span>
                                <motion.div 
                                    animate={{ rotate: sortOpen ? 180 : 0 }} 
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-blush-deep"
                                >
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {sortOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 15 }}
                                        className="absolute right-0 top-full mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-beige p-3 z-50 overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {sortOptions.map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => { setActiveSort(opt); setSortOpen(false); }}
                                                    className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-xl transition-all ${activeSort === opt ? 'bg-cream text-blush-deep' : 'text-mid hover:bg-cream hover:text-charcoal'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Mobile Filter Overlay */}
                <AnimatePresence>
                    {mobileFilterOpen && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[2000] bg-charcoal/20 backdrop-blur-sm md:hidden"
                            onClick={() => setMobileFilterOpen(false)}
                        >
                            <motion.div 
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="font-display text-2xl font-light text-charcoal">Filters</h3>
                                    <button 
                                        onClick={() => setMobileFilterOpen(false)}
                                        className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-charcoal"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex flex-col gap-6">
                                    {categories.map((cat, idx) => (
                                        <motion.button
                                            key={cat}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            onClick={() => { setActiveCategory(cat); setMobileFilterOpen(false); }}
                                            className={`text-left font-body text-xl tracking-wide flex items-center justify-between group ${activeCategory === cat ? 'text-blush-deep font-semibold' : 'text-mid'}`}
                                        >
                                            {cat}
                                            {activeCategory === cat && <span className="text-blush-deep text-lg">✦</span>}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Products Grid */}
                <div className="px-4 md:px-10 max-w-7xl mx-auto">
                    <Products />
                </div>

                {/* Bundle Section */}
                <section className="mt-32 px-4 md:px-10 max-w-7xl mx-auto">
                    <FadeIn direction="up" distance={50}>
                        <div className="bg-charcoal rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center text-white">
                            <div className="w-full md:w-1/2 aspect-square relative">
                                <motion.img 
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 1.5 }}
                                    src="https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80" 
                                    alt="Skincare set" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                />
                            </div>
                            <div className="w-full md:w-1/2 p-12 md:p-20">
                                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-blush mb-6 block">Exclusive Sets</span>
                                <h2 className="font-display text-4xl md:text-5xl font-light mb-8">The Essential <em className="italic">Glow Trio</em></h2>
                                <p className="text-white/70 mb-10 leading-relaxed">
                                    Our three most iconic formulas packaged together for a complete day-to-night transformation. Save 20% when purchased as a set.
                                </p>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                                    <div>
                                        <span className="text-white/40 text-xs line-through block">₹4,397</span>
                                        <span className="text-3xl font-display font-semibold text-white">₹3,499</span>
                                    </div>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-fit bg-white text-charcoal px-8 py-4 rounded-full text-sm font-semibold hover:bg-blush hover:text-white transition-all shadow-2xl whitespace-nowrap"
                                    >
                                        Shop the Set
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>
            </main>
        </div>
    );
}
