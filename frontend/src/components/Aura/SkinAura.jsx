import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkinAura = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setResult(null);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          generateResult();
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  const generateResult = () => {
    const auras = [
      { color: '#f2c4ce', name: 'Blush Radiance', score: 92, recommendation: 'Petal Glow Serum', concern: 'Dullness' },
      { color: '#b5c9b0', name: 'Sage Serenity', score: 88, recommendation: 'Calm & Clear Toner', concern: 'Sensitivity' },
      { color: '#e5e1da', name: 'Dewy Mist', score: 95, recommendation: 'Dew Veil Moisturizer', concern: 'Dehydration' },
      { color: '#2a2a2a', name: 'Midnight Repair', score: 85, recommendation: 'Velvet Night Repair', concern: 'Fine Lines' }
    ];
    const randomAura = auras[Math.floor(Math.random() * auras.length)];
    setResult(randomAura);
    setIsScanning(false);
  };

  return (
    <div className="bg-warm-white min-h-screen">
      <main className="pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold tracking-[0.22em] uppercase text-sage-deep bg-sage-deep/20 px-4 py-1.5 rounded-full mb-6 inline-block"
          >
            Exclusive Technology
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-light text-charcoal mb-8"
          >
            Discover Your <em className="italic text-blush-deep">Skin Aura</em>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-mid text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Our proprietary bio-luminescent analysis tool measures your skin's natural radiance and hydration levels in real-time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Scanner UI */}
          <div className="relative aspect-square max-w-md mx-auto w-full group">
            <div className="absolute inset-0 border-[1px] border-charcoal/10 rounded-[3rem] p-4">
              <div className="w-full h-full bg-cream rounded-[2.5rem] overflow-hidden relative flex items-center justify-center border border-beige shadow-inner">
                {/* Simulated Webcam Feed */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80')] bg-cover bg-center grayscale opacity-40 mix-blend-overlay"></div>
                
                <AnimatePresence>
                  {!isScanning && !result && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.1, opacity: 0 }}
                      className="text-center z-10 p-8"
                    >
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-4xl">✨</div>
                      <h3 className="font-display text-2xl text-charcoal mb-4">Ready to scan?</h3>
                      <p className="text-mid text-sm mb-8">Position your face in the center and ensure good lighting.</p>
                      <button 
                        onClick={startScan}
                        className="bg-charcoal text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-blush-deep transition-all shadow-2xl"
                      >
                        Initialize Analysis
                      </button>
                    </motion.div>
                  )}

                  {isScanning && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-warm-white/40 backdrop-blur-sm"
                    >
                      <div className="w-64 h-64 border-2 border-dashed border-blush-deep/40 rounded-full animate-spin-slow relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blush-deep rounded-full shadow-[0_0_15px_rgba(232,160,176,1)]"></div>
                      </div>
                      <div className="mt-12 text-center">
                        <div className="font-display text-4xl text-charcoal mb-2">{scanProgress}%</div>
                        <div className="text-[10px] tracking-[0.3em] uppercase text-mid">Analyzing Bio-Markers...</div>
                      </div>
                      {/* Scanning Line */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blush-deep to-transparent shadow-[0_0_10px_rgba(232,160,176,0.5)] z-30"
                      />
                    </motion.div>
                  )}

                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-md"
                    >
                      <div 
                        className="w-32 h-32 rounded-full mb-6 shadow-2xl relative"
                        style={{ background: `radial-gradient(circle, ${result.color} 0%, transparent 70%)` }}
                      >
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-current opacity-30"
                          style={{ color: result.color }}
                        />
                      </div>
                      <h3 className="font-display text-3xl text-charcoal mb-2">{result.name}</h3>
                      <div className="flex gap-4 mb-8">
                        <div className="text-center">
                          <span className="text-[10px] uppercase tracking-widest text-mid block">Aura Score</span>
                          <span className="text-xl font-bold text-charcoal">{result.score}</span>
                        </div>
                        <div className="w-[1px] h-10 bg-beige"></div>
                        <div className="text-center">
                          <span className="text-[10px] uppercase tracking-widest text-mid block">Dominant Concern</span>
                          <span className="text-xl font-bold text-charcoal">{result.concern}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setResult(null)}
                        className="text-xs font-bold tracking-widest uppercase text-mid hover:text-charcoal transition-colors underline underline-offset-8"
                      >
                        Retake Scan
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Result Info */}
          <div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <span className="text-xs font-semibold tracking-widest uppercase text-blush-deep mb-4 block">Recommended Ritual</span>
                  <h2 className="text-4xl md:text-5xl font-display text-charcoal mb-8 leading-tight">
                    Your skin is calling for <em className="italic">{result.recommendation}</em>
                  </h2>
                  <p className="text-mid text-lg mb-10 leading-relaxed">
                    Based on your Aura analysis, your skin is currently in a "{result.name}" state. This indicates a primary need for addressing {result.concern.toLowerCase()} to restore your natural equilibrium.
                  </p>
                  <div className="bg-cream p-8 rounded-3xl border border-beige flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm text-3xl">✨</div>
                    <div>
                      <h4 className="font-bold text-charcoal">{result.recommendation}</h4>
                      <p className="text-sm text-mid">Unlock your full radiance potential.</p>
                    </div>
                  </div>
                  <button className="w-full md:w-auto bg-charcoal text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-blush-deep transition-all shadow-xl">
                    Add Recommended Routine
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="placeholder-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <h2 className="text-4xl md:text-5xl font-display text-charcoal mb-8 leading-tight">
                    How it <em className="italic">Works</em>
                  </h2>
                  <div className="space-y-6">
                    {[
                      { step: '01', title: 'Calibration', desc: 'Our AI calibrates to your environment\'s lighting to ensure 100% accuracy.' },
                      { step: '02', title: 'Bio-Mapping', desc: 'We map 12 key zones on your face to measure micro-vascular blood flow and sebum levels.' },
                      { step: '03', title: 'Ritual Formulation', desc: 'Receive a bespoke product recommendation tailored to your current skin state.' }
                    ].map(step => (
                      <div key={step.step} className="flex gap-6">
                        <span className="text-blush-deep font-display text-2xl italic">{step.step}</span>
                        <div>
                          <h4 className="font-bold text-charcoal mb-1">{step.title}</h4>
                          <p className="text-sm text-mid">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkinAura;
