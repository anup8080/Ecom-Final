import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Image from 'next/image';
import TopBar from '../../components/TopBar';
import { useCart } from '../../contexts/CartContext';
import { getProductById } from '../../services/productService';
import type { Product } from '../../services/types';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';


interface Props {
  product: Product | null;
}

/**
 * Displays detailed information about a single product.  Includes a
 * responsive image gallery, variant and quantity selectors, an add to
 * cart button and tabs for description and reviews.  A top bar is
 * shown at the top of the page to provide navigation and search.
 */
export default function ProductPage({ product }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  if (!product) {
    return (
      <div className="min-h-screen bg-primary">
        <TopBar />
        <main className="mx-auto max-w-7xl px-4 py-16 text-center">
          Product not found.
        </main>
      </div>
    );
  }

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name + (selectedVariation ? ` (${selectedVariation})` : ''),
      price: product.price,
      image: product.images[0] || '/images/placeholder.png',
      quantity,
      selectedVariation,
    });
  };
  // Compute discount and weight for display.  When a discount percentage
  // exists on the product, compute the discounted price.  Weight may
  // come from the first variant name or the first tag.
  const discount = product.discount ?? 0;
  const displayPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
  const weight = product.variants?.[0]?.name || product.tags?.[0] || '';

  // Helpers for quantity stepper.  Ensure quantity never falls below 1.
  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <div className="min-h-screen bg-primary">
      <TopBar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image gallery */}
          <div>
            <div className="relative w-full overflow-hidden rounded-2xl bg-gray-50" style={{ paddingTop: '75%' }}>
  {product?.images?.[0] ? (
    <img
      src={`${API_BASE}${product.images[0].startsWith('/') ? product.images[0] : '/' + product.images[0]}`}
      alt={product.name}
      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
    />
  ) : (
    <img
      src="/images/placeholder.png"
      alt="Placeholder"
      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
    />
  )}
</div>
            {product?.images && product.images.length > 1 && (
  <div className="mt-3 flex space-x-2 overflow-x-auto">
    {product.images.slice(1).map((img, idx) => (
      <div
        key={idx}
        className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200"
      >
        <img
          src={`${API_BASE}${img.startsWith('/') ? img : '/' + img}`}
          alt={`${product.name} ${idx + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
)}
          </div>

          {/* Product details */}
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">{product.name}</h1>
            {/* Weight label */}
            {weight && <div className="mb-1 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{weight}</div>}
            <p className="mb-4 text-sm text-gray-600">{product.description || 'No description available.'}</p>
            <div className="mb-4 flex items-baseline gap-2">
              <div className="text-3xl font-extrabold text-blue-700">Rs. {displayPrice.toFixed(2)}</div>
              {discount > 0 && (
                <div className="text-lg text-gray-500 line-through">Rs. {product.price.toFixed(2)}</div>
              )}
            </div>
            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                <label htmlFor="variant" className="block mb-1 font-medium text-gray-700">Variant</label>
                <select
                  id="variant"
                  value={selectedVariation}
                  onChange={(e) => setSelectedVariation(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                >
                  <option value="">Select variant</option>
                  {product.variants.map((v) => (
                    <option key={v.name} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-4 flex items-center space-x-4">
              <span className="font-medium text-gray-700">Quantity</span>
              <div className="inline-flex items-center rounded-full border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={decreaseQty}
                  className="h-8 w-8 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-8 w-12 text-center outline-none"
                />
                <button
                  type="button"
                  onClick={increaseQty}
                  className="h-8 w-8 flex items-center justify-center text-lg text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="mb-6 rounded-full bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Add to Cart
            </button>
            {/* Tabs for additional information */}
            <div>
              <div className="flex border-b border-gray-200 mb-2">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`px-3 py-2 text-sm font-medium ${activeTab === 'description' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`ml-4 px-3 py-2 text-sm font-medium ${activeTab === 'reviews' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                >
                  Reviews ({product.reviews?.length ?? 0})
                </button>
              </div>
              {activeTab === 'description' ? (
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {product.description || 'No description provided for this product.'}
                </p>
              ) : (
                <div className="space-y-3">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((r, idx) => (
                      <div key={idx} className="border-b pb-2">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                          <span>User {r.userId.slice(-4)}</span>
                          <span className="ml-2 text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        </div>
                        {r.comment && <p className="mt-1 text-sm text-gray-600">{r.comment}</p>}
                        <div className="mt-1 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No reviews yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  try {
    const product = await getProductById(id);
    return { props: { product } };
  } catch (err) {
    console.error('Error fetching product', err);
    return { props: { product: null } };
  }
};