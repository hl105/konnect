<script setup lang="ts">
// import PostComponent from "@/components/Post/PostComponent.vue";
import UserBadges from "@/components/Reward/UserBadges.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

interface Post {
  _id: string;
}
const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
const posts = ref<Post[]>([]);

async function logout() {
  await logoutUser();
  void router.push({ name: "Login" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Login" });
}

const fetchUserPosts = async () => {
  try {
    const response = await fetchy(`/api/posts/${currentUsername.value}`, "GET");
    posts.value = response;
  } catch (error) {
    console.error("Error fetching user posts", error);
  }
};

onMounted(async () => {
  await fetchUserPosts();
});
</script>

<template>
  <div class="background"></div>
  <main class="profile">
    <div class="header">
      <div class="profile-container">
        <img class="profile-image" src="../assets/images/wallpaper.png" />
        <h1>{{ currentUsername }}</h1>
      </div>
      <div class="button-container">
        <button class="button" id="logout" @click="logout">Logout</button>
        <button class="button" id="delete" @click="delete_">Delete User</button>
      </div>
    </div>
    <!-- <div class="posts">
      <h2>Posts</h2>
      <div class="post-grid">
        <PostComponent v-for="post in posts" :key="post._id" :post="post" @refreshPosts="fetchUserPosts" class="post" />
      </div>
    </div> -->
  </main>
  <!--badges will go here-->
  <UserBadges></UserBadges>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  max-width: 100%;
  align-items: center;
  justify-content: space-between;
  padding-left: 4em;
  padding-top: 2em;
}

.button-container {
  display: flex;
  padding: 2em;
  gap: 2em;
  margin-right: 3em;
}

.profile-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

h1 {
  font-size: 4em;
  color: black;
}

.profile-image {
  width: 8em;
  height: 8em;
  border-radius: 50%;
  border: 0.3em solid black;
  object-fit: cover;
}

.pure-button {
  border: 0.1em solid #000000;
  background-color: white;
}

/* .posts {
  display: flex;
  flex-direction: column;
  align-items: center;
} */

/* .post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5em;
  margin: 2em auto;
  padding: 1em;
  max-width: 1200px;
} */

.button {
  cursor: pointer;
  font-size: 1em;
  padding: 0.5em 1em;
  background-color: white;
  color: #063970;
  border-radius: 5px;
  font-weight: bold;
}

.button:hover {
  background-color: #e6f7ff;
}
</style>
