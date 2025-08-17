const { Resend } = require('resend');
require('dotenv').config();

class EmailService {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@yourdomain.com';
        this.adminEmail = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
    }

    /**
     * Send order confirmation email
     * @param {Object} orderData - Order information
     * @param {Object} customerData - Customer information
     * @returns {Promise<Object>} Email result
     */
    async sendOrderConfirmation(orderData, customerData) {
        try {
            const orderItems = orderData.items.map(item => 
                `<tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>`
            ).join('');

            const emailContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Order Confirmation - ScaleVolt Store</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                        .total { font-size: 18px; font-weight: bold; text-align: right; }
                        .footer { text-align: center; padding: 20px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Order Confirmed!</h1>
                            <p>Thank you for your purchase</p>
                        </div>
                        
                        <div class="content">
                            <h2>Hello ${customerData.name},</h2>
                            <p>Your order has been successfully placed and confirmed.</p>
                            
                            <div class="order-details">
                                <h3>Order Details</h3>
                                <p><strong>Order ID:</strong> ${orderData.id}</p>
                                <p><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> ${orderData.status}</p>
                                
                                <h4>Items Ordered:</h4>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead>
                                        <tr style="background: #f0f0f0;">
                                            <th style="padding: 10px; text-align: left;">Item</th>
                                            <th style="padding: 10px; text-align: center;">Qty</th>
                                            <th style="padding: 10px; text-align: right;">Price</th>
                                            <th style="padding: 10px; text-align: right;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${orderItems}
                                    </tbody>
                                </table>
                                
                                <div class="total">
                                    <p>Subtotal: $${orderData.subtotal.toFixed(2)}</p>
                                    <p>Tax: $${orderData.tax.toFixed(2)}</p>
                                    <p>Shipping: $${orderData.shipping_cost.toFixed(2)}</p>
                                    <p style="font-size: 20px;">Total: $${orderData.total.toFixed(2)}</p>
                                </div>
                            </div>
                            
                            <p>We'll send you a shipping confirmation once your order ships.</p>
                            <p>If you have any questions, please contact our support team.</p>
                        </div>
                        
                        <div class="footer">
                            <p>ScaleVolt Store</p>
                            <p>Thank you for choosing us!</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const result = await this.resend.emails.send({
                from: this.fromEmail,
                to: customerData.email,
                subject: `Order Confirmation #${orderData.id} - ScaleVolt Store`,
                html: emailContent
            });

            console.log('✅ Order confirmation email sent:', result.id);
            return result;
        } catch (error) {
            console.error('❌ Failed to send order confirmation email:', error);
            throw error;
        }
    }

    /**
     * Send shipping confirmation email
     * @param {Object} orderData - Order information
     * @param {Object} customerData - Customer information
     * @param {Object} shippingData - Shipping information
     * @returns {Promise<Object>} Email result
     */
    async sendShippingConfirmation(orderData, customerData, shippingData) {
        try {
            const emailContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Your Order Has Shipped! - ScaleVolt Store</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .shipping-info { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                        .tracking { background: #e8f5e8; padding: 15px; border-radius: 5px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚚 Your Order Has Shipped!</h1>
                            <p>Track your package</p>
                        </div>
                        
                        <div class="content">
                            <h2>Hello ${customerData.name},</h2>
                            <p>Great news! Your order has been shipped and is on its way to you.</p>
                            
                            <div class="shipping-info">
                                <h3>Shipping Information</h3>
                                <p><strong>Order ID:</strong> ${orderData.id}</p>
                                <p><strong>Carrier:</strong> ${shippingData.carrier}</p>
                                <p><strong>Tracking Number:</strong> ${shippingData.tracking_number}</p>
                                <p><strong>Estimated Delivery:</strong> ${shippingData.estimated_delivery}</p>
                                
                                <div class="tracking">
                                    <a href="${shippingData.tracking_url}" style="background: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                        Track Package
                                    </a>
                                </div>
                            </div>
                            
                            <p>You'll receive another email when your package is delivered.</p>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; color: #666;">
                            <p>ScaleVolt Store</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const result = await this.resend.emails.send({
                from: this.fromEmail,
                to: customerData.email,
                subject: `Your Order Has Shipped! #${orderData.id}`,
                html: emailContent
            });

            console.log('✅ Shipping confirmation email sent:', result.id);
            return result;
        } catch (error) {
            console.error('❌ Failed to send shipping confirmation email:', error);
            throw error;
        }
    }

    /**
     * Send password reset email
     * @param {string} email - User email
     * @param {string} resetToken - Password reset token
     * @param {string} resetUrl - Password reset URL
     * @returns {Promise<Object>} Email result
     */
    async sendPasswordReset(email, resetToken, resetUrl) {
        try {
            const emailContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Password Reset - ScaleVolt Store</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .reset-button { background: #e74c3c; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔐 Password Reset Request</h1>
                        </div>
                        
                        <div class="content">
                            <h2>Hello,</h2>
                            <p>We received a request to reset your password for your ScaleVolt Store account.</p>
                            
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="reset-button">Reset Password</a>
                            </div>
                            
                            <div class="warning">
                                <p><strong>⚠️ Important:</strong></p>
                                <p>This link will expire in 1 hour for security reasons.</p>
                                <p>If you didn't request this password reset, please ignore this email.</p>
                            </div>
                            
                            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 3px;">
                                ${resetUrl}
                            </p>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; color: #666;">
                            <p>ScaleVolt Store</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const result = await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: 'Password Reset Request - ScaleVolt Store',
                html: emailContent
            });

            console.log('✅ Password reset email sent:', result.id);
            return result;
        } catch (error) {
            console.error('❌ Failed to send password reset email:', error);
            throw error;
        }
    }

    /**
     * Send admin notification email
     * @param {string} subject - Email subject
     * @param {string} message - Email message
     * @returns {Promise<Object>} Email result
     */
    async sendAdminNotification(subject, message) {
        try {
            const result = await this.resend.emails.send({
                from: this.fromEmail,
                to: this.adminEmail,
                subject: `[Admin] ${subject}`,
                html: `<p>${message}</p>`
            });

            console.log('✅ Admin notification email sent:', result.id);
            return result;
        } catch (error) {
            console.error('❌ Failed to send admin notification email:', error);
            throw error;
        }
    }

    /**
     * Send welcome email to new customers
     * @param {Object} customerData - Customer information
     * @returns {Promise<Object>} Email result
     */
    async sendWelcomeEmail(customerData) {
        try {
            const emailContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Welcome to ScaleVolt Store!</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: #3498db; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; background: #f9f9f9; }
                        .cta { background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Welcome to ScaleVolt Store!</h1>
                        </div>
                        
                        <div class="content">
                            <h2>Hello ${customerData.name},</h2>
                            <p>Welcome to ScaleVolt Store! We're excited to have you as part of our community.</p>
                            
                            <p>Here's what you can do with your new account:</p>
                            <ul>
                                <li>Browse our extensive product catalog</li>
                                <li>Save items to your wishlist</li>
                                <li>Track your orders</li>
                                <li>Manage your profile</li>
                                <li>Get exclusive member-only deals</li>
                            </ul>
                            
                            <div style="text-align: center;">
                                <a href="${process.env.FRONTEND_URL || 'https://yourdomain.com'}" class="cta">Start Shopping</a>
                            </div>
                            
                            <p>If you have any questions, our support team is here to help!</p>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; color: #666;">
                            <p>ScaleVolt Store</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const result = await this.resend.emails.send({
                from: this.fromEmail,
                to: customerData.email,
                subject: 'Welcome to ScaleVolt Store! 🎉',
                html: emailContent
            });

            console.log('✅ Welcome email sent:', result.id);
            return result;
        } catch (error) {
            console.error('❌ Failed to send welcome email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();
