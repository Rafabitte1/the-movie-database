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
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    z-index: 1000; 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    background-color: #001830; 
    color: #ffffff; 
    padding: 1rem;
    text-align: right;
    text-shadow: #001830;
    padding-inline: 25px;
    padding-right: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); 
    border-top: 5px solid #f39c12; 
}

nav {
    
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 40px;
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