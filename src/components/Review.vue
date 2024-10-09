<template>
  <div class="reviews-section">
    <h2>Reviews</h2>
    <ul>
      <li
        v-for="(review, index) in displayedReviews"
        :key="index"
        class="review-item"
      >
        <div class="review-header">
          <img class="avatar" :src="defaultAvatar" alt="User Avatar" />
          <div class="review-info">
            <strong>{{ review.username }} </strong>
            <br />
            <span class="review-date">{{ formatDate(review.createdAt) }}</span>
          </div>
          <div class="review-rating">
            <span
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= review.rating }"
            >
              ★
            </span>
          </div>
        </div>
        <p class="review-comment">{{ review.comment }}</p>
      </li>
    </ul>

    <div class="button-container">
      <button v-if="canLoadMore" @click="loadMoreReviews">Load More</button>
    </div>
  </div>
</template>
  
<script setup>
import { computed, onMounted, ref } from "vue";
import { useReviewUserStore } from "@/stores/reviewUserStore";
import defaultAvatar from "@/assets/avataruser.png";

// Props
const props = defineProps({
  homestayId: {
    type: Number,
    required: true,
  },
});

// Store
const reviewUserStore = useReviewUserStore();
const { loadReviews } = reviewUserStore;

// State
const allReviews = ref([]);
const displayedReviews = ref([]);
const pageSize = 3;
const currentPage = ref(0);

onMounted(async () => {
  await loadInitialReviews();
});

const loadInitialReviews = async () => {
  await loadReviews(props.homestayId);
  allReviews.value = reviewUserStore.reviews;
  loadMoreReviews();
};

const loadMoreReviews = () => {
  const nextReviews = allReviews.value.slice(
    currentPage.value * pageSize,
    (currentPage.value + 1) * pageSize
  );
  displayedReviews.value.push(...nextReviews);
  currentPage.value++;
};

const canLoadMore = computed(
  () => displayedReviews.value.length < allReviews.value.length
);

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const review = async () => {
  // Call your API to submit the review
  await submitReview({
    bookingId: props.bookingId,
    rating: rating.value,
    comment: comment.value,
  });

  rating.value = null;
  comment.value = "";

  emit("close");
};

const emitClose = () => {
  emit("close");
};
</script>
  
<style scoped>
.reviews-section {
  margin: 20px 0;
}

ul {
  list-style: none;
  padding: 0;
}

.review-item {
  margin-bottom: 15px;
  padding: 15px;

  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.review-info {
  flex: 1;
}

.review-date {
  font-size: 0.92em;
  color: #784c4c;
}

.review-rating {
  display: flex;
}

.star {
  font-size: 1.5em;
  color: #ccc;
}

.star.filled {
  color: #ffcc00;
}

.review-comment {
  margin-top: 10px;
  font-size: 1.1em;
  font-style: italic;
  color: #3a3939;
}

.button-container {
  display: flex;
  justify-content: center; 
}

button {
  padding: 8px 15px;
  background-color: #a98066;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #a27056;
}


</style>
