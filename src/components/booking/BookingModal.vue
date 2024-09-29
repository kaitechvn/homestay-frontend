<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="header-container">
        <!-- Show the first image and make it clickable -->
        <h2 class="modal-title">Booking Details for  {{ homestay.name }}</h2>
        
        <img
          v-if="homestay.images && homestay.images.length > 0"
          :src="homestay.images[0].url"
          alt="Homestay Image"
          class="homestay-header-image"
          @click="showGallery = true"
        />
        <span
          class="overlay-text"
          v-if="homestay.images && homestay.images.length > 0"
          @click="showGallery = true"
          >More Images</span
        >
      </div>

      <div
        v-if="showGallery"
        class="image-gallery-overlay"
        @click.self="closeGallery"
      >
        <div class="image-gallery-modal">
          <button @click="closeGallery" class="close-button">Close</button>
          <div class="image-gallery">
            <img
              v-for="(image, index) in homestay.images"
              :key="index"
              :src="image.url"
              alt="Homestay Image"
              class="gallery-image"
            />
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="form-section">
          <form @submit.prevent="submitBooking">
            <div class="form-group">
              <label for="guests">Number of Guests:</label>
              <input type="number" v-model="guests" min="1" required />
            </div>
            <div class="form-group">
              <label for="checkin">Check-In Date:</label>
              <input type="date" v-model="checkin" required />
            </div>
            <div class="form-group">
              <label for="checkout">Check-Out Date:</label>
              <input type="date" v-model="checkout" required />
            </div>
            <div class="form-group">
              <label for="paymentMethod">Payment Method:</label>
              <select v-model="paymentMethod" required>
                <option value="" disabled>Select Payment Method</option>
                <option value="vnPay">VnPay</option>
                <option value="paypal">PayPal</option>
                <option value="cod">COD</option>
              </select>
            </div>
          </form>
        </div>

        <div class="form-section">
          <form @submit.prevent="submitBooking">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" v-model="name" required />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" v-model="email" required />
            </div>
            <div class="form-group">
              <label for="phone">Phone:</label>
              <input type="tel" v-model="phone" required />
            </div>
          </form>
          <div class="payment-image" v-if="paymentMethod">
            <img
              :src="getPaymentImage(paymentMethod)"
              alt="Payment Method Image"
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn confirm" @click="submitBooking">
          Confirm Booking
        </button>
        <button class="btn cancel" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import vnPayImage from "@/assets/vnpay.png";
import paypalImage from "@/assets/paypal.png";
import codImage from "@/assets/cod.png";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  homestay: {
    type: Object,
    required: true,
  },
});

const showGallery = ref(false);

// Function to close the gallery modal
const closeGallery = () => {
  showGallery.value = false;
};

// Function to return the corresponding image path based on selected payment method
const getPaymentImage = (method) => {
  switch (method) {
    case "vnPay":
      return vnPayImage; // Update with actual image path
    case "paypal":
      return paypalImage; // Update with actual image path
    case "cod":
      return codImage; // Update with actual image path
    default:
      return "";
  }
};

const emit = defineEmits(["onClose"]);

const guests = ref(1);
const checkin = ref("");
const checkout = ref("");
const name = ref("");
const email = ref("");
const phone = ref("");
const paymentMethod = ref("");

function closeModal() {
  emit("onClose");
}

function submitBooking() {
  console.log({
    guests: guests.value,
    checkin: checkin.value,
    checkout: checkout.value,
    name: name.value,
    email: email.value,
    phone: phone.value,
    paymentMethod: paymentMethod.value,
  });

  // Here, you can add your logic to send the booking data to your backend

  closeModal();
}
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust the gap between the image and the title */
}

.homestay-header-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer; /* Make the image clickable */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(0.4px); /* Apply a blur effect */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease; /* Smooth transition */
}

.modal-content {
  background: rgba(225, 221, 218, 0.9); /* Slightly opaque background */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px; /* Adjusted max-width for better sizing */
  border: 2px solid #1c0707; /* Add a colored border */
}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-section {
  flex: 1;
  margin-right: 15px;
}

.form-section:last-child {
  margin-right: 0; /* Remove margin for last section */
}

.form-group {
  margin-bottom: 15px;
}

input,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input:focus,
select:focus {
  border-color: #007bff; /* Change border color on focus */
  outline: none; /* Remove default outline */
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirm {
  background-color: #007bff;
  color: white;
}

.confirm:hover {
  background-color: #0056b3;
  transform: scale(1.05); /* Slightly grow on hover */
}

.cancel {
  background-color: #f44336;
  color: white;
  margin-left: 10px; /* Space between buttons */
}

.cancel:hover {
  background-color: #c62828;
  transform: scale(1.05); /* Slightly grow on hover */
}

.payment-image {
  margin-top: 40px;
}

.payment-image img {
  width: 190px; /* Fixed width */
  height: 47px; /* Fixed height */
  margin-left: 36px;
  object-fit: cover; /* Cover maintains aspect ratio while filling the space */
}

.image-gallery-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Make sure the modal is on top */
}

.image-gallery-modal {
  background: rgb(243, 237, 237);
  padding: 20px;
  border-radius: 10px;
  max-width: 95%; /* Increased width */
  max-height: 95%;
  overflow-y: auto;
  position: relative;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 10px;
  background: #da8946;
  color: white;
  border: none;
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 4px;
}

/* Gallery styles inside the modal */
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.gallery-image {
  width: 280px; /* Increased image width */
  height: 250px;
  object-fit: cover;
  border-radius: 5px;
}

.overlay-text {
  color: rgb(7, 5, 5);
  font-size: 15px;
  font-weight: bold;
  cursor: pointer; /* Add pointer cursor */
}
</style>
