<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const { isLoggedIn } = useUserStore();
const showRegisterForm = ref(false);

const toggleForm = () => {
  showRegisterForm.value = !showRegisterForm.value;
};
</script>

<template>
  <main>
    <section v-if="!isLoggedIn" class="login-container">
      <div v-if="!showRegisterForm" class="form-container">
        <h1>Welcome Back!</h1>
        <LoginForm />
        <div>Don't have an account?</div>
      </div>
      <div v-else class="form-container">
        <h1>Welcome to Konnect!</h1>
        <RegisterForm />
        <div>Yes I have an account?</div>
      </div>

      <PrimeButton @click="toggleForm" class="toggle-form-button">
        {{ showRegisterForm ? "Back to Login" : "Create New User" }}
      </PrimeButton>
    </section>
  </main>
  <div class="background-shapes"></div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding-top: 25vh;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.toggle-form-button {
  background: var(--p-primary-500);
}
.toggle-form-button:hover {
  background: var(--p-primary-900);
}

.background-shapes {
  position: absolute;
  top: 0;
  right: 0;
  width: 70%;
  min-height: 100%;
  background: radial-gradient(circle at 90% 25%, #ba4160 23%, transparent 50%), radial-gradient(circle at 97% 15%, #0b6db7 40%, transparent 70%);
  z-index: -2;
  overflow: hidden;
}
</style>
