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
  .seletor-categoria {
    margin-bottom: 2rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    font-size: 1rem;
}

.lista-series {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.cartao-serie {
    width: 200px;
    cursor: pointer;
}

.titulo-serie {
    font-weight: bold;
}

.data-lancamento {
    color: gray;
}

.generos-serie {
    display: flex;
    flex-wrap: wrap;
}

.generos-serie .ativo {
    font-weight: bold;
    color: #f39c12; 
}


</style>
