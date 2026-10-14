# Guia de apresentação — Romena & Delivery

Este documento explica como o sistema funciona por dentro e serve como roteiro para uma demonstração em sala de aula.

## 1. O que foi desenvolvido

O Romena & Delivery é um protótipo funcional de delivery de pizzaria. O usuário consegue:

1. Navegar pelo cardápio.
2. Buscar produtos e filtrar por categoria e preço.
3. Personalizar uma pizza.
4. Adicionar produtos ao carrinho.
5. Alterar quantidades e aplicar cupom.
6. Informar endereço de entrega.
7. Escolher PIX, cartão ou pagamento na entrega.
8. Confirmar um pedido simulado.
9. Acompanhar o pedido por uma timeline.
10. Consultar perfil, endereços e histórico.

> A aplicação é um protótipo front-end. Não existe servidor real nem cobrança financeira. Os dados são simulados e ficam salvos no navegador.

## 2. Tecnologias e motivo da escolha

- **React:** divide a interface em componentes reutilizáveis e atualiza a tela quando o estado muda.
- **Vite:** executa o servidor de desenvolvimento e gera a versão otimizada de produção.
- **Zustand:** mantém o estado global do carrinho, usuário, endereços e pedidos.
- **localStorage:** mantém os dados depois de atualizar a página.
- **Framer Motion:** anima transições de páginas e elementos da interface.
- **Lucide React:** fornece ícones consistentes.
- **CSS:** controla responsividade, cores, espaçamentos, modais e estados visuais.

## 3. Como a aplicação começa

O ponto de entrada é `src/main.jsx`.

Ele importa o CSS global, cria a raiz do React e renderiza o componente `App`. O `ErrorBoundary` envolve a aplicação para mostrar uma tela de recuperação caso aconteça um erro inesperado em vez de deixar uma tela branca.

Fluxo inicial:

```text
index.html
   ↓
src/main.jsx
   ↓
ErrorBoundary
   ↓
App.jsx
   ↓
Página atual + componentes compartilhados
```

## 4. Navegação

O arquivo `src/App.jsx` funciona como o shell da aplicação. Ele controla qual página está ativa:

- `/` — início
- `/cardapio` — cardápio
- `/checkout` — finalização do pedido
- `/perfil` — perfil do usuário
- `/rastreio` — acompanhamento do pedido

A navegação usa a History API do navegador. Isso permite trocar a URL sem recarregar toda a aplicação.

O `App` também controla a abertura do carrinho, login, personalização de produto e rastreamento.

## 5. Estado global e persistência

O arquivo principal do estado é `src/context/AppContext.jsx`.

A store mantém dados como:

```text
cart       → produtos e quantidades
user       → usuário autenticado fictício
addresses  → endereços salvos
orders     → pedidos criados
```

O Zustand atualiza os componentes que usam esses dados. O middleware `persist` salva tudo na chave:

```text
romena-delivery-store
```

Por isso, ao atualizar a página, o carrinho e os dados simulados continuam disponíveis.

Para limpar os dados durante uma demonstração, abra o Console do navegador e execute:

```js
localStorage.removeItem('romena-delivery-store')
location.reload()
```

## 6. Cardápio e imagens

Os produtos ficam em `src/data/menu.js`. Cada item contém:

- `id`
- `category`
- `name`
- `description`
- `price`
- `rating`
- `visual`

O componente `src/components/ProductCard.jsx` recebe um produto e renderiza seu card. O campo `visual` determina a imagem exibida em `public/images/products/`.

Exemplo:

```js
{
  id: 'calabresa',
  category: 'tradicionais',
  name: 'Calabresa Crocante',
  price: 44.9,
  visual: 'calabresa'
}
```

A imagem correspondente é:

```text
public/images/products/calabresa.png
```

## 7. Personalização da pizza

Ao clicar em “Personalizar”, o `ProductModal` é aberto.

Esse modal permite selecionar:

- tamanho: P, M, G ou GG;
- massa: tradicional, fina ou pan;
- borda: Catupiry, cheddar ou sem borda;
- adicionais;
- observações.

Quando o usuário confirma, o componente monta um objeto com as escolhas e chama a ação de adicionar ao carrinho na store.

Bebidas, doces e combos podem ser adicionados rapidamente sem abrir o configurador de pizza.

## 8. Carrinho e cálculo do pedido

O `CartDrawer` mostra os itens persistidos na store. Ele permite:

- aumentar quantidade;
- diminuir quantidade;
- remover produto;
- inserir cupom;
- iniciar o checkout.

O resumo calcula:

```text
subtotal = soma do preço × quantidade
entrega  = taxa definida pela regra do protótipo
cupom    = desconto aplicável
total    = subtotal + entrega - desconto
```

As funções de formatação monetária ficam em `src/lib/formatters.js`.

## 9. Checkout

O checkout está em `src/pages/CheckoutPage.jsx` e possui três etapas:

### Etapa 1 — Entrega

O usuário informa nome do endereço, CEP, rua, número, complemento, bairro e cidade. Também pode salvar o endereço.

Os campos numéricos possuem limites:

- CEP: 8 dígitos;
- número da casa: 3 dígitos;
- cartão: 16 dígitos;
- validade: 4 dígitos;
- CVV: 3 dígitos.

### Etapa 2 — Pagamento

Há três opções simuladas:

- **PIX:** mostra QR Code visual e permite copiar uma chave fictícia;
- **Cartão:** valida número, nome, validade e CVV visualmente;
- **Na entrega:** permite escolher dinheiro ou maquininha.

### Etapa 3 — Revisão

O sistema mostra endereço, forma de pagamento, produtos e total. Ao confirmar, cria um pedido simulado e salva o pedido na store.

## 10. Rastreamento

Depois da confirmação, o pedido é enviado para `TrackingPage`.

A timeline mostra quatro estados:

```text
Pedido confirmado
      ↓
Em preparação no forno
      ↓
Saiu para entrega
      ↓
Entregue
```

O avanço é simulado pelo tempo. Em um sistema real, esses estados viriam de uma API ou de atualizações do restaurante e do entregador.

## 11. Autenticação e perfil

A autenticação está em `AuthModal.jsx` e é propositalmente fictícia. Ela demonstra o fluxo de entrar e criar conta sem enviar senha para um servidor.

O perfil usa `ProfilePage.jsx` para exibir:

- dados do usuário;
- endereços salvos;
- pedidos anteriores;
- acesso ao rastreamento.

Em uma aplicação real, a senha nunca deveria ser guardada diretamente no `localStorage`; seria usado um backend com autenticação segura.

## 12. Roteiro de demonstração

Uma apresentação rápida pode seguir esta sequência:

1. Abra a home e explique o objetivo do sistema.
2. Entre no cardápio e use a busca por “calabresa”.
3. Abra a personalização e escolha tamanho, massa e borda.
4. Adicione a pizza e abra o carrinho.
5. Mostre o cálculo do subtotal e aplique `ROMENA10`.
6. Vá para o checkout e preencha um endereço de teste.
7. Escolha PIX ou cartão para mostrar a interface de pagamento.
8. Revise e confirme o pedido.
9. Mostre a timeline de rastreamento.
10. Abra o perfil e mostre o histórico salvo.
11. Atualize a página e explique que o localStorage preservou os dados.

Dados de teste sugeridos:

```text
CEP: 01310100
Número: 123
Cartão: 4111111111111111
Validade: 1228
CVV: 123
```

## 13. Perguntas que o educador pode fazer

### Por que usar componentes?

Para dividir a interface em partes independentes e reutilizáveis. Por exemplo, o mesmo `ProductCard` pode aparecer na home e no cardápio.

### Por que usar uma store global?

Carrinho, usuário e pedidos são usados por páginas diferentes. O Zustand evita passar muitas propriedades manualmente entre componentes distantes.

### Onde os dados são salvos?

No `localStorage`, através do middleware `persist` do Zustand. É uma solução adequada para protótipo, mas não substitui um banco de dados em produção.

### Existe pagamento real?

Não. PIX, cartão e pagamento na entrega são simulações de interface. Nenhuma cobrança é realizada.

### O que seria necessário para produção?

Backend, banco de dados, autenticação segura, API de pagamentos, controle de estoque, painel administrativo, integração com entregadores, validação de endereço e proteção dos dados pessoais.

### O que acontece se o JavaScript der erro?

O `ErrorBoundary` captura o erro e mostra uma tela de recuperação com opção de recarregar ou limpar os dados locais.

## 14. Como publicar alterações

Depois de modificar o projeto:

```bash
git add .
git commit -m "Descreve a alteração"
git push
```

O GitHub Actions executa o build e publica automaticamente uma nova versão no GitHub Pages.

Site publicado:

<https://mr4644239-arch.github.io/romena-delivery/>
