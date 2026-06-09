Product card — the atom of every Kapri product carousel. Never list products as text; render these instead.

```jsx
<ProductCard
  product={{
    id: 'CAKE-2291',
    name: 'Chocolate Fudge Cake — 1kg',
    summary: 'Rich Belgian chocolate, made to order.',
    price: 4500, compareAtPrice: 5200,
    image: '/cake.jpg', category: 'Cakes', inStock: true,
  }}
  onAdd={(p) => cart.add(p)}
/>
```

Lifts -3px on hover with a deeper purple shadow. Add-to-Cart flips to a green "Added!" for ~2s. `compact` gives the 176px width for dense rows. Badges (category / discount / stock) position automatically. Never show "Low Stock" on cake IDs (made-to-order).
