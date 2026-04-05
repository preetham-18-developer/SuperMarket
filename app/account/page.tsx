'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  Settings, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  LogOut, 
  Trash2, 
  Briefcase,
  Zap,
  Star,
  Activity,
  History,
  Info,
  Plus
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);
  // Use granular selectors for better performance
  // Use separate selectors to avoid returning a new object and triggering infinite loops
  // Use separate selectors to avoid returning a new object and triggering infinite loops
  const user = useStore(s => s.user);
  const isLoggedIn = useStore(s => s.isLoggedIn);
  const logout = useStore(s => s.logout);
  const setDefaultAddress = useStore(s => s.setDefaultAddress);
  const router = useRouter();
  const userRole = user?.role;
  const userPoints = user?.loyaltyPoints;
  const userSavings = user?.totalSavings;
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '' 
  });

  useEffect(() => { 
    setMounted(true); 
    if (user) {
      setForm({
        name: user.name || 'Preetham',
        email: user.email || 'preetham@example.com',
        phone: user.phone || '98765 43210'
      });
    }
  }, [user]);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  if (!mounted) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-sm border border-primary/10">
                <User size={20} />
             </div>
             <h1 className="text-3xl md:text-5xl font-black text-warm-dark tracking-tight">Your Profile</h1>
          </div>
          <p className="text-foreground-muted font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            Account Security Status: High
          </p>
        </div>
        <button 
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="btn-ghost flex items-center gap-2 text-red-500 font-black hover:bg-red-50"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Detail Settings */}
        <div className="lg:col-span-8 space-y-10">
           
           {/* Profile Information */}
           <section className="bg-white border border-border-custom rounded-[3rem] p-8 md:p-12 shadow-xl shadow-primary/5 space-y-10 relative overflow-hidden group content-visibility-auto">
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-full bg-cream-100 -skew-x-[25deg] translate-x-20 group-hover:translate-x-12 transition-transform duration-700 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-sand-100 border-4 border-white shadow-xl shadow-primary/10 flex items-center justify-center text-4xl shrink-0">
                       👨🏼‍💻
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-warm-dark">{form.name}</h3>
                       <p className="text-sm font-bold text-foreground-muted italic">{form.email}</p>
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5"><Star size={10} fill="currentColor"/> {userRole || 'Elite'} Member since 2024</p>
                    </div>
                 </div>
                 <div className="flex gap-3 mt-4 md:mt-0">
                    <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="btn-ghost px-6 h-12 text-xs font-black border-border-custom rounded-2xl">{isEditingProfile ? 'Cancel' : 'Edit Profile'}</button>
                    {isEditingProfile && <button className="btn-primary px-8 h-12 text-xs font-black shadow-lg shadow-primary/10">Save Changes</button>}
                 </div>
              </div>

              {/* Points & Savings Section (NEW) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-border-custom z-10 relative">
                 <div className="flex flex-col p-6 rounded-[2.5rem] bg-orange-50 border-2 border-orange-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm"><Zap size={20} fill="currentColor" /></div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-1">Earned Points</p>
                          <p className="text-3xl font-black text-warm-dark tracking-tighter">{userPoints || 0}</p>
                       </div>
                    </div>
                    <p className="text-[10px] font-bold text-warm-dark/50 leading-relaxed max-w-[180px]">Redeem these points on your next purchase for instant discounts.</p>
                    <div className="absolute right-0 bottom-0 w-20 h-20 bg-orange-200/20 rounded-tl-[3rem] group-hover:scale-110 transition-transform" />
                 </div>

                 <div className="flex flex-col p-6 rounded-[2.5rem] bg-green-50 border-2 border-green-100 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-600 shadow-sm"><CreditCard size={20} /></div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400 mb-1">Total Savings</p>
                          <p className="text-3xl font-black text-warm-dark tracking-tighter">₹{userSavings || 0}</p>
                       </div>
                    </div>
                    <p className="text-[10px] font-bold text-warm-dark/50 leading-relaxed max-w-[180px]">You have saved this amount by using coupons and club deals.</p>
                    <div className="absolute right-0 bottom-0 w-20 h-20 bg-green-200/20 rounded-tl-[3rem] group-hover:scale-110 transition-transform" />
                 </div>
              </div>

              {isEditingProfile && (
                 <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative pt-8 border-t border-border-custom overflow-hidden"
                 >
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted px-2">Full Name</label>
                       <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-5 h-12 bg-cream-100 border border-border-custom rounded-2xl font-bold text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-foreground-muted px-2">Phone Number</label>
                       <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-5 h-12 bg-cream-100 border border-border-custom rounded-2xl font-bold text-sm outline-none focus:border-primary" />
                    </div>
                 </motion.div>
              )}
           </section>

           {/* Quick Navigation Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Order Pipeline', sub: 'Track and manage your orders', icon: ShoppingBag, href: '/orders', color: 'primary' },
                { label: 'Saved Wishlist', sub: 'Your favorite items', icon: Heart, href: '/wishlist', color: 'blue' },
              ].map(card => (
                 <Link key={card.label} href={card.href}>
                    <motion.div whileHover={{ scale: 1.02 }} className="card p-8 flex items-center justify-between group cursor-pointer shadow-xl shadow-primary/5 border-none">
                       <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl bg-${card.color === 'primary' ? 'primary/10' : 'blue-50'} flex items-center justify-center text-${card.color === 'primary' ? 'primary' : 'blue-600'} group-hover:scale-110 transition-transform`}><card.icon size={24} /></div>
                          <div>
                             <h4 className="font-black text-warm-dark uppercase tracking-tight">{card.label}</h4>
                             <p className="text-xs font-bold text-foreground-muted">{card.sub}</p>
                          </div>
                       </div>
                       <ChevronRight size={20} className="text-warm-gray group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </motion.div>
                 </Link>
              ))}
           </div>

           {/* Addresses Section */}
           <div className="bg-white border border-border-custom rounded-[3rem] p-8 md:p-12 space-y-8 shadow-xl shadow-primary/5">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-warm-dark flex items-center gap-3 italic"><MapPin size={24} className="text-primary"/> Delivery Hubs</h3>
                 <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:underline decoration-2"><Plus size={12}/> Add New</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(user?.addresses || [
                    { id: 'addr-1', label: 'Home', line1: '123, Espresso Street', city: 'Nellore', state: 'AP', pincode: '524001', isDefault: true },
                    { id: 'addr-2', label: 'Office', line1: 'Supermarket Hub, Tech Park', city: 'Bangalore', state: 'KA', pincode: '560001', isDefault: false },
                  ]).map((addr) => (
                    <div 
                      key={addr.id} 
                      onClick={() => setDefaultAddress(addr.id)}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all relative group cursor-pointer ${addr.isDefault ? 'border-primary bg-primary/5 shadow-xl shadow-primary/5' : 'border-border-custom hover:border-primary/20 bg-white'}`}
                    >
                       <div className="flex justify-between items-start mb-4">
                          <div className={`w-10 h-10 rounded-xl bg-white border border-border-custom flex items-center justify-center text-xl shadow-sm ${addr.isDefault ? 'border-primary/20' : ''}`}>
                             {addr.label === 'Home' ? '🏠' : '🏢'}
                          </div>
                          <div className="flex gap-2">
                             <button className="p-2 hover:text-primary transition-all text-warm-gray" onClick={(e) => e.stopPropagation()}><Settings size={14}/></button>
                             <button className="p-2 hover:text-red-500 transition-all text-warm-gray" onClick={(e) => e.stopPropagation()}><Trash2 size={14}/></button>
                          </div>
                       </div>
                       <h4 className="font-black text-warm-dark uppercase tracking-tight text-xs flex items-center gap-2">
                          {addr.label} {addr.isDefault && <span className="bg-primary text-white text-[8px] px-2 py-0.5 rounded-full">DEFAULT</span>}
                       </h4>
                       <p className="text-xs font-bold text-foreground-muted leading-relaxed mt-2 italic line-clamp-2">{addr.line1}, {addr.city}</p>
                    </div>
                  ))}
              </div>
           </div>
        </div>

        {/* Right Side: Account Actions & Info */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-28 h-fit">
           
           <div className="bg-espresso text-white rounded-[3rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-6 z-10 relative">
                 <h3 className="text-2xl font-black italic tracking-tight">Security Center</h3>
                 <div className="space-y-4">
                    {[
                      { icon: ShieldCheck, label: 'Two-Factor Auth', status: 'Enabled', color: 'green' },
                      { icon: Bell, label: 'Marketing Emails', status: 'Disabled', color: 'red' },
                      { icon: Activity, label: 'Active Sessions', status: 'Current (1)', color: 'blue' },
                    ].map(s => (
                       <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                             <s.icon size={16} className="text-white/40" />
                             <span className="text-xs font-bold text-white/60">{s.label}</span>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${s.color === 'green' ? 'text-green-400' : s.color === 'red' ? 'text-red-400' : 'text-primary'}`}>{s.status}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4 z-10 relative">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Privacy Control</h4>
                 <button className="w-full py-4 bg-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">Manage Data & Privacy <ChevronRight size={14} /></button>
              </div>
           </div>

           <div className="p-8 border border-border-custom border-dashed rounded-[3rem] text-center space-y-3 group hover:border-primary/20 transition-all">
              <div className="w-12 h-12 bg-sand-100 rounded-full flex items-center justify-center mx-auto text-warm-gray mb-2 group-hover:text-primary group-hover:animate-bounce transition-all"><Info size={20} /></div>
              <h4 className="font-black text-warm-dark text-sm uppercase tracking-widest">Need more control?</h4>
              <p className="text-[10px] text-foreground-muted font-bold leading-relaxed px-2">Access the Supermarket API for developers to automate your monthly groceries.</p>
              <button className="text-xs font-black text-primary underline decoration-2">Developer Docs</button>
           </div>
        </aside>
      </div>

    </div>
  );
}


