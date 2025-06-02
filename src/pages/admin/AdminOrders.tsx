import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Eye, Package } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface Order {
  _id: string;
  orderNumber: string;
  date: string;
  customer: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  status: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice?: number;
  taxAmount?: number;
  taxPercentage?: number;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  
  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get<Order[]>('http://localhost:5000/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Transform orders to handle both total and totalPrice fields
        const transformedOrders = response.data.map(order => ({
          ...order,
          total: order.total || order.totalPrice || 0,
          customer: order.customer || {
            _id: '',
            name: 'Unknown Customer',
            email: ''
          }
        }));
        
        setOrders(transformedOrders);
        setFilteredOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  
  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(
        order => 
          order.orderNumber.includes(searchTerm) ||
          (order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  const updateOrderStatus = async () => {
    if (!currentOrder || !newStatus) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/admin/orders/${currentOrder._id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update orders in state
      setOrders(orders.map(order => 
        order._id === currentOrder._id ? { ...order, status: newStatus } : order
      ));

      toast.success('Order status updated successfully');
      setShowOrderModal(false);
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('Failed to update order status');
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-neutral-800">Orders</h1>
          <p className="text-neutral-600">Manage customer orders</p>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order number or customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="all">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Package className="h-16 w-16 text-neutral-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No Orders Found</h3>
              <p className="text-neutral-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'There are no orders yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredOrders.map((order) => (
                <div key={order._id} className="p-4">
                  <div 
                    className="flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer"
                    onClick={() => setExpandedOrders(expandedOrders.includes(order._id) ? expandedOrders.filter(id => id !== order._id) : [...expandedOrders, order._id])}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        {expandedOrders.includes(order._id) ? (
                          <ChevronUp className="h-5 w-5 text-neutral-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-neutral-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium">Order #{order.orderNumber}</h3>
                          <span className={`ml-3 inline-block px-2 py-1 text-xs rounded-full ${
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
                        <p className="text-sm text-neutral-500">
                          {new Date(order.date).toLocaleDateString()} · {order.customer?.name || 'Unknown Customer'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center">
                      <div className="mr-6">
                        <p className="text-sm text-neutral-500">Total</p>
                        <p className="font-medium">Rs. {(order.total || 0).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentOrder(order);
                          setNewStatus(order.status);
                          setShowOrderModal(true);
                        }}
                        className="btn btn-outline flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Order Details */}
                  {expandedOrders.includes(order._id) && (
                    <div className="mt-4 ml-9 border-t border-neutral-200 pt-4 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-neutral-500 mb-2">Order Items</h4>
                          <div className="space-y-3">
                            {order.items?.map((item) => (
                              <div key={item._id} className="flex items-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-md mr-3"
                                />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-neutral-600">
                                    Rs. {(item.price || 0).toLocaleString()} x {item.quantity || 0}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-neutral-500 mb-2">Shipping Address</h4>
                            <p>{order.shippingAddress?.address || 'No address provided'}</p>
                            <p>{order.shippingAddress?.city || 'No city'}, {order.shippingAddress?.postalCode || 'No postal code'}</p>
                            <p>{order.shippingAddress?.country || 'No country'}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-neutral-500 mb-2">Payment Method</h4>
                            <p className="capitalize">{order.paymentMethod}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Order Detail Modal */}
      {showOrderModal && currentOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" onClick={() => setShowOrderModal(false)}></div>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-neutral-900">Order #{currentOrder.orderNumber}</h3>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    currentOrder.status === 'Delivered'
                      ? 'bg-green-100 text-green-800'
                      : currentOrder.status === 'Processing'
                      ? 'bg-blue-100 text-blue-800'
                      : currentOrder.status === 'Shipped'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentOrder.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Date</p>
                  <p>{new Date(currentOrder.date).toLocaleDateString()}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Customer</p>
                  <p>{currentOrder.customer?.name || 'Unknown Customer'}</p>
                  <p className="text-sm">{currentOrder.customer?.email || 'No email provided'}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Items</p>
                  <div className="mt-2 space-y-3">
                    {currentOrder.items?.map((item) => (
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
                  <p>{currentOrder.shippingAddress?.address || 'No address provided'}</p>
                  <p>{currentOrder.shippingAddress?.city || 'No city'}, {currentOrder.shippingAddress?.postalCode || 'No postal code'}</p>
                  <p>{currentOrder.shippingAddress?.country || 'No country'}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Payment Method</p>
                  <p className="capitalize">{currentOrder.paymentMethod}</p>
                </div>
                
                <div className="space-y-2 pt-3 border-t border-neutral-200">
                  <div className="flex justify-between">
                    <p className="text-sm text-neutral-500">Subtotal</p>
                    <p>Rs. {(currentOrder.total || 0).toLocaleString()}</p>
                  </div>
                  {currentOrder.taxAmount && currentOrder.taxPercentage && (
                    <div className="flex justify-between">
                      <p className="text-sm text-neutral-500">Tax ({currentOrder.taxPercentage}%)</p>
                      <p>Rs. {currentOrder.taxAmount.toLocaleString()}</p>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <p>Total (including tax)</p>
                    <p>Rs. {((currentOrder.total || 0) + (currentOrder.taxAmount || 0)).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                    Update Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={handleStatusChange}
                    className="input"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              
              <div className="bg-neutral-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={updateOrderStatus}
                >
                  Update Status
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-neutral-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowOrderModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;