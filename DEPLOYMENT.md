# ScaleVolt Store Deployment Guide

This guide provides step-by-step instructions for deploying the ScaleVolt Store to production environments.

## 🚀 Quick Start

### Prerequisites
- GitHub repository with your code
- Render.com account (for backend)
- Vercel account (for frontend)
- Firebase project (for authentication)

### 1. Backend Deployment (Render)

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

#### Step 2: Create PostgreSQL Database
1. In Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - **Name**: `scalevolt-db`
   - **Database**: `scalevolt_store`
   - **User**: `scalevolt_user`
   - **Region**: Choose closest to your users
4. Click "Create Database"
5. Note down the connection details (you'll need these for environment variables)

#### Step 3: Deploy Backend Service
1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `scalevolt-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `node-backend/backend-node`

#### Step 4: Set Environment Variables
In your backend service settings, add these environment variables:

```bash
# Database Configuration
DB_HOST=your-render-postgres-host
DB_PORT=5432
DB_USER=your-render-user
DB_NAME=your-render-db-name
DB_PASSWORD=your-render-password

# Server Configuration
PORT=10000
NODE_ENV=production

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Security
ADMIN_COOKIE_SECRET=your-super-secret-cookie-key
JWT_SECRET=your-super-secret-jwt-key

# CORS Origins (add your frontend URL)
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

#### Step 5: Deploy and Setup Database
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Go to your service URL and add `/health` to check if it's running
4. SSH into your service or use Render's shell to run:
   ```bash
   # Install dependencies
   npm install
   
   # Run database migrations
   npm run migrate
   
   # Import sample products
   npm run import:products
   ```

### 2. Frontend Deployment (Vercel)

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Import your GitHub repository

#### Step 2: Configure Project
1. Set the **Root Directory** to `vue-frontend`
2. Set the **Framework Preset** to `Vite`
3. Set the **Build Command** to `npm run build`
4. Set the **Output Directory** to `dist`

#### Step 3: Set Environment Variables
In your Vercel project settings, add these environment variables:

```bash
# API Configuration
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_ADMIN_URL=https://your-backend-url.onrender.com/admin

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Feature Flags
VITE_ENABLE_CHATBOT=true
VITE_ENABLE_ANALYTICS=false
VITE_DEV_MODE=false
```

#### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your site will be available at `https://your-project.vercel.app`

## 🔧 Firebase Setup

### Step 1: Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `scalevolt-store`
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In Firebase console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Click "Save"

### Step 3: Create Web App
1. In Firebase console, go to "Project settings"
2. Scroll to "Your apps" section
3. Click "Add app" and select "Web"
4. Register app with name: `ScaleVolt Store`
5. Copy the config values to your environment variables

### Step 4: Get Configuration Values
The Firebase config will look like this:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

Copy these values to your environment variables.

## 📊 Admin Panel Setup

### Step 1: Access Admin Panel
1. Go to your backend URL: `https://your-backend-url.onrender.com/admin`
2. Login with:
   - **Email**: `admin@scalevolt.com`
   - **Password**: `admin123`

### Step 2: Create Admin User
1. In the admin panel, go to "Users"
2. Click "Create new"
3. Add your admin user with secure credentials
4. Delete the default admin user for security

### Step 3: Import Products
1. Create a CSV file with your product data
2. Use the format from `data/sample_products.csv`
3. Go to "Import Logs" in admin panel
4. Upload and import your products

## 🔍 Health Checks

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/health
```
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "message": "ScaleVolt API is running"
}
```

### Frontend Health Check
Visit your frontend URL and check:
- Page loads without errors
- Language selector works
- Navigation works
- Products load (if any are imported)

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Failed
**Symptoms**: Health check shows "database: disconnected"
**Solution**:
- Check environment variables in Render
- Verify PostgreSQL service is running
- Check database credentials

#### 2. CORS Errors
**Symptoms**: Frontend can't connect to backend
**Solution**:
- Add your frontend URL to `CORS_ORIGINS` in backend environment variables
- Ensure URLs are correct (no trailing slashes)

#### 3. Firebase Authentication Not Working
**Symptoms**: Login/logout doesn't work
**Solution**:
- Verify Firebase config in frontend environment variables
- Check Firebase project settings
- Ensure Authentication is enabled in Firebase

#### 4. Products Not Loading
**Symptoms**: Empty product pages
**Solution**:
- Check if products are imported in admin panel
- Verify database migrations ran successfully
- Check backend logs for errors

### Debug Commands

#### Check Backend Logs
```bash
# In Render dashboard
# Go to your backend service
# Click "Logs" tab
# Look for error messages
```

#### Check Database
```bash
# SSH into your Render service
# Connect to PostgreSQL
psql $DATABASE_URL

# Check tables
\dt

# Check products
SELECT COUNT(*) FROM products;
```

#### Check Frontend Build
```bash
# In Vercel dashboard
# Go to your project
# Click "Deployments"
# Check build logs for errors
```

## 🔄 Continuous Deployment

### Automatic Deployments
Both Render and Vercel will automatically deploy when you push to your main branch.

### Manual Deployments
- **Render**: Go to your service and click "Manual Deploy"
- **Vercel**: Go to your project and click "Redeploy"

### Environment Variables Updates
- **Render**: Update in service settings, then redeploy
- **Vercel**: Update in project settings, then redeploy

## 📈 Monitoring

### Render Monitoring
- **Metrics**: CPU, memory, disk usage
- **Logs**: Real-time application logs
- **Alerts**: Set up alerts for high resource usage

### Vercel Monitoring
- **Analytics**: Page views, performance
- **Functions**: Serverless function logs
- **Edge**: CDN performance

### Custom Monitoring
```bash
# Health check script
curl -f https://your-backend-url.onrender.com/health || echo "Backend down"
curl -f https://your-frontend-url.vercel.app || echo "Frontend down"
```

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Use strong secrets for JWT and cookies
- [ ] Enable HTTPS (automatic with Render/Vercel)
- [ ] Set up proper CORS origins
- [ ] Configure Firebase security rules
- [ ] Set up database backups
- [ ] Monitor for security issues

## 📝 Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] Firebase authentication works
- [ ] Admin panel accessible
- [ ] Products imported successfully
- [ ] Search functionality works
- [ ] Language switching works
- [ ] Mobile responsiveness tested
- [ ] SSL certificates valid
- [ ] Performance acceptable

## 🆘 Support

### Getting Help
1. Check the troubleshooting section above
2. Review Render and Vercel documentation
3. Check Firebase console for authentication issues
4. Review application logs for errors

### Useful Links
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Emergency Contacts
- **Render Support**: Available in dashboard
- **Vercel Support**: Available in dashboard
- **Firebase Support**: Available in console

---

**Note**: This deployment guide assumes you're using the free tiers of Render and Vercel. For production use, consider upgrading to paid plans for better performance and support.
