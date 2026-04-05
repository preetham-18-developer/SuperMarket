'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  ShoppingBag, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  ShoppingBasket
} from 'lucide-react';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const wishlist = useStore((s) => s.wishlist);
  const clearWishlist = useStore((s) => s.clearWishlist);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shadow-sm border border-red-100">
                <Heart size={20} fill="currentColor" />
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-warm-dark tracking-tight">Your Wishlist</h1>
          </div>
          <p className="text-foreground-muted font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={14} className="text-orange-400" />
            {wishlist.length} saved items for later
          </p>
        </div>

        {wishlist.length > 0 && (
          <button 
            onClick={clearWishlist}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-border-custom text-warm-gray hover:text-red-500 hover:border-red-200 transition-all font-bold text-sm shadow-sm"
          >
            <Trash2 size={16} />
            Empty Wishlist
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {wishlist.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
          >
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center space-y-8 bg-white border border-border-custom rounded-[3rem] shadow-sm max-w-2xl mx-auto"
          >
             <div className="relative w-40 h-40 mx-auto">
                <div className="absolute inset-0 bg-red-50 rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center text-7xl shadow-inner border border-red-100">
                   ❤️
                </div>
                <div className="absolute top-2 right-2 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-bounce">
                   <Sparkles size={20} />
                </div>
             </div>
             
             <div className="space-y-2">
                <h3 className="text-3xl font-black text-warm-dark">Your wishlist is empty</h3>
                <p className="text-foreground-muted font-medium max-w-sm mx-auto leading-relaxed">
                   Save items you love and buy them later when they're on offer. Don't let your favorites slip away!
                </p>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/products">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-8 h-14"
                  >
                    Start Shopping <ChevronRight size={20} />
                  </motion.button>
                </Link>
                <Link href="/">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-sand-100 text-warm-dark font-black hover:bg-sand-200 transition-all h-14"
                  >
                    <ArrowLeft size={20} /> Back to Home
                  </motion.button>
                </Link>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Sections - If empty */}
      {wishlist.length === 0 && (
         <div className="space-y-8 pt-12">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <ShoppingBasket size={18} />
                 </div>
                 <h2 className="section-title">Fresh Arrivals</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* Fetch some static items as placeholders or actual data if available */}
               <p className="col-span-full text-foreground-muted text-sm font-bold uppercase tracking-widest text-center opacity-50">Discover new products</p>
            </div>
         </div>
      )}
    </div>
  );
}
