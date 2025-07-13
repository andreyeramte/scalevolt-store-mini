import create from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with real authentication logic (e.g., Firebase, API call)
      if (email && password) {
        set({ user: { email }, loading: false, error: null });
        return true;
      } else {
        set({ error: 'Invalid credentials', loading: false });
        return false;
      }
    } catch (err) {
      set({ error: err.message || 'Login failed', loading: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with real registration logic (e.g., Firebase, API call)
      if (userData.email && userData.password) {
        set({ user: { ...userData }, loading: false, error: null });
        return true;
      } else {
        set({ error: 'Invalid registration data', loading: false });
        return false;
      }
    } catch (err) {
      set({ error: err.message || 'Registration failed', loading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;