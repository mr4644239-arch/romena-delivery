import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getDeliveryFee } from '../lib/formatters'

const couponMap = {
  ROMENA10: { code: 'ROMENA10', label: '10% de desconto', type: 'percent', value: 10 },
  BORDA10: { code: 'BORDA10', label: 'Borda recheada grátis', type: 'fixed', value: 10 },
  COMBOROMA: { code: 'COMBOROMA', label: 'R$ 8 de desconto', type: 'fixed', value: 8 }
}

const buildId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

export const useAppStore = create(
  persist(
    (set, get) => ({
      cart: [],
      user: null,
      addresses: [],
      orders: [],
      coupon: null,
      toast: null,

      addToCart: (product, customization = {}) => {
        const item = {
          cartId: buildId('cart'),
          productId: product.id,
          name: product.name,
          visual: product.visual,
          basePrice: product.price,
          quantity: customization.quantity ?? 1,
          size: customization.size ?? 'M',
          dough: customization.dough ?? 'tradicional',
          crust: customization.crust ?? 'sem-borda',
          extras: customization.extras ?? [],
          notes: customization.notes ?? '',
          unitPrice: customization.unitPrice ?? product.price
        }
        set((state) => ({ cart: [...state.cart, item] }))
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({ cart: state.cart.filter((item) => item.cartId !== cartId) }))
          return
        }
        set((state) => ({
          cart: state.cart.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
        }))
      },

      removeFromCart: (cartId) =>
        set((state) => ({ cart: state.cart.filter((item) => item.cartId !== cartId) })),

      clearCart: () => set({ cart: [], coupon: null }),

      applyCoupon: (rawCode) => {
        const code = rawCode.trim().toUpperCase()
        const coupon = couponMap[code] ?? null
        set({ coupon })
        return coupon
      },

      clearCoupon: () => set({ coupon: null }),

      signIn: ({ name, email }) =>
        set({
          user: {
            id: buildId('user'),
            name: name || email.split('@')[0],
            email,
            memberSince: new Date().toISOString()
          }
        }),

      signOut: () => set({ user: null }),

      saveAddress: (address) => {
        const entry = { ...address, id: address.id ?? buildId('address') }
        set((state) => ({
          addresses: [entry, ...state.addresses.filter((saved) => saved.id !== entry.id)]
        }))
        return entry
      },

      createOrder: ({ address, payment, changeFor }) => {
        const state = get()
        const subtotal = state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
        const deliveryFee = getDeliveryFee(subtotal)
        const discount = state.coupon
          ? state.coupon.type === 'percent'
            ? subtotal * (state.coupon.value / 100)
            : Math.min(state.coupon.value, subtotal)
          : 0
        const order = {
          id: `ROM-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          etaMinutes: 35,
          progress: 0,
          status: 'confirmed',
          items: state.cart,
          address,
          payment,
          changeFor,
          subtotal,
          deliveryFee,
          discount,
          total: Math.max(0, subtotal + deliveryFee - discount)
        }
        set((current) => ({ orders: [order, ...current.orders], cart: [], coupon: null }))
        return order
      },

      setOrderProgress: (orderId, progress) => {
        const nextProgress = Math.max(0, Math.min(3, Number(progress) || 0))
        const status = ['confirmed', 'baking', 'out_for_delivery', 'delivered'][nextProgress]
        set((state) => ({
          orders: state.orders.map((order) => (
            order.id === orderId ? { ...order, progress: nextProgress, status } : order
          ))
        }))
        return nextProgress
      },

      setToast: (toast) => set({ toast }),
      dismissToast: () => set({ toast: null }),

      cartSubtotal: () => {
        const state = get()
        return state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      },
      cartCount: () => {
        const state = get()
        return state.cart.reduce((sum, item) => sum + item.quantity, 0)
      }
    }),
    {
      name: 'romena-delivery-store',
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        addresses: state.addresses,
        orders: state.orders,
        coupon: state.coupon
      })
    }
  )
)

export const useCartSummary = () => {
  const cart = useAppStore((state) => state.cart)
  const coupon = useAppStore((state) => state.coupon)

  return useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const deliveryFee = getDeliveryFee(subtotal)
    const discount = coupon
      ? coupon.type === 'percent'
        ? subtotal * (coupon.value / 100)
        : Math.min(coupon.value, subtotal)
      : 0

    return {
      subtotal,
      deliveryFee,
      discount,
      total: Math.max(0, subtotal + deliveryFee - discount),
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    }
  }, [cart, coupon])
}
