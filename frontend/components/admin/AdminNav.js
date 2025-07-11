import Link from 'next/link';
   
export default function AdminNav() {
  return (
    <nav className="mb-6 flex gap-4 border-b pb-2">
      <Link href="/admin" className="text-blue-600 hover:underline">Dashboard</Link>
      <Link href="/admin/products" className="text-blue-600 hover:underline">Products</Link>
      {/* Add more links for Orders, Users, etc. if needed */}
    </nav>
  );
} 
