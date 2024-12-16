<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const era = route.params.eraName as string;
const map: { [key: string]: string } = { "three-kingdoms": "Three Kingdoms period (57 BCE–676 CE)", goryeo: "Goryeo dynasty (918–1392)", joseon: "Joseon dynasty (1392–1910)" };
const period = map[era];
</script>

<template>
  <main>
    <h1>{{ period }}</h1>
    <PostListComponent :era="era" />
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
