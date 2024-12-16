import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import AboutView from "../views/AboutView.vue";
import ContactView from "../views/ContactView.vue";
import ContributeView from "../views/ContributeView.vue";
import CreateStoryView from "../views/CreateStoryView.vue";
import EraView from "../views/EraView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import StoryView from "../views/StoryView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      meta: { requiresAuth: false },
    },
    // {
    //   path: "/setting",
    //   name: "Settings",
    //   component: SettingView,
    //   meta: { requiresAuth: true },
    // },CreateStory
    {
      path: "/create-story",
      name: "CreateStory",
      component: CreateStoryView,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/about",
      name: "About",
      component: AboutView,
      meta: { requiresAuth: false },
    },
    {
      path: "/contribute",
      name: "Contribute",
      component: ContributeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/contact",
      name: "Contact",
      component: ContactView,
      meta: { requiresAuth: false },
    },
    {
      path: "/story/:storyId",
      name: "Story",
      component: StoryView,
      props: true,
      meta: { requiresAuth: false },
    },
    {
      path: "/era/:eraName",
      name: "Era",
      component: EraView,
      props: true,
      meta: { requiresAuth: false },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Home" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
