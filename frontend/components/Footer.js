import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <div className="text-gray-600">&copy; {new Date().getFullYear()} Fodimex. All rights reserved.</div>
        <nav className="space-x-4 mt-2 md:mt-0">
          <Link href="/about" className="hover:text-blue-600">About</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        </nav>
      </div>
    </footer>
  );
} 