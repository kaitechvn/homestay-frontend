import { defineStore } from 'pinia';
import { fetchHomestays, createHomestay, updateHomestay, deleteHomestay } from '@/services/homestayService';

export const useHomestayStore = defineStore('homestay', {
  state: () => ({
    homestays: [],
    selectedHomestay: null,
    currentPage: 1,
    totalPages: 1,
  }),
  actions: {
    async loadHomestays(page = 1, size = 5) {
      try {
        const response = await fetchHomestays(page, size);
        console.log(response.data); // Log the response for debugging

        // Extract homestays and pagination info
        this.homestays = response.data.data.data;
        console.log('Homestays set in store:', this.homestays);
        this.currentPage = response.data.data.currentPage;
        this.totalPages = response.data.data.totalPages;
      } catch (error) {
        console.error('Failed to fetch homestays:', error);
      }
    },
    async addHomestay(homestayData) {
      try {
        await createHomestay(homestayData);
        this.loadHomestays(this.currentPage); // Refresh list after adding
      } catch (error) {
        console.error('Failed to create homestay:', error);
      }
    },
    async modifyHomestay(homestayId, homestayData) {
      try {
        await updateHomestay(homestayId, homestayData);
        this.loadHomestays(this.currentPage); // Refresh list after updating
        this.selectedHomestay = null; // Clear selected homestay after update
      } catch (error) {
        console.error('Failed to update homestay:', error);
      }
    },
    async removeHomestay(homestayId) {
      try {
        await deleteHomestay(homestayId);
        this.loadHomestays(this.currentPage); // Refresh list after deletion
        this.selectedHomestay = null; // Clear selected homestay
      } catch (error) {
        console.error('Failed to delete homestay:', error);
      }
    },
    setSelectedHomestay(homestay) {
      this.selectedHomestay = homestay; // Set the homestay details for editing
    },
    clearSelectedHomestay() {
      this.selectedHomestay = null; // Clear the selected homestay details
    }
  }
});
