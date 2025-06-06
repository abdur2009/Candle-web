import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import ShippingForm from '../components/checkout/ShippingForm';
import PaymentMethods from '../components/checkout/PaymentMethods';

const Checkout: React.FC = () => {
  const { cart, totalItems, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [shippingData, setShippingData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to place an order');
      navigate('/login');
      return;
    }

    // Validate form data
    if (!shippingData.firstName || !shippingData.lastName || !shippingData.email || 
        !shippingData.phone || !shippingData.address || !shippingData.city || 
        !shippingData.postalCode || !shippingData.country) {
      toast.error('Please fill in all shipping information');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
          country: shippingData.country
        },
        paymentMethod,
        totalPrice: orderTotal,
        taxAmount: tax,
        taxPercentage: 7,
        shipping: shipping
      };
      
      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/profile/orders', { state: { orderNumber: response.data.orderNumber } });
    } catch (error: any) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || 'There was an error processing your order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Calculate totals
  const shipping = 500.00;
  const tax = totalPrice * 0.07;
  const orderTotal = totalPrice + shipping + tax;

  return (
    <div className="min-h-screen py-12 bg-neutral-50">
      <div className="container-custom mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <ShippingForm formData={shippingData} onChange={handleShippingChange} />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6">
                  <PaymentMethods onSelectPaymentMethod={handlePaymentMethodChange} />
                </div>
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto"
                disabled={isProcessing || cart.length === 0}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Place Order'
                )}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="mb-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between py-2 border-b border-neutral-100">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md mr-3"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <div className="mb-4 pb-4 border-b border-neutral-200">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700">Subtotal ({totalItems} items)</span>
                  <span className="font-medium">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700">Shipping</span>
                  <span className="font-medium">Rs. {shipping.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700">Tax</span>
                  <span className="font-medium">Rs. {tax.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-lg font-bold">Order Total</span>
                <span className="text-lg font-bold text-primary-600">
                  Rs. {orderTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;