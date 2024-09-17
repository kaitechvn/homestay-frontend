<template>
  <nav class="navbar navbar-expand-lg navbar-dark p-1 bg-danger" id="headerNav">
    <div class="container-fluid">
      <router-link class="navbar-brand d-block d-lg-none" to="/">
        <img src="@/assets/logo-navbar.png" height="70" />
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link mx-2" to="/" aria-current="page">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link mx-2" to="/homestay">Homestay</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link mx-2" to="/about-us">About Us</router-link>
          </li>
          <li class="nav-item d-none d-lg-block">
            <router-link class="nav-link mx-2" to="/">
              <img src="@/assets/logo-navbar.png" height="70" />
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link mx-2" to="/login">Sign In</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link mx-2" to="/register">Sign Up</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto"> <!-- Ensure it's aligned to the right -->
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle mx-2" href="#" id="languageDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span :class="currentFlag"></span> <!-- Default Flag Icon -->
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
      </ul>
    </div>
    </div>
  </nav>
</template>

<script setup>

import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Use vue-i18n
const { locale } = useI18n();

// Reactive flag to update the current flag dynamically
const currentFlag = ref('fi fi-us'); // Default to English (US)

// Function to switch language and update flag icon
function switchLanguage(lang, flagClass) {
  locale.value = lang; 
  currentFlag.value = flagClass;
  
  // Update the flag icon
  localStorage.setItem('selectedLanguage', lang);
  localStorage.setItem('selectedFlag', flagClass);
}

function initializeLocalStorage() {
  if (!localStorage.getItem('selectedLanguage')) {
    localStorage.setItem('selectedLanguage', 'en'); // Default language
  }
  if (!localStorage.getItem('selectedFlag')) {
    localStorage.setItem('selectedFlag', 'fi fi-us'); // Default flag
  }
}

onMounted(() => {
  initializeLocalStorage();

  const savedLanguage = localStorage.getItem('selectedLanguage');
  const savedFlag = localStorage.getItem('selectedFlag');
  
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
  if (savedFlag) {
    currentFlag.value = savedFlag;
  }
});
</script>

<style scoped>
.navbar-nav {
  display: flex;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
}

.nav-link {
  font-size: 1.2rem; /* Adjust the font size as needed */
  display: flex;
  align-items: center;
}

</style>
