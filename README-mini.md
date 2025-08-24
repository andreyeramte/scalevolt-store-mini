# ScaleVolt Store - Mini Launch Version

A minimal e-commerce store focused on renewable energy products, built with React and Supabase.

## 🎯 Features

- **3 Core Products**: Portable Solar Panel, Portable Power Station, Home Battery Pack
- **Bilingual Support**: English (EN) and Polish (PL) with Polish as default
- **Supabase Integration**: Real-time product data from Supabase database
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Language Switcher**: Easy toggle between EN/PL languages
- **Cart Management**: Add products to cart functionality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/andreyeramte/scalevolt-store-new.git
cd scalevolt-store-new

# Switch to mini-launch branch
git checkout mini-launch

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp env.mini.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down your project URL and anon key

2. **Create Products Table**
   ```sql
   CREATE TABLE products (
     id TEXT PRIMARY KEY,
     name_en TEXT NOT NULL,
     name_pl TEXT NOT NULL,
     description_en TEXT,
     description_pl TEXT,
     price DECIMAL(10,2) NOT NULL,
     currency TEXT DEFAULT 'EUR',
     category TEXT,
     images TEXT[],
     specs JSONB,
     in_stock BOOLEAN DEFAULT true,
     featured BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Seed Products**
   ```bash
   # Install backend dependencies
   cd node-backend
   npm install
   
   # Set backend environment variables
   cp env.mini.example .env
   # Add SUPABASE_URL and SUPABASE_ANON_KEY to .env
   
   # Run the seeding script
   node db/seed-mini-products.js
   ```

### 4. Run Locally

```bash
# Frontend (from root directory)
npm run dev

# Backend (from node-backend directory)
cd node-backend
npm start
```

Visit `http://localhost:5173` to see your store!

## 🌐 Language Support

The mini-launch version supports two languages:

- **Polish (PL)**: Default language
- **English (EN)**: Secondary language

Users can switch languages using the language switcher in the header.

## 📦 Product Structure

Each product includes:

```json
{
  "id": "unique-product-id",
  "name_en": "English Name",
  "name_pl": "Polish Name", 
  "description_en": "English Description",
  "description_pl": "Polish Description",
  "price": 299.99,
  "currency": "EUR",
  "category": "portable-solar",
  "images": ["image1.jpg", "image2.jpg"],
  "specs": { "power": "100W", "voltage": "12V" },
  "in_stock": true,
  "featured": true
}
```

## 🚀 Deployment

### Frontend (Vercel)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `mini-launch` branch

2. **Environment Variables**
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Set `VITE_API_URL` to your backend URL

3. **Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Deploy**
   - Click Deploy
   - Your store will be live at `https://your-project.vercel.app`

### Backend (Render)

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository

2. **Environment Variables**
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   NODE_ENV=production
   PORT=10000
   ```

3. **Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `node-backend`

4. **Deploy**
   - Click Create Web Service
   - Your API will be live at `https://your-service.onrender.com`

## 🧪 Testing

### Local Testing

1. **Language Switch**
   - Verify EN/PL switching works
   - Check that product names/descriptions change
   - Ensure language preference is saved

2. **Product Loading**
   - Verify 3 products load from Supabase
   - Check images display correctly
   - Test product details page

3. **Cart Functionality**
   - Add products to cart
   - Verify cart count updates
   - Test cart page navigation

### Build Testing

```bash
# Test production build
npm run build

# Preview build locally
npm run preview
```

## 🔧 Troubleshooting

### Common Issues

1. **Products Not Loading**
   - Check Supabase credentials in `.env`
   - Verify products table exists
   - Run seeding script again

2. **Language Not Switching**
   - Clear browser localStorage
   - Check i18n configuration
   - Verify translation files

3. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify all imports are correct

### Debug Mode

Enable debug logging by adding to `.env`:
```env
VITE_DEBUG=true
```

## 📱 Mobile Responsiveness

The store is fully responsive and tested on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Security Notes

- Supabase anon key is safe for client-side use
- No sensitive data is exposed
- API endpoints are protected by CORS
- Environment variables are properly prefixed with `VITE_`

## 📈 Future Enhancements

Potential additions for full launch:
- User authentication
- Payment processing
- Order management
- Admin panel
- Analytics tracking
- SEO optimization

## 🤝 Support

For issues or questions:
1. Check this README
2. Review Supabase documentation
3. Check Vercel/Render deployment logs
4. Open GitHub issue

## 📄 License

This project is licensed under the ISC License.

---

**Happy Launching! 🚀**
