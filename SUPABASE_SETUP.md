# 🚀 ScaleVolt Store Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New project"
3. Choose your organization (create one if needed)
4. Enter project details:
   - Name: "ScaleVolt Store"
   - Database Password: Create a strong password
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - anon public key
   - service_role key (keep this secret!)

## Step 3: Update Environment Files

Update your .env files with the actual credentials:

### Frontend (.env in vue-frontend/)
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

### Backend (.env in node-backend/backend-node/)
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
```

## Step 4: Set Up Database Schema

1. Go to SQL Editor in your Supabase dashboard
2. Copy the entire content from `database-schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

## Step 5: Configure Authentication

1. Go to Authentication > Settings
2. Site URL: `http://localhost:5173` (for development)
3. Redirect URLs: Add your production URLs when deploying
4. Enable email authentication
5. Configure email templates if needed

## Step 6: Set Up Storage

1. Go to Storage in Supabase dashboard
2. Create the following buckets:
   - `product-images` (public)
   - `user-avatars` (public)
   - `category-images` (public)
3. Set up storage policies (included in schema)

## Step 7: Test the Connection

Run the test scripts:

```bash
# Backend test
cd node-backend/backend-node
node scripts/testSupabaseConnection.js

# Frontend test (in browser console after starting dev server)
cd vue-frontend
npm run dev
# Then in browser console:
import('./src/utils/testSupabaseConnection.js').then(m => m.testSupabaseConnection())
```

## Step 8: Start Development

```bash
# Start backend
cd node-backend/backend-node
npm start

# Start frontend (in new terminal)
cd vue-frontend
npm run dev
```

## Production Deployment

1. Update environment variables with production URLs
2. Set up proper domain in Supabase auth settings
3. Configure email templates for production
4. Set up proper backup and monitoring
5. Review and update RLS policies as needed

## Security Notes

- Never expose service_role key in frontend code
- Always use RLS policies to protect data
- Regularly rotate API keys
- Use environment variables for all secrets
- Enable 2FA on your Supabase account

## Support

If you encounter any issues:
1. Check Supabase logs in the dashboard
2. Verify environment variables are correct
3. Ensure database schema was applied successfully
4. Check browser console for frontend errors
5. Check server logs for backend errors
