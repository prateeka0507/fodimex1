import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminNav from '../../components/admin/AdminNav';
import { productsAPI } from '../../services/api';
import ProductForm from '../../components/admin/ProductForm';

export default function AdminProducts() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchProducts();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setError('');
    try {
      const data = await productsAPI.getAll();
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAdd = () => {
    setEditProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setFormLoading(true);
    setError('');
    try {
      await productsAPI.delete(id);
      await fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    setError('');
    try {
      if (editProduct) {
        await productsAPI.update(editProduct.id, formData);
      } else {
        await productsAPI.create(formData);
      }
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || !user) return <div>Loading...</div>;
  if (user.role !== 'admin') return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <AdminNav />
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAdd}>
        Add Product
      </button>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 relative">
            <ProductForm
              initialValues={editProduct || {}}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </div>
        </div>
      )}
      {loadingProducts ? (
        <div>Loading products...</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td className="p-2 border">{product.id}</td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">${product.price}</td>
                <td className="p-2 border">{product.stock}</td>
                <td className="p-2 border">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(product)} disabled={formLoading}>Edit</button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(product.id)} disabled={formLoading}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 