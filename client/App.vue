<script setup lang="ts">
import router from "@/router";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure  to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
    console.log("something went wrong while updating session");
  }
});

const navigateTo = async (viewName: string) => {
  await router.push({ name: viewName });
};
</script>

<template>
  <header>
    <nav v-if="currentRouteName !== 'Login'">
      <h1 class="title" @click="navigateTo('Home')">Konnect</h1>
      <ul>
        <li @click="navigateTo('About')">About</li>
        <li @click="navigateTo('Contribute')">Contribute</li>
        <li v-if="isLoggedIn">
          <div :to="{ name: 'Profile' }" :class="{ underline: currentRouteName == 'Profile' }" class="profile-link">
            <i class="pi pi-user"></i>
            <!-- icon -->
            <span @click="navigateTo('Profile')">Profile</span>
          </div>
        </li>
        <li v-else>
          <div :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }" class="profile-link">
            <i class="pi pi-user"></i>
            <span @click="navigateTo('Login')">Login</span>
          </div>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
  <!-- Background shapes -->
  <!-- <div class="background-shapes"></div> -->
  <div class="background"></div>
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  display: flex;
  align-items: center;
  cursor: pointer;
}

h1 {
  font-size: 2em;
  margin: 0;
  color: #0f147f;
  cursor: pointer;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.profile-link {
  display: flex; /* Aligns icon and text horizontally */
  align-items: center; /* Vertically centers the icon and text */
  gap: 0.5rem; /* Adjusts the spacing between the icon and the text */
  text-decoration: none; /* Optional: Remove underline from the link */
  color: inherit; /* Matches the text color with the theme */
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #ffffff, #0b6db7);
  overflow: hidden;
  z-index: -3;
}
</style>
