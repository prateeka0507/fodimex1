import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminNav from '../../components/admin/AdminNav';

function AdminUsers() {
  // Placeholder content for now
  return (
    <div className="max-w-4xl mx-auto py-8">
      <AdminNav />
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <div className="bg-white p-6 rounded shadow">User management features coming soon.</div>
    </div>
  );
}

export default AdminUsers; 