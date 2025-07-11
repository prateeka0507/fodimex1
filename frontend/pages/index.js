import ProductList from '../components/ProductList';

const featuredProducts = [
  { id: 1, name: 'Product 1', price: 29.99, image: '/placeholder.png', category: 'Electronics' },
  { id: 2, name: 'Product 2', price: 49.99, image: '/placeholder.png', category: 'Books' },
  { id: 3, name: 'Product 3', price: 19.99, image: '/placeholder.png', category: 'Clothing' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <section className="w-full bg-green-900 text-green-50 py-16 px-4 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Fodimex</h1>
        <p className="text-xl mb-6 max-w-2xl text-center">Discover our range of natural, eco-friendly personal care products, all crafted with the power of egg shell powder for your well-being and the planet.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <span className="bg-green-700 px-4 py-2 rounded-full text-green-100 font-semibold">100% Organic</span>
          <span className="bg-green-700 px-4 py-2 rounded-full text-green-100 font-semibold">Egg Shell Powder Based</span>
          <span className="bg-green-700 px-4 py-2 rounded-full text-green-100 font-semibold">Eco-Friendly</span>
        </div>
      </section>
      <section className="w-full max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProductCard
          title="Organic Soap"
          description="Gentle, nourishing soap made with natural ingredients and enriched with egg shell powder for healthy, glowing skin."
          image="/soap.jpg"
        />
        <ProductCard
          title="Face Wash"
          description="A refreshing face wash that cleanses deeply while the egg shell powder helps rejuvenate your skin."
          image="/facewash.jpg"
        />
        <ProductCard
          title="Scrub"
          description="Exfoliate naturally with our scrub, combining organic botanicals and egg shell powder for smooth, radiant skin."
          image="/scrub.jpg"
        />
        <ProductCard
          title="Tooth Powder"
          description="Brighten your smile with our mineral-rich tooth powder, harnessing the power of egg shell powder for oral health."
          image="/toothpowder.jpg"
        />
        <ProductCard
          title="Raw Egg Shell Powder"
          description="Pure, finely ground egg shell powder for versatile use in personal care and wellness."
          image="/eggshell.jpg"
        />
      </section>
    </div>
  );
}

function ProductCard({ title, description, image }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center border border-green-100 hover:shadow-2xl transition">
      <img src={image} alt={title} className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-green-200" />
      <h3 className="text-2xl font-bold text-green-900 mb-2">{title}</h3>
      <p className="text-green-800 mb-4">{description}</p>
      <span className="text-green-600 font-semibold">Made with Egg Shell Powder</span>
    </div>
  );
} 