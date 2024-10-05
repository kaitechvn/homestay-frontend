import { defineStore } from 'pinia';
import { filterHomestays, fetchTopRatedHomestays, fetchHomestayDetailById } from '@/services/homestayService';

export const useHomestayUserStore = defineStore('homestayUser', {
  state: () => ({
    homestays: [],
    topRatedHomestays: [],
    selectedHomestay: null,
    totalPages: 1,
    currentPage: 1,
    filters: {
      page: 1,
      size: 5,
      districtId: null,
      minPrice: null,
      maxPrice: null,
      guests: null,
      checkIn: null,
      checkOut: null,
    },
    homestayDetail: {}, 
  }),

  actions: {
    async filterHomestays(filters) {
      try {
        const response = await filterHomestays(filters);

        this.homestays = response.data.data.data;
        console.log('Homestays user set in store:', this.homestays);
        this.currentPage = response.data.data.currentPage;
        this.totalPages = response.data.data.totalPages;
      } catch (error) {
        console.error('Failed to filter homestays:', error);
      }
    },

    async fetchTopRatedHomestays() {
      if (this.topRatedHomestays.length === 0) {
        try {
          const response = await fetchTopRatedHomestays();
          this.topRatedHomestays = response.data; 
        } catch (error) {
          console.error('Error fetching top-rated homestays:', error);
        }
      }
    },

    async fetchHomestayDetail(homestayId) {
      try {
        const response = await fetchHomestayDetailById(homestayId);
        this.homestayDetail = response.data.data;
        console.log('Homestay details fetched:', this.homestayDetail);
      } catch (error) {
        console.error('Error fetching homestay details:', error);
      }
    },

    setSelectedHomestay(homestay) {
      this.selectedHomestay = homestay; 
    },
  },

  clearSelectedHomestay() {
    this.selectedHomestay = null; // Clear the selected homestay details
  },

  loadHomestayImages(homestay) {
    // Check if the homestay already has images
    if (homestay.images && homestay.images.length > 0) {
      // Store images directly from the homestay object
      this.homestayImages[homestay.id] = homestay.images;
    } else {
      // If no images, set to an empty array
      this.homestayImages[homestay.id] = [];
      console.log(`No images available for homestay ${homestay.id}.`);
    }
  },

  getImagesForHomestay(homestayId) {
    return this.homestayImages[homestayId] || [];
  },

});
