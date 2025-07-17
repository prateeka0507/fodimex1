import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSent(false);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to send message');
        setSent(false);
      } else {
        setSent(true);
        setForm({ name: '', email: '', message: '' });
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
      setSent(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5eee6] py-12 px-2 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#2E251D]">Contact Us</h1>
      <div className="w-full max-w-2xl space-y-8">
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#b48a4a] mb-4">
          <h2 className="text-xl font-bold mb-4 text-[#2E251D] flex items-center gap-2"><span>📞</span>Contact Information</h2>
          <div className="mb-4 flex flex-col gap-1 text-[#7c6f5a]">
            <span>Email: <a href="mailto:prateekakathiresan@gmail.com" className="text-blue-600 underline">prateekakathiresan@gmail.com</a></span>
            <span>Phone 1: <a href="tel:+919791614350" className="text-blue-600 underline">+91 97916 14350</a></span>
            <span>Phone 2: <a href="tel:+919600364159" className="text-blue-600 underline">+91 96003 64159</a></span>
            <span>Address: <span className="text-gray-700">6, Velan Thottam Podarampalayam, Kundadam (PO), Dharapuram, Tirupur, Tamil Nadu - 638702</span></span>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-[#b48a4a] text-center">Founders</h3>
            <div className="flex gap-8 items-center justify-center">
              <div className="flex flex-col items-center">
                <img src="/prathi.png" alt="Prateeka" className="w-20 h-20 rounded-full object-cover border-2 border-[#b48a4a] mb-1 bg-[#f5eee6]" />
                <span className="font-medium text-[#2E251D]">Prateeka</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/gokila.png" alt="Gokila Priya" className="w-20 h-20 rounded-full object-cover border-2 border-[#b48a4a] mb-1 bg-[#f5eee6]" />
                <span className="font-medium text-[#2E251D]">Gokila Priya</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#b48a4a]">
          <h2 className="text-xl font-bold mb-4 text-[#2E251D] flex items-center gap-2"><span>✉️</span>Send Us a Message</h2>
          {sent ? (
            <div className="text-green-600 font-semibold">Message sent! We will get back to you soon.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="border rounded px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-[#b48a4a]"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="border rounded px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-[#b48a4a]"
                required
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="border rounded px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-[#b48a4a]"
                required
              />
              {error && <div className="text-red-600 mb-2">{error}</div>}
              <button
                type="submit"
                className="bg-[#b48a4a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a07628] transition w-full mt-2"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 