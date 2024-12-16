<script setup lang="ts">
const props = defineProps(["post", "selectButton", "era"]);
const emit = defineEmits(["select"]);
const post = props.post;
</script>

<template>
  <PrimeCard class="post-card">
    <template #header>
      <img :src="post.primaryImage" alt="Post Image" class="post-image" />
    </template>
    <template #title>
      <h3>{{ post.title }}</h3>
    </template>
    <template #content>
      <p>Period: {{ post.period }}</p>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-1">
        <PrimeButton v-if="selectButton && !era" label="select" class="p-button-primary mt-2" @click="emit('select', post)" />
        <PrimeButton v-if="selectButton && era" label="explore ✨" class="p-button-primary mt-2" @click="emit('select', post)" />
      </div>
    </template>
  </PrimeCard>
</template>

<style scoped>
.post-card {
  text-align: center;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: var(--p-primary-900);
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>
<!-- <script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};
</script>

<template>
  <p class="author">{{ props.post.author }}</p>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style> -->
