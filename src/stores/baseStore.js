import { defineStore } from 'pinia';

export const useBaseStore = defineStore('base', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('items')) || [],
    currentPage: JSON.parse(localStorage.getItem('currentPage')) || 1,
    totalPages: JSON.parse(localStorage.getItem('totalPages')) || 1,
    totalElements: JSON.parse(localStorage.getItem('totalElements')) || 0,
  }),
  
  actions: {
    loadItems(fetchFunction, page = 1, size = 5) {
      return fetchFunction(page, size).then(response => {
        this.items = response.data.data.data;
        this.currentPage = response.data.data.currentPage;
        this.totalPages = response.data.data.totalPages;
        this.totalElements = response.data.data.totalElements;

        // Save to localStorage
        localStorage.setItem('items', JSON.stringify(this.items));
        localStorage.setItem('currentPage', JSON.stringify(this.currentPage));
        localStorage.setItem('totalPages', JSON.stringify(this.totalPages));
        localStorage.setItem('totalElements', JSON.stringify(this.totalElements));
      });
    },

    clearLocalStorage() {
      localStorage.removeItem('items');
      localStorage.removeItem('currentPage');
      localStorage.removeItem('totalPages');
      localStorage.removeItem('totalElements');
    },
  }
});
