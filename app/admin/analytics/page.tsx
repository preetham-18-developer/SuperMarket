'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Zap, 
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Filter,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell
} from 'recharts';

const SALES_DATA = [
  { month: 'Jan', revenue: 45000, orders: 320, profit: 12000 },
  { month: 'Feb', revenue: 52000, orders: 380, profit: 15000 },
  { month: 'Mar', revenue: 48000, orders: 350, profit: 13500 },
  { month: 'Apr', revenue: 61000, orders: 420, profit: 18000 },
  { month: 'May', revenue: 59000, orders: 410, profit: 17200 },
  { month: 'Jun', revenue: 75000, orders: 530, profit: 22500 },
];

const CATEGORY_PERFORMANCE = [
  { name: 'Fruits & Veg', value: 35000, color: '#4CAF50' },
  { name: 'Dairy & Bakery', value: 28000, color: '#FFC107' },
  { name: 'Beverages', value: 22000, color: '#2196F3' },
  { name: 'Snacks', value: 18000, color: '#FF5722' },
  { name: 'Household', value: 12000, color: '#9C27B0' },
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');

  return (
    <div className="space-y-10 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><BarChart3 size={16} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Business Intelligence</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-warm-dark tracking-tight">Analytics</h1>
           <p className="text-foreground-muted font-bold text-sm mt-1 max-w-sm">Deeper insights into your sales velocity and inventory turns.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex bg-white border border-border-custom px-2 py-2 rounded-2xl shadow-sm">
              {['1m', '3m', '6m', '1y'].map(t => (
                <button 
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-warm-gray hover:bg-sand-100'}`}
                >
                  {t}
                </button>
              ))}
           </div>
           <button className="flex items-center gap-2 px-6 py-3.5 bg-warm-dark text-white rounded-2xl font-black text-sm shadow-xl hover:bg-black transition-all">
              <FileText size={18} /> Deep Report
           </button>
        </div>
      </div>

      {/* Advanced Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Net Revenue', val: '₹4.82M', change: '+24%', isPos: true, icon: DollarSign, color: 'primary' },
           { label: 'Avg Order Value', val: '₹1,240', change: '+8%', isPos: true, icon: ShoppingBag, color: 'blue' },
           { label: 'Total Orders', val: '12,840', change: '+15%', isPos: true, icon: Zap, color: 'indigo' },
           { label: 'Net Profit Margin', val: '24.8%', change: '-2%', isPos: false, icon: TrendingDown, color: 'orange' },
         ].map((s, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="card p-6 flex flex-col justify-between h-[180px] group border-none shadow-sm shadow-primary/5 hover:shadow-md transition-all bg-white overflow-hidden relative"
            >
               <div className="flex justify-between items-start z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 group-hover:scale-110 transition-transform`}><s.icon size={22} /></div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.isPos ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                     {s.isPos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                     {s.change}
                  </div>
               </div>
               
               <div className="z-10">
                  <h4 className="text-3xl font-black text-warm-dark tracking-tighter leading-none">{s.val}</h4>
                  <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest mt-2">{s.label}</p>
               </div>
               
               <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.07] transition-all -rotate-12 grayscale">
                  <s.icon size={96} />
               </div>
            </motion.div>
         ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="card p-8 h-[480px] flex flex-col bg-white border border-border-custom shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3 text-warm-dark">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><TrendingUp size={20} /></div>
                  <div>
                     <h3 className="text-xl font-black tracking-tight text-warm-dark">Revenue Trajectory</h3>
                     <p className="text-xs font-bold text-foreground-muted">Monthly earnings and profit distribution</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-[10px] font-black uppercase text-foreground-muted">Revenue</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warm-dark" /><span className="text-[10px] font-black uppercase text-foreground-muted">Profit</span></div>
               </div>
            </div>
            <div className="flex-1 w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_DATA}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.4} />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#A0AEC0' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#A0AEC0' }} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '1.25rem', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                     />
                     <Area type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                     <Area type="monotone" dataKey="profit" stroke="#2D211F" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card p-8 h-[480px] flex flex-col bg-white border border-border-custom shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><PieIcon size={20} /></div>
                  <div className="text-warm-dark">
                     <h3 className="text-xl font-black tracking-tight text-warm-dark">Market Segment Shares</h3>
                     <p className="text-xs font-bold text-foreground-muted">Product category performance distribution</p>
                  </div>
               </div>
               <button className="p-3 bg-sand-100 rounded-xl text-warm-gray hover:bg-white transition-all shadow-sm"><Filter size={16} /></button>
            </div>
            <div className="flex-1 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CATEGORY_PERFORMANCE} layout="vertical">
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#2D211F' }} width={120} />
                     <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                     />
                     <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                        {CATEGORY_PERFORMANCE.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
}
