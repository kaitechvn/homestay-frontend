<template>
  <div class="payment-failed-page">
    <div class="content-wrapper">
      <div class="icon-container">
        <img src="@/assets/failed-icon.svg" alt="Payment Failed" class="icon" />
      </div>
      <h1 class="title">Payment Failed</h1>
      <p class="description">
        Unfortunately, your payment could not be processed. You can try again or
        cancel the booking.
      </p>

      <div class="button-group">
        <button @click="goHome" class="btn btn-home">Return Home</button>
        <button @click="showPaymentMethods" class="btn btn-retry">
          Retry Payment
        </button>
        <button @click="cancel" class="btn btn-cancel">Cancel Booking</button>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h2>Select Payment Method</h2>
      <ul>
        <li @click="selectPaymentMethod('vnpay')">VNPAY</li>
        <li @click="selectPaymentMethod('paypal')">PAYPAL</li>
        <li @click="selectPaymentMethod('momo')">MOMO</li>
      </ul>
      <button @click="closeModal" class="btn btn-close"></button>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import PAGES from "@/constants/pages";
import { cancelBooking } from "@/services/bookingService";
import { createVnPayPayment } from "@/services/paymentService";

const router = useRouter();
const route = useRoute();
const showModal = ref(false);
const bookingId = route.query.bookingId;
const amount = route.query.amount;
const bankCode = null;

const goHome = () => {
  router.push(PAGES.HOME);
};

const cancel = () => {
  // Call API to cancel the booking
  cancelBooking(bookingId)
    .then(() => {
      // Show success message
      alert("Booking has been canceled successfully.");

      setTimeout(() => {
        router.push(PAGES.USER.BOOKING);
      }, 2000);
    })
    .catch((error) => {
      console.error("Failed to cancel booking:", error);
      alert("Something went wrong. Please try again.");
    });
};

const showPaymentMethods = () => {
  showModal.value = true;
};

// Method to close the modal
const closeModal = () => {
  showModal.value = false;
};

const selectPaymentMethod = async (method) => {
  closeModal();

  if (method === "vnpay") {
    const paymentResponse = await createVnPayPayment(
      amount,
      bankCode,
      bookingId
    );

    window.location.href = paymentResponse.data.paymentUrl;
  } else if (method === "momo") {
    router.push(`/retry-payment/momo`);
  } else if (method === "paypal") {
    router.push(`/retry-payment/paypal`);
  }
};
</script>
  
  <style scoped>
.payment-failed-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background-color: #1c1c1c;
  color: #fff;
}

.content-wrapper {
  text-align: center;
  padding: 20px;
  background-color: #9c8484;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.icon-container {
  margin-bottom: 20px;
}

.icon {
  width: 100px;
  height: auto;
}

.title {
  font-size: 28px;
  margin-bottom: 10px;
  color: #360d0d;
}

.description {
  margin-bottom: 20px;
  font-size: 16px;
  color: #ddd;
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn {
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.btn-home {
  background-color: #2c1212;
  color: #fff;
}

.btn-retry {
  background-color: #0b4a0d;
  color: #fff;
}

.btn-cancel {
  background-color: #d9534f;
  color: #fff;
}

.btn-home:hover {
  background-color: #4a2c2f; /* Slightly darker red */
}

.btn-retry:hover {
  background-color: #2e6730; /* Slightly darker green */
}

.btn-cancel:hover {
  background-color: #c9302c; /* Slightly darker cancel color */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-content ul {
  list-style-type: none;
  padding: 0;
}

.modal-content ul li {
  padding: 10px;
  background-color: #f4f4f4;
  margin: 10px 0;
  cursor: pointer;
}

.btn-close {
  color: #fff;
  margin-top: 10px;
}
</style>
  