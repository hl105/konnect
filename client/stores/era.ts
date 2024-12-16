import { defineStore } from "pinia";
import { ref } from "vue";

export const useEraStore = defineStore(
  "eraStore",
  () => {
    const selectedEra = ref("");
    const selectEra = (era: string) => {
      selectedEra.value = era;
    };

    return {
      selectedEra,
      selectEra,
    };
  },
  { persist: true },
);
