import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Set active tab based on current route
    const path = location.pathname;
    if (path.includes('/admin/products')) setActiveTab('products');
    else if (path.includes('/admin/categories')) setActiveTab('categories');
    else if (path.includes('/admin/orders')) setActiveTab('orders');
    else if (path.includes('/admin/users')) setActiveTab('users');
    else setActiveTab('dashboard');
  }, [location]);

  useEffect(() => {
    // Fetch admin stats
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // TODO: Replace with actual API calls
      setStats({
        totalProducts: 156,
        totalCategories: 12,
        totalOrders: 89,
        totalUsers: 234
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const adminMenuItems = [
    {
      id: 'dashboard',
      label: t('admin.dashboard.overview', 'Overview'),
      icon: '📊',
      path: '/admin'
    },
    {
      id: 'products',
      label: t('admin.dashboard.products', 'Products'),
      icon: '📦',
      path: '/admin/products'
    },
    {
      id: 'categories',
      label: t('admin.dashboard.categories', 'Categories'),
      icon: '🏷️',
      path: '/admin/categories'
    },
    {
      id: 'orders',
      label: t('admin.dashboard.orders', 'Orders'),
      icon: '🛒',
      path: '/admin/orders'
    },
    {
      id: 'users',
      label: t('admin.dashboard.users', 'Users'),
      icon: '👥',
      path: '/admin/users'
    },
    {
      id: 'translations',
      label: t('admin.dashboard.translations', 'Translations'),
      icon: '🌐',
      path: '/admin/translations'
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>ScaleVolt Admin</h2>
        </div>
        
        <nav className="admin-nav">
          {adminMenuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>{t('admin.dashboard.title', 'Admin Dashboard')}</h1>
          <div className="admin-user">
            <span>Admin User</span>
            <button className="logout-btn">Logout</button>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📦</div>
                  <div className="stat-info">
                    <h3>{stats.totalProducts}</h3>
                    <p>{t('admin.stats.totalProducts', 'Total Products')}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🏷️</div>
                  <div className="stat-info">
                    <h3>{stats.totalCategories}</h3>
                    <p>{t('admin.stats.totalCategories', 'Categories')}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🛒</div>
                  <div className="stat-info">
                    <h3>{stats.totalOrders}</h3>
                    <p>{t('admin.stats.totalOrders', 'Orders')}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers}</h3>
                    <p>{t('admin.stats.totalUsers', 'Users')}</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h3>{t('admin.dashboard.quickActions', 'Quick Actions')}</h3>
                <div className="action-buttons">
                  <Link to="/admin/products/new" className="action-btn primary">
                    ➕ {t('admin.actions.addProduct', 'Add Product')}
                  </Link>
                  <Link to="/admin/categories/new" className="action-btn">
                    🏷️ {t('admin.actions.addCategory', 'Add Category')}
                  </Link>
                  <Link to="/admin/translations" className="action-btn">
                    🌐 {t('admin.actions.manageTranslations', 'Manage Translations')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 