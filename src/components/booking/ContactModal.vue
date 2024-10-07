<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>Contact Details</h3>
      <p><strong>Name:</strong> {{ booking.contactName }}</p>
      <p><strong>Phone:</strong> {{ booking.contactPhone }}</p>
      <p><strong>Email:</strong> {{ booking.contactEmail }}</p>
    </div>
  </div>
</template>
  
  <script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  booking: {
    type: Object,
    required: true,
  },
  isVisible: Boolean,
});

// Log props to check their values
console.log("Modal Props:", props);

const emit = defineEmits(["onClose"]);

function closeModal() {
  emit("onClose");
}
</script>
  
  <style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(0.4px); 
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease; 
  z-index: 5; 
}


.modal-content {
  background: rgba(225, 221, 218, 0.9); 
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px; 
  border: 2px solid #1c0707; 
}


</style>
  