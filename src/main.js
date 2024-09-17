import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import i18n from "./plugins/i18n";
import App from "./App.vue";
import router from "./routers/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import 'flag-icons/css/flag-icons.min.css';
// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app
    .use(pinia)
    .use(i18n)
    .use(router)
    .mount('#app');
