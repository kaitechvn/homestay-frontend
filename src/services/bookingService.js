import axiosInstance from '@/plugins/axios';

const API_BOOKINGS = '/bookings';

// Create a new booking
export const createBooking = (bookingData) => {
  return axiosInstance.post(API_BOOKINGS, bookingData);
};

// Confirm a booking (Admin access required)
export const confirmBooking = (bookingId) => {
  return axiosInstance.post(`${API_BOOKINGS}/${bookingId}/confirm`);
};

// Cancel a booking (Admin access required)
export const cancelBooking = (bookingId) => {
  return axiosInstance.post(`${API_BOOKINGS}/${bookingId}/cancel`);
};

export const fetchBookings = (page = 1, size = 5, status) => {
  const params = { page, size };
  if (status) {
    params.status = status;
  }
  return axiosInstance.get(API_BOOKINGS, { params });
};

export const deleteBooking = (bookingId) => {
  return axiosInstance.delete(`${API_BOOKINGS}/${bookingId}`);
}
