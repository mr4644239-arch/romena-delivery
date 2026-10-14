# Romena & Delivery

Aplicação web responsiva de delivery de pizzaria, construída com React + Vite. O projeto funciona como um protótipo completo de produto: cardápio, personalização, carrinho, checkout, autenticação fictícia, PIX simulado, histórico e rastreamento de pedidos.

## Stack

- React 18 + Vite
- Zustand com `persist` para estado global e `localStorage`
- Framer Motion para animações de interface
- Lucide React para ícones
- CSS modular global, sem dependência de backend

## Rodar no VS Code

```bash
# 1. Clone o projeto
 git clone <URL-DO-SEU-REPOSITORIO> romena-delivery
 cd romena-delivery

# 2. Instale as dependências
 npm install

# 3. Inicie o servidor de desenvolvimento
 npm run dev
```

Abra o endereço exibido pelo Vite (normalmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```text
src/
├── components/       # Header, cards, modais, drawer e elementos compartilhados
├── context/          # Store Zustand e persistência local
├── data/             # Produtos, categorias, promoções e depoimentos mockados
├── lib/              # Formatadores e regras pequenas de domínio
├── pages/            # Home, cardápio, checkout, perfil e rastreamento
├── App.jsx           # Shell da aplicação e navegação de alto nível
├── main.jsx          # Bootstrap do React
└── styles.css        # Sistema visual responsivo
public/
└── manus-routes.json # Manifesto das rotas da aplicação
```

## Dados e autenticação

Não existe backend nesta versão. O login, cadastro, carrinho, endereços e pedidos são simulados e persistidos na chave `romena-delivery-store` do `localStorage`. O botão de login social também é propositalmente fictício para fins de demonstração.

## Fluxos implementados

- Cardápio com busca, categorias e filtro de preço.
- Modal de customização com tamanho, massa, borda, adicionais e observações.
- Carrinho com atualização de quantidade, cupom (`ROMENA10`) e cálculo de entrega.
- Checkout em três etapas: endereço, pagamento e revisão.
- PIX com QR Code visual simulado e chave copiável.
- Cartão com validação visual básica e pagamento na entrega.
- Timeline de rastreamento com atualização simulada por tempo.
- Perfil com histórico de pedidos e endereços salvos.
- Depoimentos, promoções em carrossel e atalho flutuante para WhatsApp.

## Estabilidade

- O resumo do carrinho usa seletores simples e memoização para evitar loops de renderização no React.
- O carrinho foi testado com adição de produto, abertura do drawer e persistência após recarregar a página.
- Existe um `ErrorBoundary` com ações de recarga e limpeza do armazenamento local para evitar uma tela branca em caso de erro inesperado.
