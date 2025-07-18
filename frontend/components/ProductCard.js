import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const inWishlist = wishlist.some(item => item.productId === product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) return;
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleSelect = (e) => {
    if (!user) {
      e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#e8ded2] p-6 flex flex-col relative transition-transform transform hover:-translate-y-1 hover:shadow-2xl" style={{ minHeight: 420 }}>
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        className="w-40 h-40 object-cover rounded-xl mx-auto mb-4 border-4 border-[#f5eee6] bg-[#f5eee6]"
      />
      <h2 className="text-xl font-bold mb-1 text-[#3d2c1e] text-center">{product.name}</h2>
      <p className="text-[#7c6f5a] text-center mb-2" style={{ minHeight: 40 }}>{product.description}</p>
      <div className="text-[#b48a4a] font-bold text-lg text-center mb-4">₹{product.price}</div>
      <Link
        href={`/product/${product.id}`}
        className="mt-auto w-full bg-[#b48a4a] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a07628] transition mb-2 text-center"
        onClick={handleSelect}
      >
        Select
      </Link>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full text-center relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-2 text-[#2E251D]">Login Required</h3>
            <p className="mb-4 text-[#7c6f5a]">Please log in or register to select and add products to your cart.</p>
            <Link href="/login" className="block bg-[#b48a4a] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a07628] mb-2">Login</Link>
            <Link href="/register" className="block bg-[#ede5d8] text-[#2E251D] px-4 py-2 rounded-lg font-semibold hover:bg-[#e8ded2]">Register</Link>
          </div>
        </div>
      )}
    </div>
  );
} 