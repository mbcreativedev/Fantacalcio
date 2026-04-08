import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'e-commerce-cart';

export const useCart = () => useContext(CartContext);

const formatPrice = (priceInCents) => {
  if (priceInCents === null || priceInCents === undefined) return '€0.00';
  return `€${(priceInCents / 100).toFixed(2)}`;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, variant, quantity, availableQuantity) => {
    return new Promise((resolve, reject) => {
      // Se variant è null (prodotti PocketBase semplici), crea una variant fittizia
      const safeVariant = variant || {
        id: `pb-${product.id}`,
        title: product.name || product.title || 'Prodotto',
        price_in_cents: product.price_in_cents || 0,
        price_formatted: formatPrice(product.price_in_cents || 0),
        manage_inventory: false,
        currency_info: { symbol: '€', code: 'EUR' },
      };

      if (safeVariant.manage_inventory) {
        const existingItem = cartItems.find(item => item.variant.id === safeVariant.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        if ((currentCartQuantity + quantity) > availableQuantity) {
          reject(new Error(`Scorte insufficienti per ${product.title || product.name}.`));
          return;
        }
      }

      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.variant.id === safeVariant.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.variant.id === safeVariant.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { product, variant: safeVariant, quantity }];
      });
      resolve();
    });
  }, [cartItems]);

  const removeFromCart = useCallback((variantId) => {
    setCartItems(prevItems => prevItems.filter(item => item.variant.id !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.variant.id === variantId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    if (!cartItems || cartItems.length === 0) return '€0.00';
    const total = cartItems.reduce((sum, item) => {
      const price = item.variant?.sale_price_in_cents ?? item.variant?.price_in_cents ?? 0;
      return sum + price * item.quantity;
    }, 0);
    return formatPrice(total);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
