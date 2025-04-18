// Path: src/api/order/controllers/order.js
'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  // Override the default findOne method to check if the order belongs to the authenticated user
  async findOne(ctx) {
    const { id } = ctx.params;
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to access this order');
    }
    
    // Find the order
    const order = await strapi.db.query('api::order.order').findOne({
      where: { id },
      populate: {
        user: true,
      },
    });
    
    // Check if the order exists and belongs to the user
    if (!order) {
      return ctx.notFound('Order not found');
    }
    
    if (order.user && order.user.id !== user.id) {
      return ctx.forbidden('You do not have permission to access this order');
    }
    
    // Continue with the regular findOne logic to return the full populated order
    return super.findOne(ctx);
  },
  
  // Override find method to only return orders belonging to the authenticated user
  async find(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to access your orders');
    }
    
    // Set a filter to only find orders belonging to the authenticated user
    ctx.query = {
      ...ctx.query,
      filters: {
        ...(ctx.query.filters || {}),
        user: user.id,
      },
    };
    
    // Continue with the regular find logic
    return super.find(ctx);
  },
  
  // Create a new order
  async create(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('You must be logged in to create an order');
    }
    
    // Get the request body
    const { items, shippingAddress, billingAddress, ...orderData } = ctx.request.body.data;
    
    try {
      // Start a transaction
      const result = await strapi.db.transaction(async ({ commit, rollback }) => {
        try {
          // Create the shipping address if provided
          let shippingAddressId = null;
          if (shippingAddress) {
            const createdShippingAddress = await strapi.entityService.create('api::address.address', {
              data: {
                ...shippingAddress,
                user: user.id,
              },
            });
            shippingAddressId = createdShippingAddress.id;
          }
          
          // Create the billing address if provided
          let billingAddressId = null;
          if (billingAddress) {
            // Check if billing is same as shipping
            if (billingAddress.sameAsShipping && shippingAddressI