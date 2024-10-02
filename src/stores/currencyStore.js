import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCurrencyStore = defineStore('currency', () => {
  const currentCurrency = ref(localStorage.getItem('selectedCurrency') || 'VND'); 

  // Function to update currency and sync with localStorage
  const setCurrency = (newCurrency) => {
    currentCurrency.value = newCurrency;
    localStorage.setItem('selectedCurrency', newCurrency);
  };

  return { currentCurrency, setCurrency };
});