const cron = require('node-cron');
const seoService = require('./seoService');
const syncService = require('./sync-sheetdb-to-supabase');
const { supabase } = require('../config/supabase');

class CronService {
    constructor() {
        this.jobs = new Map();
        this.enabled = process.env.ENABLE_CRON === 'true';
    }

    start() {
        if (!this.enabled) {
            console.log('⏰ Cron jobs disabled');
            return;
        }

        console.log('🚀 Starting cron jobs...');

        // Daily SEO update at 2 AM
        this.scheduleJob('seo-update', '0 2 * * *', async () => {
            console.log('📊 Updating SEO files...');
            try {
                await seoService.updateSEOFiles();
                console.log('✅ SEO files updated successfully');
            } catch (error) {
                console.error('❌ SEO update failed:', error);
            }
        });

        // Daily data sync at 3 AM
        this.scheduleJob('data-sync', '0 3 * * *', async () => {
            console.log('🔄 Starting daily data sync...');
            try {
                await syncService.syncProducts();
                console.log('✅ Daily data sync completed');
            } catch (error) {
                console.error('❌ Daily data sync failed:', error);
            }
        });

        // Database cleanup every Sunday at 4 AM
        this.scheduleJob('db-cleanup', '0 4 * * 0', async () => {
            console.log('🧹 Starting database cleanup...');
            try {
                await this.cleanupDatabase();
                console.log('✅ Database cleanup completed');
            } catch (error) {
                console.error('❌ Database cleanup failed:', error);
            }
        });

        // Analytics aggregation every hour
        this.scheduleJob('analytics-aggregation', '0 * * * *', async () => {
            console.log('📈 Aggregating analytics data...');
            try {
                await this.aggregateAnalytics();
                console.log('✅ Analytics aggregation completed');
            } catch (error) {
                console.error('❌ Analytics aggregation failed:', error);
            }
        });

        console.log('✅ All cron jobs scheduled');
    }

    scheduleJob(name, schedule, task) {
        if (this.jobs.has(name)) {
            this.jobs.get(name).stop();
        }

        const job = cron.schedule(schedule, task, {
            scheduled: true,
            timezone: 'UTC'
        });

        this.jobs.set(name, job);
        console.log(`⏰ Scheduled job: ${name} (${schedule})`);
    }

    stopJob(name) {
        const job = this.jobs.get(name);
        if (job) {
            job.stop();
            this.jobs.delete(name);
            console.log(`⏹️ Stopped job: ${name}`);
        }
    }

    stopAll() {
        this.jobs.forEach((job, name) => {
            job.stop();
            console.log(`⏹️ Stopped job: ${name}`);
        });
        this.jobs.clear();
    }

    async cleanupDatabase() {
        try {
            // Clean up old logs (older than 90 days)
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

            const { error: logsError } = await supabase
                .from('admin_logs')
                .delete()
                .lt('created_at', ninetyDaysAgo.toISOString());

            if (logsError) throw logsError;

            // Clean up old import logs (older than 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { error: importError } = await supabase
                .from('import_logs')
                .delete()
                .lt('created_at', thirtyDaysAgo.toISOString());

            if (importError) throw importError;

            console.log('🧹 Database cleanup completed');

        } catch (error) {
            console.error('❌ Database cleanup failed:', error);
            throw error;
        }
    }

    async aggregateAnalytics() {
        try {
            // Aggregate hourly analytics data
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            // Get page views for the last hour
            const { data: pageViews, error: pvError } = await supabase
                .from('analytics_page_views')
                .select('*')
                .gte('timestamp', oneHourAgo.toISOString())
                .lt('timestamp', now.toISOString());

            if (pvError) throw pvError;

            // Get events for the last hour
            const { data: events, error: eventsError } = await supabase
                .from('analytics_events')
                .select('*')
                .gte('timestamp', oneHourAgo.toISOString())
                .lt('timestamp', now.toISOString());

            if (eventsError) throw eventsError;

            // Calculate hourly metrics
            const hourlyMetrics = {
                timestamp: oneHourAgo.toISOString(),
                page_views: pageViews?.length || 0,
                events: events?.length || 0,
                unique_users: new Set([
                    ...(pageViews?.map(pv => pv.user_id).filter(Boolean) || []),
                    ...(events?.map(ev => ev.user_id).filter(Boolean) || [])
                ]).size,
                revenue: events
                    ?.filter(e => e.event_name === 'purchase')
                    .reduce((sum, e) => sum + (e.value || 0), 0) || 0
            };

            // Store hourly metrics
            const { error: insertError } = await supabase
                .from('analytics_hourly_metrics')
                .insert(hourlyMetrics);

            if (insertError) throw insertError;

            console.log('📊 Hourly analytics aggregated');

        } catch (error) {
            console.error('❌ Analytics aggregation failed:', error);
            throw error;
        }
    }

    getJobStatus() {
        const status = {};
        this.jobs.forEach((job, name) => {
            status[name] = {
                running: job.running,
                nextRun: job.nextDate ? job.nextDate().toISOString() : null
            };
        });
        return status;
    }
}

module.exports = new CronService();
