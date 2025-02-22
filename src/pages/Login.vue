<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore"; // Assuming your authStore is set up here
import { useI18n } from "vue-i18n";

// Local form state
const username = ref("");
const password = ref("");
const errorMessage = ref("");
const { t } = useI18n(); // Access translation function
const authStore = useAuthStore();

// Function to handle login
async function login() {
  try {
    await authStore.login(username.value, password.value);
  } catch (error) {
    errorMessage.value = "Invalid username or password";
  }
}
</script>

<template>
  <section class="bg-custom py-3 py-md-4 py-xl-6">
    <div class="container">
      <div class="row gy-3 align-items-center">
        <div class="col-12 col-md-6 col-xm-6 d-flex justify-content-center">
          <img
            src="@/assets/logo-login.png"
            alt="Description of image"
            class="img-fluid rounded-4"
            style="max-width: 83%; height: auto"
          />
        </div>
        <div class="col-12 col-md-5 col-xl-5">
          <div class="card border-0 rounded-4">
            <div class="card-body p-2 p-md-3 p-xl-3">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <h3 class="text-center">{{ t("login.sign_in") }}</h3>
                  </div>
                </div>
              </div>
              <form @submit.prevent="login">
                <div class="row gy-2 overflow-hidden">
                  <div class="col-12">
                    <div class="form-floating mb-2">
                      <input
                        type="text"
                        class="form-control"
                        name="username"
                        id="username"
                        placeholder="{{ t('login.username_placeholder') }}"
                        required
                        v-model="username"
                      />
                      <label for="username" class="form-label">{{
                        t("login.username")
                      }}</label>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-floating mb-2">
                      <input
                        type="password"
                        class="form-control"
                        name="password"
                        id="password"
                        placeholder="{{ t('login.password_placeholder') }}"
                        required
                        v-model="password"
                      />
                      <label for="password" class="form-label">{{
                        t("login.password")
                      }}</label>
                    </div>
                  </div>
                  <div class="col-12"></div>
                  <div class="col-12">
                    <div class="d-grid">
                      <button class="btn btn-primary btn-sm" type="submit">
                        {{ t("login.log_in_now") }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div class="row">
                <div class="col-12">
                  <div
                    class="d-flex gap-1 flex-column flex-md-row justify-content-md-end mt-3"
                  >
                    <router-link to="/forgot-password">{{
                      t("login.forgot_password")
                    }}</router-link>
                  </div>
                </div>
              </div>
              <p class="text-end">
                {{ t("login.no_account") }}
                <router-link to="/register">{{
                  t("login.sign_up")
                }}</router-link>
              </p>
              <div class="row">
                <div class="col-12">
                  <p class="mt-3 mb-3">{{ t("login.or_continue_with") }}</p>
                  <div class="d-flex gap-2 justify-content-center">
                    <a
                      href="#!"
                      class="btn btn-outline-danger btn-sm bsb-btn-circle"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-google"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"
                        />
                      </svg>
                    </a>
                    <a
                      href="#!"
                      class="btn btn-outline-primary btn-sm bsb-btn-circle"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-facebook"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-custom {
  background-color: #ffbc70e1;
}
</style>
