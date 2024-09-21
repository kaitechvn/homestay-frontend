<template>
  <div v-if="user">
    <h1>Personal Details</h1>
    <p><strong>Username:</strong> {{ user.username }}</p>
    <p><strong>First Name:</strong> {{ user.firstName }}</p>
    <p><strong>Last Name:</strong> {{ user.lastName }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>Phone:</strong> {{ user.phone }}</p>
    <p><strong>Date of Birth:</strong> {{ user.dob }}</p>
  </div>
  <div v-else>
    <p>No user details available. Please log in.</p>
  </div>
</template>
  
<script>
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "PersonalDetails",
  setup() {
    const authStore = useAuthStore();
    const user = authStore.user;

    return {
      user,
    };
  },
};
</script>
  