import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import TopBar from '../components/TopBar';
import { getMyOrders } from '../services/orderService';
import type { Order } from '../services/types';

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect guests to login page
        router.replace('/login');
        return;
      }
      (async () => {
        try {
          const data = await getMyOrders();
          // Sort newest first
          data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(data);
        } catch (err) {
          console.error('Failed to fetch orders', err);
        } finally {
          setFetching(false);
        }
      })();
    }
  }, [loading, user, router]);

  return (
    <div className="min-h-screen bg-primary">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        {fetching ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Order #{order.id.slice(-6)}</div>
                    <div className="text-lg font-semibold">{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <div className="text-lg font-bold">Rs. {order.total.toFixed(2)}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}