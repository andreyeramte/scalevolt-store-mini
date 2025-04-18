// Keep only one axios import at the top
import axios from "axios";
import qs from "qs";

// Combine the API_URL definitions
const API_URL =
  typeof process !== "undefined" && process.env && process.env.VUE_APP_API_URL
    ? process.env.VUE_APP_API_URL
    : "http://localhost:1337/api";
// Create one service object that combines all methods
const productService = {
  async getProducts(params = {}) {
    try {
      const defaultParams = {
        populate: {
          general_information: {
            populate: ["images"],
          },
          pricing_and_inventory: true,
          specifications: true,
          categories: true,
          tags: true,
        },
      };

      const mergedParams = { ...defaultParams, ...params };
      const queryString = qs.stringify(mergedParams, {
        encodeValuesOnly: true,
        arrayFormat: "brackets",
        encode: false,
      });

      const response = await axios.get(`${API_URL}/products?${queryString}`);
      return response.data;
    } catch (error) {
      console.error("ProductService getProducts error:", error);
      throw error;
    }
  },

  async getUserOrders(userId, params = {}) {
    try {
      const defaultParams = {
        filters: {
          user: userId,
        },
        populate: {
          items: {
            populate: ["product"],
          },
          shippingAddress: true,
          billingAddress: true,
        },
        sort: ["createdAt:desc"],
        pagination: {
          page: params.page || 1,
          pageSize: params.pageSize || 10,
        },
      };

      const mergedParams = { ...defaultParams, ...params };
      const queryString = qs.stringify(mergedParams, {
        encodeValuesOnly: true,
        arrayFormat: "brackets",
        encode: false,
      });

      const response = await axios.get(`${API_URL}/orders?${queryString}`);

      // Transform the response to a more convenient format for the frontend
      const transformedData = {
        data: response.data.data.map((order) => {
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
            items:
              attrs.items?.data?.map((item) => {
                const itemAttrs = item.attributes;
                const product = itemAttrs.product?.data;

                return {
                  id: item.id,
                  productId: product?.id,
                  name:
                    itemAttrs.name ||
                    product?.attributes?.general_information?.name ||
                    "Product",
                  price: itemAttrs.price,
                  quantity: itemAttrs.quantity,
                  image:
                    product?.attributes?.general_information?.images?.data?.[0]
                      ?.attributes?.url || null,
                };
              }) || [],
          };
        }),
        pagination: response.data.meta.pagination,
      };

      return transformedData;
    } catch (error) {
      console.error("OrderService getUserOrders error:", error);
      throw error;
    }
  },

  async getOrderById(id, userId) {
    try {
      const params = {
        populate: {
          items: {
            populate: ["product"],
          },
          shippingAddress: true,
          billingAddress: true,
          user: true,
        },
      };

      const queryString = qs.stringify(params, {
        encodeValuesOnly: true,
        arrayFormat: "brackets",
      });

      const response = await axios.get(
        `${API_URL}/orders/${id}?${queryString}`
      );

      // Verify that this order belongs to the user
      const orderUserId = response.data.data.attributes.user?.data?.id;
      if (orderUserId && orderUserId !== userId) {
        throw new Error(
          "Unauthorized: This order does not belong to the current user"
        );
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
        items:
          attrs.items?.data?.map((item) => {
            const itemAttrs = item.attributes;
            const product = itemAttrs.product?.data;

            return {
              id: item.id,
              productId: product?.id,
              name:
                itemAttrs.name ||
                product?.attributes?.general_information?.name ||
                "Product",
              price: itemAttrs.price,
              quantity: itemAttrs.quantity,
              image:
                product?.attributes?.general_information?.images?.data?.[0]
                  ?.attributes?.url || null,
            };
          }) || [],
      };
    } catch (error) {
      console.error(`OrderService getOrderById(${id}) error:`, error);
      throw error;
    }
  },

  async getProductById(id, params = {}) {
    try {
      const defaultParams = {
        populate: {
          general_information: {
            populate: ["images"],
          },
          pricing_and_inventory: true,
          specifications: true,
          categories: true,
          tags: true,
        },
      };

      const mergedParams = { ...defaultParams, ...params };
      const queryString = qs.stringify(mergedParams, {
        encodeValuesOnly: true,
        arrayFormat: "brackets",
      });

      const response = await axios.get(
        `${API_URL}/products/${id}?${queryString}`
      );
      return response.data;
    } catch (error) {
      console.error(`ProductService getProductById(${id}) error:`, error);
      throw error;
    }
  },

  async getPromotionsByCategory(categoryId, params = {}) {
    try {
      const query = qs.stringify(
        {
          filters: {
            category: { id: categoryId },
            active: true,
          },
          populate: ["image"],
          ...params,
        },
        {
          encodeValuesOnly: true,
          arrayFormat: "brackets",
        }
      );

      const response = await axios.get(`${API_URL}/promotions?${query}`);
      return response.data;
    } catch (error) {
      console.error(
        `ProductService getPromotionsByCategory(${categoryId}) error:`,
        error
      );
      throw error;
    }
  },

  // ENHANCED: Search products function with multilingual support
  async searchProducts(searchTerm, params = {}) {
    try {
      const defaultParams = {
        populate: {
          general_information: {
            populate: ["images"],
          },
          localizations: {
            populate: ["general_information"],
          },
          pricing_and_inventory: true,
        },
        filters: {
          $or: [
            // English fields
            { "general_information.name": { $containsi: searchTerm } },
            { "general_information.description": { $containsi: searchTerm } },
            // Include localizations (Ukrainian and Polish)
            {
              "localizations.general_information.name": {
                $containsi: searchTerm,
              },
            },
            {
              "localizations.general_information.description": {
                $containsi: searchTerm,
              },
            },
            // Other searchable fields
            { "categories.name": { $containsi: searchTerm } },
            { "tags.name": { $containsi: searchTerm } },
            { "specifications.value": { $containsi: searchTerm } },
          ],
        },
      };

      const mergedParams = { ...defaultParams, ...params };
      const queryString = qs.stringify(mergedParams, {
        encodeValuesOnly: true,
        arrayFormat: "brackets",
        encode: false,
      });

      console.log(`Searching for products with term: "${searchTerm}"`);
      const response = await axios.get(`${API_URL}/products?${queryString}`);
      console.log(`Found ${response.data.data?.length || 0} products`);

      return response.data;
    } catch (error) {
      console.error(
        `ProductService searchProducts("${searchTerm}") error:`,
        error
      );
      throw error;
    }
  },

  // ENHANCED: Get all products for search with multilingual support
  async getAllProductsForSearch() {
    // try {
    //   const params = {
    //     fields: ['id'],
    //     populate: {
    //       general_information: {
    //         fields: ['name', 'description'],
    //         populate: {
    //           images: {
    //             fields: ['url'],
    //             limit: 1
    //           }
    //         }
    //       },
    //       pricing_and_inventory: {
    //         fields: ['price', 'stock_quantity']
    //       },
    //       categories: {
    //         fields: ['name']
    //       },
    //       // Include localizations for multilingual search
    //       localizations: {
    //         fields: [],
    //         populate: {
    //           general_information: {
    //             fields: ['name', 'description']
    //           }
    //         }
    //       }
    //     },
    //     pagination: {
    //       limit: -1  // Get all products, adjust if your dataset is very large
    //     }
    //   };
    //   const queryString = qs.stringify(params, {
    //     encodeValuesOnly: true,
    //     arrayFormat: 'brackets',
    //     encode: false
    //   });
    //   console.log('Fetching all products for search component');
    //   const response = await axios.get(`${API_URL}/products?${queryString}`);
    //   // Transform the data to match the expected format for the search component
    //   // and create the searchableText field combining all languages
    //   const transformedProducts = response.data.data.map(product => {
    //     const attrs = product.attributes;
    //     // Get English content
    //     const name = attrs.general_information?.name || 'Unnamed Product';
    //     const description = attrs.general_information?.description || '';
    //     // Get localized content (Ukrainian and Polish)
    //     const localizations = attrs.localizations?.data || [];
    //     // Collect all names and descriptions in all languages
    //     const allNames = [name];
    //     const allDescriptions = [description];
    //     localizations.forEach(localization => {
    //       const localAttrs = localization.attributes;
    //       if (localAttrs.general_information?.name) {
    //         allNames.push(localAttrs.general_information.name);
    //       }
    //       if (localAttrs.general_information?.description) {
    //         allDescriptions.push(localAttrs.general_information.description);
    //       }
    //     });
    //     // Combine all text data into a single searchable field
    //     const searchableText = [
    //       ...allNames,
    //       ...allDescriptions,
    //       attrs.categories?.data?.[0]?.attributes?.name || ''
    //     ].join(' ').toLowerCase();
    //     return {
    //       id: product.id,
    //       name: name,
    //       description: description,
    //       price: attrs.pricing_and_inventory?.price,
    //       stock: attrs.pricing_and_inventory?.stock_quantity,
    //       image: attrs.general_information?.images?.data?.[0]?.attributes?.url || null,
    //       category: attrs.categories?.data?.[0]?.attributes?.name || '',
    //       // Add the combined searchable text
    //       searchableText: searchableText
    //     };
    //   });
    //   console.log(`Prepared ${transformedProducts.length} products for search with multilingual support`);
    //   return transformedProducts;
    // } catch (error) {
    //   console.error('ProductService getAllProductsForSearch error:', error);
    //   throw error;
    // }
  },

  // Simplified methods from the second service
  getProductsSimple: async (options = {}) => {
    try {
      // Transform options into query parameters
      const params = new URLSearchParams();

      if (options.type) params.append("type", options.type);
      if (options.categoryId) params.append("categoryId", options.categoryId);
      if (options.brand) params.append("brand", options.brand);

      // Make the API request
      const response = await axios.get(`${API_URL}/products`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },
};

export default productService;
