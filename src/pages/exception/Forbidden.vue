<template>
    <div class="forbidden-page">
      <div class="forbidden-content">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>Oops! You don’t have permission to view this page.</p>
        <router-link to="/" class="btn-back">
          <i class="fas fa-arrow-left"></i> Go Home
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Forbidden",
  };
  </script>
  
  <style scoped>
  .forbidden-page {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Move content higher */
    background: radial-gradient(circle, #232526, #414345);
    color: #fff;
    padding-top: 5rem; /* Add space from the top */
  }
  
  
  .forbidden-content {
    text-align: center;
  }
  
  .forbidden-content h1 {
    font-size: 8rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  .forbidden-content h2 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  .forbidden-content p {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  .btn-back {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background-color: #ff5a5f;
    color: #fff;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    transition: background 0.3s ease;
  }
  
  .btn-back:hover {
    background-color: #e04c4c;
  }
  
  i {
    margin-right: 0.5rem;
  }
  </style>
  