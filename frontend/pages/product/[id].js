import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { productsAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import ProductReviews from '../../components/ProductReviews';
import Link from 'next/link';

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const handleAddToCart = () => {
    if (!user) {
      setShowModal(true);
      return;
    }
    addToCart(product);
    setAdded(true);
  };

  return (
    <div className="py-8 flex justify-center min-h-screen bg-[#f5eee6]">
      <div className="bg-white rounded-2xl shadow-lg border border-[#e8ded2] p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#2E251D]">{product.name}</h1>
          <button
            onClick={handleWishlist}
            className={`text-2xl ${inWishlist ? 'text-red-500' : 'text-gray-300'}`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            {inWishlist ? '♥' : '♡'}
          </button>
        </div>
        <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-72 object-cover rounded-xl mb-6 border-4 border-[#f5eee6] bg-[#f5eee6]" />
        <div className="mb-2 text-2xl font-bold text-[#b48a4a]">₹{product.price}</div>
        <div className="mb-2 text-[#7c6f5a]">Category: <span className="font-semibold">{product.category}</span></div>
        <div className="mb-2 text-[#7c6f5a]">Stock: <span className="font-semibold">{product.stock}</span></div>
        <div className="mb-6 text-[#3d2c1e] text-lg">{product.description}</div>
        {added ? (
          <Link href="/cart" className="w-full block bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg text-center hover:bg-green-700 transition mb-4">Go to Cart</Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#b48a4a] text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#a07628] transition mb-4"
          >
            Add to Cart
          </button>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full text-center relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-2 text-[#2E251D]">Login Required</h3>
              <p className="mb-4 text-[#7c6f5a]">Please log in or register to add products to your cart.</p>
              <Link href="/login" className="block bg-[#b48a4a] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a07628] mb-2">Login</Link>
              <Link href="/register" className="block bg-[#ede5d8] text-[#2E251D] px-4 py-2 rounded-lg font-semibold hover:bg-[#e8ded2]">Register</Link>
            </div>
          </div>
        )}
        {added && <div className="text-green-600 text-center mb-2 font-semibold">Added to cart!</div>}
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
} 