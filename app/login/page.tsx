'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, Mail, Lock, ArrowRight, Code, Globe, ChevronLeft } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const loginAction = useStore(s => s.login);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      loginAction({
        id: '2548232c-3b36-4702-861c-8b8d4c1ce777',
        name: 'Preetham',
        email: formData.email || 'preetham@example.com',
        role: 'customer',
        createdAt: new Date().toISOString(),
        loyaltyPoints: 1250,
        totalSavings: 2450
      });
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-6 bg-texture relative">
       <button onClick={() => router.back()} className="absolute top-8 left-8 z-20">
          <motion.div 
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.9 }}
            className="px-5 h-12 bg-white border border-border-custom rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-warm-dark shadow-sm hover:text-primary transition-all cursor-pointer"
          >
             <ChevronLeft size={16} /> Back
          </motion.div>
       </button>
      <Link href="/" className="absolute top-8 right-8 z-20">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="px-5 h-12 bg-white border border-border-custom rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-warm-dark shadow-sm hover:text-primary transition-all cursor-pointer"
          >
             <Globe size={16} /> Home
          </motion.div>
      </Link>
      <div className="w-full max-w-[1100px] bg-white rounded-[3rem] shadow-2xl shadow-primary/5 overflow-hidden border border-border-custom flex flex-col md:flex-row">
        
        {/* Left Side: Visual/Branding */}
        <div className="md:w-[45%] bg-espresso p-12 text-white flex flex-col justify-between relative overflow-hidden">
           {/* Abstract decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
           
            <Link href="/" className="flex items-center gap-2.5 group w-fit relative z-10">
               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                 <ShoppingCart size={20} className="text-white" strokeWidth={2.5} />
               </div>
               <div className="font-black text-xl leading-none italic tracking-tight" style={{ fontFamily: 'Times New Roman, serif' }}>Supermarket</div>
            </Link>

           <div className="relative z-10 space-y-6">
              <h1 className="text-5xl font-black italic tracking-tighter leading-[1.1]">Elevate your <br/> shopping <br/> <span className="text-primary underline decoration-primary/30 underline-offset-8">experience.</span></h1>
              <p className="text-white/50 font-bold leading-relaxed max-w-[280px]">Join our exclusive community for farm-fresh groceries delivered with zero friction.</p>
           </div>

           <div className="relative z-10 pt-12 border-t border-white/10 mt-auto">
              <div className="flex -space-x-3 mb-4">
                 {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-espresso bg-sand-200 overflow-hidden shadow-xl">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" className="w-full h-full object-cover" />
                    </div>
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-espresso bg-primary flex items-center justify-center text-[10px] font-black text-white shadow-xl">+2k</div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">Trusted by 2,000+ premium shoppers</p>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-[55%] p-12 md:p-20 flex flex-col justify-center">
           <div className="mb-10">
              <h2 className="text-4xl font-black text-warm-dark tracking-tight mb-2 italic">Welcome Back</h2>
              <p className="text-foreground-muted font-bold">Don't have an account? <Link href="/signup" className="text-primary hover:underline">Create one for free</Link></p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-warm-gray px-1">Email Address</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="email" 
                      required 
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full h-14 bg-sand-100 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl pl-12 pr-4 font-bold text-warm-dark transition-all outline-none placeholder:text-warm-gray/50" 
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black uppercase tracking-widest text-warm-gray">Password</label>
                    <Link href="/forgot-password" title="Recover Password" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</Link>
                 </div>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="password" 
                      required 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full h-14 bg-sand-100 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl pl-12 pr-4 font-bold text-warm-dark transition-all outline-none placeholder:text-warm-gray/50" 
                    />
                 </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-primary-gradient text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
              </button>
           </form>

           <div className="relative my-10 flex items-center">
              <div className="flex-grow border-t border-border-custom" />
              <span className="flex-shrink mx-4 text-xs font-black uppercase tracking-widest text-white/10 px-2 bg-white -mt-0.5">Or continue with</span>
              <div className="flex-grow border-t border-border-custom" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button className="h-14 border-2 border-border-custom rounded-2xl flex items-center justify-center gap-3 font-bold text-warm-dark hover:bg-sand-100 transition-all hover:border-warm-gray/20">
                 <Globe size={18} className="text-red-500" /> Google
              </button>
              <button className="h-14 border-2 border-border-custom rounded-2xl flex items-center justify-center gap-3 font-bold text-warm-dark hover:bg-sand-100 transition-all hover:border-warm-gray/20">
                 <Code size={18} /> GitHub
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
