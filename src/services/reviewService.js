import axiosInstance from "@/plugins/axios";

const API_REVIEW = '/reviews'; // Adjust according to your backend API

export const fetchReviewByHomestay = (homestayId) => {
  return axiosInstance.get(`${API_REVIEW}/homestay/${homestayId}`);
};

export const addReview = (reviewData) => {
  return axiosInstance.post(API_REVIEW, reviewData);
};

// You can add more functions as needed, e.g., update or delete reviews
// export const updateReview = (reviewId, reviewData) => {
//   return axiosInstance.put(`${API_REVIEW}/${reviewId}`, reviewData);
// };

// export const deleteReview = (reviewId) => {
//   return axiosInstance.delete(`${API_REVIEW}/${reviewId}`);
// };
