import "@/assets/main.css";
import "purecss";

import { createPinia } from "pinia";

import { definePreset } from "@primevue/themes";
import PrimeVue from "primevue/config";

import Aura from "@primevue/themes/aura";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import "primeicons/primeicons.css";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import { Form } from "@primevue/forms";
import AnimateOnScroll from "primevue/animateonscroll";
import Button from "primevue/button";
import Card from "primevue/card";
import Editor from "primevue/editor";
import Galleria from "primevue/galleria";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Panel from "primevue/panel";
import Popover from "primevue/popover";
import SelectButton from "primevue/selectbutton";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia);
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{#CEEAFF}",
      100: "#B4DEFF",
      200: "#8DC1E8",
      300: "#68ABDF",
      400: "#4997D3",
      500: "#3087C9",
      600: "#1773B9",
      700: "#0A61A3", //main color
      800: "#0B5892",
      900: "#0B4D7F",
      950: "#093B61",
    },
  },
});

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: "never", // system / manual /always
    },
  },
});
// Register PrimeVue components
app.component("PrimeButton", Button);
app.component("PrimeInputText", InputText);
app.component("PrimeForm", Form);
app.component("PrimeCard", Card);
app.component("PrimeSelectButton", SelectButton);
app.component("PrimeEditor", Editor);
app.component("PrimeMessage", Message);
app.component("PrimePopover", Popover);
app.component("PrimeGalleria", Galleria);
app.component("PrimePanel", Panel);
app.directive("animateonscroll", AnimateOnScroll);
app.mount("#app");
