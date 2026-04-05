'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  Ticket, 
  Bell, 
  Search, 
  ChevronLeft,
  Menu,
  X,
  Store,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useStore } from '@/lib/store';

 // Secret identifier for the root administrator
const MASTER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'connectwithpreetham@gmail.com';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Inventory', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Coupons', href: '/admin/marketing', icon: Ticket },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [loadingSession, setLoadingSession] = useState(true);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isLogin = pathname.includes('/admin/login');
  const logout = useStore(s => s.logout);

  useEffect(() => {
    if (isLogin) {
      setLoadingSession(false);
      return;
    }

    const checkAdmin = async () => {
      // Skip redundant checks if already verified in this session lifecycle
      if (isAdminVerified) {
        setLoadingSession(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/admin/login');
          return;
        }

        if (session.user.email === MASTER_ADMIN_EMAIL) {
          setIsAdminVerified(true);
          setLoadingSession(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role !== 'admin') {
          await supabase.auth.signOut();
          router.push('/admin/login?error=unauthorized');
          return;
        }

        setIsAdminVerified(true);
        setLoadingSession(false);
      } catch (err) {
        router.push('/admin/login');
      }
    };

    checkAdmin();
  }, [isLogin, router, isAdminVerified]);

  if (isLogin) return <>{children}</>;
  
  if (loadingSession) {
    return (
      <div className="h-screen w-screen bg-sand-100 flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-warm-dark uppercase tracking-widest">Verifying Admin Protocol...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-100/50 flex flex-col lg:flex-row">
      
      {/* MOBILE HEADER */}
      <div className="lg:hidden h-16 bg-white border-b border-border-custom px-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white"><Store size={18} /></div>
           <span className="font-black text-warm-dark tracking-tight">ADMIN PORTAL</span>
        </Link>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center text-warm-dark shadow-sm border border-border-custom"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR (DESKTOP & MOBILE TRANSITION) */}
      <AnimatePresence>
        {(mobileOpen || !mobileOpen) && (
          <motion.aside 
            initial={false}
            animate={{ 
              width: collapsed ? '80px' : '280px',
              x: 0,
              opacity: 1
            }}
            className={`
              fixed lg:sticky top-0 h-screen bg-white border-r border-border-custom z-50 flex flex-col shadow-2xl lg:shadow-none
              ${mobileOpen ? 'left-0 translate-x-0' : '-translate-x-full lg:translate-x-0'}
              transition-transform duration-300 lg:transition-none
            `}
          >
            {/* Header */}
            <div className="h-20 flex items-center px-6 gap-3 mb-4 overflow-hidden relative border-b border-border-custom/50">
               <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20"><Store size={22} /></div>
               <div className={`transition-opacity duration-300 ${collapsed ? 'opacity-0 invisible' : 'opacity-100'}`}>
                  <h2 className="font-black text-warm-dark leading-none tracking-tight">SuperHub</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">Admin Central</p>
               </div>
               
               <button 
                 onClick={() => setCollapsed(!collapsed)}
                 className="absolute right-4 w-7 h-7 bg-sand-100 rounded-lg flex items-center justify-center border border-border-custom hover:bg-white transition-all hidden lg:flex"
               >
                 {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
               </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-4">
               {ADMIN_NAV.map((item) => {
                 const isActive = pathname === item.href;
                 return (
                   <Link 
                     key={item.href} 
                     href={item.href}
                     onClick={() => setMobileOpen(false)}
                   >
                     <motion.div 
                       whileHover={{ x: 4 }}
                       className={`
                         flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all relative group
                         ${isActive ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-warm-gray hover:bg-cream-100/50 hover:text-warm-dark'}
                       `}
                     >
                        <item.icon size={20} className={collapsed ? 'mx-auto' : ''} />
                        {!collapsed && <span className="text-sm font-black tracking-tight">{item.name}</span>}
                        
                        {/* Tooltip for collapsed mode */}
                        {collapsed && (
                          <div className="absolute left-full ml-4 px-3 py-2 bg-warm-dark text-white text-xs font-black rounded-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all whitespace-nowrap z-50">
                             {item.name}
                          </div>
                        )}
                     </motion.div>
                   </Link>
                 );
               })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-border-custom mt-auto">
                <div className={`flex items-center gap-3 p-3 rounded-2xl bg-sand-100/50 ${collapsed ? 'justify-center' : ''}`}>
                   <div className="w-10 h-10 rounded-xl bg-espresso flex items-center justify-center text-white font-black shrink-0">PK</div>
                   {!collapsed && (
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-warm-dark truncate">Preetham Kumar</p>
                        <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest truncate">Root Admin</p>
                     </div>
                   )}
                   <button 
                     onClick={() => {
                        logout();
                        router.push('/admin/login');
                     }}
                     className="hover:text-red-500 transition-colors p-1"
                   >
                      <LogOut size={16} className="text-warm-gray" />
                   </button>
                </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
          
          {/* Top Integrated Search & Action Bar */}
          <header className={`h-20 bg-white/80 backdrop-blur-xl border-b border-border-custom px-6 flex items-center justify-between sticky top-0 z-40 ${isLogin ? 'hidden' : ''}`}>
             <div className="max-w-xl flex-1 relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Universal search (Ctrl + K)..." 
                  className="w-full h-11 pl-12 pr-6 rounded-xl bg-sand-100 border border-transparent outline-none focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                />
             </div>
             
             <div className="flex items-center gap-4">
                <div className="flex bg-sand-100 p-1 rounded-xl">
                   <div className="px-3 py-1.5 rounded-lg bg-white shadow-sm border border-border-custom text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Platform Live
                   </div>
                </div>
                
                <div className="relative">
                   <button 
                     onClick={() => {
                        // Toggle logic could go here, but for now we'll show a simple dropdown
                        setShowNotifications(!showNotifications);
                     }}
                     className="w-11 h-11 rounded-xl bg-white border border-border-custom flex items-center justify-center text-warm-dark hover:bg-sand-100 transition-all shadow-sm relative z-50"
                   >
                      <Bell size={20} />
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary border-2 border-white" />
                   </button>

                   <AnimatePresence>
                      {showNotifications && (
                         <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-border-custom p-4 z-50 overflow-hidden"
                            >
                               <div className="flex items-center justify-between mb-4 px-1">
                                  <h4 className="font-black text-warm-dark text-sm">Notifications</h4>
                                  <span className="text-[10px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline">Mark all read</span>
                               </div>
                               
                               <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                                  {[
                                     { id: 1, type: 'order', title: 'New Order Received', desc: 'Order #AG-4822 of ₹189.00', time: '2m ago', icon: ShoppingCart, color: 'blue' },
                                     { id: 2, type: 'inventory', title: 'Low Stock Alert', desc: 'Red Cherry Tomatoes (500g) is low on stock.', time: '1h ago', icon: Package, color: 'orange' },
                                     { id: 3, type: 'system', title: 'Security Protocol Updated', desc: 'Master bypass enabled for root account.', time: '4h ago', icon: Store, color: 'sand' },
                                  ].map((n) => (
                                     <div key={n.id} className="p-3 rounded-2xl bg-sand-100/50 hover:bg-cream-100 transition-all cursor-pointer group">
                                        <div className="flex gap-3">
                                           <div className={`w-8 h-8 rounded-lg bg-${n.color}-50 flex items-center justify-center text-${n.color}-600 shrink-0 group-hover:scale-110 transition-transform`}><n.icon size={14} /></div>
                                           <div className="min-w-0">
                                              <p className="text-xs font-black text-warm-dark truncate">{n.title}</p>
                                              <p className="text-[10px] font-bold text-foreground-muted line-clamp-2 mt-0.5">{n.desc}</p>
                                              <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest mt-1">{n.time}</p>
                                           </div>
                                        </div>
                                     </div>
                                  ))}
                               </div>
                               
                               <div className="mt-4 pt-3 border-t border-border-custom text-center">
                                  <p className="text-[10px] font-black text-warm-gray uppercase tracking-widest hover:text-primary transition-colors cursor-pointer">View notification history</p>
                               </div>
                            </motion.div>
                         </>
                      )}
                   </AnimatePresence>
                </div>
             </div>
          </header>

          {/* Page Content Viewport */}
          <div className="flex-1 p-6 lg:p-10">
             {children}
          </div>
      </main>

      {/* Screen Overlay for Mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
}
