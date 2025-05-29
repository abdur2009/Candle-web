import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Package, Eye, ExternalLink } from 'lucide-react';

// Mock data for orders (will be replaced with API data)
const MOCK_ORDERS = [
  {
    _id: '1',
    orderNumber: '10001',
    date: '2023-05-15T10:30:00',
    status: 'Delivered',
    total: 68.97,
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
    ]
  },
  {
    _id: '2',
    orderNumber: '10002',
    date: '2023-06-22T14:15:00',
    status: 'Processing',
    total: 45.98,
    items: [
      {
        _id: '3',
        name: 'Ocean Breeze',
        price: 22.99,
        quantity: 2,
        image: 'https://images.pexels.com/photos/7783699/pexels-photo-7783699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
      }
    ]
  }
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // If a new order was just placed, add it to the top of the list
  useEffect(() => {
    if (location.state?.orderNumber) {
      const newOrderNumber = location.state.orderNumber;
      
      // Check if the order already exists (to avoid duplicates on page refresh)
      if (!orders.some(order => order.orderNumber === newOrderNumber.toString())) {
        const newOrder = {
          _id: `new-${Date.now()}`,
          orderNumber: newOrderNumber.toString(),
          date: new Date().toISOString(),
          status: 'Processing',
          total: 0, // This would come from the actual order
          items: [] // This would come from the actual order
        };
        
        setOrders([newOrder, ...orders]);
      }
    }
  }, [location.state]);
  
  // Fetch orders from API
  useEffect(() => {
    // In a real implementation, you would fetch from the backend
    /* 
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/orders');
        setOrders(response.data);
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
      setLoading(false);
    }, 500);
  }, []);

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
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Total</p>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {order.items.length > 0 ? (
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
                          ${item.price.toFixed(2)} x {item.quantity}
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
                <button className="btn btn-outline flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>
                <button className="btn btn-outline flex items-center">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Track Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;