import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, Fragment } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [adminDropdown, setAdminDropdown] = useState(false);

  const isAdmin = user && user.email === 'prateekakathiresan@gmail.com';

  return (
    <header className="bg-[#2E251D] shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Fodimex Logo" width={48} height={48} priority />
          <span className="text-2xl font-bold text-white">Fodimex</span>
        </Link>
        <nav className="space-x-4 hidden md:flex items-center text-base md:text-lg">
          <Link href="/" className="hover:text-[#b48a4a] text-white">Home</Link>
          <Link href="/catalog" className="hover:text-[#b48a4a] text-white">Catalog</Link>
          <Link href="/cart" className="hover:text-[#b48a4a] text-white inline-flex items-center">
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-[#b48a4a] text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>
          <Link href="/about" className="hover:text-[#b48a4a] text-white">About</Link>
          <Link href="/contact" className="hover:text-[#b48a4a] text-white">Contact</Link>
          {isAdmin && (
            <div className="relative inline-block">
              <button
                onClick={() => setAdminDropdown(!adminDropdown)}
                className="hover:text-[#b48a4a] text-white focus:outline-none px-2"
              >
                Admin ▾
              </button>
              {adminDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-50 text-[#2E251D] py-2">
                  <Link href="/admin/products" className="block px-6 py-3 hover:bg-[#f5eee6] text-lg" onClick={() => setAdminDropdown(false)}>Manage Products</Link>
                  <Link href="/admin/orders" className="block px-6 py-3 hover:bg-[#f5eee6] text-lg" onClick={() => setAdminDropdown(false)}>Order Management</Link>
                </div>
              )}
            </div>
          )}
          <div className="relative inline-block">
            <button
              onClick={() => setAccountDropdown(!accountDropdown)}
              className="hover:text-[#b48a4a] text-white focus:outline-none px-2 flex items-center"
              aria-label="Account menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
              </svg>
            </button>
            {accountDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 text-[#2E251D]">
                {!user ? (
                  <>
                    <Link href="/login" className="block px-4 py-2 hover:bg-[#f5eee6]" onClick={() => setAccountDropdown(false)}>Login</Link>
                    <Link href="/register" className="block px-4 py-2 hover:bg-[#f5eee6]" onClick={() => setAccountDropdown(false)}>Register</Link>
                  </>
                ) : (
                  <>
                    <Link href="/account" className="block px-4 py-2 hover:bg-[#f5eee6]" onClick={() => setAccountDropdown(false)}>Account</Link>
                    <button onClick={() => { logout(); setAccountDropdown(false); }} className="block w-full text-left px-4 py-2 hover:bg-[#f5eee6]">Logout</button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="p-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#2E251D] border-t px-4 pb-6 flex flex-col space-y-3 text-lg">
          <Link href="/" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/catalog" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Catalog</Link>
          <Link href="/cart" className="hover:text-[#b48a4a] text-white inline-flex items-center" onClick={() => setMenuOpen(false)}>
            Cart
            {cartCount > 0 && (
              <span className="ml-1 bg-[#b48a4a] text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>
          <Link href="/about" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" className="hover:text-[#b48a4a] text-white" onClick={() => setMenuOpen(false)}>Contact</Link>
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setAdminDropdown(!adminDropdown)}
                className="hover:text-[#b48a4a] text-white focus:outline-none px-2 w-full text-left"
              >
                Admin ▾
              </button>
              {adminDropdown && (
                <div className="mt-2 w-56 bg-white rounded shadow-lg z-50 text-[#2E251D] py-2">
                  <Link href="/admin/products" className="block px-6 py-3 hover:bg-[#f5eee6] text-lg" onClick={() => { setAdminDropdown(false); setMenuOpen(false); }}>Manage Products</Link>
                  <Link href="/admin/orders" className="block px-6 py-3 hover:bg-[#f5eee6] text-lg" onClick={() => { setAdminDropdown(false); setMenuOpen(false); }}>Order Management</Link>
                </div>
              )}
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setAccountDropdown(!accountDropdown)}
              className="hover:text-[#b48a4a] text-white focus:outline-none px-2 w-full text-left flex items-center"
              aria-label="Account menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0v.25a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.25z" />
              </svg>
            </button>
            {accountDropdown && (
              <div className="mt-2 w-40 bg-white rounded shadow-lg z-50 text-[#2E251D]">
                {!user ? (
                  <>
                    <Link href="/login" className="block px-4 py-2 hover:bg-[#f5eee6]" onClick={() => { setAccountDropdown(false); setMenuOpen(false); }}>Login</Link>
                    <Link href="/register" className="block px-4 py-2 hover:bg-[#f5eee6]" onClick={() => { setAccountDropdown(false); setMenuOpen(false); }}>Register</Link>
                  </>
                ) : (
                  <>
                    <Link href="/account" className="block px-4 py-2 hover:bg-[#f5eee6]" onClick={() => { setAccountDropdown(false); setMenuOpen(false); }}>Account</Link>
                    <button onClick={() => { logout(); setAccountDropdown(false); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-[#f5eee6]">Logout</button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
} 