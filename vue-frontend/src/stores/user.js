import { defineStore } from 'pinia'
import { ref } from "vue"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase"

export const useUserStore = defineStore('user', () => {
    // Use ref to create a reactive user state
    const user = ref(null)

    // Method to handle authentication state changes
    function setUser(userInfo) {
        user.value = userInfo
    }

    // Method to clear user (for logout)
    function clearUser() {
        user.value = null
    }

    // Auto login / auth state tracking
    function autoLogin() {
        return new Promise((resolve, reject) => {
            try {
                const unsubscribe = onAuthStateChanged(auth, (userInfo) => {
                    if (userInfo) {
                        // Set user when authenticated
                        setUser(userInfo)
                        resolve(userInfo)
                    } else {
                        // Clear user when signed out
                        clearUser()
                        resolve(null)
                    }
                    
                    // Unsubscribe to prevent memory leaks
                    unsubscribe()
                }, (error) => {
                    // Handle any errors during auth state check
                    console.error("Auth state change error:", error)
                    clearUser()
                    reject(error)
                })
            } catch (error) {
                console.error("Auto login setup error:", error)
                clearUser()
                reject(error)
            }
        })
    }

    // Expose methods and state
    return {
        user,
        setUser,
        clearUser,
        autoLogin
    }
})