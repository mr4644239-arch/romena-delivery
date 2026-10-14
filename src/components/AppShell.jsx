import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CircleUserRound,
  Clock3,
  House,
  Menu,
  MessageCircle,
  Pizza,
  ShoppingBag,
  Truck,
  X
} from 'lucide-react'
import { useAppStore } from '../context/AppContext'

const navItems = [
  { id: 'home', label: 'Início', icon: House },
  { id: 'menu', label: 'Cardápio', icon: Pizza },
  { id: 'tracking', label: 'Rastrear', icon: Truck },
  { id: 'profile', label: 'Perfil', icon: CircleUserRound }
]

export function BrandMark({ compact = false }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-lockup--compact' : ''}`}>
      <span className="brand-mark" aria-hidden="true"><Pizza size={22} strokeWidth={2.4} /></span>
      <span className="brand-copy">
        <strong>Romena</strong>
        <small>& delivery</small>
      </span>
    </div>
  )
}

export function AppHeader({ activeView, onNavigate, onOpenCart, onOpenAuth }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useAppStore((state) => state.user)
  const cartCount = useAppStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0))

  const goTo = (view) => {
    onNavigate(view)
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button className="brand-button" onClick={() => goTo('home')} aria-label="Ir para o início">
          <BrandMark />
        </button>

        <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Navegação principal">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-link ${activeView === id ? 'nav-link--active' : ''}`}
              onClick={() => goTo(id)}
            >
              <Icon size={17} strokeWidth={2.2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="header-user" onClick={user ? () => goTo('profile') : onOpenAuth}>
            <span className="header-user__avatar">{user ? user.name.slice(0, 1).toUpperCase() : <CircleUserRound size={19} />}</span>
            <span className="header-user__label">{user ? user.name.split(' ')[0] : 'Entrar'}</span>
          </button>
          <button className="cart-button" onClick={onOpenCart} aria-label={`Abrir carrinho com ${cartCount} itens`}>
            <ShoppingBag size={19} />
            <span>Pedido</span>
            {cartCount > 0 && <b className="cart-badge">{cartCount}</b>}
          </button>
          <button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export function ToastLayer() {
  const toast = useAppStore((state) => state.toast)
  const dismissToast = useAppStore((state) => state.dismissToast)

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(dismissToast, 3600)
    return () => window.clearTimeout(timeout)
  }, [toast, dismissToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className={`toast toast--${toast.type ?? 'success'}`}
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
        >
          <span className="toast-dot" />
          <div>
            <strong>{toast.title}</strong>
            {toast.message && <span>{toast.message}</span>}
          </div>
          <button onClick={dismissToast} aria-label="Fechar notificação"><X size={16} /></button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/5511999999999?text=Oi%20Romena!%20Quero%20uma%20ajuda%20com%20meu%20pedido."
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Romena pelo WhatsApp"
    >
      <MessageCircle size={22} />
      <span>Precisa de ajuda?</span>
    </a>
  )
}

export function DeliveryPromise() {
  return (
    <div className="delivery-promise">
      <span className="delivery-promise__icon"><Clock3 size={17} /></span>
      <div><strong>Entrega em até 35 min</strong><span>Na sua porta, ainda quentinha</span></div>
    </div>
  )
}
