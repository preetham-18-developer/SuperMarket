// app/providers.tsx  — Client Boundary
// Wraps all client-only context: toast, cart drawer, etc.
'use client';

import { useStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import dynamic from 'next/dynamic';
const CartDrawer = dynamic(() => import('@/components/CartDrawer'), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  const toast = useStore((state) => state.toast);
  const hideToast = useStore((state) => state.hideToast);
  const cartDrawerOpen = useStore((state) => state.cartDrawerOpen);

  const icons = {
    success: <CheckCircle size={18} className="text-primary" />,
    error:   <AlertCircle size={18} className="text-red-400" />,
    info:    <Info size={18} className="text-blue-400" />,
  };

  const borders = {
    success: 'border-l-primary',
    error:   'border-l-red-400',
    info:    'border-l-blue-400',
  };

  return (
    <>
      {children}

      {/* Cart Drawer */}
      <CartDrawer open={cartDrawerOpen} />

      {/* Global Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
          >
            <div
              className={`
                flex items-center gap-3 px-5 py-4 rounded-2xl
                bg-espresso text-white shadow-xl border-l-4 ${borders[toast.type]}
                max-w-xs sm:max-w-sm
              `}
            >
              <div className="shrink-0">{icons[toast.type]}</div>
              <p className="text-sm font-semibold leading-snug flex-1">{toast.message}</p>
              <button
                onClick={hideToast}
                className="shrink-0 pointer-events-auto opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for Cart Drawer */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] modal-backdrop"
            onClick={() => useStore.getState().setCartDrawerOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
