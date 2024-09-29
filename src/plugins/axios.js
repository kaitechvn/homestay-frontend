import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const baseURL = import.meta.env.VITE_SERVER_URL + '/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshAxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('access_token');
if (token != null) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (response && response.data.code == 'token_expired') {
      console.log('Access token expired, trying to refresh it');
      try {
        const refreshToken = localStorage.getItem('refresh_token');

        // Check if the refresh token exists before making the request
        if (!refreshToken) {
          console.log('No refresh token available, logging out');
          await router.push('/login');
          return Promise.reject(error);
        }
        
        delete axiosInstance.defaults.headers.common['Authorization'];

        console.log('Sending a POST request to the refresh token endpoint');
        const refreshResponse = await refreshAxiosInstance.post(
          '/auth/refresh-token',
          null,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const accessToken = refreshResponse.data.data.accessToken;

        // Store the new tokens
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);

        // Update the axios instance default header
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${accessToken}`;

        // Retry the original request
        const { config } = error;
        config.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance.request(config);
        
      } catch (refreshError) {

        const authStore = useAuthStore();
        console.log('Error token refresh:', refreshError);

        // Call the logout method from your authStore
        authStore.logout(); // Assuming authStore is properly imported or accessible here
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
