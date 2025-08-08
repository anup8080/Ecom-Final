import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import TopBar from '../components/TopBar';
import { useRouter } from 'next/router';
import { createOrder } from '../services/orderService';
import Link from 'next/link';

/**
 * The checkout page collects delivery information and payment details
 * from the user and displays a summary of the cart.  When submitted
 * the order is posted to the backend and the cart is cleared.  A
 * confirmation message is displayed afterwards.
 */
export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    city: '',
    region: '',
    postalCode: '',
    paymentMethod: 'cod',
  });
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const delivery = subtotal > 0 ? 20 : 0;
  const total = subtotal + delivery;

  const placeOrder = async () => {
    if (items.length === 0) return;
    setPlacing(true);
    try {
      await createOrder({
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity, selectedVariation: i.selectedVariation })),
        address: {
          line1: form.line1,
          city: form.city,
          region: form.region,
          postalCode: form.postalCode,
        },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      setSuccess('Your order has been placed successfully!');
      setTimeout(() => router.push('/orders'), 3000);
    } catch (err) {
      console.error('Failed to place order', err);
    }
    setPlacing(false);
  };

  return (
    <div className="min-h-screen bg-primary">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        {items.length === 0 && !success ? (
          <p>
            Your cart is empty.{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              Browse products
            </Link>
            .
          </p>
        ) : success ? (
          <div className="rounded-xl bg-green-50 p-4 text-green-700">{success}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="line1" className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line
                  </label>
                  <input
                    id="line1"
                    name="line1"
                    type="text"
                    value={form.line1}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      Region
                    </label>
                    <input
                      id="region"
                      name="region"
                      type="text"
                      value={form.region}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={form.postalCode}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    >
                      <option value="cod">Cash on Delivery</option>
                      <option value="esewa">eSewa</option>
                      <option value="khalti">Khalti</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* Order Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 h-fit shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <ul className="divide-y divide-gray-200 mb-4">
                {items.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Delivery</span>
                <span>Rs. {delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-base font-medium">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full mt-4 rounded-full bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}