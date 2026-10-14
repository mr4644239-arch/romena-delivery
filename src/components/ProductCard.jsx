import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, CirclePlus, Minus, Plus, Star, X } from 'lucide-react'
import { productOptions } from '../data/menu'
import { useAppStore } from '../context/AppContext'
import { formatBRL } from '../lib/formatters'

const visualImage = {
  margherita: 'margherita.png',
  calabresa: 'calabresa.png',
  cheese: 'quatro-queijos.png',
  sweet: 'romeu-julieta.png',
  caprese: 'caprese.png',
  'sertão': 'carne-seca.png',
  pistache: 'pistache.png',
  coke: 'coca.png',
  mate: 'mate.png',
  combo: 'combo-roma.png',
  family: 'combo-famiglia.png',
  brownie: 'brownie.png'
}

export function ProductVisual({ product, large = false }) {
  return (
    <div className={`product-visual product-visual--${product.visual} ${large ? 'product-visual--large' : ''}`}>
      <span className="product-visual__shine" />
      <img className="product-visual__image" src={`${import.meta.env.BASE_URL}images/products/${visualImage[product.visual] ?? 'margherita.png'}`} alt={product.name ?? 'Produto Romena'} />
      <span className="product-visual__slice product-visual__slice--one" />
      <span className="product-visual__slice product-visual__slice--two" />
      <span className="product-visual__herb">✦</span>
    </div>
  )
}

export function ProductCard({ product, onCustomize }) {
  const addToCart = useAppStore((state) => state.addToCart)
  const setToast = useAppStore((state) => state.setToast)
  const customizable = ['tradicionais', 'especiais'].includes(product.category) || ['romeu-julieta', 'pistache'].includes(product.id)

  const quickAdd = () => {
    addToCart(product)
    setToast({ title: 'Adicionado ao pedido', message: `${product.name} entrou no seu carrinho.` })
  }

  return (
    <motion.article className="product-card" layout whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <div className="product-card__media">
        <ProductVisual product={product} />
        <span className={`product-tag product-tag--${product.tagTone}`}>{product.tag}</span>
        <button className="product-card__quick" onClick={quickAdd} aria-label={`Adicionar ${product.name} rapidamente`}>
          <Plus size={19} />
        </button>
      </div>
      <div className="product-card__body">
        <div className="product-rating"><Star size={14} fill="currentColor" /><span>{product.rating}</span><small>({product.reviews})</small></div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-card__footer">
          <strong>{formatBRL(product.price)}</strong>
          <button className="text-action" onClick={() => customizable ? onCustomize(product) : quickAdd()}>{customizable ? <>Personalizar <span>→</span></> : <>Adicionar <span>+</span></>}</button>
        </div>
      </div>
    </motion.article>
  )
}

export function ProductModal({ product, onClose }) {
  const addToCart = useAppStore((state) => state.addToCart)
  const setToast = useAppStore((state) => state.setToast)
  const [size, setSize] = useState('M')
  const [dough, setDough] = useState('tradicional')
  const [crust, setCrust] = useState('sem-borda')
  const [extras, setExtras] = useState([])
  const [notes, setNotes] = useState('')
  const [quantity, setQuantity] = useState(1)

  const currentPrice = useMemo(() => {
    const sizeDelta = productOptions.sizes.find((option) => option.id === size)?.delta ?? 0
    const doughDelta = productOptions.doughs.find((option) => option.id === dough)?.delta ?? 0
    const crustDelta = productOptions.crusts.find((option) => option.id === crust)?.delta ?? 0
    const extrasDelta = extras.reduce((sum, extraId) => sum + (productOptions.extras.find((extra) => extra.id === extraId)?.delta ?? 0), 0)
    return product.price + sizeDelta + doughDelta + crustDelta + extrasDelta
  }, [crust, dough, extras, product.price, size])

  const toggleExtra = (id) => setExtras((current) => current.includes(id) ? current.filter((extra) => extra !== id) : [...current, id])

  const handleAdd = () => {
    addToCart(product, { size, dough, crust, extras, notes, quantity, unitPrice: currentPrice })
    setToast({ title: 'Pedido montado!', message: `${quantity}x ${product.name} foi adicionado ao carrinho.` })
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
        <motion.section className="custom-modal" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} role="dialog" aria-modal="true" aria-label={`Personalizar ${product.name}`}>
          <button className="modal-close" onClick={onClose} aria-label="Fechar modal"><X size={20} /></button>
          <div className="custom-modal__hero">
            <ProductVisual product={product} large />
            <div>
              <span className="eyebrow">Monte do seu jeito</span>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div className="product-rating"><Star size={14} fill="currentColor" /><span>{product.rating}</span><small>{product.reviews} avaliações</small></div>
            </div>
          </div>
          <div className="custom-modal__content">
            <OptionGroup title="Escolha o tamanho" hint="A fome manda">
              <div className="option-grid option-grid--sizes">{productOptions.sizes.map((option) => <ChoiceCard key={option.id} active={size === option.id} onClick={() => setSize(option.id)} title={option.label} description={option.description} suffix={option.delta > 0 ? `+${formatBRL(option.delta)}` : option.delta < 0 ? formatBRL(option.delta) : 'base'} />)}</div>
            </OptionGroup>
            <OptionGroup title="Escolha a massa">
              <div className="choice-row">{productOptions.doughs.map((option) => <ChoicePill key={option.id} active={dough === option.id} onClick={() => setDough(option.id)} label={option.label} extra={option.delta ? `+${formatBRL(option.delta)}` : ''} />)}</div>
            </OptionGroup>
            <OptionGroup title="Escolha a borda">
              <div className="choice-row">{productOptions.crusts.map((option) => <ChoicePill key={option.id} active={crust === option.id} onClick={() => setCrust(option.id)} label={option.label} extra={option.delta ? `+${formatBRL(option.delta)}` : ''} />)}</div>
            </OptionGroup>
            <OptionGroup title="Adicionais" hint="Opcional">
              <div className="extras-grid">{productOptions.extras.map((option) => <button key={option.id} className={`extra-option ${extras.includes(option.id) ? 'extra-option--active' : ''}`} onClick={() => toggleExtra(option.id)}><span>{extras.includes(option.id) ? <Check size={15} /> : <CirclePlus size={15} />}</span>{option.label}<small>+{formatBRL(option.delta)}</small></button>)}</div>
            </OptionGroup>
            <label className="field-label">Alguma observação?
              <textarea rows="2" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ex.: cortar em 8 pedaços, pouco molho..." />
            </label>
          </div>
          <div className="custom-modal__footer">
            <div className="quantity-control"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuir quantidade"><Minus size={16} /></button><strong>{quantity}</strong><button onClick={() => setQuantity((value) => value + 1)} aria-label="Aumentar quantidade"><Plus size={16} /></button></div>
            <button className="primary-button primary-button--wide" onClick={handleAdd}>Adicionar · {formatBRL(currentPrice * quantity)}</button>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  )
}

function OptionGroup({ title, hint, children }) {
  return <div className="option-group"><div className="option-group__heading"><h3>{title}</h3>{hint && <span>{hint}</span>}</div>{children}</div>
}

function ChoiceCard({ active, onClick, title, description, suffix }) {
  return <button className={`choice-card ${active ? 'choice-card--active' : ''}`} onClick={onClick}><span className="choice-card__radio" /> <span><strong>{title}</strong><small>{description}</small></span><em>{suffix}</em></button>
}

function ChoicePill({ active, onClick, label, extra }) {
  return <button className={`choice-pill ${active ? 'choice-pill--active' : ''}`} onClick={onClick}>{active && <Check size={14} />}{label}{extra && <small>{extra}</small>}</button>
}
