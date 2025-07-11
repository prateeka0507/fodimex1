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
    <header className="bg-green-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Fodimex Logo" width={48} height={48} priority />
          <span className="text-2xl font-bold text-green-100">Fodimex</span>
        </Link>
        <nav className="space-x-4 hidden md:flex items-center">
          <Link href="/" className="hover:text-green-300 text-green-100">Home</Link>
          <Link href="/catalog" className="hover:text-green-300 text-green-100">Catalog</Link>
          <Link href="/cart" className="hover:text-green-300 text-green-100 inline-flex items-center">
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-green-600 text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>
          <Link href="/account" className="hover:text-green-300 text-green-100">Account</Link>
          <Link href="/about" className="hover:text-green-300 text-green-100">About</Link>
          <Link href="/contact" className="hover:text-green-300 text-green-100">Contact</Link>
          <Link href="/blog" className="hover:text-green-300 text-green-100">Blog</Link>
          {user ? (
            <>
              <span className="ml-4 text-gray-700">Hi, {user.name || user.email}</span>
              <button onClick={logout} className="ml-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="ml-4 hover:text-blue-600">Login</Link>
              <Link href="/register" className="hover:text-blue-600">Register</Link>
            </>
          )}
        </nav>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t px-6 pb-4 flex flex-col space-y-2">
          <Link href="/" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/catalog" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Catalog</Link>
          <Link href="/cart" className="hover:text-blue-600 inline-flex items-center" onClick={() => setMenuOpen(false)}>
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>
          <Link href="/account" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Account</Link>
          <Link href="/about" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/blog" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Blog</Link>
          {user ? (
            <>
              <span className="text-gray-700">Hi, {user.name || user.email}</span>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 mt-2">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
} 