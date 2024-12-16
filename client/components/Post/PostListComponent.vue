<script setup lang="ts">
import { usePostStore } from "@/stores/post";
// import { storeToRefs } from "pinia";
import router from "@/router";
import { onMounted, ref } from "vue";
import { MetObjectData } from "../../stores/post";
import { fetchy } from "../../utils/fetchy";
import PostComponent from "./PostComponent.vue";
const posts = ref<MetObjectData[]>([]);
const { selectPost } = usePostStore();
const props = defineProps(["era"]);
onMounted(async () => {
  posts.value = await fetchy(`/api/posts/${props.era}`, "GET");
});

const goToStory = async (post: MetObjectData) => {
  selectPost(post);
  const storyId = await fetchy(`/api/stories/post/${post._id}`, "GET");
  await router.push({ name: "Story", params: { storyId: storyId } });
};

const createStory = async (post: MetObjectData) => {
  selectPost(post);
  await router.push({ name: "CreateStory" });
};
</script>

<template>
  <div class="text" v-if="props.era">Choose a Met Artwork to Explore</div>
  <div class="text" v-else>Choose a Met Artwork</div>
  <div class="card-grid" v-if="props.era">
    <PostComponent v-for="post in posts" :key="post._id" :post="post" :selectButton="true" :era="true" @select="goToStory" />
  </div>
  <div class="card-grid" v-else>
    <PostComponent v-for="post in posts" :key="post._id" :post="post" :selectButton="true" :era="false" @select="createStory" />
  </div>
</template>

<style scoped>
.text {
  margin-bottom: 2rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5em;
  margin: 2em auto;
  padding: 1em;
  max-width: 1200px;
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

.post-card {
  text-align: center;
  border-radius: 12px;
  overflow: hidden;
}
</style>
