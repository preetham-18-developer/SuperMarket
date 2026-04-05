'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import {
  Search, ShoppingCart, Heart, MapPin, ChevronDown,
  Menu, X, User, Tag, Zap, Clock, Bell, Package, Truck, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useDebounce } from '@/lib/hooks/useDebounce';

export default function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<typeof PRODUCTS>([]);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const totalItems = useStore((s) => s.totalItems());
  const wishlist = useStore((s) => s.wishlist);
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const user = useStore((s) => s.user);
  const setCartDrawerOpen = useStore((s) => s.setCartDrawerOpen);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Search logic
  useEffect(() => {
    if (debouncedSearch.trim().length > 1) {
      const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
        p.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
      ).slice(0, 8);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'All Products' },
    { href: '/products?tag=deals', label: 'Today\'s Deals', accent: true },
    { href: '/products?tag=fresh', label: 'Fresh Arrivals' },
  ];

  return (
    <>
      {/* Top Banner - Refining for better visual flow */}
      <div className="bg-espresso text-white py-2 shadow-sm border-b border-white/5 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex justify-between items-center text-[10px] sm:text-xs font-black uppercase tracking-widest leading-none">
          <div className="flex items-center gap-2 opacity-80 decoration-primary hover:opacity-100 transition-opacity">
            <Truck size={14} className="text-primary" /> 
            <span>Free delivery <span className="text-primary">over ₹499</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-1 bg-white/5 rounded-full border border-white/10 hover:border-primary/40 transition-colors">
               <Star size={10} className="text-orange-400" fill="currentColor" />
               <span>Use <span className="text-primary italic font-black">MARKET20</span> for 20% OFF</span>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Same-Day Delivery <span className="text-green-500">Active</span></span>
          </div>
        </div>
      </div>

      <header
        className={`
          sticky top-0 left-0 right-0 z-50
          transition-all duration-300 perf-gpu
          ${scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-border-custom'
            : 'bg-cream-100/90 backdrop-blur-md border-b border-transparent'
          }
        `}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          {/* Main row */}
          <div className="h-16 flex items-center gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group mr-2">
              <div className="relative w-9 h-9 bg-primary-gradient rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                <ShoppingCart size={18} className="text-white" strokeWidth={2.5} />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-300 rounded-full border-2 border-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-lg leading-none tracking-tight text-warm-dark" style={{ fontFamily: 'Times New Roman, serif' }}>
                  Super<span className="text-primary">market</span>
                </div>
                <div className="text-[9px] font-semibold text-foreground-muted tracking-widest uppercase leading-none">
                  Premium Groceries
                </div>
              </div>
            </Link>

            {/* Category dropdown */}
            <div className="relative hidden lg:block shrink-0">
              <button
                onMouseEnter={() => setCatDropOpen(true)}
                onMouseLeave={() => setCatDropOpen(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sand-100 hover:bg-orange-50 border border-border-custom text-sm font-semibold text-warm-dark transition-all"
              >
                <Menu size={15} />
                Categories
                <ChevronDown size={13} className={`transition-transform ${catDropOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {catDropOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    onMouseEnter={() => setCatDropOpen(true)}
                    onMouseLeave={() => setCatDropOpen(false)}
                    className="absolute top-full left-0 mt-2 w-72 bg-surface rounded-2xl shadow-xl border border-border-custom overflow-hidden z-50 p-2"
                  >
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        prefetch={true}
                        onClick={() => setCatDropOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-cream-200 transition-all group"
                      >
                        <span className="text-xl w-8 text-center">{cat.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-warm-dark group-hover:text-primary transition-colors">{cat.name}</div>
                          <div className="text-xs text-foreground-muted">{cat.productCount} items</div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search bar */}
            <div ref={searchRef} className="flex-1 max-w-2xl relative hidden sm:block">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-border-strong focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/8 transition-all shadow-sm">
                  <Search size={17} className="text-foreground-muted shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Search groceries, brands, categories…"
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-warm-dark placeholder:text-foreground-muted/60"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                      className="text-foreground-muted hover:text-primary transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </form>

              {/* Search results dropdown */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-2xl shadow-xl border border-border-custom overflow-hidden z-50"
                  >
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-cream-200 transition-all border-b border-border-custom last:border-0"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sand-100 relative overflow-hidden shrink-0">
                          <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-warm-dark truncate">{p.name}</div>
                          <div className="text-xs text-foreground-muted">{p.brand} · {p.category}</div>
                        </div>
                        <div className="text-sm font-bold text-primary shrink-0">₹{p.price}</div>
                      </Link>
                    ))}
                    <div className="px-4 py-2.5 bg-sand-100 border-t border-border-custom">
                      <button
                        onClick={() => { router.push(`/products?search=${searchQuery}`); setSearchQuery(''); setSearchResults([]); }}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        See all results for "{searchQuery}"
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Delivery location */}
            <button className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-sand-100 border border-border-custom hover:border-primary/30 transition-all shrink-0 text-left">
              <MapPin size={15} className="text-primary shrink-0" />
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-foreground-muted">Deliver to</div>
                <div className="text-xs font-semibold text-warm-dark leading-tight">Nellore, 524001</div>
              </div>
              <ChevronDown size={12} className="text-foreground-muted" />
            </button>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto">

              {/* Offers */}
              <Link href="/products?tag=deals"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-all">
                <Tag size={15} />
                <span className="hidden lg:block">Offers</span>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist"
                className="relative p-2 rounded-xl hover:bg-sand-200 transition-all">
                <Heart size={20} className="text-warm-gray" />
                {mounted && wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex items-center gap-2 pl-3 pr-4 py-2 bg-primary text-white rounded-xl shadow-sm shadow-primary/20 hover:bg-primary-hover transition-all ml-1"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:block text-sm font-bold">Cart</span>
                {mounted && totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-primary text-[10px] font-black rounded-full flex items-center justify-center border-2 border-primary shadow-sm"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Auth */}
              {mounted && isLoggedIn ? (
                <Link href="/account"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-sand-200 transition-all ml-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User size={16} className="text-primary" />
                  </div>
                  <span className="hidden lg:block text-sm font-semibold text-warm-dark max-w-[80px] truncate">
                    {user?.name.split(' ')[0]}
                  </span>
                  {user?.loyaltyPoints !== undefined && (
                    <div className="hidden xl:flex flex-col items-start leading-none ml-1">
                      <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Points</span>
                      <span className="text-[11px] font-black text-warm-dark">{user.loyaltyPoints}</span>
                    </div>
                  )}
                </Link>
              ) : (
                <Link href="/login"
                  className="hidden md:flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-xl border border-border-strong text-sm font-semibold text-warm-dark hover:border-primary hover:text-primary transition-all ml-1">
                  <User size={16} />
                  Sign In
                </Link>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-sand-200 transition-all ml-1"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Sub-nav links */}
          <div className="hidden lg:flex items-center gap-6 pb-2.5 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold whitespace-nowrap transition-colors pb-1 border-b-2 border-transparent hover:text-primary hover:border-primary ${link.accent ? 'text-primary' : 'text-warm-gray'}`}
              >
                {link.label}
              </Link>
            ))}
            {CATEGORIES.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                prefetch={true}
                className="text-sm font-semibold text-warm-gray whitespace-nowrap hover:text-primary pb-1 border-b-2 border-transparent hover:border-primary transition-all"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden bg-surface border-t border-border-custom overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="flex items-center gap-2 px-4 py-3 bg-sand-100 rounded-xl border border-border-custom">
                    <Search size={16} className="text-foreground-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products…"
                      className="flex-1 bg-transparent outline-none text-sm font-medium"
                    />
                  </div>
                </form>

                {[
                  { href: '/', label: 'Home', icon: '🏠' },
                  { href: '/products', label: 'All Products', icon: '🛒' },
                  { href: '/products?tag=deals', label: "Today's Deals", icon: '🏷️' },
                  { href: '/wishlist', label: 'Wishlist', icon: '❤️' },
                  { href: '/account', label: 'My Account', icon: '👤', extra: user?.loyaltyPoints ? `${user.loyaltyPoints} Pts` : null },
                  { href: '/orders', label: 'My Orders', icon: '📦' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-cream-200 font-semibold text-warm-dark transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span> {item.label}
                    </div>
                    {item.extra && <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">{item.extra}</span>}
                  </Link>
                ))}

                <div className="pt-2 border-t border-border-custom">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted px-3 mb-2">Categories</p>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        prefetch={true}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-cream-200 text-sm font-semibold text-warm-dark transition-all"
                      >
                        <span>{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {!isLoggedIn && (
                  <div className="pt-2 border-t border-border-custom flex gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 py-3 rounded-xl border border-border-strong font-bold text-sm text-center text-warm-dark hover:border-primary hover:text-primary transition-all">
                      Sign In
                    </Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}
                      className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm text-center shadow-sm hover:bg-primary-hover transition-all">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
