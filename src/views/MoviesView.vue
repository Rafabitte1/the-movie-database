<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre';
import { useRouter } from 'vue-router';

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

const listMovies = async (genreId) => {
  genreStore.setCurrentGenreId(genreId);
  isLoading.value = true;
  const response = await api.get('discover/movie', {
    params: {
      with_genres: genreId,
      language: 'pt-BR',
    },
  });
  movies.value = response.data.results;
  isLoading.value = false;
};
</script>

<template>
  <div>
    <h1>Gêneros de filmes</h1>
    <ul class="genre-list">
      <li
        v-for="genre in genres"
        :key="genre.id"
        @click="listMovies(genre.id)"
        class="genre-item"
        :class="{ active: genre.id === genreStore.currentGenreId }"
      >
        {{ genre.name }}
      </li>
    </ul>
    <loading v-model:active="isLoading" is-full-page />
  </div>
  <div class="movie-list">
    <div v-for="movie in movies" :key="movie.id" class="movie-card">
      <img
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        :alt="movie.title"
        @click="openMovie(movie.id)"
      />
      <div class="movie-details">
        <p class="movie-title">{{ movie.title }}</p>
        <p class="movie-release-date">{{ formatDate(movie.release_date) }}</p>
        <p class="movie-genres">
          <span
            v-for="genre_id in movie.genre_ids"
            :key="genre_id"
            @click="listMovies(genre_id)"
            :class="{ active: genre_id === genreStore.currentGenreId }"
          >
            {{ getGenreName(genre_id) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>



<style scoped>
/* Variáveis para consistência de cores */
:root {
  --primary-color: #67b086;
  --secondary-color: #abc322;
  --hover-color: #455a08;
  --text-color: #fff;
  --background-color: #748708;
  --box-shadow: 0 0 0.5rem #000;
  --font-weight-bold: bold;
  --border-radius: 0.5rem;
  --gap: 1rem;
}

/* Gêneros ativos */
.active {
  background-color: var(--primary-color);
  font-weight: var(--font-weight-bold);
}

.movie-genres span.active {
  background-color: var(--secondary-color);
  color: #000;
  font-weight: var(--font-weight-bold);
}

/* Lista de filmes */
.movie-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  justify-content: center;
}

/* Cartão de filme */
.movie-card {
  width: 15rem;
  height: 30rem;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 1rem var(--primary-color);
}

.movie-card img {
  width: 100%;
  height: 20rem;
  border-radius: var(--border-radius);
}

/* Detalhes do filme */
.movie-details {
  padding: 0.5rem;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: var(--font-weight-bold);
  line-height: 1.3rem;
  height: 3.2rem;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-release-date {
  font-size: 0.9rem;
  text-align: center;
  color: #555;
}

.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  justify-content: center;
}

.movie-genres span {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  padding: 0.2rem 0.5rem;
  color: var(--text-color);
  font-size: 0.8rem;
  font-weight: var(--font-weight-bold);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.movie-genres span:hover {
  cursor: pointer;
  background-color: var(--hover-color);
  box-shadow: 0 0 0.5rem var(--primary-color);
}

/* Lista de gêneros */
.genre-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--gap);
  list-style: none;
  margin-bottom: 2rem;
  padding: 0;
}

.genre-item {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 1rem;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.genre-item:hover {
  background-color: var(--hover-color);
  transform: scale(1.05);
}

/* Responsividade */
@media (max-width: 768px) {
  .movie-card {
    width: 90%;
    height: auto;
  }

  .movie-card img {
    height: auto;
  }

  .movie-title {
    font-size: 1rem;
  }

  .movie-genres span {
    font-size: 0.7rem;
  }
}
</style>
