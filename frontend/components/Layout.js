import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4">{children}</main>
      <Footer />
    </>
  );
} 