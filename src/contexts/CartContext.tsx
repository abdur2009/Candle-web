import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartProduct[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartProduct[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Check stock availability
  const checkStock = async (productId: string, requestedQuantity: number): Promise<boolean> => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
      const product = response.data;
      
      if (product.stock < requestedQuantity) {
        toast.error(`Only ${product.stock} items available`);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking stock:', error);
      toast.error('Failed to verify stock availability');
      return false;
    }
  };

  // Add product to cart
  const addToCart = async (product: CartProduct, quantity: number = 1) => {
    const existingProduct = cart.find((item) => item._id === product._id);
    const totalQuantity = (existingProduct?.quantity || 0) + quantity;
    
    // Check stock before adding
    const hasStock = await checkStock(product._id, totalQuantity);
    if (!hasStock) return;

    setCart((prevCart) => {
      if (existingProduct) {
        // Update quantity if product already exists in cart
        const updatedCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        toast.success('Cart updated!');
        return updatedCart;
      } else {
        // Add new product to cart
        toast.success('Added to cart!');
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== productId);
      toast.info('Item removed from cart');
      return updatedCart;
    });
  };

  // Update product quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    // Check stock before updating
    const hasStock = await checkStock(productId, quantity);
    if (!hasStock) return;

    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      return updatedCart;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared');
  };

  // Calculate total items
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;