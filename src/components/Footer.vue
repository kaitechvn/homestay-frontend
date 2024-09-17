<template>
  <footer class="bg-dark text-light pt-5 pb-4">
    <div class="container">
      <div class="row">
        <!-- About Us -->
        <div class="col-lg-3 col-md-6 mb-4">
          <h5 class="text-uppercase mb-4">{{ $t('footer.aboutUs') }}</h5>          
          <p>
            {{ $t('footer.aboutUsText') }}
          </p>
          <div class="mt-4">
            <ul class="list-unstyled">
              <li><a href="/privacy" class="text-light">{{ $t('footer.privacyPolicy') }}</a></li>
              <li><a href="/terms" class="text-light">{{ $t('footer.termsOfService') }}</a></li>
            </ul>
          </div>
        </div>

        <!-- Top Places (Smaller) -->
        <div class="col-lg-2 col-md-6 mb-4">
          <h5 class="text-uppercase mb-4">{{ $t('footer.topPlaces') }}</h5>
          <ul class="list-unstyled">
            <li><a href="#" class="text-light">New York</a></li>
            <li><a href="#" class="text-light">Paris</a></li>
            <li><a href="#" class="text-light">Tokyo</a></li>
            <li><a href="#" class="text-light">London</a></li>
          </ul>
        </div>

        <!-- Social Media -->
        <div class="col-lg-4 col-md-6 mb-4 social-media-section">
          <h5 class="text-uppercase mb-4">{{ $t('footer.followUs') }}</h5>
          <div class="d-flex">
            <a href="https://www.facebook.com/kaitechdev/" class="text-light me-4" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-facebook fa-2x"></i>
            </a>
            <a href="https://www.instagram.com/khaisuperrr/" class="text-light me-4" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram fa-2x"></i>
            </a>
            <a href="https://www.linkedin.com/in/kaitechdev/" class="text-light" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-linkedin fa-2x"></i>
            </a>
          </div>
          <!-- Email Registration -->
          <div class="mt-4">
            <h6 class="text-uppercase">{{ $t('footer.subscribeTitle') }}</h6>
            <form @submit.prevent="subscribeEmail">
              <div class="input-group" style="max-width: 80%;">
                <input type="email" class="form-control" placeholder="Email" required />
                <button type="submit" class="btn btn-warning">{{ $t('footer.subscribe') }}</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Contact Us -->
        <div class="col-lg-3 col-md-6 mb-4">
          <h5 class="text-uppercase mb-4">{{ $t('footer.contactUs') }}</h5>
          <ul class="list-unstyled">
            <li><i class="fas fa-envelope"></i> khaibq1@vmogroup.com</li>
            <li><i class="fas fa-phone"></i> +8436782589</li>
            <li><i class="fas fa-map-marker-alt"></i> {{ $t('footer.contactAddress') }}</li>
          </ul>
        </div>
      </div>
      <hr class="my-4" />
      <div class="text-center">
        <p class="mb-0">&copy; 2024 VMO Homestay</p>
      </div>
    </div>
  </footer>
</template>


<script setup>
function subscribeEmail() {
  alert('You have successfully subscribed!');
}
</script>

<style scoped>
footer {
  background-color: #343a40;
}

footer h5 {
  color: #ffc107;
}

footer ul li {
  margin-bottom: 10px;
}

footer ul li a {
  text-decoration: none;
}

footer ul li a:hover {
  text-decoration: underline;
}

/* Move the social media section slightly to the left */
.social-media-section {
  margin-left: -15px;
}

input.form-control {
  border-radius: 0;
}

button.btn-warning {
  border-radius: 0;
}
</style>