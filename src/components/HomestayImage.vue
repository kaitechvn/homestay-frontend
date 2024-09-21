<template>
    <div>
      <h3>Manage Images</h3>
      <button @click="showUpload = !showUpload">{{ showUpload ? 'Cancel' : 'Upload Images' }}</button>
      
      <div v-if="showUpload">
        <input type="file" @change="handleFileChange" multiple />
        <button @click="uploadImages">Upload</button>
      </div>
  
      <div class="image-list">
        <div v-for="image in images" :key="image.id" class="image-item">
          <img :src="image.url" alt="Homestay Image" class="image-thumbnail" />
          <button @click="deleteImage(image.id)">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useHomestayStore } from '@/stores/HomestayStore';
  import { fetchHomestayImages, uploadHomestayImages, deleteHomestayImage } from '@/services/homestayService';
  
  export default {
    setup() {
      const homestayStore = useHomestayStore();
      const images = ref([]);
      const showUpload = ref(false);
      const files = ref([]);
  
      const loadImages = async () => {
        try {
          const response = await fetchHomestayImages(homestayStore.selectedHomestay.id);
          images.value = response.data; // Adjust based on your response structure
        } catch (error) {
          console.error('Error loading images:', error);
        }
      };
  
      const handleFileChange = (event) => {
        files.value = Array.from(event.target.files);
      };
  
      const uploadImages = async () => {
        const formData = new FormData();
        files.value.forEach(file => {
          formData.append('files', file);
        });
  
        try {
          await uploadHomestayImages(homestayStore.selectedHomestay.id, formData);
          await loadImages(); // Refresh images after upload
          showUpload.value = false; // Hide upload form
        } catch (error) {
          console.error('Error uploading images:', error);
        }
      };
  
      const deleteImage = async (imageId) => {
        try {
          await deleteHomestayImage(homestayStore.selectedHomestay.id, imageId);
          await loadImages(); // Refresh images after deletion
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      };
  
      onMounted(loadImages);
  
      return {
        images,
        showUpload,
        handleFileChange,
        uploadImages,
        deleteImage,
      };
    },
  };
  </script>
  
  <style scoped>
  .image-list {
    display: flex;
    flex-wrap: wrap;
  }
  
  .image-item {
    margin: 10px;
  }
  
  .image-thumbnail {
    width: 100px; /* Adjust size as needed */
    height: auto;
  }
  </style>
  