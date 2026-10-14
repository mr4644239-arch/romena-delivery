export const formatBRL = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const formatDate = (value) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))

export const formatShortDate = (value) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(value))

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'RO'

export const slugToLabel = (value = '') =>
  value
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

export const getDeliveryFee = (subtotal) => {
  if (subtotal >= 90) return 0
  if (subtotal >= 60) return 4.9
  return 7.9
}

export const getProgressStep = (order) => {
  if (!order) return 0
  if (order.status === 'delivered') return 3
  const elapsed = Date.now() - new Date(order.createdAt).getTime()
  const simulatedStep = Math.floor(elapsed / 12000)
  return Math.min(3, Math.max(order.progress ?? 0, simulatedStep))
}

export const getRemainingMinutes = (order) => {
  if (!order) return 0
  const eta = order.etaMinutes ?? 35
  const elapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)
  return Math.max(0, eta - elapsed)
}
