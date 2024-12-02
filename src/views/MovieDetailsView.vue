<script setup>
  import { defineProps, onMounted } from 'vue';
  import { useMovieStore } from '@/stores/movie';
  const movieStore = useMovieStore();
  const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

  const props = defineProps({
    movieId: {
      type: Number,
      required: true,
    },
  });

  onMounted(async () => {
    await movieStore.getMovieDetail(props.movieId);
  });
</script>

<template>
  
  <div class="main">
    <div class="content">
      <img
  :src="movieStore.currentMovie.poster_path 
        ? `https://image.tmdb.org/t/p/w185${movieStore.currentMovie.poster_path}` 
        : 'default-poster.jpg'"
  :alt="movieStore.currentMovie.title || 'Poster do Filme'"
/>


      <div class="details">
        <h1>Filme: {{ movieStore.currentMovie.title }}</h1>
        <p>{{ movieStore.currentMovie.tagline }}</p>
        <p>{{ movieStore.currentMovie.overview }}</p>
        <p>Orçamento: {{ formatCurrency(movieStore.currentMovie.budget) }}</p>
        <p>Avaliação: {{ movieStore.currentMovie.vote_average }}</p>
      </div>
    </div>
  </div>

  <p>Produtoras</p>
  <div class="companies">
    <template
      v-for="company in movieStore.currentMovie.production_companies"
      :key="company.id"
    >
      <img
        v-if="company.logo_path"
        :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
        :alt="company.name"
      />
      <p v-else>{{ company.name }}</p>
    </template>
  </div>
  
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem auto;
  max-width: 800px;
  gap: 2rem;
}

.content {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: flex-start;
}

.content img {
  width: 185px;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 0 0.5rem #ccc;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.details h1 {
  font-size: 1.5rem;
  font-weight: bold;
}

.details p {
  font-size: 1rem;
  line-height: 1.5rem;
  color: #333;
}

.companies {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.companies img {
  width: 92px;
  height: auto;
  border-radius: 0.3rem;
  box-shadow: 0 0 0.5rem #aaa;
}

.companies p {
  font-size: 0.9rem;
  text-align: center;
  font-weight: bold;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    align-items: center;
  }

  .content img {
    width: 100%;
    max-width: 300px;
  }

  .details h1 {
    font-size: 1.2rem;
  }
}
</style>

