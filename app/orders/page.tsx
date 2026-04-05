'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  ChevronLeft, 
  Clock, 
  CreditCard,
  History,
  FileText,
  Search,
  Zap,
  Package,
  Star,
  Info,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  Globe
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { ORDERS } from '@/lib/data';

export default function OrderHistoryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ongoing' | 'delivered' | 'cancelled'>('all');

  useEffect(() => { setMounted(true); }, []);

  const filteredOrders = useMemo(() => {
      let filtered = ORDERS.filter(o => 
         o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
         o.id.toLowerCase().includes(search.toLowerCase())
      );
      
      if (filterStatus === 'ongoing') {
         filtered = filtered.filter(o => ['pending_payment', 'confirmed', 'packed', 'processing', 'out_for_delivery'].includes(o.status));
      } else if (filterStatus === 'delivered') {
         filtered = filtered.filter(o => o.status === 'delivered');
      } else if (filterStatus === 'cancelled') {
         filtered = filtered.filter(o => ['cancelled', 'failed', 'returned', 'refunded'].includes(o.status));
      }
      
      return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
   }, [search, filterStatus]);

   const stats = useMemo(() => {
      return {
         total: ORDERS.length,
         active: ORDERS.filter(o => !['delivered', 'cancelled', 'failed'].includes(o.status)).length,
         delivered: ORDERS.filter(o => o.status === 'delivered').length
      };
   }, []);

   if (!mounted) return null;

   return (
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-12">
         
         {/* Page Header */}
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
                  <h1 className="text-3xl md:text-5xl font-black text-warm-dark tracking-tight italic">Order Pipeline</h1>
               </div>
               <p className="text-foreground-muted font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  Live tracking and fulfillment history
               </p>
            </div>
            
            {/* Real-time Status Chip */}
            <div className="hidden md:flex items-center gap-3 bg-green-50 px-4 py-2 rounded-full border border-green-100">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </span>
               <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Systems Nominal · Live Sync</span>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
               
               {/* Controls Bar */}
               <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-border-custom/50">
                  <div className="flex p-1 bg-sand-100 rounded-2xl w-full md:w-auto">
                     {[
                        { id: 'all', label: 'All Orders', count: stats.total },
                        { id: 'ongoing', label: 'On The Way', count: stats.active },
                        { id: 'delivered', label: 'Completed', count: stats.delivered },
                        { id: 'cancelled', label: 'Issues', count: stats.total - stats.delivered - stats.active }
                     ].map(tab => (
                        <button
                           key={tab.id}
                           onClick={() => setFilterStatus(tab.id as any)}
                           className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                              filterStatus === tab.id 
                                 ? 'bg-white text-primary shadow-md shadow-primary/5' 
                                 : 'text-foreground-muted hover:text-warm-dark'
                           }`}
                        >
                           {tab.label}
                           {tab.count > 0 && <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${filterStatus === tab.id ? 'bg-primary/10' : 'bg-sand-200'}`}>{tab.count}</span>}
                        </button>
                     ))}
                  </div>

                  <div className="relative w-full md:w-64 group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-all" size={16} />
                     <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search ID or Status..." 
                        className="w-full pl-11 pr-4 h-12 bg-white border border-border-custom rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all font-bold text-xs"
                     />
                  </div>
               </div>

               {/* Orders Grid */}
               <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                     {filteredOrders.length > 0 ? (
                        filteredOrders.map((order: any) => (
                           <motion.div
                              layout
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              key={order.id}
                              className={`group bg-white border border-border-custom rounded-[2.5rem] overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 relative ${
                                 order.status === 'delivered' ? 'border-l-4 border-l-green-500' : 
                                 ['cancelled', 'failed'].includes(order.status) ? 'border-l-4 border-l-red-500' :
                                 'border-l-4 border-l-primary'
                              }`}
                           >
                              {/* Order Header Card */}
                              <div className="p-8">
                                 <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-3">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Reference ID</p>
                                          <span className="badge badge-sand text-[9px] font-black px-2 mt-[-2px]">PREMIUM_SHIPMENT</span>
                                       </div>
                                       <h3 className="text-xl font-black text-warm-dark tracking-tight">#{order.orderNumber}</h3>
                                       <div className="flex items-center gap-3 text-xs font-bold text-foreground-muted italic">
                                          <span> Placed {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                          <span>•</span>
                                          <span className="flex items-center gap-1"><CreditCard size={12} /> {order.paymentMethod.toUpperCase()}</span>
                                       </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                       <div className="text-right flex flex-col items-end">
                                          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Total Value</p>
                                          <p className="text-3xl font-black text-warm-dark tracking-tighter">₹{order.totalAmount || order.total}</p>
                                       </div>
                                       <div className={`status-tag px-5 py-3 rounded-2xl flex flex-col items-center justify-center border ${
                                          order.status === 'delivered' ? 'bg-green-50 border-green-100 text-green-700' : 
                                          order.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-700' :
                                          'bg-primary/5 border-primary/10 text-primary'
                                       }`}>
                                          <span className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Current State</span>
                                          <span className="text-sm font-black uppercase tracking-tight leading-none">{order.status.replace(/_/g, ' ')}</span>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Order Progress Line */}
                                 {order.status !== 'cancelled' && (
                                    <div className="mb-10 pt-2">
                                       <div className="relative h-1.5 w-full bg-sand-100 rounded-full overflow-hidden">
                                          <motion.div 
                                             initial={{ width: 0 }}
                                             animate={{ width: order.status === 'delivered' ? '100%' : order.status === 'out_for_delivery' ? '75%' : '40%' }}
                                             transition={{ duration: 1.5, ease: "easeOut" }}
                                             className={`absolute top-0 left-0 h-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-primary-gradient'}`}
                                          />
                                       </div>
                                       <div className="flex justify-between mt-4">
                                          {['Confirmed', 'Packed', 'On Way', 'Complete'].map((step, idx) => {
                                             const isActive = (idx === 0) || 
                                                            (idx === 1 && ['packed', 'processing', 'out_for_delivery', 'delivered'].includes(order.status)) ||
                                                            (idx === 2 && ['out_for_delivery', 'delivered'].includes(order.status)) ||
                                                            (idx === 3 && order.status === 'delivered');
                                             return (
                                                <div key={step} className="flex flex-col items-center gap-1.5">
                                                   <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-500 ${isActive ? 'bg-primary border-primary shadow-[0_0_8px_rgba(255,107,0,0.5)]' : 'bg-white border-sand-300'}`} />
                                                   <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'text-warm-dark' : 'text-foreground-muted'}`}>{step}</span>
                                                </div>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 )}

                                 {/* Order Content Preview */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {order.items.slice(0, 3).map((item: any, i: number) => (
                                       <div key={i} className="flex items-center gap-4">
                                          <div className="relative w-14 h-14 bg-sand-100 rounded-xl border border-border-custom p-2 shrink-0 overflow-hidden shadow-inner">
                                             <Image 
                                               src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100"} 
                                               alt="" 
                                               fill
                                               className="object-contain grayscale-0 group-hover:scale-110 transition-transform duration-500" 
                                             />
                                          </div>
                                          <div className="min-w-0">
                                             <p className="text-xs font-black text-warm-dark truncate leading-none">{item.productName || item.product_name}</p>
                                             <p className="text-[10px] font-bold text-foreground-muted mt-1.5">Qty: {item.quantity} · ₹{item.price}</p>
                                          </div>
                                       </div>
                                    ))}
                                    {order.items.length > 3 && (
                                       <div className="flex items-center gap-4 text-foreground-muted">
                                          <div className="w-14 h-14 bg-sand-100 rounded-xl border border-dashed border-border-custom flex items-center justify-center font-black text-xs">
                                             +{order.items.length - 3}
                                          </div>
                                          <span className="text-[10px] font-bold uppercase tracking-widest">More Items</span>
                                       </div>
                                    )}
                                 </div>
                              </div>

                              {/* Footer Action Bar */}
                              <div className="px-8 py-4 bg-sand-50 border-t border-border-custom flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <button className="text-[10px] font-black uppercase tracking-widest text-warm-dark hover:text-primary transition-colors flex items-center gap-2">
                                       <ShoppingBag size={12} /> Order Details
                                    </button>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-warm-dark hover:text-primary transition-colors flex items-center gap-2">
                                       <FileText size={12} /> Digital Invoice
                                    </button>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <button className="hidden sm:block h-10 px-6 rounded-xl bg-white border border-border-custom text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                                       Track Package
                                    </button>
                                    <button className="h-10 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:translate-y-[-1px] active:translate-y-0 transition-all">
                                       Reorder Selection
                                    </button>
                                 </div>
                              </div>
                           </motion.div>
                        ))
                     ) : (
                        <motion.div
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           className="text-center py-20 bg-white rounded-[3rem] border border-border-custom border-dashed"
                        >
                           <p className="text-6xl mb-6">📦</p>
                           <h3 className="text-2xl font-black text-warm-dark mb-2">No shipments located</h3>
                           <p className="text-sm font-bold text-foreground-muted mb-8 max-w-xs mx-auto">We couldn't find any orders matching your criteria. Start shopping to fill your pipeline!</p>
                           <Link href="/products">
                              <button className="btn-primary px-8">Return to Store</button>
                           </Link>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </div>

            {/* Side Menu */}
            <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 h-fit">
               
               {/* User Overview */}
               <div className="card-glass p-8 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -skew-x-12 translate-x-8 -translate-y-8 pointer-events-none" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-2xl shadow-xl shadow-primary/20">
                        👨🏼‍💻
                     </div>
                      <div>
                        <h3 className="text-2xl font-black text-warm-dark italic">Profile Summary</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Prime Member</span>
                           <span className="text-[10px] font-black text-warm-dark/30">•</span>
                           <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Zap size={10} fill="currentColor" /> {useStore.getState().user?.loyaltyPoints || 0} Points
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 relative z-10">
                     <div className="p-4 rounded-2xl bg-white/40 border border-white/50 backdrop-blur-sm">
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mb-1">Lifetime Orders</p>
                        <p className="text-lg font-black text-warm-dark">{ORDERS.length}</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/40 border border-white/50 backdrop-blur-sm">
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mb-1">Saved Pins</p>
                        <p className="text-lg font-black text-warm-dark">2 Address</p>
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-black/5 relative z-10">
                     <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">Membership Perks</p>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-warm-dark">
                           <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center text-primary">
                              <Zap size={14} fill="currentColor" />
                           </div>
                           <span>Priority Fulfillment Active</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-warm-dark">
                           <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                              <Star size={14} fill="currentColor" />
                           </div>
                           <span>Exclusive Smart Rewards</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Help Link */}
               <div className="p-8 border border-border-custom border-dashed rounded-[3rem] text-center space-y-3 group hover:border-primary/20 transition-all">
                  <div className="w-12 h-12 bg-sand-100 rounded-full flex items-center justify-center mx-auto text-warm-gray mb-2 group-hover:text-primary transition-all"><Info size={20} /></div>
                  <h4 className="font-black text-warm-dark text-sm uppercase tracking-widest">Need Assistance?</h4>
                  <p className="text-[10px] text-foreground-muted font-bold leading-relaxed px-2">Our concierge team is available 24/7 for order resolutions and live tracking.</p>
                  <button className="text-xs font-black text-primary underline decoration-2">Contact Support</button>
               </div>
            </aside>
         </div>
      </div>
   );
}
