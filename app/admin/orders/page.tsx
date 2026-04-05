'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Search, 
  MoreVertical, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle,
  PackageCheck,
  AlertTriangle,
  ArrowUpRight,
  Printer,
  Download,
  Eye,
  Mail,
  User,
  MapPin,
  CalendarDays,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { ORDERS } from '@/lib/data';

const STATUS_CONFIG: any = {
  pending: { icon: Clock, label: 'Pending', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  confirmed: { icon: CheckCircle2, label: 'Confirmed', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  packed: { icon: PackageCheck, label: 'Packed', color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
  out_for_delivery: { icon: Truck, label: 'Shipping', color: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
  delivered: { icon: CheckCircle2, label: 'Delivered', color: 'green', bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
  cancelled: { icon: XCircle, label: 'Cancelled', color: 'red', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  failed: { icon: AlertTriangle, label: 'Failed', color: 'red', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  processing: { icon: RefreshCw, label: 'Processing', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-100' },
  pending_payment: { icon: Clock, label: 'Waiting Pay', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-100' }
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = useMemo(() => {
    return ORDERS.filter(order => {
      const matchSearch = !searchQuery || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = selectedStatus === 'all' || order.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, selectedStatus]);

  return (
    <div className="space-y-10 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><ShoppingCart size={16} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Order Fulfillment Hub</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-warm-dark tracking-tight">Sales Pipeline</h1>
           <p className="text-foreground-muted font-bold text-sm mt-1 max-w-sm">Manage, track and fulfill {ORDERS.length} total customer orders.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-border-custom rounded-2xl font-black text-sm shadow-sm hover:bg-sand-100 transition-all text-warm-dark">
              <Printer size={18} /> Print Manifest
           </button>
           <button className="flex items-center gap-2 px-6 py-3.5 bg-warm-dark text-white rounded-2xl font-black text-sm shadow-xl shadow-espresso/20 hover:bg-black transition-all">
              <Download size={18} /> Export CSV
           </button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Unprocessed', count: ORDERS.filter(o => o.status === 'confirmed' || o.status === 'processing').length, color: 'blue', icon: Clock },
           { label: 'Out for Delivery', count: ORDERS.filter(o => o.status === 'out_for_delivery').length, color: 'indigo', icon: Truck },
           { label: 'Pending Payment', count: ORDERS.filter(o => o.status === 'pending_payment').length, color: 'orange', icon: Smartphone },
           { label: 'Revenue (MTD)', count: `₹${ORDERS.reduce((acc, o) => acc + (o.total || o.totalAmount), 0).toLocaleString()}`, color: 'green', icon: ShoppingCart },
         ].map((s, idx) => (
           <motion.div 
             key={s.label}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="card p-6 border-none shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden group"
           >
              <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 group-hover:scale-110 transition-transform`}><s.icon size={18} /></div>
              <div>
                 <h4 className="text-2xl font-black text-warm-dark">{s.count}</h4>
                 <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest leading-none mt-1">{s.label}</p>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white border border-border-custom p-3 rounded-[2.5rem] shadow-sm overflow-hidden">
         <div className="relative flex-1 group w-full">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer Name, or Payment ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-sand-100/50 border border-transparent rounded-[1.75rem] outline-none focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm" 
            />
         </div>
         
         <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto px-4 md:px-0">
            {['all', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
               <button 
                 key={status}
                 onClick={() => setSelectedStatus(status)}
                 className={`
                   px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                   ${selectedStatus === status 
                     ? 'bg-warm-dark text-white shadow-lg border-warm-dark' 
                     : 'bg-white text-warm-gray border-border-custom hover:bg-sand-100'}
                 `}
               >
                 {status === 'all' ? 'All Transactions' : status.replace('_', ' ')}
               </button>
            ))}
         </div>
      </div>

      {/* Orders Table Container */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* Order List List View */}
         <div className="xl:col-span-2 card p-0 overflow-hidden shadow-xl shadow-primary/5 border border-border-custom bg-white">
            <div className="overflow-x-auto h-[600px] custom-scrollbar">
               <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                     <tr className="border-b border-border-custom">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Shipment Info</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Customer</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Amount</th>
                        <th className="px-12 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted text-right">Details</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredOrders.map(order => {
                        const status = (STATUS_CONFIG as any)[order.status] || STATUS_CONFIG.pending;
                        const isSelected = selectedOrder?.id === order.id;
                        return (
                          <tr 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className={`border-b border-border-custom hover:bg-cream-100/30 transition-all cursor-pointer group ${isSelected ? 'bg-primary/5' : ''}`}
                          >
                             <td className="px-8 py-6">
                                <div className="space-y-1">
                                   <p className="text-xs font-black text-primary uppercase tracking-widest italic">{order.orderNumber || `ORD-${order.id.slice(-6).toUpperCase()}`}</p>
                                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground-muted uppercase">
                                      <CalendarDays size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="space-y-0.5">
                                   <p className="text-sm font-black text-warm-dark">{order.customerName}</p>
                                   <p className="text-[10px] font-bold text-foreground-muted italic opacity-60">{order.customerEmail}</p>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-sm font-black text-warm-dark">₹{(order.total || order.totalAmount).toLocaleString()}</p>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{order.paymentMethod?.toUpperCase()}</p>
                             </td>
                             <td className="px-8 py-6">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${status.bg} ${status.text} ${status.border} shadow-sm`}>
                                   <status.icon size={12} />
                                   <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <button className="p-3.5 rounded-2xl bg-white border border-border-custom text-warm-gray hover:text-primary transition-all group-hover:shadow-md">
                                   <Eye size={18} />
                                </button>
                             </td>
                          </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
            
            {filteredOrders.length === 0 && (
               <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-sand-100 rounded-[2rem] flex items-center justify-center mx-auto text-warm-gray rotate-12"><ShoppingCart size={32} /></div>
                  <h5 className="font-black text-warm-dark">Empty Pipeline</h5>
                  <button onClick={() => {setSearchQuery(''); setSelectedStatus('all');}} className="px-6 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest">Clear Filters</button>
               </div>
            )}
         </div>

         {/* Order Details Panel */}
         <div className="card p-8 h-auto xl:h-[600px] border border-border-custom shadow-2xl relative overflow-hidden flex flex-col bg-white">
            <AnimatePresence mode="wait">
               {selectedOrder ? (
                 <motion.div 
                   key={selectedOrder.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-2"
                 >
                    <div className="flex justify-between items-start text-warm-dark">
                       <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Detailed View</p>
                          <h3 className="text-2xl font-black tracking-tight">Order #{selectedOrder.id.slice(-6).toUpperCase()}</h3>
                       </div>
                       <div className="flex gap-2">
                          <button className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center border border-border-custom"><Mail size={16} /></button>
                          <button className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center border border-border-custom"><Printer size={16} /></button>
                       </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-sand-100/50 border border-border-custom space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white border border-border-custom flex items-center justify-center text-warm-dark shadow-sm"><User size={18} /></div>
                          <div>
                             <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest leading-none">Customer</p>
                             <p className="font-bold text-warm-dark">{selectedOrder.customerName}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-white border border-border-custom flex items-center justify-center text-warm-dark shadow-sm"><MapPin size={18} /></div>
                          <div className="flex-1 min-w-0">
                             <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest leading-none">Delivery Destination</p>
                             <p className="font-bold text-warm-dark truncate text-xs">{selectedOrder.address?.line1 || selectedOrder.shippingAddress?.line1}, {selectedOrder.address?.city || selectedOrder.shippingAddress?.city}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h5 className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-1">Order Manifest</h5>
                       <div className="space-y-3">
                          {selectedOrder.items.map((item: any, i: number) => (
                             <div key={i} className="flex gap-4 p-3 rounded-[2rem] hover:bg-sand-100 transition-all border border-border-custom group/item">
                                <div className="w-12 h-12 rounded-2xl bg-white p-1.5 border border-border-custom group-hover/item:scale-110 transition-transform">
                                   <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                   <p className="text-xs font-black text-warm-dark truncate">{item.productName || item.product_name}</p>
                                   <p className="text-[10px] font-black text-foreground-muted italic">QTY {item.quantity} · ₹{item.price}</p>
                                </div>
                                <div className="flex items-center">
                                   <p className="text-sm font-black text-warm-dark">₹{item.total}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-border-custom space-y-6">
                       <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-foreground-muted">
                             <span>Bag Subtotal</span>
                             <span>₹{selectedOrder.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-base font-black text-warm-dark pt-1">
                             <span>Total Amount</span>
                             <span className="text-primary tracking-tight">₹{selectedOrder.total || selectedOrder.totalAmount}</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <button className="h-14 rounded-2xl border-2 border-border-custom font-black text-xs uppercase tracking-widest hover:bg-sand-100 transition-all text-warm-dark">Cancel Order</button>
                          <button className="h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Fulfill Now</button>
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40 grayscale text-warm-dark">
                    <div className="w-24 h-24 bg-sand-100 rounded-[3rem] flex items-center justify-center mx-auto rotate-6"><Eye size={40} /></div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Inspection Mode</p>
                      <p className="text-[10px] font-bold text-foreground-muted">Select an order from the pipeline to inspect payloads and fulfillments</p>
                    </div>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
}
