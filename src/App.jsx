import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AppHeader, ToastLayer, WhatsAppButton } from './components/AppShell'
import { AuthModal } from './components/AuthModal'
import { CartDrawer } from './components/CartDrawer'
import { ProductModal } from './components/ProductCard'
import { useAppStore } from './context/AppContext'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { ProfilePage } from './pages/ProfilePage'
import { TrackingPage } from './pages/TrackingPage'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

const routeToView = (pathname) => {
  const route = pathname.startsWith(basePath) ? pathname.slice(basePath.length) || '/' : pathname
  if (route === '/cardapio') return 'menu'
  if (route === '/checkout') return 'checkout'
  if (route === '/perfil') return 'profile'
  if (route === '/rastreio') return 'tracking'
  return 'home'
}

const viewToRoute = {
  home: '/',
  menu: '/cardapio',
  checkout: '/checkout',
  profile: '/perfil',
  tracking: '/rastreio'
}

export default function App() {
  const [activeView, setActiveView] = useState(() => routeToView(window.location.pathname))
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [customizing, setCustomizing] = useState(null)
  const [trackingOrder, setTrackingOrder] = useState(null)
  const [menuCategory, setMenuCategory] = useState('all')

  const cart = useAppStore((state) => state.cart)
  const user = useAppStore((state) => state.user)

  useEffect(() => {
    const handlePopState = () => setActiveView(routeToView(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (view, category = 'all') => {
    setActiveView(view)
    if (view === 'menu') setMenuCategory(category)
    const nextRoute = viewToRoute[view]
    const publicRoute = `${basePath}${nextRoute === '/' ? '/' : nextRoute}`
    if (nextRoute && window.location.pathname !== publicRoute) window.history.pushState({}, '', publicRoute)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCheckout = () => {
    setCartOpen(false)
    navigate('checkout')
  }

  const handleOrderCreated = (order) => {
    setTrackingOrder(order)
    navigate('tracking')
  }

  const handleTrackOrder = (order) => {
    setTrackingOrder(order)
    navigate('tracking')
  }

  const page = activeView === 'home' ? <HomePage onNavigate={navigate} onCustomize={setCustomizing} /> : activeView === 'menu' ? <MenuPage initialCategory={menuCategory} onCustomize={setCustomizing} /> : activeView === 'checkout' ? <CheckoutPage onBack={() => cart.length > 0 ? setCartOpen(true) : navigate('menu')} onOrderCreated={handleOrderCreated} onOpenAuth={() => setAuthOpen(true)} /> : activeView === 'profile' ? <ProfilePage onOpenAuth={() => setAuthOpen(true)} onNavigate={navigate} onTrackOrder={handleTrackOrder} /> : <TrackingPage order={trackingOrder} onBack={() => navigate(user ? 'profile' : 'home')} onNavigate={navigate} />

  return <div className="app-shell"><AppHeader activeView={activeView} onNavigate={navigate} onOpenCart={() => setCartOpen(true)} onOpenAuth={() => setAuthOpen(true)} /><motion.div key={activeView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>{page}</motion.div><footer className="site-footer"><div className="container footer-grid"><div><div className="footer-brand"><span>R</span><strong>romena</strong></div><p>Pizza feita para virar memória.<br />Com calma, cuidado e bons ingredientes.</p></div><div><span className="footer-heading">Navegue</span><button onClick={() => navigate('menu')}>Cardápio</button><button onClick={() => navigate('tracking')}>Rastrear pedido</button><button onClick={() => navigate('profile')}>Meu perfil</button></div><div><span className="footer-heading">Atendimento</span><span>Todos os dias · 18h às 23h30</span><a href="mailto:oi@romena.delivery">oi@romena.delivery</a><a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer">WhatsApp</a></div><div className="footer-signoff"><span>Feito com massa,</span><strong>Romena & Delivery <span>✦</span></strong></div></div><div className="container footer-bottom"><span>© 2025 Romena & Delivery. Todos os direitos reservados.</span><span>Feito para prototipagem local · dados salvos no navegador</span></div></footer><CartDrawer open={cartOpen} onClose={() => { setCartOpen(false); if (activeView === 'checkout' && cart.length > 0) navigate('menu') }} onCheckout={handleCheckout} onExploreMenu={() => { setCartOpen(false); navigate('menu') }} /><AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />{customizing && <ProductModal product={customizing} onClose={() => setCustomizing(null)} />}<WhatsAppButton /><ToastLayer /></div>
}
