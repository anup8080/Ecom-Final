import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../contexts/CartContext';
import TopBar from '../components/TopBar';

/**
 * Displays the contents of the user's cart with quantity controls,
 * pricing breakdown and a button to proceed to checkout.  A TopBar is
 * included at the top of the page for navigation and search.
 */
export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const delivery = subtotal > 0 ? 20 : 0;
  const total = subtotal + delivery;

  return (
    <div className="min-h-screen bg-primary">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {items.length === 0 ? (
          <p>
            Your cart is empty.{' '}
            <Link href="/" className="text-blue-600 hover:underline">
              Browse products
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex flex-col sm:flex-row items-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm"
                >
                  <div className="relative h-32 w-full sm:h-24 sm:w-24 flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 w-full">
                    <h3 className="truncate font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Rs. {item.price.toFixed(2)}</p>
                    <div className="mt-2 flex items-center gap-3 text-sm">
                      <span className="text-gray-700">Qty</span>
                      <div className="inline-flex items-center overflow-hidden rounded-full border border-gray-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="flex h-8 w-8 items-center justify-center text-lg text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <input
                          id={`qty-${index}`}
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, Math.max(1, parseInt(e.target.value) || 1))}
                          className="h-8 w-12 text-center outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center text-lg text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="w-full sm:w-auto sm:h-full px-4 py-3 sm:px-4 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 h-fit shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
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
              <Link
                href="/checkout"
                className="mt-4 block rounded-full bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}