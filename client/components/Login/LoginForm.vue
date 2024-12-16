<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const { loginUser, updateSession } = useUserStore();

const username = ref("");
const password = ref("");

async function login() {
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <PrimeForm @submit="login" class="login-form">
    <!-- Username Field -->
    <div class="username">
      <div>Username:</div>
      <PrimeInputText v-model="username" type="text" placeholder="Username" fluid />
    </div>
    <!-- Password Field -->
    <div class="password">
      <div>Password:</div>
      <PrimeInputText v-model="password" type="password" placeholder="Password" fluid />
    </div>
    <!-- Submit Button -->
    <PrimeButton type="submit" severity="secondary" label="Login" class="submit" />
  </PrimeForm>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  /* background-color: #E08DAC; */
}

.username,
.password {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
</style>
