<template>
  <div class="homepage">
    <!-- Introduction Section -->
    <section class="introduction">
      <div class="intro-text">
        <h1>We are VMO Homestay</h1>
        <p>
          Discover amazing homestays around Ha Noi. Find the best places to stay
          and enjoy an unforgettable experience. My name is Bui Quoc Khai -
          author of this website
        </p>
        <div class="button-container">
          <button @click="goToHomestays" class="btn-primary">
            <img src="@/assets/logo-home.png" alt="Icon" class="button-icon" />
            Explore Homestays
          </button>
          <button
            v-if="!isAuthenticated"
            @click="promptSignIn"
            class="btn-primary"
          >
            <img src="@/assets/sign-up.png" alt="Icon" class="button-icon" />
            Sign Up / Sign In for Booking
          </button>
          <button
            v-if="isAuthenticated"
            @click="goToTopRated"
            class="btn-primary"
          >
            <img src="@/assets/toprated.png" alt="Icon" class="button-icon" />
            Top Rated
          </button>
          <button
            v-if="isAuthenticated"
            @click="goToTrending"
            class="btn-primary"
          >
            <img src="@/assets/trending.png" alt="Icon" class="button-icon" />
            Trending
          </button>
        </div>
      </div>
    </section>

    <section class="districts">
      <h2>Discover Homestays by District</h2>
      <div class="district-list">
        <div
          v-for="district in districts"
          :key="district.id"
          class="district-item"
          @click="filterByDistrict(district)"
        >
          <img :src="district.image" :alt="district.name" />
          <p>{{ district.name }}</p>
        </div>
      </div>
    </section>

    <section id="top-rated" class="top-rated">
      <h2>Top Rated Homestays</h2>

      <div class="special-homestays">
        <!-- First special homestay -->
        <div v-if="topRatedHomestays.length > 0" class="homestay-item special">
          <img
            v-if="
              topRatedHomestays[0].images &&
              topRatedHomestays[0].images.length > 0
            "
            :src="topRatedHomestays[0].images[0].url"
            alt="Homestay Avatar"
            class="special-homestay-img"
          />
          <img v-else src="@/assets/default.png" alt="Default Homestay Icon" />
          <div class="homestay-info">
            <img
              src="@/assets/medal1.png"
              alt="Medal Icon"
              class="medal-icon"
              style="width: 50px; height: 50px; margin-bottom: 9px"
            />
            <h3>{{ topRatedHomestays[0].name }}</h3>

            <span class="star-icon">⭐</span>
            <!-- Replace this with your star icon -->
            {{ topRatedHomestays[0].rating }} -
            {{ topRatedHomestays[0].reviewCount }} reviews
          </div>
        </div>

        <div v-if="topRatedHomestays.length > 1" class="homestay-item special">
          <img
            v-if="
              topRatedHomestays[1].images &&
              topRatedHomestays[1].images.length > 0
            "
            :src="topRatedHomestays[1].images[0].url"
            alt="Homestay Avatar"
            class="special-homestay-img"
          />
          <img v-else src="@/assets/default.png" alt="Default Homestay Icon" />
          <div class="homestay-info">
            <img
              src="@/assets/medal2.png"
              alt="Medal Icon"
              class="medal-icon"
              style="width: 50px; height: 50px; margin-bottom: 9px"
            />
            <h3>{{ topRatedHomestays[1].name }}</h3>
            <span class="star-icon">⭐</span>
            <!-- Replace this with your star icon -->
            {{ topRatedHomestays[1].rating }} -
            {{ topRatedHomestays[1].reviewCount }} reviews
          </div>
        </div>
      </div>

      <div class="slider-container">
        <button class="prev-btn" @click="slidePrev">
          <i class="fas fa-chevron-left"></i>
          <!-- Left arrow icon -->
        </button>
        <div class="homestay-list">
          <div
            v-for="homestay in topRatedHomestays.slice(2)"
            :key="homestay.id"
            class="homestay-item"
          >
            <img
              v-if="homestay.images && homestay.images.length > 0"
              :src="homestay.images[0].url"
              alt="Homestay Avatar"
              
            />
            <img
              v-else
              src="@/assets/default.png"
              alt="Default Homestay Icon"
            />
            <div class="homestay-info">
              <h3>{{ homestay.name }}</h3>
              <span class="star-icon">⭐</span>
              <!-- Replace this with your star icon -->
              {{ homestay.rating }} - {{ homestay.reviewCount }} reviews
            </div>
          </div>
        </div>
        <button class="next-btn" @click="slideNext">
          <i class="fas fa-chevron-right"></i>
          <!-- Right arrow icon -->
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import PAGES from "@/constants/pages";
import { useRouter } from "vue-router";
import { DISTRICTS } from "@/constants/districts";
import { useHomestayUserStore } from "@/stores/homestayUserStore";
import { onMounted, computed } from "vue";

const homestayUserStore = useHomestayUserStore();
const { fetchTopRatedHomestays } = homestayUserStore;
const router = useRouter();
const districts = DISTRICTS;
const topRatedHomestays = computed(() => homestayUserStore.topRatedHomestays);

const goToHomestays = () => {
  router.push(PAGES.USER.HOMESTAY);
};

const promptSignIn = () => {
  router.push(PAGES.LOGIN);
};

const goToTopRated = () => {
  document.getElementById("top-rated").scrollIntoView({ behavior: "smooth" });
};

const filterByDistrict = (district) => {
  router.push({ path: "/homestay", query: { districtId: district.id } }); // Pass districtId as query param
};

const isAuthenticated = computed(() => {
  return localStorage.getItem("userRole") !== null; // Adjust the key as per your implementation
});

onMounted(async () => {
  await fetchTopRatedHomestays();
});

let scrollPosition = 0;
const slidePrev = () => {
  const slider = document.querySelector(".homestay-list");
  const slideWidth = slider.clientWidth;
  scrollPosition -= slideWidth;
  if (scrollPosition < 0) scrollPosition = 0;
  slider.scrollTo({ left: scrollPosition, behavior: "smooth" });
};

const slideNext = () => {
  const slider = document.querySelector(".homestay-list");
  const slideWidth = slider.clientWidth;
  const maxScrollPosition = slider.scrollWidth - slider.clientWidth;
  scrollPosition += slideWidth;
  if (scrollPosition > maxScrollPosition) scrollPosition = maxScrollPosition;
  slider.scrollTo({ left: scrollPosition, behavior: "smooth" });
};
</script>

<style scoped>
.homepage {
  font-family: Arial, sans-serif;
}

/* Introduction Section */
.introduction {
  position: relative; /* Set position for pseudo-element */
  text-align: center;
  background: url("@/assets/hanoi-homestay1.jpg") no-repeat center
    calc(50% - 115px) / cover;
  /* background-position: center -1px; */
  color: white;
  padding: 60px 20px; /* Reduced height */
}

/* Dark overlay using pseudo-element */
.introduction::before {
  content: ""; /* Required for pseudo-element */
  position: absolute; /* Position it absolutely within .introduction */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(46, 35, 35, 0.5); /* Black overlay with 50% opacity */
  z-index: 1; /* Place it below the text */
}

.intro-text {
  max-width: 600px;
  margin: 0 auto;
  position: relative; /* Ensure the text is above the overlay */
  z-index: 2; /* Place it above the overlay */
  text-shadow: 1.7px 2.1px 3.2px rgba(14, 12, 12, 0.7); /* Subtle black shadow for contrast */
}

.button-container {
  display: flex; /* Display buttons inline */
  justify-content: center; /* Center them horizontally */
  gap: 25px; /* Add space between buttons */
}

.btn-primary {
  display: flex;
  align-items: center; /* Align items vertically */
  background-color: #694125eb;
  color: white;
  border: none;
  border-radius: 30px; /* Makes the button rounded */
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s; /* Added transform transition */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Adds a shadow for a modern look */
}

.btn-primary:hover {
  background-color: #886822;
  transform: translateY(-2px); /* Slightly lifts the button on hover */
}

.button-icon {
  width: 33px; /* Adjust as needed */
  height: 33px; /* Adjust as needed */
  margin-right: 5px; /* Space between icon and text */
}

/* Districts Section */
.districts {
  text-align: center;
  padding: 50px 20px;
  background-color: #f4eded;
}

.district-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.district-item {
  cursor: pointer;
  margin: 10px;
  text-align: center;
}

.district-item img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.district-item img:hover {
  transform: scale(1.05); /* Scale up the image */
}

.district-item p {
  margin-top: 8px;
  font-weight: bold;
  font-size: 1.1em;
}

/* Top Rated Homestays Section */
.top-rated {
  text-align: center;
  padding: 50px 20px;
  background-color: #ebe9e7;

}

.special-homestays {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 0px;
}

.special-homestays .special {
  flex: 1 1 calc(50% - 16px);
  box-sizing: border-box;
  padding: 16x;
  background-color: #f5e1cee6;
  border-radius: 36px;
}

.slider-container {
  position: relative;
}

.homestay-list {
  display: flex;
  overflow: hidden; 
  scroll-behavior: smooth;
}

.homestay-info {
  margin-top: 15px;
}

.homestay-item {
  flex: 0 0 calc(33.33% - 16px); 
  box-sizing: border-box;
  padding: 16px;
  background-color: #ebe9e7;
  transition: transform 0.3s ease;
  margin-right: 16px;
}

.homestay-item img {
  width: 84%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for a modern look */
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}

.special-homestay-img {
  height: 260px !important;
  object-position: center 74%; /* Adjust the position to pull the image down */
}

.prev-btn,
.next-btn {
  position: absolute;
  top: 42%;
  transform: translateY(-50%);
  background-color: #362210;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
  border-radius: 14px;
}

.prev-btn {
  left: -6px;
}

.next-btn {
  right: 10px;
}
</style>
