const stripe = require('stripe');
require('dotenv').config();

class StripeService {
    constructor() {
        this.stripe = stripe(process.env.STRIPE_SECRET_KEY);
        this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    }

    /**
     * Create a payment intent for checkout
     * @param {Object} paymentData - Payment information
     * @param {number} amount - Amount in cents
     * @param {string} currency - Currency code (e.g., 'usd')
     * @param {string} customerEmail - Customer email
     * @returns {Promise<Object>} Payment intent
     */
    async createPaymentIntent(amount, currency = 'usd', customerEmail = null) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: currency,
                customer_email: customerEmail,
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    integration_check: 'accept_a_payment',
                }
            });

            console.log('✅ Payment intent created:', paymentIntent.id);
            return paymentIntent;
        } catch (error) {
            console.error('❌ Failed to create payment intent:', error);
            throw error;
        }
    }

    /**
     * Create a customer in Stripe
     * @param {Object} customerData - Customer information
     * @returns {Promise<Object>} Customer object
     */
    async createCustomer(customerData) {
        try {
            const customer = await this.stripe.customers.create({
                email: customerData.email,
                name: customerData.name,
                phone: customerData.phone,
                address: customerData.address,
                metadata: {
                    customer_id: customerData.id,
                    source: 'scalevolt_store'
                }
            });

            console.log('✅ Customer created:', customer.id);
            return customer;
        } catch (error) {
            console.error('❌ Failed to create customer:', error);
            throw error;
        }
    }

    /**
     * Create a checkout session
     * @param {Array} lineItems - Array of line items
     * @param {string} successUrl - Success redirect URL
     * @param {string} cancelUrl - Cancel redirect URL
     * @param {Object} customerData - Customer information
     * @returns {Promise<Object>} Checkout session
     */
    async createCheckoutSession(lineItems, successUrl, cancelUrl, customerData = null) {
        try {
            const sessionData = {
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
                customer_email: customerData?.email,
                metadata: {
                    order_id: customerData?.orderId,
                    customer_id: customerData?.id
                }
            };

            if (customerData?.id) {
                sessionData.customer = customerData.id;
            }

            const session = await this.stripe.checkout.sessions.create(sessionData);

            console.log('✅ Checkout session created:', session.id);
            return session;
        } catch (error) {
            console.error('❌ Failed to create checkout session:', error);
            throw error;
        }
    }

    /**
     * Process webhook events
     * @param {string} payload - Raw webhook payload
     * @param {string} signature - Webhook signature
     * @returns {Promise<Object>} Webhook event
     */
    async processWebhook(payload, signature) {
        try {
            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                this.webhookSecret
            );

            console.log('✅ Webhook processed:', event.type);
            return event;
        } catch (error) {
            console.error('❌ Webhook signature verification failed:', error);
            throw error;
        }
    }

    /**
     * Refund a payment
     * @param {string} paymentIntentId - Payment intent ID
     * @param {number} amount - Amount to refund in cents
     * @returns {Promise<Object>} Refund object
     */
    async refundPayment(paymentIntentId, amount = null) {
        try {
            const refundData = {
                payment_intent: paymentIntentId
            };

            if (amount) {
                refundData.amount = Math.round(amount * 100);
            }

            const refund = await this.stripe.refunds.create(refundData);

            console.log('✅ Refund processed:', refund.id);
            return refund;
        } catch (error) {
            console.error('❌ Failed to process refund:', error);
            throw error;
        }
    }

    /**
     * Get payment intent details
     * @param {string} paymentIntentId - Payment intent ID
     * @returns {Promise<Object>} Payment intent
     */
    async getPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return paymentIntent;
        } catch (error) {
            console.error('❌ Failed to retrieve payment intent:', error);
            throw error;
        }
    }

    /**
     * Create a subscription
     * @param {string} customerId - Customer ID
     * @param {string} priceId - Price ID for the subscription
     * @returns {Promise<Object>} Subscription object
     */
    async createSubscription(customerId, priceId) {
        try {
            const subscription = await this.stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand: ['latest_invoice.payment_intent'],
            });

            console.log('✅ Subscription created:', subscription.id);
            return subscription;
        } catch (error) {
            console.error('❌ Failed to create subscription:', error);
            throw error;
        }
    }
}

module.exports = new StripeService();
