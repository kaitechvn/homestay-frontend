import { defineStore } from 'pinia';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    selectedUser: null,  
    currentPage: 1,
    totalPages: 1,
  }),
  actions: {
    async loadUsers(page = 1, size = 5) {
        try {
          const response = await fetchUsers(page, size);
          console.log(response.data); // Log the response for debugging
      
          // Extract users and pagination info
          this.users = response.data.data.data; 
          this.currentPage = response.data.data.currentPage;
          this.totalPages = response.data.data.totalPages;
          localStorage.setItem("currentPage", this.currentPage);
          
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      },

    async addUser(userData) {
      try {
        await createUser(userData);
        this.loadUsers(this.currentPage);
      } catch (error) {
        console.error('Failed to create user:', error);
      }
    },

    async modifyUser(userId, userData) {
      try {
        await updateUser(userId, userData);
        this.loadUsers(this.currentPage); 
        this.selectedUser = null; 
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    },
    async removeUser(userId) {
      try {
        await deleteUser(userId);
        this.loadUsers(this.currentPage); 
        this.selectedUser = null; 
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    },

    setSelectedUser(user) {
      this.selectedUser = user;
    },

    clearSelectedUser() {
      this.selectedUser = null; 
    }
  }
});
