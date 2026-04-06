'use client';

import { useStore, PRODUCTS } from '@/lib/store';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, ChevronLeft, Minus, Plus, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState, use } from 'react';

export default function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);
  const addToCart = useStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
      {/* Navigation Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="flex items-center gap-3 px-6 h-12 rounded-2xl bg-white border border-border-custom text-foreground hover:bg-primary hover:text-white transition-all shadow-sm font-black text-xs uppercase tracking-widest"
        >
          <ChevronLeft size={20} />
          Go Back
        </motion.button>

        <Link href="/">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 h-12 rounded-2xl bg-orange-50 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm font-black text-xs uppercase tracking-widest"
          >
            🏠 Home
          </motion.button>
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/30 ml-auto">
            <Link href="/" className="hover:text-primary transition-colors">Store</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category_id || product.categoryId}`} className="hover:text-primary transition-colors">
              {product.category_id?.replace('-', ' ') || product.categoryId?.replace('-', ' ') || 'General'}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left: Premium Image Gallery (Amazon Style) */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square w-full rounded-[3rem] bg-white border border-border-custom shadow-xl overflow-hidden group cursor-zoom-in"
          >
            <Image 
              src={product.image_url || product.imageUrl} 
              alt={product.name} 
              fill 
              className="object-contain p-12 transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              priority
            />
            {(product.discount_percent || product.discountPercent || 0) > 0 && (
              <div className="absolute top-8 left-8 bg-primary text-white text-sm font-black px-4 py-2 rounded-full shadow-xl shadow-primary/20">
                {product.discount_percent || product.discountPercent}% OFF
              </div>
            )}
            <button className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white border border-border-custom flex items-center justify-center text-foreground/20 hover:text-red-500 hover:shadow-lg transition-all">
                <Heart size={20} />
            </button>
          </motion.div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-4">
             {[
               { icon: Truck, text: 'Fast Delivery', sub: '12-15 mins' },
               { icon: ShieldCheck, text: 'Pure Quality', sub: 'A-Grade' },
               { icon: RefreshCw, text: 'Free Returns', sub: 'Easy exchange' },
             ].map((feature, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-background border border-border-custom text-center space-y-2">
                    <feature.icon size={20} className="mx-auto text-primary" />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{feature.text}</p>
                    <p className="text-[9px] font-bold text-foreground/40">{feature.sub}</p>
                </div>
             ))}
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="space-y-10">
          <div className="space-y-4">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                {product.made_by || product.brand}
            </span>
            <h1 className="text-5xl font-black tracking-tight leading-none text-foreground">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
                <div className="flex text-orange-400">
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <span className="text-sm font-bold text-foreground/30">4.9 (124 Reviews)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/10" />
                <span className="text-sm font-black text-green-500 uppercase tracking-widest">{product.weight}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-black text-primary">${product.price.toFixed(2)}</span>
            <span className="text-xl font-bold text-foreground/30 line-through">${(product.price * 1.2).toFixed(2)}</span>
          </div>

          <p className="text-lg font-medium text-foreground/60 leading-relaxed max-w-xl italic border-l-4 border-primary/20 pl-6 py-2">
            "{product.description}"
          </p>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-6">
                <span className="text-sm font-black uppercase tracking-widest text-foreground/40">Quantity</span>
                <div className="flex items-center gap-6 bg-white border border-border-custom p-2 rounded-2xl shadow-sm">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl hover:bg-background transition-all flex items-center justify-center text-foreground/50"
                    >
                        <Minus size={18} />
                    </button>
                    <span className="text-xl font-black min-w-[2ch] text-center">{quantity}</span>
                    <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl hover:bg-background transition-all flex items-center justify-center text-foreground/50"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        for(let i=0; i<quantity; i++) addToCart(product);
                    }}
                    className="h-16 rounded-2xl bg-white border-2 border-primary text-primary font-black text-lg flex items-center justify-center gap-3 hover:bg-primary/5 transition-all"
                >
                    <ShoppingBag size={22} /> Add to Cart
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    className="h-16 rounded-2xl bg-primary text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px]"
                >
                    Buy Now
                </motion.button>
            </div>
          </div>

          {/* Delivery Estimation Wrapper */}
          <div className="p-6 rounded-3xl bg-orange-50 border border-primary/10 space-y-3">
             <div className="flex items-center gap-3 text-orange-600 font-bold">
                <Truck size={20} /> FREE EXPRESS DELIVERY
             </div>
             <p className="text-sm text-foreground/60 font-medium">
                Order in the next <span className="font-bold text-foreground">3 hours</span> for delivery by <span className="font-bold text-foreground text-primary underline decoration-primary/20 decoration-2 underline-offset-4">Today, 6:00 PM</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
