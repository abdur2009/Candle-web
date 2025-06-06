import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Truck, Package, Map, CheckCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface OrderDetails {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    _id: string;
    name: string;
    quantity: number;
  }>;
}

interface Shipment {
  _id: string;
  order: OrderDetails;
  status: string;
  trackingNumber: string | null;
  shippingMethod: string;
  estimatedDelivery: string;
  createdAt: string;
}

const AdminShipment: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentShipment, setCurrentShipment] = useState<Shipment | null>(null);
  const [updating, setUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    status: '',
    trackingNumber: '',
    estimatedDelivery: '',
    shippingMethod: ''
  });
  
  // Fetch shipments from API
    const fetchShipments = async () => {
      try {
        setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/admin/shipments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
        setShipments(response.data);
        setFilteredShipments(response.data);
    } catch (error: any) {
        console.error('Error fetching shipments:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch shipments');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchShipments();
  }, []);
  
  // Filter shipments based on search term and status
  useEffect(() => {
    let filtered = shipments;
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }
    
    // Filter by search term (order number or customer name)
    if (searchTerm) {
      filtered = filtered.filter(
        shipment => 
          shipment.order.orderNumber.includes(searchTerm) ||
          shipment.order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (shipment.trackingNumber && shipment.trackingNumber.includes(searchTerm))
      );
    }
    
    setFilteredShipments(filtered);
  }, [searchTerm, statusFilter, shipments]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const openUpdateModal = (shipment: Shipment) => {
    setCurrentShipment(shipment);
    setFormData({
      status: shipment.status,
      trackingNumber: shipment.trackingNumber || '',
      estimatedDelivery: new Date(shipment.estimatedDelivery).toISOString().split('T')[0],
      shippingMethod: shipment.shippingMethod
    });
    setShowUpdateModal(true);
  };
  
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setCurrentShipment(null);
    setUpdating(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUpdateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentShipment) return;
    
    // Validate form
    if (!formData.status || !formData.shippingMethod) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // If status is not 'Preparing', tracking number is required
    if (formData.status !== 'Preparing' && !formData.trackingNumber) {
      toast.error('Tracking number is required for this status');
      return;
    }
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/shipments/${currentShipment._id}`,
        {
          status: formData.status,
          trackingNumber: formData.trackingNumber || null,
          estimatedDelivery: `${formData.estimatedDelivery}T00:00:00.000Z`,
          shippingMethod: formData.shippingMethod
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
        
      await fetchShipments();
        toast.success('Shipment updated successfully!');
        closeUpdateModal();
    } catch (error: any) {
        console.error('Error updating shipment:', error);
      toast.error(error.response?.data?.message || 'Failed to update shipment');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Count shipments by status
  const shipmentCounts = {
    preparing: shipments.filter(s => s.status === 'Preparing').length,
    inTransit: shipments.filter(s => s.status === 'In Transit').length,
    readyForPickup: shipments.filter(s => s.status === 'Ready for Pickup').length,
    delivered: shipments.filter(s => s.status === 'Delivered').length
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-neutral-800">Shipment Management</h1>
          <p className="text-neutral-600">Track and manage order shipments</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Preparing</p>
                <p className="text-2xl font-bold">{shipmentCounts.preparing}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full mr-4">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">In Transit</p>
                <p className="text-2xl font-bold">{shipmentCounts.inTransit}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Map className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Ready for Pickup</p>
                <p className="text-2xl font-bold">{shipmentCounts.readyForPickup}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Delivered</p>
                <p className="text-2xl font-bold">{shipmentCounts.delivered}</p>
              </div>
            </div>
          </div>
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
                placeholder="Search by order number, customer, or tracking"
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
                <option value="Preparing">Preparing</option>
                <option value="In Transit">In Transit</option>
                <option value="Ready for Pickup">Ready for Pickup</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Shipping Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Tracking Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Est. Delivery
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-neutral-900">
                          #{shipment.order.orderNumber}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {shipment.order.user.name}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {new Date(shipment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {shipment.shippingMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {shipment.trackingNumber ? (
                        <span className="text-primary-600 font-medium">
                          {shipment.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-neutral-500 italic">Not assigned yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        shipment.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : shipment.status === 'In Transit'
                          ? 'bg-yellow-100 text-yellow-800'
                          : shipment.status === 'Ready for Pickup'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openUpdateModal(shipment)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredShipments.length === 0 && (
            <div className="text-center py-6">
              <p className="text-neutral-600">No shipments found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Update Shipment Modal */}
      {showUpdateModal && currentShipment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" onClick={closeUpdateModal}></div>
            
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-neutral-900">Update Shipment</h3>
                  <p className="text-sm text-neutral-500">
                    Order #{currentShipment.order.orderNumber} - {currentShipment.order.user.name}
                  </p>
                </div>
                
                <form onSubmit={handleUpdateShipment}>
                  <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                      Shipment Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="Preparing">Preparing</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="trackingNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      id="trackingNumber"
                      name="trackingNumber"
                      value={formData.trackingNumber}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter tracking number"
                      required={formData.status !== 'Preparing'}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="shippingMethod" className="block text-sm font-medium text-neutral-700 mb-1">
                      Shipping Method
                    </label>
                    <select
                      id="shippingMethod"
                      name="shippingMethod"
                      value={formData.shippingMethod}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="Standard Shipping">Standard Shipping</option>
                      <option value="Express Shipping">Express Shipping</option>
                      <option value="Overnight Shipping">Overnight Shipping</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="estimatedDelivery" className="block text-sm font-medium text-neutral-700 mb-1">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="date"
                      id="estimatedDelivery"
                      name="estimatedDelivery"
                      value={formData.estimatedDelivery}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : 'Update Shipment'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline mt-3 sm:mt-0"
                      onClick={closeUpdateModal}
                      disabled={updating}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipment;