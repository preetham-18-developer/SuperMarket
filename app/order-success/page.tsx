'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  FileText, 
  Clock, 
  Truck, 
  MapPin, 
  Download,
  Share2,
  Activity,
  Zap,
  Star,
  ChevronRight,
  TrendingUp,
  Package,
  MessageCircle
} from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useStore } from '@/lib/store';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get('payment_id') || 'RZP_' + Math.random().toString(36).substring(7).toUpperCase();
  const [mounted, setMounted] = useState(false);
  
  const name = searchParams.get('name') || 'Customer';
  const address = searchParams.get('address') || 'Nellore, Andhra Pradesh';
  const orderTotal = parseFloat(searchParams.get('total') || '0');
  
  // Get data from store
  const cart = useStore((s) => s.cart);
  const clearCart = useStore((s) => s.clearCart);
  
  // Preserve cart data for PDF/Display even after clearing store
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [finalSubtotal, setFinalSubtotal] = useState(0);
  const [finalDeliveryFee, setFinalDeliveryFee] = useState(0);
  const [finalDiscount, setFinalDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (cart.length > 0) {
      setOrderItems([...cart]);
      setFinalSubtotal(useStore.getState().subtotal());
      setFinalDeliveryFee(useStore.getState().deliveryFee());
      setFinalDiscount(useStore.getState().couponDiscount);
      setFinalTotal(useStore.getState().totalPrice());
    }
    // Trigger confetti on success
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B00', '#FF9546', '#2D2D2D', '#F5F5F0']
    });
    
    // Clear cart after a small delay to ensure local state capture
    const timer = setTimeout(() => {
      clearCart();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const sendToWhatsApp = () => {
    const itemsText = orderItems.length > 0 
      ? orderItems.map(i => `- ${i.name} (x${i.quantity})`).join('\n')
      : '- Supermarket Premium Items';
      
    const message = `*NEW ORDER RECEIVED - Supermarket Hub*
  
*ID:* SM-${Math.random().toString(36).substring(7).toUpperCase()}
*Customer:* ${name}
*Total:* ₹${orderTotal}

*Order Breakdown:*
${itemsText}

_Your order is confirmed and same-day delivery is active!_`;
    
    window.open(`https://wa.me/917893287376?text=${encodeURIComponent(message)}`, '_blank');
  };

  const generatePDF = () => {
    const doc = new jsPDF() as any;
    
    // Add Branding
    doc.setFontSize(22);
    doc.setTextColor(255, 107, 0);
    doc.text('SUPERMARKET', 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Tax Invoice / Bill of Supply', 20, 28);
    
    doc.setTextColor(45, 45, 45);
    doc.text(`Payment ID: ${paymentId}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 46);
    doc.text(`Customer: ${name}`, 20, 52);
    
    doc.setFontSize(10);
    doc.text(`Subtotal: ₹${finalSubtotal}`, 140, 40);
    doc.text(`Delivery: ₹${finalDeliveryFee}`, 140, 46);
    doc.text(`Discount: ₹${finalDiscount}`, 140, 52);
    doc.setFontSize(14);
    doc.text(`Total: ₹${finalTotal}`, 140, 62);
    doc.setFontSize(10);
    
    const tableData = orderItems.length > 0 
      ? orderItems.map(i => [i.name, i.quantity.toString(), `₹${i.price || i.mrp}`, `₹${(i.price || i.mrp) * i.quantity}`])
      : [['Sample Item', '1', '₹580', '₹580']];

    autoTable(doc, {
      startY: 65,
      head: [['Product', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 107, 0] },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.text(`Total Paid: ₹${finalTotal}`, 140, finalY + 20);
    
    doc.setFontSize(8);
    doc.text('Same day delivery guaranteed. Returns within 15 mins of delivery.', 20, finalY + 40);
    
    doc.save(`supermarket-invoice-${paymentId.slice(0, 8)}.pdf`);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Supermarket Order Confirmed',
      text: `Hey! I just placed an order for ₹${finalTotal} at Supermarket. Order ID: ${paymentId}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Order link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-12 min-h-[90vh] flex flex-col items-center justify-center">
      
      {/* Animated Confirmation Hub */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-center space-y-8"
      >
         <div className="relative w-40 h-40 mx-auto">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40"
            >
               <CheckCircle2 size={80} strokeWidth={2} />
            </motion.div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-4 border-2 border-dashed border-green-500/30 rounded-full"
            />
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg animate-bounce">
               <Zap size={20} fill="currentColor" />
            </div>
         </div>

         <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-black text-warm-dark tracking-tighter" style={{ fontFamily: 'Times New Roman, serif' }}>Mission Accomplished!</h1>
            <p className="text-lg font-bold text-foreground-muted max-w-lg mx-auto italic">
              Your order is locked and our supermarket delivery fleet is warming up. Arrival expected today!
            </p>
         </div>

         <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="px-6 py-3 bg-sand-100 rounded-2xl border border-border-custom flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm"><Activity size={16} /></div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Payment ID</p>
                  <p className="text-xs font-black text-warm-dark font-mono">{paymentId}</p>
               </div>
            </div>
            <div className="px-6 py-3 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3 animate-pulse">
               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-green-500 shadow-sm"><Clock size={16} /></div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-800">Status</p>
                  <p className="text-xs font-black text-green-600">CONFIRMED</p>
               </div>
            </div>
         </div>
      </motion.div>

      {/* Action Hub & Receipt Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-5xl">
         
         {/* Live Tracking / Next Steps */}
         <div className="space-y-6">
            <div className="bg-white border border-border-custom rounded-[3rem] p-8 space-y-8 shadow-xl shadow-primary/5 group">
               <h3 className="text-2xl font-black text-warm-dark flex items-center gap-3 italic" style={{ fontFamily: 'Times New Roman, serif' }}>
                  <Truck size={24} className="text-primary group-hover:translate-x-2 transition-transform duration-1000" /> Logistics View
               </h3>
               
               <div className="space-y-8">
                  {[
                    { label: 'Order Received', icon: Package, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), active: true, done: true },
                    { label: 'Payment Verified', icon: CheckCircle2, time: 'Just now', active: true, done: true },
                    { label: 'Merchant Packing', icon: TrendingUp, time: 'In progress', active: true, done: false },
                    { label: 'Out for Delivery', icon: Truck, time: 'Today', active: false, done: false },
                  ].map((step, i) => (
                     <div key={step.label} className="flex gap-6 relative">
                        {i < 3 && <div className={`absolute left-6 top-10 w-0.5 h-10 ${step.done ? 'bg-green-500' : 'bg-sand-200'}`} />}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 border-2 ${step.done ? 'bg-green-500 border-green-500 text-white' : step.active ? 'bg-white border-primary text-primary' : 'bg-white border-border-custom text-warm-gray opacity-40'}`}>
                           <step.icon size={20} />
                        </div>
                        <div className={step.active ? '' : 'opacity-40'}>
                           <p className="text-sm font-black text-warm-dark uppercase tracking-tight">{step.label}</p>
                           <p className="text-[10px] font-bold text-foreground-muted">{step.time}</p>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="p-5 rounded-[2rem] bg-orange-50 border border-primary/10 flex items-center gap-4">
                  <MapPin size={28} className="text-primary animate-pulse" />
                  <div>
                    <h4 className="text-xs font-black text-warm-dark uppercase tracking-tight">Fulfillment Center</h4>
                    <p className="text-xs font-bold text-foreground-muted leading-relaxed">Supermarket Local Hub #1</p>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col gap-4">
               <button 
                onClick={sendToWhatsApp}
                className="w-full h-18 bg-[#25D366] text-white rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-xl shadow-green-500/20 group hover:bg-[#128C7E] transition-all"
               >
                  Send Details to WhatsApp <MessageCircle size={24} />
               </button>
               <button onClick={() => router.push('/')} className="w-full h-18 bg-white border border-border-custom text-warm-dark rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-sm hover:border-primary/40 transition-all">
                  Back to Supermarket
               </button>
            </div>
         </div>

         {/* Receipt Visualizer */}
         <div className="lg:sticky lg:top-20">
            <div className="bg-cream-100 border border-border-custom rounded-[3rem] p-10 flex flex-col space-y-8 relative overflow-hidden">
               {/* Abstract pattern */}
               <div className="absolute top-0 left-0 w-full h-2 bg-primary-gradient" />
               <div className="absolute bottom-0 left-0 w-full h-1 bg-border-custom border-dashed border-t" />
               
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black italic tracking-tight text-warm-dark" style={{ fontFamily: 'Times New Roman, serif' }}>Order Receipt</h3>
                    <p className="text-[10px] font-black text-foreground-muted uppercase tracking-[0.2em]">{new Date().toDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-primary uppercase tracking-widest">Paid In Full</p>
                  </div>
               </div>

               <div className="py-6 border-y border-border-custom border-dashed space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold text-foreground-muted opacity-50 uppercase tracking-widest">
                     <span>Itemization</span>
                     <span>Qty × Price</span>
                  </div>
                  <div className="space-y-3">
                     {orderItems.length > 0 ? orderItems.map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-default">
                           <span className="text-sm font-bold text-warm-dark group-hover:text-primary transition-colors">{item.name}</span>
                           <span className="text-xs font-black text-warm-dark">{item.quantity} × ₹{item.price || item.mrp}</span>
                        </div>
                     )) : (
                        <div className="flex justify-between items-center group cursor-default">
                           <span className="text-sm font-bold text-warm-dark">Order Items</span>
                           <span className="text-xs font-black text-warm-dark">See PDF for details</span>
                        </div>
                     )}
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-foreground-muted opacity-50">
                     <span>Subtotal</span>
                     <span>₹{orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-foreground-muted opacity-50">
                     <span>Shipping</span>
                     <span className="text-green-500">FREE (Same Day)</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4">
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground-muted">Net Amount</span>
                     <span className="text-4xl font-black text-warm-dark tracking-tighter">₹{orderTotal}.00</span>
                  </div>
               </div>

               <div className="pt-8 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={generatePDF}
                    className="flex-1 py-4 bg-white border border-border-custom rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest shadow-sm hover:border-primary/40 transition-all text-warm-gray hover:text-primary group"
                  >
                     <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> PDF Receipt
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex-1 py-4 bg-white border border-border-custom rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest shadow-sm hover:border-primary/40 transition-all text-warm-gray hover:text-primary"
                  >
                     <Share2 size={14} /> Share Link
                  </button>
               </div>

               <div className="flex items-center justify-center gap-2 pt-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <p className="text-[8px] font-black text-foreground-muted uppercase tracking-[0.3em] italic">Encrypted Secure Transaction Verified by Supermarket</p>
               </div>
            </div>
         </div>

      </div>

    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
       <div className="fixed inset-0 bg-cream-100 flex flex-col items-center justify-center gap-6 z-[100]">
          <div className="w-full max-w-md overflow-hidden relative h-20">
            <div className="animate-trolley text-6xl">🛒</div>
          </div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-foreground-muted animate-pulse">Confirming Transaction...</p>
       </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
