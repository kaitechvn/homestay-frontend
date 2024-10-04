<template>
  <!-- Filter Section -->
  <div class="filter-section">
    <div class="inline-filters">
      <!-- Top Inline Filters (Guests, Location, Price Range) -->
      <div class="inline-fields-top">
        <!-- Guests Filter -->
        <div class="inline-field">
          <select v-model="filters.guests" class="filter-select">
            <option
              v-for="option in guestOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
        </div>

        <!-- District Filter -->
        <div class="inline-field">
          <select v-model="filters.districtId" class="filter-select">
            <option value="">District</option>
            <!-- Placeholder Option -->
            <option
              v-for="district in districtId"
              :key="district.id"
              :value="district.id"
            >
              {{ district.name }}
            </option>
          </select>
        </div>

        <!-- Price Filters -->
        <div class="inline-field">
          <select
            v-model="selectedPriceRange"
            @change="updatePriceRange"
            class="filter-select"
          >
            <option value="">Price Range</option>
            <option
              v-for="range in priceRanges"
              :key="range.id"
              :value="range.id"
            >
              {{ range.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bottom Inline Filters (Check-In, Check-Out) -->
    <div class="inline-fields-bottom">
      <!-- Check-In Date Filter -->
      <div class="inline-field">
        <input
          v-model="filters.checkIn"
          placeholder="Check-In"
          type="date"
          class="inline-input"
        />
      </div>

      <!-- Check-Out Date Filter -->
      <div class="inline-field">
        <input
          v-model="filters.checkOut"
          placeholder="Check-Out"
          type="date"
          class="inline-input"
        />
      </div>
      <button @click="searchHomestays" class="filter-button">Search</button>
      <button @click="resetFilters" class="filter-button">Reset</button>
    </div>
  </div>

  <!-- Homestay List -->
  <div ref="homestayList">
    <ul class="homestay-list">
      <li
        v-for="homestay in homestays"
        :key="homestay.id"
        class="homestay-item"
      >
        <div class="homestay-details">
          <div class="homestay-avatar">
            <img
              v-if="homestay.images && homestay.images.length > 0"
              :src="homestay.images[0].url"
              alt="Homestay Avatar"
              class="avatar-image"
            />
            <img
              v-else
              src="@/assets/default.png"
              alt="Default Homestay Icon"
              class="avatar-image"
            />
          </div>
          <div class="homestay-info">
            <h2 class="homestay-name">{{ homestay.name }}</h2>
            <p class="homestay-address">
              <!-- Font Awesome location icon -->
              <i class="fas fa-map-marker-alt"></i> {{ homestay.address }}
            </p>

            <p class="homestay-price">
              <!-- Font Awesome money icon -->
              <img src="@/assets/money.png" alt="Icon" class="custom-icon" />
              <strong>
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
            </p>

            <div class="homestay-rating">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{
                  filled: star <= Math.floor(homestay.rating),
                  half: star === Math.ceil(homestay.rating),
                }"
              >
                <i
                  v-if="star <= Math.floor(homestay.rating)"
                  class="fas fa-star"
                ></i>
                <i
                  v-else-if="star === Math.ceil(homestay.rating)"
                  class="fas fa-star-half-alt"
                ></i>
                <i v-else class="far fa-star"></i>
              </span>
              <span class="rating-value"
                >({{ homestay.rating.toFixed(1) }})</span
              >
            </div>
            <div class="review-container">
              <i class="fas fa-comment-alt review-icon"></i>

              <span class="review-count"
                >{{ homestay.reviewCount }} reviews</span
              >
            </div>
          </div>

          <div>
            <p class="homestay-description">
              {{ homestay.description }}
            </p>

            <span class="detail">
              <i class="fas fa-bed"></i>
              <span class="value">{{ homestay.bedrooms }} Bedrooms</span>
            </span>

            <span class="detail">
              <i class="fas fa-bath"></i>
              <span class="value">{{ homestay.bathrooms }} Bathrooms</span>
            </span>

            <span class="detail">
              <i class="fas fa-user-friends"></i>
              <span class="value">{{ homestay.guests }} Max Guests</span>
            </span>

            <div class="button-container">
              <button class="view-details" @click="viewDetails(homestay)">
                <i class="fas fa-info-circle"></i> View Details
              </button>

              <button class="book-now" @click="openBookingModal(homestay)">
                <i class="fas fa-home"></i> Book Now
              </button>
            </div>

            <div class="map-container">
              <button class="show-map" @click="openMap(homestay)">
                <img src="@/assets/map.png" class="map-icon" />Show the location
              </button>
            </div>
          </div>

          <BookingModal
            :isVisible="isModalVisible"
            :homestay="selectedHomestay"
            @onClose="closeBookingModal"
          />
        </div>
      </li>
    </ul>
  </div>
  <Pagination
    :currentPage="currentPage"
    :totalPages="totalPages"
    @page-changed="loadHomestays"
  />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHomestayUserStore } from "@/stores/homestayUserStore";
import Pagination from "@/components/Pagination.vue";
import BookingModal from "@/components/booking/BookingModal.vue";
import { DISTRICTS } from "@/constants/districts";
import { PRICE_RANGES } from "@/constants/prices";
import { guestOptions } from "@/constants/guests";
import { useCurrencyStore } from "@/stores/currencyStore";
import { fetchExchangeRate, formattedPrice } from "@/utils/currencyUtils";

const getExchangeRate = async () => {
  exchangeRate.value = await fetchExchangeRate();
};

const route = useRoute();
const router = useRouter();
const currencyStore = useCurrencyStore(); 
const exchangeRate = ref(0); 
const homestayUserStore = useHomestayUserStore();
const currentPage = computed(() => homestayUserStore.currentPage);
const totalPages = computed(() => homestayUserStore.totalPages);
const homestays = computed(() => homestayUserStore.homestays);
const selectedHomestay = computed(() => homestayUserStore.selectedHomestay);
const { filterHomestays, setSelectedHomestay, clearSelectedHomestay } =
  homestayUserStore;

const districtId = ref(DISTRICTS);

const filters = ref({
  page: 1,
  size: 5,
  minPrice: "",
  maxPrice: "",
  guests: "",
  checkIn: "",
  checkOut: "",
  districtId: route.query.districtId || "",
});

const homestayList = ref(null);

onMounted(async () => {
  await filterHomestays(filters.value);
  getExchangeRate();
});

const searchHomestays = () => {
  homestayUserStore.filters = { ...filters.value };
  filterHomestays(homestayUserStore.filters);

  if (homestayList.value) {
    homestayList.value.scrollIntoView({ behavior: "smooth" });
  }
};

const resetFilters = () => {
  filters.value = {
    minPrice: "",
    maxPrice: "",
    guests: "",
    checkIn: "",
    checkOut: "",
    districtId: "",
    rating: "",
  };
  homestayUserStore.filters = { ...filters.value };
  filterHomestays(homestayUserStore.filters);
};

const priceFormatter = (price) => {
  return formattedPrice(
    price,
    currencyStore.currentCurrency,
    exchangeRate.value
  );
};

const isModalVisible = ref(false);

const openBookingModal = (homestay) => {
  setSelectedHomestay(homestay);
  isModalVisible.value = true;
};


const closeBookingModal = () => {
  isModalVisible.value = false;
  clearSelectedHomestay();
};

const viewDetails = (homestay) => {
  router.push({ name: 'HomestayDetail', params: { id: homestay.id } }).then(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  });
};
const loadHomestays = (newPage) => {
  filters.value.page = newPage; 
  filterHomestays(filters.value); 
};

function openMap(homestay) {
  const location = encodeURIComponent(`${homestay.name} ${homestay.address}`); 
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location}`;
  window.open(googleMapsUrl, "_blank"); 
}

const selectedPriceRange = ref("");

const priceRanges = PRICE_RANGES;

const updatePriceRange = () => {
  const selectedRange = priceRanges.find(
    (range) => range.id === selectedPriceRange.value
  );

  if (selectedRange) {
    filters.value.minPrice = selectedRange.min;
    filters.value.maxPrice = selectedRange.max;
  } else {
    filters.value.minPrice = null;
    filters.value.maxPrice = null;
  }
};


</script>

<style scoped>
.filter-section {
  background-image: url("@/assets/background.png");
  background-size: cover; /* Make the background image cover the full width and height */
  background-position: center -260px; /* Move the image down by 20px */
  height: 240px; /* Set a fixed height for the section */
  border-radius: 5px;
  color: rgb(50, 2, 2);
  margin-bottom: 30px;
  opacity: 0.9;
  margin-top: -4.8px;
  background-repeat: no-repeat; /* Prevent the background image from repeating */
}

.title {
  font-size: 2.1em;
  margin-bottom: 30px;
  text-align: center;
}

.inline-filters {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

/* Group for Guests, Location, and Price Range */
.inline-fields-top {
  margin-top: 30px;
  margin-left: 27px;
  display: flex;
  gap: 10px;
  justify-content: center; /* Center the fields horizontally */
  width: 100%; /* Set full width to align items properly */
  /* Reduce the gap between the fields */
}

/* Group for Check-In and Check-Out */
.inline-fields-bottom {
  justify-content: center; /* Center the fields horizontally */
  display: flex;
  width: 100%;
  gap: 10px;
}

.inline-field {
  flex: 1;
  max-width: 160px; /* Optional: limit the width of each input field */
}

.inline-field:nth-child(1) .filter-select {
  width: 157px; /* Set a smaller width for the Price Range dropdown */
}

.inline-field:nth-child(2) .filter-select {
  width: 157px; /* Set a smaller width for the Price Range dropdown */
}

.filter-select,
.inline-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  min-width: 50px; /* Set a minimum width to ensure it's usable */
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.filter-button {
  background-color: #f6e48a;
  color: rgb(1, 17, 20);
  padding: 10px;
  height: 45px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
}

.filter-button:hover {
  background-color: #b1b400;
}

.homestay-list {
  list-style-type: none;
  padding: 0;
  margin-left: 100px;
}

.homestay-left {
  display: flex;
  flex: 1; /* Allow it to grow and fill available space */
}

.homestay-item {
  display: flex; /* Use flexbox for horizontal alignment */
  align-items: center; /* Center items vertically */
  margin-bottom: 30px; /* Space between items */
  position: relative; /* Position relative for the pseudo-element */
  padding-bottom: 20px;
  padding-top: -10px;
}

.homestay-item:not(:last-child)::after {
  content: ""; /* Necessary for pseudo-element */
  display: block; /* Make it a block element */
  height: 0.8px; /* Set the height of the line */
  background-color: #ada888; /* Light gray color for the line */
  width: 97%; /* Make it span the full width */
  position: absolute; /* Position absolute to align with the item */
  bottom: 0; /* Align to the bottom of the item */
  left: 0; /* Start from the left */
}

.homestay-details {
  display: flex; /* Flexbox for details */
}

.homestay-avatar {
  flex-shrink: 0; /* Prevent shrinking */
  margin-right: 15px; /* Space between image and details */
}

.avatar-image {
  width: 230px; /* Set the width of the image */
  height: 180px; /* Set the height of the image */
  object-fit: cover; /* Maintain aspect ratio */
  border-radius: 5px; /* Optional: rounded corners */
}

.homestay-info {
  display: flex;
  flex-direction: column; /* Stack details vertically */
  width: 350px; /* Set a fixed width for the homestay-info section (adjust as needed) */
}

.homestay-name {
  font-size: 1.7em;
}

.homestay-address {
  display: flex;
  align-items: center;
  font-style: italic;
}

.homestay-price {
  margin: 5px 0;
  font-size: 1.2em; /* Adjust size as needed */
  color: #044a14;
}

.homestay-address i {
  margin-right: 8px;
  color: #ff6347; /* Optional: change the color of the icon */
}

.homestay-price i {
  margin-right: 5px;
}

.homestay-rating {
  margin: 5px 0; /* Add some margin for spacing */
}

.star,
.star.half {
  font-size: 16px; /* Adjust size as needed */
  color: #f0a511; /* Gold color for stars */
}

.rating-value {
  margin-left: 8px; /* Space between stars and rating text */
  font-size: 14px; /* Adjust size as needed */
  color: #7f0d0d; /* Color for the rating text */
  font-style: italic;
}

.view-details-button {
  background-color: #28a745;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.view-details-button:hover {
  background-color: #218838;
}

.custom-icon {
  width: 30px; /* Adjust width as needed */
  height: 30px; /* Adjust height as needed */
  margin-right: 10px;
  margin-bottom: 5px;
}

.review-icon {
  width: 14px; /* Adjust icon size as needed */
  height: 13px;
  margin-right: 5px; /* Space between icon and review count */
}

.review-count {
  font-size: 16px;
  color: #666;
}

.homestay-description {
  max-width: 500px; /* Set the maximum width for one line (adjust as needed) */
  white-space: normal; /* Allow text to wrap normally */
  overflow-wrap: break-word; /* Allow long words to break and wrap onto the next line */
  line-height: 1.5; /* Optional: Adjust line height for better readability */
  font-size: 0.89em; /* Adjust size as needed */
}

.button-container {
  display: flex; /* Use flexbox to arrange buttons inline */
  margin-top: 10px; /* Add some space above the buttons */
  gap: 10px; /* Space between buttons */
  margin-left: 220px;
  margin-top: 15px;
}

.button-container button {
  display: flex; /* Use flex to align icon and text */
  align-items: center; /* Center align icon with text */
  padding: 6px 12px; /* Add padding for better button size */
  border: none; /* Remove default border */
  border-radius: 5px; /* Rounded corners */
  background-color: #b6976b; /* Change to a green background */
  color: white; /* Text color */
  cursor: pointer; /* Change cursor on hover */
  transition: background-color 0.3s, transform 0.2s; /* Smooth transition for hover effect */
}

.button-container button:hover {
  background-color: #7f5126; /* Darker green shade on hover */
  transform: translateY(-2px); /* Slight lift on hover */
}

.button-container button i {
  margin-right: 5px; /* Space between icon and text */
}

.detail {
  align-items: center; /* Center icon and text vertically */
  margin-right: 50px; /* Space between details */
  font-size: 0.9em;
  margin-left: 19px; /* Adjust size as needed */
}

.detail .value {
  margin-left: 5.5px; /* Space between icon and text */
}

.map-icon {
  width: 20px; /* Adjust the width as needed */
  height: 20px; /* Adjust the height as needed */
  margin-right: 5px; /* Space between icon and text */
}

.show-map {
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.show-map:hover {
  background-color: #e0e0e0; /* Change background on hover */
  transform: scale(1.05); /* Slightly enlarge the button on hover */
}

/* select  box */
option[disabled] {
  display: none;
}
</style>