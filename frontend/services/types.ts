/**
 * Shared domain types for the client.  These interfaces describe the
 * structure of data returned from the backend API.  Keeping them in one
 * place makes it easy to stay in sync as your data model evolves.
 */

// Roles supported by the authentication system.  Administrators can
// manage products and orders, vendors can manage their own listings,
// and customers can browse and place orders.
export type Role = 'admin' | 'vendor' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  verified?: boolean;
  lastLogin?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Variant {
  name: string;             // e.g. "Large/Spicy"
  sku?: string;
  price?: number;           // price override for this variant
  stock?: number;           // stock available for this variant
}

export interface Review {
  userId: string;
  rating: number;           // rating 1..5
  comment?: string;
  createdAt: string;
}

export interface Product {
  id: string;               // server should map _id -> id in responses
  name: string;
  description?: string;
  price: number;
  category?: string;
  brand?: string;
  sku?: string;
  stock?: number;
  discount?: number;
  isFeatured?: boolean;
  tags?: string[];
  images: string[];
  variants?: Variant[];
  rating?: number;
  reviews?: Review[];
  digital?: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  selectedVariation?: string;
  priceAtPurchase?: number;
}

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type OrderStatus = 'pending' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: {
    line1: string;
    city: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
  total: number;
  discount?: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  deliveryDate?: string;
  trackingId?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}