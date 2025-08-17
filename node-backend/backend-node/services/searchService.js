const { supabase } = require('../config/supabase');

class SearchService {
    /**
     * Advanced product search with filters and sorting
     * @param {Object} searchParams - Search parameters
     * @returns {Promise<Object>} Search results
     */
    async searchProducts(searchParams) {
        try {
            const {
                query = '',
                category = null,
                minPrice = null,
                maxPrice = null,
                inStock = null,
                sortBy = 'created_at',
                sortOrder = 'desc',
                page = 1,
                limit = 20,
                tags = [],
                brand = null,
                rating = null
            } = searchParams;

            let queryBuilder = supabase
                .from('products')
                .select(`
                    *,
                    categories(name, slug),
                    product_images(url, alt_text),
                    product_variants(price, stock_quantity, attributes)
                `);

            // Text search
            if (query && query.trim()) {
                const searchTerms = query.trim().split(' ').filter(term => term.length > 0);
                const searchConditions = searchTerms.map(term => 
                    `or(name.ilike.%${term}%,description.ilike.%${term}%,sku.ilike.%${term}%)`
                ).join(',');
                
                queryBuilder = queryBuilder.or(searchConditions);
            }

            // Category filter
            if (category) {
                queryBuilder = queryBuilder.eq('categories.slug', category);
            }

            // Price range filter
            if (minPrice !== null || maxPrice !== null) {
                if (minPrice !== null && maxPrice !== null) {
                    queryBuilder = queryBuilder.gte('price', minPrice).lte('price', maxPrice);
                } else if (minPrice !== null) {
                    queryBuilder = queryBuilder.gte('price', minPrice);
                } else if (maxPrice !== null) {
                    queryBuilder = queryBuilder.lte('price', maxPrice);
                }
            }

            // Stock filter
            if (inStock !== null) {
                if (inStock) {
                    queryBuilder = queryBuilder.gt('stock_quantity', 0);
                } else {
                    queryBuilder = queryBuilder.eq('stock_quantity', 0);
                }
            }

            // Tags filter
            if (tags && tags.length > 0) {
                queryBuilder = queryBuilder.overlaps('tags', tags);
            }

            // Brand filter
            if (brand) {
                queryBuilder = queryBuilder.eq('brand', brand);
            }

            // Rating filter
            if (rating) {
                queryBuilder = queryBuilder.gte('average_rating', rating);
            }

            // Sorting
            const validSortFields = ['name', 'price', 'created_at', 'average_rating', 'stock_quantity'];
            const validSortOrders = ['asc', 'desc'];
            
            if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder)) {
                queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });
            }

            // Pagination
            const offset = (page - 1) * limit;
            queryBuilder = queryBuilder.range(offset, offset + limit - 1);

            const { data: products, error, count } = await queryBuilder;

            if (error) {
                throw error;
            }

            // Process and enhance results
            const enhancedProducts = products.map(product => ({
                ...product,
                searchScore: this.calculateSearchScore(product, query),
                availability: product.stock_quantity > 0 ? 'in_stock' : 'out_of_stock',
                priceRange: this.calculatePriceRange(product.product_variants, product.price)
            }));

            // Sort by search relevance if query exists
            if (query && query.trim()) {
                enhancedProducts.sort((a, b) => b.searchScore - a.searchScore);
            }

            return {
                products: enhancedProducts,
                pagination: {
                    page,
                    limit,
                    total: count || enhancedProducts.length,
                    totalPages: Math.ceil((count || enhancedProducts.length) / limit)
                },
                filters: {
                    applied: {
                        query,
                        category,
                        minPrice,
                        maxPrice,
                        inStock,
                        tags,
                        brand,
                        rating
                    },
                    available: await this.getAvailableFilters()
                }
            };

        } catch (error) {
            console.error('❌ Search failed:', error);
            throw error;
        }
    }

    /**
     * Calculate search relevance score
     * @param {Object} product - Product object
     * @param {string} query - Search query
     * @returns {number} Search score
     */
    calculateSearchScore(product, query) {
        if (!query || !query.trim()) return 0;

        const searchTerms = query.toLowerCase().trim().split(' ');
        let score = 0;

        // Exact matches get highest score
        if (product.name.toLowerCase().includes(query.toLowerCase())) {
            score += 100;
        }

        if (product.sku.toLowerCase().includes(query.toLowerCase())) {
            score += 80;
        }

        // Partial matches
        searchTerms.forEach(term => {
            if (product.name.toLowerCase().includes(term)) {
                score += 50;
            }
            if (product.description.toLowerCase().includes(term)) {
                score += 30;
            }
            if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term))) {
                score += 20;
            }
        });

        // Boost for in-stock items
        if (product.stock_quantity > 0) {
            score += 10;
        }

        // Boost for highly rated products
        if (product.average_rating >= 4.5) {
            score += 15;
        }

        return score;
    }

    /**
     * Calculate price range for product variants
     * @param {Array} variants - Product variants
     * @param {number} basePrice - Base product price
     * @returns {Object} Price range
     */
    calculatePriceRange(variants, basePrice) {
        if (!variants || variants.length === 0) {
            return { min: basePrice, max: basePrice };
        }

        const prices = variants.map(v => v.price).filter(p => p !== null);
        if (prices.length === 0) {
            return { min: basePrice, max: basePrice };
        }

        return {
            min: Math.min(basePrice, ...prices),
            max: Math.max(basePrice, ...prices)
        };
    }

    /**
     * Get available filter options
     * @returns {Promise<Object>} Available filters
     */
    async getAvailableFilters() {
        try {
            const [
                categoriesResult,
                brandsResult,
                priceRangeResult,
                tagsResult
            ] = await Promise.all([
                supabase.from('categories').select('name, slug, product_count'),
                supabase.from('products').select('brand').not('brand', 'is', null),
                supabase.from('products').select('price'),
                supabase.from('products').select('tags').not('tags', 'is', null)
            ]);

            const brands = [...new Set(brandsResult.data?.map(p => p.brand).filter(Boolean) || [])];
            const prices = priceRangeResult.data?.map(p => p.price).filter(p => p !== null) || [];
            const allTags = tagsResult.data?.flatMap(p => p.tags || []).filter(Boolean) || [];

            return {
                categories: categoriesResult.data || [],
                brands: brands.sort(),
                priceRange: {
                    min: Math.min(...prices),
                    max: Math.max(...prices)
                },
                tags: [...new Set(allTags)].sort()
            };
        } catch (error) {
            console.error('❌ Failed to get available filters:', error);
            return {};
        }
    }

    /**
     * Search suggestions/autocomplete
     * @param {string} query - Partial search query
     * @param {number} limit - Number of suggestions
     * @returns {Promise<Array>} Search suggestions
     */
    async getSearchSuggestions(query, limit = 5) {
        try {
            if (!query || query.trim().length < 2) {
                return [];
            }

            const { data, error } = await supabase
                .from('products')
                .select('name, sku, categories(name)')
                .or(`name.ilike.%${query}%,sku.ilike.%${query}%`)
                .limit(limit);

            if (error) throw error;

            return data.map(item => ({
                text: item.name,
                sku: item.sku,
                category: item.categories?.name,
                type: 'product'
            }));

        } catch (error) {
            console.error('❌ Failed to get search suggestions:', error);
            return [];
        }
    }

    /**
     * Popular searches and trending products
     * @param {number} limit - Number of results
     * @returns {Promise<Object>} Popular searches and trending products
     */
    async getPopularSearches(limit = 10) {
        try {
            // Get trending products (most viewed, highest rated, etc.)
            const { data: trendingProducts, error: trendingError } = await supabase
                .from('products')
                .select('name, sku, average_rating, view_count')
                .order('view_count', { ascending: false })
                .limit(limit);

            if (trendingError) throw trendingError;

            // Get popular search terms (you'd need to implement search logging)
            const popularSearches = [
                'electronics', 'smartphone', 'laptop', 'headphones', 'camera',
                'gaming', 'fitness', 'home', 'kitchen', 'fashion'
            ];

            return {
                trendingProducts: trendingProducts || [],
                popularSearches: popularSearches.slice(0, limit)
            };

        } catch (error) {
            console.error('❌ Failed to get popular searches:', error);
            return { trendingProducts: [], popularSearches: [] };
        }
    }

    /**
     * Advanced filtering with multiple criteria
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} Filtered products
     */
    async filterProducts(filters) {
        try {
            let queryBuilder = supabase
                .from('products')
                .select('*');

            // Apply each filter
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    switch (key) {
                        case 'category_id':
                            queryBuilder = queryBuilder.eq('category_id', value);
                            break;
                        case 'price_min':
                            queryBuilder = queryBuilder.gte('price', value);
                            break;
                        case 'price_max':
                            queryBuilder = queryBuilder.lte('price', value);
                            break;
                        case 'brand':
                            queryBuilder = queryBuilder.eq('brand', value);
                            break;
                        case 'in_stock':
                            if (value) {
                                queryBuilder = queryBuilder.gt('stock_quantity', 0);
                            }
                            break;
                        case 'rating_min':
                            queryBuilder = queryBuilder.gte('average_rating', value);
                            break;
                        case 'tags':
                            if (Array.isArray(value)) {
                                queryBuilder = queryBuilder.overlaps('tags', value);
                            }
                            break;
                    }
                }
            });

            const { data, error } = await queryBuilder;

            if (error) throw error;
            return data || [];

        } catch (error) {
            console.error('❌ Product filtering failed:', error);
            throw error;
        }
    }
}

module.exports = new SearchService();
