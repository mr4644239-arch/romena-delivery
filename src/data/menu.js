export const categories = [
  { id: 'all', label: 'Todos', eyebrow: 'O melhor da casa', icon: 'Sparkles' },
  { id: 'tradicionais', label: 'Tradicionais', eyebrow: 'Clássicos que abraçam', icon: 'Pizza' },
  { id: 'especiais', label: 'Especiais', eyebrow: 'Receitas autorais', icon: 'ChefHat' },
  { id: 'doces', label: 'Doces', eyebrow: 'Para fechar bonito', icon: 'CakeSlice' },
  { id: 'bebidas', label: 'Bebidas', eyebrow: 'Geladas de verdade', icon: 'CupSoda' },
  { id: 'combos', label: 'Combos', eyebrow: 'Mais sabor, melhor valor', icon: 'Boxes' }
]

export const menuItems = [
  {
    id: 'margherita',
    category: 'tradicionais',
    name: 'Margherita da Romena',
    description: 'Molho artesanal, muçarela fresca, tomate-cereja e manjericão.',
    price: 42.9,
    rating: 4.9,
    reviews: 128,
    tag: 'Mais pedida',
    tagTone: 'coral',
    visual: 'margherita'
  },
  {
    id: 'calabresa',
    category: 'tradicionais',
    name: 'Calabresa Crocante',
    description: 'Calabresa defumada, cebola roxa, muçarela e toque de orégano.',
    price: 44.9,
    rating: 4.8,
    reviews: 94,
    tag: 'Clássica',
    tagTone: 'gold',
    visual: 'calabresa'
  },
  {
    id: 'quatro-queijos',
    category: 'tradicionais',
    name: 'Quatro Queijos',
    description: 'Muçarela, provolone, gorgonzola e parmesão finalizados no forno.',
    price: 48.9,
    rating: 4.8,
    reviews: 81,
    tag: 'Cremosa',
    tagTone: 'cream',
    visual: 'cheese'
  },
  {
    id: 'romeu-julieta',
    category: 'doces',
    name: 'Romeu & Julieta',
    description: 'Muçarela cremosa, goiabada cascão e castanha tostada.',
    price: 46.9,
    rating: 4.9,
    reviews: 66,
    tag: 'Doce da casa',
    tagTone: 'coral',
    visual: 'sweet'
  },
  {
    id: 'caprese',
    category: 'especiais',
    name: 'Caprese Trufada',
    description: 'Burrata, tomate confitado, pesto fresco e azeite trufado.',
    price: 59.9,
    rating: 5.0,
    reviews: 53,
    tag: 'Premium',
    tagTone: 'gold',
    visual: 'caprese'
  },
  {
    id: 'carne-seca',
    category: 'especiais',
    name: 'Sertão Cremoso',
    description: 'Carne-seca desfiada, abóbora assada, catupiry e cebola crocante.',
    price: 57.9,
    rating: 4.9,
    reviews: 47,
    tag: 'Autoral',
    tagTone: 'coral',
    visual: 'sertão'
  },
  {
    id: 'pistache',
    category: 'doces',
    name: 'Pistache & Chocolate',
    description: 'Creme de chocolate branco, pistache e flor de sal.',
    price: 51.9,
    rating: 4.7,
    reviews: 39,
    tag: 'Novidade',
    tagTone: 'green',
    visual: 'pistache'
  },
  {
    id: 'coca',
    category: 'bebidas',
    name: 'Coca-Cola 350ml',
    description: 'Lata bem gelada para acompanhar a sua pizza.',
    price: 6.5,
    rating: 4.8,
    reviews: 120,
    tag: 'Gelada',
    tagTone: 'dark',
    visual: 'coke'
  },
  {
    id: 'mate',
    category: 'bebidas',
    name: 'Mate da Praia 1L',
    description: 'Mate natural, limão e muito gelo. Rende a mesa toda.',
    price: 12.9,
    rating: 4.8,
    reviews: 88,
    tag: 'Natural',
    tagTone: 'green',
    visual: 'mate'
  },
  {
    id: 'combo-roma',
    category: 'combos',
    name: 'Combo Roma',
    description: '1 pizza tradicional grande + 1 mate 1L + sobremesa mini.',
    price: 69.9,
    rating: 4.9,
    reviews: 105,
    tag: 'Economize 18%',
    tagTone: 'gold',
    visual: 'combo'
  },
  {
    id: 'combo-famiglia',
    category: 'combos',
    name: 'Famiglia Romena',
    description: '2 pizzas grandes + 1 bebida 1L + borda recheada em uma delas.',
    price: 109.9,
    rating: 4.9,
    reviews: 72,
    tag: 'Para dividir',
    tagTone: 'coral',
    visual: 'family'
  },
  {
    id: 'brownie',
    category: 'doces',
    name: 'Brownie de Forno',
    description: 'Brownie quentinho, chocolate intenso e calda de doce de leite.',
    price: 19.9,
    rating: 4.8,
    reviews: 58,
    tag: 'Final feliz',
    tagTone: 'cream',
    visual: 'brownie'
  }
]

export const promotions = [
  {
    id: 1,
    eyebrow: 'Oferta de hoje',
    title: 'A semana começa melhor com pizza.',
    text: 'Na compra de uma pizza grande, a borda recheada fica por nossa conta.',
    cta: 'Montar meu pedido',
    accent: 'coral',
    code: 'BORDA10'
  },
  {
    id: 2,
    eyebrow: 'Clube Romena',
    title: 'Seu próximo pedaço já está garantido.',
    text: 'Use ROMENA10 no checkout e ganhe 10% de desconto hoje.',
    cta: 'Quero meu desconto',
    accent: 'gold',
    code: 'ROMENA10'
  },
  {
    id: 3,
    eyebrow: 'Só nesta terça',
    title: 'Combo Roma por R$ 69,90.',
    text: 'Pizza grande, mate gelado e uma sobremesa mini para fechar.',
    cta: 'Ver combo',
    accent: 'green',
    code: 'COMBOROMA'
  }
]

export const testimonials = [
  {
    name: 'Marina Costa',
    handle: '@marinacosta',
    quote: 'A massa fina é realmente crocante e chega quentinha. Virou meu pedido oficial de sexta.',
    rating: 5,
    initials: 'MC',
    tone: 'coral'
  },
  {
    name: 'Rafael Nunes',
    handle: '@rafanunes',
    quote: 'O rastreio é muito claro e a pizza Sertão Cremoso é absurda de boa. Recomendo demais.',
    rating: 5,
    initials: 'RN',
    tone: 'gold'
  },
  {
    name: 'Bia Martins',
    handle: '@biapede',
    quote: 'Pedi pelo celular em menos de dois minutos. O brownie ainda chegou quentinho!',
    rating: 5,
    initials: 'BM',
    tone: 'green'
  }
]

export const productOptions = {
  sizes: [
    { id: 'P', label: 'P', description: '6 fatias · 1 pessoa', delta: -8 },
    { id: 'M', label: 'M', description: '8 fatias · 2 pessoas', delta: 0 },
    { id: 'G', label: 'G', description: '10 fatias · 3 pessoas', delta: 10 },
    { id: 'GG', label: 'GG', description: '12 fatias · 4 pessoas', delta: 18 }
  ],
  doughs: [
    { id: 'tradicional', label: 'Tradicional', delta: 0 },
    { id: 'fina', label: 'Fina', delta: 2 },
    { id: 'pan', label: 'Pan', delta: 4 }
  ],
  crusts: [
    { id: 'catupiry', label: 'Catupiry', delta: 8 },
    { id: 'cheddar', label: 'Cheddar', delta: 8 },
    { id: 'sem-borda', label: 'Sem borda', delta: 0 }
  ],
  extras: [
    { id: 'bacon', label: 'Bacon crocante', delta: 6 },
    { id: 'azeitona', label: 'Azeitona preta', delta: 3 },
    { id: 'tomate-seco', label: 'Tomate seco', delta: 5 },
    { id: 'pesto', label: 'Pesto da casa', delta: 4 }
  ]
}
