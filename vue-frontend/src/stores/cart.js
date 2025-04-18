// src/stores/cart.js
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: JSON.parse(localStorage.getItem("cart")) || [],
  }),
  getters: {
    // Calculate total price
    totalPrice: (state) =>
      state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),

    // Calculate total quantity
    totalQuantity: (state) =>
      state.cartItems.reduce((total, item) => total + item.quantity, 0),
  },
  actions: {
    // Add item to cart
    addToCart(product) {
      console.log("Adding to cart:", product);
      const existingItem = this.cartItems.find(
        (item) => +item.id === +product.id
      );
      if (existingItem) {
        existingItem.quantity += product.quantity;
        console.log(
          `Increased quantity for ${product.uniqueKey} to ${existingItem.quantity}`
        );
      } else {
        this.cartItems.push({ ...product });
        console.log(`Added new product to cart: ${product.id}`);
      }
      this.saveCart();
    },

    // Remove item from cart
    removeFromCart(uniqueKey) {
      console.log(`Removing product from cart: ${uniqueKey}`);
      this.cartItems = this.cartItems.filter((item) => item.id !== uniqueKey);
      this.saveCart();
    },

    // Update item quantity directly
    updateQuantity(uniqueKey, quantity) {
      console.log(this.cartItems);

      const item = this.cartItems.find((item) => +item.id === +uniqueKey);
      console.log(item);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          this.removeFromCart(id);
        } else {
          this.saveCart();
          console.log(`Updated quantity for ${uniqueKey} to ${item.quantity}`);
        }
      }
    },

    // Increase quantity by 1
    increaseQuantity(uniqueKey) {
      const item = this.cartItems.find((item) => item.uniqueKey === uniqueKey);
      if (item) {
        item.quantity += 1;
        console.log(`Increased quantity for ${uniqueKey} to ${item.quantity}`);
        this.saveCart();
      }
    },

    // Decrease quantity by 1
    decreaseQuantity(uniqueKey) {
      const item = this.cartItems.find((item) => item.uniqueKey === uniqueKey);
      if (item) {
        item.quantity -= 1;
        console.log(`Decreased quantity for ${uniqueKey} to ${item.quantity}`);
        if (item.quantity <= 0) {
          this.removeFromCart(uniqueKey);
        } else {
          this.saveCart();
        }
      }
    },

    // Get the quantity of a specific item
    getItemQuantity(uniqueKey) {
      const item = this.cartItems.find((item) => item.uniqueKey === uniqueKey);
      return item ? item.quantity : 0;
    },

    // Clear the cart
    clearCart() {
      this.cartItems = [];
      this.saveCart();
      console.log("Cart has been cleared.");
    },

    // Save cart to localStorage
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cartItems));
      console.log("Cart saved to localStorage:", this.cartItems);
    },
  },
});
