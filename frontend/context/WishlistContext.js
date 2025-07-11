import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) return setWishlist([]);
    setLoading(true);
    try {
      const data = await wishlistAPI.get();
      setWishlist(data);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line
  }, [user]);

  const addToWishlist = async (productId) => {
    await wishlistAPI.add(productId);
    fetchWishlist();
  };
  const removeFromWishlist = async (productId) => {
    await wishlistAPI.remove(productId);
    fetchWishlist();
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, refreshWishlist: fetchWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
} 