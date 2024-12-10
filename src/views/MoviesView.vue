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
.lista-filmes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    padding: 20px;
}

.cartao-filme {
    background-color: #222;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
}

.cartao-filme:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.cartao-filme img {
    width: 100%;
    height: auto;
    display: block;
}

.detalhes-filme {
    padding: 10px;
    text-align: center;
}

.titulo-filme {
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

.generos-filme {
    font-size: 0.9rem;
    color: #e50914;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    justify-content: center;
}

.generos-filme span {
    cursor: pointer;
    padding: 5px 10px;
    border: 1px solid #e50914;
    border-radius: 15px;
    transition: background-color 0.3s;
}

.generos-filme span:hover {
    background-color: #e50914;
    color: #fff;
}

.generos-filme .ativo {
    background-color: #e50914;
    color: #fff;
}
</style>