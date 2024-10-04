<template>
    <div class="booking-success">
      <div class="success-message">
        <h1>Booking Confirmed!</h1>
        <p>
          Your booking has been confirmed. Thank you for trusting our homestay booking service!
        </p>
        <div class="button-group">
          <button @click="goToHome" class="btn btn-primary">Return to Home</button>
          <button @click="goToBookingHistory" class="btn btn-secondary">View Booking History</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import PAGES from '@/constants/pages';
  
  const router = useRouter();
  
  // Redirect to homepage
  const goToHome = () => {
    router.push({ path: PAGES.HOME }); 
  };
  
  // Redirect to booking history page
  const goToBookingHistory = () => {
    router.push({ path: PAGES.USER.BOOKING }); 
  };
  </script>
  
  <style scoped>
  .booking-success {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 50px;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 100px auto;
    max-width: 500px;
  }
  
  .success-message {
    padding: 20px;
  }
  
  h1 {
    color: #28a745;
    margin-bottom: 10px;
  }
  
  p {
    margin-bottom: 20px;
    font-size: 18px;
    color: #333;
  }
  
  .button-group {
    display: flex;
    gap: 20px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  button:hover {
    opacity: 0.9;
  }
  </style>
  