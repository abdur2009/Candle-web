import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Package, Eye, ExternalLink, X, Check } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  totalPrice: number;
  items: OrderItem[];
  customer?: {
    _id: string;
    name: string;
    email: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  taxAmount?: number;
  taxPercentage?: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const location = useLocation();
  
  // If a new order was just placed, add it to the top of the list
  useEffect(() => {
    if (location.state?.orderNumber) {
      const newOrderNumber = location.state.orderNumber;
      
      // Check if the order already exists (to avoid duplicates on page refresh)
      if (!orders.some(order => order.orderNumber === newOrderNumber.toString())) {
        fetchOrders(); // Refresh orders to get the new one
      }
    }
  }, [location.state]);
  
  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get<Order[]>('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform orders to handle both total and totalPrice fields
      const transformedOrders = response.data.map(order => ({
        ...order,
        total: order.total || order.totalPrice || 0
      }));
      
      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleTrackOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}/tracking`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTrackingInfo(response.data);
      setShowTrackingModal(true);
    } catch (error) {
      console.error('Error fetching tracking info:', error);
      toast.error('Failed to fetch tracking information');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrder(true);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await fetchOrders();
      toast.success('Order cancelled successfully');
      setShowDetailsModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(false);
    }
  };

  // Helper function for tracking progress
  const getTrackingStepStatus = (currentStatus: string, step: string) => {
    const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(currentStatus);
    const stepIndex = steps.indexOf(step);
    return stepIndex <= currentIndex;
  };

  const getTrackingProgressWidth = (status: string) => {
    switch (status) {
      case 'Order Placed': return '0%';
      case 'Processing': return '33%';
      case 'Shipped': return '66%';
      case 'Delivered': return '100%';
      default: return '0%';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <Package className="h-16 w-16 text-neutral-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
        <p className="text-neutral-600 mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <Link to="/" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">My Orders</h2>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="bg-neutral-50 p-4 border-b border-neutral-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-neutral-500">Order Number</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Date</p>
                  <p className="font-medium">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'Processing'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'Shipped'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Total</p>
                  <p className="font-medium">Rs. {(order.total || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {order.items?.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {order.items.map((item) => (
                    <div key={item._id} className="py-3 flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-neutral-600">
                          Rs. {(item.price || 0).toLocaleString()} x {item.quantity || 0}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600 italic">
                  Order details are being processed...
                </p>
              )}
              
              <div className="mt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => handleViewDetails(order)}
                  className="btn btn-outline flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>
                <button 
                  onClick={() => handleTrackOrder(order._id)}
                  className="btn btn-outline flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" onClick={() => setShowDetailsModal(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-neutral-900">Order #{selectedOrder.orderNumber}</h3>
                  <button onClick={() => setShowDetailsModal(false)} className="text-neutral-400 hover:text-neutral-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Date</p>
                  <p>{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    selectedOrder.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : selectedOrder.status === 'Processing'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedOrder.status === 'Shipped'
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedOrder.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Items</p>
                  <div className="mt-2 space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item._id} className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                        />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-neutral-600">
                            Rs. {(item.price || 0).toLocaleString()} x {item.quantity || 0}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Rs. {((item.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Shipping Address</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  <p>Pakistan</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Payment Method</p>
                  <p className="capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                
                <div className="space-y-2 pt-3 border-t border-neutral-200">
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-500">Subtotal</p>
                    <p>Rs. {(selectedOrder.total || 0).toLocaleString()}</p>
                  </div>
                  {selectedOrder.taxAmount && selectedOrder.taxPercentage && (
                    <div className="flex justify-between">
                      <p className="text-sm text-neutral-500">Tax ({selectedOrder.taxPercentage}%)</p>
                      <p>Rs. {selectedOrder.taxAmount.toLocaleString()}</p>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <p>Total (including tax)</p>
                    <p>Rs. {((selectedOrder.total || 0) + (selectedOrder.taxAmount || 0)).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      disabled={cancellingOrder}
                      className="btn btn-danger"
                    >
                      {cancellingOrder ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                  <button
                    onClick={() => handleTrackOrder(selectedOrder._id)}
                    className="btn btn-primary"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && trackingInfo && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" onClick={() => setShowTrackingModal(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-neutral-900">Tracking Information</h3>
                  <button onClick={() => setShowTrackingModal(false)} className="text-neutral-400 hover:text-neutral-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      {['Order Placed', 'Processing', 'Shipped', 'Delivered'].map((step, index) => {
                        const isCompleted = getTrackingStepStatus(trackingInfo.status, step);
                        const isCurrent = trackingInfo.status === step;
                        return (
                          <div key={step} className="flex flex-col items-center relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-neutral-200'
                            }`}>
                              {isCompleted && <Check className="h-5 w-5 text-white" />}
                              {!isCompleted && <span className="text-xs text-white">{index + 1}</span>}
                            </div>
                            <p className="text-xs mt-2">{step}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: getTrackingProgressWidth(trackingInfo.status) }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-500">Current Status</p>
                    <p className="font-medium">{trackingInfo.status}</p>
                  </div>
                  
                  {trackingInfo.trackingNumber && (
                    <div>
                      <p className="text-sm text-neutral-500">Tracking Number</p>
                      <p className="font-medium">{trackingInfo.trackingNumber}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-neutral-500">Shipping Method</p>
                    <p className="font-medium">{trackingInfo.shippingMethod}</p>
                  </div>
                  
                  {trackingInfo.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-neutral-500">Estimated Delivery</p>
                      <p className="font-medium">
                        {new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {trackingInfo.updates && trackingInfo.updates.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-neutral-900 mb-3">Tracking Updates</p>
                      <div className="space-y-4">
                        {trackingInfo.updates.map((update: any, index: number) => (
                          <div key={index} className="flex items-start">
                            <div className="min-w-[120px] text-sm text-neutral-500">
                              {new Date(update.timestamp).toLocaleDateString()}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{update.status}</p>
                              <p className="text-sm text-neutral-600">{update.location}</p>
                              {update.description && (
                                <p className="text-sm text-neutral-500 mt-1">{update.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;