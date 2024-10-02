<!-- <template>
    <div class="booking-management">
      <div class="booking-list">
        <div class="header-container">
          <h2 class="header-title">{{ $t("booking-management.title") }}</h2>
          <div class="right-container">
            <div class="success-message" v-if="successMessage">
              {{ successMessage }}
            </div>
            <button @click="startCreatingBooking" class="btn btn-primary">
              {{ $t("booking-management.addBooking") }}
            </button>
          </div>
        </div>
  
        <table class="table mt-3">
          <thead>
            <tr>
              <th class="super-small">#</th>
              <th class="medium">{{ $t("booking-management.userId") }}</th>
              <th class="wide">{{ $t("booking-management.homestayId") }}</th>
              <th class="normal-wide">{{ $t("booking-management.checkinDate") }}</th>
              <th class="normal-wide">{{ $t("booking-management.checkoutDate") }}</th>
              <th class="medium">{{ $t("booking-management.guests") }}</th>
              <th class="small">{{ $t("booking-management.totalAmount") }}</th>
              <th class="medium">{{ $t("booking-management.status") }}</th>
              <th class="medium">{{ $t("booking-management.actions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="booking in bookings" :key="booking.id">
              <td class="text-center">{{ booking.id }}</td>
              <td class="text-center">{{ booking.userId }}</td>
              <td class="text-center">{{ booking.homestayId }}</td>
              <td class="text-center">{{ booking.checkinDate }}</td>
              <td class="text-center">{{ booking.checkoutDate }}</td>
              <td class="text-center">{{ booking.guests }}</td>
              <td class="text-center">{{ booking.totalAmount }}</td>
              <td class="text-center">
                <span
                  :class="{
                    'badge badge-active': booking.status === 'CONFIRMED',
                    'badge badge-cancelled': booking.status === 'CANCELLED',
                    'badge badge-pending': booking.status === 'PENDING',
                  }"
                >
                  {{ booking.status }}
                </span>
              </td>
              <td class="text-center">
                <button
                  @click="editBooking(booking)"
                  class="btn btn-warning btn-sm"
                  title="Edit Booking"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteBooking(booking.id)"
                  class="btn btn-danger btn-sm"
                  title="Delete Booking"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="loadBookings"
        />
      </div>
  
      <!-- Modal for Booking Form -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>
            {{ isEditing ? $t("booking-management.editBooking") : $t("booking-management.addBooking") }}
          </h2>
          <form @submit.prevent="submitForm">
            <div class="form-grid">
              <div class="form-group">
                <label for="userId" class="form-label">{{ $t("booking-management.userId") }}</label>
                <input
                  v-model="form.userId"
                  type="text"
                  class="form-control"
                  id="userId"
                  required
                />
              </div>
              <div class="form-group">
                <label for="homestayId" class="form-label">{{ $t("booking-management.homestayId") }}</label>
                <input
                  v-model="form.homestayId"
                  type="text"
                  class="form-control"
                  id="homestayId"
                  required
                />
              </div>
              <div class="form-group">
                <label for="checkinDate" class="form-label">{{ $t("booking-management.checkinDate") }}</label>
                <input
                  v-model="form.checkinDate"
                  type="date"
                  class="form-control"
                  id="checkinDate"
                  required
                />
              </div>
              <div class="form-group">
                <label for="checkoutDate" class="form-label">{{ $t("booking-management.checkoutDate") }}</label>
                <input
                  v-model="form.checkoutDate"
                  type="date"
                  class="form-control"
                  id="checkoutDate"
                  required
                />
              </div>
              <div class="form-group">
                <label for="guests" class="form-label">{{ $t("booking-management.guests") }}</label>
                <input
                  v-model="form.guests"
                  type="number"
                  class="form-control"
                  id="guests"
                  min="1"
                  required
                />
              </div>
              <div class="form-group">
                <label for="totalAmount" class="form-label">{{ $t("booking-management.totalAmount") }}</label>
                <input
                  v-model="form.totalAmount"
                  type="number"
                  class="form-control"
                  id="totalAmount"
                  min="0"
                  required
                />
              </div>
              <div class="form-group">
                <label for="status" class="form-label">{{ $t("booking-management.status") }}</label>
                <select v-model="form.status" class="form-control" id="status">
                  <option value="PENDING">{{ $t("booking-management.status.pending") }}</option>
                  <option value="CONFIRMED">{{ $t("booking-management.status.confirmed") }}</option>
                  <option value="CANCELLED">{{ $t("booking-management.status.cancelled") }}</option>
                </select>
              </div>
            </div>
  
            <button type="submit" class="btn btn-primary mt-3">
              {{ isEditing ? $t("booking-management.update") : $t("booking-management.add") }}
            </button>
            <button
              @click="closeModal"
              type="button"
              class="btn btn-secondary mt-3"
            >
              {{ $t("booking-management.cancel") }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useBookingStore } from "@/stores/bookingStore"; // Assuming you have a booking store
  import Pagination from "@/components/Pagination.vue";
  import { useI18n } from "vue-i18n";
  
  const { t } = useI18n();
  const bookingStore = useBookingStore();
  const bookings = computed(() => bookingStore.bookings);
  const selectedBooking = computed(() => bookingStore.selectedBooking);
  const currentPage = computed(() => bookingStore.currentPage);
  const totalPages = computed(() => bookingStore.totalPages);
  
  const {
    loadBookings,
    addBooking,
    modifyBooking,
    removeBooking,
    setSelectedBooking,
    clearSelectedBooking,
  } = bookingStore;
  
  const isEditing = computed(() => !!selectedBooking.value);
  const form = ref({
    userId: "",
    homestayId: "",
    checkinDate: "",
    checkoutDate: "",
    guests: 1,
    totalAmount: 0,
    status: "PENDING",
  });
  
  const showModal = ref(false);
  
  const startCreatingBooking = () => {
    clearSelectedBooking();
    form.value = {
      userId: "",
      homestayId: "",
      checkinDate: "",
      checkoutDate: "",
      guests: 1,
      totalAmount: 0,
      status: "PENDING",
    };
    showModal.value = true;
  };
  
  const editBooking = (booking) => {
    setSelectedBooking(booking);
    form.value = { ...booking }; // Populate form with booking details
    showModal.value = true;
  };
  
  const successMessage = ref(""); // Store the success message
  
  const submitForm = async () => {
    try {
      if (isEditing.value) {
        await modifyBooking(selectedBooking.value.id, form.value);
        successMessage.value = t("messages.update-success"); // Set success message
      } else {
        await addBooking(form.value);
        successMessage.value = t("messages.add-success"); // Set success message
      }
      showModal.value = false;
      hideSuccessMessage(); // Hide success message after a delay
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteBooking = async (bookingId) => {
    try {
      await removeBooking(bookingId);
      successMessage.value = t("messages.delete-success");
      hideSuccessMessage();
    } catch (error) {
      console.error(error);
    }
  };
  
  const hideSuccessMessage = () => {
    setTimeout(() => {
      successMessage.value = "";
    }, 1000);
  };
  
  const closeModal = () => {
    showModal.value = false;
  };
  
  onMounted(async () => {
    // Check if there is a stored currentPage in localStorage
    const savedPage = localStorage.getItem('currentPage');
    const pageToLoad = savedPage ? parseInt(savedPage, 10) : 1; // Default to page 1 if no saved page
    await loadBookings(pageToLoad);
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  .booking-management {
    padding: 20px;
  }
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .success-message {
    color: green;
    margin-right: 10px;
  }
  .table {
    margin-top: 20px;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 500px;
  }
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .form-group {
    margin-bottom: 15px;
  }
  </style> -->
  