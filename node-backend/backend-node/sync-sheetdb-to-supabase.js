import fetch from 'node-fetch';
import 'dotenv/config'; // loads .env variables

const SHEETDB_URL = process.env.SHEETDB_URL;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

async function syncProducts() {
  try {
    // 1. Get data from Google Sheets via SheetDB
    const sheetRes = await fetch(SHEETDB_URL);
    const products = await sheetRes.json();

    // 2. Push into Supabase
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(products)
    });

    console.log('Sync complete:', await res.text());
  } catch (error) {
    console.error('Error syncing products:', error);
  }
}

syncProducts();
