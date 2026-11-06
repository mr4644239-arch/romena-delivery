import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ookdqbkljotheobemhmh.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-7CkeImAAcJVEu9t7OjJBQ_pQiXmLPO'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
})

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export async function loadCloudData(userId) {
  const [profileResult, addressResult, orderResult] = await Promise.all([
    supabase.from('profiles').select('id,name,email,created_at').eq('id', userId).maybeSingle(),
    supabase.from('addresses').select('id,label,street,number,complement,neighborhood,city,zip,created_at,updated_at').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('orders').select('id,created_at,eta_minutes,progress,status,items,address,payment,change_for,easter_egg,subtotal,delivery_fee,discount,total').eq('user_id', userId).order('created_at', { ascending: false })
  ])
  if (profileResult.error) throw profileResult.error
  if (addressResult.error) throw addressResult.error
  if (orderResult.error) throw orderResult.error
  return {
    profile: profileResult.data,
    addresses: addressResult.data ?? [],
    orders: (orderResult.data ?? []).map((order) => ({
      ...order,
      createdAt: order.created_at,
      etaMinutes: order.eta_minutes,
      deliveryFee: Number(order.delivery_fee),
      changeFor: order.change_for,
      easterEgg: order.easter_egg,
      items: order.items ?? {},
      address: order.address ?? {}
    }))
  }
}
