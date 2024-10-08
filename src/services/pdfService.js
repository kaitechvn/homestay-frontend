import axiosInstance from '@/plugins/axios';

const API_PDF = '/pdf';

export const downloadPdfBill = (bookingId, lang) => {
  return axiosInstance.get(`${API_PDF}/bill/${bookingId}`, {
    responseType: 'blob',
    params: { lang }
  });
};
