import axiosInstance from "@/plugins/axios";

const API_REVIEW = '/reviews'; // Adjust according to your backend API

export const fetchReviewByHomestay = (homestayId) => {
  return axiosInstance.get(`${API_REVIEW}/homestay/${homestayId}`);
};

export const addReview = (reviewData) => {
  return axiosInstance.post(API_REVIEW, reviewData);
};

