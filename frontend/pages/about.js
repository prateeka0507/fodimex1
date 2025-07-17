export default function About() {
  return (
    <div className="min-h-screen bg-[#f5eee6] pb-12">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#2E251D] to-[#b48a4a] py-12 flex flex-col items-center justify-center text-center mb-8 shadow-lg">
        <img src="/logo.png" alt="Fodimex Logo" className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-[#f5eee6] bg-white" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow">About Fodimex</h1>
        <p className="text-lg md:text-2xl text-[#f5eee6] max-w-2xl mx-auto font-medium">Rooted in tradition. Crafted for you. Discover the story and values behind Fodimex.</p>
      </section>

      {/* Brand Quote */}
      <section className="max-w-2xl mx-auto mb-8">
        <blockquote className="italic text-center text-[#7c6f5a] text-xl border-l-4 border-[#b48a4a] pl-6 py-4 bg-[#ede5d8] rounded shadow">
          “If you can't put it in your mouth, why put it on your skin?”
        </blockquote>
      </section>

      {/* Story, Mission, Values */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-[#b48a4a]">
          <span className="text-4xl mb-2">📖</span>
          <h2 className="text-xl font-bold text-[#2E251D] mb-2">Our Story</h2>
          <p className="text-[#7c6f5a] text-center">Fodimex began in Tamil Nadu with a vision for honest, eco-friendly products. Every item is handmade with care, using only the purest local ingredients—never fillers or harsh chemicals.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-[#b48a4a]">
          <span className="text-4xl mb-2">🎯</span>
          <h2 className="text-xl font-bold text-[#2E251D] mb-2">Our Mission</h2>
          <p className="text-[#7c6f5a] text-center">To empower our community with safe, effective, and sustainable personal care, supporting local farmers and artisans. We are committed to transparency, quality, and customer satisfaction.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-t-4 border-[#b48a4a]">
          <span className="text-4xl mb-2">🌱</span>
          <h2 className="text-xl font-bold text-[#2E251D] mb-2">Our Values</h2>
          <ul className="text-[#7c6f5a] text-left list-disc pl-4">
            <li>Truly Natural Ingredients</li>
            <li>Handmade in India</li>
            <li>Eco-Friendly & Cruelty-Free</li>
            <li>Transparency & Trust</li>
            <li>Community Support</li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-12 border-l-4 border-[#b48a4a]">
        <h2 className="text-xl font-bold text-[#2E251D] mb-2 flex items-center gap-2"><span>📬</span>Contact</h2>
        <div className="text-[#7c6f5a] space-y-1">
          <div>Email: <a href="mailto:prateekakathiresan@gmail.com" className="text-blue-600 underline">prateekakathiresan@gmail.com</a></div>
          <div>Phone: <a href="tel:+919791614350" className="text-blue-600 underline">+91 97916 14350</a>, <a href="tel:+919600364159" className="text-blue-600 underline">+91 96003 64159</a></div>
          <div>Address: 6, Velan Thottam Podarampalayam, Kundadam (PO), Dharapuram, Tirupur, Tamil Nadu - 638702</div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#2E251D] mb-8 text-center">Meet the Founders</h2>
        <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-[#b48a4a] w-full md:w-1/2 mb-6 md:mb-0">
            <img src="/prathi.png" alt="Prateeka" className="w-32 h-32 rounded-full object-cover border-4 border-[#f5eee6] mb-4" />
            <h3 className="font-bold text-lg text-[#b48a4a] mb-1">Prateeka</h3>
            <p className="text-center text-[#7c6f5a]">Co-founder, product innovator, and passionate about natural wellness. Prateeka leads our product development and quality assurance, ensuring every Fodimex product meets the highest standards.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-[#b48a4a] w-full md:w-1/2">
            <img src="/gokila.png" alt="Gokila Priya" className="w-32 h-32 rounded-full object-cover border-4 border-[#f5eee6] mb-4" />
            <h3 className="font-bold text-lg text-[#b48a4a] mb-1">Gokila Priya</h3>
            <p className="text-center text-[#7c6f5a]">Co-founder and creative force behind Fodimex. Gokila Priya is dedicated to customer happiness, community outreach, and sharing the story of our brand with the world.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 