'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  MoreVertical, 
  ChevronRight, 
  ArrowUpDown,
  History,
  Tag,
  LayoutGrid,
  List,
  AlertTriangle,
  Archive,
  RefreshCw,
  Eye
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, getInventoryHealth } from '@/lib/data';

export default function AdminProductsPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');

  const filteredItems = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory || p.category_id === selectedCategory;
      const health = getInventoryHealth(p);
      const matchHealth = healthFilter === 'all' || health === healthFilter;
      return matchSearch && matchCat && matchHealth;
    });
  }, [searchQuery, selectedCategory, healthFilter]);

  return (
    <div className="space-y-10 pb-20 px-2 lg:px-6">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 text-primary mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Package size={16} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Lifecycle Management</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-warm-dark tracking-tight">Inventory</h1>
           <p className="text-foreground-muted font-bold text-sm mt-1 max-w-sm">Manage {PRODUCTS.length} total SKU active in your store.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all">
              <Plus size={18} /> New Product
           </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Live SKU', val: PRODUCTS.length, sub: 'Across 12 cats', icon: Package, color: 'blue' },
           { label: 'Out of Stock', val: PRODUCTS.filter(p => p.stock === 0).length, sub: 'Needs attention', icon: AlertTriangle, color: 'red' },
           { label: 'Low Stock', val: PRODUCTS.filter(p => p.stock > 0 && p.stock <= 10).length, sub: 'Reorder soon', icon: History, color: 'orange' },
           { label: 'Archived', val: 0, sub: 'Inactive items', icon: Archive, color: 'sand' },
         ].map(s => (
            <div key={s.label} className="card p-5 border-none shadow-sm hover:shadow-md transition-all group">
               <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 flex items-center justify-center text-${s.color}-600 group-hover:scale-110 transition-transform mb-3`}><s.icon size={18} /></div>
               <h4 className="text-2xl font-black text-warm-dark">{s.val}</h4>
               <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest">{s.label}</p>
            </div>
         ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white border border-border-custom p-3 rounded-[2rem] shadow-sm">
         <div className="relative flex-1 group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted group-focus-within:text-primary transition-colors cursor-pointer"><Search size={18} /></div>
            <input 
              type="text" 
              placeholder="Search by SKU name, brand or tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-sand-100/50 border border-transparent rounded-2xl outline-none focus:border-primary/20 focus:bg-white focus:ring-4 focus:ring-primary/8 transition-all font-bold text-sm" 
            />
         </div>
         
         <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-4 pr-10 py-3.5 bg-white border border-border-custom rounded-2xl outline-none focus:border-primary font-bold text-sm min-w-[160px] appearance-none cursor-pointer"
            >
               <option value="all">All Categories</option>
               {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select 
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="pl-4 pr-10 py-3.5 bg-white border border-border-custom rounded-2xl outline-none focus:border-primary font-bold text-sm min-w-[160px] appearance-none cursor-pointer"
            >
               <option value="all">Any Health</option>
               <option value="healthy">✅ Healthy</option>
               <option value="low">⚠️ Low Stock</option>
               <option value="out_of_stock">❌ Out of Stock</option>
            </select>
            
            <div className="h-10 w-px bg-border-custom mx-2 hidden md:block" />
            
            <div className="flex bg-sand-100 p-1 rounded-xl">
               <button 
                 onClick={() => setViewMode('table')}
                 className={`p-2.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'text-warm-gray hover:bg-white/50'}`}
               >
                 <List size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-warm-gray hover:bg-white/50'}`}
               >
                 <LayoutGrid size={18} />
               </button>
            </div>
         </div>
      </div>

      {/* Products Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card p-0 overflow-hidden shadow-xl shadow-primary/5"
          >
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-sand-100/50 border-b border-border-custom">
                         <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Product Item</th>
                         <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Category</th>
                         <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Price & MRP</th>
                         <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted">Inventory</th>
                         <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-foreground-muted text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody>
                      {filteredItems.map(p => {
                         const health = getInventoryHealth(p);
                         return (
                           <tr key={p.id} className="border-b border-border-custom hover:bg-cream-100/30 transition-colors group">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-sand-100 border border-border-custom p-1.5 flex items-center justify-center shrink-0">
                                       <img src={p.imageUrl || p.image_url} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-sm font-black text-warm-dark truncate">{p.name}</p>
                                       <p className="text-[10px] font-black text-foreground-muted uppercase tracking-widest italic">{p.brand} · {p.weight}{p.unit}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className="badge badge-sand text-[10px] font-black uppercase">{p.categoryId || p.category_id}</span>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="space-y-0.5">
                                    <p className="text-sm font-black text-warm-dark">₹{p.price ?? p.mrp}</p>
                                    {p.mrp > p.price && <p className="text-[10px] text-foreground-muted line-through font-bold">₹{p.mrp}</p>}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                       <span className={`w-2 h-2 rounded-full ${health === 'healthy' ? 'bg-green-500' : health === 'low' ? 'bg-orange-500' : 'bg-red-500'}`} />
                                       <span className="text-xs font-black text-warm-dark">{p.stock} in stock</span>
                                    </div>
                                    <div className="w-24 h-1.5 bg-sand-200 rounded-full overflow-hidden">
                                       <div className={`h-full ${health === 'healthy' ? 'bg-green-500' : health === 'low' ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }} />
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2.5 rounded-xl bg-white border border-border-custom text-warm-gray hover:text-primary transition-all shadow-sm"><Edit3 size={16} /></button>
                                    <button className="p-2.5 rounded-xl bg-white border border-border-custom text-warm-gray hover:text-primary transition-all shadow-sm"><Eye size={16} /></button>
                                    <button className="p-2.5 rounded-xl bg-white border border-border-custom text-warm-gray hover:text-red-500 transition-all shadow-sm"><Trash2 size={16} /></button>
                                 </div>
                              </td>
                           </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
             {filteredItems.length === 0 && (
                <div className="py-20 text-center space-y-3">
                   <div className="w-16 h-16 bg-sand-100 rounded-full flex items-center justify-center mx-auto text-warm-gray"><RefreshCw size={24} /></div>
                   <p className="text-sm font-black text-warm-dark">No products matching your filters.</p>
                   <button onClick={() => {setSearchQuery(''); setHealthFilter('all'); setSelectedCategory('all');}} className="text-xs font-bold text-primary underline">Clear all filters</button>
                </div>
             )}
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
             {filteredItems.map(p => {
               const health = getInventoryHealth(p);
               return (
                  <div key={p.id} className="card p-3 relative group">
                     <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 rounded-lg bg-white shadow-lg flex items-center justify-center text-warm-gray hover:text-primary"><Edit3 size={12} /></button>
                        <button className="w-8 h-8 rounded-lg bg-white shadow-lg flex items-center justify-center text-warm-gray hover:text-red-500"><Trash2 size={12} /></button>
                     </div>
                     <div className="aspect-square bg-sand-100 rounded-xl mb-3 relative overflow-hidden p-3 flex items-center justify-center border border-border-custom">
                        <img src={p.imageUrl || p.image_url} alt="" className="w-full h-full object-contain" />
                        <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-black text-white ${health === 'healthy' ? 'bg-green-500' : health === 'low' ? 'bg-orange-500' : 'bg-red-500'}`}>{p.stock} STOCK</div>
                     </div>
                     <h4 className="text-xs font-black text-warm-dark line-clamp-1">{p.name}</h4>
                     <p className="text-xs font-black text-primary mt-1">₹{p.price ?? p.mrp}</p>
                  </div>
               );
             })}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
