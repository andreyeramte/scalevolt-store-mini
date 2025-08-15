# ScaleVolt Admin Panel

A modern, robust admin panel for managing ScaleVolt's product catalog and business operations.

## 🚀 Features

### Core Functionality
- **Product Management**: Add, edit, delete, and manage products with visual clarity
- **Multi-language Support**: Manage products in English, Ukrainian, and Polish
- **Image Upload**: Drag-and-drop image upload with preview
- **Category Management**: Organize products into categories
- **User Management**: View and manage user accounts
- **Dashboard Analytics**: Real-time statistics and insights
- **Search & Filter**: Advanced product search and filtering
- **Bulk Operations**: Mass update and delete products
- **Export Functionality**: Export product data to CSV

### Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark mode detection
- **Modern Animations**: Smooth transitions and hover effects
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Visual Feedback**: Loading states, success/error messages
- **Accessibility**: WCAG compliant design

## 📁 Project Structure

```
vue-frontend/src/views/admin/
├── AdminDashboard.jsx          # Main admin dashboard
├── AdminDashboard.css          # Dashboard styles
├── ProductManagement.jsx       # Product management interface
├── ProductManagement.css       # Product management styles
├── AdminLogin.jsx             # Admin login component
└── AdminLogin.css             # Login styles

vue-frontend/src/services/
└── adminService.js            # Admin API service

node-backend/backend-node/routes/
└── adminRoutes.js             # Admin API routes
```

## 🛠️ Setup Instructions

### 1. Backend Setup

1. **Install Dependencies**
   ```bash
   cd node-backend/backend-node
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in `node-backend/backend-node/`:
   ```env
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=scalevolt_db
   PGUSER=your_username
   PGPASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

3. **Database Setup**
   ```bash
   # Run database setup script
   node setupDatabase.js
   ```

4. **Start Backend Server**
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Install Dependencies**
   ```bash
   cd vue-frontend
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in `vue-frontend/`:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

3. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

## 🔐 Authentication

### Admin Login
- Navigate to `/admin/login`
- Use admin credentials to access the panel
- JWT tokens are automatically managed

### Admin User Creation
Create an admin user in the database:
```sql
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@scalevolt.com', 'hashed_password', 'admin');
```

## 📊 Admin Panel Features

### Dashboard Overview
- **Statistics Cards**: Total products, categories, orders, users
- **Quick Actions**: Add product, add category, manage translations
- **Recent Activity**: Latest products and updates
- **Low Stock Alerts**: Products with low inventory

### Product Management
- **Product Grid**: Visual product cards with images
- **Search & Filter**: Find products by name, SKU, or category
- **Sort Options**: Sort by name, price, stock, or date
- **Bulk Operations**: Select multiple products for mass actions
- **Image Management**: Upload multiple images with preview
- **Multi-language**: Manage product names and descriptions in 3 languages

### Form Features
- **Real-time Validation**: Instant form validation feedback
- **Auto-save**: Automatic saving of form data
- **Image Preview**: Live preview of uploaded images
- **Drag & Drop**: Easy image upload interface
- **Rich Text Editor**: Enhanced description editing

## 🎨 UI Components

### Modern Design Elements
- **Gradient Backgrounds**: Beautiful gradient color schemes
- **Card-based Layout**: Clean, organized information display
- **Hover Effects**: Interactive elements with smooth animations
- **Loading States**: Professional loading spinners and skeletons
- **Toast Notifications**: Success/error message display

### Responsive Breakpoints
- **Desktop**: Full-featured interface with sidebar
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly mobile interface

## 🔧 API Endpoints

### Admin Routes
```
GET    /api/admin/stats              # Dashboard statistics
GET    /api/admin/products           # Get products with pagination
POST   /api/admin/products           # Create new product
PUT    /api/admin/products/:id       # Update product
DELETE /api/admin/products/:id       # Delete product
GET    /api/admin/categories         # Get categories
POST   /api/admin/categories         # Create category
GET    /api/admin/users              # Get users
```

### Authentication Routes
```
POST   /api/auth/login               # Admin login
GET    /api/auth/me                  # Get current user
```

## 📱 Usage Guide

### Adding a Product
1. Navigate to `/admin/products`
2. Click "Add Product" button
3. Fill in product details:
   - Name (English, Ukrainian, Polish)
   - Description (multi-language)
   - Price and stock
   - Category and brand
   - SKU
4. Upload product images
5. Click "Save Product"

### Managing Products
1. Use search bar to find specific products
2. Filter by category using dropdown
3. Sort products by different criteria
4. Click "Edit" to modify product details
5. Click "Delete" to remove products

### Dashboard Navigation
1. Use sidebar navigation to switch between sections
2. View statistics on the main dashboard
3. Access quick actions for common tasks
4. Monitor recent activity and alerts

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd vue-frontend
npm run build

# Backend
cd node-backend/backend-node
npm start
```

### Environment Variables
Set production environment variables:
```env
NODE_ENV=production
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin-only routes and functions
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Image type and size validation
- **CORS Configuration**: Proper cross-origin resource sharing

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check JWT token in localStorage
   - Verify admin credentials in database
   - Ensure backend server is running

2. **Image Upload Issues**
   - Check file size limits (10MB max)
   - Verify image format (JPG, PNG, etc.)
   - Ensure upload directory exists

3. **Database Connection**
   - Verify database credentials in .env
   - Check if PostgreSQL is running
   - Test database connection

### Debug Mode
Enable debug logging:
```javascript
// In adminService.js
console.log('API Request:', endpoint, options);
```

## 📈 Future Enhancements

- **Advanced Analytics**: Sales reports and trends
- **Inventory Management**: Stock tracking and alerts
- **Order Management**: Process and track orders
- **Customer Management**: Customer database and support
- **Marketing Tools**: Promotions and discounts
- **SEO Management**: Meta tags and descriptions
- **Multi-store Support**: Manage multiple store locations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary to ScaleVolt. All rights reserved.

---

**ScaleVolt Admin Panel** - Modern, robust, and visually clear product management system. 