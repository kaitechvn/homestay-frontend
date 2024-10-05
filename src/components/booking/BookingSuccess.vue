<template>
  <div class="booking-success">
    <div class="success-message">
      <!-- Success Icon/Illustration -->
      <img src="@/assets/success-icon.svg" alt="Booking Success" class="success-icon" />

      <!-- Success Text -->
      <h1>Booking Confirmed!</h1>
      <p>
        Your booking has been successfully confirmed.
        Thank you for trusting our homestay booking service!
      </p>

      <!-- Buttons for Navigation -->
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
  router.push({ path: PAGES.USER.BOOKING});
};
</script>

<style scoped>
.booking-success {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background-color: #272525;
  color: #f8f9fa;
}

.success-message {
  text-align: center;
  padding: 40px;
  background-color: #291a1a;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(16, 3, 3, 0.7);
  max-width: 550px;
}

.success-icon {
  width: 100px;
  margin-bottom: 20px;
}

h1 {
  color: #00d084; /* Success Green */
  margin-bottom: 10px;
  font-size: 32px;
}

p {
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

button:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .success-message {
    padding: 20px;
    max-width: 90%;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
