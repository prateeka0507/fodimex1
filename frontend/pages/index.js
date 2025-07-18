import ProductList from '../components/ProductList';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

const featuredProducts = [
  {
    id: 1,
    name: 'Soap',
    image: '/soap box design.png',
    price: 199,
    description: 'Gentle, nourishing soap made with natural ingredients.'
  },
  {
    id: 2,
    name: 'Tooth Powder',
    image: '/tubes.png',
    price: 149,
    description: 'Mineral-rich tooth powder for oral health.'
  },
  {
    id: 3,
    name: 'Face Scrub',
    image: '/cover.jpeg',
    price: 249,
    description: 'Exfoliate naturally for smooth, radiant skin.'
  },
  {
    id: 4,
    name: 'Face Wash',
    image: '/cover.jpeg',
    price: 199,
    description: 'A refreshing face wash that cleanses deeply.'
  },
  {
    id: 5,
    name: 'Raw Egg Shell Powder',
    image: '/tubes.png',
    price: 99,
    description: 'Pure, finely ground egg shell powder for versatile use.'
  }
];

const reviews = [
  {
    image: '/cover.jpeg',
    name: 'Maria',
    verified: true,
    title: 'I’m comfortable in my skin again!',
    text: 'After having my daughter two years ago, I’ve struggled with rosacea issues on my face, particularly on my eye lids. What a difference a month (and Fodimex) can make!'
  },
  {
    image: '/soap box design.png',
    name: 'Ellen M',
    verified: false,
    title: 'Amazing',
    text: 'I cannot recommend this enough, I\'ve been using it since January along with the tallow and black seed oil and I will never put anything else on my skin again.'
  },
  {
    image: '/tubes.png',
    name: 'Jay',
    verified: false,
    title: 'I love it',
    text: 'It has been one week since I purchased this product and I have already noticed a difference with my skin. Highly recommended!'
  }
];

export default function Home() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [bestsellers, setBestsellers] = useState([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);
  const reviewsToShow = 2;
  const maxIndex = reviews.length - reviewsToShow;
  const handlePrev = () => setReviewIndex(i => Math.max(0, i - 1));
  const handleNext = () => setReviewIndex(i => Math.min(maxIndex, i + 1));

  useEffect(() => {
    setLoadingBestsellers(true);
    productsAPI.getAll({ limit: 3 })
      .then(data => setBestsellers(data.products))
      .finally(() => setLoadingBestsellers(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5eee6] flex flex-col">
      {/* Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-[#2E251D] to-[#b48a4a] text-white text-center py-2 text-sm font-semibold flex items-center justify-center">
        <span role="img" aria-label="fire">🔥</span> NEW: Fodimex Face Scrub just launched &nbsp;
        <Link href="/catalog" className="underline hover:text-[#ffe6b3] transition">(SHOP NOW)</Link>
      </div>
      {/* Marquee Text Banner */}
      <div className="w-full bg-[#2E251D] overflow-hidden flex items-center" style={{height: '48px'}}>
        <div className="marquee flex items-center text-[#f5eee6] text-base font-semibold whitespace-nowrap" style={{animation: 'marquee 18s linear infinite'}}>
          {[...Array(4)].map((_, i) => (
            <span key={i} className="mx-12 flex items-center gap-4">
              <span>✈️ FREE SHIPPING FOR ORDERS OVER ₹2000</span>
              <span>☘️ HANDMADE IN INDIA</span>
              <span>🇮🇳 LOCAL DELIVERY</span>
            </span>
          ))}
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee {
            width: 200%;
          }
        `}</style>
      </div>
      {/* Large Hero Image Section */}
      <div className="w-full flex justify-center items-center bg-[#f5eee6] py-8">
        <img src="/cover.jpeg" alt="Hero" className="w-full max-w-5xl h-80 object-cover rounded-2xl shadow-lg border-4 border-[#e8ded2]" />
      </div>
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 px-4 text-center bg-[#f5eee6]">
        <img src="/logo.png" alt="Fodimex Logo" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2E251D] mb-4">Welcome to Fodimex</h1>
        <p className="text-lg md:text-2xl text-[#7c6f5a] mb-6 max-w-2xl mx-auto">Discover our range of natural, eco-friendly personal care products, all crafted with the power of egg shell powder for your well-being and the planet.</p>
        <Link href="/catalog" className="inline-block bg-[#b48a4a] text-white px-8 py-3 rounded-full text-lg font-bold shadow hover:bg-[#a07628] transition">Shop Now</Link>
      </section>
      {/* Featured Products */}
      <section className="w-full max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-[#2E251D] mb-8 text-center">Shop our bestsellers</h2>
        {loadingBestsellers ? (
          <div className="text-center text-[#b48a4a]">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {bestsellers.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-[#e8ded2] p-6 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1 hover:shadow-2xl">
                <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-xl mb-4 border-4 border-[#f5eee6] bg-[#f5eee6]" />
                <h3 className="text-2xl font-bold text-[#3d2c1e] mb-2">{product.name}</h3>
                <p className="text-[#7c6f5a] mb-2">{product.description}</p>
                <div className="text-[#b48a4a] font-bold text-lg mb-4">₹{product.price}</div>
                <Link href={`/product/${product.id}`} className="w-full bg-[#b48a4a] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a07628] transition">Select</Link>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* Brand Values / Why Choose Us */}
      <section className="w-full bg-[#ede5d8] py-12 px-4">
        <h2 className="text-2xl font-bold text-[#2E251D] mb-6 text-center">Why Choose Fodimex?</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🌱</span>
            <h4 className="font-bold text-[#3d2c1e] mb-1">Truly Natural</h4>
            <p className="text-[#7c6f5a]">We use only the purest, locally sourced ingredients. No fillers, no harsh chemicals.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">💧</span>
            <h4 className="font-bold text-[#3d2c1e] mb-1">Highly Effective</h4>
            <p className="text-[#7c6f5a]">Our products are crafted for real results, rooted in ancestral wisdom and modern science.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🌏</span>
            <h4 className="font-bold text-[#3d2c1e] mb-1">Eco-Friendly</h4>
            <p className="text-[#7c6f5a]">Sustainable, cruelty-free, and kind to the planet—just as nature intended.</p>
          </div>
        </div>
      </section>
      {/* Reviews Carousel Section */}
      <section className="w-full bg-[#f5eee6] py-12">
        <h2 className="text-3xl font-bold text-center text-[#2E251D] mb-8">Trusted by 80,000+ customers</h2>
        <div className="flex items-center justify-center gap-4">
          <button onClick={handlePrev} disabled={reviewIndex === 0} className="text-3xl px-2 py-1 rounded-full bg-white shadow hover:bg-[#ede5d8] disabled:opacity-30">&#8592;</button>
          <div className="flex gap-8">
            {reviews.slice(reviewIndex, reviewIndex + reviewsToShow).map((review, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 max-w-xs flex flex-col items-center border border-[#e8ded2]">
                <img src={review.image} alt={review.name} className="w-24 h-24 object-cover rounded-full mb-4" />
                <div className="flex gap-1 mb-2">{[...Array(5)].map((_,i)=>(<span key={i} className="text-purple-700 text-xl">★</span>))}</div>
                <div className="font-semibold text-[#2E251D] mb-1">{review.name} {review.verified && <span className="bg-purple-700 text-white text-xs px-2 py-0.5 rounded ml-2">Verified</span>}</div>
                <div className="font-bold mb-1 text-center">{review.title}</div>
                <div className="text-[#7c6f5a] text-center text-sm">{review.text}</div>
              </div>
            ))}
          </div>
          <button onClick={handleNext} disabled={reviewIndex === maxIndex} className="text-3xl px-2 py-1 rounded-full bg-white shadow hover:bg-[#ede5d8] disabled:opacity-30">&#8594;</button>
        </div>
      </section>
    </div>
  );
} 