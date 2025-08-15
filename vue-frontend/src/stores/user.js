import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const useUserStore = create((set, get) => ({
  user: null,

  setUser: (userInfo) => set({ user: userInfo }),

  clearUser: () => set({ user: null }),

  autoLogin: () => {
    return new Promise((resolve, reject) => {
      try {
        const unsubscribe = onAuthStateChanged(auth, (userInfo) => {
          if (userInfo) {
            get().setUser(userInfo);
            resolve(userInfo);
          } else {
            get().clearUser();
            resolve(null);
          }
          unsubscribe();
        }, (error) => {
          console.error('Auth state change error:', error);
          get().clearUser();
          reject(error);
        });
      } catch (error) {
        console.error('Auto login setup error:', error);
        get().clearUser();
        reject(error);
      }
    });
  }
}));

export default useUserStore;