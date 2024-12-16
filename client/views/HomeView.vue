<script setup lang="ts">
import ChooseEra from "@/components/Post/ChooseEra.vue";
import ExampleStories from "@/components/Story/ExampleStories.vue";
import "primeicons/primeicons.css";
import Button from "primevue/button";
import { ref } from "vue";

const chooseEraSection = ref<HTMLElement | null>(null);

function scrollToChooseEra() {
  if (chooseEraSection.value) {
    chooseEraSection.value.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<template>
  <main>
    <section>
      <h1 class="hero-container">
        <!-- Hero Section -->
        <section class="hero-section">
          <h1 class="main-heading">
            WHERE KOREAN <br />
            HISTORY MEETS ART
          </h1>
          <!-- Features Section -->
          <div class="features">
            <div class="feature-item">
              <span class="feature-icon">
                <i class="pi pi-palette"></i>
              </span>
              <p class="highlight">MET Museum Open-Source Artwork</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">
                <i class="pi pi-star"></i>
              </span>
              <p>Earn Badges by Completing Reflections</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">
                <i class="pi pi-user-edit"></i>
              </span>
              <p>Contribute by Creating Your Own Story</p>
            </div>
          </div>
          <!-- Call-to-Actions -->
          <div class="cta-buttons">
            <Button id="blue-button" label="Get Started" class="p-button-primary" @click="scrollToChooseEra" />
            <Button id="red-button" label="About" class="p-button-danger" />
          </div>
        </section>
        <ExampleStories></ExampleStories>
      </h1>
    </section>
    <div class="section" ref="chooseEraSection" v-animateonscroll="{ enterClass: 'animate-fadein', leaveClass: 'animate-fadeout' }">
      <ChooseEra></ChooseEra>
    </div>
    <div class="section" v-animateonscroll="{ enterClass: 'animate-fadein', leaveClass: 'animate-fadeout' }">
      <img class="met-img" src="https://cdn.sanity.io/images/cctd4ker/production/fe044ce8a0a4cde34677a345dee2693a0050210f-5120x1707.jpg?rect=18,9,5102,1698&w=1920&q=75&auto=format" />
    </div>
    <div>
      <p style="padding: 2rem">Made by Johanna Lee, MAS 246 Final Project</p>
    </div>
  </main>
</template>

<style scoped>
.section {
  margin: 6rem auto;
  max-width: 800px;
  padding: 1rem;
  text-align: center;
  display: flex;
  justify-content: center;
}

h1 {
  text-align: left;
}

.hero-container {
  display: flex;
  padding: 10vh;
}
.main-heading {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3b3b98;
}
/* Features Section */
.features {
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  padding: 0;
  margin: 0;
}
.feature-item {
  display: flex;
  align-items: left;
  justify-content: left;
  gap: 1rem;
}
.pi {
  color: #3b3b98; /* Blue for icons */
  margin-bottom: 2px;
}
p {
  font-size: 20px;
  font-family: Tahoma;
}
.highlight {
  background-color: #3b3b98;
  padding: 4px;
  padding-left: 5px;
  color: white;
}
/* Call-to-Action Buttons */
.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 1.5rem;
}
#blue-button {
  background: #0b6db7;
}
#blue-button:hover {
  background: #0a61a3;
}
#red-button {
  background: #ba4160;
}
#red-button:hover {
  background: #a63753;
}
.met-img {
  width: 100vw;
}
.animate-fadein {
  opacity: 0;
  animation: fadeIn 1s forwards;
}

.animate-fadeout {
  opacity: 1;
  animation: fadeOut 1s forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
