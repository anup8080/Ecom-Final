import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariation?: string;
}

interface CartContextProps {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Initialise from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (err) {
        // ignore
      }
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === newItem.productId && i.selectedVariation === newItem.selectedVariation);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};