import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axiosInstance from '@/plugins/axios';
import { jwtDecode } from "jwt-decode"; 
import { useRouter } from 'vue-router';
import PAGES from '@/constants/pages';

export const useAuthStore = defineStore('auth', () => {
  const userRole = ref(localStorage.getItem('userRole') || null);  
  const router = useRouter();
  const mode = ref(localStorage.getItem('mode') || PAGES.HOST.HOME); // Retrieve mode from localStorage or set default

  const isAuthenticated = computed(() => !!userRole.value); // Derived authentication status

  function toggleMode() {
    mode.value = (mode.value === PAGES.HOME) ? PAGES.HOST.HOME : PAGES.HOME;
    localStorage.setItem('mode', mode.value); // Store the mode in localStorage
  }

  // Actions
  async function login(username, password) {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { accessToken, refreshToken } = response.data.data;

      // Store tokens in localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      // Set the Authorization header for subsequent requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Decode the token to get the user's role
      const decodedToken = jwtDecode(accessToken);
      console.log(decodedToken);

      // Store the user's role in the store and localStorage
      userRole.value = decodedToken.role;
      localStorage.setItem('userRole', decodedToken.role);

      // Redirect based on user role
      if (userRole.value === 'ADMIN') {
        await router.push(PAGES.ADMIN.HOME);
      } else {
        await router.push(PAGES.HOME);
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (e.g., display an error message)
    }
  }

    function logout() {
      // Clear tokens and user role from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('mode'); // Optional: clear mode on logout
      localStorage.removeItem('currentPage')

      delete axiosInstance.defaults.headers.common['Authorization'];

      // Reset user role
      userRole.value = null;
      mode.value = PAGES.HOST.HOME; // Reset mode to default

      // Optional: Redirect to login
      router.push('/login');
    }

  return {
    isAuthenticated,
    userRole,
    mode,
    toggleMode,
    login,
    logout,
  };
});
