<template>
  <div class="user-profile-container">
    <!-- Top Navigation Tabs -->
    <div class="profile-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        @click="activeTab = tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
      >
        <i :class="tab.icon"></i>
        {{ t(`profile.tabs.${tab.id}`) }}
      </button>
    </div>
    
    <div class="profile-header">
      <div class="profile-avatar-container">
        <img 
          :src="user?.photoURL || defaultAvatar" 
          :alt="t('profile.avatar.alt')" 
          class="profile-avatar"
        />
        <button @click="triggerAvatarUpload" class="edit-avatar-btn">
          <i class="edit-icon">✏️</i>
        </button>
        <input 
          type="file" 
          ref="avatarInput" 
          @change="handleAvatarUpload" 
          accept="image/*" 
          class="hidden-file-input"
        />
      </div>
      
      <div class="profile-info">
        <h1 class="user-name">{{ user?.displayName || t('profile.avatar.alt') }}</h1>
        <p class="user-email">{{ user?.email }}</p>
        <div class="member-status">
          <span class="status-badge" :class="userTierClass">{{ t(`profile.member_status.${userTier}`) }}</span>
          <span class="member-since">{{ t('profile.member_status.member_since') }}: {{ formatDate(user?.metadata?.creationTime) }}</span>
        </div>
        <button @click="logout" class="logout-button">
          <i class="icon-logout"></i>
          {{ t('profile.logout') }}
        </button>
      </div>
      
      <div class="quick-stats">
        <div class="stat-item">
          <div class="stat-value">{{ stats.purchasedItems }}</div>
          <div class="stat-label">{{ t('profile.stats.items_purchased') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.leasedItems }}</div>
          <div class="stat-label">{{ t('profile.stats.items_leased') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.activeOrders }}</div>
          <div class="stat-label">{{ t('profile.stats.active_orders') }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ formatDate(stats.nextReturnDate) }}</div>
          <div class="stat-label">{{ t('profile.stats.next_return') }}</div>
        </div>
      </div>
    </div>

    <!-- Dashboard / Overview -->
    <div v-if="activeTab === 'dashboard'" class="profile-section dashboard-section">
      <h2>{{ t('profile.dashboard.dashboard') }}</h2>
      
      <div class="dashboard-grid">
        <!-- Active Orders -->
        <div class="dashboard-card">
          <h3>{{ t('profile.dashboard.active_orders') }}</h3>
          <div v-if="activeOrders.length === 0" class="empty-state">
            <p>{{ t('profile.dashboard.no_active_orders') }}</p>
          </div>
          <div v-else class="active-order-list">
            <div v-for="order in activeOrders" :key="order.id" class="active-order-item">
              <div class="order-icon" :class="getOrderTypeClass(order.type)">
                <i :class="getOrderTypeIcon(order.type)"></i>
              </div>
              <div class="order-brief">
                <p class="order-title">#{{ order.orderNumber }} - {{ order.items.length }} {{ t('profile.dashboard.items') }}</p>
                <p class="order-status">{{ t(`order_status_${order.status.toLowerCase()}`) }}</p>
              </div>
              <button @click="viewOrderDetails(order.id)" class="btn-text">
                {{ t('profile.dashboard.view') }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Upcoming Returns -->
        <div class="dashboard-card">
          <h3>{{ t('profile.dashboard.upcoming_returns') }}</h3>
          <div v-if="upcomingReturns.length === 0" class="empty-state">
            <p>{{ t('profile.dashboard.no_upcoming_returns') }}</p>
          </div>
          <div v-else class="returns-list">
            <div v-for="lease in upcomingReturns" :key="lease.id" class="return-item">
              <div class="date-badge">
                {{ formatReturnDate(lease.returnDate) }}
              </div>
              <div class="lease-info">
                <p class="lease-title">{{ lease.productName }}</p>
                <p class="lease-details">{{ t('profile.dashboard.days_remaining') }}: {{ calculateDaysRemaining(lease.returnDate) }}</p>
              </div>
              <div class="action-buttons">
                <button @click="extendLease(lease.id)" class="btn-small btn-primary">
                  {{ t('profile.dashboard.extend') }}
                </button>
                <button @click="initiateReturn(lease.id)" class="btn-small btn-secondary">
                  {{ t('profile.dashboard.return') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        
        <!-- Payments Due -->
        <div class="dashboard-card">
          <h3>{{ t('profile.dashboard.upcoming_payments') }}</h3>
          <div v-if="upcomingPayments.length === 0" class="empty-state">
            <p>{{ t('profile.dashboard.no_upcoming_payments') }}</p>
          </div>
          <div v-else class="payments-list">
            <div v-for="payment in upcomingPayments" :key="payment.id" class="payment-item">
              <div class="payment-date">{{ formatDate(payment.dueDate) }}</div>
              <div class="payment-details">
                <p class="payment-title">{{ payment.description }}</p>
                <p class="payment-amount">{{ formatPrice(payment.amount) }}</p>
              </div>
              <button @click="makePayment(payment.id)" class="btn-small btn-primary">
                {{ t('profile.dashboard.pay_now') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="quick-actions">
        <h3>{{ t('profile.dashboard.quick_actions') }}</h3>
        <div class="action-buttons-grid">
          <button @click="$router.push('/shop')" class="action-button">
            <i class="icon-shop"></i>
            <span>{{ t('profile.dashboard.browse_shop') }}</span>
          </button>
          <button @click="$router.push('/lease-options')" class="action-button">
            <i class="icon-lease"></i>
            <span>{{ t('profile.dashboard.browse_lease_options') }}</span>
          </button>
          <button @click="$router.push('/support')" class="action-button">
            <i class="icon-support"></i>
            <span>{{ t('profile.dashboard.contact_support') }}</span>
          </button>
          <button @click="$router.push('/manuals')" class="action-button">
            <i class="icon-manual"></i>
            <span>{{ t('profile.dashboard.product_manuals') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Personal Information -->
    <div v-if="activeTab === 'personal'" class="profile-section personal-section">
      <h2>{{ t('profile.personal.personal_information') }}</h2>
      
      <div class="form-section">
        <h3>{{ t('profile.personal.basic_details') }}</h3>
        <div class="form-grid">
          <div class="form-group">
            <label for="displayName">{{ t('profile.personal.full_name') }}</label>
            <input type="text" id="displayName" v-model="personalInfo.displayName" class="form-input" />
          </div>
          <div class="form-group">
            <label for="email">{{ t('profile.personal.email') }}</label>
            <input type="email" id="email" v-model="personalInfo.email" class="form-input" disabled />
          </div>
          <div class="form-group">
            <label for="phone">{{ t('profile.personal.phone') }}</label>
            <input type="tel" id="phone" v-model="personalInfo.phone" class="form-input" />
          </div>
          <div class="form-group">
            <label for="birthdate">{{ t('profile.personal.birthdate') }}</label>
            <input type="date" id="birthdate" v-model="personalInfo.birthdate" class="form-input" />
          </div>
        </div>
      </div>
      
      <!-- Addresses -->
      <div class="form-section">
        <div class="section-header">
          <h3>{{ t('profile.personal.addresses') }}</h3>
          <button @click="addNewAddress" class="btn-text">
            <i class="icon-add"></i> {{ t('profile.personal.add_new_address') }}
          </button>
        </div>
        
        <div v-if="addresses.length === 0" class="empty-state">
          <p>{{ t('profile.personal.no_saved_addresses') }}</p>
        </div>
        
        <div v-else class="addresses-grid">
          <div v-for="(address, index) in addresses" :key="index" class="address-card">
            <div class="address-header">
              <h4>{{ address.label }}</h4>
              <div class="address-tags">
                <span v-if="address.isDefault" class="address-tag default">{{ t('profile.personal.default') }}</span>
                <span v-if="address.type === 'shipping'" class="address-tag shipping">{{ t('profile.personal.shipping') }}</span>
                <span v-if="address.type === 'billing'" class="address-tag billing">{{ t('profile.personal.billing') }}</span>
                <span v-if="address.type === 'installation'" class="address-tag installation">{{ t('profile.personal.installation') }}</span>
              </div>
            </div>
            <div class="address-content">
              <p>{{ address.fullName }}</p>
              <p>{{ address.street }}, {{ address.apartment }}</p>
              <p>{{ address.city }}, {{ address.postalCode }}</p>
              <p>{{ address.country }}</p>
              <p>{{ address.phone }}</p>
            </div>
            <div class="address-actions">
              <button @click="editAddress(index)" class="btn-icon">
                <i class="icon-edit"></i>
              </button>
              <button @click="deleteAddress(index)" class="btn-icon">
                <i class="icon-delete"></i>
              </button>
              <button v-if="!address.isDefault" @click="setDefaultAddress(index)" class="btn-text">
                {{ t('profile.personal.set_as_default') }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Address Form Modal (Hidden by default) -->
        <div v-if="showAddressModal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ editingAddressIndex === -1 ? t('profile.personal.add_new_address') : t('profile.personal.edit_address') }}</h3>
              <button @click="showAddressModal = false" class="btn-close">×</button>
            </div>
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label for="addressLabel">{{ t('profile.personal.address_label') }}</label>
                  <input type="text" id="addressLabel" v-model="currentAddress.label" class="form-input" />
                </div>
                <div class="form-group">
                  <label for="addressType">{{ t('profile.personal.address_type') }}</label>
                  <select id="addressType" v-model="currentAddress.type" class="form-select">
                    <option value="shipping">{{ t('profile.personal.shipping') }}</option>
                    <option value="billing">{{ t('profile.personal.billing') }}</option>
                    <option value="installation">{{ t('profile.personal.installation') }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="addressFullName">{{ t('profile.personal.full_name') }}</label>
                  <input type="text" id="addressFullName" v-model="currentAddress.fullName" class="form-input" />
                </div>
                <div class="form-group">
                  <label for="addressStreet">{{ t('profile.personal.street_address') }}</label>
                  <input type="text" id="addressStreet" v-model="currentAddress.street" class="form-input" />
                </div>
                <div class="form-group">
                  <label for="addressApartment">{{ t('profile.personal.apartment') }}</label>
                  <input type="text" id="addressApartment" v-model="currentAddress.apartment" class="form-input" />
                </div>
                <div class="form-group">
                  <label for="addressCity">{{ t('profile.personal.city') }}</label>
                  <input type="text" id="addressCity" v-model="currentAddress.city" class="form-input" />
                </div>
                <div class="form-group">
                  <label for="addressPostalCode">{{ t('profile.personal.postal_code') }}</label>
                  <input type="text" id="addressPostalCode" v-model="currentAddress.postalCode" class="form-input" />
                </div>
                <div class="form-group">
                  <label for="addressCountry">{{ t('profile.personal.country') }}</label>
                  <input type="text" id="addressCountry" v-model="currentAddress.country" class="form-input" />
                </div>
                <div class="form-group">
                  <label for="addressPhone">{{ t('profile.personal.phone') }}</label>
                  <input type="tel" id="addressPhone" v-model="currentAddress.phone" class="form-input" />
                </div>
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="addressDefault" v-model="currentAddress.isDefault" />
                  <label for="addressDefault">{{ t('profile.personal.set_as_default_address') }}</label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button @click="showAddressModal = false" class="btn-secondary">
                {{ t('profile.personal.cancel') }}
              </button>
              <button @click="saveAddress" class="btn-primary">
                {{ t('profile.personal.save_address') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Communication preferences -->
      <div class="form-section">
        <h3>{{ t('profile.personal.communication_preferences') }}</h3>
        <div class="preferences-grid">
          <div class="preference-item">
            <div class="preference-header">
              <h4>{{ t('profile.personal.email_notifications') }}</h4>
              <label class="switch">
                <input type="checkbox" v-model="communicationPrefs.email.enabled" />
                <span class="slider round"></span>
              </label>
            </div>
            <div v-if="communicationPrefs.email.enabled" class="preference-options">
              <div class="checkbox-group">
                <input type="checkbox" id="emailOrders" v-model="communicationPrefs.email.orders" />
                <label for="emailOrders">{{ t('profile.personal.order_updates') }}</label>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="emailLeases" v-model="communicationPrefs.email.leases" />
                <label for="emailLeases">{{ t('profile.personal.lease_reminders') }}</label>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="emailMarketing" v-model="communicationPrefs.email.marketing" />
                <label for="emailMarketing">{{ t('profile.personal.promotions_deals') }}</label>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="emailNewsletter" v-model="communicationPrefs.email.newsletter" />
                <label for="emailNewsletter">{{ t('profile.personal.newsletter') }}</label>
              </div>
            </div>
          </div>
          
          <div class="preference-item">
            <div class="preference-header">
              <h4>{{ t('profile.personal.sms_notifications') }}</h4>
              <label class="switch">
                <input type="checkbox" v-model="communicationPrefs.sms.enabled" />
                <span class="slider round"></span>
              </label>
            </div>
            <div v-if="communicationPrefs.sms.enabled" class="preference-options">
              <div class="checkbox-group">
                <input type="checkbox" id="smsOrders" v-model="communicationPrefs.sms.orders" />
                <label for="smsOrders">{{ t('profile.personal.order_updates') }}</label>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="smsLeases" v-model="communicationPrefs.sms.leases" />
                <label for="smsLeases">{{ t('profile.personal.lease_reminders') }}</label>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="smsMarketing" v-model="communicationPrefs.sms.marketing" />
                <label for="smsMarketing">{{ t('profile.personal.promotions_deals') }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Security Settings -->
      <div class="form-section">
        <h3>{{ t('profile.personal.security_settings') }}</h3>
        <div class="security-grid">
          <div class="security-item">
            <div class="security-header">
              <h4>{{ t('profile.personal.password') }}</h4>
              <button @click="showPasswordModal = true" class="btn-text">
                {{ t('profile.personal.change') }}
              </button>
            </div>
            <p class="security-info">{{ t('profile.personal.last_password_change') }}: {{ formatDate(securityInfo.lastPasswordChange) || t('profile.personal.never') }}</p>
          </div>
          
          <div class="security-item">
            <div class="security-header">
              <h4>{{ t('profile.personal.two_factor_auth') }}</h4>
              <label class="switch">
                <input type="checkbox" v-model="securityInfo.twoFactorEnabled" />
                <span class="slider round"></span>
              </label>
            </div>
            <p class="security-info">{{ securityInfo.twoFactorEnabled ? t('profile.personal.2fa_enabled') : t('profile.personal.2fa_disabled') }}</p>
            <button v-if="securityInfo.twoFactorEnabled" @click="showTwoFactorModal = true" class="btn-text">
              {{ t('profile.personal.manage_2fa') }}
            </button>
            <button v-else @click="setup2FA" class="btn-text">
              {{ t('profile.personal.setup_2fa') }}
            </button>
          </div>
        </div>
        
        <div class="login-history">
          <div class="section-header">
            <h4>{{ t('profile.personal.login_history') }}</h4>
            <button @click="loadMoreLoginHistory" v-if="hasMoreLoginHistory" class="btn-text">
              {{ t('profile.personal.load_more') }}
            </button>
          </div>
          <div class="login-history-list">
            <div v-for="login in loginHistory" :key="login.id" class="login-item">
              <div class="login-info">
                <p class="login-date">{{ formatLoginDate(login.timestamp) }}</p>
                <p class="login-device">{{ login.device }} - {{ login.browser }}</p>
                <p class="login-location">{{ login.location }} (IP: {{ login.ip }})</p>
              </div>
              <div class="login-status" :class="login.successful ? 'success' : 'failed'">
                {{ login.successful ? t('profile.personal.successful') : t('profile.personal.failed') }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Password Change Modal -->
        <div v-if="showPasswordModal" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ t('profile.personal.change_password') }}</h3>
              <button @click="showPasswordModal = false" class="btn-close">×</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="currentPassword">{{ t('profile.personal.current_password') }}</label>
                <input type="password" id="currentPassword" v-model="passwordForm.currentPassword" class="form-input" />
              </div>
              <div class="form-group">
                <label for="newPassword">{{ t('profile.personal.new_password') }}</label>
                <input type="password" id="newPassword" v-model="passwordForm.newPassword" class="form-input" />
              </div>
              <div class="form-group">
                <label for="confirmPassword">{{ t('profile.personal.confirm_password') }}</label>
                <input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword" class="form-input" />
              </div>
            </div>
            <div class="modal-footer">
              <button @click="showPasswordModal = false" class="btn-secondary">
                {{ t('profile.personal.cancel') }}
              </button>
              <button @click="changePassword" class="btn-primary">
                {{ t('profile.personal.update_password') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Save Profile Button -->
      <div class="profile-actions">
        <button @click="saveProfile" class="btn-primary">
          {{ t('profile.personal.save_changes') }}
        </button>
      </div>
    </div>

    <!-- Orders & Leases History -->
    <div v-if="activeTab === 'orders'" class="profile-section orders-section">
      <h2>{{ t('profile.orders.orders_and_leases') }}</h2>
      
      <!-- Transaction Filters -->
      <div class="transaction-filters">
        <div class="filter-toggles">
          <label class="toggle-label">
            <input type="checkbox" v-model="transactionFilters.showPurchases" />
            <span>{{ t('profile.orders.purchases') }}</span>
          </label>
          <label class="toggle-label">
            <input type="checkbox" v-model="transactionFilters.showLeases" />
            <span>{{ t('profile.orders.leases') }}</span>
          </label>
        </div>
        
        <div class="filter-dropdown">
          <label for="statusFilter">{{ t('profile.orders.status') }}:</label>
          <select id="statusFilter" v-model="transactionFilters.status" class="form-select">
            <option value="all">{{ t('profile.orders.all_statuses') }}</option>
            <option value="pending">{{ t('profile.orders.pending') }}</option>
            <option value="processing">{{ t('profile.orders.processing') }}</option>
            <option value="shipped">{{ t('profile.orders.shipped') }}</option>
            <option value="delivered">{{ t('profile.orders.delivered') }}</option>
            <option value="active">{{ t('profile.orders.active_lease') }}</option>
            <option value="returned">{{ t('profile.orders.returned') }}</option>
            <option value="cancelled">{{ t('profile.orders.cancelled') }}</option>
          </select>
        </div>
        
        <div class="filter-dropdown">
          <label for="dateFilter">{{ t('profile.orders.date_range') }}:</label>
          <select id="dateFilter" v-model="transactionFilters.dateRange" class="form-select">
            <option value="all">{{ t('profile.orders.all_time') }}</option>
            <option value="30days">{{ t('profile.orders.last_30_days') }}</option>
            <option value="6months">{{ t('profile.orders.last_6_months') }}</option>
            <option value="year">{{ t('profile.orders.last_year') }}</option>
          </select>
        </div>
        
        <div class="search-filter">
          <input type="text" v-model="transactionFilters.search" placeholder="Search orders..." class="search-input" />
        </div>
      </div>
      
      <!-- View Toggles -->
      <div class="view-toggles">
        <button 
          @click="transactionView = 'list'"
          :class="['view-toggle', { active: transactionView === 'list' }]"
        >
          <i class="icon-list"></i>
        </button>
        <button 
          @click="transactionView = 'timeline'"
          :class="['view-toggle', { active: transactionView === 'timeline' }]"
        >
          <i class="icon-timeline"></i>
        </button>
      </div>
      
      <!-- List View -->
      <div v-if="transactionView === 'list'" class="transaction-list">
        <div v-if="filteredTransactions.length === 0" class="empty-state">
          <p>{{ t('profile.orders.no_transactions_found') }}</p>
        </div>
        
        <div v-else>
          <div v-for="transaction in filteredTransactions" :key="transaction.id" class="transaction-card">
            <div class="transaction-header">
              <div class="transaction-type" :class="transaction.type">
                {{ t(`profile.orders.${transaction.type}`) }}
              </div>
              <div class="transaction-meta">
                <h3>{{ t('profile.orders.order_number') }}: #{{ transaction.orderNumber }}</h3>
                <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
              </div>
              <div class="transaction-status" :class="getStatusClass(transaction.status)">
                {{ t(`profile.status.status_${transaction.status.toLowerCase()}`) }}
              </div>
            </div>
            
            <div class="transaction-items">
              <div v-for="item in transaction.items" :key="item.id" class="transaction-item">
                <div class="item-image">
                  <img :src="item.image || '/images/product-placeholder.png'" :alt="item.name">
                </div>
                <div class="item-details">
                  <p class="item-name">{{ item.name }}</p>
                  <p class="item-quantity">{{ t('profile.orders.quantity') }}: {{ item.quantity }}</p>
                  <p v-if="transaction.type === 'lease'" class="lease-period">
                    {{ t('profile.orders.lease_period') }}: {{ formatDate(item.leaseStart) }} - {{ formatDate(item.leaseEnd) }}
                  </p>
                </div>
                <div class="item-price">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>
            
            <div class="transaction-footer">
              <div class="transaction-totals">
                <div class="total-row">
                  <span>{{ t('profile.orders.subtotal') }}:</span>
                  <span>{{ formatPrice(calculateSubtotal(transaction)) }}</span>
                </div>
                <div class="total-row">
                  <span>{{ t('profile.orders.shipping') }}:</span>
                  <span>{{ formatPrice(transaction.shipping) }}</span>
                </div>
                <div class="total-row total-final">
                  <span>{{ t('profile.orders.total') }}:</span>
                  <span>{{ formatPrice(calculateTotal(transaction)) }}</span>
                </div>
              </div>
              
              <div class="transaction-actions">
                <button @click="viewTransactionDetails(transaction.id)" class="btn-text">
                  {{ t('profile.orders.view_details') }}
                </button>
                <button @click="downloadInvoice(transaction.id)" class="btn-text">
                  {{ t('profile.orders.download_invoice') }}
                </button>
                <button 
                  v-if="transaction.status === 'DELIVERED' && transaction.type === 'purchase'" 
                  @click="reorderItems(transaction)" 
                  class="btn-primary btn-small"
                >
                  {{ t('profile.orders.reorder') }}
                </button>
                <button 
                  v-if="transaction.status === 'ACTIVE' && transaction.type === 'lease'" 
                  @click="extendLease(transaction.id)" 
                  class="btn-primary btn-small"
                >
                  {{ t('profile.dashboard.extend') }}
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="hasMoreTransactions" class="load-more">
            <button @click="loadMoreTransactions" class="btn-text">
              {{ t('profile.personal.load_more') }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Timeline View -->
      <div v-if="transactionView === 'timeline'" class="transaction-timeline">
        <div v-if="filteredTransactions.length === 0" class="empty-state">
          <p>{{ t('profile.orders.no_transactions_found') }}</p>
        </div>
        
        <div v-else class="timeline">
          <div v-for="(yearGroup, year) in groupedTransactions" :key="year" class="timeline-year">
            <div class="year-header">{{ year }}</div>
            
            <div v-for="(monthGroup, month) in yearGroup" :key="month" class="timeline-month">
              <div class="month-header">{{ getMonthName(month) }}</div>
              
              <div v-for="transaction in monthGroup" :key="transaction.id" class="timeline-item">
                <div class="timeline-marker" :class="transaction.type"></div>
                <div class="timeline-content">
                  <div class="timeline-card" :class="transaction.type">
                    <div class="timeline-type-badge">{{ t(`profile.orders.${transaction.type}`) }}</div>
                    <h4>{{ t('profile.orders.order_number') }}: #{{ transaction.orderNumber }}</h4>
                    <div class="timeline-status" :class="getStatusClass(transaction.status)">
                      {{ t(`profile.status.status_${transaction.status.toLowerCase()}`) }}
                    </div>
                    <div class="timeline-items-summary">
                      {{ transaction.items.length }} {{ t('profile.dashboard.items') }} · {{ formatPrice(calculateTotal(transaction)) }}
                    </div>
                    <div class="timeline-actions">
                      <button @click="viewTransactionDetails(transaction.id)" class="btn-text">
                        {{ t('profile.orders.view_details') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'vue-toastification';
import { 
  getAuth, 
  updateProfile as firebaseUpdateProfile, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  signOut 
} from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default {
  name: 'UserProfileView',
  setup() {
    console.log('UserProfileView setup starting'); // Debug log
    const { t } = useI18n();
    console.log('i18n loaded:', !!t); // Debug log to confirm t is available
    
    const router = useRouter();
    const userStore = useUserStore();
    const cartStore = useCartStore();
    const auth = getAuth();
    const storage = getStorage();
    const toast = useToast();
    
    // Firebase User
    const user = computed(() => auth.currentUser);
    
    // Default Avatar
    const defaultAvatar = '/images/default-avatar.png';
    
    // Refs
    const avatarInput = ref(null);
    const showAddressModal = ref(false);
    const showPasswordModal = ref(false);
    const showTwoFactorModal = ref(false);
    const hasMoreLoginHistory = ref(true);
    const hasMoreTransactions = ref(true);
    const editingAddressIndex = ref(-1);
    
    // Active Tab
    const activeTab = ref('dashboard');
    
    // Define available tabs
    const tabs = [
      { 
        id: 'dashboard', 
        label: 'dashboard', 
        icon: 'icon-dashboard' 
      },
      { 
        id: 'personal', 
        label: 'personal_information', 
        icon: 'icon-user' 
      },
      { 
        id: 'orders', 
        label: 'orders_and_leases', 
        icon: 'icon-shopping-bag' 
      }
    ];
    
    // Avatar upload methods - THIS WAS MISSING
    const triggerAvatarUpload = () => {
      avatarInput.value.click();
    };

    // Upload avatar to Firebase Storage
    const handleAvatarUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        // 1. Upload to Firebase Storage
        const fileRef = storageRef(storage, `avatars/${user.value.uid}/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const photoURL = await getDownloadURL(fileRef);
        
        // 2. Update user profile with new photoURL
        if (photoURL && user.value) {
          await firebaseUpdateProfile(user.value, { photoURL });
          userStore.updateUserPhoto(photoURL);
        }
      } catch (error) {
        console.error('Avatar upload failed:', error);
        toast.error('Failed to upload avatar. Please try again.');
      }
    };
    
    // Logout function
    const logout = async () => {
      try {
        await signOut(auth);
        // Clear user data from store
        userStore.clearUserData();
        // Redirect to login page
        router.push('/login');
        // Show a success message
        toast("You've been successfully logged out");
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
    // User tier
    const userTier = computed(() => userStore.tier || 'standard');
    
    // User tier class for styling
    const userTierClass = computed(() => `tier-${userTier.value}`);
    
    // Stats summary
    const stats = reactive({
      purchasedItems: 12,
      leasedItems: 3,
      activeOrders: 2,
      nextReturnDate: new Date(2023, 3, 15)
    });
    
    // Dashboard data
    // Active orders
    const activeOrders = ref([
      {
        id: 'order1',
        orderNumber: 'ORD-2022-1234',
        type: 'purchase',
        status: 'PROCESSING',
        date: new Date(2022, 10, 15),
        items: [
          { id: 'item1', name: 'Smart Home Hub', quantity: 1, price: 1999 },
          { id: 'item2', name: 'Motion Sensor', quantity: 3, price: 599 }
        ]
      },
      {
        id: 'order2',
        orderNumber: 'LEASE-2022-567',
        type: 'lease',
        status: 'ACTIVE',
        date: new Date(2022, 10, 1),
        items: [
          { id: 'item4', name: 'High-End Laptop', quantity: 1, price: 1299 }
        ]
      }
    ]);
    
    // Upcoming returns
    const upcomingReturns = ref([
      {
        id: 'return1',
        productName: 'High-End Laptop',
        returnDate: new Date(2023, 3, 15),
        leaseId: 'lease1'
      },
      {
        id: 'return2',
        productName: 'Professional Camera',
        returnDate: new Date(2023, 1, 20),
        leaseId: 'lease2'
      }
    ]);
   
    // Upcoming payments
    const upcomingPayments = ref([
      {
        id: 'payment1',
        description: 'Lease payment - High-End Laptop',
        amount: 1299,
        dueDate: new Date(2022, 11, 1)
      }
    ]);
    
    // Personal information form
    const personalInfo = reactive({
      displayName: '',
      email: '',
      phone: '',
      birthdate: ''
    });
    
    // Address management
    const addresses = ref([
      {
        id: 'addr1',
        label: 'Home',
        type: 'shipping',
        fullName: 'Ivan Petrenko',
        street: 'Khreshchatyk Street 12',
        apartment: 'Apt 45',
        city: 'Kyiv',
        postalCode: '01001',
        country: 'Ukraine',
        phone: '+380991234567',
        isDefault: true
      }
    ]);
    
    // Current address for form
    const currentAddress = reactive({
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
    
    // Communication preferences
    const communicationPrefs = reactive({
      email: {
        enabled: true,
        orders: true,
        leases: true,
        marketing: false,
        newsletter: false
      },
      sms: {
        enabled: true,
        orders: true,
        leases: true,
        marketing: false
      }
    });
    
    // Security information
    const securityInfo = reactive({
      lastPasswordChange: new Date(2022, 8, 15),
      twoFactorEnabled: false
    });
    
    // Password change form
    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Login history
    const loginHistory = ref([
      {
        id: 'login1',
        timestamp: new Date(2022, 10, 25, 14, 30),
        device: 'iPhone',
        browser: 'Safari',
        location: 'Kyiv, Ukraine',
        ip: '192.168.1.1',
        successful: true
      },
      {
        id: 'login2',
        timestamp: new Date(2022, 10, 20, 9, 15),
        device: 'Windows PC',
        browser: 'Chrome',
        location: 'Kyiv, Ukraine',
        ip: '192.168.1.2',
        successful: true
      },
      {
        id: 'login3',
        timestamp: new Date(2022, 10, 19, 22, 45),
        device: 'Unknown',
        browser: 'Unknown',
        location: 'Moscow, Russia',
        ip: '192.168.1.3',
        successful: false
      }
    ]);
    
    // Orders & Leases data
    // Transaction filters
    const transactionFilters = reactive({
      showPurchases: true,
      showLeases: true,
      status: 'all',
      dateRange: 'all',
      search: ''
    });
    
    // Transaction view mode
    const transactionView = ref('list');
    
    // Transactions
    const transactions = ref([
      {
        id: 'trans1',
        type: 'purchase',
        orderNumber: 'ORD-2022-1234',
        status: 'PROCESSING',
        date: new Date(2022, 10, 15),
        shipping: 0,
        items: [
          { id: 'item1', name: 'Smart Home Hub', quantity: 1, price: 1999, image: '/images/products/hub.jpg' },
          { id: 'item2', name: 'Motion Sensor', quantity: 3, price: 599, image: '/images/products/sensor.jpg' }
        ]
      },
      {
        id: 'trans2',
        type: 'lease',
        orderNumber: 'LEASE-2022-567',
        status: 'ACTIVE',
        date: new Date(2022, 10, 1),
        shipping: 0,
        items: [
          { 
            id: 'item4', 
            name: 'High-End Laptop', 
            quantity: 1, 
            price: 1299, 
            image: '/images/products/laptop.jpg',
            leaseStart: new Date(2022, 10, 1),
            leaseEnd: new Date(2023, 4, 1)
          }
        ]
      },
      {
        id: 'trans3',
        type: 'purchase',
        orderNumber: 'ORD-2022-1000',
        status: 'DELIVERED',
        date: new Date(2022, 9, 5),
        shipping: 100,
        items: [
          { id: 'item5', name: 'Wireless Keyboard', quantity: 1, price: 899, image: '/images/products/keyboard.jpg' },
          { id: 'item6', name: 'Wireless Mouse', quantity: 1, price: 599, image: '/images/products/mouse.jpg' }
        ]
      }
    ]);
    
    // Filtered transactions based on active filters
    const filteredTransactions = computed(() => {
      let result = [...transactions.value];
      
      // Filter by transaction type
      if (!transactionFilters.showPurchases) {
        result = result.filter(t => t.type !== 'purchase');
      }
      
      if (!transactionFilters.showLeases) {
        result = result.filter(t => t.type !== 'lease');
      }
      
      // Filter by status
      if (transactionFilters.status !== 'all') {
        result = result.filter(t => t.status.toLowerCase() === transactionFilters.status);
      }
      
      // Filter by date range
      if (transactionFilters.dateRange !== 'all') {
        const now = new Date();
        let cutoffDate = new Date();
        
        if (transactionFilters.dateRange === '30days') {
          cutoffDate.setDate(now.getDate() - 30);
        } else if (transactionFilters.dateRange === '6months') {
          cutoffDate.setMonth(now.getMonth() - 6);
        } else if (transactionFilters.dateRange === 'year') {
          cutoffDate.setFullYear(now.getFullYear() - 1);
        }
        
        result = result.filter(t => t.date >= cutoffDate);
      }
      
      // Filter by search term
      if (transactionFilters.search) {
        const searchTerm = transactionFilters.search.toLowerCase();
        result = result.filter(t => 
          t.orderNumber.toLowerCase().includes(searchTerm) ||
          t.items.some(item => item.name.toLowerCase().includes(searchTerm))
        );
      }
      
      return result;
    });
    
    // Group transactions by year and month for timeline view
    const groupedTransactions = computed(() => {
      const grouped = {};
      
      filteredTransactions.value.forEach(transaction => {
        const date = new Date(transaction.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        
        if (!grouped[year]) {
          grouped[year] = {};
        }
        
        if (!grouped[year][month]) {
          grouped[year][month] = [];
        }
        
        grouped[year][month].push(transaction);
      });
      
      // Sort years in descending order
      return Object.keys(grouped)
        .sort((a, b) => b - a)
        .reduce((obj, key) => {
          obj[key] = grouped[key];
          return obj;
        }, {});
    });
    
    // Formatting helpers
    const formatDate = (timestamp) => {
      if (!timestamp) return '—';
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleDateString();
    };
    
    const formatReturnDate = (date) => {
      if (!date) return '—';
      const now = new Date();
      const returnDate = new Date(date);
      
      // If within next 7 days, highlight it
      const diffTime = returnDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7 && diffDays > 0) {
        return `${formatDate(date)} (${diffDays} ${t('profile.dashboard.days_remaining')})`;
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
    
    const formatLoginDate = (timestamp) => {
      if (!timestamp) return '—';
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const formatTimelineDate = (timestamp) => {
      if (!timestamp) return '—';
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    const formatPrice = (price) => {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'UAH'
      }).format(price);
    };
    
    const formatFileSize = (bytes) => {
      if (bytes < 1024) {
        return bytes + ' B';
      } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB';
      } else {
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      }
    };
    
    const truncateText = (text, maxLength) => {
      if (!text || text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    };
    
    // Helper functions for UI
    const getOrderTypeClass = (type) => {
      return type.toLowerCase();
    };
    
    const getOrderTypeIcon = (type) => {
      if (type.toLowerCase() === 'purchase') {
        return 'icon-shopping-bag';
      } else if (type.toLowerCase() === 'lease') {
        return 'icon-clock';
      }
      return 'icon-package';
    };
    
    const getStatusClass = (status) => {
      status = status.toLowerCase();
      
      switch (status) {
        case 'pending':
          return 'status-pending';
        case 'processing':
          return 'status-processing';
        case 'shipped':
          return 'status-shipped';
        case 'delivered':
          return 'status-delivered';
        case 'active':
          return 'status-active';
        case 'returned':
          return 'status-returned';
        case 'cancelled':
          return 'status-cancelled';
        case 'completed':
          return 'status-completed';
        case 'approved':
          return 'status-approved';
        case 'rejected':
          return 'status-rejected';
        case 'in_progress':
          return 'status-in-progress';
        case 'resolved':
          return 'status-resolved';
        default:
          return '';
      }
    };
    
    const getMonthName = (month) => {
      const monthKey = [
        'january', 'february', 'march', 'april',
        'may', 'june', 'july', 'august',
        'september', 'october', 'november', 'december'
      ][month];
      
      return t(`profile.months.${monthKey}`);
    };
    
    // Calculate subtotal and total
    const calculateSubtotal = (transaction) => {
      return transaction.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const calculateTotal = (transaction) => {
      return calculateSubtotal(transaction) + transaction.shipping;
    };
    
    // Dashboard actions
    const viewOrderDetails = (orderId) => {
      router.push(`/order/${orderId}`);
    };
    
    const extendLease = (leaseId) => {
      console.log(`Extending lease: ${leaseId}`);
      // Open modal for lease extension
    };
    
    const initiateReturn = (leaseId) => {
      console.log(`Initiating return for lease: ${leaseId}`);
      // Navigate to return flow
      router.push(`/returns/initiate?leaseId=${leaseId}`);
    };
    
    const addToCart = (product) => {
      cartStore.addToCart({
        id: product.id,
        quantity: 1
      });
      toast(`${product.name} added to cart`);
    };
    
    const makePayment = (paymentId) => {
      console.log(`Making payment: ${paymentId}`);
      // Navigate to payment flow
      router.push(`/payment/${paymentId}`);
    };
    
    // Personal information actions
    const addNewAddress = () => {
      // Reset current address form
      Object.keys(currentAddress).forEach(key => {
        if (key !== 'type') {
          currentAddress[key] = '';
        } else {
          currentAddress[key] = 'shipping';
        }
      });
      currentAddress.isDefault = false;
      
      editingAddressIndex.value = -1;
      showAddressModal.value = true;
    };
    
    const editAddress = (index) => {
      const address = addresses.value[index];
      
      // Copy address data to form
      Object.keys(currentAddress).forEach(key => {
        if (key in address) {
          currentAddress[key] = address[key];
        }
      });
      
      editingAddressIndex.value = index;
      showAddressModal.value = true;
    };
    
    const saveAddress = () => {
      // Validate form
      if (!currentAddress.label || !currentAddress.fullName || !currentAddress.street || !currentAddress.city || !currentAddress.country) {
        alert('Please fill in all required fields');
        return;
      }
      
      if (editingAddressIndex.value === -1) {
        // Add new address
        addresses.value.push({
          id: `addr${addresses.value.length + 1}`,
          ...currentAddress
        });
        
        // If set as default, update other addresses
        if (currentAddress.isDefault) {
          addresses.value.forEach((addr, idx) => {
            if (idx !== addresses.value.length - 1) {
              addr.isDefault = false;
            }
          });
        }
      } else {
        // Update existing address
        const updatedAddress = {
          ...addresses.value[editingAddressIndex.value],
          ...currentAddress
        };
        
        addresses.value[editingAddressIndex.value] = updatedAddress;
        
        // If set as default, update other addresses
        if (updatedAddress.isDefault) {
          addresses.value.forEach((addr, idx) => {
            if (idx !== editingAddressIndex.value) {
              addr.isDefault = false;
            }
          });
        }
      }
      
      showAddressModal.value = false;
    };
    
    const deleteAddress = (index) => {
      if (confirm('Are you sure you want to delete this address?')) {
        // Check if it's the default address
        const isDefault = addresses.value[index].isDefault;
        
        // Remove the address
        addresses.value.splice(index, 1);
        
        // If it was the default and we have other addresses, set the first one as default
        if (isDefault && addresses.value.length > 0) {
          addresses.value[0].isDefault = true;
        }
      }
    };
    
    const setDefaultAddress = (index) => {
      // Set the selected address as default
      addresses.value.forEach((addr, idx) => {
        addr.isDefault = idx === index;
      });
    };
    
    const changePassword = async () => {
      // Validate password form
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        alert('Please fill in all password fields');
        return;
      }
      
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert('New password and confirmation do not match');
        return;
      }
      
      try {
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(
          user.value.email,
          passwordForm.currentPassword
        );
        
        await reauthenticateWithCredential(user.value, credential);
        
        // Update password
        await updatePassword(user.value, passwordForm.newPassword);
        
        // Update last password change date
        securityInfo.lastPasswordChange = new Date();
        
        toast('Password updated successfully');
        showPasswordModal.value = false;
        
        // Clear form
        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
      } catch (error) {
        console.error('Error updating password:', error);
        
        if (error.code === 'auth/wrong-password') {
          toast.error('Current password is incorrect');
        } else {
          toast.error('Error updating password. Please try again later.');
        }
      }
    };
    
    const setup2FA = () => {
      // This would typically open a modal to guide the user through 2FA setup
      console.log('Setting up 2FA');
      securityInfo.twoFactorEnabled = true;
    };
    
    const loadMoreLoginHistory = () => {
      // In a real app, this would fetch more login history from the server
      console.log('Loading more login history');
      // Simulate loading more
      setTimeout(() => {
        loginHistory.value.push(
          {
            id: 'login4',
            timestamp: new Date(2022, 10, 18, 10, 30),
            device: 'Windows PC',
            browser: 'Firefox',
            location: 'Kyiv, Ukraine',
            ip: '192.168.1.4',
            successful: true
          },
          {
            id: 'login5',
            timestamp: new Date(2022, 10, 15, 14, 45),
            device: 'Android',
            browser: 'Chrome',
            location: 'Kyiv, Ukraine',
            ip: '192.168.1.5',
            successful: true
          }
        );
        hasMoreLoginHistory.value = false;
      }, 500);
    };
    
    const saveProfile = async () => {
      try {
        // Update display name if changed
        if (user.value.displayName !== personalInfo.displayName) {
          await firebaseUpdateProfile(user.value, {
            displayName: personalInfo.displayName
          });
          userStore.updateUserName(personalInfo.displayName);
        }
        
        // In a real app, you would save other information to your database
        console.log('Saving profile information:', {
          personalInfo,
          addresses: addresses.value,
          communicationPrefs
        });
        
        // Show success message
        toast('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Error updating profile. Please try again later.');
      }
    };
    
    // Orders & Leases actions
    const viewTransactionDetails = (transactionId) => {
      const transaction = transactions.value.find(t => t.id === transactionId);
      if (!transaction) return;
      
      if (transaction.type === 'purchase') {
        router.push(`/order/${transactionId}`);
      } else {
        router.push(`/lease/${transactionId}`);
      }
    };
    
    const downloadInvoice = (transactionId) => {
      console.log(`Downloading invoice for transaction: ${transactionId}`);
      toast('Invoice download started');
    };
    
    const reorderItems = (transaction) => {
      // Add all items to cart
      for (const item of transaction.items) {
        cartStore.addToCart({
          id: item.id,
          quantity: item.quantity
        });
      }
      
      // Navigate to cart
      router.push('/cart');
    };
    
    const loadMoreTransactions = () => {
      // In a real app, this would fetch more transactions from the server
      console.log('Loading more transactions');
      // Simulate loading more
      setTimeout(() => {
        transactions.value.push(
          {
            id: 'trans4',
            type: 'purchase',
            orderNumber: 'ORD-2022-950',
            status: 'DELIVERED',
            date: new Date(2022, 7, 18),
            shipping: 100,
            items: [
              { id: 'item7', name: 'Bluetooth Speaker', quantity: 1, price: 1499, image: '/images/products/speaker.jpg' }
            ]
          },
          {
            id: 'trans5',
            type: 'lease',
            orderNumber: 'LEASE-2022-432',
            status: 'RETURNED',
            date: new Date(2022, 6, 5),
            shipping: 0,
            items: [
              { 
                id: 'item8', 
                name: 'Professional Camera', 
                quantity: 1, 
                price: 2999, 
                image: '/images/products/camera.jpg',
                leaseStart: new Date(2022, 6, 5),
                leaseEnd: new Date(2022, 9, 5)
              }
            ]
          }
        );
        hasMoreTransactions.value = false;
      }, 500);
    };
    
    // Lifecycle hooks
    onMounted(() => {
      console.log('UserProfileView mounted'); // Debug log
      // Initialize personal info form with user data
      if (user.value) {
        personalInfo.displayName = user.value.displayName || '';
        personalInfo.email = user.value.email || '';
      }
      
      // Load user data from the store
      // In a real app, you would fetch this data from your database
    });
    
    return {
      t,
      user,
      defaultAvatar,
      avatarInput,
      showAddressModal,
      showPasswordModal,
      showTwoFactorModal,
      hasMoreLoginHistory,
      hasMoreTransactions,
      editingAddressIndex,
      activeTab,
      tabs,
      userTier,
      userTierClass,
      stats,
      activeOrders,
      upcomingReturns,
      upcomingPayments,
      personalInfo,
      addresses,
      currentAddress,
      communicationPrefs,
      securityInfo,
      passwordForm,
      loginHistory,
      transactionFilters,
      transactionView,
      filteredTransactions,
      groupedTransactions,
      triggerAvatarUpload, // Was missing in your returns
      handleAvatarUpload,
      formatDate,
      formatReturnDate,
      calculateDaysRemaining,
      formatLoginDate,
      formatTimelineDate,
      formatPrice,
      formatFileSize,
      truncateText,
      getOrderTypeClass,
      getOrderTypeIcon,
      getStatusClass,
      getMonthName,
      calculateSubtotal,
      calculateTotal,
      viewOrderDetails,
      extendLease,
      initiateReturn,
      addToCart,
      makePayment,
      addNewAddress,
      editAddress,
      saveAddress,
      deleteAddress,
      setDefaultAddress,
      changePassword,
      setup2FA,
      loadMoreLoginHistory,
      saveProfile,
      viewTransactionDetails,
      downloadInvoice,
      reorderItems,
      loadMoreTransactions,
      logout
    };
  }
};
</script>


<style scoped>
/* Base Styles */
.user-profile-container {
  max-width: 1100px;
  margin: 120px auto 60px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Top Navigation Tabs */
.profile-tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-button i {
  margin-right: 8px;
  font-size: 18px;
}

.tab-button:hover {
  color: #0066cc;
  background-color: rgba(0, 102, 204, 0.05);
}

.tab-button.active {
  color: #0066cc;
  background-color: rgba(0, 102, 204, 0.1);
  font-weight: 600;
}

/* Profile Header */
.profile-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid #f0f0f0;
}

.profile-avatar-container {
  position: relative;
  margin-right: 30px;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.edit-avatar-btn:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.hidden-file-input {
  display: none;
}

.profile-info {
  flex-grow: 1;
  margin-right: 30px;
}

.user-name {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.user-email {
  color: #666;
  font-size: 16px;
  margin-bottom: 12px;
}

.member-status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.tier-standard {
  background-color: #e9ecef;
  color: #495057;
}

.tier-premium {
  background-color: #cfe3ff;
  color: #0066cc;
}

.tier-vip {
  background-color: #ffd700;
  color: #6b5900;
}

.member-since {
  font-size: 14px;
  color: #666;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #f0f0f0;
  color: #e53935;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  margin-top: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: #ffebee;
}

.quick-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
}

.stat-item {
  flex: 1;
  min-width: 120px;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #0066cc;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

/* Common Section Styles */
.profile-section {
  margin-bottom: 40px;
}

.profile-section h2 {
  font-size: 24px;
  margin-bottom: 25px;
  color: #333;
  font-weight: 600;
}

.form-section {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.form-section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3, .section-header h4 {
  margin: 0;
}

/* Form Controls */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input, .form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-select:focus {
  border-color: #0066cc;
  outline: none;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-group input[type="checkbox"] {
  margin: 0;
}

/* Buttons */
.btn-primary, .btn-secondary, .btn-text, .btn-icon {
  cursor: pointer;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #0066cc;
  color: white;
  border: none;
  padding: 10px 20px;
}

.btn-primary:hover {
  background-color: #0055aa;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px 20px;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-text {
  background: none;
  border: none;
  color: #0066cc;
  padding: 5px;
  display: inline-flex;
  align-items: center;
}

.btn-text:hover {
  text-decoration: underline;
}

.btn-icon {
  background: none;
  border: none;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border-radius: 50%;
}

.btn-icon:hover {
  background-color: #f0f0f0;
  color: #333;
}

.btn-small {
  font-size: 14px;
  padding: 6px 12px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: #666;
  cursor: pointer;
}

.btn-close:hover {
  color: #333;
}

/* Dashboard specific styles */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.dashboard-card {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.dashboard-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.dashboard-card.recommendations {
  grid-column: span 2;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.active-order-list, .returns-list, .payments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.active-order-item, .return-item, .payment-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.order-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 12px;
}

.order-icon.purchase {
  background-color: #e7f5ff;
  color: #0066cc;
}

.order-icon.lease {
  background-color: #e9ecef;
  color: #495057;
}

.order-brief {
  flex: 1;
}

.order-title {
  font-weight: 600;
  margin: 0 0 5px;
  font-size: 14px;
}

.order-status {
  font-size: 13px;
  color: #666;
}

.date-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 60px;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-right: 12px;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: #333;
  padding: 4px;
}

.lease-info {
  flex: 1;
}

.lease-title {
  font-weight: 600;
  margin: 0 0 5px;
  font-size: 14px;
}

.lease-details {
  font-size: 13px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.payment-date {
  min-width: 80px;
  margin-right: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.payment-details {
  flex: 1;
}

.payment-title {
  font-weight: 600;
  margin: 0 0 5px;
  font-size: 14px;
}

.payment-amount {
  font-size: 16px;
  color: #0066cc;
  font-weight: 600;
}

.quick-actions {
  margin-top: 20px;
}

.action-buttons-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: #e7f5ff;
  border-color: #0066cc;
}

.action-button i {
  font-size: 24px;
  margin-bottom: 8px;
  color: #0066cc;
}

.action-button span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

/* Addresses styles */
.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.address-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.address-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.address-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.address-tags {
  display: flex;
  gap: 5px;
}

.address-tag {
  display: inline-block;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.address-tag.default {
  background-color: #e7f5ff;
  color: #0066cc;
}

.address-tag.shipping {
  background-color: #eaf7ed;
  color: #198754;
}

.address-tag.billing {
  background-color: #fff3cd;
  color: #ffc107;
}

.address-tag.installation {
  background-color: #f8d7da;
  color: #dc3545;
}

.address-content {
  margin-bottom: 12px;
}

.address-content p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.address-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

/* Communication preferences styles */
.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.preference-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.preference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.preference-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #0066cc;
}

input:focus + .slider {
  box-shadow: 0 0 1px #0066cc;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.preference-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Security settings styles */
.security-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.security-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.security-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.security-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.security-info {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.login-history {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.login-history-list {
  margin-top: 15px;
}

.login-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.login-item:last-child {
  border-bottom: none;
}

.login-info {
  flex: 1;
}

.login-date {
  font-weight: 600;
  margin: 0 0 5px;
  font-size: 14px;
}

.login-device, .login-location {
  font-size: 13px;
  color: #666;
  margin: 2px 0;
}

.login-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.login-status.success {
  background-color: #eaf7ed;
  color: #198754;
}

.login-status.failed {
  background-color: #f8d7da;
  color: #dc3545;
}

.profile-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* Orders & Leases styles */
.transaction-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.filter-toggles {
  display: flex;
  gap: 15px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.filter-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-filter {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.view-toggles {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.view-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border: none;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle:hover {
  background-color: #e0e0e0;
}

.view-toggle.active {
  background-color: #0066cc;
  color: white;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.transaction-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f9f9f9;
}

.transaction-type {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.transaction-type.purchase {
  background-color: #e7f5ff;
  color: #0066cc;
}

.transaction-type.lease {
  background-color: #e9ecef;
  color: #495057;
}

.transaction-meta {
  flex: 1;
  margin: 0 15px;
}

.transaction-meta h3 {
  margin: 0 0 5px;
  font-size: 16px;
}

.transaction-date {
  font-size: 14px;
  color: #666;
}

.transaction-status {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-shipped {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-delivered {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-active {
  background-color: #e7f5ff;
  color: #0066cc;
}

.status-returned {
  background-color: #e9ecef;
  color: #495057;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.status-completed {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-approved {
  background-color: #d1e7dd;
  color: #0f5132;
}

.status-rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.status-in-progress {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-resolved {
  background-color: #d1e7dd;
  color: #0f5132;
}

.transaction-items {
  padding: 20px;
}

.transaction-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.transaction-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  margin: 0 0 5px;
  font-size: 15px;
}

.item-quantity, .lease-period {
  font-size: 13px;
  color: #666;
  margin: 2px 0;
}

.item-price {
  font-weight: 600;
  font-size: 16px;
  color: #0066cc;
}

.transaction-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.transaction-totals {
  flex: 1;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 5px;
}

.total-row.total-final {
  font-weight: 600;
  font-size: 16px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}

.transaction-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

/* Timeline view styles */
.transaction-timeline {
  margin-top: 30px;
}

.timeline {
  position: relative;
}

.timeline:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 120px;
  width: 2px;
  background-color: #eee;
}

.timeline-year {
  margin-bottom: 30px;
  position: relative;
}

.year-header {
  position: sticky;
  top: 20px;
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 5px 0;
  z-index: 10;
}

.timeline-month {
  margin-bottom: 20px;
}

.month-header {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-left: 150px;
  margin-bottom: 15px;
}

.timeline-item {
  display: flex;
  position: relative;
  margin-bottom: 15px;
}

.timeline-marker {
  position: absolute;
  left: 116px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #0066cc;
  z-index: 1;
}

.timeline-marker.lease {
  background-color: #495057;
}

.timeline-content {
  margin-left: 150px;
  width: 100%;
}

.timeline-date {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.timeline-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #0066cc;
}

.timeline-card.lease {
  border-left-color: #495057;
}

.timeline-type-badge {
  display: inline-block;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  background-color: #e7f5ff;
  color: #0066cc;
  margin-bottom: 10px;
}

.timeline-card.lease .timeline-type-badge {
  background-color: #e9ecef;
  color: #495057;
}

.timeline-card h4 {
  margin: 0 0 10px;
  font-size: 16px;
}

.timeline-status {
  display: inline-block;
  margin-bottom: 10px;
}

.timeline-items-summary {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.timeline-actions {
  display: flex;
  gap: 10px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-card.recommendations {
    grid-column: auto;
  }
  
  .action-buttons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .addresses-grid, .preferences-grid, .security-grid {
    grid-template-columns: 1fr;
  }
  
  .login-item, .transaction-header, .transaction-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .login-status, .transaction-status {
    margin-top: 10px;
  }
  
  .transaction-meta {
    margin: 10px 0;
  }
  
  .transaction-actions {
    margin-top: 15px;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .timeline:before {
    left: 20px;
  }
  
  .timeline-marker {
    left: 16px;
  }
  
  .month-header, .timeline-content {
    margin-left: 40px;
  }
}

@media (max-width: 576px) {
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .profile-info {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .member-status {
    justify-content: center;
  }
  
  .quick-stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .active-order-item, .return-item, .payment-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-icon, .date-badge, .payment-date {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .action-buttons {
    margin-top: 10px;
    width: 100%;
    justify-content: space-between;
    gap: 15px;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
  
  .transaction-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .transaction-footer {
    flex-direction: column;
  }
  
  .transaction-actions {
    justify-content: flex-start;
  }
  
  .transaction-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-dropdown, .filter-toggles {
    flex-wrap: wrap;
  }
  
  .payment-card {
    flex-direction: column;
  }
  
  .payment-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .payment-actions {
    margin-left: 0;
    margin-top: 15px;
  }
  
  .billing-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .billing-history-table {
    overflow-x: auto;
  }
  
  .return-order-details, .exchange-details, .termination-details {
    flex-direction: column;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .action-buttons-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-stats {
    flex-direction: column;
  }
  
  .stat-item {
    width: 100%;
  }
}
</style>