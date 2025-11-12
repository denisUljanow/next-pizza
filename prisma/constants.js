const categories = [
  {
    name: 'Pizzas',
  },
  {
    name: 'Combo',
  },
  {
    name: 'Vorspeisen',
  },
  {
    name: 'Cocktails',
  },
  {
    name: 'Kaffee',
  },
  {
    name: 'Getränke',
  },
  {
    name: 'Desserts',
  },
];

const _ingredients = [
  {
    name: 'Käserand',
    price: 1.20,
    imageUrl:
      '/img/ingredients/kaeserand.webp',
  },
  {
    name: 'Cremige Mozzarella',
    price: 0.79,
    imageUrl:
      '/img/ingredients/cremige-mozzarella.webp',
  },
  {
    name: 'Cheddar und Parmesan',
    price: 0.79,
    imageUrl: '/img/ingredients/cheddar-und-parmesan.webp',
  },
  {
    name: 'Scharfer Jalapeño',
    price: 0.59,
    imageUrl:
      '/img/ingredients/scharfer-jalapeno.webp',
  },
  {
    name: 'Zartes Hähnchen',
    price: 0.79,
    imageUrl: '/img/ingredients/zartes-haehnchen.webp',
  },
  {
    name: 'Champignons',
    price: 0.59,
    imageUrl: '/img/ingredients/champignons.webp',
  },
  {
    name: 'Schinken',
    price: 0.79,
    imageUrl: '/img/ingredients/schinken.webp',
  },
  {
    name: 'Würzige Pepperoni',
    price: 0.79,
    imageUrl: '/img/ingredients/wuerzige-pepperoni.webp',
  },
  {
    name: 'Scharfe Chorizo',
    price: 0.79,
    imageUrl: '/img/ingredients/scharfe-chorizo.webp',
  },
  {
    name: 'Eingelegte Gurken',
    price: 0.59,
    imageUrl: '/img/ingredients/eingelegte-gurken.webp',
  },
  {
    name: 'Frische Tomaten',
    price: 0.59,
    imageUrl: '/img/ingredients/frische-tomaten.webp',
  },
  {
    name: 'Rote Zwiebeln',
    price: 0.59,
    imageUrl: '/img/ingredients/rote-zwiebeln.webp',
  },
  {
    name: 'Saftige Ananas',
    price: 0.59,
    imageUrl: '/img/ingredients/saftige-ananas.webp',
  },
  {
    name: 'Italienische Kräuter',
    price: 0.39,
    imageUrl:
      '/img/ingredients/italienische-kraeuter.webp',
  },
  {
    name: 'Süße Paprika',
    price: 0.59,
    imageUrl: '/img/ingredients/suesse-paprika.webp',
  },
  {
    name: 'Fetakäsewürfel',
    price: 0.79,
    imageUrl: '/img/ingredients/fetakaesewuerfel.webp',
  },
  {
    name: 'Fleischbällchen',
    price: 0.79,
    imageUrl:
      '/img/ingredients/fleischbaellchen.webp',
  },
].map((obj, index) => ({ id: index + 1, ...obj }));

const products = [
  {
    name: 'Omelett mit Schinken und Pilzen',
    imageUrl: '/img/products/omelett-mit-schinken-und-pilzen.webp',
    categoryId: 2,
  },
  {
    name: 'Omelett mit Pepperoni',
    imageUrl: '/img/products/omelett-mit-pepperoni.webp',
    categoryId: 2,
  },
  {
    name: 'Kaffee Latte',
    imageUrl: '/img/products/kaffee-latte.webp',
    categoryId: 2,
  },
  {
    name: 'Denwich Schinken & Käse',
    imageUrl: '/img/products/denwich-schinken-kaese.webp',
    categoryId: 3,
  },
  {
    name: 'Chicken Nuggets',
    imageUrl: '/img/products/chicken-nuggets.webp',
    categoryId: 3,
  },
  {
    name: 'Ofenkartoffeln mit Sauce 🌱',
    imageUrl: '/img/products/ofenkartoffeln-mit-sauce.webp',
    categoryId: 3,
  },
  {
    name: 'Dodster',
    imageUrl: '/img/products/dodster.webp',
    categoryId: 3,
  },
  {
    name: 'Scharfer Dodster 🌶️🌶️',
    imageUrl: '/img/products/scharfer-dodster.webp',
    categoryId: 3,
  },
  {
    name: 'Bananen-Milchshake',
    imageUrl: '/img/products/bananen-milchshake.webp',
    categoryId: 4,
  },
  {
    name: 'Karamell-Apfel-Milchshake',
    imageUrl: '/img/products/karamell-apfel-milchshake.webp',
    categoryId: 4,
  },
  {
    name: 'Milchshake mit Oreo-Keksen',
    imageUrl: '/img/products/milchshake-mit-oreo-keksen.webp',
    categoryId: 4,
  },
  {
    name: 'Klassischer Milchshake 👶',
    imageUrl: '/img/products/klassischer-milchshake.webp',
    categoryId: 4,
  },
  {
    name: 'Irischer Cappuccino',
    imageUrl: '/img/products/irischer-cappuccino.webp',
    categoryId: 5,
  },
  {
    name: 'Karamell-Cappuccino',
    imageUrl: '/img/products/karamell-cappuccino.webp',
    categoryId: 5,
  },
  {
    name: 'Kokos-Latte',
    imageUrl: '/img/products/kokos-latte.webp',
    categoryId: 5,
  },
  {
    name: 'Americano',
    imageUrl: '/img/products/americano.webp',
    categoryId: 5,
  },
  {
    name: 'Kaffee Latte',
    imageUrl: '/img/products/kaffee-latte.webp',
    categoryId: 5,
  },
];

module.exports = {
  categories,
  _ingredients,
  products,
};
