import React, { useState } from 'react';
import { Bell, ShoppingBag, User, CreditCard, HelpCircle, RotateCcw, ChevronRight, Edit, Package, Clock, Calendar, Smartphone } from 'lucide-react';
import PersonalInformation from './PersonalInformation';


const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock user data
  const user = {
    displayName: 'Ivan Petrenko',
    email: 'ivan.petrenko@example.com',
    photoURL: '/api/placeholder/120/120',
    metadata: {
      creationTime: new Date(2022, 5, 15)
    }
  };
  
  // Mock stats
  const stats = {
    purchasedItems: 27,
    leasedItems: 8,
    activeOrders: 3,
    nextReturnDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  };
  
  // Mock orders
  const activeOrders = [
    {
      id: 'ord1',
      orderNumber: 'ORD-2022-1234',
      type: 'purchase',
      status: 'PROCESSING',
      items: [
        { id: 'item1', name: 'Smart Home Hub', quantity: 1, price: 2499 },
        { id: 'item2', name: 'Motion Sensor', quantity: 2, price: 599 }
      ]
    },
    {
      id: 'ord2',
      orderNumber: 'ORD-2022-1235',
      type: 'purchase',
      status: 'SHIPPED',
      items: [
        { id: 'item3', name: 'Security Camera', quantity: 1, price: 3999 }
      ]
    }
  ];
  
  // Mock upcoming returns
  const upcomingReturns = [
    {
      id: 'return1',
      productName: 'High-End Laptop',
      returnDate: new Date(2023, 5, 15),
      leaseId: 'lease1'
    },
    {
      id: 'return2',
      productName: 'Professional Camera',
      returnDate: new Date(2023, 3, 10),
      leaseId: 'lease2'
    }
  ];
  
  // Mock recommendations
  const recommendations = [
    {
      id: 'rec1',
      name: 'Wireless Headphones',
      price: 1299,
      image: '/api/placeholder/200/120'
    },
    {
      id: 'rec2',
      name: 'Smart Speaker',
      price: 899,
      image: '/api/placeholder/200/120'
    },
    {
      id: 'rec3',
      name: 'Tablet Stand',
      price: 399,
      image: '/api/placeholder/200/120'
    }
  ];
  
  // Mock payments
  const upcomingPayments = [
    {
      id: 'pay1',
      description: 'Monthly lease payment - High-End Laptop',
      amount: 1299,
      dueDate: new Date(2022, 11, 15),
      leaseId: 'lease1'
    },
    {
      id: 'pay2',
      description: 'Monthly lease payment - Professional Camera',
      amount: 899,
      dueDate: new Date(2022, 11, 20),
      leaseId: 'lease2'
    }
  ];
  
  // Formatting helpers
  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('uk-UA');
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  const formatReturnDate = (date) => {
    if (!date) return '—';
    const now = new Date();
    const returnDate = new Date(date);
    const diffTime = returnDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7 && diffDays > 0) {
      return `${formatDate(date)} (${diffDays} days remaining)`;
    }
    
    return formatDate(date);
  };
  
  const calculateDaysRemaining = (date) => {
    if (!date) return 0;
    const now = new Date();
    const returnDate = new Date(date);
    const diffTime = returnDate - now;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };
  
  // UI helper functions
  const getOrderTypeIcon = (type) => {
    switch (type) {
      case 'purchase': return <ShoppingBag className="w-5 h-5" />;
      case 'lease': return <Clock className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };
  
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Tab configuration
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Package className="w-5 h-5" /> },
    { id: 'personal', label: 'Personal Information', icon: <User className="w-5 h-5" /> },
    { id: 'orders', label: 'Orders & Leases', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'payments', label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'support', label: 'Support & Documentation', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'returns', label: 'Returns & Exchanges', icon: <RotateCcw className="w-5 h-5" /> }
  ];
  
  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-3 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 mr-2 rounded-md whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Profile Header */}
      <div className="flex flex-wrap items-center pb-6 mb-8 border-b border-gray-200">
        <div className="relative mr-6 mb-4">
          <img
            src={user.photoURL}
            alt="User avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50">
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        <div className="flex-grow mr-6">
          <h1 className="text-2xl font-bold text-gray-800">{user.displayName}</h1>
          <p className="text-gray-600 mb-2">{user.email}</p>
          <div className="flex items-center flex-wrap gap-3">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Premium Member</span>
            <span className="text-sm text-gray-500">Member since: {formatDate(user.metadata.creationTime)}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full mt-4">
          <div className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600 mb-1">{stats.purchasedItems}</div>
            <div className="text-xs text-gray-500">Items Purchased</div>
          </div>
          <div className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600 mb-1">{stats.leasedItems}</div>
            <div className="text-xs text-gray-500">Items Leased</div>
          </div>
          <div className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600 mb-1">{stats.activeOrders}</div>
            <div className="text-xs text-gray-500">Active Orders</div>
          </div>
          <div className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-4 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600 mb-1">{formatDate(stats.nextReturnDate)}</div>
            <div className="text-xs text-gray-500">Next Return</div>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      {activeTab === 'dashboard' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Active Orders */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Active Orders</h3>
              
              {activeOrders.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  <p>No active orders</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeOrders.map(order => (
                    <div key={order.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        order.type === 'purchase' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getOrderTypeIcon(order.type)}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-sm">#{order.orderNumber} - {order.items.length} items</p>
                        <p className="text-sm text-gray-500">
                          Status: <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </p>
                      </div>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Upcoming Returns */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Upcoming Returns</h3>
              
              {upcomingReturns.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  <p>No upcoming returns</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReturns.map(lease => (
                    <div key={lease.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center mr-3 border border-gray-200 text-xs">
                        <span className="font-semibold">{formatDate(lease.returnDate)}</span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{lease.productName}</p>
                        <p className="text-sm text-gray-500">Days remaining: {calculateDaysRemaining(lease.returnDate)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Extend
                        </button>
                        <button className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                          Return
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recommendations */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Recommended For You</h3>
              
              <div className="flex overflow-x-auto space-x-4 pb-2">
                {recommendations.map(product => (
                  <div key={product.id} className="flex-shrink-0 w-48 bg-white rounded-lg overflow-hidden shadow-sm">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                      <p className="font-semibold text-blue-600 mb-3">{formatPrice(product.price)}</p>
                      <div className="flex space-x-2">
                        <button className="flex-1 px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Purchase
                        </button>
                        <button className="flex-1 px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                          Lease
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Payments Due */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-sm lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Upcoming Payments</h3>
              
              {upcomingPayments.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  <p>No upcoming payments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingPayments.map(payment => (
                    <div key={payment.id} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex-shrink-0 w-16 text-sm text-gray-500 mr-3">
                        {formatDate(payment.dueDate)}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-sm">{payment.description}</p>
                        <p className="font-semibold text-blue-600">{formatPrice(payment.amount)}</p>
                      </div>
                      <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Pay Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <ShoppingBag className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Browse Shop</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Clock className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Browse Lease Options</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <HelpCircle className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Contact Support</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Package className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Product Manuals</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Placeholder for other tabs */}
      {activeTab !== 'dashboard' && (
        <div className="p-8 text-center text-gray-500">
          <p className="mb-2 text-lg">{tabs.find(tab => tab.id === activeTab)?.label} section is under construction</p>
          <p>This tab will be implemented soon.</p>
        </div>
      )}
    </div>
  );
};

return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md">
      {/* Navigation Tabs */}
      {/* ... */}
      
      {/* Profile Header */}
      {/* ... */}
      
      {/* Content based on active tab */}
      {activeTab === 'dashboard' && (
        <div>{/* Dashboard content */}</div>
      )}
      
      {activeTab === 'personal' && (
        <PersonalInformation />
      )}
      
      {/* Other tabs */}
    </div>
  );

export default UserDashboard;