import React from 'react';
import { Navbar } from '../UI';
import { Footer, Products } from '../Sections';

export default function ProductsPage() {
    return (
        <div className="font-body text-charcoal bg-cream min-h-screen">
            <Navbar />
            <div className="pt-20">
                <Products />
            </div>
            <Footer />
        </div>
    );
}
