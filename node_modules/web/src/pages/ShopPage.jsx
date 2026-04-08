import React from 'react';
import { motion } from 'framer-motion';
import ProductsList from '@/components/ProductsList.jsx';
import { ShoppingBag } from 'lucide-react';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-white/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="font-bebas text-5xl tracking-wide text-foreground">Negozio <span className="text-primary">Ufficiale</span></h1>
            </div>
            <p className="text-muted-foreground text-lg">Acquista merchandising esclusivo, potenziamenti e pass per i tornei.</p>
          </div>
        </motion.div>

        <div className="animate-fade-up">
          <ProductsList />
        </div>
      </div>
    </div>
  );
}