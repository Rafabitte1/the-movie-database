import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'SUA_CHAVE_DE_API',
  },
});

export default api;