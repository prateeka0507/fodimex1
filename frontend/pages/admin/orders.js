import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminNav from '../../components/admin/AdminNav';
import { ordersAPI } from '../../services/api';

export default function AdminOrders() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState({});
  const [statusMsg, setStatusMsg] = useState('');
  // Filtering state
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  // Modal state
  const [modalOrder, setModalOrder] = useState(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [user, filterStatus, filterUser, filterStart, filterEnd]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterUser) params.append('user', filterUser);
      if (filterStart) params.append('startDate', filterStart);
      if (filterEnd) params.append('endDate', filterEnd);
      const data = await ordersAPI.getAll(params.toString() ? Object.fromEntries(params) : undefined);
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusLoading(s => ({ ...s, [orderId]: true }));
    setStatusMsg('');
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      setStatusMsg('Order status updated!');
      fetchOrders();
    } catch (err) {
      setStatusMsg(err.message || 'Failed to update status');
    } finally {
      setStatusLoading(s => ({ ...s, [orderId]: false }));
    }
  };

  if (loading || !user) return <div>Loading...</div>;
  if (user.role !== 'admin') return null;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <AdminNav />
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      {/* Filtering controls */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded px-2 py-1">
            <option value="">All</option>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">User (email or ID)</label>
          <input value={filterUser} onChange={e => setFilterUser(e.target.value)} className="border rounded px-2 py-1" placeholder="Email or ID" />
        </div>
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input type="date" value={filterStart} onChange={e => setFilterStart(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input type="date" value={filterEnd} onChange={e => setFilterEnd(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <button onClick={fetchOrders} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Apply</button>
        <button onClick={() => { setFilterStatus(''); setFilterUser(''); setFilterStart(''); setFilterEnd(''); }} className="bg-gray-200 px-4 py-2 rounded">Reset</button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {statusMsg && <div className="text-green-600 mb-4">{statusMsg}</div>}
      {loadingOrders ? (
        <div>Loading orders...</div>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Items</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.User ? `${order.User.name} (${order.User.email})` : 'N/A'}</td>
                <td className="p-2 border">${order.total}</td>
                <td className="p-2 border">{order.status}
                 <select
                   className="ml-2 border rounded px-2 py-1"
                   value={order.status}
                   onChange={e => handleStatusChange(order.id, e.target.value)}
                   disabled={statusLoading[order.id]}
                 >
                   {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                     <option key={s} value={s}>{s}</option>
                   ))}
                 </select>
                 {statusLoading[order.id] && <span className="ml-2 text-xs text-gray-500">Saving...</span>}
                </td>
                <td className="p-2 border">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="p-2 border">
                  <ul>
                    {order.OrderItems.map(item => (
                      <li key={item.id}>
                        {item.Product ? item.Product.name : 'Product'} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 border">
                  <button onClick={() => setModalOrder(order)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Order details modal */}
      {modalOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
            <button onClick={() => setModalOrder(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-2">Order #{modalOrder.id}</h2>
            <div className="mb-2">Status: <span className="font-semibold">{modalOrder.status}</span></div>
            <div className="mb-2">Created: {new Date(modalOrder.createdAt).toLocaleString()}</div>
            <div className="mb-2">User: {modalOrder.User ? `${modalOrder.User.name} (${modalOrder.User.email})` : 'N/A'}</div>
            <div className="mb-2">Shipping Info: <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(modalOrder.shippingInfo, null, 2)}</pre></div>
            <div className="mb-2">Shipping Address: <span className="font-mono">{modalOrder.shippingAddress}</span></div>
            <div className="mb-2">Total: <span className="font-semibold">${modalOrder.total}</span></div>
            <div className="mb-2">Items:</div>
            <ul className="mb-2">
              {modalOrder.OrderItems.map(item => (
                <li key={item.id} className="mb-1">
                  {item.Product ? (
                    <span>{item.Product.name} (ID: {item.Product.id})</span>
                  ) : 'Product'} x {item.quantity} @ ${item.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 