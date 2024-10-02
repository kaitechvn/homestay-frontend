import Login from "@/pages/Login.vue";
import PAGES from "@/constants/pages";
import { createRouter, createWebHistory } from "vue-router";
import Register from "@/pages/Register.vue";
import Home from "@/pages/user/Home.vue";
import Forbidden from "@/pages/exception/Forbidden.vue";
import Admin from "@/pages/admin/Admin.vue";
import { adminGuard } from "./guards";
import Dashboard from "@/pages/admin/Dashboard.vue";
import UserManagement from "@/pages/admin/UserManagement.vue";
import Message from "@/pages/admin/Message.vue";
import HomestayManagement from "@/pages/admin/HomestayManagement.vue";
import HomestayDetails from "@/pages/HomestayDetails.vue";
import Homestay from "@/pages/user/Homestay.vue";
import NotFound from "@/pages/exception/NotFound.vue";
import BookingManagement from "@/pages/admin/BookingManagement.vue";

const routes = [

  // General routes
  { path: PAGES.LOGIN, component: Login },
  { path: PAGES.REGISTER, component: Register },
  { path: PAGES.HOME, component: Home },
  { path: PAGES.FORBIDDEN, component: Forbidden },  

  // ADMIN routes
  {
    path: PAGES.ADMIN.HOME,
    component: Admin, 
    beforeEnter: adminGuard, 
    children: [
      { path: PAGES.ADMIN.DASHBOARD, component: Dashboard },
      { path: PAGES.ADMIN.USER_MANAGEMENT, component: UserManagement },
      { path: PAGES.ADMIN.HOMESTAY_MANAGEMENT, component: HomestayManagement},
      { path: PAGES.ADMIN.MESSAGE, component: Message},
      { path: PAGES.ADMIN.BOOKING_MANAGEMENT, component: BookingManagement}
    ],
  },

  // USER routes
  {
    path: PAGES.USER.HOMESTAY, component: Homestay
  },

  {
    path: PAGES.USER.HOMESTAY_DETAILS(':id'),
    component: HomestayDetails,
    props: true
  },

  {
    path: "/:catchAll(.*)", // Catch-all route for undefined paths
    component: NotFound
  },
];


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
