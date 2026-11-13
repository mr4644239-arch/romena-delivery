import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound, X } from 'lucide-react'
import { useAppStore } from '../context/AppContext'

export function AuthModal({ open, onClose }) {
  const signIn = useAppStore((state) => state.signIn)
  const setToast = useAppStore((state) => state.setToast)
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.email || !form.password || (mode === 'signup' && !form.name)) return
    signIn({ name: form.name, email: form.email })
    setToast({ title: mode === 'login' ? 'Que bom ter você de volta!' : 'Conta criada com carinho.', message: 'Seu perfil já está pronto para o próximo pedido.' })
    onClose()
  }

  const handleSocial = () => {
    signIn({ name: 'Visitante Romena', email: 'visitante@romena.delivery' })
    setToast({ title: 'Login de demonstração concluído', message: 'O Google fictício foi conectado com sucesso.' })
    onClose()
  }

  return <AnimatePresence>{open && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}><motion.section className="auth-modal" initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} role="dialog" aria-modal="true" aria-label="Autenticação"><button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={20} /></button><div className="auth-modal__intro"><span className="auth-orb">R</span><span className="eyebrow">Clube Romena</span><h2>{mode === 'login' ? 'Bom te ver por aqui.' : 'Faça parte da mesa.'}</h2><p>{mode === 'login' ? 'Entre para acompanhar pedidos e salvar seus endereços.' : 'Crie sua conta para pedir mais rápido na próxima vez.'}</p></div><div className="auth-tabs"><button className={mode === 'login' ? 'auth-tab--active' : ''} onClick={() => setMode('login')}>Entrar</button><button className={mode === 'signup' ? 'auth-tab--active' : ''} onClick={() => setMode('signup')}>Criar conta</button></div><form className="auth-form" onSubmit={handleSubmit}>{mode === 'signup' && <label className="field-label"><span>Como podemos te chamar?</span><div className="input-with-icon"><UserRound size={17} /><input value={form.name} onChange={update('name')} placeholder="Seu nome" autoComplete="name" /></div></label>}<label className="field-label"><span>E-mail</span><div className="input-with-icon"><Mail size={17} /><input type="email" value={form.email} onChange={update('email')} placeholder="voce@email.com" autoComplete="email" /></div></label><label className="field-label"><span>Senha</span><div className="input-with-icon"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label="Mostrar senha">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{mode === 'login' && <button className="forgot-password" type="button">Esqueci minha senha</button>}<button className="primary-button primary-button--wide" type="submit">{mode === 'login' ? 'Entrar na minha conta' : 'Criar minha conta'} <ArrowRight size={17} /></button></form><div className="auth-divider"><span>ou continue com</span></div><button className="social-button" onClick={handleSocial}><span className="social-button__g">G</span> Google (demonstração)</button><small className="auth-legal">Ao continuar, você concorda com os termos da Romena & Delivery.</small></motion.section></motion.div>}</AnimatePresence>
}
