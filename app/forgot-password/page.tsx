'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-6 bg-texture">
      <div className="w-full max-w-[600px] bg-white rounded-[3rem] shadow-2xl shadow-primary/5 p-12 md:p-20 border border-border-custom relative overflow-hidden">
        
        {/* Decor */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground-muted hover:text-primary transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Sign In
        </Link>

        {!submitted ? (
          <div className="space-y-8 relative z-10">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2 shadow-sm border border-primary/10">
                 <ShieldCheck size={32} />
              </div>
              <h1 className="text-4xl font-black text-warm-dark tracking-tight italic" style={{ fontFamily: 'Times New Roman, serif' }}>Reset Password</h1>
              <p className="text-foreground-muted font-bold leading-relaxed">Enter your registered email and we'll send high-priority recovery link to your inbox.</p>
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 bg-sand-100 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl pl-12 pr-4 font-bold text-warm-dark transition-all outline-none placeholder:text-warm-gray/50" 
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-primary-gradient text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" /> : <>Send Reset Link <ArrowRight size={20} /></>}
              </button>
            </form>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 relative z-10"
          >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-green-500/20">
               <CheckCircle2 size={48} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-warm-dark italic" style={{ fontFamily: 'Times New Roman, serif' }}>Check Your Inbox</h2>
              <p className="text-foreground-muted font-bold italic leading-relaxed">
                A secure login link has been dispatched to <span className="text-primary">{email}</span>. Please verify within 15 minutes.
              </p>
            </div>
            <div className="pt-8 border-t border-border-custom">
               <p className="text-[10px] font-black uppercase tracking-widest text-foreground-muted">Didn't receive it? <button onClick={() => setSubmitted(false)} className="text-primary hover:underline">Try another email</button></p>
            </div>
          </motion.div>
        )}

        <div className="mt-20 flex items-center justify-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
           <p className="text-[8px] font-black text-foreground-muted uppercase tracking-[0.4em]">Supermarket Secure Gateway v2.0</p>
        </div>
      </div>
    </div>
  );
}
