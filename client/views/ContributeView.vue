<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Create a story!</h1>
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

main {
  background-color: #dde7e7; /* Soft neutral background */
  padding: 2em;
  border-radius: 12px;
  max-width: 800px;
  margin: 2em auto;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
}
</style>
