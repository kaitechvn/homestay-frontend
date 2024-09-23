import axiosInstance from "@/plugins/axios";

const API_HOMESTAY = '/homestays'; // Adjust according to your backend API

export const fetchHomestays = (page = 1, size = 5) => {
  return axiosInstance.get(API_HOMESTAY, {
    params: { page, size }
  });
};

export const createHomestay = (homestayData) => {
  return axiosInstance.post(API_HOMESTAY, homestayData);
};

export const updateHomestay = (homestayId, homestayData) => {
  return axiosInstance.put(`${API_HOMESTAY}/${homestayId}`, homestayData);
};

export const deleteHomestay = (homestayId) => {
  return axiosInstance.delete(`${API_HOMESTAY}/${homestayId}`);
};

export const uploadImages = (homestayId, files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('image', file);
  });
  return axiosInstance.post(`${API_HOMESTAY}/${homestayId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteImage = (homestayId, imageUrl) => {
  return axiosInstance.delete(`${API_HOMESTAY}/${homestayId}/images/${imageUrl}`);
};

  
