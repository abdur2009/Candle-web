import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, DollarSign, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  date: string;
  user: {
    name: string;
  };
  total: number;
  status: string;
}

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockProducts: number;
  recentOrders: Order[];
  monthlyGrowth: {
    sales: number;
    orders: number;
    customers: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    recentOrders: [],
    monthlyGrowth: {
      sales: 0,
      orders: 0,
      customers: 0
    }
  });
  const [loading, setLoading] = useState(true);
  
  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Ensure monthlyGrowth has default values if not provided
      const data = {
        ...response.data,
        monthlyGrowth: {
          sales: response.data.monthlyGrowth?.sales || 0,
          orders: response.data.monthlyGrowth?.orders || 0,
          customers: response.data.monthlyGrowth?.customers || 0
        }
      };
      
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-neutral-800">Admin Dashboard</h1>
          <p className="text-neutral-600">Welcome back! Here's what's happening with your store today.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Sales</p>
                <p className="text-2xl font-bold">Rs. {dashboardData.totalSales.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">{dashboardData.monthlyGrowth?.sales || 0}% from last month</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-secondary-100 p-3 rounded-full mr-4">
                <ShoppingBag className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Orders</p>
                <p className="text-2xl font-bold">{dashboardData.totalOrders}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">{dashboardData.monthlyGrowth?.orders || 0}% from last month</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-accent-100 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Customers</p>
                <p className="text-2xl font-bold">{dashboardData.totalCustomers}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">{dashboardData.monthlyGrowth?.customers || 0}% from last month</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Low Stock Products</p>
                <p className="text-2xl font-bold">{dashboardData.lowStockProducts}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/products" className="text-sm text-primary-600 hover:underline">
                View products
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {(dashboardData.recentOrders || []).map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      #{order.orderNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {order.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      Rs. {(order.total || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Shipped'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link 
                        to={`/admin/orders/${order._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(!dashboardData.recentOrders || dashboardData.recentOrders.length === 0) && (
            <div className="text-center py-6">
              <p className="text-neutral-600">No recent orders found</p>
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <ShoppingBag className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium">Manage Products</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              Add, edit, or remove products from your inventory.
            </p>
            <Link to="/admin/products" className="btn btn-primary w-full">
              Go to Products
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium">Manage Orders</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              View and update the status of customer orders.
            </p>
            <Link to="/admin/orders" className="btn btn-primary w-full">
              Go to Orders
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-medium">Manage Shipments</h3>
            </div>
            <p className="text-neutral-600 mb-4">
              Update shipping status and track deliveries.
            </p>
            <Link to="/admin/shipment" className="btn btn-primary w-full">
              Go to Shipments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;