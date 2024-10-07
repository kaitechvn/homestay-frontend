<template>
  <div class="booking-management">
    <div class="booking-list">
      <div class="header-container">
        <h2 class="header-title">Booking History</h2>

        <div class="status-filter">
          <button @click="filterByStatus(null)">All</button>
          <button @click="filterByStatus('PENDING')">Pending</button>
          <button @click="filterByStatus('CONFIRMED')">Confirmed</button>
          <button @click="filterByStatus('CANCELLED')">Cancelled</button>
        </div>

        <div class="right-container">
          <div class="success-message" v-if="successMessage">
            {{ successMessage }}
          </div>
        </div>
      </div>

      <table class="table mt-3">
        <thead>
          <tr>
            <th class="small">#</th>
            <th class="small">Contact</th>
            <th>Homestay</th>
            <th class="medium">
              {{ $t("booking-management.checkinDate") }}
            </th>
            <th class="medium">
              {{ $t("booking-management.checkoutDate") }}
            </th>
            <th class="small">{{ $t("booking-management.guests") }}</th>
            <th class="small">{{ $t("booking-management.totalAmount") }}</th>
            <th class="medium">{{ $t("booking-management.status") }}</th>
            <th class="medium">{{ $t("booking-management.actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in bookings" :key="booking.bookingId">
            <td class="text-center">{{ booking.bookingId }}</td>
            <td class="text-center">
              <img
                src="@/assets/user.png"
                alt="Contact"
                @click="showModal(booking)"
                style="cursor: pointer; width: 24px; height: 24px"
              />
            </td>
            <td class="text-center">{{ booking.homestayName }}</td>
            <td class="text-center">{{ booking.checkinDate }}</td>
            <td class="text-center">{{ booking.checkoutDate }}</td>
            <td class="text-center">{{ booking.guests }}</td>
            <td class="text-center">{{ booking.totalAmount }}</td>
            <td class="text-center">
              <span
                :class="{
                  'badge badge-pending': booking.status === 'PENDING',
                  'badge badge-active': booking.status === 'CONFIRMED',
                  'badge badge-cancelled': booking.status === 'CANCELLED',
                }"
              >
                {{ $t(`booking-management.detail-status.${booking.status}`) }}
              </span>
            </td>
            <td class="text-center">
              <router-link
                :to="{
                  name: 'HomestayDetail',
                  params: { id: booking.homestayId },
                }"
              >
                <img
                  src="@/assets/homedetail.png"
                  alt="View Homestay"
                  class="action-icon"
                />
              </router-link>
              <span v-if="booking.status === 'CONFIRMED'">
                <button
                  @click="generatePdf(booking.bookingId)"
                  title="Create PDF Bill"
                >
                  <img
                    src="@/assets/pdf.png"
                    alt="Create PDF Bill"
                    class="action-icon"
                  />
                </button>
                <button
                  v-if="!booking.is_review"
                  @click="makeReview(booking.bookingId)"
                  title="Review"
                >
                  <img
                    src="@/assets/rating.png"
                    alt="Review"
                    class="action-icon"
                  />
                </button>
              </span>

              <span v-if="booking.status === 'PENDING'">
                <button
                  @click="cancel(booking.bookingId)"
                  title="Cancel Booking"
                >
                  <img
                    src="@/assets/cancel.png"
                    alt="Cancel Booking"
                    class="action-icon"
                  />
                </button>
                <button
                  @click="processPayment(booking.bookingId)"
                  title="Process Payment"
                >
                  <img
                    src="@/assets/payment.png"
                    alt="Process Payment"
                    class="action-icon"
                  />
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <ContactModal
        v-if="isModalVisible"
        :booking="propBooking"
        :isVisible="isModalVisible"
        @onClose="closeModal"
      />

      <pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useBookingUserStore } from "@/stores/bookingUserStore";
import Pagination from "@/components/Pagination.vue";
import ContactModal from "@/components/booking/ContactModal.vue";
import { useI18n } from "vue-i18n";
import { downloadPdfBill } from "@/services/pdfService";

const { t } = useI18n();
const bookingStore = useBookingUserStore();
const bookings = computed(() => bookingStore.bookings);
const currentPage = computed(() => bookingStore.currentPage);
const totalPages = computed(() => bookingStore.totalPages);
const propBooking = computed(() => bookingStore.selectedBooking);

const {
  loadBookings,
  filterByStatus,
  setSelectedBooking,
  clearSelectedBooking,
  cancel,
  handlePageChange,
} = bookingStore;

const generatePdf = async (bookingId) => {
  try {
    const response = await downloadPdfBill(bookingId);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bill-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading bill:", error);
  }
};

const handleClickOutside = (event) => {
  const dropdownElement = document.querySelector(".dropdown");
  if (dropdownElement && !dropdownElement.contains(event.target)) {
    activeDropdownBookingId.value = null;
  }
};

const isModalVisible = ref(false);

const showModal = (booking) => {
  setSelectedBooking(booking);
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  clearSelectedBooking();
};

onMounted(async () => {
  window.addEventListener("click", handleClickOutside);
  const savedPage = localStorage.getItem("currentPage");
  const pageToLoad = savedPage ? parseInt(savedPage, 10) : 1;
  await loadBookings(pageToLoad);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
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

.table button {
  border: none;
  background: transparent;
  padding: 0;
}

.table .action-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  border: none;
  margin-right: 6px;
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
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1000;
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
  background-color: #f0f0f0;
}

.status-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.status-filter button {
  padding: 8px 12px;
  border: none;
  background-color: #aa5f5e;
  color: rgb(248, 242, 242);
  cursor: pointer;
  border-radius: 4px;
}

.status-filter button:hover {
  background-color: #a45252;
}

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