import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: ref(false),
        userRole: null, 
    }),
    getters: () => {{
        
    }}
})



