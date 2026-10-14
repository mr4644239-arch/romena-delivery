import React from 'react'

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    window.localStorage.removeItem('romena-delivery-store')
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#fffaf3', color: '#292322', fontFamily: 'DM Sans, sans-serif' }}>
        <section style={{ maxWidth: 520, padding: 32, textAlign: 'center', background: '#fff', border: '1px solid #e9dfd4', borderRadius: 18, boxShadow: '0 20px 60px rgba(65,39,27,.1)' }}>
          <div style={{ margin: '0 auto 16px', fontSize: 40 }}>🍕</div>
          <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 34 }}>Vamos reabrir a cozinha.</h1>
          <p style={{ color: '#817771', lineHeight: 1.6 }}>O site encontrou um erro inesperado. Tente recarregar ou limpar os dados locais desta demonstração.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 22 }}>
            <button onClick={this.handleReload} style={{ padding: '12px 18px', color: '#fff', background: '#ee5a38', border: 0, borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Recarregar site</button>
            <button onClick={this.handleReset} style={{ padding: '12px 18px', color: '#292322', background: '#f7f0e7', border: '1px solid #e9dfd4', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Limpar dados locais</button>
          </div>
          {import.meta.env.DEV && this.state.error && <pre style={{ marginTop: 20, padding: 12, overflow: 'auto', color: '#cf4027', background: '#fff0eb', textAlign: 'left', fontSize: 11, borderRadius: 8 }}>{this.state.error.message}</pre>}
        </section>
      </main>
    )
  }
}
