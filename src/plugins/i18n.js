import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import vn from "@/locales/vn.json";
import ja from "@/locales/ja.json";

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: { vn, en, ja },
    legacy: false,
});

export default i18n;
