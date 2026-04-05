'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag, Truck } from 'lucide-react';
import { useStore } from '@/lib/store';

interface CartDrawerProps {
  open: boolean;
}

export default function CartDrawer({ open }: CartDrawerProps) {
  const cart = useStore((s) => s.cart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const subtotal = useStore((s) => s.subtotal());
  const deliveryFee = useStore((s) => s.deliveryFee());
  const totalPrice = useStore((s) => s.totalPrice());
  const couponDiscount = useStore((s) => s.couponDiscount);
  const setCartDrawerOpen = useStore((s) => s.setCartDrawerOpen);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          className="cart-drawer z-[100]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border-custom">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={20} className="text-primary" />
              <h2 className="font-black text-lg text-warm-dark">Your Cart</h2>
              {cart.length > 0 && (
                <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="w-9 h-9 rounded-xl hover:bg-sand-200 flex items-center justify-center transition-all text-warm-gray"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free delivery banner */}
          {subtotal > 0 && subtotal < 499 && (
            <div className="mx-4 mt-4 px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-100 flex items-center gap-2">
              <Truck size={15} className="text-primary shrink-0" />
              <p className="text-xs font-semibold text-warm-dark">
                Add <span className="text-primary font-bold">₹{499 - subtotal}</span> more for free delivery!
              </p>
            </div>
          )}
          {subtotal >= 499 && (
            <div className="mx-4 mt-4 px-4 py-2.5 rounded-xl bg-green-50 border border-green-100 flex items-center gap-2">
              <Truck size={15} className="text-green-600 shrink-0" />
              <p className="text-xs font-semibold text-green-700">🎉 You've got free delivery!</p>
            </div>
          )}

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-3xl bg-sand-100 flex items-center justify-center text-4xl">
                    🛒
                  </div>
                  <div>
                    <p className="font-black text-warm-dark">Your cart is empty</p>
                    <p className="text-sm text-foreground-muted mt-1">Add some fresh groceries!</p>
                  </div>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="btn-primary text-sm"
                  >
                    Browse Products
                  </button>
                </motion.div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-border-custom hover:border-primary/20 transition-all"
                  >
                    {/* Image */}
                    <div className="relative w-14 h-14 rounded-xl bg-sand-100 overflow-hidden shrink-0">
                      <Image
                        src={item.imageUrl || item.image_url || ''}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-warm-dark truncate leading-tight">{item.name}</p>
                      <p className="text-xs text-foreground-muted">{item.weight}{item.unit}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-black text-primary">₹{(item.price ?? item.mrp) * item.quantity}</span>
                           {item.discountPercent > 0 && item.quantity === 1 && (
                              <span className="text-xs text-foreground-muted line-through">₹{item.mrp}</span>
                           )}
                        </div>
                        {item.quantity > 1 && (
                           <span className="text-[10px] font-bold text-foreground-muted">₹{item.price ?? item.mrp} / unit</span>
                        )}
                      </div>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1 bg-sand-100 rounded-xl p-0.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-all text-warm-gray"
                      >
                        {item.quantity === 1 ? <Trash2 size={13} className="text-red-400" /> : <Minus size={13} />}
                      </button>
                      <span className="w-6 text-center text-sm font-black text-warm-dark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white transition-all text-warm-gray"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Footer — totals + CTA */}
          {cart.length > 0 && (
            <div className="border-t border-border-custom px-5 py-5 space-y-4 bg-sand-100/50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-warm-gray font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-warm-dark">₹{subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span className="flex items-center gap-1"><Tag size={13} /> Coupon discount</span>
                    <span>− ₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-warm-gray font-medium">
                  <span>Delivery fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-bold' : 'font-bold text-warm-dark'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-warm-dark text-base pt-2 border-t border-border-custom">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice}</span>
                </div>
              </div>

              <Link href="/checkout" onClick={() => setCartDrawerOpen(false)}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-13 bg-primary text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all py-3.5"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </motion.button>
              </Link>

              <button
                onClick={() => setCartDrawerOpen(false)}
                className="w-full text-center text-sm font-semibold text-foreground-muted hover:text-primary transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
