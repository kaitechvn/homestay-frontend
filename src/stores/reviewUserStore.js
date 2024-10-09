import { defineStore } from 'pinia';
import { fetchReviewByHomestay, addReview } from '@/services/reviewService';

export const useReviewUserStore = defineStore('reviewUser', {
  state: () => ({
    reviews: [],
  }),

  actions: {
    async loadReviews(homestayId) {
      try {
        const response = await fetchReviewByHomestay(homestayId);
        this.reviews = response.data.data;
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    },

    async submitReview(reviewData) {
      try {
        await addReview(reviewData);
      } catch (err) {
        console.error('Failed to add review', err);
      }
    },

    resetReviews() {
      this.reviews = [];
    }

  }
});
