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
.seletor-categoria {
    margin-bottom: 2rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    font-size: 1rem;
}

.lista-filmes {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.cartao-filme {
    width: 200px;
    cursor: pointer;
}

.titulo-filme {
    font-weight: bold;
}

.data-lancamento {
    color: gray;
}

.generos-filme {
    display: flex;
    flex-wrap: wrap;
}

.generos-filme .ativo {
    font-weight: bold;
    color: #f39c12; 
}
</style>