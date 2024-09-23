<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark p-3" id="adminNav">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/admin/">
          <img src="@/assets/admin-navbar.png" height="70" />
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbarNav" aria-controls="adminNavbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="adminNavbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
            <router-link class="nav-link" to="/admin/dashboard">{{ $t('admin-navbar.dashboard') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/user-management">{{ $t('admin-navbar.users') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/homestay-management">{{ $t('admin-navbar.homestays') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/admin/bookings">{{ $t('admin-navbar.bookings') }}</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/admin/settings">{{ $t('admin-navbar.payment') }}</router-link>
          </li>
            <!-- Language Switcher Dropdown -->
            <li class="nav-item dropdown ms-auto">
              <a class="nav-link dropdown-toggle" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span :class="currentFlag"></span> <!-- Current Flag Icon -->
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="switchLanguage('en', 'fi fi-us')">
                    <span class="fi fi-us"></span> English
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="switchLanguage('vn', 'fi fi-vn')">
                    <span class="fi fi-vn"></span> Tiếng Việt
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="switchLanguage('ja', 'fi fi-jp')">
                    <span class="fi fi-jp"></span> 日本語
                  </a>
                </li>
              </ul>
            </li>
            <!-- User Account Dropdown -->
            <li class="nav-item dropdown ms-3">
              <a class="nav-link dropdown-toggle" href="#" id="adminAccountDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="@/assets/ava-logo.jpg" height="30" class="rounded-circle" />
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="adminAccountDropdown">
                <li>
                  <router-link class="dropdown-item" to="/admin/profile">{{ $t('profile') }}</router-link>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="logout">{{ $t('logout') }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/authStore';
  
  const { locale } = useI18n();
  const authStore = useAuthStore();
  const router = useRouter();
  const currentFlag = ref('fi fi-us'); 
  
  function logout() {
    authStore.logout();
    router.push('/login'); // Redirect to login after logout
  }
  
  function switchLanguage(lang, flagClass) {
    locale.value = lang;
    currentFlag.value = flagClass;
    localStorage.setItem('selectedLanguage', lang);
    localStorage.setItem('selectedFlag', flagClass);
  }
  
  function initializeLocalStorage() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedFlag = localStorage.getItem('selectedFlag');
    
    if (savedLanguage) {
      locale.value = savedLanguage;
    }
    if (savedFlag) {
      currentFlag.value = savedFlag;
    }
  }
  
  onMounted(() => {
    initializeLocalStorage();
  });
  </script>
  
  <style scoped>
  .navbar-nav {
    display: flex;
    align-items: center;
  }
  
  .nav-item {
    margin-right: 1rem;
  }
  
  .nav-link {
    font-size: 1.1rem;
  }
  
  .dropdown-menu {
    min-width: 150px;
  }
  
  .rounded-circle {
    border-radius: 50%;
  }
  </style>
  