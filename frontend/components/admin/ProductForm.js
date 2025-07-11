import { useState } from 'react';

const defaultValues = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  stock: '',
};

export default function ProductForm({ initialValues = {}, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price || !form.category || !form.stock) {
      setError('Please fill in all required fields.');
      return;
    }
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">{initialValues.id ? 'Edit Product' : 'Add Product'}</h2>
      <div className="mb-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name*" className="border rounded px-3 py-2 w-full mb-2" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category*" className="border rounded px-3 py-2 w-full mb-2" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price*" type="number" step="0.01" className="border rounded px-3 py-2 w-full mb-2" />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock*" type="number" className="border rounded px-3 py-2 w-full mb-2" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="border rounded px-3 py-2 w-full mb-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border rounded px-3 py-2 w-full" />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? 'Saving...' : (initialValues.id ? 'Update' : 'Add')}
        </button>
        <button type="button" className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  );
} 