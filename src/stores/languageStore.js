// stores/languageStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n();
  const selectedLanguage = ref(localStorage.getItem("selectedLanguage") || "en");
  const currentFlag = ref(localStorage.getItem("selectedFlag") || "fi fi-us");

  const initializeLocalStorage = () => {
    if (!localStorage.getItem("selectedLanguage")) {
      localStorage.setItem("selectedLanguage", "en");
    }
    if (!localStorage.getItem("selectedFlag")) {
      localStorage.setItem("selectedFlag", "fi fi-us");
    }

    locale.value =  localStorage.getItem("selectedLanguage");
    currentFlag.value = localStorage.getItem("selectedFlag");
  };

  const switchLanguage = (lang, flagClass) => {
    selectedLanguage.value = lang; 
    currentFlag.value = flagClass; 
    locale.value = lang; 
    localStorage.setItem("selectedLanguage", lang); 
    localStorage.setItem("selectedFlag", flagClass); 
  };

  initializeLocalStorage();

  return {
    selectedLanguage,
    currentFlag,
    switchLanguage,
  };
});
