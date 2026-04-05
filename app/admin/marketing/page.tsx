'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Calendar, 
  Users, 
  Percent, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  MoreVertical,
  Zap,
  ArrowUpRight,
  RefreshCw,
  Eye,
  Tag
} from 'lucide-react';
import { COUPONS } from '@/lib/data';

export default function AdminMarketingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-10 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-warm-dark">
        <div>
           <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Zap size={16} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Growth & Loyalty</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tight">Campaigns</h1>
           <p className="text-foreground-muted font-bold text-sm mt-1 max-w-sm">Create and monitor promotional incentives to drive order velocity.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all">
              <Plus size={18} /> Launch Coupon
           </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Active Coupons', val: COUPONS.filter(c => c.active).length, icon: Ticket, color: 'blue' },
           { label: 'Total Claims', val: COUPONS.reduce((acc, c) => acc + c.usedCount, 0), icon: Users, color: 'indigo' },
           { label: 'Gross Discount', val: '₹42,850', icon: DollarSign, color: 'primary' },
           { label: 'Conversion Lift', val: '+18.4%', icon: ArrowUpRight, color: 'green' },
         ].map((s, i) => (
           <div key={i} className="card p-6 border-none shadow-sm group">
              <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 group-hover:scale-110 transition-transform mb-3`}><s.icon size={18} /></div>
              <h4 className="text-2xl font-black text-warm-dark">{s.val}</h4>
              <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest leading-none mt-1">{s.label}</p>
           </div>
         ))}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white border border-border-custom p-3 rounded-[2.5rem] shadow-sm">
         <div className="relative flex-1 group w-full">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by code or campaign name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-sand-100/50 border border-transparent rounded-[1.75rem] outline-none focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm" 
            />
         </div>
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {COUPONS.map((coupon, i) => (
            <motion.div 
               key={coupon.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="card p-8 border-none shadow-xl shadow-primary/5 bg-white relative overflow-hidden flex flex-col justify-between group"
            >
               {/* Ticket Decal */}
               <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full rotate-45 group-hover:bg-primary/10 transition-colors" />
               
               <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className={`w-12 h-12 rounded-2xl ${coupon.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} flex items-center justify-center`}>
                        {coupon.type === 'percent' ? <Percent size={22} /> : <DollarSign size={22} />}
                     </div>
                     <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${coupon.active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {coupon.active ? 'Operational' : 'Paused'}
                     </div>
                  </div>

                  <div className="space-y-1">
                     <h4 className="text-2xl font-black text-warm-dark tracking-tighter uppercase">{coupon.code}</h4>
                     <p className="text-xs font-bold text-foreground-muted">{coupon.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-custom bg-sand-100/30 -mx-8 px-8 py-4">
                     <div>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest whitespace-nowrap">Utilization</p>
                        <p className="text-sm font-black text-warm-dark">{coupon.usedCount} / {coupon.usageLimit}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">Efficiency</p>
                        <p className="text-sm font-black text-green-600">High</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-foreground-muted pt-2 px-1">
                     <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1.5"><Tag size={12} /> Min Spend ₹{coupon.minOrder}</span>
                  </div>
               </div>

               <div className="mt-8 flex gap-3 relative z-10">
                  <button className="flex-1 h-12 rounded-xl bg-sand-100 text-warm-dark font-black text-[10px] uppercase tracking-widest hover:bg-white border border-transparent hover:border-border-custom transition-all">Edit Parameters</button>
                  <button className="w-12 h-12 rounded-xl bg-sand-100 text-warm-gray hover:text-red-500 transition-all flex items-center justify-center"><Trash2 size={18} /></button>
               </div>
            </motion.div>
         ))}

         {/* Add New Shell */}
         <div className="card border-2 border-dashed border-border-custom bg-transparent flex flex-col items-center justify-center p-8 min-h-[360px] group cursor-pointer hover:border-primary/50 hover:bg-white transition-all">
            <div className="w-16 h-16 rounded-[2rem] bg-sand-100 flex items-center justify-center text-warm-gray group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
               <Plus size={32} />
            </div>
            <div className="mt-6 text-center">
               <h5 className="font-black text-warm-dark tracking-tight">New Marketing Vector</h5>
               <p className="text-xs text-foreground-muted font-bold px-10">Launch a new localized promotion or seasonal flash coupon.</p>
            </div>
         </div>
      </div>

    </div>
  );
}
