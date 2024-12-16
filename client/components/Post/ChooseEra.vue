<script setup lang="ts">
import router from "@/router";

type EraEvent = "three-kingdoms" | "goryeo" | "joseon";

const handleEra = async (content: EraEvent) => {
  await router.push({ name: "Era", params: { eraName: content } });
};
</script>

<template>
  <div class="era-containers">
    <h1>CHOOSE AN ERA</h1>
    <div class="cards">
      <div class="card-container">
        <img class="met-img" src="https://i.imgur.com/BpmIhKW.png" />
        <h2>Three Kingdoms Period</h2>
        <h3>57 BCE to 676 CE</h3>
        <PrimeButton class="start-button" @click="handleEra('three-kingdoms')">Start</PrimeButton>
      </div>
      <div class="card-container">
        <img class="met-img" src="https://i.imgur.com/0yVpxZM.png" />
        <h2>Goryeo Dynasty</h2>
        <h3>918 to 1392 CE</h3>
        <PrimeButton class="start-button" @click="handleEra('goryeo')">Start</PrimeButton>
      </div>
      <div class="card-container">
        <img class="met-img" src="https://i.imgur.com/6HCq6j5.png" />
        <h2>Joseon dynasty</h2>
        <h3>1392 to 1910 CE</h3>
        <PrimeButton class="start-button" @click="handleEra('joseon')">Start</PrimeButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards {
  display: flex;
  flex-direction: row;
  gap: 25px;
}

.card-container {
  width: 30vw;
  height: 50vh;
  object-fit: fit;
  background-color: #e7e6d2;
  overflow: hidden;
  border-radius: 10px;
  border: 10px solid black;
}

.met-img {
  width: 100%;
  max-height: 50%;
}

h1 {
  color: #0b6db7;
  font-size: 8vw;
  margin-bottom: 4vw;
}

.start-button {
  width: 20vw;
  background-color: #0b6db7;
}
</style>
