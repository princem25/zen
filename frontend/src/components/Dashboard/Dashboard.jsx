import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FadeIn } from '../Animations';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-cream">
            <main className="max-w-7xl mx-auto px-4 md:px-10 pt-32 pb-20">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <FadeIn direction="left">
                        <div>
                            <h1 className="text-5xl font-display font-light text-charcoal tracking-tight">My <em className="italic text-blush-deep">Orders</em></h1>
                            <p className="text-mid mt-2 text-lg">Track your skincare ritual journey and order history.</p>
                        </div>
                    </FadeIn>
                    <FadeIn direction="right" delay={0.2}>
                        <div className="flex items-center gap-4 bg-white/50 px-6 py-3 rounded-2xl border border-beige">
                            <div className="w-10 h-10 bg-sage-deep/20 rounded-full flex items-center justify-center text-sage-deep font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div>
                                <span className="block text-xs font-semibold text-mid uppercase tracking-widest">Active Ritualist</span>
                                <span className="block text-sm font-bold text-charcoal">{user?.name}</span>
                            </div>
                        </div>
                    </FadeIn>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Active Orders', value: '0', color: 'bg-blush/10 text-blush-deep' },
                        { label: 'Completed', value: '0', color: 'bg-sage-deep/10 text-sage-deep' },
                        { label: 'Loyalty Tier', value: 'Rose Quartz', color: 'bg-warm-white text-charcoal' },
                        { label: 'Next Delivery', value: '---', color: 'bg-cream text-mid' }
                    ].map((stat, i) => (
                        <FadeIn key={stat.label} delay={i * 0.1 + 0.3} distance={20}>
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-beige hover:shadow-md transition-all group">
                                <span className="text-[10px] font-bold text-mid uppercase tracking-[0.2em] block mb-3">{stat.label}</span>
                                <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 ${stat.color}`}>
                                    Status Check
                                </div>
                                <div className="text-3xl font-display font-bold text-charcoal">{stat.value}</div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-beige overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                            <h3 className="text-2xl font-display font-medium text-charcoal">Recent Rituals</h3>
                            <div className="flex gap-4">
                                <button className="text-xs font-bold uppercase tracking-widest text-blush-deep border-b-2 border-blush-deep pb-1">All Orders</button>
                                <button className="text-xs font-bold uppercase tracking-widest text-mid hover:text-charcoal transition-colors pb-1">Processing</button>
                                <button className="text-xs font-bold uppercase tracking-widest text-mid hover:text-charcoal transition-colors pb-1">Shipped</button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-20 text-center bg-cream/20 rounded-[2rem] border border-dashed border-beige">
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border border-beige/50"
                            >
                                <span className="text-4xl">📦</span>
                            </motion.div>
                            <h4 className="text-xl font-display font-medium text-charcoal mb-2">No orders discovered yet</h4>
                            <p className="text-mid max-w-sm mx-auto mb-10">Your skincare sanctuary is waiting to be filled. Start your transformation today.</p>
                            <Link 
                                to="/products" 
                                className="bg-charcoal text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-blush-deep hover:scale-105 transition-all shadow-xl"
                            >
                                Shop the Collection
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
