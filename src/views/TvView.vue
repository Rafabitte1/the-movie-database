<template>
  <h1>Programas de TV</h1>
  <ul class="genre-list">
    <li v-for="genre in genres" :key="genre.id" class="genre-item">
      {{ genre.name }}
    </li>
  </ul>
</template>

<script setup>
import { useGenreStore } from '@/stores/genre';
import { computed, onMounted } from 'vue';

const router = useRouter();
const genreStore = useGenreStore();
const isLoading = ref(false);
const movies = ref([]);
const genres = ref([]);

const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

function openMovie(movieId) {
  router.push({ name: 'MovieDetails', params: { movieId } });
}

function getGenreName(id) {
  const genero = genres.value.find((genre) => genre.id === id);
  return genero ? genero.name : 'Gênero Desconhecido';
}

onMounted(async () => {
  const response = await api.get('genre/movie/list?language=pt-BR');
  genres.value = response.data.genres;
  genreStore.setGenres(genres.value);
});
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
</style>
