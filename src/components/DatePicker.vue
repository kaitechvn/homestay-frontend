<template>
    <div>
      <button @click="toggleDatePicker">
        <i class="calendar-icon"></i> <!-- Replace with your calendar icon -->
      </button>
      
      <Datepicker v-if="showDatePicker" 
                  v-model="selectedDate" 
                  :disabled-date="disabledDate"
                  @change="updateLockDate">
      </Datepicker>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Datepicker from 'vue-datepicker-next';
  import 'vue-datepicker-next/index.css'; // Import styles
  
  const showDatePicker = ref(false); // Tracks if the datepicker is shown
  const selectedDate = ref(null); // Tracks the selected date
  const selectedHomestay = ref({ id: 1 }); // Example selected homestay (replace with your actual data)
  
  // Toggles the datepicker's visibility
  const toggleDatePicker = () => {
    showDatePicker.value = !showDatePicker.value;
  };
  
  // Disables past dates in the datepicker
  const disabledDate = (date) => {
    const today = new Date();
    return date < today; // Disable past dates
  };
  
  // Function to update the homestay's lock date
  const updateLockDate = async () => {
    if (selectedDate.value) {
      try {
        await updateHomestayLockDate(selectedHomestay.value.id, selectedDate.value); // Call API to update the lock date
        // Emit an event if needed
        // this.$emit('date-updated', selectedDate.value);
        console.log("Lock date updated:", selectedDate.value);
      } catch (error) {
        console.error("Failed to update lock date:", error);
      }
    }
    showDatePicker.value = false; // Hide the date picker after selection
  };
  
  // Mock API call function (replace with your actual API function)
  const updateHomestayLockDate = async (homestayId, lockDate) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Updated homestay ${homestayId} lock date to ${lockDate}`);
        resolve();
      }, 1000);
    });
  };
  </script>
  
  <style scoped>
  /* Add any necessary styles */
  </style>
  