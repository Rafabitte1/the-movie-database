<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre.js';
import { useRouter } from 'vue-router';

const filmes = ref([]);
const carregando = ref(false);
const categoriaSelecionada = ref(null);
const armazemGeneros = useGenreStore();
const router = useRouter();

onMounted(async () => {
    carregando.value = true;
    await armazemGeneros.obterTodosGeneros('movie');
    carregando.value = false;
});

const listarFilmes = async (generoId) => {
    if (!generoId) return;
    armazemGeneros.definirGeneroAtualId(generoId);
    carregando.value = true;
    const resposta = await api.get('discover/movie', {
        params: {
            with_genres: generoId,
            language: 'pt-BR',
        },
    });
    filmes.value = resposta.data.results;
    carregando.value = false;
};

const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR');

const abrirFilme = (filmeId) => {
    router.push({ name: 'DetalhesFilme', params: { filmeId } });
}
</script>

<template>
    <h1>Filmes</h1>
    <select v-model="categoriaSelecionada" @change="listarFilmes(categoriaSelecionada)" class="seletor-categoria">
        <option value="" disabled selected>Selecione uma categoria</option>
        <option v-for="genero in armazemGeneros.generos" :key="genero.id" :value="genero.id">
            {{ genero.nome }}
        </option>
    </select>
    <loading v-model:active="carregando" is-full-page />
    <div class="lista-filmes">
        <div v-for="filme in filmes" :key="filme.id" class="cartao-filme">
            <img :src="`https://image.tmdb.org/t/p/w500${filme.poster_path}`" :alt="filme.titulo_original" @click="abrirFilme(filme.id)" />
            <div class="detalhes-filme">
                <p class="titulo-filme">{{ filme.titulo_original }}</p>
                <p class="data-lancamento">{{ formatarData(filme.data_lancamento) }}</p>
                <p class="generos-filme">
                    <span v-for="genero_id in filme.genero_ids" :key="genero_id" @click="listarFilmes(genero_id)"
                        :class="{ ativo: genero_id === armazemGeneros.generoAtualId }">
                        {{ armazemGeneros.obterNomeGenero(genero_id) }}
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
