import { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import SearchFilterBar from '../components/SearchFilterBar';
import { productsAPI } from '../services/api';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setLoading(true);
    productsAPI.getAll({ search, category })
      .then(data => {
        setProducts(data.products);
        // Extract unique categories from products
        setCategories([...new Set(data.products.map(p => p.category))]);
      })
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>
      <SearchFilterBar
        search={search}
        category={category}
        onSearch={setSearch}
        onCategoryChange={setCategory}
        categories={categories}
      />
      {loading ? <div>Loading...</div> : <ProductList products={products} />}
    </div>
  );
} 