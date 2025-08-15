import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  images: string[];
  variations?: string[];
}

interface Props {
  product: Product;
}

/**
 * A reusable product card component for listing pages.  Displays
 * the product image, name and price, and includes an add to cart
 * button.  The component uses Next.js Image for optimized image
 * loading.
 */
export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-w-1 aspect-h-1 overflow-hidden">
          {product.images && product.images[0] ? (
            <Image
              src={
                        product.images?.[0]
                          ? `${API_BASE}${product.images[0].startsWith('/') ? product.images[0] : '/' + product.images[0]}`
                          : '/images/placeholder.png'
                      }
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200" />
          )}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-accent font-semibold">रू  {product.price}</span>
          <button
            onClick={handleAdd}
            className="bg-accent text-white text-sm px-3 py-1 rounded hover:bg-blue-600 focus:outline-none"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}