import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, ChefHat, Clock3, MapPin, MessageCircle, PackageCheck, Pizza, Truck } from 'lucide-react'
import { useAppStore } from '../context/AppContext'
import { formatBRL, formatDate, getProgressStep, getRemainingMinutes } from '../lib/formatters'

const trackingSteps = [
  { title: 'Pedido confirmado', description: 'Recebemos o seu pedido e já estamos organizando tudo.', icon: Check },
  { title: 'No forno da Romena', description: 'Sua pizza está assando e o cheiro já tomou conta da cozinha.', icon: ChefHat },
  { title: 'Saiu para entrega', description: 'O motoboy pegou a rota. É só preparar a mesa.', icon: Truck },
  { title: 'Entregue', description: 'Bom apetite! Que esse momento seja gostoso.', icon: PackageCheck }
]

const routePath = 'M 17 27 C 32 18 35 48 47 43 S 65 31 82 72'
const stageLabel = ['Pedido confirmado', 'No forno da Romena', 'Saiu para entrega', 'Entregue']
const guilaImage = `${import.meta.env.BASE_URL}assets/guila123.png`

export function TrackingPage({ order: selectedOrder, onBack, onNavigate }) {
  const orders = useAppStore((state) => state.orders)
  const [now, setNow] = useState(Date.now())
  const [routePercent, setRoutePercent] = useState(0)
  const routeRef = useRef(null)
  const order = orders.find((item) => item.id === selectedOrder?.id) ?? selectedOrder ?? orders[0]
  const stage = Math.max(0, Math.min(3, getProgressStep(order)))
  const minutes = useMemo(() => getRemainingMinutes(order), [order, now])
  const targetPercent = stage < 2 ? 0 : stage === 2 ? 85 : 100

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 3000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    let frame
    const from = routePercent
    const startedAt = performance.now()
    const duration = 1000
    const tick = (time) => {
      const progress = Math.min(1, (time - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setRoutePercent(from + (targetPercent - from) * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // Only changing the official stage should animate the marker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, targetPercent])

  const marker = useMemo(() => {
    const path = routeRef.current
    if (!path) return { x: 17, y: 27 }
    const length = path.getTotalLength()
    return path.getPointAtLength(length * (routePercent / 100))
  }, [routePercent])


  if (!order) return <main className="tracking-page"><div className="container"><div className="empty-state empty-state--tracking"><div className="empty-state__icon"><MapPin size={28} /></div><h2>Nenhum pedido para rastrear.</h2><p>Assim que você fizer um pedido, o caminho dele aparece aqui.</p><button className="primary-button" onClick={() => onNavigate('menu')}>Escolher uma pizza <Pizza size={17} /></button></div></div></main>

  return <main className="tracking-page"><div className="container"><button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Voltar</button><div className="tracking-header"><div><span className="eyebrow"><span className="live-dot" /> Acompanhando agora</span><h1>Seu pedido está <em>{stage >= 3 ? 'na mesa.' : 'a caminho.'}</em></h1><p>Pedido <strong>{order.id}</strong> · feito em {formatDate(order.createdAt)}</p></div><div className="tracking-eta"><span className="tracking-eta__icon"><Clock3 size={19} /></span><div><small>{stage >= 3 ? 'Pedido finalizado' : 'Previsão de chegada'}</small><strong>{stage >= 3 ? 'Bom apetite!' : `${minutes || 1} min`}</strong></div></div></div><div className="tracking-layout"><section className="tracking-card"><div className="tracking-card__map"><div className="map-grid" /><div className="map-block map-block--one" /><div className="map-block map-block--two" /><div className="map-block map-block--three" /><svg className="map-street-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Rota da entrega"><path className="map-street map-street--route" d={routePath} /><path ref={routeRef} className="map-route-base" pathLength="100" d={routePath} /><path className="map-route-progress" pathLength="100" d={routePath} style={{ strokeDasharray: '100', strokeDashoffset: 100 - routePercent }} /><g className={`map-bike-marker ${order.easterEgg === 'guila123' ? 'map-bike-marker--guila' : ''}`} transform={`translate(${marker.x} ${marker.y})`}>{order.easterEgg === 'guila123' ? <image href={guilaImage} x="-5.5" y="-8" width="11" height="16" preserveAspectRatio="xMidYMid slice" /> : <><circle r="4.8" /><text x="0" y=".7" textAnchor="middle">🛵</text></>}</g></svg><span className="map-label map-label--home">Sua entrega</span><span className="map-label map-label--kitchen">Cozinha Romena</span><span className="map-pin map-pin--home"><MapPin size={20} fill="currentColor" /></span><span className="map-pin map-pin--kitchen"><Pizza size={19} fill="currentColor" /></span><span className="map-live-badge"><span className="live-dot" /> {stage === 2 ? 'Moto em movimento' : stage === 3 ? 'Chegou ao destino' : stage === 1 ? 'No forno' : 'Pedido confirmado'}</span></div><div className="tracking-card__body"><div className="tracking-timeline">{trackingSteps.map((item, index) => { const Icon = item.icon; const active = index <= stage; return <div className={`timeline-item ${active ? 'timeline-item--active' : ''} ${index === stage ? 'timeline-item--current' : ''}`} key={item.title}><span className="timeline-icon">{active ? <Icon size={15} /> : <span>{index + 1}</span>}</span><span className="timeline-copy"><strong>{item.title}{index === stage && stage < 3 && <span className="current-badge">agora</span>}</strong><small>{item.description}</small></span>{index < trackingSteps.length - 1 && <span className={`timeline-line ${index < stage ? 'timeline-line--active' : ''}`} />}</div> })}</div><div className="automatic-tracking-note"><span className="live-dot" /><div><strong>Rastreamento automático</strong><small>O status é atualizado conforme o tempo do pedido. A moto chega ao destino apenas quando a etapa for concluída.</small></div></div></div></section><aside className="tracking-side"><div className="tracking-side__card"><span className="eyebrow">Detalhes do pedido</span><div className="tracking-order-items">{order.items.map((item) => <div key={item.cartId}><span className="tracking-qty">{item.quantity}x</span><div><strong>{item.name}</strong><small>{item.size} · {item.dough}</small></div><b>{formatBRL(item.unitPrice * item.quantity)}</b></div>)}</div><div className="summary-lines"><div><span>Subtotal</span><strong>{formatBRL(order.subtotal)}</strong></div><div><span>Entrega</span><strong>{order.deliveryFee === 0 ? 'Grátis' : formatBRL(order.deliveryFee)}</strong></div>{order.discount > 0 && <div><span>Desconto</span><strong className="discount-label">-{formatBRL(order.discount)}</strong></div>}<div className="summary-total"><span>Total</span><strong>{formatBRL(order.total)}</strong></div></div></div><div className="tracking-side__address"><span className="tracking-side__address-icon"><MapPin size={17} /></span><div><span>Entregar em</span><strong>{order.address.street}, {order.address.number}{order.address.complement ? ` · ${order.address.complement}` : ''}</strong><small>{order.address.neighborhood} · {order.address.city} · CEP {order.address.zip}</small></div></div><a className="support-link" href={`https://wa.me/5511999999999?text=Oi%20Romena!%20Quero%20ajuda%20com%20o%20pedido%20${order.id}.`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Falar com a Romena</a></aside></div></div></main>
}
