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
          <button @click="promptSignIn" class="btn-primary">
            <img src="@/assets/sign-up.png" alt="Icon" class="button-icon" />
            Sign Up / Sign In for Booking
          </button>
        </div>
      </div>
    </section>

    <section class="districts">
      <h2>Discover Homestays by District</h2>
      <div class="district-list">
        <div v-for="district in districts" :key="district.id" class="district-item" @click="filterByDistrict(district)">
      <img :src="district.image" :alt="district.name" />
      <p>{{ district.name }}</p>
    </div>
      </div>
    </section>

    <!-- <section class="top-rated">
      <h2>Top Rated Homestays</h2>
      <div class="homestay-list">
        <div v-for="homestay in topRatedHomestays" :key="homestay.id" class="homestay-item">
          <img :src="homestay.image" :alt="homestay.name" />
          <div class="homestay-info">
            <h3>{{ homestay.name }}</h3>
            <p>Rating: {{ homestay.rating }} stars</p>
            <p>{{ homestay.reviewCount }} reviews</p>
          </div>
        </div>
      </div>
    </section> -->
  </div>
</template>

<script setup>
import PAGES from "@/constants/pages";
import { useRouter } from "vue-router";
import { DISTRICTS } from "@/constants/districts";

// Router
const router = useRouter();
const districts =  DISTRICTS;


// const topRatedHomestays = [
//   { id: 1, name: 'Luxury Homestay', image: 'path/to/luxury.jpg', rating: 4.8, reviewCount: 120 },
//   { id: 2, name: 'Cozy Homestay', image: 'path/to/cozy.jpg', rating: 4.7, reviewCount: 95 },
//   { id: 3, name: 'Peaceful Retreat', image: 'path/to/peaceful.jpg', rating: 4.9, reviewCount: 150 }
// ]

// Navigation methods
const goToHomestays = () => {
  router.push(PAGES.USER.HOMESTAY);
};

const promptSignIn = () => {
  // Logic to prompt sign-in or sign-up
  router.push(PAGES.LOGIN); // Redirects to the Sign In page
};

const filterByDistrict = (district) => {
  router.push({ name: 'Homestay', params: { districtId: district.id } });
}

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
  background-color: #f4f4f4;
}

.district-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.district-item {
  cursor: pointer;
  margin: 20px;
  text-align: center;
}

.district-item img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.district-item p {
  margin-top: 10px;
  font-weight: bold;
}

/* Top Rated Homestays Section */
.top-rated {
  text-align: center;
  padding: 50px 20px;
}

.homestay-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.homestay-item {
  margin: 20px;
  text-align: center;
}

.homestay-item img {
  width: 250px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

.homestay-info h3 {
  margin-top: 10px;
}

.homestay-info p {
  margin: 5px 0;
}
</style>
