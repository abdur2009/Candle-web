import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Eye, Package } from 'lucide-react';
import { toast } from 'react-toastify';

// Mock data for orders (will be replaced with API data)
const MOCK_ORDERS = [
  {
    _id: '1',
    orderNumber: '10001',
    date: '2023-05-15T10:30:00',
    customer: {
      _id: '101',
      name: 'Jessica Davis',
      email: 'jessica@example.com'
    },
    items: [
      {
        _id: '1',
        name: 'Lavender Dreams',
        price: 24.99,
        quantity: 2,
        image: 'https://images.pexels.com/photos/4498184/pexels-photo-4498184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        _id: '2',
        name: 'Vanilla Bliss',
        price: 19.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ],
    total: 68.97,
    status: 'Delivered',
    shippingAddress: {
      address: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'United States'
    },
    paymentMethod: 'creditCard'
  },
  {
    _id: '2',
    orderNumber: '10002',
    date: '2023-06-22T14:15:00',
    customer: {
      _id: '102',
      name: 'David Brown',
      email: 'david@example.com'
    },
    items: [
      {
        _id: '3',
        name: 'Ocean Breeze',
        price: 22.99,
        quantity: 2,
        image: 'https://images.pexels.com/photos/7783699/pexels-photo-7783699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ],
    total: 45.98,
    status: 'Shipped',
    shippingAddress: {
      address: '456 Oak Ave',
      city: 'Somewhere',
      postalCode: '67890',
      country: 'United States'
    },
    paymentMethod: 'easyPaisa'
  },
  {
    _id: '3',
    orderNumber: '10003',
    date: '2023-07-08T09:45:00',
    customer: {
      _id: '103',
      name: 'Sarah Williams',
      email: 'sarah@example.com'
    },
    items: [
      {
        _id: '4',
        name: 'Cinnamon Spice',
        price: 21.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/11793440/pexels-photo-11793440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        _id: '5',
        name: 'Rose Garden',
        price: 26.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/9987224/pexels-photo-9987224.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ],
    total: 48.98,
    status: 'Processing',
    shippingAddress: {
      address: '789 Pine Rd',
      city: 'Elsewhere',
      postalCode: '54321',
      country: 'United States'
    },
    paymentMethod: 'jazzCash'
  },
  {
    _id: '4',
    orderNumber: '10004',
    date: '2023-08-17T16:20:00',
    customer: {
      _id: '104',
      name: 'Michael Smith',
      email: 'michael@example.com'
    },
    items: [
      {
        _id: '6',
        name: 'Eucalyptus Mint',
        price: 23.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/6869653/pexels-photo-6869653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        _id: '7',
        name: 'Amber & Sandalwood',
        price: 28.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/4207799/pexels-photo-4207799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ],
    total: 52.98,
    status: 'Processing',
    shippingAddress: {
      address: '321 Maple Dr',
      city: 'Nowhere',
      postalCode: '09876',
      country: 'United States'
    },
    paymentMethod: 'creditCard'
  },
  {
    _id: '5',
    orderNumber: '10005',
    date: '2023-09-30T11:10:00',
    customer: {
      _id: '105',
      name: 'Emily Johnson',
      email: 'emily@example.com'
    },
    items: [
      {
        _id: '8',
        name: 'Citrus Sunshine',
        price: 20.99,
        quantity: 2,
        image: 'https://images.pexels.com/photos/6443303/pexels-photo-6443303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      },
      {
        _id: '1',
        name: 'Lavender Dreams',
        price: 24.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/4498184/pexels-photo-4498184.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ],
    total: 66.97,
    status: 'Processing',
    shippingAddress: {
      address: '654 Cedar Ln',
      city: 'Someplace',
      postalCode: '13579',
      country: 'United States'
    },
    paymentMethod: 'creditCard'
  }
];

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
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState('');
  
  // Fetch orders from API
  useEffect(() => {
    // In a real implementation, you would fetch from the backend
    /* 
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/orders');
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    */
    
    // Simulate API call
    setTimeout(() => {
      setFilteredOrders(orders);
      setLoading(false);
    }, 500);
  }, []);
  
  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by search term (order number or customer name)
    if (searchTerm) {
      filtered = filtered.filter(
        order => 
          order.orderNumber.includes(searchTerm) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  const openOrderModal = (order: Order) => {
    setCurrentOrder(order);
    setEditStatus(order.status);
    setShowOrderModal(true);
  };
  
  const closeOrderModal = () => {
    setShowOrderModal(false);
    setCurrentOrder(null);
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditStatus(e.target.value);
  };
  
  const updateOrderStatus = () => {
    if (!currentOrder) return;
    
    // In a real implementation, you would send data to your backend
    /* 
    const updateStatus = async () => {
      try {
        await axios.put(`http://localhost:5000/api/admin/orders/${currentOrder._id}`, {
          status: editStatus
        });
        
        // Update local state
        const updatedOrders = orders.map(order => 
          order._id === currentOrder._id ? { ...order, status: editStatus } : order
        );
        setOrders(updatedOrders);
        
        toast.success('Order status updated successfully!');
        closeOrderModal();
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('Failed to update order status');
      }
    };

    updateStatus();
    */
    
    // For demo purposes, we'll just update the local state
    const updatedOrders = orders.map(order => 
      order._id === currentOrder._id ? { ...order, status: editStatus } : order
    );
    setOrders(updatedOrders);
    
    toast.success('Order status updated successfully!');
    closeOrderModal();
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
                onChange={handleSearch}
                className="input pl-10"
              />
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
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
                    onClick={() => toggleOrderExpand(order._id)}
                  >
                    <div className="flex items-center">
                      <div className="mr-4">
                        {expandedOrderId === order._id ? (
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
                          {new Date(order.date).toLocaleDateString()} · {order.customer.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center">
                      <div className="mr-6">
                        <p className="text-sm text-neutral-500">Total</p>
                        <p className="font-medium">${order.total.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderModal(order);
                        }}
                        className="btn btn-outline flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded Order Details */}
                  {expandedOrderId === order._id && (
                    <div className="mt-4 ml-9 border-t border-neutral-200 pt-4 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-neutral-500 mb-2">Order Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item._id} className="flex items-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-md mr-3"
                                />
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-neutral-600">
                                    ${item.price.toFixed(2)} x {item.quantity}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-neutral-500 mb-2">Shipping Address</h4>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
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
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" onClick={closeOrderModal}></div>
            
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
                  <p>{currentOrder.customer.name}</p>
                  <p className="text-sm">{currentOrder.customer.email}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Items</p>
                  <div className="mt-2 space-y-3">
                    {currentOrder.items.map((item) => (
                      <div key={item._id} className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                        />
                        <div className="flex-grow">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-neutral-600">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Shipping Address</p>
                  <p>{currentOrder.shippingAddress.address}</p>
                  <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}</p>
                  <p>{currentOrder.shippingAddress.country}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-neutral-500">Payment Method</p>
                  <p className="capitalize">{currentOrder.paymentMethod}</p>
                </div>
                
                <div className="mb-4 pt-3 border-t border-neutral-200">
                  <div className="flex justify-between">
                    <p className="font-medium">Total</p>
                    <p className="font-bold">${currentOrder.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                    Update Status
                  </label>
                  <select
                    id="status"
                    value={editStatus}
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
                  onClick={closeOrderModal}
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