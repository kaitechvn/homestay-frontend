import axiosInstance from "@/plugins/axios";

const API_USER = '/users'; // Adjust according to your backend API

export const fetchUsers = (page = 1, size = 5) => {
  return axiosInstance.get(API_USER, {
    params: { page, size }
  });
};

export const createUser = (userData) => {
  return axiosInstance.post(API_USER, userData);
};

export const updateUser = (userId, userData) => {
  return axiosInstance.put(`${API_USER}/${userId}`, userData);
};

export const deleteUser = (userId) => {
  return axiosInstance.delete(`${API_USER}/${userId}`);
};
