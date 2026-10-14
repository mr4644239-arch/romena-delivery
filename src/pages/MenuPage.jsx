import { useMemo, useState } from 'react'
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { categories, menuItems } from '../data/menu'
import { ProductCard } from '../components/ProductCard'

export function MenuPage({ onCustomize, initialCategory = 'all' }) {
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')
  const [price, setPrice] = useState('all')
  const [sort, setSort] = useState('featured')

  const visibleItems = useMemo(() => {
    const filtered = menuItems.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category
      const matchesSearch = `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())
      const matchesPrice = price === 'all' || (price === 'under-40' ? item.price < 40 : price === '40-55' ? item.price >= 40 && item.price <= 55 : item.price > 55)
      return matchesCategory && matchesSearch && matchesPrice
    })
    return [...filtered].sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : b.rating - a.rating)
  }, [category, price, search, sort])

  return <main className="menu-page"><div className="container"><div className="page-intro"><div><span className="eyebrow"><span className="eyebrow-dot" /> Nosso cardápio</span><h1>Escolha o seu <em>próximo sabor.</em></h1><p>Receitas que respeitam o tempo, ingredientes e a sua fome.</p></div><div className="menu-page__note"><span>✦</span><div><strong>Todos os dias, fresquinha</strong><small>Pedidos a partir das 18h</small></div></div></div><div className="menu-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar pizza, bebida..." />{search && <button onClick={() => setSearch('')} aria-label="Limpar busca"><X size={15} /></button>}</div><div className="filter-select"><SlidersHorizontal size={16} /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar produtos"><option value="featured">Mais pedidos</option><option value="price-low">Menor preço</option><option value="price-high">Maior preço</option></select></div><div className="filter-select"><Filter size={16} /><select value={price} onChange={(event) => setPrice(event.target.value)} aria-label="Filtrar por preço"><option value="all">Qualquer preço</option><option value="under-40">Até R$ 40</option><option value="40-55">R$ 40 a R$ 55</option><option value="over-55">Acima de R$ 55</option></select></div></div><div className="category-tabs" role="tablist">{categories.map((item) => <button key={item.id} className={category === item.id ? 'category-tab category-tab--active' : 'category-tab'} onClick={() => setCategory(item.id)} role="tab" aria-selected={category === item.id}>{item.label}<span>{item.id === 'all' ? menuItems.length : menuItems.filter((product) => product.category === item.id).length}</span></button>)}</div><div className="menu-results-heading"><p><strong>{visibleItems.length}</strong> sabores encontrados {search && <>para <strong>“{search}”</strong></>}</p><span>Toque em personalizar para montar o seu</span></div>{visibleItems.length > 0 ? <div className="product-grid">{visibleItems.map((product) => <ProductCard key={product.id} product={product} onCustomize={onCustomize} />)}</div> : <div className="empty-state empty-state--menu"><div className="empty-state__icon"><Search size={28} /></div><h3>Nada apareceu por aqui.</h3><p>Tente outro termo ou remova os filtros para encontrar seu próximo sabor.</p><button className="secondary-button" onClick={() => { setSearch(''); setPrice('all'); setCategory('all') }}>Limpar filtros</button></div>}</div></main>
}
