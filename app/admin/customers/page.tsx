'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Phone, 
  ShoppingBag, 
  Calendar, 
  ChevronRight, 
  ShieldCheck, 
  ArrowUpRight,
  Download,
  Activity,
  History,
  Star,
  Ban,
  UserCheck
} from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: 'u001', name: 'Preetham Goud', email: 'preetham@email.com', phone: '+91 98765 43210', totalSpent: 28450, totalOrders: 12, lastOrder: '2026-04-03', status: 'active', role: 'admin' },
  { id: 'u002', name: 'Anjali Sharma', email: 'anjali@email.com', phone: '+91 98760 00000', totalSpent: 12400, totalOrders: 8, lastOrder: '2026-04-02', status: 'active', role: 'customer' },
  { id: 'u003', name: 'Rahul Varma', email: 'rahul@email.com', phone: '+91 98761 11111', totalSpent: 4500, totalOrders: 3, lastOrder: '2026-03-28', status: 'inactive', role: 'customer' },
  { id: 'u004', name: 'Sita Rani', email: 'sita@email.com', phone: '+91 98762 22222', totalSpent: 18900, totalOrders: 15, lastOrder: '2026-04-04', status: 'active', role: 'customer' },
  { id: 'u005', name: 'Vikram Singh', email: 'vik@email.com', phone: '+91 98763 33333', totalSpent: 850, totalOrders: 1, lastOrder: '2026-03-15', status: 'banned', role: 'customer' },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredCustomers = useMemo(() => {
    return MOCK_CUSTOMERS.filter(c => {
      const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = filterRole === 'all' || c.role === filterRole;
      return matchSearch && matchRole;
    });
  }, [searchQuery, filterRole]);

  return (
    <div className="space-y-10 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Users size={16} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Audience Intelligence</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-warm-dark tracking-tight">Accounts</h1>
           <p className="text-foreground-muted font-bold text-sm mt-1 max-w-sm">Manage user identities and customer loyalty metrics.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3.5 bg-warm-dark text-white rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all">
              <UserPlus size={18} /> Add Customer
           </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         {[
           { label: 'Verified Users', val: '1.2k', sub: '+12% this month', icon: ShieldCheck, color: 'green' },
           { label: 'Active Right Now', val: '48', sub: 'Browsing active', icon: Activity, color: 'blue' },
           { label: 'Retention Rate', val: '78%', sub: 'High loyalty', icon: Star, color: 'orange' },
           { label: 'Avg Spend', val: '₹4.2k', sub: 'Per transaction', icon: ShoppingBag, color: 'primary' },
         ].map((s, i) => (
            <div key={i} className="card p-6 border-none shadow-sm group">
               <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 group-hover:scale-110 transition-transform mb-3`}><s.icon size={18} /></div>
               <h4 className="text-2xl font-black text-warm-dark">{s.val}</h4>
               <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">{s.label}</p>
            </div>
         ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white border border-border-custom p-3 rounded-[2.5rem] shadow-sm">
         <div className="relative flex-1 group w-full">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by identity, email or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-sand-100/50 border border-transparent rounded-[1.75rem] outline-none focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all font-bold text-sm" 
            />
         </div>
         
         <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto px-4 md:px-0">
            {['all', 'customer', 'admin'].map(role => (
               <button 
                 key={role}
                 onClick={() => setFilterRole(role)}
                 className={`
                   px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                   ${filterRole === role 
                     ? 'bg-warm-dark text-white shadow-lg border-warm-dark' 
                     : 'bg-white text-warm-gray border-border-custom hover:bg-sand-100'}
                 `}
               >
                 {role}s
               </button>
            ))}
         </div>
      </div>

      {/* Customer List Area */}
      <div className="card p-0 overflow-hidden shadow-xl shadow-primary/5 border border-border-custom bg-white">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-sand-100/50 border-b border-border-custom">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Customer Identity</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Total LTV</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Activity Hub</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Status</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted text-right">Control</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id} className="border-b border-border-custom hover:bg-cream-100/30 transition-all group">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-sand-100 border border-border-custom flex items-center justify-center text-warm-dark font-black text-sm">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                             </div>
                             <div>
                                <h4 className="text-sm font-black text-warm-dark">{customer.name}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                   <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${customer.role === 'admin' ? 'bg-primary text-white' : 'bg-sand-200 text-warm-gray'}`}>
                                      {customer.role}
                                   </span>
                                   <p className="text-[10px] font-bold text-foreground-muted italic opacity-60 truncate max-w-[150px]">{customer.email}</p>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="space-y-0.5">
                             <p className="text-sm font-black text-warm-dark">₹{customer.totalSpent.toLocaleString()}</p>
                             <p className="text-[10px] font-black text-primary uppercase tracking-widest italic">{customer.totalOrders} Orders Pipeline</p>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2 text-[10px] font-bold text-foreground-muted">
                                <Calendar size={10} className="text-primary" /> Last Login: {new Date(customer.lastOrder).toLocaleDateString()}
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-bold text-foreground-muted">
                                <Phone size={10} className="text-primary" /> {customer.phone}
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className={`
                             inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-[9px] uppercase tracking-widest
                             ${customer.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                               customer.status === 'banned' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}
                          `}>
                             {customer.status === 'active' ? <UserCheck size={10} /> : <Ban size={10} />}
                             {customer.status}
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button className="p-3 rounded-xl bg-white border border-border-custom text-warm-gray hover:text-primary shadow-sm hover:shadow-md transition-all"><Mail size={16} /></button>
                             <button className="p-3 rounded-xl bg-white border border-border-custom text-warm-gray hover:text-primary shadow-sm hover:shadow-md transition-all"><History size={16} /></button>
                             <button className="p-3 rounded-xl bg-white border border-border-custom text-warm-gray hover:text-warm-dark shadow-sm hover:shadow-md transition-all"><MoreVertical size={16} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {filteredCustomers.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center mx-auto text-warm-gray"><Users size={24} /></div>
               <p className="text-sm font-black text-warm-dark">No customers found.</p>
            </div>
         )}
      </div>

    </div>
  );
}
