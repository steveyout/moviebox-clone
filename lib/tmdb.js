// lib/tmdb.js or src/lib/tmdb.js
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
        console.error('Error fetching trending watch:', error);
        return [];
    }
};

export const getTrendingTvShows = async () => {
    try {
        const { data } = await tmdbClient.get('/trending/tv/day');
        return data.results || [];
    } catch (error) {
        console.error('Error fetching trending TV shows:', error);
        return [];
    }
};

export const getPopularMovies = async () => {
    try {
        const { data } = await tmdbClient.get('/movie/popular');
        return data.results || [];
    } catch (error) {
        console.error('Error fetching popular watch:', error);
        return [];
    }
};

// New Endpoint: Fetch Popular TV Shows
export const getPopularTvShows = async () => {
    try {
        const { data } = await tmdbClient.get('/tv/popular');
        return data.results || [];
    } catch (error) {
        console.error('Error fetching popular TV shows:', error);
        return [];
    }
};

export const getMovieDetails = async (id) => {
    // Fail early if ID is missing, an object, or NaN
    if (!id || isNaN(Number(id))) {
        console.warn(`getMovieDetails aborted: Invalid ID provided (${id})`);
        return null;
    }

    try {
        const { data } = await tmdbClient.get(`/movie/${id}`);
        return data;
    } catch (error) {
        console.error(`Error fetching movie details for ID ${id}:`, error?.response?.data || error.message);
        return null;
    }
};

export const getMediaDetails = async (id, type) => {
    // Sanitization & Safeguards
    const normalizedType = type === 'series' ? 'tv' : type; // Handle TMDB/Internal naming variations

    if (!id || isNaN(Number(id))) {
        console.warn(`getMediaDetails aborted: Invalid ID structure (${id})`);
        return null;
    }

    if (!['movie', 'tv'].includes(normalizedType)) {
        console.warn(`getMediaDetails aborted: Invalid type parameter "${type}"`);
        return null;
    }

    try {
        // Appended "recommendations" to the query string to load matching layout metrics
        const { data } = await tmdbClient.get(`/${normalizedType}/${id}`, {
            params: {
                append_to_response: 'recommendations'
            }
        });

        // For TV, explicitly fetch the Full Season data to build episode lists.
        if (normalizedType === 'tv' && data.seasons) {
            // Map the calls for all available seasons concurrently
            data.full_seasons_data = await Promise.all(
                data.seasons.map(season =>
                    tmdbClient.get(`/tv/${id}/season/${season.season_number}`)
                        .then(res => res.data)
                        .catch(() => null) // Ignore individual season fetch errors safely
                )
            );
            // Clean any failed season data
            data.full_seasons_data = data.full_seasons_data.filter(Boolean);
        }

        return data;
    } catch (error) {
        console.error(`Error fetching media details for ${normalizedType} ID ${id}:`, error?.response?.data || error.message);
        return null;
    }
};