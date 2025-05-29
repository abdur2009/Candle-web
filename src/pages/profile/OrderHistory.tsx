import React, { useState, useEffect } from 'react';
import { Clock, Search } from 'lucide-react';

// Mock data for order history (will be replaced with API data)
const MOCK_ORDER_HISTORY = [
  {
    _id: '1',
    orderNumber: '10001',
    date: '2023-05-15T10:30:00',
    status: 'Delivered',
    total: 68.97,
  },
  {
    _id: '2',
    orderNumber: '10002',
    date: '2023-06-22T14:15:00',
    status: 'Delivered',
    total: 45.98,
  },
  {
    _id: '3',
    orderNumber: '10003',
    date: '2023-07-08T09:45:00',
    status: 'Delivered',
    total: 32.99,
  },
  {
    _id: '4',
    orderNumber: '10004',
    date: '2023-08-17T16:20:00',
    status: 'Delivered',
    total: 54.97,
  },
  {
    _id: '5',
    orderNumber: '10005',
    date: '2023-09-30T11:10:00',
    status: 'Delivered',
    total: 76.95,
  }
];

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState(MOCK_ORDER_HISTORY);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(orders);
  
  // Fetch order history from API
  useEffect(() => {
    // In a real implementation, you would fetch from the backend
    /* 
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/orders/history');
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
    */
    
    // Simulate API call
    setTimeout(() => {
      setFilteredOrders(orders);
      setLoading(false);
    }, 500);
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
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;