<template>
  <div class="modal" v-if="isModalVisible">
    <div class="modal-content">
      <span class="close" @click="emitClose">&times;</span>

      <div class="reviews-section">
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
                <span class="review-date">{{
                  formatDate(review.createdAt)
                }}</span>
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

        <div class="pagination" v-if="allReviews.length > 0">
          <button
            class="pagination-button"
            :disabled="currentPage === 0"
            @click="prevPage"
          >
            <span> &lt; </span>
          </button>
          <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
          <button
            class="pagination-button"
            :disabled="currentPage >= totalPages - 1"
            @click="nextPage"
          >
            <span> &gt;</span>
          </button>
        </div>

        <div v-if="bookingId" class="review-form">
          <form @submit.prevent="review">
            <div class="comment">
              <textarea
                v-model="comment"
                id="comment"
                required
                placeholder="Write your comment here..."
              ></textarea>
            </div>
            <div class="button-container">
              <div class="to-rating">
                <div class="star-to-rate">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star-rate"
                    :class="{
                      filled:
                        (tempRating !== null ? tempRating : rating) >= star,
                    }"
                    @mouseover="tempRating = star"
                    @mouseleave="tempRating = null"
                    @click="setRating(star)"
                  >
                    ★
                  </span>
                </div>
              </div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { computed, onMounted, ref } from "vue";
import { useReviewUserStore } from "@/stores/reviewUserStore";
import defaultAvatar from "@/assets/avataruser.png";
import { useBookingUserStore } from "@/stores/bookingUserStore";

// Props
const props = defineProps({
  homestayId: {
    type: Number,
    required: true,
  },
  bookingId: {
    type: Number,
    required: false,
  },
});

// Store
const reviewUserStore = useReviewUserStore();
const bookingUserStore = useBookingUserStore();
const { loadBookings } = bookingUserStore;
const { loadReviews, submitReview } = reviewUserStore;
const tempRating = ref(null);

// State
const allReviews = ref([]);
const displayedReviews = ref([]);
const pageSize = 3;
const currentPage = ref(0);
const rating = ref(null);
const comment = ref("");
const isModalVisible = ref(true);

// Emit event to close the modal
const emit = defineEmits(["close"]);

onMounted(async () => {
  await loadInitialReviews();
});

const loadInitialReviews = async () => {
  await loadReviews(props.homestayId);
  allReviews.value = reviewUserStore.reviews;
  updateDisplayedReviews();
};

const updateDisplayedReviews = () => {
  const start = currentPage.value * pageSize;
  const end = start + pageSize;
  displayedReviews.value = allReviews.value.slice(start, end);
};

const totalPages = computed(() =>
  Math.ceil(allReviews.value.length / pageSize)
);

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    updateDisplayedReviews();
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    updateDisplayedReviews();
  }
};

const setRating = (selectedRating) => {
  rating.value = selectedRating;
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const review = async () => {
  await submitReview({
    bookingId: props.bookingId,
    rating: rating.value,
    comment: comment.value,
  });

  rating.value = null;
  comment.value = "";

  loadBookings();

  emit("close");
};

const emitClose = () => {
  isModalVisible.value = false;
  emit("close");
};
</script>
  
  <style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 550px;
  max-height: 570px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 20px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

.review-item {
  padding: 2px;
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
  justify-content: flex-end;
}

button {
  background-color: #a98066;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #a27056;
}

.pagination {
  display: flex;
  justify-content: center;
  font-size: 0.9em;
}

.pagination-button {
  background-color: #b0b0b0;
  border: none;
  margin-top: 5px;
  cursor: pointer;
  font-size: 18px;
  padding: 2px;
  margin: 0 5px;
  padding-bottom: -5px;
  padding-top: 1px;
  margin-bottom: -2px;
  font-size: 0.8em;
}

.pagination span {
  margin: 0 10px;
}

.review-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.comment-box {
  width: 100%;
  height: 200px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #131212;
  border-radius: 5px;
  font-size: 1em;
}

textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  margin-bottom: 8.5px;
  border: 1px solid #131212;
  border-radius: 5px;
  font-size: 0.8em;
}

.star-to-rate {
  display: flex;
  cursor: pointer; /* Change cursor to pointer when hovering */
  margin-right: 20px;
}

.star-rate {
  font-size: 1.4em;
  color: #ccc;
  transition: color 0.3s;
}

.star-rate.filled,
.star-rate:hover {
  color: #ed8d07;
}
</style>
  