<template>
    <header>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/filmes">Filmes</router-link>
            <router-link to="/tv">Séries</router-link>
        </nav>
    </header>
<template>
    <header>
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/filmes">Filmes</router-link>
            <router-link to="/tv">Séries</router-link>
        </nav>
    </header>
</template>

<style scoped>
header {
    background-color: #001830; 
    color: #ffffff; 
    padding: 1rem;
    text-align: center;
    text-shadow: #001830;
    padding-right: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); 
    border-top: 5px solid #f39c12; /* Adiciona a borda no topo */
}

nav {
    display: flex;
    justify-content: center; 
    column-gap: 2rem;
}

nav a {
    text-decoration: none;
    color: #ffffff; 
    font-weight: bold; 
    transition: color 0.3s; 
}

nav a:hover {
    color: #f39c12; 
}
</style>