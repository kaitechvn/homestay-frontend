import axiosInstance from '@/plugins/axios';

const API_HOMESTAY = '/homestays'; 

export const fetchHomestays = (page = 1, size = 5) => {
  return axiosInstance.get(API_HOMESTAY, {
    params: { page, size },
  });
};

export const fetchHomestayDetailById = async (homestayId) => {
  // Make an API call to fetch the homestay detail by ID
  return axiosInstance.get(`${API_HOMESTAY}/${homestayId}`);
  
};
export const filterHomestays = (filters) => {
  return axiosInstance.get(`${API_HOMESTAY}/filter`, {
    params: filters,
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

// Images
export const uploadImages = (homestayId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('image', file);
  });
  return axiosInstance.post(`${API_HOMESTAY}/${homestayId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteImage = (homestayId, imageUrl) => {
  return axiosInstance.delete(
    `${API_HOMESTAY}/${homestayId}/images/${imageUrl}`
  );
};

export const fetchLockDates = (homestayId) => {
  return axiosInstance.get(`${API_HOMESTAY}/${homestayId}/lockdates`);
};

// Add a lock date for a homestay
export const addLockDate = (homestayId, lockDates) => {
  return axiosInstance.post(
    `${API_HOMESTAY}/${homestayId}/lockdates`,
    lockDates
  );
};

// Remove a specific lock date for a homestay
export const removeLockDate = (homestayId, unlockDates) => {
  return axiosInstance.post(
    `${API_HOMESTAY}/${homestayId}/unlockdates`,
    unlockDates
  );
};

export const fetchTopRatedHomestays = () => {
  return axiosInstance.get(`${API_HOMESTAY}/top-rated`);
};
