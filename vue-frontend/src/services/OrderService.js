// src/services/OrderService.js
import axios from 'axios';
import qs from 'qs';

const API_URL = 'http://localhost:1337/api';

export default {
  async getUserOrders(userId, params = {}) {
    try {
      const defaultParams = {
        filters: {
          user: userId
        },
        populate: {
          items: {
            populate: ['product']
          },
          shippingAddress: true,
          billingAddress: true
        },
        sort: ['createdAt:desc'],
        pagination: {
          page: params.page || 1,
          pageSize: params.pageSize || 10
        }
      };

      const mergedParams = { ...defaultParams, ...params };
      const queryString = qs.stringify(mergedParams, { 
        encodeValuesOnly: true,
        arrayFormat: 'brackets',
        encode: false
      });

      const response = await axios.get(`${API_URL}/orders?${queryString}`);
      
      // Transform the response to a more convenient format for the frontend
      const transformedData = {
        data: response.data.data.map(order => {
          const attrs = order.attributes;
          return {
            id: order.id,
            orderNumber: attrs.orderNumber || `ORD-${order.id}`,
            status: attrs.status,
            createdAt: attrs.createdAt,
            updatedAt: attrs.updatedAt,
            shipping: attrs.shippingCost || 0,
            tax: attrs.tax || 0,
            total: attrs.total,
            paymentMethod: attrs.paymentMethod,
            paymentStatus: attrs.paymentStatus,
            shippingAddress: attrs.shippingAddress?.data?.attributes || {},
            billingAddress: attrs.billingAddress?.data?.attributes || {},
            items: attrs.items?.data?.map(item => {
              const itemAttrs = item.attributes;
              const product = itemAttrs.product?.data;
              
              return {
                id: item.id,
                productId: product?.id,
                name: itemAttrs.name || product?.attributes?.general_information?.name || 'Product',
                price: itemAttrs.price,
                quantity: itemAttrs.quantity,
                image: product?.attributes?.general_information?.images?.data?.[0]?.attributes?.url || null
              };
            }) || []
          };
        }),
        pagination: response.data.meta.pagination
      };

      return transformedData;
    } catch (error) {
      console.error('OrderService getUserOrders error:', error);
      throw error;
    }
  },

  async getOrderById(id, userId) {
    try {
      const params = {
        populate: {
          items: {
            populate: ['product']
          },
          shippingAddress: true,
          billingAddress: true,
          user: true
        }
      };

      const queryString = qs.stringify(params, { 
        encodeValuesOnly: true,
        arrayFormat: 'brackets'
      });

      const response = await axios.get(`${API_URL}/orders/${id}?${queryString}`);
      
      // Verify that this order belongs to the user
      const orderUserId = response.data.data.attributes.user?.data?.id;
      if (orderUserId && orderUserId !== userId) {
        throw new Error('Unauthorized: This order does not belong to the current user');
      }

      // Transform the response
      const order = response.data.data;
      const attrs = order.attributes;
      
      return {
        id: order.id,
        orderNumber: attrs.orderNumber || `ORD-${order.id}`,
        status: attrs.status,
        createdAt: attrs.createdAt,
        updatedAt: attrs.updatedAt,
        shipping: attrs.shippingCost || 0,
        tax: attrs.tax || 0,
        total: attrs.total,
        paymentMethod: attrs.paymentMethod,
        paymentStatus: attrs.paymentStatus,
        shippingAddress: attrs.shippingAddress?.data?.attributes || {},
        billingAddress: attrs.billingAddress?.data?.attributes || {},
        items: attrs.items?.data?.map(item => {
          const itemAttrs = item.attributes;
          const product = itemAttrs.product?.data;
          
          return {
            id: item.id,
            productId: product?.id,
            name: itemAttrs.name || product?.attributes?.general_information?.name || 'Product',
            price: itemAttrs.price,
            quantity: itemAttrs.quantity,
            image: product?.attributes?.general_information?.images?.data?.[0]?.attributes?.url || null
          };
        }) || []
      };
    } catch (error) {
      console.error(`OrderService getOrderById(${id}) error:`, error);
      throw error;
    }
  }
};