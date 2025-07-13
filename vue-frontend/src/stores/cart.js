import create from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      // Actions
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);
          
          if (existingItem) {
            // If item already exists, increase quantity
            return {
              cartItems: state.cartItems.map(cartItem =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
                  : cartItem
              )
            };
          } else {
            // If item doesn't exist, add it
            return {
              cartItems: [...state.cartItems, { ...item, quantity: item.quantity || 1 }]
            };
          }
        });
      },

      removeFromCart: (itemId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.id !== itemId)
        }));
      },

      increaseQuantity: (itemId) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }));
      },

      decreaseQuantity: (itemId) => {
        set((state) => {
          const item = state.cartItems.find(item => item.id === itemId);
          if (item && item.quantity > 1) {
            return {
              cartItems: state.cartItems.map(item =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              )
            };
          } else if (item && item.quantity === 1) {
            // Remove item if quantity would become 0
            return {
              cartItems: state.cartItems.filter(item => item.id !== itemId)
            };
          }
          return state;
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.id === itemId
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          ).filter(item => item.quantity > 0)
        }));
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      // Getters
      getItemQuantity: (itemId) => {
        const item = get().cartItems.find(item => item.id === itemId);
        return item ? item.quantity : 0;
      },

      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      },

      getCartCount: () => {
        return get().cartItems.reduce((count, item) => {
          return count + item.quantity;
        }, 0);
      },

      getCartItems: () => {
        return get().cartItems;
      },

      isInCart: (itemId) => {
        return get().cartItems.some(item => item.id === itemId);
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export default useCartStore;
