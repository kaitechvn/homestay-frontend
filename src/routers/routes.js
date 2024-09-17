import Login from "@/pages/Login.vue";
import PAGES from "@/constants/pages";
import { createRouter, createWebHistory } from "vue-router";
import Register from "@/pages/Register.vue";
import Home from "@/pages/Home.vue";

const routes = [
  { path: PAGES.LOGIN, component: Login },
  { path: PAGES.REGISTER, component: Register },
  { path: PAGES.HOME, component: Home },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
