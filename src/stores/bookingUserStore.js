import { defineStore } from 'pinia';
import { fetchBookings, cancelBooking } from '@/services/bookingService';

export const useBookingUserStore = defineStore('bookingUser', {
  state: () => ({
    bookings: [],
    selectedBooking: null,
    currentPage: 1,
    totalPages: 1,
    selectedStatus: null
  }),
  actions: {
    async loadBookings(page = 1, size = 5, status = null) {

      try {
        const response = await fetchBookings(page, size, status);
        console.log(response.data);
        this.bookings = response.data.data.data;
        this.currentPage = response.data.data.currentPage;
        this.totalPages = response.data.data.totalPages;
        localStorage.setItem('currentPage', this.currentPage);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    },

    async cancel(bookingId) {
      try {
        await cancelBooking(bookingId);
        this.loadBookings();
        this.selectedStatus = null;
      } catch (error) {
        console.error('Failed to cancel booking', error);
      }
    },

    filterByStatus(status) {
      this.selectedStatus = status; 
      this.currentPage = 1;
      this.loadBookings(this.currentPage, 5, status); 
    },

    setSelectedBooking(booking) {
      this.selectedBooking = booking;
    },

    clearSelectedBooking() {
      this.selectedBooking = null;
    },

    handlePageChange(newPage) {
      this.currentPage = newPage; 
      this.loadBookings(newPage, 5, this.selectedStatus); 
    },
  },
});