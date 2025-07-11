import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminNav from '../../components/admin/AdminNav';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStats();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError('');
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch stats');
      setStats(data);
    } catch (err) {
      setStatsError(err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading || !user) return <div>Loading...</div>;
  if (user.role !== 'admin') return null;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <AdminNav />
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {statsLoading ? (
        <div>Loading stats...</div>
      ) : statsError ? (
        <div className="text-red-600">{statsError}</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded shadow text-center">
              <div className="text-2xl font-bold">{stats.userCount}</div>
              <div className="text-gray-600">Users</div>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <div className="text-2xl font-bold">{stats.productCount}</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <div className="text-2xl font-bold">${Number(stats.totalSales).toLocaleString()}</div>
              <div className="text-gray-600">Total Sales</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Order ID</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="py-2">{order.id}</td>
                    <td className="py-2">{order.User ? (order.User.name || order.User.email) : 'N/A'}</td>
                    <td className="py-2">${Number(order.total).toFixed(2)}</td>
                    <td className="py-2">{order.status}</td>
                    <td className="py-2">{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
} 