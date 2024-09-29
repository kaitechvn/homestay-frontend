import { defineStore } from 'pinia';
import { fetchHomestays, createHomestay, updateHomestay, deleteHomestay, uploadImages,
   deleteImage, fetchLockDates, addLockDate, removeLockDate} from '@/services/homestayService';

export const useHomestayStore = defineStore('homestay', {
  state: () => ({
    homestays: [],
    selectedHomestay: null,
    currentPage: 1,
    totalPages: 1,
    currentSize: 5,
    homestayImages: {},
    homestayLockDates: [],
  }),
  actions: {
    async loadHomestays(page = 1, size = 5) {
      try {
        const response = await fetchHomestays(page, size);
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
        this.loadHomestays(this.currentPage); 
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

    async uploadHomestayImages(homestayId, files) {
      try {
        const formData = new FormData();
        Array.from(files).forEach(file => {
          formData.append('images', file);
        });

        await uploadImages(homestayId, formData);
      } catch (error) {
        console.error('Failed to upload images:', error);
      }
    },

    async deleteHomestayImage(homestayId, imageUrl) {
      try {
        await deleteImage(homestayId, imageUrl);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    },

    async loadLockDates(homestayId) {
      try {
        const response = await fetchLockDates(homestayId);
        this.homestayLockDates[homestayId] = response.data;
      } catch (error) {
        console.error(`Failed to fetch lock dates for homestay ${homestayId}:`, error);
      }
    },

    async addLockDate(homestayId, lockDates) {
      try {
        await addLockDate(homestayId, lockDates);
      } catch (error) {
        console.error(`Failed to add lock date ${lockDates} to homestay ${homestayId}:`, error);
      }

    },
    async removeLockDate(homestayId, lockDates) {
      try {
        await removeLockDate(homestayId, lockDates);
      } catch (error) {
        console.error(`Failed to remove lock date ${lockDates} from homestay ${homestayId}:`, error);
      }
    },
    
    getLockDatesForHomestay(homestayId) {
      return this.homestayLockDates[homestayId] || [];
    }
  }
});