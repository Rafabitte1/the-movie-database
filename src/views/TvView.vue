<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const genres = ref([]);
const isLoading = ref(false); // Indicador de carregamento
const errorMessage = ref(''); // Mensagem de erro

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await api.get('genre/tv/list?language=pt-BR');
    genres.value = response.data.genres;
  } catch (error) {
    console.error('Erro ao buscar os gêneros:', error);
    errorMessage.value = 'Não foi possível carregar os gêneros. Tente novamente mais tarde.';
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <h1>Programas de TV</h1>
  <div v-if="isLoading">Carregando gêneros...</div>
  <div v-else-if="errorMessage">
    <p>{{ errorMessage }}</p>
  </div>
  <ul v-else class="genre-list">
    <li v-for="genre in genres" :key="genre.id" class="genre-item">
      {{ genre.name }}
    </li>
  </ul>
</template>

<style scoped>
/* Lista de gêneros */
.genre-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  list-style: none;
  padding: 1rem;
  margin: 0;
}

.genre-item {
  background-color: #5d6424;
  border-radius: 1rem;
  padding: 0.5rem 1.2rem;
  color: #fff;
  font-weight: bold;
  font-size: 1rem;
  text-transform: capitalize;
  transition: transform 0.2s ease, background-color 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.genre-item:hover {
  cursor: pointer;
  background-color: #7d8a2e;
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

/* Mensagem de erro */
p {
  text-align: center;
  font-size: 1.1rem;
  color: red;
  margin-top: 1rem;
}

/* Responsividade */
@media (max-width: 768px) {
  .genre-list {
    gap: 1rem;
  }

  .genre-item {
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
  }
}
</style>

