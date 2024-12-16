import { defineStore } from "pinia";
import { ref } from "vue";
import { ObjectId } from "mongodb";

export interface MetObjectData {
  _id: ObjectId; // added
  objectID: string;
  title: string;
  primaryImage: string;
  additionalImages: string[];
  culture: string;
  period: string;
  dynasty: string;
  objectName: string;
  objectDate: string;
  department: string;
  medium: string;
  description: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistWikidata_URL: string;
}

type PostState = null | MetObjectData;

export const usePostStore = defineStore(
  "postStore",
  () => {
    const selectedPost = ref<PostState>(null);

    const selectPost = (post: MetObjectData) => {
      selectedPost.value = post;
    };

    const clearSelectedPost = () => {
      selectedPost.value = null;
    };

    return {
      selectedPost,
      selectPost,
      clearSelectedPost,
    };
  },
  { persist: true },
);
