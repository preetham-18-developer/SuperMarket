'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck, Mail, AlertCircle, Store } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const MASTER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'connectwithpreetham@gmail.com';

// ── Inner component that safely uses useSearchParams ──────────────────────────
function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setErrorMsg('Access Denied: Administrative privileges required.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      setErrorMsg('Access temporarily suspended due to security protocol. Please try again later.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setLoginAttempts(prev => prev + 1);
        if (loginAttempts >= 4) setIsLocked(true);
        throw authError;
      }

      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        if (profile?.role !== 'admin' && data.user.email !== MASTER_ADMIN_EMAIL) {
          await supabase.auth.signOut();
          throw new Error('Unauthorized access. Your credentials do not have administrative privileges.');
        }
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message === 'Invalid login credentials' ? 'Secure authentication failed. Verification denied.' : err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-in fade-in duration-700">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20"><Store size={24} /></div>
          <h2 className="text-2xl font-black text-warm-dark tracking-tighter uppercase">SuperHub <span className="text-primary tracking-widest text-[10px] uppercase block -mt-1 font-black">Secure Core</span></h2>
        </div>

        <div className="p-10 rounded-[3.5rem] bg-white border border-border-custom shadow-2xl space-y-8 relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full" />

          <div className="text-center space-y-3 relative z-10">
            <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-warm-dark">Root Access</h1>
            <p className="text-foreground-muted font-bold text-[9px] uppercase tracking-[0.2em] leading-none mb-1">Authorization Protocol Alpha</p>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-red-50 border border-red-100/50 flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest shadow-sm"
              >
                <AlertCircle size={16} />
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-2 opacity-60 font-mono">ID: Admin_Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder={MASTER_ADMIN_EMAIL}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-sand-100/50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-8 focus:ring-primary/5 transition-all font-black text-sm text-warm-dark"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-foreground-muted uppercase tracking-widest px-2 opacity-60 font-mono">Key: Access_Payload</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-16 pl-14 pr-6 rounded-2xl bg-sand-100/50 border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:ring-8 focus:ring-primary/5 transition-all font-black text-sm text-warm-dark"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full h-16 bg-warm-dark text-white rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-2xl hover:bg-black transition-all disabled:opacity-50 mt-4 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Establish Link <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </motion.button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-[10px] font-black text-warm-gray uppercase tracking-widest hover:text-primary transition-all flex items-center justify-center gap-2 mx-auto"
          >
            Exit Terminal <Store size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page component wraps inner form in Suspense (required by Next.js 15/16) ───
export default function AdminLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
