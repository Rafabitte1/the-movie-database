<template>
  <h1>Programas de TV</h1>
  <ul class="genre-list">
    <li v-for="genre in genres" :key="genre.id" class="genre-item" @click="fetchTvShows(genre.id)">
      {{ genre.name }}
    </li>
  </ul>

  <div v-if="tvShows.length" class="tv-show-list">
    <div v-for="show in tvShows" :key="show.id" class="tv-show-card">
      <h2>{{ show.name }}</h2>
      <p><strong>Original Name:</strong> {{ show.original_name }}</p>
      <p><strong>First Air Date:</strong> {{ show.first_air_date }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const genres = ref([]);
const tvShows = ref([]);

onMounted(async () => {
  try {
    genres.value = response.data.genres;
  } catch (error) {

  }
});

async function fetchTvShows(genreId) {
  try {
    const response = await api.get('discover/tv', {
      params: {
        with_genres: genreId,
        language: 'pt-BR',
      },
    });
    tvShows.value = response.data.results;
  } catch (error) {
    tvShows.value = [];
  }
}
</script>

<style scoped>
  .genre-list {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    list-style: none;
    padding: 0;
  }

  .genre-item {
    background-color: #5d6424;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    align-self: center;
    color: #fff;
    display: flex;
    justify-content: center;
  }

  .genre-item:hover {
    cursor: pointer;
    background-color: #7d8a2e;
    box-shadow: 0 0 0.5rem #5d6424;
  }

  .tv-show-list {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .tv-show-card {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .tv-show-card h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
</style>
