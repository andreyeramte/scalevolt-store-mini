const { supabase } = require('../config/supabase');

class AnalyticsService {
    constructor() {
        this.ga4MeasurementId = process.env.GA4_MEASUREMENT_ID;
        this.ga4ApiSecret = process.env.GA4_API_SECRET;
        this.enableTracking = process.env.ENABLE_ANALYTICS === 'true';
    }

    /**
     * Track page view
     * @param {Object} pageData - Page view data
     * @returns {Promise<void>}
     */
    async trackPageView(pageData) {
        if (!this.enableTracking) return;

        try {
            const {
                page_title,
                page_location,
                page_referrer = '',
                user_id = null,
                session_id = null,
                user_agent = '',
                ip_address = null
            } = pageData;

            // Store page view in database for analytics
            await supabase
                .from('analytics_page_views')
                .insert({
                    page_title,
                    page_location,
                    page_referrer,
                    user_id,
                    session_id,
                    user_agent,
                    ip_address,
                    timestamp: new Date().toISOString()
                });

            // Send to GA4 if configured
            if (this.ga4MeasurementId && this.ga4ApiSecret) {
                await this.sendToGA4('page_view', {
                    page_title,
                    page_location,
                    page_referrer
                });
            }

            console.log('✅ Page view tracked:', page_title);

        } catch (error) {
            console.error('❌ Failed to track page view:', error);
        }
    }

    /**
     * Track e-commerce event
     * @param {Object} eventData - Event data
     * @returns {Promise<void>}
     */
    async trackEcommerceEvent(eventData) {
        if (!this.enableTracking) return;

        try {
            const {
                event_name,
                user_id = null,
                session_id = null,
                product_data = null,
                cart_data = null,
                order_data = null,
                value = null,
                currency = 'USD'
            } = eventData;

            // Store event in database
            await supabase
                .from('analytics_events')
                .insert({
                    event_name,
                    user_id,
                    session_id,
                    product_data,
                    cart_data,
                    order_data,
                    value,
                    currency,
                    timestamp: new Date().toISOString()
                });

            // Send to GA4 if configured
            if (this.ga4MeasurementId && this.ga4ApiSecret) {
                await this.sendToGA4(event_name, {
                    value,
                    currency,
                    items: product_data ? [product_data] : undefined
                });
            }

            console.log('✅ E-commerce event tracked:', event_name);

        } catch (error) {
            console.error('❌ Failed to track e-commerce event:', error);
        }
    }

    /**
     * Track product view
     * @param {Object} productData - Product data
     * @param {Object} userData - User data
     * @returns {Promise<void>}
     */
    async trackProductView(productData, userData = {}) {
        await this.trackEcommerceEvent({
            event_name: 'view_item',
            user_id: userData.id,
            session_id: userData.session_id,
            product_data: {
                item_id: productData.sku,
                item_name: productData.name,
                item_category: productData.category_name,
                item_brand: productData.brand,
                price: productData.price,
                currency: 'USD'
            },
            value: productData.price
        });
    }

    /**
     * Track add to cart
     * @param {Object} cartData - Cart data
     * @param {Object} userData - User data
     * @returns {Promise<void>}
     */
    async trackAddToCart(cartData, userData = {}) {
        await this.trackEcommerceEvent({
            event_name: 'add_to_cart',
            user_id: userData.id,
            session_id: userData.session_id,
            product_data: {
                item_id: cartData.product_sku,
                item_name: cartData.product_name,
                item_category: cartData.category_name,
                item_brand: cartData.brand,
                price: cartData.price,
                quantity: cartData.quantity,
                currency: 'USD'
            },
            cart_data: {
                cart_id: cartData.cart_id,
                cart_total: cartData.cart_total
            },
            value: cartData.price * cartData.quantity
        });
    }

    /**
     * Track purchase
     * @param {Object} orderData - Order data
     * @param {Object} userData - User data
     * @returns {Promise<void>}
     */
    async trackPurchase(orderData, userData = {}) {
        await this.trackEcommerceEvent({
            event_name: 'purchase',
            user_id: userData.id,
            session_id: userData.session_id,
            order_data: {
                transaction_id: orderData.id,
                value: orderData.total,
                tax: orderData.tax,
                shipping: orderData.shipping_cost,
                currency: 'USD'
            },
            value: orderData.total
        });
    }

    /**
     * Track search
     * @param {Object} searchData - Search data
     * @param {Object} userData - User data
     * @returns {Promise<void>}
     */
    async trackSearch(searchData, userData = {}) {
        await this.trackEcommerceEvent({
            event_name: 'search',
            user_id: userData.id,
            session_id: userData.session_id,
            product_data: {
                search_term: searchData.query,
                search_results: searchData.result_count
            }
        });
    }

    /**
     * Track user engagement
     * @param {Object} engagementData - Engagement data
     * @param {Object} userData - User data
     * @returns {Promise<void>}
     */
    async trackUserEngagement(engagementData, userData = {}) {
        try {
            const {
                engagement_type,
                duration = 0,
                scroll_depth = 0,
                interactions = 0
            } = engagementData;

            await supabase
                .from('analytics_user_engagement')
                .insert({
                    user_id: userData.id,
                    session_id: userData.session_id,
                    engagement_type,
                    duration,
                    scroll_depth,
                    interactions,
                    timestamp: new Date().toISOString()
                });

            console.log('✅ User engagement tracked:', engagement_type);

        } catch (error) {
            console.error('❌ Failed to track user engagement:', error);
        }
    }

    /**
     * Send event to Google Analytics 4
     * @param {string} eventName - Event name
     * @param {Object} parameters - Event parameters
     * @returns {Promise<void>}
     */
    async sendToGA4(eventName, parameters = {}) {
        if (!this.ga4MeasurementId || !this.ga4ApiSecret) {
            return;
        }

        try {
            const payload = {
                client_id: this.generateClientId(),
                events: [{
                    name: eventName,
                    params: parameters
                }]
            };

            const response = await fetch(
                `https://www.google-analytics.com/mp/collect?measurement_id=${this.ga4MeasurementId}&api_secret=${this.ga4ApiSecret}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error(`GA4 API error: ${response.status}`);
            }

        } catch (error) {
            console.error('❌ Failed to send to GA4:', error);
        }
    }

    /**
     * Generate client ID for GA4
     * @returns {string} Client ID
     */
    generateClientId() {
        // In a real implementation, this would be stored in user's browser
        // For now, generate a random one
        return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get analytics dashboard data
     * @param {Object} filters - Date and other filters
     * @returns {Promise<Object>} Dashboard data
     */
    async getAnalyticsDashboard(filters = {}) {
        try {
            const {
                start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                end_date = new Date(),
                user_id = null
            } = filters;

            // Get page views
            const { data: pageViews, error: pageViewsError } = await supabase
                .from('analytics_page_views')
                .select('*')
                .gte('timestamp', start_date.toISOString())
                .lte('timestamp', end_date.toISOString())
                .eq(user_id ? 'user_id' : 'id', user_id || '');

            if (pageViewsError) throw pageViewsError;

            // Get e-commerce events
            const { data: events, error: eventsError } = await supabase
                .from('analytics_events')
                .select('*')
                .gte('timestamp', start_date.toISOString())
                .lte('timestamp', end_date.toISOString())
                .eq(user_id ? 'user_id' : 'id', user_id || '');

            if (eventsError) throw eventsError;

            // Get user engagement
            const { data: engagement, error: engagementError } = await supabase
                .from('analytics_user_engagement')
                .select('*')
                .gte('timestamp', start_date.toISOString())
                .lte('timestamp', end_date.toISOString())
                .eq(user_id ? 'user_id' : 'id', user_id || '');

            if (engagementError) throw engagementError;

            // Calculate metrics
            const metrics = this.calculateMetrics(pageViews, events, engagement);

            return {
                period: {
                    start: start_date,
                    end: end_date
                },
                metrics,
                pageViews: pageViews || [],
                events: events || [],
                engagement: engagement || []
            };

        } catch (error) {
            console.error('❌ Failed to get analytics dashboard:', error);
            throw error;
        }
    }

    /**
     * Calculate analytics metrics
     * @param {Array} pageViews - Page views data
     * @param {Array} events - Events data
     * @param {Array} engagement - Engagement data
     * @returns {Object} Calculated metrics
     */
    calculateMetrics(pageViews, events, engagement) {
        const totalPageViews = pageViews?.length || 0;
        const totalEvents = events?.length || 0;
        const totalEngagement = engagement?.length || 0;

        // Calculate unique users
        const uniqueUsers = new Set([
            ...(pageViews?.map(pv => pv.user_id).filter(Boolean) || []),
            ...(events?.map(ev => ev.user_id).filter(Boolean) || [])
        ]).size;

        // Calculate e-commerce metrics
        const purchaseEvents = events?.filter(e => e.event_name === 'purchase') || [];
        const addToCartEvents = events?.filter(e => e.event_name === 'add_to_cart') || [];
        const viewItemEvents = events?.filter(e => e.event_name === 'view_item') || [];

        const totalRevenue = purchaseEvents.reduce((sum, event) => sum + (event.value || 0), 0);
        const conversionRate = totalPageViews > 0 ? (purchaseEvents.length / totalPageViews) * 100 : 0;

        // Calculate engagement metrics
        const avgDuration = engagement?.length > 0 ? 
            engagement.reduce((sum, eng) => sum + (eng.duration || 0), 0) / engagement.length : 0;

        const avgScrollDepth = engagement?.length > 0 ?
            engagement.reduce((sum, eng) => sum + (eng.scroll_depth || 0), 0) / engagement.length : 0;

        return {
            totalPageViews,
            totalEvents,
            totalEngagement,
            uniqueUsers,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            conversionRate: Math.round(conversionRate * 100) / 100,
            purchaseCount: purchaseEvents.length,
            addToCartCount: addToCartEvents.length,
            viewItemCount: viewItemEvents.length,
            avgDuration: Math.round(avgDuration * 100) / 100,
            avgScrollDepth: Math.round(avgScrollDepth * 100) / 100
        };
    }

    /**
     * Get top performing pages
     * @param {number} limit - Number of results
     * @param {Object} filters - Date filters
     * @returns {Promise<Array>} Top pages
     */
    async getTopPages(limit = 10, filters = {}) {
        try {
            const { start_date, end_date } = filters;

            let query = supabase
                .from('analytics_page_views')
                .select('page_title, page_location, count')
                .select('page_title, page_location')
                .order('count', { ascending: false })
                .limit(limit);

            if (start_date) {
                query = query.gte('timestamp', start_date.toISOString());
            }
            if (end_date) {
                query = query.lte('timestamp', end_date.toISOString());
            }

            const { data, error } = await query;

            if (error) throw error;

            // Group by page and count views
            const pageCounts = {};
            data?.forEach(pageView => {
                const key = pageView.page_location;
                pageCounts[key] = (pageCounts[key] || 0) + 1;
            });

            // Convert to array and sort
            const topPages = Object.entries(pageCounts)
                .map(([location, count]) => ({
                    page_location: location,
                    page_title: data.find(pv => pv.page_location === location)?.page_title || location,
                    views: count
                }))
                .sort((a, b) => b.views - a.views)
                .slice(0, limit);

            return topPages;

        } catch (error) {
            console.error('❌ Failed to get top pages:', error);
            return [];
        }
    }

    /**
     * Get conversion funnel data
     * @param {Object} filters - Date filters
     * @returns {Promise<Object>} Funnel data
     */
    async getConversionFunnel(filters = {}) {
        try {
            const { start_date, end_date } = filters;

            let query = supabase
                .from('analytics_events')
                .select('event_name, count')
                .in('event_name', ['view_item', 'add_to_cart', 'begin_checkout', 'purchase']);

            if (start_date) {
                query = query.gte('timestamp', start_date.toISOString());
            }
            if (end_date) {
                query = query.lte('timestamp', end_date.toISOString());
            }

            const { data, error } = await query;

            if (error) throw error;

            // Count events by type
            const eventCounts = {};
            data?.forEach(event => {
                eventCounts[event.event_name] = (eventCounts[event.event_name] || 0) + 1;
            });

            const funnel = {
                view_item: eventCounts['view_item'] || 0,
                add_to_cart: eventCounts['add_to_cart'] || 0,
                begin_checkout: eventCounts['begin_checkout'] || 0,
                purchase: eventCounts['purchase'] || 0
            };

            // Calculate conversion rates
            funnel.view_to_cart_rate = funnel.view_item > 0 ? 
                Math.round((funnel.add_to_cart / funnel.view_item) * 100 * 100) / 100 : 0;
            
            funnel.cart_to_checkout_rate = funnel.add_to_cart > 0 ? 
                Math.round((funnel.begin_checkout / funnel.add_to_cart) * 100 * 100) / 100 : 0;
            
            funnel.checkout_to_purchase_rate = funnel.begin_checkout > 0 ? 
                Math.round((funnel.purchase / funnel.begin_checkout) * 100 * 100) / 100 : 0;

            return funnel;

        } catch (error) {
            console.error('❌ Failed to get conversion funnel:', error);
            return {};
        }
    }
}

module.exports = new AnalyticsService();
