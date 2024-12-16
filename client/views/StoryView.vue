<script setup lang="ts">
import router from "@/router";
import { MetObjectData, usePostStore } from "@/stores/post";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { StoryDoc } from "../../server/concepts/storying";
import { fetchy } from "../utils/fetchy";
const images = computed(() => {
  if (!selectedPost || !selectedPost.additionalImages) return [];
  return selectedPost.additionalImages.map((imgUrl, index) => ({
    itemImageSrc: imgUrl,
    thumbnailImageSrc: imgUrl,
    alt: `${selectedPost.title}-additional-${index}`,
    title: selectedPost.title,
  }));
});

const route = useRoute();
const postStore = usePostStore();
const selectedPost = postStore.selectedPost as MetObjectData;

const artworkStory = ref<StoryDoc | null>(null);
const contextStories = ref<StoryDoc[]>([]);

onBeforeMount(async () => {
  try {
    const storyId = route.params.storyId as string;
    artworkStory.value = await fetchy(`/api/stories/${storyId}`, "GET");
    contextStories.value = await fetchy(`/api/stories/artwork/${storyId}/contexts`, "GET");
    processStoryText();
  } catch (error: any) {
    console.error("Error fetching story:", error);
    alert("Failed to load the story.");
  }
});

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

interface TextSegment {
  type: "text" | "button";
  content: string;
  contextId?: string;
}

const textSegments = ref<TextSegment[]>([]);

const processStoryText = () => {
  if (!artworkStory.value) return;
  const rawText = artworkStory.value.text;

  // Split logic: find phrases and create segments
  // For simplicity, assume phrases do not overlap and appear only once
  textSegments.value = [];
  let currentIndex = 0;

  contextStories.value.forEach((context) => {
    const phrase = context.title;
    const escapedPhrase = escapeRegExp(phrase);
    const regex = new RegExp(`\\b(${escapedPhrase})\\b`, "g");
    let match;
    while ((match = regex.exec(rawText)) !== null) {
      const phraseStart = match.index;
      const phraseEnd = phraseStart + match[0].length;

      // Add text before this phrase
      if (phraseStart > currentIndex) {
        textSegments.value.push({
          type: "text",
          content: rawText.slice(currentIndex, phraseStart),
        });
      }

      // Add the button segment
      textSegments.value.push({
        type: "button",
        content: match[0],
        contextId: context.title.replace(/\s+/g, "-").toLowerCase(),
      });

      currentIndex = phraseEnd;
    }
  });

  // Add any remaining text after last phrase
  if (currentIndex < rawText.length) {
    textSegments.value.push({
      type: "text",
      content: rawText.slice(currentIndex),
    });
  }
};

// Handle clicks inside the .description container on context buttons
const handlePhraseClick = (event: Event) => {
  const target = event.target as HTMLElement;
  const contextButton = target.closest(".context-button") as HTMLElement | null;

  if (contextButton) {
    const contextId = contextButton.getAttribute("data-context-id");
    if (contextId) {
      const section = document.getElementById(contextId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn("No section found for contextId:", contextId);
      }
    }
  }
};

const navigateToHome = async () => {
  await router.push({ name: "Home" });
};
</script>

<template>
  <div v-if="!artworkStory" class="loading">Loading story...</div>
  <div v-else class="story-view">
    <div class="post-display">
      <div class="image-section">
        <img v-if="selectedPost?.primaryImage" :src="selectedPost.primaryImage" :alt="selectedPost.title" class="primary-image" />
      </div>

      <div class="detail-container">
        <div class="post-details">
          <h2>{{ selectedPost.title }}</h2>
          <p><strong>Object ID: </strong> {{ selectedPost.objectID }}</p>
          <p>
            <strong>Culture: </strong>
            <span>{{ selectedPost.culture }}</span>
          </p>
          <p>
            <strong>Period: </strong>
            <span>{{ selectedPost.period }}</span>
          </p>
          <p>
            <strong>Object Date: </strong>
            <span>{{ selectedPost.objectDate }}</span>
          </p>
          <p>
            <strong>Medium: </strong>
            <span>{{ selectedPost.medium }}</span>
          </p>
        </div>
        <!-- Galleria for Additional Images -->
        <div v-if="selectedPost.additionalImages && selectedPost.additionalImages.length > 0">
          <h3>Additional Images</h3>
          <PrimeGalleria :value="images" containerStyle="max-width: 30rem" :numVisible="3" :circular="true" style="width: 100%" :showItemNavigators="true" :showThumbnails="false">
            <template #item="slotProps">
              <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
            </template>
            <template #thumbnail="slotProps">
              <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
            </template>
          </PrimeGalleria>
        </div>
      </div>
    </div>

    <!-- Description section side by side with post-display -->
    <div class="description" @click="handlePhraseClick">
      <h2>Story</h2>
      <div class="story-text">
        <span v-for="(segment, index) in textSegments" :key="index">
          <template v-if="segment.type === 'text'">
            {{ segment.content }}
          </template>
          <template v-else>
            <PrimeButton type="button" class="context-button" :data-context-id="segment.contextId">
              {{ segment.content }}
            </PrimeButton>
          </template>
        </span>
      </div>

      <!-- Context Sections at the bottom -->
      <div class="context-sections">
        <h2>Konnect</h2>
        <div v-for="context in contextStories" :key="context.title" :id="context.title.replace(/\s+/g, '-').toLowerCase()" class="context-section">
          <PrimePanel class="context" :header="context.title" toggleable :collapsed="true">
            <div class="context" v-html="context.text"></div>
          </PrimePanel>
        </div>
      </div>
      <PrimeButton @click="navigateToHome">Close Story</PrimeButton>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
.context {
  margin: 2rem;
}

:deep(.context img) {
  max-width: 100%;
  height: auto;
  display: block;
}

.story-view {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: top;
  gap: 20px;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.post-display {
  max-width: 40rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.description {
  max-width: 50rem;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-section {
  position: relative;
  width: 100%;
}

.primary-image {
  width: 80%;
  object-fit: cover;
}

.post-details {
  padding: 20px;
}

.highlight-context {
  font-style: italic;
  text-decoration: underline;
}

.loading {
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
}

/* Style the context buttons */
.context-button {
  background: var(--p-primary-700);
  color: #fff;
  border: none;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 2px;
  font-size: 0.9em;
  line-height: 1.2;
}
.context-button:hover {
  background: var(--p-primary-700);
}

/* .context-sections {
  width: 100%;
  margin-top: 40px;
}

.context-section {
  margin-bottom: 20px;
  padding: 10px;
  background: #f3f3f3;
  border-radius: 5px;
} */
</style>
