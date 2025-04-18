const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://scalevoltstore.com';
const REGIONS = ['ua', 'pl', 'en'];

const routes = [
  '',
  'solar-panels',
  'batteries',
  'inverters',
  'mounting-systems',
  'dc-charging-stations',
  'ac-charging-stations',
  'portable-charging-devices',
  'lifts-and-cranes',
  'lifts-and-cranes/scissor-lifts',
  'lifts-and-cranes/boom-lifts',
  'admin/translations',
  'cables-wires',
  'sets-of-solar-power-plants',
  'портативна-електростанція',
  'auth',
  'cart',
  'checkout',
  'checkout/success',
  'checkout/cancel',
  'checkout/auth',
  'delivery-warranty-returns',
  'portable-solar-panels',
  'profile',
  'generators',
  'industrial-generators',
  'solar-lighting-towers',
  'company',
  'privacy-policy',
  'legal-terms',
  'faq'
];

function generateSitemapEntries() {
  const urls = [];

  REGIONS.forEach(region => {
    routes.forEach(route => {
      urls.push({
        loc: `${BASE_URL}/${region}/${route}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: route === '' ? 1.0 : 0.8
      });
    });
  });

  return urls;
}

function buildXml(urls) {
  const urlSet = urls.map(url => {
    return `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlSet}
</urlset>`;
}

// Generate XML
const sitemapXml = buildXml(generateSitemapEntries());

// ✅ Corrected path to public/sitemap.xml
const outputPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');

// Write file
fs.writeFileSync(outputPath, sitemapXml);
console.log(`✅ sitemap.xml created at ${outputPath}`);



// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const BASE_URL = 'https://scalevoltstore.com';
const REGIONS = ['ua', 'pl', 'en'];

const STATIC_ROUTES = [ /* как у тебя раньше */ ];

async function getDynamicRoutes() {
  const client = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'your_db',
    password: 'your_password',
    port: 5432,
  });

  await client.connect();

  const productResult = await client.query('SELECT id FROM products');
  const categoryResult = await client.query('SELECT id FROM categories');

  const products = productResult.rows.map(row => `product/${row.id}`);
  const categories = categoryResult.rows.map(row => `category/${row.id}`);

  await client.end();

  return [...products, ...categories];
}

async function generate() {
  const dynamicRoutes = await getDynamicRoutes();

  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

  const urls = [];

  REGIONS.forEach(region => {
    allRoutes.forEach(route => {
      urls.push({
        loc: `${BASE_URL}/${region}/${route}`,
        changefreq: 'weekly',
        priority: route === '' ? 1.0 : 0.8
      });
    });
  });

  const urlSet = urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlSet}
</urlset>`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml);
  console.log(`✅ sitemap.xml created at ${outputPath}`);
}

generate();
