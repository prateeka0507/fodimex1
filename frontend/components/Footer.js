import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2E251D] py-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <div className="text-[#f5eee6]">&copy; {new Date().getFullYear()} Fodimex. All rights reserved.</div>
        <nav className="space-x-4 mt-2 md:mt-0">
          <Link href="/about" className="hover:text-[#b48a4a] text-[#f5eee6]">About</Link>
          <Link href="/contact" className="hover:text-[#b48a4a] text-[#f5eee6]">Contact</Link>
          <Link href="/blog" className="hover:text-[#b48a4a] text-[#f5eee6]">Blog</Link>
        </nav>
      </div>
    </footer>
  );
} 