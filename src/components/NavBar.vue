<template>
  <nav class="navbar navbar-expand-lg navbar-dark p-1 bg-danger" id="headerNav">
    <div class="container-fluid">
      <router-link class="navbar-brand d-block d-lg-none" to="/">
        <img src="@/assets/logo-navbar.png" height="70" />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link class="nav-link mx-2" to="/" aria-current="page"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link mx-2" to="/homestay"
              >Homestay</router-link
            >
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <router-link class="nav-link mx-2" to="/booking"
              >Booking</router-link
            >
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link mx-2" to="/contact-us"
              >Contact</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link mx-2" to="/about-us"
              >About Us</router-link
            >
          </li>
          <li class="nav-item d-none d-lg-block">
            <router-link class="nav-link mx-2" to="/">
              <img src="@/assets/logo-navbar.png" height="70" />
            </router-link>
          </li>
          <!-- Conditionally render links based on user authentication status -->
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link mx-2" to="/login">Sign In</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link mx-2" to="/register"
              >Sign Up</router-link
            >
          </li>
          <li v-if="isLoggedIn" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle mx-2"
              href="#"
              id="accountDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="@/assets/ava-logo.jpg"
                height="30"
                class="rounded-circle profile-icon"
              />
              <!-- Profile Icon -->
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="accountDropdown"
            >
              <li>
                <router-link class="dropdown-item" to="/profile"
                  >Profile</router-link
                >
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout"
                  >Logout</a
                >
              </li>
            </ul>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item mx-2">
            <router-link
              class="nav-link host-bar"
              :to="hostLink"
              @click="handleHostClick"
              >{{ hostText }}</router-link
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle mx-2 currency"
              href="#"
              id="currencyDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ currencySymbol(currencyStore.currentCurrency) }}
              <!-- Display Current Currency -->
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="currencyDropdown"
            >
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="switchCurrency('VND')"
                >
                  ₫ (VND)
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="switchCurrency('USD')"
                >
                  $ (USD)
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="switchCurrency('JPY')"
                >
                  ¥ (JPY)
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle mx-2"
              href="#"
              id="languageDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span :class="currentFlag"></span>
              <!-- Default Flag Icon -->
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="languageDropdown"
            >
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="switchLanguage('en', 'fi fi-us')"
                >
                  <span class="fi fi-us"></span> English
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="switchLanguage('vn', 'fi fi-vn')"
                >
                  <span class="fi fi-vn"></span> Tiếng Việt
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  href="#"
                  @click.prevent="switchLanguage('ja', 'fi fi-jp')"
                >
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
import { useCurrencyStore } from "@/stores/currencyStore";
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";
import PAGES from "@/constants/pages";

const currencyStore = useCurrencyStore();
const { locale } = useI18n();
const authStore = useAuthStore();
const currentFlag = ref("fi fi-us");
const isLoggedIn = computed(() => authStore.isAuthenticated);
const currentMode = computed(() => authStore.mode);

// Computed properties for link and text
const hostLink = computed(() => {
  if (!isLoggedIn.value) return PAGES.LOGIN;
  return currentMode.value;
});

const hostText = computed(() => {
  if (!isLoggedIn.value) return "Host";
  return currentMode.value === PAGES.HOME
    ? "Switch to travelling"
    : "Switch to hosting";
});

// Function to toggle the mode
function handleHostClick() {
  if (isLoggedIn.value) {
    authStore.toggleMode();
  }
}

function switchLanguage(lang, flagClass) {
  locale.value = lang;
  currentFlag.value = flagClass;
  localStorage.setItem("selectedLanguage", lang);
  localStorage.setItem("selectedFlag", flagClass);
}

const switchCurrency = (currency) => {
  currencyStore.setCurrency(currency);
};

const currencySymbol = (currency) => {
  const symbols = {
    VND: "₫",
    USD: "$",
    JPY: "¥",
  };
  return symbols[currency] || currency;
};

// Function to handle user logout
function logout() {
  authStore.logout();
}

// Function to initialize local storage values
function initializeLocalStorage() {
  if (!localStorage.getItem("selectedLanguage")) {
    localStorage.setItem("selectedLanguage", "en");
  }
  if (!localStorage.getItem("selectedFlag")) {
    localStorage.setItem("selectedFlag", "fi fi-us");
  }
  if (!localStorage.getItem("selectedCurrency")) {
    localStorage.setItem("selectedCurrency", "VND"); // Default currency
  }
}

onMounted(() => {
  initializeLocalStorage();

  const savedLanguage = localStorage.getItem("selectedLanguage");
  const savedFlag = localStorage.getItem("selectedFlag");
  const savedCurrency = localStorage.getItem("selectedCurrency");

  if (savedLanguage) {
    locale.value = savedLanguage;
  }
  if (savedFlag) {
    currentFlag.value = savedFlag;
  }

  if (savedCurrency) {
    currencyStore.setCurrency(savedCurrency); // Use store's setter method to update the currency
  }

  // Ensure that the user's role and mode are initialized from local storage
  const savedRole = localStorage.getItem("userRole");
  if (savedRole) {
    authStore.userRole = savedRole;
  }

  const savedMode = localStorage.getItem("mode");
  if (savedMode) {
    authStore.mode = savedMode;
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

.dropdown-menu {
  min-width: 150px; /* Adjust the width as needed */
}

.rounded-circle {
  border-radius: 50%;
}

.profile-icon {
  margin-left: 10px; /* Adjust margin to move icon to the right */
}

.currency {
  color: rgb(40, 33, 33);
  font-weight: bold;
}
</style>
