import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  console.error('Please add:')
  console.error('SUPABASE_URL=your_supabase_url')
  console.error('SUPABASE_ANON_KEY=your_supabase_anon_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Read mini products data
const miniProductsPath = path.join(__dirname, '..', 'data', 'mini-products.json')
const miniProducts = JSON.parse(fs.readFileSync(miniProductsPath, 'utf8'))

async function seedMiniProducts() {
  console.log('🚀 Starting to seed mini products...')
  
  try {
    // Check if products table exists and has the right structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Error accessing products table:', tableError.message)
      console.error('Please ensure the products table exists in your Supabase database')
      process.exit(1)
    }
    
    console.log('✅ Products table accessible')
    
    // Transform data for Supabase insertion
    const productsToInsert = miniProducts.map(product => ({
      id: product.id,
      name_en: product.name_en,
      name_pl: product.name_pl,
      description_en: product.description_en,
      description_pl: product.description_pl,
      price: product.price,
      currency: product.currency,
      category: product.category,
      images: product.images,
      specs: product.specs,
      in_stock: product.in_stock,
      featured: product.featured,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
    
    console.log(`📦 Preparing to insert ${productsToInsert.length} products...`)
    
    // Insert products with upsert (insert or update if exists)
    const { data, error } = await supabase
      .from('products')
      .upsert(productsToInsert, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
    
    if (error) {
      console.error('❌ Error inserting products:', error.message)
      process.exit(1)
    }
    
    console.log('✅ Successfully seeded mini products!')
    console.log(`📊 Inserted/Updated ${productsToInsert.length} products`)
    
    // Verify the insertion
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('id, name_en, category')
      .in('id', productsToInsert.map(p => p.id))
    
    if (verifyError) {
      console.error('❌ Error verifying products:', verifyError.message)
    } else {
      console.log('🔍 Verification - Products in database:')
      verifyData.forEach(product => {
        console.log(`  - ${product.id}: ${product.name_en} (${product.category})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

// Run the seeding
seedMiniProducts()
  .then(() => {
    console.log('🎉 Mini products seeding completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error.message)
    process.exit(1)
  })
