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
    <div className="py-8 min-h-screen bg-[#f5eee6]">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#2E251D]">Shopping Cart</h1>
      <div className="max-w-3xl mx-auto">
        {cart.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-[#b48a4a] text-center text-[#7c6f5a]">No items in cart.</div>
        ) : (
          <div className="space-y-6 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-[#e8ded2] gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img src={item.image || '/placeholder.png'} alt={item.name} className="w-20 h-20 object-cover rounded-xl border-4 border-[#f5eee6] bg-[#f5eee6]" />
                  <div>
                    <div className="font-bold text-lg text-[#2E251D]">{item.name}</div>
                    <div className="text-[#b48a4a] font-semibold text-base mb-1">₹{item.price} x {item.quantity}</div>
                    <div className="text-[#7c6f5a] text-sm">{item.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item)}
                    className="bg-[#ede5d8] text-[#2E251D] px-3 py-1 rounded-full font-bold text-lg hover:bg-[#e8ded2]"
                  >-</button>
                  <span className="font-semibold text-lg">{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-[#ede5d8] text-[#2E251D] px-3 py-1 rounded-full font-bold text-lg hover:bg-[#e8ded2]"
                  >+</button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="font-bold text-2xl mb-6 text-right text-[#2E251D]">Total: <span className="text-[#b48a4a]">₹{total.toFixed(2)}</span></div>
        <button
          className="w-full bg-[#b48a4a] text-white px-8 py-3 rounded-full text-lg font-bold shadow hover:bg-[#a07628] transition"
          disabled={cart.length === 0}
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
} 