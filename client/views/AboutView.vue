<script setup lang="ts"></script>

<template>
  <main>
    <section>
      <div class="logged-in">
        <h1>About</h1>
      </div>
    </section>
    <section class="section">
      <PrimePanel header="Why Konnect?" class="custom-panel" toggleable :collapsed="true">
        <p>Konnect provides a fun and engaging way to interact with the open-source Korean Collection in the Metropolitan Museum of Art (Korea-Connect).</p>
        <ul>
          <li>Create your own story.</li>
          <li>Find Artwork Stories based on Era</li>
          <li>Collect Badges by gathering points.</li>
        </ul>
      </PrimePanel>
    </section>

    <!-- Features Section -->
    <section class="section">
      <PrimePanel header="App Features" class="custom-panel" toggleable :collapsed="false">
        <p>Explore the app's unique features by clicking on the navigation bar</p>
        <div class="card-container">
          <div class="cards">
            <PrimeCard class="PrimeCard">
              <template #header>
                <img alt="user header" src="https://i.imgur.com/ZX9FBW0.png" class="card-header-img" />
              </template>
              <template #title>Create Story</template>
              <template #subtitle>Choose an MET artwork to "Konnect" with</template>
              <template #content>
                <p class="m-0">you can also get a storyteller badge if you post your own story!</p>
              </template>
            </PrimeCard>
            <PrimeCard class="PrimeCard">
              <template #header>
                <img alt="user header" src="https://i.imgur.com/1fhJqWo.png" class="card-header-img" />
              </template>
              <template #title>Choose an Era</template>
              <template #subtitle>Start exploring what stories other users posted!</template>
            </PrimeCard>
          </div>
        </div>
      </PrimePanel>
    </section>
  </main>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  gap: 2em;
}
.cards {
  display: flex;
  flex-direction: row;
  gap: 2em;
}

.card-header-img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
}

main,
p,
li {
  color: var(--p-primary-800);
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
}

.custom-panel {
  background: #84acd7;
  color: var(--p-primary-800);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

:deep(.p-panel-header) {
  color: var(--p-primary-800);
  font-size: 2rem;
  font-weight: bold;
}

.section {
  margin: 2rem auto;
  max-width: 800px;
  padding: 1rem;
  text-align: center;
  display: flex;
  justify-content: center;
}

.logged-in {
  text-align: center;
  margin-top: 2rem;
}
</style>
