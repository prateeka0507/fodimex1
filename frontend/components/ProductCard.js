import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
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

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col relative">
      <button
        onClick={handleWishlist}
        className={`absolute top-2 right-2 text-2xl ${inWishlist ? 'text-red-500' : 'text-gray-300'} z-10`}
        title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        {inWishlist ? '♥' : '♡'}
      </button>
      <img
        src={product.image || '/placeholder.png'}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
      <p className="text-blue-600 font-bold mb-2">${product.price}</p>
      <Link href={`/product/${product.id}`} className="mt-auto text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2">View Details</Link>
      <button
        onClick={() => addToCart(product)}
        className="text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add to Cart
      </button>
    </div>
  );
} 