import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#2E251D] shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Fodimex Logo" width={48} height={48} priority />
          <span className="text-2xl font-bold text-white">Fodimex</span>
        </Link>
        <nav className="space-x-4 hidden md:flex items-center">
          <Link href="/" className="hover:text-[#b48a4a] text-white">Home</Link>
          <Link href="/catalog" className="hover:text-[#b48a4a] text-white">Catalog</Link>
          <Link href="/cart" className="hover:text-[#b48a4a] text-white inline-flex items-center">
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-[#b48a4a] text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>
          <Link href="/account" className="hover:text-[#b48a4a] text-white">Account</Link>
          <Link href="/about" className="hover:text-[#b48a4a] text-white">About</Link>
          <Link href="/contact" className="hover:text-[#b48a4a] text-white">Contact</Link>
          <Link href="/blog" className="hover:text-[#b48a4a] text-white">Blog</Link>
          {user ? (
            <>
              <span className="ml-4 text-[#b48a4a]">Hi, {user.name || user.email}</span>
              <button onClick={logout} className="ml-2 bg-[#b48a4a] text-white px-3 py-1 rounded hover:bg-[#a07628]">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="ml-4 hover:text-[#b48a4a] text-white">Login</Link>
              <Link href="/register" className="hover:text-[#b48a4a] text-white">Register</Link>
            </>
          )}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#2E251D] border-t px-6 pb-4 flex flex-col space-y-2">
          <Link href="/" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/catalog" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Catalog</Link>
          <Link href="/cart" className="hover:text-[#b48a4a] text-white inline-flex items-center" onClick={() => setMenuOpen(false)}>
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-[#b48a4a] text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>
          <Link href="/account" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Account</Link>
          <Link href="/about" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/blog" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Blog</Link>
          {user ? (
            <>
              <span className="text-[#b48a4a]">Hi, {user.name || user.email}</span>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="bg-[#b48a4a] text-white px-3 py-1 rounded hover:bg-[#a07628] mt-2">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
} 