import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, Package, Heart, Clock } from 'lucide-react';
import ProfileInfo from './profile/ProfileInfo';
import Orders from './profile/Orders';
import Wishlist from './profile/Wishlist';
import OrderHistory from './profile/OrderHistory';

const UserProfile: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/orders')) return 'orders';
    if (location.pathname.includes('/wishlist')) return 'wishlist';
    if (location.pathname.includes('/history')) return 'history';
    return 'profile';
  });

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User className="h-5 w-5 mr-2" />, path: '/profile' },
    { id: 'orders', label: 'My Orders', icon: <Package className="h-5 w-5 mr-2" />, path: '/profile/orders' },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="h-5 w-5 mr-2" />, path: '/profile/wishlist' },
    { id: 'history', label: 'Order History', icon: <Clock className="h-5 w-5 mr-2" />, path: '/profile/history' },
  ];

  return (
    <div className="min-h-screen py-12 bg-neutral-50">
      <div className="container-custom mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold">My Account</h1>
          <p className="text-neutral-600">Manage your account and see your orders</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <nav className="divide-y divide-neutral-200">
                {tabs.map((tab) => (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    className={`flex items-center px-6 py-4 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Routes>
                <Route index element={<ProfileInfo />} />
                <Route path="orders" element={<Orders />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="history" element={<OrderHistory />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;