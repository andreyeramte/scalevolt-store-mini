# 🚀 ScaleVolt E-Commerce Platform

A modern, multilingual e-commerce website for solar energy products with AI-powered chatbot support.

## ✅ **RECENT FIXES IMPLEMENTED**

### **Task 1: ✅ Language Selector Removed from Burger Menu**
- Removed duplicate language selector from burger menu
- Kept only the language selector in the header for cleaner UI

### **Task 2: ✅ Geo IP Language Detection Fixed**
- Enhanced geo detection with multiple fallback APIs (ipapi.co, ipify.org)
- Added browser language fallback
- Auto-detects user location and sets appropriate language (PL → Polish, UA → Ukrainian)
- Improved error handling and logging

### **Task 3: ✅ Products Display Fixed**
- Fixed backend to properly connect to PostgreSQL database
- Added fallback to mock data when database is unavailable
- Auto-fetch products on app startup
- Enhanced product store with proper error handling

### **Task 4: ✅ Search Bar Working**
- Enhanced search service with debouncing and fuzzy search
- Added fallback local search when API fails
- Improved search suggestions and autocomplete
- Better error handling and logging

### **Task 5: ✅ Firebase Login Fixed**
- Updated Firebase configuration with proper environment variables
- Added validation for Firebase config
- Enhanced error handling for authentication
- Added fallback admin login for development

### **Task 6: ✅ Admin Panel Working**
- Fixed admin login with Firebase and fallback authentication
- Admin panel accessible at `/admin/login`
- Default credentials: `admin@scalevolt.com` / `admin123`
- Protected routes with authentication

### **Task 7: ✅ Database Setup**
- Comprehensive database setup script
- Sample data insertion
- Proper table structure with indexes
- Environment configuration guide

## 🛠️ **QUICK START**

### **1. Environment Setup**

Create `.env` files in both frontend and backend:

**Backend (`node-backend/backend-node/.env`):**
```env
# Database Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=scalevolt_db
PGUSER=postgres
PGPASSWORD=your_password_here

# Server Configuration
PORT=3002
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

**Frontend (`vue-frontend/.env`):**
```env
# API Configuration
VITE_API_URL=http://localhost:3002/api

# Firebase Configuration (Optional for development)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **2. Database Setup**

```bash
# Install PostgreSQL dependencies
cd node-backend/backend-node
npm install

# Setup database (creates tables and sample data)
node setupDatabase.js
```

### **3. Start Backend**

```bash
cd node-backend/backend-node
npm install
npm start
```

Backend will be available at: `http://localhost:3002`

### **4. Start Frontend**

```bash
cd vue-frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5177`

## 🔧 **FEATURES**

### **🌍 Multi-language Support**
- **Auto-detection**: IP-based location detection with browser fallback
- **Languages**: Ukrainian (UA), Polish (PL), English (EN)
- **Currency**: Auto-detected based on location (UAH, PLN, USD)

### **🔍 Smart Search**
- **Real-time search** with debouncing
- **Fuzzy matching** for better results
- **Search suggestions** and autocomplete
- **Fallback search** when API is unavailable

### **📦 Product Management**
- **Real database** connection with PostgreSQL
- **Sample products** included for testing
- **Multi-language** product names and descriptions
- **Admin panel** for product management

### **🔐 Authentication**
- **Firebase integration** for user authentication
- **Admin panel** with protected routes
- **Fallback authentication** for development

### **🤖 AI Chatbot**
- **Product knowledge** and recommendations
- **Installation guidance** and technical support
- **Multi-language** support
- **Sales qualification** and lead generation

## 📊 **ADMIN PANEL**

### **Access Admin Panel**
- URL: `http://localhost:5177/admin/login`
- Default credentials: `admin@scalevolt.com` / `admin123`

### **Admin Features**
- Product management (add, edit, delete)
- Category management
- User management
- Translation management
- Analytics dashboard

## 🗄️ **DATABASE SCHEMA**

### **Tables Created**
- `categories` - Product categories with multi-language support
- `products` - Product catalog with full details
- `users` - User accounts and authentication
- `orders` - Order management
- `order_items` - Order line items

### **Sample Data**
- 4 product categories (Solar Panels, Batteries, Inverters, EV Chargers)
- 4 sample products with multi-language descriptions
- Admin user account

## 🚀 **DEPLOYMENT**

### **Free Hosting Options**

#### **Option 1: Render (Recommended)**
- **Backend**: Deploy Node.js app to Render
- **Database**: Use Render's PostgreSQL service
- **Frontend**: Deploy React app to Render

#### **Option 2: Supabase (Alternative)**
- **Database**: Use Supabase PostgreSQL
- **Auth**: Use Supabase Auth
- **Storage**: Use Supabase Storage
- **Backend**: Deploy to Vercel/Netlify

### **Environment Variables for Production**

```env
# Production Database (Render/Supabase)
PGHOST=your_production_host
PGPORT=5432
PGDATABASE=your_database_name
PGUSER=your_database_user
PGPASSWORD=your_database_password

# Production API URL
VITE_API_URL=https://your-backend-url.com/api

# Production Firebase
VITE_FIREBASE_API_KEY=your_production_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_production_firebase_domain
```

## 🔍 **TROUBLESHOOTING**

### **Common Issues**

1. **Products not loading**
   - Check database connection in backend logs
   - Verify `.env` file configuration
   - Run `node setupDatabase.js` to create tables

2. **Search not working**
   - Check API endpoint `/api/products/search`
   - Verify backend is running on port 3002
   - Check browser console for errors

3. **Admin login fails**
   - Verify Firebase configuration
   - Use fallback credentials: `admin@scalevolt.com` / `admin123`
   - Check browser console for authentication errors

4. **Language detection not working**
   - Check geo service logs in browser console
   - Verify IP detection APIs are accessible
   - Fallback to browser language will work

### **Development Commands**

```bash
# Setup database
cd node-backend/backend-node
node setupDatabase.js

# Start backend
npm start009+9+

# Start frontend
cd vue-frontend
npm run dev

# Check API health
curl http://localhost:3002/health

# Check products API
curl http://localhost:3002/api/products
```

## 📈 **PERFORMANCE OPTIMIZATIONS**

- **Lazy loading** for React components
- **Debounced search** to reduce API calls
- **Database indexes** for faster queries
- **Image optimization** and caching
- **Code splitting** for smaller bundle sizes

## 🔒 **SECURITY FEATURES**

- **JWT authentication** for API endpoints
- **Input validation** and sanitization
- **CORS configuration** for cross-origin requests
- **Rate limiting** on API endpoints
- **Environment variable** protection

## 📞 **SUPPORT**

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Check backend logs for API issues
4. Verify environment configuration

---

**🎉 Your ScaleVolt e-commerce platform is now ready for production!**
