<template>
  <section class="bg-custom py-3 py-md-4 py-xl-6">
    <div class="container">
      <div class="row gy-3 align-items-center">
        <!-- Add a spacer column for the logo to push the form card to the right -->
        <div class="col-12 col-md-6 col-xm-6 d-flex justify-content-center">
          <img src="@/assets/logo-register.png" alt="Description of image" class="img-fluid rounded-4" style="max-width: 83%; height: auto;">
        </div>
        <div class="col-12 col-md-5 col-xl-5">
          <div class="card border-0 rounded-4">
            <div class="card-body p-2 p-md-3 p-xl-3">
              <div class="row">
                <div class="col-12">
                  <h3 class="text-center mb-3">{{ $t('register.sign_up') }}</h3>
                  <div v-if="successMessage" class="alert alert-success" role="alert">
                    {{ successMessage }}
                  </div>
                  <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ $t(`errors.${errorMessage}`) }}
                  </div>
                </div>
              </div>
              <div v-if="step === 1">
                <FirstStepRegister @next="nextStep" :form="form" />
              </div>
              <div v-else-if="step === 2">
                <SecondStepRegister @prev="prevStep" @submit="submitForm" :form="form" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import FirstStepRegister from '@/components/FirstStepRegister.vue';
import SecondStepRegister from '@/components/SecondStepRegister.vue';  
import axiosInstance from '@/plugins/axios';

const { t } = useI18n();
const router = useRouter(); // Initialize useRouter
const errorMessage = ref('');
const successMessage = ref(''); // Add successMessage ref
const step = ref(1);
const form = ref({
  firstName: '',
  lastName: '',
  address: '',
  dOb: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

function nextStep(formData) {
  Object.assign(form.value, formData);
  step.value = 2;
}

function prevStep() {
  step.value = 1;
}

async function submitForm() {
  const { confirmPassword, ...dataToSend } = form.value;

  try {
    const response = await axiosInstance.post('/auth/register', dataToSend);
    // Handle success response
    console.log('Registration successful:', response.data);
    successMessage.value = 'Registration successful!'; // Set success message
    setTimeout(() => {
      router.push('/login'); // Redirect to login page after a delay
    }, 2300); // Adjust the delay as needed
  } catch (error) {
    // Set the error message from backend response
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.code || 'Registration failed.';
    } else {
      errorMessage.value = 'An unknown error occurred.';
    }
  }
}
</script>

<style scoped>
.bg-custom {
  background-color: #ffbc70e1;
}
</style>
