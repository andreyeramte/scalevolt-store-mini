# 🚀 Supabase Setup Guide for ScaleVolt Store

## Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in or create account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `scalevolt-store`
   - Enter database password (save this!)
   - Choose region (closest to your users)
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see "Project is ready" when done

## Step 2: Get Your Credentials

1. **Go to Settings > API**
   - Copy the "Project URL" (looks like: `https://abc123.supabase.co`)
   - Copy the "anon public" key (starts with `eyJ...`)
   - Copy the "service_role" key (starts with `eyJ...`)

2. **Go to Settings > Database**
   - Copy the database connection string if needed

## Step 3: Create Environment File

Create a file named `.env` in this directory with:

```bash
# Supabase Configuration
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Server Configuration
PORT=4242
ADMIN_PORT=3001
NODE_ENV=development

# Other settings
JWT_SECRET=your-jwt-secret-key-here
CORS_ORIGINS=http://localhost:5179,http://localhost:5178,http://localhost:5177,http://localhost:3000,http://localhost:4242
UPLOAD_DIR=./uploads
```

**Replace the placeholder values with your actual credentials!**

## Step 4: Test Connection

1. **Quick Test:**
   ```bash
   node test-connection.js
   ```

2. **Full Setup:**
   ```bash
   node supabase-setup.js
   ```

## Step 5: Verify Success

✅ **Connection successful** = Supabase is working!
✅ **Schema created** = Database is ready!
✅ **Data retrieved** = Everything is functional!

## Troubleshooting

- **"Missing credentials"** → Check your `.env` file
- **"Connection failed"** → Verify your URL and keys
- **"Table not found"** → Run the full setup script
- **"Fetch failed"** → The script handles this automatically

## Next Steps

Once connection is working:
1. Your backend can use Supabase for data
2. Frontend can connect via the anon key
3. Admin operations use the service role key
4. You're ready to migrate from Firebase!

---

**Need help?** Check the Supabase docs: https://supabase.com/docs
