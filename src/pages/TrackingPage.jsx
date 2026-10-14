import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, ChefHat, Clock3, MapPin, MessageCircle, Navigation, PackageCheck, Pizza, Truck } from 'lucide-react'
import { useAppStore } from '../context/AppContext'
import { formatBRL, formatDate, getProgressStep, getRemainingMinutes } from '../lib/formatters'

const trackingSteps = [
  { title: 'Pedido confirmado', description: 'Recebemos o seu pedido e já estamos organizando tudo.', icon: Check },
  { title: 'No forno da Romena', description: 'Sua pizza está assando e o cheiro já tomou conta da cozinha.', icon: ChefHat },
  { title: 'Saiu para entrega', description: 'O motoboy pegou a rota. É só preparar a mesa.', icon: Truck },
  { title: 'Entregue', description: 'Bom apetite! Que esse momento seja gostoso.', icon: PackageCheck }
]

export function TrackingPage({ order: selectedOrder, onBack, onNavigate }) {
  const orders = useAppStore((state) => state.orders)
  const [now, setNow] = useState(Date.now())
  const order = selectedOrder ?? orders[0]
  const progress = useMemo(() => getProgressStep(order), [order, now])
  const minutes = useMemo(() => getRemainingMinutes(order), [order, now])

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 3000)
    return () => window.clearInterval(interval)
  }, [])

  if (!order) return <main className="tracking-page"><div className="container"><div className="empty-state empty-state--tracking"><div className="empty-state__icon"><Navigation size={28} /></div><h2>Nenhum pedido para rastrear.</h2><p>Assim que você fizer um pedido, o caminho dele aparece aqui.</p><button className="primary-button" onClick={() => onNavigate('menu')}>Escolher uma pizza <Pizza size={17} /></button></div></div></main>

  return <main className="tracking-page"><div className="container"><button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Voltar</button><div className="tracking-header"><div><span className="eyebrow"><span className="live-dot" /> Acompanhando agora</span><h1>Seu pedido está <em>{progress >= 3 ? 'na mesa.' : 'a caminho.'}</em></h1><p>Pedido <strong>{order.id}</strong> · feito em {formatDate(order.createdAt)}</p></div><div className="tracking-eta"><span className="tracking-eta__icon"><Clock3 size={19} /></span><div><small>{progress >= 3 ? 'Pedido finalizado' : 'Previsão de chegada'}</small><strong>{progress >= 3 ? 'Bom apetite!' : `${minutes || 1} min`}</strong></div></div></div><div className="tracking-layout"><section className="tracking-card"><div className="tracking-card__map"><div className="map-grid" /><div className="map-road map-road--one" /><div className="map-road map-road--two" /><div className="map-road map-road--three" /><span className="map-label map-label--home">Sua casa</span><span className="map-label map-label--kitchen">Romena</span><motion.span className="map-pin map-pin--home" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}><MapPin size={20} fill="currentColor" /></motion.span><motion.span className="map-pin map-pin--kitchen"><Pizza size={19} fill="currentColor" /></motion.span><motion.div className="delivery-route" initial={{ pathLength: 0 }} animate={{ pathLength: progress / 3 }} /></div><div className="tracking-card__body"><div className="tracking-timeline">{trackingSteps.map((item, index) => { const Icon = item.icon; const active = index <= progress; return <div className={`timeline-item ${active ? 'timeline-item--active' : ''} ${index === progress ? 'timeline-item--current' : ''}`} key={item.title}><span className="timeline-icon">{active ? <Icon size={15} /> : <span>{index + 1}</span>}</span><div><h3>{item.title}{index === progress && progress < 3 && <span className="current-badge">agora</span>}</h3><p>{item.description}</p></div>{index < trackingSteps.length - 1 && <span className={`timeline-line ${index < progress ? 'timeline-line--active' : ''}`} />}</div> })}</div></div></section><aside className="tracking-side"><div className="tracking-side__card"><span className="eyebrow">Detalhes do pedido</span><div className="tracking-order-items">{order.items.map((item) => <div key={item.cartId}><span className="tracking-qty">{item.quantity}x</span><div><strong>{item.name}</strong><small>{item.size} · {item.dough}</small></div><b>{formatBRL(item.unitPrice * item.quantity)}</b></div>)}</div><div className="summary-lines"><div><span>Subtotal</span><strong>{formatBRL(order.subtotal)}</strong></div><div><span>Entrega</span><strong>{order.deliveryFee === 0 ? 'Grátis' : formatBRL(order.deliveryFee)}</strong></div><div className="summary-total"><span>Total</span><strong>{formatBRL(order.total)}</strong></div></div></div><div className="tracking-side__address"><span className="tracking-side__address-icon"><MapPin size={17} /></span><div><span>Entregar em</span><strong>{order.address.street}, {order.address.number}</strong><small>{order.address.neighborhood} · {order.address.city}</small></div></div><a className="support-link" href="https://wa.me/5511999999999?text=Oi%20Romena!%20Quero%20ajuda%20com%20o%20pedido%20{order.id}." target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar com a Romena</a></aside></div></div></main>
}
