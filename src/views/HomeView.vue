<script setup>
import { ref } from 'vue';
import MoviesView from '@/views/MoviesView.vue';
import TvView from '@/views/TvView.vue';

const tipoSelecionado = ref('filmes'); 
const categoriaSelecionada = ref(null); 

const alterarTipo = (tipo) => {
    tipoSelecionado.value = tipo;
};
</script>

<template>
    <div>
        <h1>Início</h1>
        <div class="menu-filtro">
            <button @click="alterarTipo('filmes')">Filmes</button>
            <button @click="alterarTipo('tv')">Séries</button>
        </div>

        <div v-if="tipoSelecionado === 'filmes'">
            <MoviesView :categoriaSelecionada="categoriaSelecionada" />
        </div>
        <div v-else>
            <TvView :categoriaSelecionada="categoriaSelecionada" />
        </div>
    </div>
</template>
