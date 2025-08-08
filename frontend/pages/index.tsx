import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TopBar from '../components/TopBar';
import { getProducts } from '../services/productService';
import type { Product } from '../services/types';

/**
 * The home page displays a banner, category filters, sorting options and a
 * grid of products.  It consumes the `getProducts` API and performs
 * client-side search, category filtering and sorting.  The search bar is
 * provided by the TopBar component; when the query changes the grid
 * automatically filters.
 */
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc'>('featured');

  // Fetch products on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Derive unique categories from products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.category && set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter and sort products based on query and active category
  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'All') {
      list = list.filter(p => (p.category || '').toLowerCase() === activeCategory.toLowerCase());
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'priceAsc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // featured: keep server order
        break;
    }
    return list;
  }, [products, activeCategory, query, sortBy]);

  return (
    <div className="min-h-screen bg-primary">
      {/* Top navigation bar */}
      <TopBar query={query} onQueryChange={setQuery} />

      {/* Hero banner */}
      <section className="mx-auto mt-6 max-w-7xl px-4" aria-label="Promotional banner">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="relative col-span-1 md:col-span-12 overflow-hidden rounded-2xl bg-amber-100">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_0%_0%,#fde68a,transparent_60%),radial-gradient(80%_120%_at_100%_100%,#fca5a5,transparent_60%)]" />
            <div className="flex flex-col gap-3 p-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">Get 10% Cashback</p>
                <h2 className="mt-1 text-2xl font-bold text-amber-900">On shopping Rs. 1500+</h2>
                <p className="mt-2 max-w-xl text-sm text-amber-900/80">
                  Enjoy freshly handcrafted momos and groceries delivered straight to your door. Order now and taste the difference.
                </p>
                <Link
                  href="#catalog"
                  className="mt-4 inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                  Shop Now
                </Link>
              </div>
              <div className="relative h-36 w-full md:h-40 md:w-80">
                <Image
                  src="/images/hero.jpg"
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <h3 className="text-sm text-gray-500">
          MomoHub / <span className="text-gray-800">All category</span>
        </h3>
      </div>

      {/* Filters and sort controls */}
      <section className="mx-auto mt-4 max-w-7xl px-4" id="catalog">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  activeCategory === cat
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
            {/* Additional chips as placeholders for visual consistency */}
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-blue-300">Price</button>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-blue-300">Review</button>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-blue-300">Offer</button>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-blue-300">All Filters</button>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A–Z</option>
              <option value="nameDesc">Name: Z–A</option>
            </select>
          </div>
        </div>

        {/* Product grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {loading ? (
            <div className="col-span-full py-10 text-center">Loading products…</div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-10 text-center text-gray-500">No products found.</div>
          ) : (
            filtered.map((p) => {
              // Determine any discount and compute display price.  Discount is
              // expected to be a percentage (e.g. 20 for 20% off).  If no
              // discount field is present the original price is shown.
              const discount = p.discount ?? 0;
              const discounted = discount > 0 ? p.price * (1 - discount / 100) : p.price;
              // Grab a simple weight label from variants or tags if available.
              const weight = p.variants?.[0]?.name || p.tags?.[0] || '';
              return (
                <article key={p.id} className="group rounded-2xl border border-gray-200 bg-white p-3 transition hover:shadow-md">
                  {/* Image wrapper */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50">
                    <img
                      src={p.images?.[0] || '/images/placeholder.png'}
                      alt={p.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]"
                    />
                    {/* Weight tag */}
                    {weight && (
                      <span className="absolute left-2 top-2 rounded-md bg-blue-600 bg-opacity-80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
                        {weight}
                      </span>
                    )}
                    {/* Discount badge */}
                    {discount > 0 && (
                      <span className="absolute right-2 top-2 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        -{discount}%
                      </span>
                    )}
                  </div>
                  {/* Product name and category */}
                  <h4 className="mt-3 line-clamp-2 text-sm font-semibold text-gray-900">{p.name}</h4>
                  <div className="mt-1 text-xs text-gray-500">{p.category || '—'}</div>
                  {/* Price and actions */}
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        Rs. {discounted.toFixed(2)}
                      </div>
                      {discount > 0 && (
                        <div className="text-xs text-gray-500 line-through">Rs. {p.price.toFixed(2)}</div>
                      )}
                      {p.stock != null && (
                        <div className="text-xs text-gray-500">{p.stock} in stock</div>
                      )}
                    </div>
                    <Link
                      href={`/product/${p.id}`}
                      className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}