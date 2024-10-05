<template>
  <div class="homestay-detail-container">
    <div class="homestay-detail">
      <div class="base-details-section">
        <h1>{{ homestay.name }}</h1>
        <div class="base-details-inline">
          <div>Location: {{ homestay.address }}</div>

          <div class="rating-reviews">
            <span>Rating: {{ homestay.rating }} / 5</span>
            <span>({{ homestay.reviewCount }} reviews)</span>
          </div>
        </div>
      </div>

      <div class="images-section">
        <!-- Main Image -->
        <img
          :src="currentImage.url"
          alt="Main Homestay Image"
          class="main-homestay-image"
        />

        <!-- Thumbnail Images -->
        <div class="thumbnail-container">
          <button class="arrow-button" @click="prevImage">&lt;</button>

          <img
            v-for="(image, index) in displayedImages"
            :key="index"
            :src="image.url"
            alt="Homestay Image"
            class="homestay-image"
            :class="{ active: currentImage.url === image.url }"
            @click="setCurrentImage(image)"
          />

          <button class="arrow-button" @click="nextImage">&gt;</button>
          <button
            class="show-all-button"
            v-if="homestay.images && homestay.images.length > 0"
            @click="showGallery = true"
          >
            Show All Photos
          </button>
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
      </div>

      <div class="content-section">
        <h2>Description</h2>
        <p>{{ homestay.description }}</p>

        <h3>Details</h3>
        <ul>
          <li>Bedrooms: {{ homestay.bedrooms }}</li>
          <li>Bathrooms: {{ homestay.bathrooms }}</li>
          <li>Rules: {{ homestay.rules }}</li>
        </ul>
      </div>

      
      <div v-if="homestay.id">
        <Review :homestayId="homestay.id" />
      </div>
    </div>

    <!-- Payment Section -->
    <div class="payment-section card">
      <h2 class="payment-title">Payment</h2>

      <!-- Homestay Price and Currency -->
      <div class="price-section">
        <span class="label">Price: </span>
        <strong class="price">
          {{ priceFormatter(homestay.price) }}
          {{
            currencyStore.currentCurrency === "VND"
              ? "VND/night"
              : currencyStore.currentCurrency === "USD"
              ? "USD/night"
              : currencyStore.currentCurrency === "JPY"
              ? "JPY/night"
              : ""
          }}
        </strong>
      </div>

      <!-- Guests Input -->
      <div class="form-group">
        <label for="guests">Guests:</label>
        <input
          type="number"
          v-model="guests"
          id="guests"
          min="1"
          class="input-field"
        />
      </div>

      <!-- Check-in Input -->
      <div class="form-group">
        <label for="checkin">Check-in:</label>
        <input type="date" v-model="checkin" id="checkin" class="input-field" />
      </div>

      <!-- Check-out Input -->
      <div class="form-group">
        <label for="checkout">Check-out:</label>
        <input
          type="date"
          v-model="checkout"
          id="checkout"
          class="input-field"
        />
      </div>

      <!-- Total Amount -->
      <div class="total-amount-section">
        <p class="total-label">Total Amount:</p>
        <p class="total-price">
          {{ priceFormatter(totalAmount) }}
          {{
            currencyStore.currentCurrency === "VND"
              ? "VND"
              : currencyStore.currentCurrency === "USD"
              ? "USD"
              : currencyStore.currentCurrency === "JPY"
              ? "JPY"
              : ""
          }}
        </p>
      </div>

      <!-- Book Now Button -->
      <button class="btn-primary" @click="showBookingModal">Book Now</button>
    </div>

    <BookingModal
      v-if="isModalVisible"
      :isVisible="isModalVisible"
      :homestay="homestay"
      :guests="guests"
      :checkin="checkin"
      :checkout="checkout"
      @onClose="closeBookingModal"
    />

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close-button" @click="closeModal">&times;</span>
        <div class="modal-images-section">
          <img
            v-for="(image, index) in homestay.images"
            :key="index"
            :src="image.url"
            alt="Homestay Image"
            class="modal-homestay-image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useHomestayUserStore } from "@/stores/homestayUserStore";
import BookingModal from "@/components/booking/BookingModal.vue";
import { useCurrencyStore } from "@/stores/currencyStore";
import { fetchExchangeRate, formattedPrice } from "@/utils/currencyUtils";
import Review from "@/components/Review.vue";

const currencyStore = useCurrencyStore();
const exchangeRate = ref(0);
const store = useHomestayUserStore();
const route = useRoute();
const homestayId = Number(route.params.id);
const currentImage = ref({});
const isModalOpen = ref(false);
const { fetchHomestayDetail } = store;

const getExchangeRate = async () => {
  exchangeRate.value = await fetchExchangeRate();
};

onMounted(async () => {
  try {
    await fetchHomestayDetail(homestayId);
    currentImage.value = store.homestayDetail.images[0] || {};
    getExchangeRate();
  } catch (error) {
    console.error("Failed to fetch homestay details:", error);
  }
});

const homestay = computed(() => {
  return store.homestayDetail || { images: [] };
});

const guests = ref(1);
const checkin = ref("");
const checkout = ref("");

const isModalVisible = ref(false);

const showBookingModal = () => {
  isModalVisible.value = true;
};

const setCurrentImage = (image) => {
  currentImage.value = image;
};

const startIndex = ref(0); // Track the starting index for visible images
const visibleThumbnailsCount = 5; // Number of thumbnails to display at a time

// Function to go to the next image in the current displayed images or move to the next set of images
const nextImage = () => {
  const currentImageIndex = homestay.value.images.findIndex(
    (image) => image.url === currentImage.value.url
  );

  // Check if the current image is the last one in the displayed set of thumbnails
  const lastDisplayedIndex = startIndex.value + visibleThumbnailsCount - 1;

  // If the current image is not the last in the displayed set, go to the next one
  if (
    currentImageIndex < lastDisplayedIndex &&
    currentImageIndex < homestay.value.images.length - 1
  ) {
    currentImage.value = homestay.value.images[currentImageIndex + 1];
  } else if (
    startIndex.value + visibleThumbnailsCount <
    homestay.value.images.length
  ) {
    // Calculate remaining images
    const remainingImages =
      homestay.value.images.length -
      (startIndex.value + visibleThumbnailsCount);

    // Move startIndex forward, if the remaining images are less than `visibleThumbnailsCount`, show them all
    startIndex.value += Math.min(
      visibleThumbnailsCount,
      remainingImages + visibleThumbnailsCount
    );

    // Set the next image to the first image of the next set
    currentImage.value = homestay.value.images[startIndex.value];
  }
};

// Display only the current set of images based on startIndex
const displayedImages = computed(() => {
  if (
    Array.isArray(homestay.value.images) &&
    homestay.value.images.length > 0
  ) {
    const remainingImages = homestay.value.images.length - startIndex.value;
    // If remaining images are less than `visibleThumbnailsCount`, show only the remaining images
    return homestay.value.images.slice(
      startIndex.value,
      startIndex.value + Math.min(visibleThumbnailsCount, remainingImages)
    );
  }
  return [];
});

// Function to go to the previous set of images
const prevImage = () => {
  const currentImageIndex = homestay.value.images.findIndex(
    (image) => image.url === currentImage.value.url
  );

  // Check if the current image is the first one in the displayed set of thumbnails
  const firstDisplayedIndex = startIndex.value;

  if (currentImageIndex > firstDisplayedIndex) {
    // Go to the previous image in the same set
    currentImage.value = homestay.value.images[currentImageIndex - 1];
  } else if (startIndex.value > 0) {
    // Move to the previous set of thumbnails if available
    startIndex.value = Math.max(startIndex.value - visibleThumbnailsCount, 0);

    // Set the previous image to the last image of the previous set
    const newCurrentIndex = startIndex.value + visibleThumbnailsCount - 1;
    currentImage.value =
      homestay.value.images[
        Math.min(newCurrentIndex, homestay.value.images.length - 1)
      ];
  }
};

const showGallery = ref(false);

const closeGallery = () => {
  showGallery.value = false;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const closeBookingModal = () => {
  isModalVisible.value = false;
};

const totalAmount = computed(() => {
  if (checkin.value && checkout.value) {
    const checkInDate = new Date(checkin.value);
    const checkOutDate = new Date(checkout.value);
    const days = (checkOutDate - checkInDate) / (1000 * 3600 * 24);
    return days * homestay.value.price;
  }
  return "";
});

const priceFormatter = (price) => {
  return formattedPrice(
    price,
    currencyStore.currentCurrency,
    exchangeRate.value
  );
};
</script>


<style scoped>
.homestay-detail-container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  margin-top: -5px;
}

.base-details-section {
  margin-bottom: 2px;
}

.base-details-section h1 {
  font-size: 2rem;
  margin-bottom: 0px;
}

.base-details-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-reviews {
  display: flex;
  gap: 10px;
  margin-right: 10px;
}

.homestay-detail {
  flex: 1;
  margin-right: 8px;
}

.images-section {
  margin-bottom: 20px;
}

.main-homestay-image {
  width: 99%;
  max-width: 840px;
  height: auto;
  max-height: 320px;
  object-fit: fill;
  border-radius: 10px;
  margin-bottom: 10px;
  object-position: center 67%; /* Center the focal point */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative; /* Make the container relative to position the button inside it */
}

.homestay-image {
  width: 110px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
}

.arrow-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #333;
}

.homestay-image.active {
  opacity: 0.8; /* Darken the active thumbnail */
  filter: brightness(0.8); /* Darken the active thumbnail */
  border: 9px solid #fffffff3;
}

.show-all-button {
  position: absolute; /* Position the button absolutely inside the thumbnail container */
  top: 20px;
  right: 25px; /* Fix the button to the right side */
  cursor: pointer;
  background-color: #ae6a4a;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  max-width: 80%; /* Set max width for modal */
  overflow-y: auto;
}

.modal-homestay-image {
  width: 100%;
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 10px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.content-section,
.reviews-section {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.payment-section {
  flex-basis: 300px;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  align-self: flex-start;
  position: sticky;
  top: 20px;
  background-color: #f0f0f0f3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.label {
  color: #555;
  font-size: 16px;
}

.price {
  font-size: 18px;
  color: #000;
  font-weight: bold;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 5px;
  font-size: 16px;
}

.input-field:focus {
  border-color: #4a90e2;
  outline: none;
}

.total-amount-section {
  border-top: 1px solid #eee;
  padding-top: 10px;
  text-align: right;
}

.total-label {
  font-size: 16px;
  color: #555;
}

.total-price {
  font-size: 20px;
  color: #000;
  font-weight: bold;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #357ab8;
}

h2 {
  margin-top: 0;
}

ul {
  list-style-type: none;
  padding: 0;
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
</style>
