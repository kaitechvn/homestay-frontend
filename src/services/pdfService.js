import axiosInstance from '@/plugins/axios';

const API_PDF = '/pdf'; 

export const downloadPdfBill = (bookingId) => {
  return axiosInstance.get(`${API_PDF}/bill/${bookingId}`, {
    responseType: 'blob', 
  });
};