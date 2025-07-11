import Link from 'next/link';

export default function OrderConfirmation() {
  return (
    <div className="py-16 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Thank you for your order!</h1>
      <p className="mb-4">Your order has been placed successfully. We will send you an email confirmation soon.</p>
      <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Back to Home</Link>
    </div>
  );
} 