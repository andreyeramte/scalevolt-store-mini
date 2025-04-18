import React, { useState } from 'react';
import { Edit, Trash2, PlusCircle, Check, X, Home, Building, MapPin, Smartphone, Mail, Bell } from 'lucide-react';

const PersonalInformation = () => {
  // Mock user data
  const [personalInfo, setPersonalInfo] = useState({
    displayName: 'Ivan Petrenko',
    email: 'ivan.petrenko@example.com',
    phone: '+380971234567',
    birthdate: '1990-05-15'
  });
  
  // Mock addresses
  const [addresses, setAddresses] = useState([
    {
      id: 'addr1',
      label: 'Home',
      type: 'shipping',
      isDefault: true,
      fullName: 'Ivan Petrenko',
      street: 'Khreshchatyk Street 12',
      apartment: 'Apt 45',
      city: 'Kyiv',
      postalCode: '01001',
      country: 'Ukraine',
      phone: '+380971234567'
    },
    {
      id: 'addr2',
      label: 'Work',
      type: 'installation',
      isDefault: false,
      fullName: 'Ivan Petrenko',
      street: 'Business Center Plaza',
      apartment: 'Office 302',
      city: 'Kyiv',
      postalCode: '02140',
      country: 'Ukraine',
      phone: '+380971234567'
    }
  ]);
  
  // Mock communication preferences
  const [communicationPrefs, setCommunicationPrefs] = useState({
    email: {
      enabled: true,
      orders: true,
      leases: true,
      marketing: false,
      newsletter: true
    },
    sms: {
      enabled: true,
      orders: true,
      leases: true,
      marketing: false
    }
  });
  
  // Mock security info
  const [securityInfo, setSecurityInfo] = useState({
    lastPasswordChange: new Date(2022, 9, 15),
    twoFactorEnabled: false
  });
  
  // State for address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(-1);
  const [currentAddress, setCurrentAddress] = useState({
    label: '',
    type: 'shipping',
    fullName: '',
    street: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false
  });
  
  // State for password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Methods
  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US');
  };
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCommunicationPrefChange = (type, field, value) => {
    setCommunicationPrefs(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };
  
  const toggleTwoFactor = () => {
    setSecurityInfo(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
  };
  
  const addNewAddress = () => {
    // Reset form
    setCurrentAddress({
      label: '',
      type: 'shipping',
      fullName: '',
      street: '',
      apartment: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
      isDefault: false
    });
    
    setEditingAddressIndex(-1);
    setShowAddressModal(true);
  };
  
  const editAddress = (index) => {
    const address = addresses[index];
    setCurrentAddress({ ...address });
    setEditingAddressIndex(index);
    setShowAddressModal(true);
  };
  
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const saveAddress = () => {
    // Basic validation
    if (!currentAddress.label || !currentAddress.fullName || !currentAddress.street || !currentAddress.city || !currentAddress.country) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingAddressIndex === -1) {
      // Add new address
      const newAddress = {
        ...currentAddress,
        id: `addr${addresses.length + 1}`
      };
      
      // Update other addresses if this one is default
      let updatedAddresses = [...addresses];
      if (currentAddress.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      setAddresses([...updatedAddresses, newAddress]);
    } else {
      // Update existing address
      const updatedAddresses = addresses.map((addr, idx) => {
        // If setting this address as default, make sure others are not default
        if (currentAddress.isDefault && idx !== editingAddressIndex) {
          return { ...addr, isDefault: false };
        }
        return idx === editingAddressIndex ? currentAddress : addr;
      });
      
      setAddresses(updatedAddresses);
    }
    
    setShowAddressModal(false);
  };
  
  const deleteAddress = (index) => {
    const isDefault = addresses[index].isDefault;
    
    const filteredAddresses = addresses.filter((_, idx) => idx !== index);
    
    // If we deleted the default address and we have others, set the first one as default
    if (isDefault && filteredAddresses.length > 0) {
      filteredAddresses[0].isDefault = true;
    }
    
    setAddresses(filteredAddresses);
  };
  
  const setDefaultAddress = (index) => {
    const updatedAddresses = addresses.map((addr, idx) => ({
      ...addr,
      isDefault: idx === index
    }));
    
    setAddresses(updatedAddresses);
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const changePassword = () => {
    // Simple validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }
    
    // In a real app, this would call an API to update the password
    setSecurityInfo(prev => ({
      ...prev,
      lastPasswordChange: new Date()
    }));
    
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setShowPasswordModal(false);
    alert('Password updated successfully');
  };
  
  const saveProfile = () => {
    // In a real app, this would save changes to the backend
    alert('Profile updated successfully');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
      
      {/* Basic Details */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="displayName" className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={personalInfo.displayName}
              onChange={handlePersonalInfoChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={personalInfo.email}
              disabled
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm text-gray-600 mb-1">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="birthdate" className="block text-sm text-gray-600 mb-1">Birthdate</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={personalInfo.birthdate}
              onChange={handlePersonalInfoChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Addresses */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Addresses</h3>
          <button 
            onClick={addNewAddress}
            className="flex items-center text-sm text-blue-600 font-medium"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> Add New Address
          </button>
        </div>
        
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No saved addresses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address, index) => (
              <div key={address.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between mb-2">
                  <h4 className="font-semibold">{address.label}</h4>
                  <div className="flex space-x-1">
                    {address.isDefault && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">Default</span>
                    )}
                    {address.type === 'shipping' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">Shipping</span>
                    )}
                    {address.type === 'billing' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">Billing</span>
                    )}
                    {address.type === 'installation' && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">Installation</span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p>{address.fullName}</p>
                  <p>{address.street}, {address.apartment}</p>
                  <p>{address.city}, {address.postalCode}</p>
                  <p>{address.country}</p>
                  <p>{address.phone}</p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => editAddress(index)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteAddress(index)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-gray-600" />
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(index)}
                      className="text-xs font-medium text-blue-600"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingAddressIndex === -1 ? 'Add New Address' : 'Edit Address'}
                </h3>
                <button onClick={() => setShowAddressModal(false)} className="text-2xl text-gray-500 hover:text-gray-700">
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="addressLabel" className="block text-sm text-gray-600 mb-1">Address Label</label>
                  <input
                    type="text"
                    id="addressLabel"
                    name="label"
                    value={currentAddress.label}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="addressType" className="block text-sm text-gray-600 mb-1">Address Type</label>
                  <select
                    id="addressType"
                    name="type"
                    value={currentAddress.type}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="shipping">Shipping</option>
                    <option value="billing">Billing</option>
                    <option value="installation">Installation</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="addressFullName" className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    id="addressFullName"
                    name="fullName"
                    value={currentAddress.fullName}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="addressStreet" className="block text-sm text-gray-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    id="addressStreet"
                    name="street"
                    value={currentAddress.street}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="addressApartment" className="block text-sm text-gray-600 mb-1">Apartment</label>
                  <input
                    type="text"
                    id="addressApartment"
                    name="apartment"
                    value={currentAddress.apartment}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="addressCity" className="block text-sm text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    id="addressCity"
                    name="city"
                    value={currentAddress.city}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="addressPostalCode" className="block text-sm text-gray-600 mb-1">Postal Code</label>
                  <input
                    type="text"
                    id="addressPostalCode"
                    name="postalCode"
                    value={currentAddress.postalCode}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="addressCountry" className="block text-sm text-gray-600 mb-1">Country</label>
                  <input
                    type="text"
                    id="addressCountry"
                    name="country"
                    value={currentAddress.country}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="addressPhone" className="block text-sm text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    id="addressPhone"
                    name="phone"
                    value={currentAddress.phone}
                    onChange={handleAddressChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={currentAddress.isDefault}
                      onChange={handleAddressChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Set as default address</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAddress}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Communication Preferences */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Communication Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Notifications */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email Notifications
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={communicationPrefs.email.enabled}
                  onChange={(e) => handleCommunicationPrefChange('email', 'enabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {communicationPrefs.email.enabled && (
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={communicationPrefs.email.orders}
                    onChange={(e) => handleCommunicationPrefChange('email', 'orders', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Order Updates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={communicationPrefs.email.leases}
                    onChange={(e) => handleCommunicationPrefChange('email', 'leases', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Lease Reminders</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={communicationPrefs.email.marketing}
                    onChange={(e) => handleCommunicationPrefChange('email', 'marketing', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Promotions & Deals</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={communicationPrefs.email.newsletter}
                    onChange={(e) => handleCommunicationPrefChange('email', 'newsletter', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Newsletter</span>
                </label>
              </div>
            )}
          </div>
          
          {/* SMS Notifications */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold flex items-center">
                <Smartphone className="w-4 h-4 mr-2" /> SMS Notifications
              </h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={communicationPrefs.sms.enabled}
                  onChange={(e) => handleCommunicationPrefChange('sms', 'enabled', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {communicationPrefs.sms.enabled && (
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={communicationPrefs.sms.orders}
                    onChange={(e) => handleCommunicationPrefChange('sms', 'orders', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Order Updates</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={communicationPrefs.sms.leases}
                    onChange={(e) => handleCommunicationPrefChange('sms', 'leases', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Lease Reminders</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={communicationPrefs.sms.marketing}
                    onChange={(e) => handleCommunicationPrefChange('sms', 'marketing', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Promotions & Deals</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Security Settings */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Password */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Password</h4>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-blue-600 text-sm font-medium hover:text-blue-800"
              >
                Change
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Last changed: {formatDate(securityInfo.lastPasswordChange) || 'Never'}
            </p>
          </div>
          
          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Two-Factor Authentication</h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={securityInfo.twoFactorEnabled}
                  onChange={toggleTwoFactor}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {securityInfo.twoFactorEnabled ? '2FA Enabled' : '2FA Disabled'}
            </p>
            {securityInfo.twoFactorEnabled ? (
              <button className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-800">
                Manage 2FA
              </button>
            ) : (
              <button className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-800">
                Setup 2FA
              </button>
            )}
          </div>
        </div>
        
        {/* Login History */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Login History</h4>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
              Load More
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">November 28, 2022, 14:30</p>
                <p className="text-xs text-gray-500">Windows PC - Chrome</p>
                <p className="text-xs text-gray-500">Kyiv, Ukraine (IP: 192.168.1.1)</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 h-fit">
                Successful
              </span>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">November 25, 2022, 9:15</p>
                <p className="text-xs text-gray-500">iPhone - Safari</p>
                <p className="text-xs text-gray-500">Kyiv, Ukraine (IP: 192.168.1.2)</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 h-fit">
                Successful
              </span>
            </div>
            
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">November 20, 2022, 18:45</p>
                <p className="
                <p className="text-xs text-gray-500">Android - Chrome</p>
                <p className="text-xs text-gray-500">Lviv, Ukraine (IP: 192.168.1.3)</p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 h-fit">
                Failed
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-2xl text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm text-gray-600 mb-1">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={changePassword}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Profile Button */}
      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInformation;