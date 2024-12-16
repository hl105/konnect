<script setup lang="ts">
import PostComponent from "@/components/Post/PostComponent.vue";
import { usePostStore } from "@/stores/post";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
// import { useRouter } from "vue-router";
import UnlockedComponent from "@/components/Reward/UnlockedComponent.vue";
import router from "@/router";
import { fetchy } from "../utils/fetchy";

// Access the Pinia stores
const postStore = usePostStore();
const { currentUsername } = storeToRefs(useUserStore());
const earned = ref<string | null>(null);
const started = ref<string | null>(null);
const selectedPost = postStore.selectedPost;
const response = ref();

onMounted(() => {
  if (!selectedPost) {
    void router.push({ name: "Contribute" });
  }
});
// Reactive state for the story form
const story = reactive<{
  period: string;
  artwork: { body: string };
  contexts: { title: string; body: string }[];
}>({
  period: "",
  artwork: {
    body: selectedPost?.description || "",
  },
  contexts: [
    {
      title: "",
      body: "",
    },
  ],
});

// Function to navigate back to contribute page
const goToPosts = async () => {
  await router.push({ name: "Contribute" });
};

// Function to add a new artwork context
const addContext = () => {
  story.contexts.push({ title: "", body: "" });
};

// Function to remove an artwork context by index
const removeContext = (index: number) => {
  story.contexts.splice(index, 1);
};

// Function to submit the story
const submitStory = async () => {
  if (!story.artwork.body) {
    alert("Please fill out all required fields for the artwork story.");
    return;
  }

  // Validate context stories if any
  for (let i = 0; i < story.contexts.length; i++) {
    const context = story.contexts[i];
    if (!context.title || !context.body) {
      alert(`Please fill out all fields for context story #${i + 1}.`);
      return;
    }
    if (!story.artwork.body.includes(context.title)) {
      alert(`The phrase "${context.title}" does not exist in the artwork description.`);
      return;
    }
  }

  const payload = {
    title: selectedPost?.title ?? "",
    type: "artwork",
    postId: String(selectedPost?._id),
    text: story.artwork.body,
    period: selectedPost?.period ?? "",
    author: currentUsername.value,
    contexts: story.contexts.map((context) => ({
      title: context.title,
      type: "artworkContext",
      postId: String(selectedPost?._id),
      text: context.body,
      period: selectedPost?.period ?? "",
      author: currentUsername.value,
    })),
  };

  try {
    response.value = await fetchy("/api/stories", "POST", { body: payload });
    console.log("Story submitted:", response.value.story);
    console.log("AH", response.value.earned, response.value.started);
    earned.value = response.value.earned;
    started.value = response.value.started;
    alert("Story submitted successfully!");
    if (earned.value !== "updated" && started.value !== "start new badge") {
      await router.push({ name: "Story", params: { storyId: response.value.story._id } });
    }
  } catch (error) {
    console.error("Error submitting stories:", error);
    alert("Failed to submit stories. Please try again.");
  }
};
</script>

<template>
  <div class="create-story">
    <h2>Create Your Own Konnect Story</h2>

    <!-- Display Selected Post Information -->
    <div v-if="selectedPost" class="field">
      <PostComponent class="selected-post-card" :post="postStore.selectedPost" :selectButton="false"></PostComponent>
    </div>
    <div v-else>
      <p>No post selected. Please select a post first.</p>
      <PrimeButton label="Go to Posts" @click="goToPosts" />
    </div>

    <!-- Story Creation Form -->
    <div v-if="selectedPost" class="create-story-form">
      <!-- Artwork Story -->
      <PrimeCard>
        <template #title>Artwork Description</template>
        <template #content>
          <p class="m-0">
            {{ story.artwork.body }}
          </p>
        </template>
      </PrimeCard>

      <!-- Artwork Context Stories -->
      <div class="field">
        <label>Artwork Context</label>
        <div v-for="(context, index) in story.contexts" :key="index" class="context-item">
          <div class="text-title">
            <div>Choose a phrase from above to add more context to:</div>
            <PrimeInputText v-model="context.title" placeholder="Enter exact phrase" />
          </div>

          <PrimeEditor v-model="context.body" style="height: 150px" placeholder="What context do you want to add to this phrase?" />
          <PrimeButton icon="pi pi-trash" @click="removeContext(index)" label="Remove Context" />
        </div>
        <PrimeButton icon="pi pi-plus" label="Add Context" class="p-button-secondary" @click="addContext" />
      </div>

      <!-- Submit Button -->
      <PrimeButton label="Submit" @click="submitStory" />
    </div>
    <UnlockedComponent v-if="earned === 'updated' || started === 'start new badge'" :earned="earned" :started="started" :storyId="response.story._id" />
  </div>
</template>

<style scoped>
.create-story {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.field {
  margin-bottom: 20px;
  margin-top: 20px;
}

.selected-post-card {
  margin-bottom: 20px;
}

.post-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background-color: var(--p-primary-900);
}

.context-item {
  margin-bottom: 20px;
}

.text-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2em;
  padding: 1em;
}
</style>
