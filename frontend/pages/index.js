import ProductList from '../components/ProductList';

const featuredProducts = [
  { id: 1, name: 'Product 1', price: 29.99, image: '/placeholder.png', category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 49.99, image: '/placeholder.png', category: 'Books' },
  { id: 3, name: 'Product 3', price: 19.99, image: '/placeholder.png', category: 'Clothing' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full flex flex-col items-center py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Fodimex</h1>
        <p className="text-lg text-gray-700 mb-8">Your one-stop shop for quality products.</p>
      </div>
      <section className="w-full max-w-6xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ProductList products={featuredProducts} />
      </section>
    </div>
  );
} 