<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="header-container">
        <!-- Show the first image and make it clickable -->
        <h2 class="modal-title">
          Booking Details of Homestay {{ homestay.name }}
        </h2>

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
          <div class="total-amount">
            Total Amount: {{ formatVNDPrice(totalAmount) }} VND
          </div>
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
        <button
          class="btn confirm"
          @click="handleConfirmBooking"
          :disabled="loading"
        >
          {{ loading ? "Processing..." : "Confirm Booking" }}
        </button>
        <button class="btn cancel" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import vnPayImage from "@/assets/vnpay.png";
import paypalImage from "@/assets/paypal.png";
import codImage from "@/assets/cod.png";
import { formatVNDPrice } from "@/utils/currencyUtils";
import { createBooking } from "@/services/bookingService"; // Adjust path as needed
import { createVnPayPayment } from "@/services/paymentService"; // Adjust path as needed

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  homestay: {
    type: Object,
    required: true,
  },
  guests: {
    type: Number,
    required: false, 
  },
  checkin: {
    type: String,
    required: false,
  },
  checkout: {
    type: String,
    required: false, 
  },
});

const loading = ref(false);
const showGallery = ref(false);

const closeGallery = () => {
  showGallery.value = false;
};

const totalAmount = computed(() => {
  if (checkin.value && checkout.value) {
    const checkInDate = new Date(checkin.value);
    const checkOutDate = new Date(checkout.value);
    const days = (checkOutDate - checkInDate) / (1000 * 3600 * 24);
    return days * props.homestay.price; 
  }
  return ""; 
});

const getPaymentImage = (method) => {
  switch (method) {
    case "vnPay":
      return vnPayImage;
    case "paypal":
      return paypalImage; 
    case "cod":
      return codImage; 
    default:
      return "";
  }
};

const emit = defineEmits(["onClose"]);

const guests = ref(props.guests || ""); 
const checkin = ref(props.checkin || ""); 
const checkout = ref(props.checkout || ""); 
const name = ref("");
const email = ref("");
const phone = ref("");
const paymentMethod = ref("");

function closeModal() {
  emit("onClose");
}

const handleConfirmBooking = async () => {
  loading.value = true; 
  try {
    // Step 1: Create the booking request body
    const bookingData = {
      guests: guests.value,
      checkinDate: checkin.value,
      checkoutDate: checkout.value,
      contactName: name.value,
      contactEmail: email.value,
      contactPhone: phone.value,
      homestayId: props.homestay.id,
    };

    const bookingResponse = await createBooking(bookingData);
    const bookingId = bookingResponse.data.bookingId;
    const amount = bookingResponse.data.totalAmount;

    const paymentResponse = await createVnPayPayment(
      amount,
      bookingId
    );

      window.location.href = paymentResponse.data.paymentUrl;
  } catch (error) {
    console.error("Error during booking or payment:", error);
  } finally {
    loading.value = false; 
  }
};

</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  gap: 10px; 
}

.homestay-header-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  cursor: pointer; 
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(0.4px); 
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease; 
  z-index: 5; 
}

.modal-content {
  background: rgba(225, 221, 218, 0.9); 
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px; 
  border: 2px solid #1c0707; 
}

.modal-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
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
  width: 190px;
  height: 47px; 
  margin-left: 36px;
  object-fit: cover; 
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
  z-index: 10; /* Make sure the modal is on top */
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

.total-amount {
  font-size: 1.1em; /* Slightly larger font size for emphasis */
  color: #ffffff; /* White text color for contrast */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Deeper shadow for depth */
  border-radius: 3px; /* Rounded corners */
  background-color: #685c2d; /* Bright blue background color */
  text-align: center; /* Center the text for better presentation */
  font-family: "Arial", sans-serif; /* Set a clean, modern font */
}
</style>
