'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Gift,
  Clock,
  X,
  Check as CheckIcon,
  LayoutGrid
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const cart = useStore(s => s.cart);
  const removeFromCart = useStore(s => s.removeFromCart);
  const updateQuantity = useStore(s => s.updateQuantity);
  const subtotal = useStore(s => s.subtotal());
  const deliveryFee = useStore(s => s.deliveryFee());
  const totalPrice = useStore(s => s.totalPrice());
  const couponCode = useStore(s => s.couponCode);
  const couponDiscount = useStore(s => s.couponDiscount);
  const applyCoupon = useStore(s => s.applyCoupon);
  const removeCoupon = useStore(s => s.removeCoupon);
  
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => { setMounted(true); }, []);

  // Free delivery logic
  const freeShipThreshold = 499;
  const progressToFree = Math.min((subtotal / freeShipThreshold) * 100, 100);
  const remainingForFree = Math.max(freeShipThreshold - subtotal, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
       <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-24 flex flex-col items-center justify-center text-center space-y-10">
          <motion.div 
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            className="relative"
          >
             <div className="w-56 h-56 bg-cream-200 rounded-full flex items-center justify-center text-[10rem] shadow-inner selection:bg-transparent">
                🛒
             </div>
             <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-bounce">
                <ShoppingBag size={40} />
             </div>
          </motion.div>
          
          <div className="space-y-3">
             <h2 className="text-4xl md:text-6xl font-black text-warm-dark tracking-tight">Your bag is empty</h2>
             <p className="text-foreground-muted font-bold text-lg max-w-sm mx-auto leading-relaxed italic">
                Wait... you haven't added anything? Let's fix that! Freshness is just a click away.
             </p>
          </div>

          <Link href="/products">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-12 h-16 text-lg font-black shadow-2xl shadow-primary/30"
            >
              Start Shopping <ArrowRight size={24} className="ml-2" />
            </motion.button>
          </Link>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-border-custom w-full max-w-4xl">
             {[
               { icon: Truck, text: 'Fast Delivery', sub: 'In 15 mins' },
               { icon: ShieldCheck, text: 'Pure Quality', sub: 'A-Grade' },
               { icon: Zap, text: 'Flash Sales', sub: 'Grab them!' },
               { icon: RefreshCw, text: 'Easy Returns', sub: 'Hassle-free' },
             ].map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                   <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-warm-gray"><f.icon size={20} /></div>
                   <p className="text-xs font-black text-warm-dark">{f.text}</p>
                   <p className="text-[10px] text-foreground-muted">{f.sub}</p>
                </div>
             ))}
          </div>
       </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-sm border border-primary/10">
                <ShoppingBag size={20} />
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-warm-dark tracking-tight">Shopping Bag</h1>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <Link href="/">
               <motion.div 
                 whileHover={{ scale: 1.05, x: -2 }}
                 className="flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest hover:underline decoration-2"
               >
                  <ChevronLeft size={14} /> Back to Store
               </motion.div>
            </Link>
            <span className="text-foreground-muted/20">•</span>
            <p className="text-foreground-muted font-bold text-sm uppercase tracking-widest flex items-center gap-2">
              <LayoutGrid size={14} className="text-primary" />
              {cart.length} items ready for delivery
            </p>
          </div>
        </div>
        <Link href="/products" className="btn-ghost flex items-center gap-2 text-primary font-black">
           <ChevronLeft size={18} /> Continue Shopping
        </Link>
      </div>

      {/* Free Delivery Progress */}
      <div className="bg-white border border-border-custom rounded-[2.5rem] p-6 shadow-sm overflow-hidden relative group">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-primary">
                  <Truck size={22} className={remainingForFree > 0 ? '' : 'animate-bounce'} />
               </div>
               <div>
                  <h3 className="font-black text-warm-dark">
                    {remainingForFree > 0 
                      ? `Add ₹${remainingForFree} more for FREE delivery!` 
                      : "Congrats! You've unlocked FREE delivery!"
                    }
                  </h3>
                  <p className="text-xs text-foreground-muted font-bold">Standard shipping usually costs ₹40</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-2xl font-black text-primary">{Math.round(progressToFree)}%</p>
            </div>
         </div>
         <div className="h-3 bg-sand-100 rounded-full overflow-hidden relative shadow-inner border border-sand-200">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressToFree}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full ${remainingForFree === 0 ? 'bg-green-500' : 'bg-primary-gradient'} transition-all`}
            />
            {remainingForFree > 0 && <span className="absolute left-[calc(100%-40px)] top-0 w-10 h-full bg-white/20 skew-x-[-20deg] blur-sm animate-pulse" />}
         </div>
         <div className="absolute top-0 right-0 w-32 h-full bg-primary/5 -skew-x-[25deg] translate-x-20 group-hover:translate-x-12 transition-transform duration-700 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Cart Items */}
        <div className="lg:col-span-8 space-y-4">
           <AnimatePresence mode="popLayout">
              {cart.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-border-custom rounded-[2rem] p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl hover:shadow-primary/5 transition-all"
                >
                   {/* Product Image */}
                   <div className="relative w-32 h-32 md:w-40 md:h-40 bg-sand-100 rounded-2xl overflow-hidden shadow-inner border border-sand-200 p-4 shrink-0 transition-transform group-hover:scale-105 duration-500">
                      <Image 
                        src={item.imageUrl || item.image_url || ''} 
                        alt={item.name} 
                        fill 
                        className="object-contain" 
                      />
                      {item.discountPercent > 0 && (
                         <div className="absolute top-2 left-2 badge badge-orange scale-90">-{item.discountPercent}%</div>
                      )}
                   </div>

                   {/* Info */}
                   <div className="flex-1 space-y-4 text-center md:text-left min-w-0">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted">{item.brand || item.made_by}</p>
                         <h3 className="text-xl md:text-2xl font-black text-warm-dark truncate">{item.name}</h3>
                         <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                            <span className="badge badge-sand text-xs font-bold">{item.weight}{item.unit}</span>
                            <span className="text-foreground-muted font-bold text-sm">₹{item.price ?? item.mrp} / unit</span>
                         </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-6">
                         {/* Qty Controls */}
                         <div className="flex items-center gap-2 bg-sand-100 border border-sand-200 p-1.5 rounded-2xl shadow-inner w-fit">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-warm-gray hover:text-primary hover:shadow-md transition-all disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={18} />
                            </button>
                            <span className="w-10 text-center font-black text-xl text-warm-dark">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-warm-gray hover:text-primary hover:shadow-md transition-all"
                            >
                              <Plus size={18} />
                            </button>
                         </div>

                         <div className="flex items-center gap-6 md:ml-auto">
                            <div className="text-right">
                               <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">Total Price</p>
                               <p className="text-2xl font-black text-warm-dark">₹{((item.price ?? item.mrp) * item.quantity).toFixed(2)}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 hover:border-red-500 group/trash"
                            >
                              <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform" />
                            </button>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ))}
           </AnimatePresence>
           
           {/* Add more placeholder */}
           <Link href="/products">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="border-2 border-dashed border-border-custom rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/40 hover:bg-cream-200 transition-all space-y-3"
              >
                 <div className="w-14 h-14 bg-sand-100 rounded-full flex items-center justify-center text-warm-gray group-hover:bg-primary/20 group-hover:text-primary transition-all">
                    <Plus size={28} />
                 </div>
                 <h4 className="font-black text-warm-dark">Forget something?</h4>
                 <p className="text-sm font-bold text-foreground-muted">Continue browsing and fill your bag with freshness</p>
              </motion.div>
           </Link>
        </div>

        {/* Right: Summary & Checkout */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
           
           {/* Order Summary */}
           <div className="bg-white border border-border-custom rounded-[3rem] p-8 shadow-xl shadow-primary/5 space-y-8">
              <h2 className="text-2xl font-black text-warm-dark flex items-center justify-between">
                 Order Summary
                 <div className="w-8 h-8 rounded-full bg-sand-100 flex items-center justify-center text-warm-gray">
                    <Zap size={14} />
                 </div>
              </h2>

              <div className="space-y-4">
                 <div className="flex justify-between items-center text-warm-gray font-bold text-sm">
                    <span>Cart Subtotal</span>
                    <span className="text-warm-dark font-black">₹{subtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center text-warm-gray font-bold text-sm">
                    <span>Shipping Estimate</span>
                    <span className={deliveryFee === 0 ? 'text-green-500 font-black' : 'text-warm-dark font-black'}>
                       {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                    </span>
                 </div>
                 {couponDiscount > 0 && (
                   <div className="flex justify-between items-center text-green-600 font-bold text-sm bg-green-50 p-3 rounded-2xl border border-green-100">
                      <span className="flex items-center gap-1.5 animation-pulse"><Tag size={14} /> Promo Discount</span>
                      <div className="flex items-center gap-2">
                        <span>− ₹{couponDiscount.toFixed(2)}</span>
                        <button onClick={removeCoupon} className="text-green-800 hover:text-red-500 transition-colors">
                           <X size={14} />
                        </button>
                      </div>
                   </div>
                 )}
                 <div className="h-px bg-border-custom my-6" />
                 <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Total Payable</p>
                       <p className="text-4xl font-black text-warm-dark tracking-tighter">₹{totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                       <span className="badge badge-orange text-[10px] font-black uppercase mb-1">Save ₹{(subtotal - totalPrice + 40).toFixed(2)}</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <Link href="/checkout">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-16 bg-primary text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:bg-primary-hover"
                    >
                      Process Order <ChevronRight size={24} />
                    </motion.button>
                 </Link>
                 <div className="flex items-center justify-center gap-4 py-2 opacity-50 grayscale hover:grayscale-0 transition-all overflow-hidden whitespace-nowrap">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Secure:</span>
                    <div className="relative h-4 w-12"><Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" fill className="object-contain" /></div>
                    <div className="relative h-3 w-10"><Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" fill className="object-contain" /></div>
                    <div className="relative h-4 w-8"><Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" fill className="object-contain" /></div>
                 </div>
              </div>
           </div>

           {/* Coupon Section */}
           <div className="bg-cream-100 border border-border-custom rounded-[2.5rem] p-6 space-y-4">
              <h3 className="font-black text-warm-dark flex items-center gap-2">
                 <Tag size={18} className="text-primary" /> Promotional Code
              </h3>
              {!couponCode ? (
                <form onSubmit={handleApplyCoupon} className="relative flex gap-2">
                   <div className="relative flex-1">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted">
                         <Gift size={16} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="GRAVITY10..."
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-border-custom rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-xs"
                      />
                   </div>
                   <button 
                    type="submit"
                    className="px-6 py-3 bg-warm-dark text-white rounded-xl font-bold text-xs hover:bg-espresso transition-all shadow-md shadow-espresso/10"
                   >
                     Apply
                   </button>
                </form>
              ) : (
                <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                         <CheckIcon size={16} />
                      </div>
                      <div>
                         <p className="text-xs font-black text-warm-dark">Active Coupon: {couponCode}</p>
                         <p className="text-[10px] text-primary font-bold">You just saved ₹{couponDiscount.toFixed(2)}!</p>
                      </div>
                   </div>
                   <button onClick={removeCoupon} className="p-2 hover:bg-white rounded-lg transition-all text-warm-gray">
                      <X size={16} />
                   </button>
                </div>
              )}
              {couponError && <p className="text-[10px] text-red-500 font-bold px-1 animate-shake">{couponError}</p>}
              <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest px-1">
                 Check email for your next gift voucher!
              </p>
           </div>
           
           {/* Assistance Card */}
           <div className="bg-white border border-border-custom rounded-[2.5rem] p-6 flex items-center gap-4 group">
              <div className="w-12 h-12 bg-sand-100 rounded-full flex items-center justify-center text-warm-gray group-hover:scale-110 transition-transform">
                 <Clock size={20} />
              </div>
              <div>
                 <h4 className="font-black text-warm-dark text-sm">Need assistance?</h4>
                 <p className="text-xs text-foreground-muted font-bold underline decoration-primary/20 cursor-pointer">Live chat with support</p>
              </div>
           </div>
        </aside>
      </div>

      {/* Suggested Mini-Module - Best Sellers */}
      <div className="space-y-8 pt-12">
         <div className="flex items-end justify-between px-2">
            <div>
               <h2 className="section-title">Popular Items</h2>
               <p className="section-subtitle">Based on your shared favorites</p>
            </div>
            <Link href="/products" className="btn-ghost flex items-center gap-2">View store <ChevronRight size={16} /></Link>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 opacity-80 hover:opacity-100 transition-opacity">
             {/* ProductCard placeholders or actual data mapping */}
         </div>
      </div>

    </div>
  );
}

function Check({size}: {size: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
