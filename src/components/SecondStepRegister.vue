<template>
  <form @submit.prevent="handleSubmit">
    <div class="row gy-2 overflow-hidden">
      <div class="col-12">
        <div class="form-floating mb-2">
          <input v-model="form.username" type="text" class="form-control" :placeholder="$t('register.username')" />
          <label>{{ $t('register.username') }}</label>
        </div>
      </div>
      <div class="col-12">
        <div class="form-floating mb-2">
          <input v-model="form.email" type="email" class="form-control" :placeholder="$t('register.email')" />
          <label>{{ $t('register.email') }}</label>
        </div>
      </div>
      <div class="col-12">
        <div class="form-floating mb-2">
          <input v-model="form.phone" type="text" class="form-control" :placeholder="$t('register.phone')" />
          <label>{{ $t('register.phone') }}</label>
        </div>
      </div>
      <div class="col-12">
        <div class="form-floating mb-2">
          <input v-model="form.password" type="password" class="form-control" :placeholder="$t('register.password')" />
          <label>{{ $t('register.password') }}</label>
        </div>
      </div>
      <div class="col-12">
        <div class="form-floating mb-2">
          <input v-model="form.confirmPassword" type="password" class="form-control" :placeholder="$t('register.confirmPassword')" required />
          <label>{{ $t('register.confirmPassword') }}</label>
        </div>
      </div>
      <div class="col-12 d-flex gap-2">
        <button class="btn btn-secondary flex-button" @click.prevent="handlePrev">{{ $t('register.back') }}</button>
        <button class="btn btn-primary flex-button" type="submit">{{ $t('register.submit') }}</button>
      </div>
    </div>
  </form>
</template>

<script setup>
const props = defineProps(['form']);
const emit = defineEmits(['prev', 'submit']);


// Function to check if passwords match
function validatePasswords() {
  return props.form.password === props.form.confirmPassword;
}

function handlePrev() {
  emit('prev');
}

function handleSubmit() {
  if (validatePasswords()) {
    emit('submit');
  } else {
    alert('Passwords do not match.');
  }
}
</script>

<style scoped>
/* Flexbox layout for equal button sizes */
.flex-button {
  flex: 1; /* Ensure both buttons take equal space */
  min-width: 0; /* Prevent shrinking below content */
}

.col-12.d-flex {
  display: flex; /* Ensure flex container behavior */
  gap: 0.5rem; /* Optional: Adjust spacing between buttons */
}

/* Optional: Add some padding to buttons */
.btn {
  padding: 0.5rem 1rem;
}
</style>
