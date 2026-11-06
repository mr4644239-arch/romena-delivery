import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getDeliveryFee } from '../lib/formatters'
import { loadCloudData, supabase } from '../lib/supabase'

const couponMap = {
  ROMENA10: { code: 'ROMENA10', label: '10% de desconto', type: 'percent', value: 10 },
  BORDA10: { code: 'BORDA10', label: 'Borda recheada grátis', type: 'fixed', value: 10 },
  COMBOROMA: { code: 'COMBOROMA', label: 'R$ 8 de desconto', type: 'fixed', value: 8 },
  GUILA123: { code: 'GUILA123', label: 'Cupom especial aplicado', type: 'fixed', value: 0, easterEgg: 'guila123' }
}

const buildId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
const mapUser = (user) => user ? ({ id: user.id, name: user.user_metadata?.name || user.email?.split('@')[0] || 'Cliente Romena', email: user.email || '', memberSince: user.created_at }) : null

export const useAppStore = create(
  persist(
    (set, get) => ({
      cart: [], user: null, addresses: [], orders: [], products: [], coupon: null, toast: null, authReady: false,

      addToCart: (product, customization = {}) => {
        const item = { cartId: buildId('cart'), productId: product.id, name: product.name, visual: product.visual, basePrice: product.price, quantity: customization.quantity ?? 1, size: customization.size ?? 'M', dough: customization.dough ?? 'tradicional', crust: customization.crust ?? 'sem-borda', extras: customization.extras ?? [], notes: customization.notes ?? '', unitPrice: customization.unitPrice ?? product.price }
        set((state) => ({ cart: [...state.cart, item] }))
      },
      updateQuantity: (cartId, quantity) => quantity <= 0 ? set((state) => ({ cart: state.cart.filter((item) => item.cartId !== cartId) })) : set((state) => ({ cart: state.cart.map((item) => item.cartId === cartId ? { ...item, quantity } : item) })),
      removeFromCart: (cartId) => set((state) => ({ cart: state.cart.filter((item) => item.cartId !== cartId) })),
      clearCart: () => set({ cart: [], coupon: null }),
      applyCoupon: (rawCode) => { const coupon = couponMap[rawCode.trim().toUpperCase()] ?? null; set({ coupon }); return coupon },
      clearCoupon: () => set({ coupon: null }),

      initializeAuth: async () => {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user) {
          set({ user: mapUser(data.session.user) })
          try {
            const cloud = await loadCloudData(data.session.user.id)
            set({ user: cloud.profile ? { ...mapUser(data.session.user), name: cloud.profile.name || mapUser(data.session.user).name } : mapUser(data.session.user), addresses: cloud.addresses, orders: cloud.orders })
          } catch (error) { console.warn('Supabase: falha ao carregar dados', error) }
        }
        set({ authReady: true })
        return supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!session?.user) { set({ user: null, addresses: [], orders: [] }); return }
          set({ user: mapUser(session.user) })
          try {
            const cloud = await loadCloudData(session.user.id)
            set({ user: cloud.profile ? { ...mapUser(session.user), name: cloud.profile.name || mapUser(session.user).name } : mapUser(session.user), addresses: cloud.addresses, orders: cloud.orders })
          } catch (error) { console.warn('Supabase: falha ao sincronizar dados', error) }
        })
      },
      loadProducts: async () => {
        const { data, error } = await supabase.from('products').select('id,category,name,description,price,rating,reviews,tag,tag_tone,visual').eq('active', true).order('name')
        if (!error && data?.length) set({ products: data })
        return data ?? []
      },

      signIn: async ({ name, email, password, mode = 'login' }) => {
        const result = mode === 'signup'
          ? await supabase.auth.signUp({ email, password, options: { data: { name } } })
          : await supabase.auth.signInWithPassword({ email, password })
        if (result.error) throw result.error
        if (result.data.user) set({ user: mapUser(result.data.user) })
        return result.data
      },
      signOut: async () => { await supabase.auth.signOut(); set({ user: null, addresses: [], orders: [] }) },

      saveAddress: async (address) => {
        const user = get().user
        const payload = { ...address, user_id: user?.id, zip: address.zip.replace(/\D/g, '') }
        if (user?.id) {
          const clean = { label: payload.label, street: payload.street, number: payload.number, complement: payload.complement || null, neighborhood: payload.neighborhood, city: payload.city, zip: payload.zip, user_id: user.id }
          const query = address.id && !String(address.id).startsWith('address-') ? supabase.from('addresses').update(clean).eq('id', address.id).select().single() : supabase.from('addresses').insert(clean).select().single()
          const { data, error } = await query
          if (!error && data) { set((state) => ({ addresses: [data, ...state.addresses.filter((item) => item.id !== data.id)] })); return data }
          if (error) console.warn('Supabase: endereço não salvo', error)
        }
        const entry = { ...address, id: address.id ?? buildId('address') }
        set((state) => ({ addresses: [entry, ...state.addresses.filter((saved) => saved.id !== entry.id)] }))
        return entry
      },

      createOrder: async ({ address, payment, changeFor }) => {
        const state = get(); const subtotal = state.cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0); const deliveryFee = getDeliveryFee(subtotal); const discount = state.coupon ? state.coupon.type === 'percent' ? subtotal * (state.coupon.value / 100) : Math.min(state.coupon.value, subtotal) : 0
        const order = { id: `ROM-${Math.floor(1000 + Math.random() * 9000)}`, createdAt: new Date().toISOString(), etaMinutes: 35, progress: 0, status: 'confirmed', items: state.cart, address, payment, changeFor, easterEgg: state.coupon?.easterEgg ?? null, subtotal, deliveryFee, discount, total: Math.max(0, subtotal + deliveryFee - discount) }
        if (state.user?.id) {
          const { error } = await supabase.from('orders').insert({ id: order.id, user_id: state.user.id, created_at: order.createdAt, eta_minutes: order.etaMinutes, progress: order.progress, status: order.status, items: order.items, address: order.address, payment: order.payment, change_for: order.changeFor || null, easter_egg: order.easterEgg, subtotal: order.subtotal, delivery_fee: order.deliveryFee, discount: order.discount, total: order.total })
          if (error) throw error
        }
        set((current) => ({ orders: [order, ...current.orders], cart: [], coupon: null }))
        return order
      },
      setOrderProgress: (orderId, progress) => { const nextProgress = Math.max(0, Math.min(3, Number(progress) || 0)); const status = ['confirmed', 'baking', 'out_for_delivery', 'delivered'][nextProgress]; set((state) => ({ orders: state.orders.map((order) => order.id === orderId ? { ...order, progress: nextProgress, status } : order) })); return nextProgress },
      setToast: (toast) => set({ toast }), dismissToast: () => set({ toast: null }),
      cartSubtotal: () => get().cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0)
    }),
    { name: 'romena-delivery-store', partialize: (state) => ({ cart: state.cart, user: state.user, addresses: state.addresses, orders: state.orders, coupon: state.coupon }) }
  )
)

export const useCartSummary = () => {
  const cart = useAppStore((state) => state.cart); const coupon = useAppStore((state) => state.coupon)
  return useMemo(() => { const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0); const deliveryFee = getDeliveryFee(subtotal); const discount = coupon ? coupon.type === 'percent' ? subtotal * (coupon.value / 100) : Math.min(coupon.value, subtotal) : 0; return { subtotal, deliveryFee, discount, total: Math.max(0, subtotal + deliveryFee - discount), itemCount: cart.reduce((sum, item) => sum + item.quantity, 0) } }, [cart, coupon])
}
