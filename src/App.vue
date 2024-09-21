<template>
  <div>
    <AdminNavBar v-if="isAdmin" />
    <NavBar v-else/>
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from './stores/authStore';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import AdminNavBar from './components/AdminNavBar.vue';

const authStore = useAuthStore();
const isAdmin = computed(() => authStore.userRole == 'ADMIN')
</script>

<style scoped>
</style>
