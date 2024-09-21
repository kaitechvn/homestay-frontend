<template>
    <form @submit.prevent="handleNext">
      <div class="row gy-2 overflow-hidden">
        <div class="col-12">
          <div class="form-floating mb-2">
            <input v-model="form.firstName" type="text" class="form-control" :placeholder="$t('register.firstName')"  />
            <label>{{ $t('register.firstName') }}</label>
          </div>
        </div>
        <div class="col-12">
          <div class="form-floating mb-2">
            <input v-model="form.lastName" type="text" class="form-control" :placeholder="$t('register.lastName')" />
            <label>{{ $t('register.lastName') }}</label>
          </div>
        </div>
        <div class="col-12">
          <div class="form-floating mb-2">
            <input v-model="form.address" type="text" class="form-control" :placeholder="$t('register.address')" />
          <label>{{ $t('register.address') }}</label>
          </div>
        </div>
        <div class="col-12">
          <div class="form-floating mb-2">
            <input v-model="form.dOb" type="date" class="form-control" :placeholder="$t('register.dob')" />
            <label>{{ $t('register.dob') }}</label>
          </div>
        </div>
        <div class="col-12">
          <div class="d-grid">
            <button class="btn btn-primary btn-sm" type="submit">{{ $t('register.next') }}</button>
          </div>
        </div>
      </div>
    </form>
  </template>
  
  <script setup>
  
  const props = defineProps(['form']);
  const emit = defineEmits(['next']);
  
  function handleNext() {
    emit('next', props.form);
  }
  </script>
  