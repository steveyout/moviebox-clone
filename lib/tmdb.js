import axios from 'axios';

const tmdbClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
        Accept: 'application/json',
    },
});

export const getTrendingMovies = async () => {
    try {
        const { data } = await tmdbClient.get('/trending/movie/day');
        return data.results || [];
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
};

export const getMovieDetails = async (id) => {
    try {
        const { data } = await tmdbClient.get(`/movie/${id}`);
        return data;
    } catch (error) {
        console.error(`Error fetching movie details for ID ${id}:`, error);
        return null;
    }
};