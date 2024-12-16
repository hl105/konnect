<script setup lang="ts">
import router from "@/router";
import { onMounted, ref } from "vue";

const box = ref<HTMLElement | null>(null); // Reference to the .box element
const prevButton = ref<HTMLSpanElement | null>(null);
const nextButton = ref<HTMLSpanElement | null>(null);

const handleClickPrev = () => {
  if (!box.value) return;
  const items = box.value.querySelectorAll(".item");
  if (items.length > 0) {
    box.value.appendChild(items[0]); // Move the first item to the end
  }
};

const handleClickNext = () => {
  if (!box.value) return;
  const items = box.value.querySelectorAll(".item");
  if (items.length > 0) {
    box.value.prepend(items[items.length - 1]); // Move the last item to the beginning
  }
};

onMounted(() => {
  if (prevButton.value) {
    prevButton.value.addEventListener("click", handleClickPrev);
  }
  if (nextButton.value) {
    nextButton.value.addEventListener("click", handleClickNext);
  }
});

const navigateTo = async (storyId: string) => {
  await router.push({ name: "Story", params: { storyId: storyId } });
};
</script>

<template>
  <div ref="box" class="box">
    <div class="item" @click="navigateTo('675fadd3400e0aef87133283')"><img src="https://i.imgur.com/71xXgt4.png" /></div>
    <div class="item" @click="navigateTo('675f9eef400e0aef87133282')"><img src="https://i.imgur.com/iXX1954.png" /></div>
    <div class="item" @click="navigateTo('675fb471400e0aef87133284')"><img src="https://i.imgur.com/5QVJDVg.png" /></div>
    <div class="item" @click="navigateTo('675fb8ee400e0aef87133285')"><img src="https://i.imgur.com/tq0cPHu.png" /></div>
    <div class="item" @click="navigateTo('675fbd38400e0aef87133286')"><img src="https://i.imgur.com/sXIlyeN.png" /></div>
    <div class="item" @click="navigateTo('675fc4c6400e0aef87133287')"><img src="https://i.imgur.com/QoeqPZi.png" /></div>
  </div>
  <div class="buttons">
    <span ref="prevButton" class="prev"></span>
    <span ref="nextButton" class="next"></span>
  </div>
</template>

<style>
.box {
  position: relative;
  display: flex;
  transform-style: preserve-3d;
  perspective: 500px;
}
.box .item {
  position: absolute;
  top: calc(2rem);
  left: calc(20rem);
  width: 200px;
  height: 300px;
  background: white;
  transition: 0.5s;
  box-shadow: 0 0 50px rgba(203, 215, 234, 0.5);
  transform-style: preserve-3d;
  transform-origin: bottom;
  user-select: none;
  -webkit-box-reflect: below 1px linear-gradient(transparent, transparent, #000200);
}

.box .item:nth-child(1) {
  transform: translate3d(-250px, 0, 0) scale(0.8) rotateY(25deg);
  z-index: 1;
}
.box .item:nth-child(2) {
  transform: translate3d(-250px, 0, 0) scale(0.8) rotateY(25deg);
  z-index: 2;
}
.box .item:nth-child(3) {
  transform: translate3d(-150px, 0, 0) scale(0.9) rotateY(15deg);
  z-index: 3;
}
.box .item:nth-child(4) {
  transform: translate3d(0px, 0, 0) scale(1) rotateY(0deg);
  z-index: 4;
}
.box .item:nth-child(5) {
  transform: translate3d(150px, 0, 0) scale(0.9) rotateY(-15deg);
  z-index: 3;
}
.box .item:nth-child(6) {
  transform: translate3d(250px, 0, 0) scale(0.8) rotateY(-25deg);
  z-index: 2;
}
.box .item:nth-child(7) {
  transform: translate3d(250px, 0, 0) scale(0.8) rotateY(-25deg);
  z-index: -1;
}
.box .item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.buttons {
  position: absolute;
  bottom: 10rem;
  left: 54rem;
  display: flex;
  gap: 20px;
}
.buttons span {
  position: relative;
  width: 50px;
  height: 50px;
  border: 2px solid black;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
}
.buttons span:hover {
  opacity: 1;
}
.buttons span::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-top: 2px solid black;
  border-left: 2px solid black;
  rotate: -45deg;
}
.buttons span:last-child::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-top: 2px solid black;
  border-left: 2px solid black;
  rotate: 135deg;
}
</style>
