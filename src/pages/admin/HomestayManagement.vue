<template>
  <div class="homestay-management">
    <div class="homestay-list">
      <div class="header-container">
        <h2 class="header-title">{{ $t("homestay-management.title") }}</h2>
        <div class="right-container">
          <div class="success-message" v-if="successMessage">
            {{ successMessage }}
          </div>
          <button @click="startCreatingHomestay" class="btn btn-primary">
            {{ $t("homestay-management.addHomestay") }}
          </button>
        </div>
      </div>

      <table class="table mt-3">
        <thead>
          <tr>
            <th class="super-small">#</th>
            <th class="medium">{{ $t("homestay-management.name") }}</th>
            <th class="normal">{{ $t("homestay-management.district") }}</th>
            <th class="wide">{{ $t("homestay-management.address") }}</th>
            <th class="small">{{ $t("homestay-management.price") }}</th>
            <th class="small">{{ $t("homestay-management.bed-bath") }}</th>
            <th class="medium">{{ $t("homestay-management.actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="homestay in homestays" :key="homestay.id">
            <td class="text-center">{{ homestay.id }}</td>
            <td class="text-center">{{ homestay.name }}</td>
            <td class="text-center">{{ homestay.district }}</td>
            <td class="text-center">{{ homestay.address }}</td>
            <td class="text-center">{{ formatVNDPrice(homestay.price) }}</td>
            <td>{{ formatBedBath(homestay.bedrooms, homestay.bathrooms) }}</td>
            <td class="text-center">
              <button
                @click="editHomestay(homestay)"
                class="btn btn-warning btn-sm"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteHomestay(homestay.id)"
                class="btn btn-danger btn-sm"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
              <button
                @click="openImageModal(homestay)"
                class="btn btn-info btn-sm"
              >
                <i class="fas fa-images"></i>
              </button>
              <button
                @click="openDatepicker(homestay.id)"
                class="btn btn-primary btn-sm"
              >
                <i class="fas fa-calendar-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-changed="loadHomestays"
      />
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>
          {{
            isEditing
              ? $t("homestay-management.editHomestay")
              : $t("homestay-management.addHomestay")
          }}
        </h2>
        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div class="form-group">
              <label for="name" class="form-label">{{
                $t("homestay-management.name")
              }}</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                id="name"
                required
              />
            </div>
            <div class="form-group">
              <label for="district" class="form-label">{{
                $t("homestay-management.district")
              }}</label>
              <input
                v-model="form.district"
                type="text"
                class="form-control"
                id="district"
                required
              />
            </div>
            <div class="form-group">
              <label for="address" class="form-label">{{
                $t("homestay-management.address")
              }}</label>
              <input
                v-model="form.address"
                type="text"
                class="form-control"
                id="address"
                required
              />
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-3">
            {{
              isEditing
                ? $t("homestay-management.update")
                : $t("homestay-management.add")
            }}
          </button>
          <button
            @click="closeModal"
            type="button"
            class="btn btn-secondary mt-3"
          >
            {{ $t("homestay-management.cancel") }}
          </button>
        </form>
      </div>
    </div>

    <div
      v-if="showDatepickerModal"
      class="modal-overlay"
      @click="closeDatepicker"
    >
      <div class="modal-content" @click.stop>
        <span class="close-button" @click="closeDatepicker">&times;</span>

        <!-- Include DatePicker component -->
        <DatePicker 
        :homestay-id="selectedHomestayId"
        :locked-dates="lockDates"
        @close="closeDatepicker"
        @reopenDatePicker="reopenDatePicker"
        />
      </div>
    </div>

    <!-- Modal for Image Management -->
    <div v-if="showImageModal" class="modal-overlay">
      <div class="modal-content images-modal">
        <h2>{{ $t("homestay-management.imagesTitle") }}</h2>
        <div class="image-list">
          <div v-for="image in images" :key="image.id" class="image-container">
            <img
              :src="image.url"
              class="homestay-image"
              alt="Homestay Image"
              @click="openImgDetail(image.url)"
            />
            <button
              @click="deleteImage(image.id)"
              class="btn btn-danger btn-sm delete-button"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <!-- Modal for showing large image -->
          <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
            <span class="close-button-img" @click="closeImgDetail">&times;</span>
            <img
              :src="modalImage"
              alt="Large homestay image"
              class="modal-image"
              @click.stop
            />
          </div>
        </div>
        <form @submit.prevent="uploadImages">
          <input
            type="file"
            multiple
            @change="handleFileSelect"
            ref="fileInput"
          />
          <div class="button-group">
            <button type="submit" class="btn btn-primary mt-3">
              {{ $t("homestay-management.uploadImages") }}
            </button>
            <button
              @click="closeImageModal"
              type="button"
              class="btn btn-secondary mt-3"
            >
              {{ $t("homestay-management.cancel") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useHomestayStore } from "@/stores/homestayAdminStore";
import Pagination from "@/components/Pagination.vue";
import { useI18n } from "vue-i18n";
import { formatVNDPrice } from "@/utils/currencyUtils";
import DatePicker from "@/components/DatePicker.vue";

const { t } = useI18n();
const homestayStore = useHomestayStore();
const homestays = computed(() => homestayStore.homestays);
const currentPage = computed(() => homestayStore.currentPage);
const totalPages = computed(() => homestayStore.totalPages);
const selectedHomestay = computed(() => homestayStore.selectedHomestay);
const images = ref([]);
const showImageModal = ref(false);
const showModal = ref(false);
const form = ref({ name: "", district: "", address: "" });
const successMessage = ref("");
const selectedFiles = ref([]);
const fileInput = ref(null);

const isEditing = computed(() => !!selectedHomestay.value);

const {
  loadHomestays,
  addHomestay,
  modifyHomestay,
  removeHomestay,
  setSelectedHomestay,
  loadHomestayImages,
  getImagesForHomestay,
  uploadHomestayImages,
  deleteHomestayImage,
  loadLockDates,
  getLockDatesForHomestay,
} = homestayStore;

const selectedHomestayId = ref(null); // Track the selected homestay ID


const startCreatingHomestay = () => {
  form.value = { name: "", district: "", address: "" };
  showModal.value = true;
};

const editHomestay = (homestay) => {
  setSelectedHomestay(homestay);
  form.value = { ...homestay };
  showModal.value = true;
};

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await modifyHomestay(selectedHomestay.value.id, form.value);
      successMessage.value = t("messages.update-success");
    } else {
      await addHomestay(form.value);
      successMessage.value = t("messages.add-success");
    }
    showModal.value = false;
  } catch (error) {
    console.error(error);
  }
};

const deleteHomestay = async (homestayId) => {
  try {
    await removeHomestay(homestayId);
    successMessage.value = t("messages.delete-success");
  } catch (error) {
    console.error(error);
  }
};

const closeModal = () => {
  showModal.value = false;
};

const openImageModal = async (homestay) => {
  setSelectedHomestay(homestay);
  showImageModal.value = true;

  loadHomestayImages(homestay);

  // Get the images and format them
  const imagesFromBackend = await getImagesForHomestay(homestay.id);

  images.value = imagesFromBackend.map((image) => ({
    id: image.id,
    url: image.url,
  }));
};

const handleFileSelect = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const uploadImages = async () => {
  try {
    await uploadHomestayImages(selectedHomestay.value.id, selectedFiles.value);
    successMessage.value = t("messages.upload-success");

    await reloadHomestayImages(selectedHomestay.value.id); // Reload images after upload

    selectedFiles.value = [];
    fileInput.value.value = ""; // Reset the input element
  } catch (error) {
    console.error(error);
  }
};

const formatBedBath = (bedrooms, bathrooms) => {
  return `${bedrooms}-${bathrooms}`;
};

const deleteImage = async (imageId) => {
  try {
    await deleteHomestayImage(selectedHomestay.value.id, imageId);
    successMessage.value = t("messages.image-delete-success");

    await reloadHomestayImages(selectedHomestay.value.id);
  } catch (error) {
    console.error(error);
    errorMessage.value = t("messages.image-delete-fail");
  }
};

const closeImageModal = () => {
  showImageModal.value = false;
};

const reloadHomestayImages = async (homestayId) => {
  const currentPage = homestayStore.currentPage;
  await loadHomestays(currentPage, 5);

  const updatedHomestay = homestayStore.homestays.find(
    (h) => h.id === homestayId
  );

  if (updatedHomestay) {
    selectedHomestay.value = updatedHomestay;

    // Update images array
    images.value = updatedHomestay.images.map((image) => ({
      id: image.id,
      url: image.url,
    }));
  }
};

const isModalOpen = ref(false); 
const modalImage = ref(""); 

const openImgDetail = (imageUrl) => {
  modalImage.value = imageUrl;
  isModalOpen.value = true;
};

// Method to close the modal
const closeImgDetail = () => {
  isModalOpen.value = false; 
  modalImage.value = ""; 
};

const showDatepickerModal = ref(false);
const lockDates = ref([]); 

const openDatepicker = async (homestayId) => {
  selectedHomestayId.value = homestayId;
  showDatepickerModal.value = true;

  await loadLockDates(homestayId);

  const dates = getLockDatesForHomestay(homestayId);
  lockDates.value = dates;
};

const reopenDatePicker = () => {
      openDatepicker(selectedHomestayId.value); 
    };

// Method to close the Datepicker modal
const closeDatepicker = () => {
  showDatepickerModal.value = false;
};

onMounted(async () => {
  await loadHomestays();
});
</script>

<style scoped>
.homestay-management {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.homestay-list {
  margin-bottom: 20px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  flex-grow: 1;
}

.right-container {
  display: flex;
  align-items: center;
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
  text-align: center;
}

.small {
  width: 50px;
}

.normal {
  width: 70px;
}

.super-small {
  width: 30px;
}

.medium {
  width: 145px;
}

.wide {
  width: 170px;
}

.table {
  table-layout: fixed;
  width: 100%;
}

.pagination {
  margin-top: 20px;
}

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
  z-index: 5; 
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.images-modal {
  width: 800px; /* Keep the width */
  height: 600px; /* Set a fixed height */
  max-height: 90vh; /* Limit the maximum height */
  overflow-y: auto; /* Enable scrolling if needed */
  display: flex;
  flex-direction: column; /* Stack children vertically */
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

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Adds space between images */
  justify-content: space-around; /* Adjust spacing between containers */
}

.image-container {
  position: relative; /* To position delete button inside the container */
  width: 200px; /* Set image width */
  height: 150px; /* Set image height */
  overflow: hidden; /* Prevent overflow */
  border-radius: 8px; /* Optional: rounded corners */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.image-container img {
  width: 100%; /* Scale image to fit */
  height: 100%; /* Maintain aspect ratio */
  object-fit: cover; /* Make image cover the container */
}

.delete-button {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none; /* Hidden by default */
}

.image-container:hover .delete-button {
  display: block; /* Show button on hover */
}

.modal-image {
  width: 80vw; /* Full viewport width */
  height: 80vh; /* Full viewport height */
  object-fit: cover; /* Cover the entire area, may crop the image */
  display: block;
  border-radius: 0; /* No rounded corners for full coverage */
  box-shadow: none; /* No shadow for a clean full-screen look */
  margin: 0; /* No margin for full screen */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #ff0000; /* Red color on hover */
}

.close-button-img {
  position: absolute; 
  top: 20px; 
  right: 20px; 
  font-size: 24px; 
  color: white; 
  background: rgba(0, 0, 0, 0.5); 
  border: none; 
  border-radius: 50%; 
  padding: 5px 10px; 
  cursor: pointer; 
  z-index: 1001; 
}

.close-button-img:hover {
  background: rgba(0, 0, 0, 0.7); 
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



  
