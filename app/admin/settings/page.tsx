'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Store, 
  MapPin, 
  DollarSign, 
  Truck, 
  ShieldCheck, 
  Bell, 
  Globe, 
  CreditCard, 
  Users, 
  Save, 
  RefreshCw, 
  Eye, 
  Mail, 
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';

const SECTIONS = [
  { id: 'general', label: 'Identity Store', icon: Store, sub: 'Brand name, logo and favicon configuration' },
  { id: 'shipping', label: 'Logistics Matrix', icon: Truck, sub: 'Delivery zones, fees and fulfillment rules' },
  { id: 'payments', label: 'Payment Backbone', icon: CreditCard, sub: 'Razorpay, Stripe & local payment gateways' },
  { id: 'policies', label: 'Legal & Safety', icon: ShieldCheck, sub: 'Terms, conditions and compliance' },
  { id: 'analytics', label: 'Data Layers', icon: Database, sub: 'Pixel, GA4 and tracking pixels' },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="space-y-10 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Settings size={16} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Engine Configuration</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-warm-dark tracking-tight">System Core</h1>
           <p className="text-foreground-muted font-bold text-sm mt-1 max-w-sm">Configure the fundamental operating parameters of SuperHub.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
              <Save size={18} /> Commit Changes
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
         
         {/* Navigation Rail */}
         <div className="xl:col-span-1 space-y-2 text-warm-dark">
            {SECTIONS.map((s) => (
               <button 
                 key={s.id}
                 onClick={() => setActiveSection(s.id)}
                 className={`
                   w-full p-5 rounded-3xl flex items-center gap-4 transition-all text-left relative overflow-hidden group
                   ${activeSection === s.id ? 'bg-white shadow-xl shadow-primary/5 text-primary' : 'text-warm-gray hover:bg-white'}
                 `}
               >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${activeSection === s.id ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-sand-100 border-transparent text-warm-gray group-hover:text-warm-dark'}`}><s.icon size={20} /></div>
                  <div className="flex-1 min-w-0">
                     <p className="font-black text-sm tracking-tight leading-none">{s.label}</p>
                     <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest mt-1 opacity-60 truncate">{s.sub}</p>
                  </div>
                  {activeSection === s.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
               </button>
            ))}
         </div>

         {/* Configuration Sheet */}
         <div className="xl:col-span-3 card p-10 bg-white border border-border-custom shadow-2xl relative overflow-hidden flex flex-col text-warm-dark">
            <AnimatePresence mode="wait">
               {activeSection === 'general' && (
                  <motion.div 
                    key="general"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-3xl font-black tracking-tight italic">Storefront Identity</h3>
                           <p className="text-sm font-bold text-foreground-muted mt-1">Configure your brand appearance and public identifiers.</p>
                        </div>
                        <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary rotate-12"><Store size={32} /></div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-1">Organization Name</label>
                           <input type="text" defaultValue="Anti Gravity Supermarket" className="input h-14 rounded-2xl bg-sand-100 border-none outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 px-6 font-bold text-sm w-full" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-1">Support Email</label>
                           <input type="email" defaultValue="hello@superhub.io" className="input h-14 rounded-2xl bg-sand-100 border-none outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 px-6 font-bold text-sm w-full" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                           <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-1">Headquarters Address</label>
                           <textarea rows={3} defaultValue="Suite 404, Quantum Towers, Nellore, Andhra Pradesh, 524001, India" className="input rounded-2xl bg-sand-100 border-none outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 px-6 py-4 font-bold text-sm w-full resize-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-1">Base Currency Symbol</label>
                           <input type="text" defaultValue="INR (₹)" className="input h-14 rounded-2xl bg-sand-100 border-none outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 px-6 font-bold text-sm w-full" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-1">Local Timezone</label>
                           <select className="select h-14 rounded-2xl bg-sand-100 border-none outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 px-6 font-bold text-sm w-full appearance-none">
                              <option>(GMT+05:30) Chennai, Kolkata, Mumbai</option>
                              <option>(GMT+01:00) Central European Time</option>
                           </select>
                        </div>
                     </div>

                     <div className="p-8 pb-32 lg:pb-8 rounded-[3rem] bg-sand-100/50 border border-border-custom relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 opacity-[0.03] grayscale -rotate-45"><Globe size={200} /></div>
                        <h4 className="text-xl font-black italic mb-2">Regional Availability</h4>
                        <p className="text-xs font-bold text-foreground-muted mb-6">Determine which regions and cities your platform supports for live logistics.</p>
                        <div className="flex flex-wrap gap-2 relative z-10">
                           {['Bengaluru', 'Delhi', 'Nellore', 'Mumbai', 'Chennai'].map(c => (
                              <div key={c} className="px-4 py-2 bg-white rounded-xl border border-border-custom text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
                                 {c} <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              </div>
                           ))}
                           <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all">+ Add Region</button>
                        </div>
                     </div>
                  </motion.div>
               )}
               {activeSection !== 'general' && (
                 <div className="flex flex-col items-center justify-center py-40 opacity-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mx-auto grayscale"><Settings size={32} /></div>
                    <p className="text-sm font-black uppercase tracking-widest">Section Locked <span className="text-primary italic">· Experimental</span></p>
                    <p className="text-[10px] font-bold text-foreground-muted px-20">This configuration cluster is currently being optimized for high-velocity store management.</p>
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>

    </div>
  );
}
