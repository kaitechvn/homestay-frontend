<template>
  <div class="admin-container">
    <div class="admin-content">
      <aside class="admin-sidebar">
        <!-- Sidebar content with links to different admin sections -->
        <ul>
          <li>
            <router-link to="/admin/message" class="sidebar-link">
              <span class="text">Message</span>
              <!-- Show message count badge only if greater than 0 -->
              <span v-if="messageCount > 0" class="badge">{{ messageCount }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/notification" class="sidebar-link">
              <span class="text">Notification</span>
              <!-- Show notification count badge only if greater than 0 -->
              <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/faq" class="sidebar-link">
              <span class="text">FAQ</span>
            </router-link>
          </li>
        </ul>
      </aside>

      <main class="admin-main">
        
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// State for message and notification counts (fetch from API or store)
const messageCount = ref(2);  // Example count, replace with real data
const notificationCount = ref(7);  // Example count, replace with real data

onMounted(() => {
  // Example of how you might fetch and set these counts from an API
  // messageCount.value = fetchMessageCount();
  // notificationCount.value = fetchNotificationCount();
});
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.admin-content {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 200px;
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  border-right: 1px solid #34495e;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.admin-sidebar ul {
  list-style-type: none;
  padding: 0;
  margin-left: 0;
}

.admin-sidebar li {
  margin: 10px 0;
  margin-left: 5px;
}

.sidebar-link {
  text-decoration: none;
  color: #ecf0f1;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  position: relative;
}

.sidebar-link:hover,
.sidebar-link.router-link-active {
  background-color: #34495e;
}

.text {
  flex: 1; 
  margin-left: -20px; 
}

.badge {
  background-color: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
  position: absolute;
  right: -10px; /* Adjust spacing from the right edge */
  text-align: center;
}
</style>
