# ScaleVolt Store - Mini Launch Version

A minimal e-commerce store for solar and renewable energy products, designed for quick deployment.

## 🚀 Features

- **3 Core Products**: Portable Solar Panel, Portable Power Station, Home Battery Pack
- **Bilingual Support**: English (EN) and Polish (PL) languages
- **Supabase Integration**: Modern database backend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **React 19**: Latest React with modern hooks and patterns

## 📦 Products Included

1. **Portable Solar Panel 100W** - €299.99
   - High-efficiency portable solar panel
   - Perfect for camping, RVs, and emergency power
   - Lightweight and foldable design

2. **Portable Power Station 1000Wh** - €899.99
   - Compact and powerful portable power station
   - Multiple output ports and fast charging
   - LCD display for easy monitoring

3. **Home Battery Pack 10kWh** - €4,999.99
   - Professional home energy storage solution
   - Seamlessly integrates with solar panels
   - Provides backup power during outages

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/andreyeramte/scalevolt-store-mini.git
cd scalevolt-store-mini
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.mini.example .env

# Edit .env with your actual values
# Required: SUPABASE_URL, SUPABASE_ANON_KEY
```

### 3. Seed Products to Supabase

```bash
# Run the database seeding script
node db/seed-mini-products.js
```

### 4. Start Development

```bash
# Frontend (Vite)
npm run dev

# Backend (in separate terminal)
cd node-backend/backend-node
npm install
npm start
```

## 🌐 Local Development

### Frontend
- **URL**: http://localhost:5173
- **Default Language**: Polish (PL)
- **Language Switch**: EN/PL toggle available

### Backend API
- **URL**: http://localhost:3001
- **Endpoints**: `/api/products`, `/api/search`, etc.

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Go to SQL Editor and run the schema from `db/schema.sql`
3. Update your `.env` file with Supabase credentials
4. Run the seeding script: `node db/seed-mini-products.js`

### Database Schema

The products table includes:
- `id`, `name_en`, `name_pl`, `description_en`, `description_pl`
- `price`, `currency`, `category`, `images`, `specs`
- `in_stock`, `featured`, `created_at`, `updated_at`

## 🚀 Deployment

### Frontend to Vercel

1. **Connect Repository**:
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

2. **Environment Variables**:
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Redeploy after adding variables

### Backend to Render

1. **Create Web Service**:
   - Go to [Render](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Set root directory: `node-backend/backend-node`

2. **Environment Variables**:
   - Add all backend environment variables
   - Set build command: `npm install`
   - Set start command: `npm start`

3. **Update Frontend**:
   - Update `API_BASE_URL` in frontend to point to Render URL

## 🔧 Configuration

### Language Settings

- **Default**: Polish (PL)
- **Supported**: English (EN), Polish (PL)
- **Switch**: Use language selector in header

### Product Management

- Products are stored in Supabase
- Fallback to local data if Supabase unavailable
- Easy to add/modify products via Supabase dashboard

## 📱 Testing

### Local Testing

1. **Product Display**: Verify all 3 products show correctly
2. **Language Switch**: Test EN/PL language switching
3. **Responsive Design**: Test on mobile and desktop
4. **API Endpoints**: Test backend routes

### Build Testing

```bash
# Test production build
npm run build
npm run preview
```

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Failed**:
   - Verify environment variables
   - Check Supabase project status
   - Ensure database schema is created

2. **Products Not Loading**:
   - Check Supabase connection
   - Verify products table exists
   - Run seeding script again

3. **Build Errors**:
   - Clear node_modules and reinstall
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed

### Support

- Check Supabase logs in dashboard
- Review browser console for frontend errors
- Check backend logs in Render dashboard

## 📈 Next Steps

After successful mini launch:

1. **Add More Products**: Expand product catalog
2. **User Authentication**: Implement user accounts
3. **Shopping Cart**: Add cart functionality
4. **Payment Integration**: Add Stripe checkout
5. **Analytics**: Add tracking and analytics
6. **SEO Optimization**: Improve search engine visibility

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

This is a mini launch version. For contributions to the main project, please refer to the main ScaleVolt Store repository.

---

**Ready for Launch! 🚀**

Your minimal e-commerce store is now configured and ready for deployment to Vercel and Render.
