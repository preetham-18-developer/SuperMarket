'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ChevronLeft, 
  MapPin, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  Truck, 
  ShoppingBag,
  Zap,
  ArrowRight,
  Info,
  Phone,
  User,
  Plus,
  ChevronRight,
  Ticket,
  X,
  Globe
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Delivery slots removed - Same day delivery defaults
const DELIVERY_SLOTS = [{ id: 'standard', time: 'Same Day Delivery', label: 'Express', icon: '🚚' }];

function CheckoutContent() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const cart = useStore(s => s.cart);
  const subtotalValue = useStore(s => s.subtotal());
  const deliveryFeeValue = useStore(s => s.deliveryFee());
  const totalPriceValue = useStore(s => s.totalPrice());
  const couponDiscountValue = useStore(s => s.couponDiscount);
  const couponCode = useStore(s => s.couponCode);
  const couponError = useStore(s => s.couponError);
  const applyCoupon = useStore(s => s.applyCoupon);
  const removeCoupon = useStore(s => s.removeCoupon);
  const clearCart = useStore(s => s.clearCart);

  const [promoInput, setPromoInput] = useState('');

  // Map to existing local variables
  const subtotal = subtotalValue;
  const deliveryFee = deliveryFeeValue;
  const totalPrice = totalPriceValue;
  const couponDiscount = couponDiscountValue;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Preetham',
    phone: '9876543210',
    email: 'preetham@example.com',
    address: 'Nellore, Andhra Pradesh',
    pincode: '524001',
    landmark: 'Opp. Big Bazar',
    slotId: '1'
  });

  const [addressSaved, setAddressSaved] = useState(true);

  useEffect(() => { 
    setMounted(true);
    if (mounted && cart.length === 0) router.push('/cart');
  }, [mounted, cart, router]);

  const activeSlot = useMemo(() => DELIVERY_SLOTS.find(s => s.id === formData.slotId) || DELIVERY_SLOTS[0], [formData.slotId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalizeOrder = async () => {
    setLoading(true);
    try {
      const user = useStore.getState().user;
      // ── PHASE 1 UPGRADE: Use Express Backend ──
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const orderResponse = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userData: user,
          cart: cart.map(i => ({
            id: i.id,
            quantity: i.quantity,
            price: i.price ?? i.mrp,
            name: i.name
          })),
          address: formData.address,
          phone: formData.phone,
          paymentInfo: { status: 'paid' } // In real-world, include Razorpay signal here
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to place order via backend');
      }

      const { orderId, orderNumber } = await orderResponse.json();


      // ── 2. Send confirmation email + WhatsApp (non-blocking) ──────────────
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            orderId,
            customerName: formData.name,
            customerEmail: formData.email || 'customer@supermarket.com',
            total: totalPrice,
            items: cart.map(i => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price ?? i.mrp
            }))
          })
        });
      } catch (notifyErr) {
        console.warn('Notification failed (non-blocking):', notifyErr);
      }

      // ── 3. Add Reward Points ───────────────────────────────────────────────
      const earnedPoints = Math.floor(totalPrice / 10);
      if (user) {
        useStore.setState((state) => ({
          user: state.user ? {
            ...state.user,
            loyaltyPoints: (state.user.loyaltyPoints || 0) + earnedPoints,
            totalSavings: (state.user.totalSavings || 0) + (couponDiscount || 0)
          } : null
        }));
      }

      setLoading(false);
      // ── 4. Always redirect to success page ────────────────────────────────
      window.location.href = `/order-success?total=${totalPrice}&name=${encodeURIComponent(formData.name)}&address=${encodeURIComponent(formData.address)}&order_id=${orderId}&points=${earnedPoints}`;
    } catch (error: any) {
      console.error('Finalization failed:', error);
      alert('Failed to place order: ' + (error.message || 'Unknown error'));
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please complete your details');
      return;
    }

    // MOCK PAYMENT FALLBACK: If Razorpay keys are missing or placeholder
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes('XXXX') || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
      console.warn('Razorpay keys missing/placeholder. Falling back to mock success.');
      await handleFinalizeOrder();
      return;
    }

    setLoading(true);
    
    if (!window.Razorpay) {
        alert('Payment gateway is still loading... Please wait a few seconds.');
        setLoading(false);
        return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      name: 'Supermarket',
      description: `Order for ${formData.name}`,
      image: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png',
      handler: async function (response: any) {
        await handleFinalizeOrder();
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: formData.address,
        slot: activeSlot.time
      },
      theme: { color: '#FF6B00' },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setLoading(false);
      alert('Something went wrong. Please try again.');
    }
  };

  if (!mounted || cart.length === 0) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-12">
      
      {/* Checkout Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
              <button onClick={() => router.back()}>
                <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-2 px-5 h-10 bg-white border border-border-custom text-warm-gray rounded-xl shadow-sm cursor-pointer hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest">
                   <ChevronLeft size={16} /> Back
                </motion.div>
              </button>
             <Link href="/">
               <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 bg-white border border-border-custom text-warm-gray rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:text-primary">
                  <Globe size={18} />
               </motion.div>
             </Link>
             <h1 className="text-3xl md:text-5xl font-black text-warm-dark tracking-tight italic">Secure Checkout</h1>
          </div>
          <p className="text-foreground-muted font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" />
            End-to-end encrypted and verified
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Checkout Steps */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Step 1: Address & Identification */}
           <section className={`bg-white border transition-all rounded-[3rem] p-8 shadow-xl shadow-primary/5 ${step > 1 ? 'border-green-100 bg-green-50/20' : 'border-border-custom'}`}>
              <div className="flex items-start justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black text-lg ${step > 1 ? 'bg-green-500 text-white' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                       {step > 1 ? <CheckCircle2 size={24} /> : "01"}
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-warm-dark">Billing & Delivery</h2>
                       <p className="text-sm font-bold text-foreground-muted">Where should we bring your groceries?</p>
                    </div>
                 </div>
                 {step > 1 && (
                    <button onClick={() => setStep(1)} className="text-xs font-black text-primary uppercase tracking-widest hover:underline decoration-2">Change</button>
                 )}
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted px-2">Recipient Name</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors"><User size={16} /></div>
                            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-11 pr-4 h-14 bg-cream-100 border border-border-custom rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all font-bold text-sm" placeholder="e.g. John Doe" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted px-2">Mobile Number</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors"><Phone size={16} /></div>
                            <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-11 pr-4 h-14 bg-cream-100 border border-border-custom rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all font-bold text-sm" placeholder="+91 XXXX-XXXXXX" />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted px-2">Delivery Address (Apt, House, Street)</label>
                      <div className="relative group">
                         <div className="absolute left-4 top-5 text-foreground-muted group-focus-within:text-primary transition-colors"><MapPin size={16} /></div>
                         <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full pl-11 pr-4 py-4 bg-cream-100 border border-border-custom rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all font-bold text-sm resize-none" placeholder="Your full address here..." />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted px-2">Pincode</label>
                         <input name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 h-14 bg-cream-100 border border-border-custom rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all font-bold text-sm" placeholder="524001" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted px-2">Landmark (Optional)</label>
                         <input name="landmark" value={formData.landmark} onChange={handleInputChange} className="w-full px-4 h-14 bg-cream-100 border border-border-custom rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all font-bold text-sm" placeholder="Near Apollo Hospital..." />
                      </div>
                   </div>

                   <div className="pt-4">
                      <button 
                        onClick={() => setStep(2)}
                        className="btn-primary w-full md:w-fit px-12 h-14 font-black shadow-xl shadow-primary/10"
                      >
                        Proceed to Payment <ArrowRight size={18} className="ml-2" />
                      </button>
                   </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                   <div className="flex-1">
                      <p className="text-base font-black text-warm-dark">{formData.name} · {formData.phone}</p>
                      <p className="text-sm font-bold text-foreground-muted leading-relaxed mt-1 italic">
                         {formData.address}, {formData.landmark && `${formData.landmark}, `}{formData.pincode}
                      </p>
                      <div className="mt-2 text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1">
                        <Truck size={12} /> Same Day Delivery Guaranteed
                      </div>
                   </div>
                </div>
              )}
           </section>

           {/* Step 2: Payment */}
           <section className={`bg-white border transition-all rounded-[3rem] p-8 shadow-xl shadow-primary/5 ${step < 2 ? 'opacity-40 grayscale pointer-events-none' : 'border-border-custom'}`}>
              <div className="flex items-start justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1.25rem] bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center font-black text-lg">
                       02
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-warm-dark">Payment Method</h2>
                       <p className="text-sm font-bold text-foreground-muted">Securely finalize your purchase</p>
                    </div>
                 </div>
              </div>

              {step === 2 && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 rounded-[2.5rem] border-2 border-primary bg-primary/5 flex flex-col justify-between h-48 relative overflow-hidden group">
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm"><CreditCard size={20} /></div>
                               <h4 className="font-black text-warm-dark">Online Payment</h4>
                            </div>
                            <CheckCircle2 size={24} className="text-primary fill-primary/10" />
                         </div>
                         <p className="text-xs font-bold text-foreground-muted leading-relaxed">Secure gateway with Razorpay. UPI, Credit/Debit cards, Net Banking accepted.</p>
                         <div className="flex gap-2 opacity-50 grayscale transition-all group-hover:grayscale-0">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
                         </div>
                         {/* Abstract background décor */}
                         <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                      </div>

                      <div className="p-6 rounded-[2.5rem] border-2 border-border-custom bg-white opacity-60 flex flex-col justify-between h-48 relative overflow-hidden">
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-sand-100 rounded-xl flex items-center justify-center text-warm-gray"><ShoppingBag size={20} /></div>
                               <h4 className="font-black text-warm-dark">Cash on Delivery</h4>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-border-custom" />
                         </div>
                         <p className="text-xs font-bold text-foreground-muted leading-relaxed">Pay when your items arrive. Currently disabled for this region.</p>
                         <span className="badge badge-sand w-fit text-[9px] uppercase font-black">Not Available</span>
                      </div>
                   </div>

                   <div className="bg-sand-100 p-6 rounded-[2rem] border border-border-custom flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-warm-gray shrink-0"><Info size={16} /></div>
                      <p className="text-xs font-bold text-foreground-muted leading-relaxed">
                        By clicking "Pay & Place Order", you agree to our Terms of Service. Final checkout amount includes GST and seasonal convenience fees where applicable.
                      </p>
                   </div>
                </div>
              )}
           </section>
        </div>

        {/* Right Side: Order Summary Fix Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 h-fit">
           
           <div className="bg-espresso rounded-[3rem] p-8 text-white space-y-10 shadow-2xl relative overflow-hidden">
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 -skew-x-[30deg] translate-x-12 -translate-y-8 pointer-events-none" />
              
              <div className="space-y-4">
                 <h2 className="text-2xl font-black italic tracking-tight">Order Receipt</h2>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-white/40 text-sm font-bold uppercase tracking-widest">
                       <span>Bag Subtotal</span>
                       <span className="text-white/80">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40 text-sm font-bold uppercase tracking-widest">
                       <span>Delivery Fee</span>
                       <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white/80'}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between items-center text-primary text-sm font-black uppercase tracking-widest">
                         <span>Promo Discount</span>
                         <span>− ₹{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                 </div>
              </div>

              {/* Coupon Code Section */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                 {couponCode ? (
                   <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between border border-primary/30">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <Ticket size={16} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Active Coupon</p>
                            <p className="text-sm font-black text-white">{couponCode}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => {
                          removeCoupon();
                          setPromoInput('');
                        }}
                        className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-white/40 hover:text-white transition-all"
                      >
                         <X size={16} />
                      </button>
                   </div>
                 ) : (
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Promo Code" 
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex-1 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all uppercase"
                      />
                      <button 
                        onClick={() => applyCoupon(promoInput)}
                        className="bg-primary text-white font-black px-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all"
                      >
                         Apply
                      </button>
                   </div>
                 )}
                 {couponError && !couponCode && (
                   <p className="text-[10px] font-bold text-red-400 pl-2">{couponError}</p>
                 )}
              </div>

              <div className="pt-8 border-t border-white/10 space-y-6">
                 <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1 italic">Amount to Pay</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-5xl font-black tracking-tighter">₹{totalPrice.toFixed(2)}</span>
                       <span className="text-xs font-bold text-white/20 uppercase tracking-widest">INC. GST</span>
                    </div>
                 </div>

                 <button 
                  onClick={handlePayment}
                  disabled={loading || step < 2}
                  className="w-full h-18 bg-primary-gradient text-white rounded-2xl flex flex-col items-center justify-center font-black transition-all hover:shadow-[0_20px_40px_-10px_rgba(255,107,0,0.5)] hover:-translate-y-1 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:pointer-events-none relative group overflow-hidden"
                 >
                   <div className="flex items-center gap-3 text-lg leading-none pt-1">
                      {loading ? <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : <><CreditCard size={20} /> Pay & Place Order</>}
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mt-1">Instant Confirmation</span>
                   {/* Shine effect */}
                   <div className="absolute inset-x-0 h-full w-20 bg-white/20 -skew-x-[45deg] translate-x-[-120%] group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
                 </button>
              </div>

              {/* Items Summary Micro-List */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Order Contents ({cart.length})</h4>
                 <div className="max-h-40 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                    {cart.map((item) => (
                       <div key={item.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center p-1 border border-white/5 relative">
                                 <Image src={item.imageUrl || item.image_url || ''} alt="" fill className="object-contain" />
                              </div>
                             <span className="text-xs font-bold text-white/60 truncate max-w-[120px]">{item.name}</span>
                          </div>
                          <span className="text-xs font-black text-white/40">×{item.quantity}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="p-6 border border-border-custom border-dashed rounded-[3rem] text-center space-y-1 group hover:border-primary/20 transition-all">
              <div className="w-10 h-10 bg-sand-100 rounded-full flex items-center justify-center mx-auto text-warm-gray mb-2 group-hover:text-primary transition-colors"><Zap size={18} /></div>
              <p className="text-xs font-black text-warm-dark uppercase tracking-widest">Delivery Promise</p>
              <p className="text-[10px] text-foreground-muted font-bold leading-relaxed px-4">Fast tracking numbers and live location access provided after checkout.</p>
           </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-cream-100 flex flex-col items-center justify-center gap-6 z-[100]">
         <div className="w-full max-w-md overflow-hidden relative h-20">
           <div className="animate-trolley text-6xl">🛒</div>
         </div>
         <p className="text-sm font-black uppercase tracking-[0.2em] text-foreground-muted animate-pulse">Initializing Secure Tunnel...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
