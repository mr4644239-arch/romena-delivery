import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, Minus, Plus, ShoppingBag, Tag, Trash2, X } from 'lucide-react'
import { useAppStore, useCartSummary } from '../context/AppContext'
import { formatBRL, slugToLabel } from '../lib/formatters'
import { ProductVisual } from './ProductCard'

export function CartDrawer({ open, onClose, onCheckout, onExploreMenu }) {
  const cart = useAppStore((state) => state.cart)
  const coupon = useAppStore((state) => state.coupon)
  const applyCoupon = useAppStore((state) => state.applyCoupon)
  const clearCoupon = useAppStore((state) => state.clearCoupon)
  const setToast = useAppStore((state) => state.setToast)
  const updateQuantity = useAppStore((state) => state.updateQuantity)
  const removeFromCart = useAppStore((state) => state.removeFromCart)
  const summary = useCartSummary()
  const [couponCode, setCouponCode] = useState('')

  const handleCoupon = (event) => {
    event.preventDefault()
    const result = applyCoupon(couponCode)
    if (result) {
      setToast({ title: 'Cupom aplicado', message: result.label })
      setCouponCode('')
    } else {
      setToast({ title: 'Cupom não encontrado', message: 'Tente ROMENA10 para ganhar 10% hoje.', type: 'error' })
    }
  }

  return (
    <AnimatePresence>
      {open && <>
        <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        <motion.aside className="cart-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}>
          <div className="drawer-header"><div><span className="eyebrow">Seu pedido</span><h2>Na sua mesa <span className="accent-dot">•</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar carrinho"><X size={20} /></button></div>
          {cart.length === 0 ? <EmptyCart onExploreMenu={onExploreMenu} /> : <>
            <div className="cart-items">{cart.map((item) => <CartItem key={item.cartId} item={item} onIncrease={() => updateQuantity(item.cartId, item.quantity + 1)} onDecrease={() => updateQuantity(item.cartId, item.quantity - 1)} onRemove={() => removeFromCart(item.cartId)} />)}</div>
            <div className="cart-bottom">
              <form className="coupon-form" onSubmit={handleCoupon}><Tag size={16} /><input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder={coupon ? coupon.code : 'Tem um cupom?'} disabled={Boolean(coupon)} />{coupon ? <button type="button" onClick={clearCoupon} aria-label="Remover cupom"><X size={15} /></button> : <button type="submit">Aplicar</button>}</form>
              {coupon && <div className="coupon-applied"><span>✓ {coupon.label}</span><strong>-{formatBRL(summary.discount)}</strong></div>}
              <div className="summary-lines"><div><span>Subtotal <small>{summary.itemCount} itens</small></span><strong>{formatBRL(summary.subtotal)}</strong></div><div><span>Entrega</span><strong className={summary.deliveryFee === 0 ? 'free-label' : ''}>{summary.deliveryFee === 0 ? 'Grátis' : formatBRL(summary.deliveryFee)}</strong></div>{summary.discount > 0 && <div><span>Desconto</span><strong className="discount-label">-{formatBRL(summary.discount)}</strong></div>}<div className="summary-total"><span>Total</span><strong>{formatBRL(summary.total)}</strong></div></div>
              <button className="primary-button primary-button--wide" onClick={onCheckout}>Continuar para entrega <ArrowRight size={17} /></button>
              <p className="cart-note"><ShoppingBag size={14} /> Entrega grátis a partir de R$ 90</p>
            </div>
          </>}
        </motion.aside>
      </>}
    </AnimatePresence>
  )
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return <article className="cart-item"><ProductVisual product={{ visual: item.visual }} /><div className="cart-item__content"><div className="cart-item__title"><div><h3>{item.name}</h3><p>{item.size} · {slugToLabel(item.dough)} · {slugToLabel(item.crust)}</p>{item.extras.length > 0 && <small>+ {item.extras.length} adicional(is)</small>}</div><button onClick={onRemove} className="remove-button" aria-label={`Remover ${item.name}`}><Trash2 size={15} /></button></div><div className="cart-item__footer"><strong>{formatBRL(item.unitPrice * item.quantity)}</strong><div className="mini-quantity"><button onClick={onDecrease} aria-label="Diminuir"><Minus size={13} /></button><span>{item.quantity}</span><button onClick={onIncrease} aria-label="Aumentar"><Plus size={13} /></button></div></div></div></article>
}

function EmptyCart({ onExploreMenu }) {
  return <div className="empty-state empty-state--cart"><div className="empty-state__icon"><ShoppingBag size={30} /></div><h3>Seu pedido está esperando uma pizza.</h3><p>Escolha uma receita e monte do seu jeito. A gente cuida do resto.</p><button className="primary-button" onClick={onExploreMenu}>Explorar cardápio <ChevronLeft size={16} className="flip-icon" /></button></div>
}
