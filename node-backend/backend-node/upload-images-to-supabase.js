// upload-images-to-supabase.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'product-images';
const FOLDER = process.env.SUPABASE_UPLOAD_FOLDER || 'products';
const LOCAL_DIR = path.join(__dirname, '../out-images'); // adjust

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

(async () => {
  const files = fs.readdirSync(LOCAL_DIR).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));
  for (const file of files) {
    const filePath = path.join(LOCAL_DIR, file);
    const dest = `${FOLDER}/${file.replace(/\s+/g,'-')}`;
    const body = fs.readFileSync(filePath);
    console.log('Uploading', file, '->', dest);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(dest, body, { contentType: 'image/webp', upsert: true, cacheControl: 'public, max-age=31536000' });

    if (error) {
      console.error('Upload error for', file, error.message);
      continue;
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(dest)}`;
    console.log('Uploaded ->', publicUrl);

    // OPTIONAL: upsert product row image_url using SKU parsed from filename (customize)
    const sku = file.split('-')[0]; // example naming: SKU-800.webp
    if (sku) {
      const { data: upsertData, error: upsertErr } = await supabase
        .from('products')
        .upsert([{ sku, image_url: publicUrl }], { onConflict: 'sku' });
      if (upsertErr) console.error('Upsert image_url error for', sku, upsertErr.message);
    }
  }
  console.log('Done');
})();
