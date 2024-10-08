import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axiosInstance from '@/plugins/axios';
import { jwtDecode } from "jwt-decode"; 
import { useRouter } from 'vue-router';
import PAGES from '@/constants/pages';

export const useAuthStore = defineStore('auth', () => {
  const userRole = ref(localStorage.getItem('userRole') || null);  
  const router = useRouter();
  const mode = ref(localStorage.getItem('mode') || PAGES.HOST.HOME); 
  const isAuthenticated = computed(() => !!userRole.value);

  function toggleMode() {
    mode.value = (mode.value === PAGES.HOME) ? PAGES.HOST.HOME : PAGES.HOME;
    localStorage.setItem('mode', mode.value);
  }

  // Actions
  async function login(username, password) {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      const { accessToken, refreshToken } = response.data.data;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const decodedToken = jwtDecode(accessToken);
      console.log(decodedToken);

      userRole.value = decodedToken.role;
      console.log(userRole.value);
      localStorage.setItem('userRole', decodedToken.role);

      if (userRole.value == 'ADMIN') {
        await router.push(PAGES.ADMIN.HOME);
      } else {
        await router.push(PAGES.HOME);
      }
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

    function logout() {

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('mode'); // Optional: clear mode on logout
      localStorage.removeItem('currentPage')

      delete axiosInstance.defaults.headers.common['Authorization'];

      userRole.value = null;
      mode.value = PAGES.HOST.HOME; // Reset mode to default

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
