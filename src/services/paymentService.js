import axiosInstance from '@/plugins/axios';

const API_PAYMENT = '/payment'; // Adjust according to your backend API endpoint

// Fetch VNPay Payment URL
export const createVnPayPayment = (amount, bookingId, bankCode = null, ) => {
  return axiosInstance.get(`${API_PAYMENT}/vnpay`, {
    params: {
      amount,
      bankCode,
      bookingId,
    },
  });
};


// Handle VNPay callback
export const handleVnPayCallback = () => {
  return axiosInstance.get(`${API_PAYMENT}/vnpay-callback`);
};
