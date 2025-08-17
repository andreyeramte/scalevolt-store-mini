const { supabase } = require('../config/supabase');
const fs = require('fs').promises;
const path = require('path');

class SEOService {
    constructor() {
        this.baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';
        this.sitemapPath = path.join(__dirname, '../public/sitemap.xml');
        this.robotsPath = path.join(__dirname, '../public/robots.txt');
    }

    /**
     * Generate meta tags for a page
     * @param {Object} pageData - Page data
     * @returns {Object} Meta tags object
     */
    generateMetaTags(pageData) {
        const {
            title,
            description,
            keywords = [],
            image = null,
            url = null,
            type = 'website',
            author = 'ScaleVolt Store',
            publishedTime = null,
            modifiedTime = null
        } = pageData;

        const metaTags = {
            // Basic meta tags
            title: title || 'ScaleVolt Store - Premium Electronics & Gadgets',
            description: description || 'Discover the latest electronics, gadgets, and tech accessories at ScaleVolt Store. Quality products, competitive prices, and excellent customer service.',
            keywords: keywords.join(', '),
            author,
            robots: 'index, follow',
            viewport: 'width=device-width, initial-scale=1.0',
            charset: 'UTF-8',

            // Open Graph tags
            'og:title': title,
            'og:description': description,
            'og:type': type,
            'og:url': url || this.baseUrl,
            'og:site_name': 'ScaleVolt Store',
            'og:locale': 'en_US',

            // Twitter Card tags
            'twitter:card': 'summary_large_image',
            'twitter:site': '@scalevolt_store',
            'twitter:title': title,
            'twitter:description': description,

            // Additional meta tags
            'theme-color': '#2c3e50',
            'msapplication-TileColor': '#2c3e50',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'default'
        };

        // Add image if provided
        if (image) {
            metaTags['og:image'] = image;
            metaTags['twitter:image'] = image;
            metaTags['image'] = image;
        }

        // Add article specific tags
        if (type === 'article' && publishedTime) {
            metaTags['article:published_time'] = publishedTime;
            metaTags['og:article:published_time'] = publishedTime;
        }

        if (type === 'article' && modifiedTime) {
            metaTags['article:modified_time'] = modifiedTime;
            metaTags['og:article:modified_time'] = modifiedTime;
        }

        return metaTags;
    }

    /**
     * Generate structured data for products
     * @param {Object} product - Product data
     * @returns {Object} Structured data object
     */
    generateProductStructuredData(product) {
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            sku: product.sku,
            brand: {
                '@type': 'Brand',
                name: product.brand || 'ScaleVolt Store'
            },
            category: product.category_name,
            offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'USD',
                availability: product.stock_quantity > 0 ? 
                    'https://schema.org/InStock' : 
                    'https://schema.org/OutOfStock',
                seller: {
                    '@type': 'Organization',
                    name: 'ScaleVolt Store'
                }
            }
        };

        // Add images if available
        if (product.product_images && product.product_images.length > 0) {
            structuredData.image = product.product_images.map(img => img.url);
        }

        // Add aggregate rating if available
        if (product.average_rating && product.review_count) {
            structuredData.aggregateRating = {
                '@type': 'AggregateRating',
                ratingValue: product.average_rating,
                reviewCount: product.review_count
            };
        }

        // Add reviews if available
        if (product.reviews && product.reviews.length > 0) {
            structuredData.review = product.reviews.slice(0, 5).map(review => ({
                '@type': 'Review',
                author: {
                    '@type': 'Person',
                    name: review.author_name || 'Anonymous'
                },
                reviewRating: {
                    '@type': 'Rating',
                    ratingValue: review.rating
                },
                reviewBody: review.comment
            }));
        }

        return structuredData;
    }

    /**
     * Generate structured data for organization
     * @returns {Object} Organization structured data
     */
    generateOrganizationStructuredData() {
        return {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ScaleVolt Store',
            url: this.baseUrl,
            logo: `${this.baseUrl}/logo.png`,
            description: 'Premium electronics and gadgets store offering quality products at competitive prices.',
            address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Tech Street',
                addressLocality: 'Tech City',
                addressRegion: 'TC',
                postalCode: '12345',
                addressCountry: 'US'
            },
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-555-123-4567',
                contactType: 'customer service',
                email: 'support@scalevolt.com'
            },
            sameAs: [
                'https://facebook.com/scalevoltstore',
                'https://twitter.com/scalevolt_store',
                'https://instagram.com/scalevoltstore'
            ]
        };
    }

    /**
     * Generate breadcrumb structured data
     * @param {Array} breadcrumbs - Breadcrumb items
     * @returns {Object} Breadcrumb structured data
     */
    generateBreadcrumbStructuredData(breadcrumbs) {
        return {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                item: item.url
            }))
        };
    }

    /**
     * Generate sitemap XML
     * @returns {Promise<string>} Sitemap XML content
     */
    async generateSitemap() {
        try {
            let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

            // Add static pages
            const staticPages = [
                { url: '/', priority: '1.0', changefreq: 'daily' },
                { url: '/products', priority: '0.9', changefreq: 'daily' },
                { url: '/categories', priority: '0.8', changefreq: 'weekly' },
                { url: '/about', priority: '0.6', changefreq: 'monthly' },
                { url: '/contact', priority: '0.6', changefreq: 'monthly' },
                { url: '/help', priority: '0.5', changefreq: 'monthly' }
            ];

            staticPages.forEach(page => {
                sitemap += `
  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
            });

            // Add category pages
            const { data: categories } = await supabase
                .from('categories')
                .select('slug, updated_at');

            if (categories) {
                categories.forEach(category => {
                    sitemap += `
  <url>
    <loc>${this.baseUrl}/category/${category.slug}</loc>
    <lastmod>${category.updated_at || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
                });
            }

            // Add product pages
            const { data: products } = await supabase
                .from('products')
                .select('sku, updated_at')
                .limit(1000); // Limit to prevent huge sitemaps

            if (products) {
                products.forEach(product => {
                    sitemap += `
  <url>
    <loc>${this.baseUrl}/product/${product.sku}</loc>
    <lastmod>${product.updated_at || new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
                });
            }

            sitemap += `
</urlset>`;

            return sitemap;

        } catch (error) {
            console.error('❌ Failed to generate sitemap:', error);
            throw error;
        }
    }

    /**
     * Save sitemap to file
     * @returns {Promise<void>}
     */
    async saveSitemap() {
        try {
            const sitemap = await this.generateSitemap();
            
            // Ensure public directory exists
            const publicDir = path.dirname(this.sitemapPath);
            await fs.mkdir(publicDir, { recursive: true });
            
            await fs.writeFile(this.sitemapPath, sitemap, 'utf8');
            console.log('✅ Sitemap saved successfully');

        } catch (error) {
            console.error('❌ Failed to save sitemap:', error);
            throw error;
        }
    }

    /**
     * Generate robots.txt content
     * @returns {string} Robots.txt content
     */
    generateRobotsTxt() {
        return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /products/
Allow: /categories/
Allow: /search

# Crawl delay (optional)
Crawl-delay: 1`;
    }

    /**
     * Save robots.txt to file
     * @returns {Promise<void>}
     */
    async saveRobotsTxt() {
        try {
            const robotsContent = this.generateRobotsTxt();
            
            // Ensure public directory exists
            const publicDir = path.dirname(this.robotsPath);
            await fs.mkdir(publicDir, { recursive: true });
            
            await fs.writeFile(this.robotsPath, robotsContent, 'utf8');
            console.log('✅ Robots.txt saved successfully');

        } catch (error) {
            console.error('❌ Failed to save robots.txt:', error);
            throw error;
        }
    }

    /**
     * Generate meta tags for product listing page
     * @param {Object} params - Page parameters
     * @returns {Object} Meta tags
     */
    generateProductListingMetaTags(params) {
        const { category, search, page, sortBy } = params;
        
        let title = 'Products';
        let description = 'Browse our extensive collection of quality products';

        if (category) {
            title = `${category.name} - Products`;
            description = `Discover amazing ${category.name.toLowerCase()} products at ScaleVolt Store. Quality guaranteed, competitive prices.`;
        } else if (search) {
            title = `Search Results for "${search}"`;
            description = `Find the best products matching "${search}" at ScaleVolt Store.`;
        }

        if (page > 1) {
            title += ` - Page ${page}`;
        }

        return this.generateMetaTags({
            title,
            description,
            keywords: ['products', 'shopping', 'online store', 'electronics', 'gadgets'],
            url: `${this.baseUrl}/products${category ? `?category=${category.slug}` : ''}${search ? `?search=${search}` : ''}`,
            type: 'website'
        });
    }

    /**
     * Generate meta tags for product detail page
     * @param {Object} product - Product data
     * @returns {Object} Meta tags
     */
    generateProductDetailMetaTags(product) {
        return this.generateMetaTags({
            title: `${product.name} - ScaleVolt Store`,
            description: product.description?.substring(0, 160) || `Buy ${product.name} at ScaleVolt Store. Quality guaranteed, competitive prices.`,
            keywords: [product.name, product.brand, product.category_name, 'electronics', 'gadgets'],
            image: product.product_images?.[0]?.url,
            url: `${this.baseUrl}/product/${product.sku}`,
            type: 'product',
            publishedTime: product.created_at,
            modifiedTime: product.updated_at
        });
    }

    /**
     * Update sitemap and robots.txt (for cron jobs)
     * @returns {Promise<void>}
     */
    async updateSEOFiles() {
        try {
            await Promise.all([
                this.saveSitemap(),
                this.saveRobotsTxt()
            ]);
            console.log('✅ SEO files updated successfully');
        } catch (error) {
            console.error('❌ Failed to update SEO files:', error);
            throw error;
        }
    }
}

module.exports = new SEOService();
