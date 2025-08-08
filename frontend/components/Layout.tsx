import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ReactNode, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * The Layout component wraps all pages and provides a consistent header
 * and footer.  It also wires up the search bar, cart indicator and
 * displays the user’s name when logged in.  Navigation links collapse
 * into a hamburger menu on smaller screens (optional for further
 * enhancement).
 */
export default function Layout({ children }: LayoutProps) {
  // The Layout component now omits the old header and search bar.  Pages
  // should include their own top navigation via the TopBar component.  A
  // consistent footer is still provided.
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-primary-dark mt-12 py-8 text-gray-700 border-t border-gray-200">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl mb-2 text-accent">MomoHub</h3>
            <p className="text-sm">Delivering the authentic taste of Nepali momos across Kathmandu. Made fresh and served with love.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent">Terms & Conditions</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-3">
              <a href="#" aria-label="Facebook" className="hover:text-accent">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.594 0 0 .593 0 1.326v21.348C0 23.407.594 24 1.325 24h11.495v-9.294H9.694v-3.622h3.126V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24l-1.918.001c-1.504 0-1.796.714-1.796 1.764v2.314h3.592l-.468 3.622h-3.124V24h6.124c.73 0 1.325-.593 1.325-1.326V1.326C24 .593 23.405 0 22.675 0z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-accent">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.35 3.608 1.325.975.975 1.264 2.242 1.326 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.069 4.85c-.062 1.366-.351 2.633-1.326 3.608-.975.975-2.242 1.264-3.608 1.326-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.069c-1.366-.062-2.633-.351-3.608-1.326-.975-.975-1.264-2.242-1.326-3.608C2.175 15.748 2.163 15.368 2.163 12s.012-3.584.069-4.85c.062-1.366.351-2.633 1.326-3.608.975-.975 2.242-1.264 3.608-1.326C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.797.129 4.486.341 3.338 1.489 2.19 2.637 1.978 3.948 1.92 5.203.862 7.052.85 7.461.85 12c0 4.538.012 4.948.07 6.198.059 1.255.271 2.566 1.419 3.714 1.148 1.148 2.459 1.36 3.714 1.419 1.25.058 1.66.07 6.198.07s4.948-.012 6.198-.07c1.255-.059 2.566-.271 3.714-1.419 1.148-1.148 1.36-2.459 1.419-3.714.058-1.25.07-1.66.07-6.198s-.012-4.948-.07-6.198c-.059-1.255-.271-2.566-1.419-3.714C20.366 1.978 19.055 1.766 17.8 1.708 16.55 1.649 16.14 1.637 12 1.637z" />
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-accent">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.949.564-2.003.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.72 0-4.925 2.206-4.925 4.924 0 .39.045.765.127 1.124-4.094-.205-7.72-2.165-10.148-5.144-.425.729-.666 1.577-.666 2.476 0 1.708.869 3.213 2.188 4.099-.807-.026-1.566-.247-2.228-.616v.062c0 2.385 1.693 4.374 3.946 4.827-.413.112-.849.171-1.296.171-.318 0-.626-.031-.928-.088.627 1.956 2.444 3.381 4.6 3.421-1.68 1.319-3.809 2.105-6.102 2.105-.396 0-.787-.023-1.17-.067 2.179 1.397 4.768 2.213 7.548 2.213 9.054 0 14-7.496 14-13.986 0-.21 0-.423-.015-.633A10.012 10.012 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} MomoHub. All rights reserved.</div>
      </footer>
    </div>
  );
}