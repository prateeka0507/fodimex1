import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';

export default function Cart() {
  const { cart, removeFromCart, addToCart } = useCart();
  const router = useRouter();

  const decreaseQuantity = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item.id);
    } else {
      // Decrease quantity by adding a negative quantity
      // We'll update CartContext to support this
      addToCart({ ...item, quantity: -1, force: true });
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="bg-white p-4 rounded shadow mb-4">No items in cart.</div>
      ) : (
        <div className="space-y-4 mb-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-600">${item.price} x {item.quantity}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQuantity(item)}
                  className="bg-gray-200 px-2 py-1 rounded"
                >-</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-gray-200 px-2 py-1 rounded"
                >+</button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="font-bold text-xl mb-4">Total: ${total.toFixed(2)}</div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        disabled={cart.length === 0}
        onClick={() => router.push('/checkout')}
      >
        Proceed to Checkout
      </button>
    </div>
  );
} 