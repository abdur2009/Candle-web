import React, { useState, useEffect } from 'react';
import { Clock, Search, X, Check } from 'lucide-react';
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
  totalPrice?: number;
  items: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  description?: string;
  taxAmount?: number;
  taxPercentage?: number;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  
  // Fetch order history from API
  useEffect(() => {
    const fetchOrderHistory = async () => {
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
        setFilteredOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);
  
  // Filter orders based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = orders.filter(
        order => order.orderNumber.includes(searchTerm)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  }, [searchTerm, orders]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
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
      
      // Refresh orders
      await fetchOrderHistory();
      toast.success('Order cancelled successfully');
      setShowDetailsModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(false);
    }
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
          <Clock className="h-16 w-16 text-neutral-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">No Order History</h3>
        <p className="text-neutral-600">
          You don't have any completed orders yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-serif font-bold mb-6">Order History</h2>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by order number"
            value={searchTerm}
            onChange={handleSearch}
            className="input pl-10"
          />
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-6">
          <p>No orders found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Total</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-neutral-50">
                  <td className="px-4 py-4 text-sm">#{order.orderNumber}</td>
                  <td className="px-4 py-4 text-sm">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
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
                  </td>
                  <td className="px-4 py-4 text-sm">Rs. {(order.total || 0).toLocaleString()}</td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => openOrderDetails(order)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                          {item.description && (
                            <p className="text-sm text-neutral-500 mt-1">{item.description}</p>
                          )}
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

export default OrderHistory;