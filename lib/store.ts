import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Address, Coupon } from './data';
import { applyCoupon as checkCoupon } from './data';

// Re-export Product so existing imports still work
export type { Product };

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'super_admin' | 'store_manager' | 'inventory_manager' | 'marketing' | 'delivery';
  avatar?: string;
  createdAt: string;
  loyaltyPoints: number;
  totalSavings: number;
  addresses?: Address[];
}

// Re-export CATEGORIES and PRODUCTS for backward compat
export { CATEGORIES, PRODUCTS } from './data';

// ─── TOAST ───────────────────────────────────────────────────────────────────

interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

// ─── STORE STATE ─────────────────────────────────────────────────────────────

interface StoreState {
  // Cart
  cart: CartItem[];
  couponCode: string;
  couponDiscount: number;
  couponError: string;

  // User
  user: User | null;
  isLoggedIn: boolean;

  // Wishlist
  wishlist: WishlistItem[];

  // UI
  toast: Toast;
  cartDrawerOpen: boolean;
  searchQuery: string;

  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
  totalPrice: () => number;
  deliveryFee: () => number;

  // Auth actions
  login: (user: User) => void;
  logout: () => void;

  // Wishlist actions
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Toast
  showToast: (message: string, type?: Toast['type']) => void;
  hideToast: () => void;

  // UI
  setCartDrawerOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  setDefaultAddress: (addressId: string) => void;
}

// ─── STORE ───────────────────────────────────────────────────────────────────

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      couponCode: '',
      couponDiscount: 0,
      couponError: '',
      user: null,
      isLoggedIn: false,
      wishlist: [],
      toast: { show: false, message: '', type: 'success' },
      cartDrawerOpen: false,
      searchQuery: '',

      // ── Cart ──────────────────────────────────────────────────────────────

      addToCart: (product) => {
        set((state) => {
          const existingItem = state.cart.find((i) => i.id === product.id);
          if (product.outOfStock || product.stock === 0) {
            state.showToast('This product is currently out of stock', 'error');
            return state;
          }
          if (existingItem && existingItem.quantity >= product.stock) {
            state.showToast(`Only ${product.stock} units available`, 'error');
            return state;
          }

          let newCart;
          if (existingItem) {
            newCart = state.cart.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          } else {
            newCart = [...state.cart, { ...product, quantity: 1 }];
          }
          
          state.showToast(`${product.name} added to cart!`, 'success');
          return { cart: newCart };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({ cart: state.cart.filter((i) => i.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((i) => i.id !== productId) };
          }
          const item = state.cart.find(i => i.id === productId);
          if (item && quantity > item.stock) {
            state.showToast(`Only ${item.stock} units available`, 'error');
            return state;
          }
          return {
            cart: state.cart.map((i) =>
              i.id === productId ? { ...i, quantity } : i
            ),
          };
        });
      },

      clearCart: () => set({ cart: [], couponCode: '', couponDiscount: 0, couponError: '' }),

      applyCoupon: (code) => {
        const subtotal = get().subtotal();
        const result = checkCoupon(code, subtotal);
        if (result.error) {
          set({ couponError: result.error, couponDiscount: 0, couponCode: '' });
          get().showToast(result.error, 'error');
        } else {
          set({ couponCode: code.toUpperCase(), couponDiscount: result.discount, couponError: '' });
          get().showToast(`Coupon applied! You saved ₹${result.discount}`, 'success');
        }
      },

      removeCoupon: () => {
        set({ couponCode: '', couponDiscount: 0, couponError: '' });
        get().showToast('Coupon removed', 'info');
      },

      // ── Computed ──────────────────────────────────────────────────────────

      totalItems: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().cart.reduce((sum, i) => {
          const effectivePrice = i.price ?? i.mrp;
          return sum + i.quantity * effectivePrice;
        }, 0),

      deliveryFee: () => {
        const sub = get().subtotal();
        return sub >= 499 ? 0 : 29;
      },

      totalPrice: () => {
        const sub = get().subtotal();
        const fee = get().deliveryFee();
        const disc = get().couponDiscount;
        return Math.max(0, sub + fee - disc);
      },

      // ── Auth ──────────────────────────────────────────────────────────────

      login: (user) => {
        const enrichedUser: User = {
          ...user,
          id: user.id === 'u1' ? '2548232c-3b36-4702-861c-8b8d4c1ce777' : user.id,
          loyaltyPoints: user.loyaltyPoints ?? 1250,
          totalSavings: user.totalSavings ?? 2450,
          addresses: user.addresses || [
            { id: 'addr-1', label: 'Home', line1: '123, Espresso Street', city: 'Nellore', state: 'AP', pincode: '524001', isDefault: true },
            { id: 'addr-2', label: 'Office', line1: 'Supermarket Hub, Tech Park', city: 'Bangalore', state: 'KA', pincode: '560001', isDefault: false },
          ]
        };
        set({ user: enrichedUser, isLoggedIn: true });
        get().showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      },

      setDefaultAddress: (addressId) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            addresses: state.user.addresses?.map((a) => ({
              ...a,
              isDefault: a.id === addressId
            }))
          } : null
        }));
        get().showToast('Default address updated', 'success');
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
        get().showToast('Signed out successfully', 'info');
      },

      // ── Wishlist ──────────────────────────────────────────────────────────

      addToWishlist: (product) => {
        if (!get().wishlist.find(i => i.id === product.id)) {
          set({ wishlist: [...get().wishlist, product] });
          get().showToast(`${product.name} added to wishlist`, 'success');
        } else {
          get().removeFromWishlist(product.id);
        }
      },

      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter(i => i.id !== productId) });
        get().showToast('Removed from wishlist', 'info');
      },

      isInWishlist: (productId) => !!get().wishlist.find(i => i.id === productId),
      clearWishlist: () => {
        set({ wishlist: [] });
        get().showToast('Wishlist cleared', 'info');
      },

      // ── Toast ─────────────────────────────────────────────────────────────

      showToast: (message, type = 'success') => {
        set({ toast: { show: true, message, type } });
        setTimeout(() => get().hideToast(), 3000);
      },

      hideToast: () => set({ toast: { show: false, message: '', type: 'success' } }),

      // ── UI ────────────────────────────────────────────────────────────────

      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    {
      name: 'anti-gravity-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);
