import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const { cart, setCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', address: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleStripePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    if (!user) {
      setError('You must be logged in to pay.');
      setLoading(false);
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty.');
      setLoading(false);
      return;
    }
    if (!stripe || !elements) {
      setError('Stripe not loaded');
      setLoading(false);
      return;
    }
    try {
      // 1. Create PaymentIntent on backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
          shippingInfo: form
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create payment intent');

      // 2. Mount PaymentElement with clientSecret
      // This is handled by the <Elements> wrapper with the stripePromise and options
      // 3. Confirm payment on frontend using PaymentElement
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        setCart([]);
        router.push('/order-confirmation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleStripePayment} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
      <div className="mb-4">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" className="border rounded px-3 py-2 w-full mb-2" />
        <input name="address" value={form.address} onChange={handleChange} required placeholder="Address" className="border rounded px-3 py-2 w-full mb-2" />
        <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="border rounded px-3 py-2 w-full mb-2" />
        <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone" className="border rounded px-3 py-2 w-full" />
      </div>
      <h2 className="text-xl font-semibold mb-4 mt-6">Payment Information</h2>
      <div className="mb-4 text-gray-500">Pay securely with card, UPI, or wallets (Stripe Test Mode)</div>
      <div className="mb-4 bg-gray-50 p-3 rounded">
        <PaymentElement />
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Payment successful! Redirecting...</div>}
      <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 w-full mb-2" disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { cart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [clientSecret, setClientSecret] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', email: '', phone: '' });

  // Fetch clientSecret when cart or form changes
  useEffect(() => {
    if (cart.length === 0) return;
    const fetchClientSecret = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
          shippingInfo: form
        })
      });
      const data = await res.json();
      if (res.ok) setClientSecret(data.clientSecret);
    };
    fetchClientSecret();
  }, [cart, form]);

  const options = clientSecret ? { clientSecret } : undefined;

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      ) : (
        <div>Loading payment options...</div>
      )}
      <div className="bg-gray-50 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        {cart.length === 0 ? (
          <div>No items in cart.</div>
        ) : (
          <ul className="mb-2">
            {cart.map(item => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="font-bold">Total: ₹{total.toFixed(2)}</div>
      </div>
    </div>
  );
} 