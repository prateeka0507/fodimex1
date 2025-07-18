import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, userAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Account() {
  const { user, loading, setUser } = useAuth();
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name, email: user.email });
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError('');
    try {
      const data = await ordersAPI.getUserOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const res = await userAPI.updateProfile(profileForm);
      setProfileMsg('Profile updated!');
      if (setUser) setUser(res.user);
    } catch (err) {
      setProfileMsg(err.message || 'Update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePwChange = (e) => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  };
  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwMsg('');
    try {
      await userAPI.updatePassword(pwForm);
      setPwMsg('Password updated!');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwMsg(err.message || 'Password update failed');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div className="py-8">Please log in to view your account.</div>;

  return (
    <div className="py-8 min-h-screen bg-[#f5eee6]">
      <h1 className="text-3xl font-bold mb-10 text-center text-[#2E251D]">My Account</h1>
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Profile Info */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#b48a4a]">
          <div className="text-xl font-bold mb-4 text-[#2E251D]">Profile Info</div>
          <form onSubmit={handleProfileSubmit} className="mb-6">
            <input name="name" value={profileForm.name} onChange={handleProfileChange} placeholder="Name" className="border rounded px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-[#b48a4a]" />
            <input name="email" value={profileForm.email} onChange={handleProfileChange} placeholder="Email" className="border rounded px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-[#b48a4a]" />
            <button type="submit" className="bg-[#b48a4a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a07628] transition w-full" disabled={profileLoading}>
              {profileLoading ? 'Saving...' : 'Update Profile'}
            </button>
            {profileMsg && <div className="mt-2 text-green-600 text-center">{profileMsg}</div>}
          </form>
          <div className="text-lg font-semibold mb-2 text-[#2E251D]">Change Password</div>
          <form onSubmit={handlePwSubmit} className="mb-2">
            <input name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} type="password" placeholder="Current Password" className="border rounded px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-[#b48a4a]" />
            <input name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} type="password" placeholder="New Password" className="border rounded px-3 py-2 w-full mb-3 focus:ring-2 focus:ring-[#b48a4a]" />
            <button type="submit" className="bg-[#b48a4a] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#a07628] transition w-full" disabled={pwLoading}>
              {pwLoading ? 'Saving...' : 'Change Password'}
            </button>
            {pwMsg && <div className="mt-2 text-green-600 text-center">{pwMsg}</div>}
          </form>
        </div>
        {/* Wishlist */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#b48a4a]">
          <div className="text-xl font-bold mb-4 text-[#2E251D]">My Wishlist</div>
          {wishlistLoading ? (
            <div>Loading wishlist...</div>
          ) : wishlist.length === 0 ? (
            <div className="text-[#7c6f5a]">No products in your wishlist.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {wishlist.map(item => (
                <div key={item.id} className="relative">
                  <ProductCard product={item.Product} />
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                    title="Remove from Wishlist"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Order History */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#b48a4a]">
          <div className="text-xl font-bold mb-4 text-[#2E251D]">Order History</div>
          {loadingOrders ? (
            <div>Loading orders...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-[#7c6f5a]">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#ede5d8] text-[#2E251D]">
                    <th className="p-2 border">Order ID</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Total</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-[#f5eee6]">
                      <td className="p-2 border">{order.id}</td>
                      <td className="p-2 border">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="p-2 border">₹{order.total}</td>
                      <td className="p-2 border">{order.status}</td>
                      <td className="p-2 border">
                        <ul>
                          {order.OrderItems.map(item => (
                            <li key={item.id}>
                              {item.Product ? item.Product.name : 'Product'} x {item.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 