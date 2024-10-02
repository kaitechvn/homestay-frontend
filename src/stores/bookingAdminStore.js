import { defineStore } from 'pinia';
import {
  fetchBookings,
  createBooking,
  deleteBooking,
  confirmBooking,
  cancelBooking
} from '@/services/bookingService';

export const useBookingAdminStore = defineStore('booking', {
  state: () => ({
    bookings: [],
    selectedBooking: null,
    currentPage: 1,
    totalPages: 1,
  }),
  actions: {
    async loadBookings(page = 1, size = 5) {
      try {
        const response = await fetchBookings(page, size);
        console.log(response.data);
        this.bookings = response.data.data.data;
        this.currentPage = response.data.data.currentPage;
        this.totalPages = response.data.data.totalPages;
        localStorage.setItem('currentPage', this.currentPage);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    },

    async addBooking(bookingData) {
      try {
        await createBooking(bookingData);
        this.loadBookings(this.currentPage);
      } catch (error) {
        console.error('Failed to create booking:', error);
      }
    },

    async removeBooking(bookingId) {
      try {
        await deleteBooking(bookingId);
        this.loadBookings(this.currentPage);
        this.selectedBooking = null;
      } catch (error) {
        console.error('Failed to delete booking:', error);
      }
    },

    async confirm(bookingId) {
      try {
        await confirmBooking(bookingId);
        this.loadBookings(this.currentPage);
        // this.selectedBooking = null;
      } catch (error) {
        console.error('Failed to confirm booking', error);
      }
    },

    async cancel(bookingId) {
      try {
        await cancelBooking(bookingId);
        this.loadBookings(this.currentPage);
        // this.selectedBooking = null;
      } catch (error) {
        console.error('Failed to cancel booking', error);
      }
    },

    setSelectedBooking(booking) {
      this.selectedBooking = booking;
    },

    clearSelectedBooking() {
      this.selectedBooking = null;
    },
  },
});
