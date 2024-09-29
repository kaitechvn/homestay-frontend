<template>
  <div class="user-management">
    <div class="user-list">
      <div class="header-container">
        <h2 class="header-title">{{ $t("user-management.title") }}</h2>
        <div class="right-container">
          <div class="success-message" v-if="successMessage">
            {{ successMessage }}
          </div>
          <button @click="startCreatingUser" class="btn btn-primary">
            {{ $t("user-management.addUser") }}
          </button>
        </div>
      </div>

      <table class="table mt-3">
        <thead>
          <tr>
            <th class="super-small">#</th>
            <!-- New Id column -->
            <th class="medium">{{ $t("user-management.username") }}</th>
            <th class="wide">{{ $t("user-management.fullname") }}</th>
            <th class="normal-wide">{{ $t("user-management.email") }}</th>
            <th class="medium-phone">{{ $t("user-management.phone") }}</th>
            <th class="small">{{ $t("user-management.status.title") }}</th>
            <th class="small">{{ $t("user-management.role") }}</th>
            <th class="medium">{{ $t("user-management.actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td class="text-center">{{ user.id }}</td>
            <!-- Display the Id field -->
            <td class="text-center">{{ user.username }}</td>
            <td class="text-center">{{ user.fullname }}</td>
            <td class="text-center">{{ user.email }}</td>
            <td class="text-center">{{ user.phone }}</td>
            <td class="text-center">
              <span
                :class="{
                  'badge badge-active': user.status === 1,
                  'badge badge-inactive': user.status === 0,
                }"
              >
                {{
                  user.status === 1
                    ? $t("user-management.status.active")
                    : $t("user-management.status.inactive")
                }}
              </span>
            </td>

            <td class="text-center">
              <span
                :class="{
                  'badge badge-admin': user.role == '1',
                  'badge badge-user': user.role == '2',
                }"
              >
                {{
                  user.role == "1"
                    ? $t("user-management.roles.admin")
                    : $t("user-management.roles.user")
                }}
              </span>
            </td>

            <td class="text-center">
              <button
                @click="editUser(user)"
                class="btn btn-warning btn-sm"
                title="Edit User"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="deleteUser(user.id)"
                class="btn btn-danger btn-sm"
                title="Delete User"
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
        @page-changed="loadUsers"
      />
    </div>

    <!-- Modal for User Form -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>
          {{
            isEditing
              ? $t("user-management.editUser")
              : $t("user-management.addUser")
          }}
        </h2>
        <form @submit.prevent="submitForm">
          <div class="form-grid">
            <div v-if="!isEditing" class="form-group">
              <label for="username" class="form-label">{{
                $t("user-management.username")
              }}</label>
              <input
                v-model="form.username"
                type="text"
                class="form-control"
                id="username"
                required
              />
            </div>
            <div v-if="!isEditing" class="form-group">
              <label for="password" class="form-label">{{
                $t("user-management.password")
              }}</label>
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                id="password"
                required
              />
            </div>
            <div class="form-group">
              <label for="fullname" class="form-label">{{
                $t("user-management.fullname")
              }}</label>
              <input
                v-model="form.fullname"
                type="text"
                class="form-control"
                id="fullname"
                required
              />
            </div>
            <div class="form-group">
              <label for="dob" class="form-label">{{
                $t("user-management.dateOfBirth")
              }}</label>
              <input
                v-model="form.dob"
                type="date"
                class="form-control"
                id="dob"
              />
            </div>
            <div class="form-group">
              <label for="email" class="form-label">{{
                $t("user-management.email")
              }}</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                id="email"
                required
              />
            </div>
            <div class="form-group">
              <label for="phone" class="form-label">{{
                $t("user-management.phone")
              }}</label>
              <input
                v-model="form.phone"
                type="text"
                class="form-control"
                id="phone"
              />
            </div>
            <div class="form-group address-group">
              <label for="address" class="form-label">{{
                $t("user-management.address")
              }}</label>
              <input
                v-model="form.address"
                type="text"
                class="form-control address-textarea"
                id="address"
              />
            </div>

            <div class="form-group">
              <label for="role" class="form-label">{{
                $t("user-management.roles.title")
              }}</label>
              <select v-model="form.role" class="form-control" id="role">
                <option value="1">
                  {{ $t("user-management.roles.admin") }}
                </option>
                <option value="2">
                  {{ $t("user-management.roles.user") }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="status" class="form-label">{{
                $t("user-management.status.title")
              }}</label>
              <select v-model="form.status" class="form-control" id="status">
                <option value="1">
                  {{ $t("user-management.status.active") }}
                </option>
                <option value="0">
                  {{ $t("user-management.status.inactive") }}
                </option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary mt-3">
            {{
              isEditing
                ? $t("user-management.update")
                : $t("user-management.add")
            }}
          </button>
          <button
            @click="closeModal"
            type="button"
            class="btn btn-secondary mt-3"
          >
            {{ $t("user-management.cancel") }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import Pagination from "@/components/Pagination.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const users = computed(() => userStore.users);
const selectedUser = computed(() => userStore.selectedUser);
const currentPage = computed(() => userStore.currentPage);
const totalPages = computed(() => userStore.totalPages);

const {
  loadUsers,
  addUser,
  modifyUser,
  removeUser,
  setSelectedUser,
  clearSelectedUser,
} = userStore;

const isEditing = computed(() => !!selectedUser.value);
const form = ref({
  fullname: "",
  email: "",
  phone: "",
  address: "",
  dob: "",
  username: "",
  password: "",
  status: null,
  role: null,
});

const showModal = ref(false);

const startCreatingUser = () => {
  clearSelectedUser();
  form.value = {
    fullname: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    username: "", // Reset username for new user
    password: "",
    status: 1, // Reset password for new user
    role: 2,
  };
  showModal.value = true;
};

const editUser = (user) => {
  setSelectedUser(user);
  form.value = { ...user }; // Populate form with user details
  showModal.value = true;
};

const successMessage = ref(""); // Store the success message

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await modifyUser(selectedUser.value.id, form.value);
      successMessage.value = t("messages.update-success"); // Set success message
    } else {
      await addUser({
        ...form.value,
        username: form.value.username,
        password: form.value.password,
      });
      successMessage.value = t("messages.add-success"); // Set success message
    }
    showModal.value = false;
    hideSuccessMessage(); // Hide success message after a delay
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (userId) => {
  try {
    await removeUser(userId);
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
  const pageToLoad = savedPage ? parseInt(savedPage, 10) : 1; // Default to page 1 if nothing is saved

  // Load homestays based on saved or default page
  await loadUsers(pageToLoad);
});

</script>



<style scoped>
.user-management {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.user-list {
  margin-bottom: 20px;
}

.header-container {
  display: flex;
  align-items: center; /* Center items vertically */
  justify-content: space-between; /* Space between title and right content */
}

.header-title {
  flex-grow: 1; /* Allow the title to take up remaining space */
}

.right-container {
  display: flex; /* Align items in the right container */
  align-items: center; /* Center vertically */
}

.column-selector {
  margin-bottom: 10px;
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

.super-small {
  width: 50px;
}

.medium {
  width: 145px;
}

.medium-phone {
  width: 130px;
}

.wide {
  width: 170px;
}

.normal-wide {
  width: 190px;
}

.super-wide {
  width: 281px;
}

.table {
  table-layout: fixed;
  width: 100%;
}

.pagination {
  margin-top: 20px;
}

/* Status and Role badge styles */
.badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  text-align: center;
  font-size: 12px;
  color: white;
  min-width: 75px;
}

.badge-active {
  background-color: lightgreen;
  color: rgb(1, 34, 49);
}

.badge-inactive {
  background-color: lightyellow;
  color: black;
}

.badge-admin {
  background-color: rgb(87, 177, 207);
}

.badge-user {
  background-color: rgba(193, 127, 199, 0.699);
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.address-group {
  grid-column: span 2; /* Span across two columns */
}

.address-textarea {
  width: 100%;
  height: 40px; /* Adjust height as needed */
  resize: none; /* Prevent user from resizing */
}

.success-message {
  display: flex; /* Use flex to align items inside */
  align-items: center; /* Center icon and text */
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 4px;
  margin-left: 10px; /* Add margin to the left for spacing */
  animation: fadeIn 1s ease-out, fadeOut 2s ease-in 1s forwards; /* Add animation here */
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