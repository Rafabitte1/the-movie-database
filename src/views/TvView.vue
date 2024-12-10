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
  /* Netflix-style CSS para o componente */
body {
    margin: 0;
    font-family: 'Arial', sans-serif;
    background-color: #141414;
    color: #fff;
}

h1 {
    text-align: center;
    font-size: 2.5rem;
    margin: 20px 0;
    color: #e50914;
}

/* Estilo do seletor de categoria */
.seletor-categoria {
    display: block;
    margin: 0 auto 20px;
    padding: 10px;
    font-size: 1rem;
    border-radius: 4px;
    border: none;
    background-color: #333;
    color: #fff;
    width: 80%;
    max-width: 400px;
}

.seletor-categoria option {
    background-color: #222;
    color: #fff;
}

/* Lista de filmes */
.lista-filmes, .lista-series {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    padding: 20px;
}

.cartao-filme, .cartao-serie {
    background-color: #222;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
}

.cartao-filme:hover, .cartao-serie:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.cartao-filme img, .cartao-serie img {
    width: 100%;
    height: auto;
    display: block;
}

.detalhes-filme, .detalhes-serie {
    padding: 10px;
    text-align: center;
}

.titulo-filme, .titulo-serie {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 10px 0;
    color: #fff;
}

.data-lancamento {
    font-size: 0.9rem;
    color: #bbb;
    margin-bottom: 10px;
}

.generos-filme, .generos-serie {
    font-size: 0.9rem;
    color: #e50914;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
}

.generos-filme span, .generos-serie span {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid #e50914;
    border-radius: 15px;
    transition: background-color 0.3s;
}

.generos-filme span:hover, .generos-serie span:hover {
    background-color: #e50914;
    color: #fff;
}

.generos-filme .ativo, .generos-serie .ativo {
    background-color: #e50914;
    color: #fff;
}

</style>
