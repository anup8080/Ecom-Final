import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

/**
 * Custom App to initialise global providers and layout.  Wrapping
 * components with AuthProvider and CartProvider makes the auth and
 * cart contexts available throughout the application.  Layout
 * provides a consistent header and footer.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}