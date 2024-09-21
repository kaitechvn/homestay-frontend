const PAGES = {
  // General pages
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORBIDDEN: '/forbidden',
  UNAUTHORIZED: "/unauthorized",

  // Admin pages (starts with /admin)
  ADMIN: {
    HOME: "/admin",
    DASHBOARD: 'dashboard',
    USER_MANAGEMENT: 'user-management',
    HOMESTAY_MANAGEMENT: 'homestay-management', 
    BOOKING_MANAGEMENT: 'booking-management',
    MESSAGE: 'message'
  },

  // User pages (starts with /user)
  USER: {
    HOMESTAY: '/homestay',
    SETTINGS: '/settings',
    BOOKING: '/booking'
  },

  HOST: {
    HOME: '/host'
  },

  PERSONAL_INFO: '/personal-info',
   
  
};

export default PAGES;