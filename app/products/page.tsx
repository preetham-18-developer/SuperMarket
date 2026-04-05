'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  X, 
  Grid2X2, 
  List, 
  Search,
  ArrowUpDown,
  SlidersHorizontal,
  LayoutGrid,
  ShoppingBag,
  Star
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import dynamic from 'next/dynamic';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { ProductSkeleton } from '@/components/ui/Skeleton';

// Performance: Dynamically load the virtual grid only on client
const VirtualProductGrid = dynamic(() => import('@/components/VirtualProductGrid'), { 
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  )
});

function ProductsContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchQuery, 300); // 300ms debounce for zero-lag feeling
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedTag(searchParams.get('tag') || 'all');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = !debouncedSearch || 
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.brand.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        product.categoryId === selectedCategory || 
        product.category_id === selectedCategory;
        
      const matchesTag = selectedTag === 'all' || 
        (selectedTag === 'deals' && (product.discountPercent > 0 || (product.discount_percent ?? 0) > 0)) ||
        (selectedTag === 'fresh' && ((product as any).isNew || product.bestSeller)) ||
        (selectedTag === 'best-sellers' && product.rating >= 4.5);
      
      const currentPrice = product.price ?? product.mrp;
      const matchesPrice = currentPrice >= priceRange[0] && currentPrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesTag && matchesPrice && product.status === 'active';
    }).sort((a, b) => {
      const priceA = a.price ?? a.mrp;
      const priceB = b.price ?? b.mrp;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [debouncedSearch, selectedCategory, selectedTag, sortBy, priceRange]);

  if (!mounted) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-8 perf-gpu no-scroll-jank">
      {/* Search & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 flex-1 max-w-xl">
          <h1 className="text-3xl md:text-5xl font-black text-warm-dark tracking-tight">
            {selectedCategory === 'all' 
              ? debouncedSearch ? `Search: "${debouncedSearch}"` : 'All Products'
              : CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Products'
            }
          </h1>
          <div className="relative group overflow-hidden rounded-2xl border border-border-custom bg-white transition-all focus-within:ring-4 focus-within:ring-primary/10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Instant search products..."
              className="w-full pl-12 pr-4 py-4 outline-none text-sm font-bold bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all font-black text-sm uppercase tracking-wider ${showFilters ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-border-custom text-warm-dark shadow-soft hover:border-primary/40'}`}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-4 bg-white border border-border-custom rounded-2xl outline-none font-black text-sm uppercase tracking-wider shadow-soft cursor-pointer appearance-none min-w-[200px]"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low</option>
            <option value="price-high">Price: High</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        <AnimatePresence>
          {showFilters && (
            <motion.aside 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:w-72 w-full space-y-8 sticky top-28"
            >
              <div className="card-minimal p-6 space-y-4">
                <h3 className="text-xs font-black uppercase text-foreground-muted tracking-widest">Explore Categories</h3>
                <div className="space-y-1.5 max-h-[40vh] overflow-y-auto scrollbar-hide pr-1">
                  <button onClick={() => setSelectedCategory('all')} className={`pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}>All</button>
                  {CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setSelectedCategory(c.id)} className={`pill-btn ${selectedCategory === c.id ? 'active' : ''}`}>
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-minimal p-6 space-y-4">
                <h3 className="text-xs font-black uppercase text-foreground-muted tracking-widest">Price Limit (₹)</h3>
                <input type="range" min="0" max="2000" step="50" value={priceRange[1]} onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} className="w-full accent-primary h-2 bg-sand-200 rounded-full" />
                <div className="flex justify-between font-black text-xs text-warm-dark">
                  <span>₹0</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 min-w-0">
          {filteredProducts.length > 0 ? (
            <div className="min-h-[1000px]">
              <VirtualProductGrid products={filteredProducts} viewMode={viewMode} />
            </div>
          ) : (
            <div className="py-32 text-center card-minimal">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-2xl font-black text-warm-dark">No Products Found</h3>
              <p className="text-foreground-muted font-bold">Try adjusting your filters or search query.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-black">SYSTEM LOADING...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

