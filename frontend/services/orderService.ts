import { api } from './api';
import type { Order, OrderStatus } from './types';

/**
 * Create a new order.  Requires the user to be authenticated.  The
 * payload must include the items and the shipping address.  Payment
 * details are handled server-side for now.
 */
export async function createOrder(payload: {
  items: { productId: string; quantity: number; selectedVariation?: string }[];
  address: { line1: string; city: string; region?: string; postalCode?: string; country?: string };
  paymentMethod?: string;
  coupon?: string;
}): Promise<Order> {
  const { data } = await api.post<Order>('/orders', payload);
  return data;
}

/**
 * Fetch the authenticated user's orders.  Returns an array of orders
 * sorted by newest first.  If the API responds with an empty array
 * the user has not placed any orders yet.
 */
export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders');
  return data;
}

/**
 * Administrator/Vendor only: fetch all orders.  Accepts optional
 * parameters for filtering or pagination.
 */
export async function listOrders(params?: Record<string, any>): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/orders', { params });
  return data;
}

/**
 * Update the status of an order.  Only available to administrators
 * and vendors.  Returns the updated order.
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const { data } = await api.put<Order>(`/orders/${id}`, { status });
  return data;
}