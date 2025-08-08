import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

interface TopBarProps {
  /**
   * Current search query.  Provided by the parent component.  If undefined
   * the search bar will still render but typing won't do anything.
   */
  query?: string;
  /**
   * Callback invoked when the search input changes.  Only used if
   * provided; otherwise the input is uncontrolled.
   */
  onQueryChange?: (value: string) => void;
}

/**
 * A responsive top bar that appears at the top of every page.  It
 * includes a brand link, search bar, a quick delivery message, cart
 * indicator, and authentication controls.  When a user is logged in
 * their first name is displayed and a logout option is available.  On
 * smaller screens the quick delivery banner is hidden.
 */
export default function TopBar({ query, onQueryChange }: TopBarProps) {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Compute total items in cart
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Hamburger for small screens */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800 hover:bg-blue-700 md:hidden"
        >
          <span className="block h-0.5 w-5 bg-white"></span>
          <span className="mt-1 block h-0.5 w-5 bg-white"></span>
          <span className="mt-1 block h-0.5 w-5 bg-white"></span>
        </button>

        {/* Brand */}
        <Link href="/" className="text-xl font-semibold tracking-tight">
          MomoHub
        </Link>

        {/* Search bar */}
        <div className="relative ml-auto flex-1 max-w-xl">
          <input
            type="search"
            value={query ?? ''}
            onChange={(e) => onQueryChange && onQueryChange(e.target.value)}
            placeholder="Search for Momos, Groceries…"
            className="w-full rounded-full bg-white px-5 py-2.5 pl-11 text-sm text-gray-800 shadow-sm outline-none placeholder:text-gray-400"
          />
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        {/* Delivery banner for medium screens */}
        <div className="hidden items-center gap-2 rounded-full bg-green-600/20 px-4 py-2 text-sm text-green-100 md:flex">
          <span className="inline-flex h-2 w-2 rounded-full bg-green-400" />
          Order now and get it within 15 min!
        </div>

        {/* Cart indicator */}
        <Link href="/cart" className="relative ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-800 hover:bg-blue-700">
          {/* Simple cart icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.684a.75.75 0 01.728.569l.466 1.863m0 0l1.198 4.79A2.25 2.25 0 008.5 12.75h7.72a2.25 2.25 0 002.246-2.044l.563-6.764A.75.75 0 0018.284 3H4.683m0 0L4.01 1.106A.75.75 0 003.284.75H1.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 21a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm6 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
            />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Auth controls */}
        {user ? (
          <div className="ml-2 flex items-center gap-2">
            <span className="hidden sm:block text-sm">Hi, {user.name.split(' ')[0]}</span>
            <button
              onClick={handleLogout}
              className="rounded-full bg-blue-800 px-4 py-2 text-sm hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="ml-2 rounded-full bg-blue-800 px-4 py-2 text-sm hover:bg-blue-700"
          >
            Sign In
          </Link>
        )}
      </div>
      {/* Optional mobile menu placeholder (not implemented) */}
      {menuOpen && (
        <div className="bg-blue-900 md:hidden">
          <nav className="space-y-2 px-4 py-3 text-white">
            <Link href="/" className="block">Home</Link>
            <Link href="/cart" className="block">Cart</Link>
            <Link href="/contact" className="block">Contact</Link>
            {user && <Link href="/orders" className="block">Orders</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}