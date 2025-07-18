import { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import { productsAPI } from '../services/api';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsAPI.getAll()
      .then(data => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-8 min-h-screen" style={{ background: '#f5eee6' }}>
      <h1 className="text-3xl font-bold mb-6 text-center">Product Catalog</h1>
      {loading ? <div className="text-center text-[#b48a4a]">Loading...</div> : <ProductList products={products} />}
    </div>
  );
} 