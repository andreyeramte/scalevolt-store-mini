# 🔄 SheetDB → Supabase Sync Guide

## Overview
This guide will help you sync your Google Sheets product data directly into Supabase using SheetDB as the bridge.

## Prerequisites
✅ **Supabase Connection**: Working (already verified)  
✅ **Database Tables**: Created (from previous setup)  
📋 **Google Sheet**: With your product data  
🔑 **SheetDB Account**: Free tier available  

## Step 1: Set Up SheetDB

### 1.1 Create SheetDB Account
1. **Go to SheetDB.io**: https://sheetdb.io/
2. **Sign up** for a free account
3. **Verify your email** if required

### 1.2 Connect Your Google Sheet
1. **Click "Create new API"**
2. **Choose "Google Sheets"** as data source
3. **Select your Google account** and authorize access
4. **Choose your product spreadsheet**
5. **Click "Create API"**

### 1.3 Get Your API Endpoint
After creation, you'll get an API endpoint like:
```
https://sheetdb.io/api/v1/abc123def456
```
**Save this URL** - you'll need it for the sync script.

## Step 2: Prepare Your Google Sheet

### 2.1 Required Columns
Your Google Sheet should have these columns (exact names not required, but recommended):

| Column Name | Description | Required | Example |
|-------------|-------------|----------|---------|
| SKU | Unique product identifier | ✅ | SOLAR-410W |
| Name | Product name | ✅ | Longi Solar Panel 410W |
| Description | Product description | ❌ | High-efficiency solar panel |
| Price | Product price | ✅ | 299.99 |
| Stock | Available quantity | ❌ | 50 |
| Brand | Product brand | ❌ | Longi |
| Category | Product category | ❌ | Solar Panels |
| Weight | Product weight | ❌ | 22.5 |

### 2.2 Optional Columns
- **Name UA**: Ukrainian name
- **Name PL**: Polish name  
- **Description UA**: Ukrainian description
- **Description PL**: Polish description
- **Original Price**: Before discount
- **Cost**: Your cost price
- **Images**: Comma-separated image URLs
- **Tags**: Comma-separated tags
- **Specifications**: JSON or text

### 2.3 Sample Data Format
```
SKU | Name | Description | Price | Brand | Category
-----|------|-------------|-------|-------|----------
SOLAR-410W | Longi Solar Panel 410W | High-efficiency... | 299.99 | Longi | Solar Panels
BAT-10KWH | Deye Battery 10.64kWh | LiFePO4 battery... | 2999.99 | Deye | Batteries
```

## Step 3: Configure Environment

### 3.1 Update Your .env File
Add your SheetDB URL to your `.env` file:

```bash
# SheetDB API URL for Google Sheets sync
SHEETDB_URL=https://sheetdb.io/api/v1/abc123def456
```

### 3.2 Verify Configuration
Make sure your `.env` file has:
```bash
SUPABASE_URL=https://xkkiybeiktoqzbmlorja.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SHEETDB_URL=https://sheetdb.io/api/v1/your-api-key
```

## Step 4: Run the Sync

### 4.1 Test the Sync
```bash
node sync-sheetdb-to-supabase.js
```

### 4.2 What Happens During Sync
1. **Connection Test**: Verifies Supabase connection
2. **Data Fetch**: Pulls data from your Google Sheet via SheetDB
3. **Data Transformation**: Maps sheet columns to database fields
4. **Category Resolution**: Creates categories if they don't exist
5. **Data Insert**: Upserts products into Supabase
6. **Summary Report**: Shows results and any errors

### 4.3 Expected Output
```
🔄 SheetDB → Supabase Sync Script
========================================
🔌 Testing Supabase connection...
✅ Supabase connection successful!

📥 Fetching data from SheetDB...
   URL: https://sheetdb.io/api/v1/abc123def456
   ✅ Found 25 products in SheetDB

🔄 Processing and transforming data...
   📋 Processing product 1/25: Longi Solar Panel 410W
   ✅ Transformed successfully
   📋 Processing product 2/25: Deye Battery 10.64kWh
   ✅ Transformed successfully
   ...

📊 Summary: 25 products ready, 0 errors

📤 Syncing to Supabase...
   ✅ Successfully synced 25 products to Supabase

📋 Sample of synced products:
   1. Longi Solar Panel 410W (SKU: SOLAR-410W) - $299.99
   2. Deye Battery 10.64kWh (SKU: BAT-10KWH) - $2999.99
   3. Deye Hybrid Inverter 10kW (SKU: INV-10KW) - $2499.99

🎉 Sync completed successfully!
📊 Total products in database: 25
```

## Step 5: Verify the Sync

### 5.1 Check Supabase Dashboard
1. **Go to Supabase Dashboard** → Table Editor
2. **Select "products" table**
3. **Verify your data** is there

### 5.2 Test Your Backend
```bash
npm run dev
```

Then test your API endpoints to see the products.

## Step 6: Schedule Regular Syncs

### 6.1 Manual Sync
Run the script whenever you update your Google Sheet:
```bash
node sync-sheetdb-to-supabase.js
```

### 6.2 Automated Sync (Optional)
You can set up automated syncs using:
- **GitHub Actions** (free)
- **Cloudflare Workers** (free tier)
- **Vercel Functions** (free tier)
- **Cron jobs** on your server

## Troubleshooting

### Common Issues

#### ❌ "Missing SheetDB URL"
**Problem**: SHEETDB_URL not set in .env
**Solution**: Add your SheetDB API endpoint to .env

#### ❌ "SheetDB request failed"
**Problem**: SheetDB API not accessible
**Solution**: 
- Check your SheetDB API is active
- Verify your Google Sheet is shared/public
- Check your SheetDB account status

#### ❌ "Supabase insert failed"
**Problem**: Database schema mismatch
**Solution**: 
- Run `node verify-database.js` to check tables
- Ensure all required tables exist
- Check table structure matches expected schema

#### ❌ "Category resolution failed"
**Problem**: Categories table doesn't exist
**Solution**: 
- Create database tables first using `setup-database-steps.md`
- Run `node verify-database.js` to confirm

### Data Mapping Issues

#### Column Names Not Recognized
The script automatically maps common column names, but if yours are different:

1. **Check the mapping** in `transformProductData()` function
2. **Add your column names** to the mapping object
3. **Or rename your columns** in Google Sheets to match

#### Data Type Issues
- **Numbers**: Ensure price/stock columns contain valid numbers
- **Booleans**: Use "true"/"false", "1"/"0", or "yes"/"no"
- **Arrays**: Separate multiple values with commas
- **JSON**: Use valid JSON format for specifications

## Advanced Features

### Custom Field Mapping
You can customize the field mapping by editing the `mapping` object in the script:

```javascript
const mapping = {
  'Your Column Name': 'database_field_name',
  'Custom Field': 'custom_field',
  // Add more mappings as needed
}
```

### Data Validation
The script includes basic validation:
- **Required fields**: SKU, Name, Price
- **Data types**: Automatic conversion where possible
- **Default values**: Set for missing optional fields

### Error Handling
- **Individual product errors** don't stop the entire sync
- **Detailed error reporting** for debugging
- **Summary report** shows success/failure counts

## Next Steps After Sync

1. **Verify Data**: Check products in Supabase Table Editor
2. **Test API**: Start your backend and test endpoints
3. **Connect Frontend**: Display products in your store
4. **Set Up Updates**: Plan regular sync schedule
5. **Monitor Performance**: Watch for sync issues

## Support

- **SheetDB Issues**: Check https://sheetdb.io/docs
- **Supabase Issues**: Check https://supabase.com/docs
- **Script Issues**: Review error messages and check configuration

---

**🎉 You're now ready to sync your Google Sheets data to Supabase!**
