'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore, Product } from '@/lib/store';
import { getInventoryHealth } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

const CAT_BG: Record<string, string> = {
  'fruits-vegetables': 'cat-bg-fruits',
  'dairy-bakery':      'cat-bg-dairy',
  'snacks':            'cat-bg-snacks',
  'beverages':         'cat-bg-beverages',
  'household':         'cat-bg-household',
  'personal-care':     'cat-bg-personal',
  'staples':           'cat-bg-staples',
  'frozen':            'cat-bg-frozen',
  'baby-care':         'cat-bg-baby',
  'meat-seafood':      'cat-bg-meat',
};

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart     = useStore((s) => s.addToCart);
  const addToWishlist = useStore((s) => s.addToWishlist);
  const isInWishlist  = useStore((s) => s.isInWishlist);

  const inWishlist = isInWishlist(product.id);
  const health     = getInventoryHealth(product);
  const oos        = health === 'out_of_stock';
  const imgSrc     = product.imageUrl || product.image_url || '';
  const price      = product.price ?? product.mrp;
  const mrp        = product.mrp ?? price;
  const disc       = product.discountPercent || product.discount_percent || 0;
  const bgClass    = CAT_BG[product.categoryId || product.category_id || ''] || 'cat-bg-default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className={`perf-gpu relative group rounded-[1.75rem] border border-border-custom overflow-hidden flex flex-col ${bgClass} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_-12px_rgba(255,107,0,0.18)] ${oos ? 'opacity-75' : ''}`}
    >
      {/* Discount ribbon */}
      {disc > 0 && <div className="discount-ribbon">{disc}% OFF</div>}

      {/* Wishlist btn */}
      <button
        onClick={(e) => { e.preventDefault(); addToWishlist(product); }}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
          inWishlist ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-warm-gray hover:bg-red-50 hover:text-red-500'
        }`}
      >
        <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block p-4 pb-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className={`object-contain transition-transform duration-500 group-hover:scale-105 ${oos ? 'grayscale-[40%]' : ''}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm text-warm-dark text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Eye size={12} /> Quick View
              </div>
            </div>
          </div>
          {/* Out of stock overlay */}
          {oos && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
              <span className="badge badge-red">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col px-4 pb-4 gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-muted truncate">
            {product.brand || product.made_by}
          </p>
          <Link href={`/product/${product.slug}`} prefetch={true}>
            <h3 className="text-sm font-bold text-warm-dark leading-tight mt-0.5 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-foreground-muted mt-0.5">{product.weight}{product.unit}</p>
        </div>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  size={10}
                  className={s <= Math.round(product.rating) ? 'text-orange-400 fill-orange-400' : 'text-sand-300 fill-sand-300'}
                />
              ))}
            </div>
            <span className="text-[10px] text-foreground-muted font-medium">({product.reviewCount?.toLocaleString()})</span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-black text-warm-dark">₹{price}</span>
          {mrp > price && (
            <span className="text-xs text-foreground-muted line-through font-medium">₹{mrp}</span>
          )}
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={oos}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
          className={`mt-auto w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all border ${
            oos
              ? 'bg-sand-100 text-foreground-muted border-border-custom cursor-not-allowed'
              : 'bg-white border-border-custom hover:bg-primary hover:text-white hover:border-primary hover:shadow-md shadow-sm text-warm-dark'
          }`}
        >
          {oos ? (
            'Notify Me'
          ) : (
            <><ShoppingCart size={14} /> Add to Cart</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
