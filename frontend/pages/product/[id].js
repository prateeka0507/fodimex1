import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ProductReviews from '../../components/ProductReviews';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const inWishlist = wishlist.some(item => item.productId === product?.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) return;
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsAPI.getById(id)
      .then(setProduct)
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-8">Loading...</div>;
  if (error) return <div className="py-8 text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <button
          onClick={handleWishlist}
          className={`text-2xl ${inWishlist ? 'text-red-500' : 'text-gray-300'}`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {inWishlist ? '♥' : '♡'}
        </button>
      </div>
      <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-64 object-cover rounded mb-4" />
      <div className="mb-2 text-lg text-blue-600 font-bold">${product.price}</div>
      <div className="mb-2">Category: {product.category}</div>
      <div className="mb-4">Stock: {product.stock}</div>
      <div className="mb-4 text-gray-700">{product.description}</div>
      <button
        onClick={() => addToCart(product)}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Add to Cart
      </button>
      <ProductReviews productId={product.id} />
    </div>
  );
} 