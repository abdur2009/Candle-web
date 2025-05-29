import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-12 bg-neutral-50">
        <div className="container-custom mx-auto text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-neutral-600 mb-6">
              Looks like you haven't added any candles to your cart yet.
            </p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-neutral-50">
      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-neutral-200">
                {cart.map((item) => (
                  <div key={item._id} className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full md:w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div>
                            <h3 className="text-lg font-medium mb-1">{item.name}</h3>
                            <p className="text-primary-600 font-bold mb-3">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center mb-3 md:mb-0">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="p-1 text-neutral-600 hover:text-primary-500 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-1 text-neutral-600 hover:text-primary-500"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-neutral-700">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="mb-4 pb-4 border-b border-neutral-200">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700">Shipping</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700">Tax</span>
                  <span className="font-medium">${(totalPrice * 0.07).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  ${(totalPrice + 5 + totalPrice * 0.07).toFixed(2)}
                </span>
              </div>
              
              <Link
                to="/checkout"
                className="btn btn-primary w-full"
              >
                Proceed to Checkout
              </Link>
              
              <div className="mt-4 text-center">
                <Link to="/" className="text-primary-600 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;