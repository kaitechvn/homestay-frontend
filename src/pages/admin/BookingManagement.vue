<template>
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
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th class="normal-wide">
              {{ $t("booking-management.checkinDate") }}
            </th>
            <th class="normal-wide">
              {{ $t("booking-management.checkoutDate") }}
            </th>
            <th class="medium">{{ $t("booking-management.guests") }}</th>
            <th class="small">{{ $t("booking-management.totalAmount") }}</th>
            <th class="medium">{{ $t("booking-management.status") }}</th>
            <th class="medium">{{ $t("booking-management.actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            <td class="text-center">{{ booking.bookingId }}</td>
            <td>{{ booking.contactName }}</td>
            <td>{{ booking.contactEmail }}</td>
            <td>{{ booking.contactPhone }}</td>
            <!-- <td class="text-center">{{ booking.userId }}</td>
            <td class="text-center">{{ booking.homestayId }}</td> -->
            <td class="text-center">{{ booking.checkinDate }}</td>
            <td class="text-center">{{ booking.checkoutDate }}</td>
            <td class="text-center">{{ booking.guests }}</td>
            <td class="text-center">{{ booking.totalAmount }}</td>
            <td class="text-center">
              <span
                v-if="booking.status === 'PENDING'"
                @click="toggleDropdown"
                class="badge badge-pending"
                style="cursor: pointer"
              >
                {{ booking.status }}
              </span>

              <!-- For other statuses (CONFIRMED, CANCELLED) without click functionality -->
              <span
                v-else
                :class="{
                  'badge badge-active': booking.status === 'CONFIRMED',
                  'badge badge-cancelled': booking.status === 'CANCELLED',
                }"
              >
                {{ booking.status }}
              </span>
              <div
                v-if="isDropdownVisible && booking.status === 'PENDING'"
                class="dropdown"
              >
                <ul>
                  <li @click="confirm(booking.bookingId)">CONFIRMED</li>
                  <li @click="cancel(booking.bookingId)">CANCELLED</li>
                </ul>
              </div>
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
          {{
            isEditing
              ? $t("booking-management.editBooking")
              : $t("booking-management.addBooking")
          }}
        </h2>
        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="userId" class="form-label">{{
                $t("booking-management.userId")
              }}</label>
              <input
                v-model="form.userId"
                type="text"
                class="form-control"
                id="userId"
                required
              />
            </div>
            <div class="form-group">
              <label for="homestayId" class="form-label">{{
                $t("booking-management.homestayId")
              }}</label>
              <input
                v-model="form.homestayId"
                type="text"
                class="form-control"
                id="homestayId"
                required
              />
            </div>
            <div class="form-group">
              <label for="checkinDate" class="form-label">{{
                $t("booking-management.checkinDate")
              }}</label>
              <input
                v-model="form.checkinDate"
                type="date"
                class="form-control"
                id="checkinDate"
                required
              />
            </div>
            <div class="form-group">
              <label for="checkoutDate" class="form-label">{{
                $t("booking-management.checkoutDate")
              }}</label>
              <input
                v-model="form.checkoutDate"
                type="date"
                class="form-control"
                id="checkoutDate"
                required
              />
            </div>
            <div class="form-group">
              <label for="guests" class="form-label">{{
                $t("booking-management.guests")
              }}</label>
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
              <label for="totalAmount" class="form-label">{{
                $t("booking-management.totalAmount")
              }}</label>
              <input
                v-model="form.totalAmount"
                type="number"
                class="form-control"
                id="totalAmount"
                min="0"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary mt-3">
            {{
              isEditing
                ? $t("booking-management.update")
                : $t("booking-management.add")
            }}
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
import { useBookingAdminStore } from "@/stores/bookingAdminStore"; // Assuming you have a booking store
import Pagination from "@/components/Pagination.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const bookingStore = useBookingAdminStore();
const bookings = computed(() => bookingStore.bookings);
const selectedBooking = computed(() => bookingStore.selectedBooking);
const currentPage = computed(() => bookingStore.currentPage);
const totalPages = computed(() => bookingStore.totalPages);
const isDropdownVisible = ref(false);

const {
  loadBookings,
  addBooking,
  removeBooking,
  setSelectedBooking,
  clearSelectedBooking,
  confirm,
  cancel,
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

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const confirmBooking = (bookingId) => {
  confirm(bookingId).then(() => {
    showDropdown.value = false;
  });
};

// Method to cancel booking
const cancelBooking = (bookingId) => {
  cancel(bookingId).then(() => {
    showDropdown.value = false;
  });
};

onMounted(async () => {
  const savedPage = localStorage.getItem("currentPage");
  const pageToLoad = savedPage ? parseInt(savedPage, 10) : 1;
  await loadBookings(pageToLoad);
});
</script>
  
  <style scoped>
.booking-management {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.header-container {
  display: flex;
  align-items: center; 
  justify-content: space-between; 
}

.header-title {
  flex-grow: 1; /* Allow the title to take up remaining space */
}

.right-container {
  display: flex; /* Align items in the right container */
  align-items: center; /* Center vertically */
}

.table {
  table-layout: fixed;
  width: 100%;
  margin-top: 20px;
  font-size: 14px;
}

.table th {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.table td {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.small {
  width: 106px;
}

.medium {
  width: 145px;
}

.wide {
  width: 170px;
}

.super-wide {
  width: 281px;
}

.pagination {
  margin-top: 20px;
}

/* Badge styles for status */
.badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  text-align: center;
  font-size: 12px;
  color: rgba(253, 253, 253, 0.856);
  min-width: 105px;
}

.badge-active {
  background-color: #144520; /* Green for CONFIRMED */
}

.badge-cancelled {
  background-color: #dc3545; /* Red for CANCELLED */
}

.badge-pending {
  background-color: #caa022; /* Yellow for PENDING */
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 4px;
  width: 600px;
}

.modal-content h2 {
  margin-bottom: 20px;
}

.modal-content .btn {
  margin-top: 10px;
}

.success-message {
  display: flex;
  align-items: center;
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 4px;
  margin-left: 10px;
  animation: fadeIn 1s ease-out, fadeOut 2s ease-in 1s forwards;
}

.success-message::before {
  content: "";
  display: inline-block;
  width: 1em;
  height: 1em;
  background-image: url("https://icons.getbootstrap.com/assets/icons/check-circle-fill.svg");
  background-size: 1em 1em;
  margin-right: 5px;
}

.dropdown {
  position: absolute; /* Adjust positioning as necessary */
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1000; /* Ensure it appears above other elements */
}

.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown li {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown li:hover {
  background-color: #f0f0f0; /* Change color on hover */
}

/* Keyframes for success message animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>