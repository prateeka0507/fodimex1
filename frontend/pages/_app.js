import '../styles/globals.css'
import Layout from '../components/Layout'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import { WishlistProvider } from '../context/WishlistContext'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}

export default MyApp 