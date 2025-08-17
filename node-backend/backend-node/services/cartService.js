const { supabase } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

class CartService {
    /**
     * Get or create user cart
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Cart object
     */
    async getUserCart(userId) {
        try {
            // Try to get existing cart
            let { data: cart, error } = await supabase
                .from('cart_items')
                .select(`
                    *,
                    products(
                        id,
                        name,
                        sku,
                        price,
                        stock_quantity,
                        product_images(url, alt_text),
                        product_variants(id, price, stock_quantity, attributes)
                    )
                `)
                .eq('user_id', userId);

            if (error) throw error;

            // If no cart exists, create one
            if (!cart || cart.length === 0) {
                return {
                    id: uuidv4(),
                    user_id: userId,
                    items: [],
                    total: 0,
                    item_count: 0,
                    created_at: new Date().toISOString()
                };
            }

            // Calculate cart totals
            const cartData = this.calculateCartTotals(cart);
            return cartData;

        } catch (error) {
            console.error('❌ Failed to get user cart:', error);
            throw error;
        }
    }

    /**
     * Add item to cart
     * @param {string} userId - User ID
     * @param {Object} itemData - Item data
     * @returns {Promise<Object>} Updated cart
     */
    async addToCart(userId, itemData) {
        try {
            const { product_id, quantity = 1, variant_id = null, attributes = {} } = itemData;

            // Validate product exists and has stock
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('id, name, price, stock_quantity, product_variants(id, price, stock_quantity)')
                .eq('id', product_id)
                .single();

            if (productError || !product) {
                throw new Error('Product not found');
            }

            // Check stock availability
            let availableStock = product.stock_quantity;
            let itemPrice = product.price;

            if (variant_id) {
                const variant = product.product_variants?.find(v => v.id === variant_id);
                if (variant) {
                    availableStock = variant.stock_quantity;
                    itemPrice = variant.price;
                }
            }

            if (availableStock < quantity) {
                throw new Error(`Insufficient stock. Available: ${availableStock}`);
            }

            // Check if item already exists in cart
            const { data: existingItem, error: existingError } = await supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', userId)
                .eq('product_id', product_id)
                .eq('variant_id', variant_id)
                .single();

            if (existingError && existingError.code !== 'PGRST116') {
                throw existingError;
            }

            let result;

            if (existingItem) {
                // Update existing item quantity
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > availableStock) {
                    throw new Error(`Cannot add ${quantity} more. Total would exceed available stock.`);
                }

                const { data: updatedItem, error: updateError } = await supabase
                    .from('cart_items')
                    .update({ 
                        quantity: newQuantity,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingItem.id)
                    .select()
                    .single();

                if (updateError) throw updateError;
                result = updatedItem;
            } else {
                // Add new item to cart
                const { data: newItem, error: insertError } = await supabase
                    .from('cart_items')
                    .insert({
                        user_id: userId,
                        product_id,
                        variant_id,
                        quantity,
                        price: itemPrice,
                        attributes,
                        created_at: new Date().toISOString()
                    })
                    .select()
                    .single();

                if (insertError) throw insertError;
                result = newItem;
            }

            // Return updated cart
            return await this.getUserCart(userId);

        } catch (error) {
            console.error('❌ Failed to add item to cart:', error);
            throw error;
        }
    }

    /**
     * Update cart item quantity
     * @param {string} userId - User ID
     * @param {string} itemId - Cart item ID
     * @param {number} quantity - New quantity
     * @returns {Promise<Object>} Updated cart
     */
    async updateCartItemQuantity(userId, itemId, quantity) {
        try {
            if (quantity <= 0) {
                // Remove item if quantity is 0 or negative
                return await this.removeFromCart(userId, itemId);
            }

            // Get current cart item
            const { data: cartItem, error: getError } = await supabase
                .from('cart_items')
                .select(`
                    *,
                    products(stock_quantity, product_variants(id, stock_quantity))
                `)
                .eq('id', itemId)
                .eq('user_id', userId)
                .single();

            if (getError || !cartItem) {
                throw new Error('Cart item not found');
            }

            // Check stock availability
            let availableStock = cartItem.products.stock_quantity;
            if (cartItem.variant_id) {
                const variant = cartItem.products.product_variants?.find(v => v.id === cartItem.variant_id);
                if (variant) {
                    availableStock = variant.stock_quantity;
                }
            }

            if (quantity > availableStock) {
                throw new Error(`Cannot set quantity to ${quantity}. Available stock: ${availableStock}`);
            }

            // Update quantity
            const { error: updateError } = await supabase
                .from('cart_items')
                .update({ 
                    quantity,
                    updated_at: new Date().toISOString()
                })
                .eq('id', itemId)
                .eq('user_id', userId);

            if (updateError) throw updateError;

            // Return updated cart
            return await this.getUserCart(userId);

        } catch (error) {
            console.error('❌ Failed to update cart item quantity:', error);
            throw error;
        }
    }

    /**
     * Remove item from cart
     * @param {string} userId - User ID
     * @param {string} itemId - Cart item ID
     * @returns {Promise<Object>} Updated cart
     */
    async removeFromCart(userId, itemId) {
        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', itemId)
                .eq('user_id', userId);

            if (error) throw error;

            // Return updated cart
            return await this.getUserCart(userId);

        } catch (error) {
            console.error('❌ Failed to remove item from cart:', error);
            throw error;
        }
    }

    /**
     * Clear user cart
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Empty cart
     */
    async clearCart(userId) {
        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', userId);

            if (error) throw error;

            return {
                id: uuidv4(),
                user_id: userId,
                items: [],
                total: 0,
                item_count: 0,
                created_at: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Failed to clear cart:', error);
            throw error;
        }
    }

    /**
     * Calculate cart totals
     * @param {Array} cartItems - Cart items
     * @returns {Object} Cart with totals
     */
    calculateCartTotals(cartItems) {
        let subtotal = 0;
        let tax = 0;
        let shipping = 0;
        let total = 0;
        let itemCount = 0;

        cartItems.forEach(item => {
            const itemTotal = (item.price || 0) * (item.quantity || 0);
            subtotal += itemTotal;
            itemCount += item.quantity || 0;
        });

        // Calculate tax (example: 8.5%)
        tax = subtotal * 0.085;

        // Calculate shipping (example: free over $50, otherwise $5.99)
        shipping = subtotal >= 50 ? 0 : 5.99;

        total = subtotal + tax + shipping;

        return {
            id: uuidv4(),
            user_id: cartItems[0]?.user_id,
            items: cartItems,
            subtotal: Math.round(subtotal * 100) / 100,
            tax: Math.round(tax * 100) / 100,
            shipping: Math.round(shipping * 100) / 100,
            total: Math.round(total * 100) / 100,
            item_count: itemCount,
            created_at: cartItems[0]?.created_at || new Date().toISOString()
        };
    }

    /**
     * Validate cart before checkout
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Validation result
     */
    async validateCartForCheckout(userId) {
        try {
            const cart = await this.getUserCart(userId);
            
            if (!cart.items || cart.items.length === 0) {
                return {
                    valid: false,
                    errors: ['Cart is empty']
                };
            }

            const errors = [];
            const warnings = [];

            // Check each item
            for (const item of cart.items) {
                const product = item.products;
                
                // Check if product still exists
                if (!product) {
                    errors.push(`Product ${item.product_id} no longer exists`);
                    continue;
                }

                // Check stock availability
                let availableStock = product.stock_quantity;
                if (item.variant_id) {
                    const variant = product.product_variants?.find(v => v.id === item.variant_id);
                    if (variant) {
                        availableStock = variant.stock_quantity;
                    }
                }

                if (item.quantity > availableStock) {
                    if (availableStock === 0) {
                        errors.push(`${product.name} is out of stock`);
                    } else {
                        errors.push(`${product.name}: requested ${item.quantity}, available ${availableStock}`);
                    }
                } else if (item.quantity === availableStock) {
                    warnings.push(`${product.name}: only ${availableStock} left in stock`);
                }

                // Check price changes
                const currentPrice = item.variant_id ? 
                    product.product_variants?.find(v => v.id === item.variant_id)?.price : 
                    product.price;
                
                if (currentPrice !== item.price) {
                    warnings.push(`${product.name}: price has changed from $${item.price} to $${currentPrice}`);
                }
            }

            return {
                valid: errors.length === 0,
                errors,
                warnings,
                cart: errors.length === 0 ? cart : null
            };

        } catch (error) {
            console.error('❌ Failed to validate cart for checkout:', error);
            throw error;
        }
    }

    /**
     * Get cart summary (for mini cart display)
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Cart summary
     */
    async getCartSummary(userId) {
        try {
            const cart = await this.getUserCart(userId);
            
            return {
                item_count: cart.item_count,
                total: cart.total,
                has_items: cart.item_count > 0
            };

        } catch (error) {
            console.error('❌ Failed to get cart summary:', error);
            return {
                item_count: 0,
                total: 0,
                has_items: false
            };
        }
    }

    /**
     * Merge guest cart with user cart (for guest checkout)
     * @param {string} userId - User ID
     * @param {Array} guestCartItems - Guest cart items
     * @returns {Promise<Object>} Merged cart
     */
    async mergeGuestCart(userId, guestCartItems) {
        try {
            if (!guestCartItems || guestCartItems.length === 0) {
                return await this.getUserCart(userId);
            }

            // Add each guest cart item to user cart
            for (const item of guestCartItems) {
                await this.addToCart(userId, {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    variant_id: item.variant_id,
                    attributes: item.attributes
                });
            }

            return await this.getUserCart(userId);

        } catch (error) {
            console.error('❌ Failed to merge guest cart:', error);
            throw error;
        }
    }
}

module.exports = new CartService();
