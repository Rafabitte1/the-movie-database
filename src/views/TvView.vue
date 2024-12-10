<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Loading from 'vue-loading-overlay';
import { useGenreStore } from '@/stores/genre.js';
import { useRouter } from 'vue-router';

const series = ref([]);
const carregando = ref(false);
const categoriaSelecionada = ref(null);
const armazemGeneros = useGenreStore();
const router = useRouter();

onMounted(async () => {
    carregando.value = true;
    await armazemGeneros.obterTodosGeneros('tv');
    carregando.value = false;
});

const listarSeries = async (generoId) => {
    if (!generoId) return;
    armazemGeneros.definirGeneroAtualId(generoId);
    carregando.value = true;
    const resposta = await api.get('discover/tv', {
        params: {
            with_genres: generoId,
            language: 'pt-BR',
        },
    });
    series.value = resposta.data.results;
    carregando.value = false;
};

const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR');

const abrirSerie = (serieId) => {
    router.push({ name: 'DetalhesSerie', params: { serieId } });
}
</script>

<template>
    <h1>Séries</h1>
    <select v-model="categoriaSelecionada" @change="listarSeries(categoriaSelecionada)" class="seletor-categoria">
        <option value="" disabled selected>Selecione uma categoria</option>
        <option v-for="genero in armazemGeneros.generos" :key="genero.id" :value="genero.id">
            {{ genero.nome }}
        </option>
    </select>
    <loading v-model:active="carregando" is-full-page />
    <div class="lista-series">
        <div v-for="serie in series" :key="serie.id" class="cartao-serie">
            <img :src="`https://image.tmdb.org/t/p/w500${serie.poster_path}`" :alt="serie.titulo_original" @click="abrirSerie(serie.id)" />
            <div class="detalhes-serie">
                <p class="titulo-serie">{{ serie.titulo_original }}</p>
                <p class="data-lancamento">{{ formatarData(serie.data_lancamento) }}</p>
                <p class="generos-serie">
                    <span v-for="genero_id in serie.genero_ids" :key="genero_id" @click="listarSeries(genero_id)"
                        :class="{ ativo: genero_id === armazemGeneros.generoAtualId }">
                        {{ armazemGeneros.obterNomeGenero(genero_id) }}
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>


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
