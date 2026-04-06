'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, PRODUCTS, CATEGORIES } from '@/lib/store';
import {
  ArrowRight, Sparkles, ChevronLeft, ChevronRight,
  Truck, ShieldCheck, Clock, Star, Zap
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import {
  BANNERS,
  getFeaturedProducts, getBestSellers, getDeals, getNewArrivals
} from '@/lib/data';
import dynamic from 'next/dynamic';
const IntroAnimation = dynamic(() => import('@/components/IntroAnimation').then((mod) => mod.IntroAnimation), { ssr: false });
import useSWR from 'swr';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';
import { getActiveProducts } from '@/lib/api-client';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      delay: i * 0.08, 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] as any 
    } 
  }),
};

// ── SWR FETCHER ──
const productFetcher = (key: string) => {
  const [_, catId] = key.split(':');
  return getActiveProducts({ category: catId === 'all' ? undefined : catId, limit: 12 });
};

export default function Home() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const introShown = useStore((s) => s.introShown);
  const setIntroShown = useStore((s) => s.setIntroShown);

  // ── SWR FOR CATEGORY BROWSING (PHASE 6: UX Optimization) ──
  const { data: categoryProducts, error, isLoading } = useSWR(
    `products:${activeCategory}`, 
    productFetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );

  const handleIntroComplete = () => {
    setIntroShown(true);
  };

  // Auto-advance hero banner
  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const featuredProducts = getFeaturedProducts().slice(0, 8);
  const bestSellers      = getBestSellers().slice(0, 8);
  const deals            = getDeals().slice(0, 8);
  const newArrivals      = getNewArrivals().slice(0, 4);

  const banner = BANNERS[bannerIdx];

  return (
    <>
      <AnimatePresence>
        {!introShown && (
          <div className="fixed inset-0 z-[9999]">
            <IntroAnimation onComplete={handleIntroComplete} />
          </div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: !introShown ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-20 pb-24 no-scroll-jank"
      >


      {/* ─── HERO BANNER ──────────────────────────── */}
      <section className="relative h-[340px] md:h-[480px] rounded-[2.5rem] overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${banner.bgFrom} 0%, ${banner.bgTo} 100%)` }}
          >
            <div className="absolute inset-0">
              <Image 
                src={banner.image} 
                alt={banner.title} 
                fill 
                priority={bannerIdx === 0}
                className="object-cover mix-blend-overlay opacity-25" 
                sizes="100vw" 
              />
            </div>
            <div className="hero-overlay" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold border border-white/20 mb-4 w-fit"
              >
                <Sparkles size={12} /> {banner.badge}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4"
              >
                {banner.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-base md:text-lg mb-8 leading-relaxed max-w-md"
              >
                {banner.subtitle}
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Link href={banner.ctaLink}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-white text-warm-dark px-7 py-3.5 rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all"
                  >
                    {banner.cta} <ArrowRight size={18} />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {BANNERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setBannerIdx(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === bannerIdx ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
                />
              ))}
            </div>

            {/* Nav arrows */}
            <button
              onClick={() => setBannerIdx((bannerIdx - 1 + BANNERS.length) % BANNERS.length)}
              style={{ touchAction: 'manipulation' }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 active:bg-white/50 transition-all z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setBannerIdx((bannerIdx + 1) % BANNERS.length)}
              style={{ touchAction: 'manipulation' }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 active:bg-white/50 transition-all z-10"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ─── CATEGORY SHORTCUTS ───────────────────── */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you need</p>
          </div>
          <Link href="/products" className="btn-ghost text-sm">View All <ArrowRight size={16} /></Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              prefetch={true}
            >
              <motion.div
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 bg-white border-border-custom text-warm-gray hover:border-primary/30 hover:bg-cream-200 cursor-pointer h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-sand-100 flex items-center justify-center text-2xl group-hover:bg-white transition-colors">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-black leading-tight text-center uppercase tracking-tighter">{cat.name.split(' ')[0]}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── TODAY'S DEALS ─────────────────────────── */}
      <section className="space-y-6 content-visibility-auto">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <div>
              <h2 className="section-title">Today&apos;s Deals</h2>
              <p className="section-subtitle">Limited-time offers, grab them fast</p>
            </div>
          </div>
          <Link href="/products?tag=deals" className="btn-ghost text-sm">See All <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {deals.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─────────────────────── */}
      <section className="space-y-6 content-visibility-auto">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Curated picks from our team</p>
          </div>
          <Link href="/products" className="btn-ghost text-sm">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ─── MID PROMO BANNER ──────────────────────── */}
      <section className="relative rounded-[2rem] overflow-hidden bg-espresso px-8 md:px-16 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <span className="badge badge-orange">🌟 Loyalty Programme</span>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight" style={{ fontFamily: 'Times New Roman, serif' }}>Earn points on every order</h2>
          <p className="text-white/60 leading-relaxed">Join Supermarket Plus and get exclusive early access to deals, priority delivery, and up to 5% cashback on every purchase.</p>
          <Link href="/signup">
            <motion.button whileHover={{ scale: 1.04 }} className="btn-primary">
              Join for Free <ArrowRight size={16} />
            </motion.button>
          </Link>
        </div>
        <div className="hidden md:flex items-center justify-center text-[8rem]">🛒</div>
      </section>

      {/* ─── BEST SELLERS ──────────────────────────── */}
      <section className="space-y-6 content-visibility-auto">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <Star size={18} className="text-primary fill-primary" />
            </div>
            <div>
              <h2 className="section-title">Best Sellers</h2>
              <p className="section-subtitle">Most ordered this week</p>
            </div>
          </div>
          <Link href="/products?tag=best-sellers" className="btn-ghost text-sm">See All <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ─── BROWSE BY CATEGORY (filtered grid) ──── */}
      <section id="browse-products" className="space-y-6 pt-10 border-t border-border-custom/50">
        <div>
          <h2 className="section-title">Browse All Products</h2>
          <p className="section-subtitle">Filter by category to find what you need</p>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            style={{ touchAction: 'manipulation' }}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-warm-gray border-border-custom hover:border-primary/40 hover:text-primary'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{ touchAction: 'manipulation' }}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-warm-gray border-border-custom hover:border-primary/40 hover:text-primary'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : (
              categoryProducts?.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </motion.div>
        </AnimatePresence>
        {activeCategory !== 'all' && !isLoading && categoryProducts?.length === 0 && (
          <div className="text-center py-16 text-foreground-muted">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-bold">No products found in this category yet.</p>
          </div>
        )}
      </section>

      {/* ─── WHY SHOP WITH US ──────────────────────── */}
      <section className="bg-cream-200 rounded-[2rem] p-8 md:p-14 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="section-title">Why Supermarket?</h2>
          <p className="section-subtitle">We&apos;re not just a store — we&apos;re your kitchen partner</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Truck size={24} className="text-primary" />, title: 'Express Delivery', desc: 'Fresh groceries delivered in 15-30 minutes to your door.' },
            { icon: <ShieldCheck size={24} className="text-primary" />, title: 'Quality Guarantee', desc: 'Every product is quality-checked before it reaches you.' },
            { icon: <Clock size={24} className="text-primary" />, title: 'Always Open', desc: 'Shop 24/7, 365 days a year. We never close.' },
            { icon: <Star size={24} className="text-primary" fill="#ff6b00" />, title: 'Premium Selection', desc: 'Hand-picked products from trusted brands and farms.' },
          ].map((item, i) => (
            <div
              key={i}
              className="card p-6 text-center space-y-3"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto">{item.icon}</div>
              <h3 className="font-black text-warm-dark">{item.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FRESH ARRIVALS ────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Fresh Arrivals</h2>
            <p className="section-subtitle">Just landed in our store</p>
          </div>
          <Link href="/products?tag=fresh" className="btn-ghost text-sm">See All <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="section-title">What our shoppers say</h2>
          <p className="section-subtitle">Trusted by 12,000+ happy customers</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Priya M.', city: 'Nellore', rating: 5, text: 'Freshest produce I\'ve ever had delivered. The mangoes were absolutely incredible — tasted like they were just picked!' },
            { name: 'Arjun S.', city: 'Bangalore', rating: 5, text: 'Orders arrive in under 20 minutes. The quality is consistently premium and the app is so easy to use.' },
            { name: 'Kavya R.', city: 'Hyderabad', rating: 5, text: 'Supermarket has completely replaced my weekly trips. Everything I need, delivered before I even miss it.' },
          ].map((t, i) => (
            <div
              key={i}
              className="card p-6 space-y-4"
            >
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className={s <= t.rating ? 'text-orange-400 fill-orange-400' : 'text-sand-300'} />
                ))}
              </div>
              <p className="text-sm text-foreground-muted leading-relaxed italic">&quot;{t.text}&quot;</p>
              <div>
                <p className="font-bold text-warm-dark text-sm">{t.name}</p>
                <p className="text-xs text-foreground-muted">{t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      </motion.div>
    </>
  );
}

