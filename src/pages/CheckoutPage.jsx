import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Clipboard, CreditCard, DollarSign, Home, Lock, MapPin, Smartphone, WalletCards } from 'lucide-react'
import { useAppStore, useCartSummary } from '../context/AppContext'
import { formatBRL, getInitials } from '../lib/formatters'

const paymentMethods = [
  { id: 'pix', label: 'PIX', description: 'Aprovação imediata', icon: Smartphone },
  { id: 'card', label: 'Cartão', description: 'Crédito ou débito', icon: CreditCard },
  { id: 'delivery', label: 'Na entrega', description: 'Dinheiro ou maquininha', icon: WalletCards }
]

const emptyAddress = { label: 'Casa', street: '', number: '', complement: '', neighborhood: '', city: 'São Paulo', zip: '' }

export function CheckoutPage({ onBack, onOrderCreated, onOpenAuth, newAddress = false }) {
  const user = useAppStore((state) => state.user)
  const addresses = useAppStore((state) => state.addresses)
  const saveAddress = useAppStore((state) => state.saveAddress)
  const createOrder = useAppStore((state) => state.createOrder)
  const setToast = useAppStore((state) => state.setToast)
  const cart = useAppStore((state) => state.cart)
  const summary = useCartSummary()
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState(addresses[0] ?? emptyAddress)
  const [isCreatingAddress, setIsCreatingAddress] = useState(newAddress)
  const [saveForLater, setSaveForLater] = useState(() => addresses.length === 0 || newAddress)
  const [payment, setPayment] = useState('pix')
  const [deliveryPayment, setDeliveryPayment] = useState('machine')
  const [changeFor, setChangeFor] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [pixCopied, setPixCopied] = useState(false)
  const [paymentTouched, setPaymentTouched] = useState(false)

  useEffect(() => {
    if (newAddress) {
      setIsCreatingAddress(true)
      setAddress({ ...emptyAddress })
    }
  }, [newAddress])

  useEffect(() => {
    if (!newAddress && !isCreatingAddress && !address.id && addresses.length > 0) setAddress({ ...addresses[0] })
  }, [addresses, address.id, isCreatingAddress, newAddress])

  const isAddressValid = address.street && address.number && address.neighborhood && address.zip
  const isCardValid = card.number.length === 16 && card.name && card.expiry.length >= 4 && card.cvv.length === 3
  const canContinuePayment = payment === 'card' ? isCardValid : payment === 'delivery' ? (deliveryPayment === 'machine' || changeFor) : true
  const maskedPix = useMemo(() => `00020126580014BR.GOV.BCB.PIX0136romena.delivery/${Math.random().toString(36).slice(2, 10)}`, [])

  const updateAddress = (field) => (event) => setAddress((current) => ({ ...current, [field]: event.target.value }))
  const updateDigits = (field, maxLength) => (event) => setAddress((current) => ({ ...current, [field]: event.target.value.replace(/\D/g, '').slice(0, maxLength) }))
  const updateCard = (field) => (event) => setCard((current) => ({ ...current, [field]: event.target.value }))
  const updateCardDigits = (field, maxLength) => (event) => setCard((current) => ({ ...current, [field]: event.target.value.replace(/\D/g, '').slice(0, maxLength) }))

  const goPayment = (event) => {
    event.preventDefault()
    if (!isAddressValid) {
      setToast({ title: 'Confira o endereço', message: 'Preencha rua, número, bairro e CEP para continuar.', type: 'error' })
      return
    }
    if (saveForLater && isCreatingAddress) saveAddress(address)
    setStep(2)
  }

  const goReview = (event) => {
    event.preventDefault()
    setPaymentTouched(true)
    if (!canContinuePayment) {
      setToast({ title: 'Falta um detalhe do pagamento', message: 'Revise os campos destacados e tente novamente.', type: 'error' })
      return
    }
    setStep(3)
  }

  const finishOrder = () => {
    if (!user) {
      onOpenAuth()
      setToast({ title: 'Entre para confirmar', message: 'Assim você consegue acompanhar o pedido depois.' })
      return
    }
    const order = createOrder({ address, payment: payment === 'delivery' ? `Na entrega · ${deliveryPayment === 'cash' ? 'Dinheiro' : 'Maquininha'}` : payment === 'pix' ? 'PIX' : 'Cartão', changeFor })
    onOrderCreated(order)
  }

  if (cart.length === 0) return <main className="checkout-page"><div className="container"><div className="empty-state empty-state--checkout"><div className="empty-state__icon"><ShoppingBagIcon /></div><h2>Seu carrinho está vazio.</h2><p>Volte ao cardápio e monte um pedido antes de finalizar.</p><button className="primary-button" onClick={onBack}>Voltar ao cardápio <ArrowRight size={17} /></button></div></div></main>

  return <main className="checkout-page"><div className="container checkout-layout"><div className="checkout-main"><button className="back-link" onClick={step === 1 ? onBack : () => setStep((current) => current - 1)}><ArrowLeft size={16} /> {step === 1 ? 'Voltar ao carrinho' : 'Voltar'}</button><div className="checkout-heading"><span className="eyebrow">Quase lá</span><h1>Finalize com calma.</h1><p>Falta pouco para o forno acender para você.</p></div><div className="checkout-steps"><CheckoutStep step="01" label="Entrega" active={step >= 1} current={step === 1} /><span className="checkout-steps__line" /><CheckoutStep step="02" label="Pagamento" active={step >= 2} current={step === 2} /><span className="checkout-steps__line" /><CheckoutStep step="03" label="Revisão" active={step >= 3} current={step === 3} /></div>{step === 1 && <form className="checkout-card" onSubmit={goPayment}><div className="checkout-card__heading"><span className="checkout-card__icon"><MapPin size={19} /></span><div><h2>Onde entregamos?</h2><p>Por enquanto, atendemos São Paulo e região.</p></div></div>{addresses.length > 0 && <div className="saved-addresses"><span className="field-label__hint">Escolha o endereço desta entrega</span><div className="saved-address-list">{addresses.map((saved) => <button type="button" key={saved.id} className={address.id === saved.id ? 'saved-address saved-address--active' : 'saved-address'} onClick={() => { setIsCreatingAddress(false); setSaveForLater(false); setAddress({ ...saved }) }}><Home size={16} /><span><strong>{saved.label}</strong><small>{saved.street}, {saved.number} · {saved.neighborhood}</small></span>{address.id === saved.id && <Check size={16} />}</button>)}</div><button type="button" className="secondary-button secondary-button--address" onClick={() => { setIsCreatingAddress(true); setSaveForLater(true); setAddress({ ...emptyAddress }) }}>+ Cadastrar outro endereço</button></div>}<div className="form-grid"><label className="field-label field-label--full"><span>Nome do endereço</span><input value={address.label} disabled={!isCreatingAddress} onChange={updateAddress('label')} placeholder="Ex.: Casa, trabalho..." /></label><label className="field-label"><span>CEP</span><input value={address.zip} disabled={!isCreatingAddress} onChange={updateDigits('zip', 8)} placeholder="00000-000" maxLength={8} inputMode="numeric" pattern="[0-9]*" /></label><label className="field-label"><span>Rua e avenida</span><input value={address.street} disabled={!isCreatingAddress} onChange={updateAddress('street')} placeholder="Rua das Flores" /></label><label className="field-label"><span>Número</span><input value={address.number} disabled={!isCreatingAddress} onChange={updateDigits('number', 3)} placeholder="123" maxLength={3} inputMode="numeric" pattern="[0-9]*" /></label><label className="field-label"><span>Complemento <small>opcional</small></span><input value={address.complement} disabled={!isCreatingAddress} onChange={updateAddress('complement')} placeholder="Apto, bloco..." /></label><label className="field-label field-label--full"><span>Bairro</span><input value={address.neighborhood} disabled={!isCreatingAddress} onChange={updateAddress('neighborhood')} placeholder="Seu bairro" /></label><label className="field-label"><span>Cidade</span><input value={address.city} disabled={!isCreatingAddress} onChange={updateAddress('city')} /></label></div>{isCreatingAddress && <label className="checkbox-line"><input type="checkbox" checked={saveForLater} onChange={(event) => setSaveForLater(event.target.checked)} /><span className="checkbox-custom"><Check size={13} /></span>Salvar este endereço para o próximo pedido</label>}<button className="primary-button primary-button--wide" type="submit">Continuar para pagamento <ArrowRight size={17} /></button></form>}{step === 2 && <form className="checkout-card" onSubmit={goReview}><div className="checkout-card__heading"><span className="checkout-card__icon"><WalletCards size={19} /></span><div><h2>Como prefere pagar?</h2><p>Escolha o jeito mais confortável para você.</p></div></div><div className="payment-methods">{paymentMethods.map(({ id, label, description, icon: Icon }) => <button type="button" key={id} className={payment === id ? 'payment-method payment-method--active' : 'payment-method'} onClick={() => setPayment(id)}><span className="payment-method__icon"><Icon size={19} /></span><span><strong>{label}</strong><small>{description}</small></span>{payment === id && <Check size={16} />}</button>)}</div>{payment === 'pix' && <PixPanel copied={pixCopied} onCopy={() => { navigator.clipboard?.writeText(maskedPix); setPixCopied(true) }} />}{payment === 'card' && <CardPanel card={card} updateCard={updateCard} updateCardDigits={updateCardDigits} showValidation={paymentTouched} />}{payment === 'delivery' && <DeliveryPayment method={deliveryPayment} setMethod={setDeliveryPayment} changeFor={changeFor} setChangeFor={setChangeFor} />}<button className="primary-button primary-button--wide" type="submit">Revisar pedido <ArrowRight size={17} /></button></form>}{step === 3 && <div className="checkout-card review-card"><div className="checkout-card__heading"><span className="checkout-card__icon"><Check size={19} /></span><div><h2>Confira tudo antes de pedir.</h2><p>Você está a um clique da primeira mordida.</p></div></div><ReviewRow icon={<MapPin size={17} />} title="Entrega em" value={`${address.street}, ${address.number} · ${address.neighborhood}`} onEdit={() => setStep(1)} /><ReviewRow icon={payment === 'pix' ? <Smartphone size={17} /> : <CreditCard size={17} />} title="Pagamento" value={payment === 'pix' ? 'PIX' : payment === 'card' ? `Cartão final ${card.number.slice(-4) || '••••'}` : `Na entrega · ${deliveryPayment === 'cash' ? 'Dinheiro' : 'Maquininha'}`} onEdit={() => setStep(2)} /><div className="review-items">{cart.map((item) => <div key={item.cartId}><span>{item.quantity}x {item.name}</span><strong>{formatBRL(item.unitPrice * item.quantity)}</strong></div>)}</div><div className="review-total"><span>Total do pedido</span><strong>{formatBRL(summary.total)}</strong></div><button className="primary-button primary-button--wide" onClick={finishOrder}>Confirmar pedido <ArrowRight size={17} /></button><p className="secure-note"><Lock size={13} /> Seus dados estão protegidos nesta demonstração.</p></div>}</div><aside className="checkout-summary"><div className="checkout-summary__top"><span className="eyebrow">Resumo</span><h2>Seu pedido <span>({summary.itemCount})</span></h2></div><div className="checkout-summary__items">{cart.map((item) => <div className="checkout-summary__item" key={item.cartId}><span className="summary-qty">{item.quantity}x</span><div><strong>{item.name}</strong><small>{item.size} · {item.dough}</small></div><b>{formatBRL(item.unitPrice * item.quantity)}</b></div>)}</div><div className="summary-lines"><div><span>Subtotal</span><strong>{formatBRL(summary.subtotal)}</strong></div><div><span>Entrega</span><strong className={summary.deliveryFee === 0 ? 'free-label' : ''}>{summary.deliveryFee === 0 ? 'Grátis' : formatBRL(summary.deliveryFee)}</strong></div>{summary.discount > 0 && <div><span>Desconto</span><strong className="discount-label">-{formatBRL(summary.discount)}</strong></div>}<div className="summary-total"><span>Total</span><strong>{formatBRL(summary.total)}</strong></div></div><div className="checkout-summary__promise"><span>✦</span><div><strong>Chega em até 35 min</strong><small>Após a confirmação do pagamento</small></div></div></aside></div></main>
}

function CheckoutStep({ step, label, active, current }) { return <div className={`checkout-step ${active ? 'checkout-step--active' : ''} ${current ? 'checkout-step--current' : ''}`}><span>{active && !current ? <Check size={14} /> : step}</span><small>{label}</small></div> }
function ReviewRow({ icon, title, value, onEdit }) { return <div className="review-row"><span className="review-row__icon">{icon}</span><div><small>{title}</small><strong>{value}</strong></div><button onClick={onEdit}>Editar</button></div> }
function PixPanel({ copied, onCopy }) { return <div className="pix-panel"><div className="qr-code" aria-label="QR Code Pix simulado"><div className="qr-corner qr-corner--a" /><div className="qr-corner qr-corner--b" /><div className="qr-corner qr-corner--c" /><div className="qr-noise">{Array.from({ length: 48 }).map((_, index) => <i key={index} style={{ opacity: ((index * 17) % 10) / 10 + 0.1 }} />)}</div><span>PIX</span></div><div><span className="eyebrow">QR Code simulado</span><h3>Pague pelo app do seu banco</h3><p>Abra o aplicativo, escaneie o código e pronto. O pedido é confirmado em segundos.</p><button type="button" className="copy-pix" onClick={onCopy}><Clipboard size={15} />{copied ? 'Chave copiada!' : 'Copiar chave PIX'}</button></div></div> }
function CardPanel({ card, updateCard, updateCardDigits, showValidation }) {
  const numberValid = card.number.replace(/\D/g, '').length >= 12
  const nameValid = card.name.trim().length >= 3
  const expiryValid = card.expiry.length >= 4
  const cvvValid = card.cvv.length >= 3
  const stateClass = (valid) => showValidation ? (valid ? ' field-label--valid' : ' field-label--invalid') : ''
  return <div className="card-panel"><label className={`field-label field-label--full${stateClass(numberValid)}`}><span>Número do cartão</span><div className="input-with-icon"><CreditCard size={17} /><input value={card.number} onChange={updateCardDigits('number', 16)} placeholder="0000 0000 0000 0000" maxLength={16} inputMode="numeric" pattern="[0-9]*" /></div>{showValidation && !numberValid && <small className="field-error">Digite os 16 números do cartão.</small>}</label><div className="form-grid"><label className={`field-label${stateClass(nameValid)}`}><span>Nome impresso</span><input value={card.name} onChange={updateCard('name')} placeholder="SEU NOME" />{showValidation && !nameValid && <small className="field-error">Informe o nome do titular.</small>}</label><label className={`field-label${stateClass(expiryValid)}`}><span>Validade</span><input value={card.expiry} onChange={updateCardDigits('expiry', 4)} placeholder="MMAA" maxLength={4} inputMode="numeric" pattern="[0-9]*" />{showValidation && !expiryValid && <small className="field-error">Use 4 números: MMAA.</small>}</label><label className={`field-label${stateClass(cvvValid)}`}><span>CVV</span><input value={card.cvv} onChange={updateCardDigits('cvv', 3)} placeholder="123" maxLength={3} inputMode="numeric" pattern="[0-9]*" />{showValidation && !cvvValid && <small className="field-error">Informe os 3 números do CVV.</small>}</label></div><span className="secure-note"><Lock size={13} /> Ambiente seguro de demonstração</span></div>
}
function DeliveryPayment({ method, setMethod, changeFor, setChangeFor }) { return <div className="delivery-payment"><div className="choice-row"><button type="button" className={method === 'machine' ? 'choice-pill choice-pill--active' : 'choice-pill'} onClick={() => setMethod('machine')}><WalletCards size={15} /> Maquininha</button><button type="button" className={method === 'cash' ? 'choice-pill choice-pill--active' : 'choice-pill'} onClick={() => setMethod('cash')}><DollarSign size={15} /> Dinheiro</button></div>{method === 'cash' && <label className="field-label"><span>Troco para quanto?</span><div className="input-with-icon"><DollarSign size={17} /><input value={changeFor} onChange={(event) => setChangeFor(event.target.value.replace(/[^0-9,]/g, '').slice(0, 6))} placeholder="Ex.: 100,00" maxLength={6} inputMode="decimal" /></div></label>}</div> }
function ShoppingBagIcon() { return <span className="bag-icon">⌁</span> }
