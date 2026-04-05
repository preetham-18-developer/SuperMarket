'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp,
  Download,
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Box, 
  LayoutGrid,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  MoreVertical,
  Activity,
  AlertTriangle,
  FileText,
  Calendar,
  Star
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie
} from 'recharts';
import { 
  getAnalyticsKPIs, 
  getRevenueHistory,
  getInventoryHealthData,
  getTopSellingProducts,
  getLiveOrders,
  ORDERS,
  PRODUCTS
} from '@/lib/data';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const user = useStore(s => s.user);
  const isLoggedIn = useStore(s => s.isLoggedIn);
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => { 
    setMounted(true); 
  }, []);

  // Memoize data and react to timeRange changes
  const kpis = useMemo(() => getAnalyticsKPIs(timeRange), [timeRange]);
  const salesHistory = useMemo(() => getRevenueHistory(timeRange), [timeRange]);
  const inventoryHealth = useMemo(() => getInventoryHealthData(), []);
  const liveOrders = useMemo(() => getLiveOrders().slice(0, 5), []);
  const topProducts = useMemo(() => getTopSellingProducts().slice(0, 5), []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 md:space-y-10 pb-20 px-1 md:px-0">
      
      {/* Admin Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Activity size={16} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Overview</span>
           </div>
           <h1 className="text-3xl md:text-5xl font-black text-warm-dark tracking-tight">Main Command</h1>
           <p className="text-foreground-muted font-bold text-xs md:text-sm mt-1 max-w-md">Real-time performance and inventory metrics for Supermarket Hub.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
           <div className="flex bg-sand-100 p-1 rounded-xl">
               {['24h', '7d', '30d'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTimeRange(t)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === t ? 'bg-white text-primary shadow-sm' : 'text-warm-gray hover:bg-white/50'}`}
                  >
                     {t}
                  </button>
               ))}
            </div>
            
            <button 
              onClick={() => {
                alert(`Exporting ${timeRange} report...`);
                // Generate a mockup CSV download for demonstration
                const csvContent = "data:text/csv;charset=utf-8,Date,Revenue,Orders\n2024-04-01,12000,45\n2024-04-02,15000,52";
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `supermarket_report_${timeRange}.csv`);
                document.body.appendChild(link);
                link.click();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-espresso text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all group active:scale-95"
            >
               <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" /> Export Report
            </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: DollarSign, label: 'Total Revenue', value: `₹${kpis.totalRevenue.toLocaleString()}`, change: '+12.5%', isPositive: true, color: 'primary' },
          { icon: ShoppingCart, label: 'Live Orders', value: kpis.activeOrders.toString(), change: '+4.2%', isPositive: true, color: 'blue' },
          { icon: Users, label: 'Customer Growth', value: kpis.totalCustomers.toLocaleString(), change: '+8.1%', isPositive: true, color: 'green' },
          { icon: AlertTriangle, label: 'Low Stock Items', value: kpis.lowStockCount.toString(), change: '+2', isPositive: false, color: 'orange' },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03 }}
            className={`group card p-4 md:p-8 relative overflow-hidden flex flex-col justify-between h-[140px] md:h-[180px] border-none shadow-xl shadow-${item.color}-500/5 perf-gpu`}
          >
            <div className="flex justify-between items-start z-10">
               <div className={`w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-4 h-4 md:w-[22px] md:h-[22px]" />
               </div>
               <div className={`flex items-center gap-1 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black ${item.isPositive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  {item.isPositive ? <ArrowUpRight size={8} className="md:w-2.5 md:h-2.5" /> : <ArrowDownRight size={8} className="md:w-2.5 md:h-2.5" />}
                  {item.change}
               </div>
            </div>
            
            <div className="z-10">
               <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-foreground-muted mb-0.5 md:mb-1 truncate">{item.label}</p>
               <h3 className="text-xl md:text-3xl font-black text-warm-dark tracking-tight">{item.value}</h3>
            </div>
            
            {/* Decal */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 -rotate-12">
               <item.icon className="w-full h-full" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Main Sales Chart */}
        <div className="lg:col-span-2 card p-6 md:p-8 h-[350px] md:h-[480px] flex flex-col perf-gpu border-none shadow-xl shadow-primary/5 content-visibility-auto">
           <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><TrendingUp size={18} /></div>
                 <div>
                    <h3 className="text-lg md:text-xl font-black text-warm-dark">Revenue Insights</h3>
                    <p className="text-[10px] md:text-xs text-foreground-muted font-bold">Performance vs Previous Period</p>
                 </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-sand-100 px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black text-foreground-muted uppercase tracking-widest border border-sand-200">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Now
              </div>
           </div>
           
           <div className="flex-1 w-full mt-2 md:mt-4">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={salesHistory}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.01}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#A0A0A0' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#A0A0A0' }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 15px 40px rgba(0,0,0,0.1)', fontWeight: 800, fontSize: '11px', color: '#2D2D2D' }}
                      cursor={{ stroke: '#FF6B00', strokeWidth: 2, strokeDasharray: '5,5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#FF6B00" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorRev)" 
                      animationDuration={1500}
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Live Orders Mini-Monitor */}
        <div className="card p-6 md:p-8 h-[400px] md:h-[480px] flex flex-col bg-espresso text-white relative overflow-hidden group perf-gpu border-none shadow-2xl content-visibility-auto">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 -skew-x-[20deg] translate-x-12 -translate-y-8 pointer-events-none" />
           
           <div className="flex items-center justify-between mb-6 md:mb-8 z-10">
              <div className="flex items-center gap-3">
                 <div className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-white/10 flex items-center justify-center text-primary"><Clock size={18} /></div>
                 <div>
                    <h3 className="text-lg md:text-xl font-black">Live Monitor</h3>
                    <p className="text-[10px] md:text-xs text-white/40 font-bold">Incoming orders in real-time</p>
                 </div>
              </div>
           </div>

           <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1 z-10">
              <AnimatePresence initial={false}>
                 {liveOrders.map((order, i) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/order"
                    >
                       <div className="flex justify-between items-start mb-1.5">
                          <div>
                             <h4 className="font-bold text-xs tracking-tight">{order.customerName}</h4>
                             <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">#{order.id.slice(-6)}</p>
                          </div>
                          <p className="text-xs font-black text-primary">₹{order.totalAmount.toLocaleString()}</p>
                       </div>
                       <div className="flex items-center justify-between mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            order.status === 'processing' ? 'bg-orange-500/20 text-orange-400' : 
                            order.status === 'packed' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                          }`}>
                             {order.status}
                          </span>
                          <span className="text-[8px] font-bold text-white/20 uppercase">2m ago</span>
                       </div>
                    </motion.div>
                 ))}
              </AnimatePresence>
           </div>

           <button className="mt-5 w-full h-11 bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              All Orders <ArrowUpRight size={12} />
           </button>
        </div>
      </div>

      {/* INVENTORY & BEST SELLERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Inventory Progress Section */}
        <div className="card p-6 md:p-8 space-y-6 md:space-y-8 perf-gpu">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-orange-50 flex items-center justify-center text-primary"><Package size={18} /></div>
                 <div>
                    <h3 className="text-lg md:text-xl font-black text-warm-dark">Inventory Health</h3>
                    <p className="text-[10px] md:text-xs text-foreground-muted font-bold">Stock levels and expiring items</p>
                 </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                 <span className="badge badge-sand text-[10px] font-black uppercase px-2 py-1">{kpis.lowStockCount} LOW STOCK</span>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[
                 { label: 'Healthy', count: inventoryHealth.healthyCount, color: 'bg-green-500', icon: '✅' },
                 { label: 'Critical', count: inventoryHealth.criticalCount, color: 'bg-red-500', icon: '⚠️' },
              ].map(item => (
                <div key={item.label} className="p-4 md:p-5 rounded-2xl md:rounded-[2rem] bg-sand-100/50 border border-border-custom relative group hover:bg-white hover:shadow-lg transition-all">
                   <div className="flex justify-between items-center mb-0.5 md:mb-1">
                      <span className="text-[8px] md:text-[10px] font-black text-foreground-muted uppercase tracking-widest">{item.label}</span>
                      <span className="text-base md:text-lg">{item.icon}</span>
                   </div>
                   <h4 className="text-2xl md:text-3xl font-black text-warm-dark">{item.count}</h4>
                   <p className="text-[8px] md:text-[10px] font-bold text-foreground-muted">Product SKUs</p>
                </div>
              ))}
           </div>

           <div className="space-y-4 pt-2">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground-muted px-1">Movement Categories</h4>
              <div className="space-y-4">
                 {[
                    { name: 'Fruits & Veg', progress: 85, color: 'bg-green-500' },
                    { name: 'Dairy & Eggs', progress: 62, color: 'bg-blue-500' },
                    { name: 'Snacks & Essentials', progress: 45, color: 'bg-primary' },
                 ].map(cat => (
                    <div key={cat.name} className="space-y-1.5 px-1">
                       <div className="flex justify-between text-[10px] md:text-xs font-bold text-warm-dark">
                          <span>{cat.name}</span>
                          <span className="text-foreground-muted">{cat.progress}% CAPACITY</span>
                       </div>
                       <div className="h-2 bg-sand-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${cat.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full ${cat.color} rounded-full`} 
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Top Products Benchmarking */}
        <div className="card p-6 md:p-8 space-y-6 md:space-y-8 perf-gpu">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-9 md:w-10 h-9 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Star size={18} fill="currentColor" /></div>
                 <div>
                    <h3 className="text-lg md:text-xl font-black text-warm-dark">Best Performers</h3>
                    <p className="text-[10px] md:text-xs text-foreground-muted font-bold">Top products by unit sales</p>
                 </div>
              </div>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">View All</button>
           </div>

           <div className="space-y-1.5">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-2xl hover:bg-sand-100 transition-all group">
                   <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-foreground-muted border border-border-custom group-hover:bg-primary group-hover:text-white transition-all shadow-sm shrink-0">
                      {i + 1}
                   </div>
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white p-1.5 overflow-hidden shrink-0 border border-border-custom shadow-inner">
                      <Image 
                        src={p.imageUrl || p.image_url || '/placeholder.png'} 
                        alt={p.name} 
                        width={48} 
                        height={48} 
                        className="w-full h-full object-contain"
                      />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs md:text-sm text-warm-dark truncate">{p.name}</h4>
                      <p className="text-[8px] md:text-[10px] font-bold text-foreground-muted truncate">{p.brand || 'SuperMarket'}</p>
                   </div>
                   <div className="text-right shrink-0">
                      <p className="text-xs md:text-sm font-black text-warm-dark">₹{(p.price ?? p.mrp).toLocaleString()}</p>
                      <p className="text-[9px] md:text-[10px] font-black text-green-500 uppercase tracking-widest">+18%</p>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="pt-4 border-t border-border-custom flex gap-4 md:gap-8">
              <div className="flex-1 flex flex-col items-center gap-0.5 text-center">
                 <p className="text-[8px] md:text-[10px] font-black text-foreground-muted uppercase tracking-widest">Avg Cart Value</p>
                 <span className="text-lg md:text-xl font-black text-warm-dark">₹1,240</span>
              </div>
              <div className="w-px h-10 bg-border-custom" />
              <div className="flex-1 flex flex-col items-center gap-0.5 text-center">
                 <p className="text-[8px] md:text-[10px] font-black text-foreground-muted uppercase tracking-widest">Profit Margin</p>
                 <span className="text-lg md:text-xl font-black text-primary">24.8%</span>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}

