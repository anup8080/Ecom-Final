import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  stock?: number;
  images: string[];
}

interface OrderItem {
  productId: string;
  quantity: number;
  selectedVariation?: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'products' | 'orders' | 'sales'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [sales, setSales] = useState<{ totalRevenue: number; totalOrders: number; bestSellers: { name: string; count: number }[] } | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal state for add/edit product
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Helper to refresh products
  const fetchProducts = async () => {
    try {
      const productsRes = await axios.get<Product[]>('/api/products');
      setProducts(productsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch products
  useEffect(() => {
    // Only admins or vendors can manage products
    if (!user || (user.role !== 'admin' && user.role !== 'vendor')) return;
    fetchProducts();
  }, [user]);

  // Fetch orders if admin or vendor
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'vendor')) return;
    async function fetchOrders() {
      try {
        const ordersRes = await axios.get<Order[]>('/api/orders?all=true');
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (tab === 'orders') {
      fetchOrders();
    }
  }, [tab, user]);

  // Fetch sales analytics
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'vendor')) return;
    async function fetchSales() {
      try {
        // Sales summary endpoint is under /api/orders/admin/sales
        const salesRes = await axios.get('/api/orders/admin/sales');
        setSales(salesRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    if (tab === 'sales') {
      fetchSales();
    }
  }, [tab, user]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      // Product deletion endpoint is /api/products/:id
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Update order status via /api/orders/:id
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  // Only users with admin or vendor roles can view the dashboard
  if (!user || (user.role !== 'admin' && user.role !== 'vendor')) {
    return <div className="container mx-auto px-4 py-8">You are not authorized to access this page.</div>;
  }

  // Handlers for opening modals
  const openAddModal = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', stock: '', category: '' });
    setImageFile(null);
    setShowModal(true);
  };
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: (product as any).description || '',
      price: String(product.price || ''),
      stock: product.stock !== undefined ? String(product.stock) : '',
      category: product.category || '',
    });
    setImageFile(null);
    setShowModal(true);
  };

  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  // Submit handler for creating/updating product
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('description', form.description);
      data.append('price', form.price);
      if (form.stock) data.append('stock', form.stock);
      if (form.category) data.append('category', form.category);
      if (imageFile) data.append('images', imageFile);
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, data);
      } else {
        await axios.post('/api/products', data);
      }
      await fetchProducts();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-display mb-6">Admin Dashboard</h1>
      <div className="mb-6 flex space-x-4">
        <button onClick={() => setTab('products')} className={`px-4 py-2 rounded ${tab === 'products' ? 'bg-accent text-white' : 'bg-gray-200'}`}>Products</button>
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-accent text-white' : 'bg-gray-200'}`}>Orders</button>
        <button onClick={() => setTab('sales')} className={`px-4 py-2 rounded ${tab === 'sales' ? 'bg-accent text-white' : 'bg-gray-200'}`}>Sales</button>
      </div>
      {tab === 'products' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Product Listings</h2>
            <button
              onClick={openAddModal}
              className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </div>
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border-b">Image</th>
                  <th className="p-2 border-b">Name</th>
                  <th className="p-2 border-b">Price</th>
                  <th className="p-2 border-b">Stock</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="p-2">
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded" />
                      )}
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">रू {product.price}</td>
                    <td className="p-2">{(product as any).stock ?? '-'}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {tab === 'orders' && (
        <div>
          <h2 className="text-xl font-medium mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border rounded p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                      <p className="text-sm">Items: {order.items.map(i => `${i.productId} (x${i.quantity})`).join(', ')}</p>
                      <p className="text-sm">Address: {order.address}</p>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Status</label>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab === 'sales' && (
        <div>
          <h2 className="text-xl font-medium mb-4">Sales Analytics</h2>
          {sales ? (
            <div>
              <p>Total revenue: <span className="font-semibold">रू {sales.totalRevenue}</span></p>
              <p>Total orders: <span className="font-semibold">{sales.totalOrders}</span></p>
              <h3 className="mt-4 font-medium">Best Selling Momos</h3>
              <ul className="list-disc list-inside">
                {sales.bestSellers.map(item => (
                  <li key={item.name}>{item.name} – {item.count} sold</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Loading sales data...</p>
          )}
        </div>
      )}
      {/* Modal for add/edit product */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-2 p-6 relative">
            <h3 className="text-lg font-medium mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm mb-1">Product Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm mb-1">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm mb-1">Stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm mb-1">Category</label>
                <input
                  id="category"
                  name="category"
                  type="text"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm mb-1">Upload Image</label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}