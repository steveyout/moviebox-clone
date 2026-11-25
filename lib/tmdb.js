// lib/tmdb.js
import axios from 'axios';

// Curated high-quality fallback data to ensure the site never breaks
// even if TMDB_TOKEN is not configured or TMDB API rate-limits
const FALLBACK_MOVIES = [
    {
        id: 550,
        title: 'Fight Club',
        overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
        vote_average: 8.43,
        vote_count: 28400,
        release_date: '1999-10-15',
        media_type: 'movie',
        original_language: 'en',
        genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }]
    },
    {
        id: 157336,
        title: 'Interstellar',
        overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
        poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop_path: '/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
        vote_average: 8.45,
        vote_count: 34500,
        release_date: '2014-11-05',
        media_type: 'movie',
        original_language: 'en',
        genres: [{ id: 12, name: 'Adventure' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }]
    },
    {
        id: 27205,
        title: 'Inception',
        overview: 'Cobb, a skilled thief who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.',
        poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        vote_average: 8.37,
        vote_count: 36200,
        release_date: '2010-07-15',
        media_type: 'movie',
        original_language: 'en',
        genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }]
    },
    {
        id: 155,
        title: 'The Dark Knight',
        overview: 'Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
        poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop_path: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
        vote_average: 8.52,
        vote_count: 32600,
        release_date: '2008-07-16',
        media_type: 'movie',
        original_language: 'en',
        genres: [{ id: 18, name: 'Drama' }, { id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 53, name: 'Thriller' }]
    },
    {
        id: 693134,
        title: 'Dune: Part Two',
        overview: 'Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.',
        poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s520DRq.jpg',
        vote_average: 8.16,
        vote_count: 5300,
        release_date: '2024-02-27',
        media_type: 'movie',
        original_language: 'en',
        genres: [{ id: 878, name: 'Science Fiction' }, { id: 12, name: 'Adventure' }]
    },
    {
        id: 299536,
        title: 'Avengers: Infinity War',
        overview: 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.',
        poster_path: '/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
        backdrop_path: '/mDfJG3LC3Dqb67AZ52x3Z0jQ0uB.jpg',
        vote_average: 8.25,
        vote_count: 29100,
        release_date: '2018-04-25',
        media_type: 'movie',
        original_language: 'en',
        genres: [{ id: 12, name: 'Adventure' }, { id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }]
    }
];

const FALLBACK_TV_SHOWS = [
    {
        id: 1399,
        name: 'Game of Thrones',
        overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.',
        poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
        backdrop_path: '/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
        vote_average: 8.45,
        vote_count: 23500,
        first_air_date: '2011-04-17',
        media_type: 'tv',
        original_language: 'en',
        genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 18, name: 'Drama' }, { id: 10759, name: 'Action & Adventure' }]
    },
    {
        id: 66732,
        name: 'Stranger Things',
        overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
        poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
        vote_average: 8.61,
        vote_count: 17200,
        first_air_date: '2016-07-15',
        media_type: 'tv',
        original_language: 'en',
        genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 18, name: 'Drama' }, { id: 9648, name: 'Mystery' }]
    },
    {
        id: 1396,
        name: 'Breaking Bad',
        overview: 'Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years to live. He turns to a life of crime to secure his family financial future.',
        poster_path: '/ztkUQFLlC19CCMYHW9o1zWhJAGq.jpg',
        backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
        vote_average: 8.91,
        vote_count: 14200,
        first_air_date: '2008-01-20',
        media_type: 'tv',
        original_language: 'en',
        genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }]
    },
    {
        id: 94997,
        name: 'House of the Dragon',
        overview: 'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights, falling into bloody civil war.',
        poster_path: '/t9Xke5lludmAZfuAmsqxWwfqAh.jpg',
        backdrop_path: '/etj5CuMuamhGhDvlPjU87pq7PPY.jpg',
        vote_average: 8.40,
        vote_count: 4200,
        first_air_date: '2022-08-21',
        media_type: 'tv',
        original_language: 'en',
        genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 18, name: 'Drama' }, { id: 10759, name: 'Action & Adventure' }]
    },
    {
        id: 100088,
        name: 'The Last of Us',
        overview: 'Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.',
        poster_path: '/uKvVjHNqB5VmOrdxqAt2V7JMrRI.jpg',
        backdrop_path: '/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg',
        vote_average: 8.60,
        vote_count: 5100,
        first_air_date: '2023-01-15',
        media_type: 'tv',
        original_language: 'en',
        genres: [{ id: 18, name: 'Drama' }, { id: 10759, name: 'Action & Adventure' }, { id: 10765, name: 'Sci-Fi & Fantasy' }]
    },
    {
        id: 71446,
        name: 'Money Heist',
        overview: 'To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.',
        poster_path: '/reEMJA1uzscCbk5rUhGnyBh0Ryl.jpg',
        backdrop_path: '/gFZriCkpJYsApPZEsvuquhYW8PU.jpg',
        vote_average: 8.24,
        vote_count: 18400,
        first_air_date: '2017-05-02',
        media_type: 'tv',
        original_language: 'es',
        genres: [{ id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }]
    }
];

const tmdbToken = process.env.TMDB_TOKEN || process.env.NEXT_PUBLIC_TMDB_TOKEN;
const tmdbApiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

const tmdbClient = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: tmdbToken ? {
        Authorization: `Bearer ${tmdbToken}`,
        Accept: 'application/json',
    } : {
        Accept: 'application/json',
    },
    params: tmdbApiKey ? { api_key: tmdbApiKey } : {}
});

export const getTrendingMovies = async () => {
    if (!tmdbToken && !tmdbApiKey) {
        return FALLBACK_MOVIES;
    }
    try {
        const { data } = await tmdbClient.get('/trending/movie/day');
        return (data.results && data.results.length > 0) ? data.results : FALLBACK_MOVIES;
    } catch (error) {
        console.warn('Error fetching trending movies, using fallback catalog:', error?.message);
        return FALLBACK_MOVIES;
    }
};

export const getTrendingTvShows = async () => {
    if (!tmdbToken && !tmdbApiKey) {
        return FALLBACK_TV_SHOWS;
    }
    try {
        const { data } = await tmdbClient.get('/trending/tv/day');
        return (data.results && data.results.length > 0) ? data.results : FALLBACK_TV_SHOWS;
    } catch (error) {
        console.warn('Error fetching trending TV shows, using fallback catalog:', error?.message);
        return FALLBACK_TV_SHOWS;
    }
};

export const getPopularMovies = async (page = 1) => {
    if (!tmdbToken && !tmdbApiKey) {
        return FALLBACK_MOVIES;
    }
    try {
        const { data } = await tmdbClient.get('/movie/popular', { params: { page } });
        return (data.results && data.results.length > 0) ? data.results : FALLBACK_MOVIES;
    } catch (error) {
        console.warn('Error fetching popular movies, using fallback catalog:', error?.message);
        return FALLBACK_MOVIES;
    }
};

export const getPopularTvShows = async (page = 1) => {
    if (!tmdbToken && !tmdbApiKey) {
        return FALLBACK_TV_SHOWS;
    }
    try {
        const { data } = await tmdbClient.get('/tv/popular', { params: { page } });
        return (data.results && data.results.length > 0) ? data.results : FALLBACK_TV_SHOWS;
    } catch (error) {
        console.warn('Error fetching popular TV shows, using fallback catalog:', error?.message);
        return FALLBACK_TV_SHOWS;
    }
};

export const getTopRatedMovies = async (page = 1) => {
    if (!tmdbToken && !tmdbApiKey) {
        return FALLBACK_MOVIES;
    }
    try {
        const { data } = await tmdbClient.get('/movie/top_rated', { params: { page } });
        return (data.results && data.results.length > 0) ? data.results : FALLBACK_MOVIES;
    } catch (error) {
        console.warn('Error fetching top rated movies:', error?.message);
        return FALLBACK_MOVIES;
    }
};

export const getTopRatedTvShows = async (page = 1) => {
    if (!tmdbToken && !tmdbApiKey) {
        return FALLBACK_TV_SHOWS;
    }
    try {
        const { data } = await tmdbClient.get('/tv/top_rated', { params: { page } });
        return (data.results && data.results.length > 0) ? data.results : FALLBACK_TV_SHOWS;
    } catch (error) {
        console.warn('Error fetching top rated TV shows:', error?.message);
        return FALLBACK_TV_SHOWS;
    }
};

export const searchMedia = async (query, page = 1) => {
    if (!query || !query.trim()) return [];
    if (!tmdbToken && !tmdbApiKey) {
        const q = query.toLowerCase();
        const movieMatches = FALLBACK_MOVIES.filter(m => m.title.toLowerCase().includes(q));
        const tvMatches = FALLBACK_TV_SHOWS.filter(t => t.name.toLowerCase().includes(q));
        return [...movieMatches, ...tvMatches];
    }
    try {
        const { data } = await tmdbClient.get('/search/multi', {
            params: {
                query: query.trim(),
                page,
                include_adult: false
            }
        });
        return (data.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    } catch (error) {
        console.warn(`Error searching media for query "${query}":`, error?.message);
        const q = query.toLowerCase();
        return [...FALLBACK_MOVIES, ...FALLBACK_TV_SHOWS].filter(
            item => (item.title || item.name || '').toLowerCase().includes(q)
        );
    }
};

export const getMediaByGenre = async (type = 'movie', genreId, page = 1) => {
    const normalizedType = type === 'series' ? 'tv' : type;
    if (!tmdbToken && !tmdbApiKey) {
        const pool = normalizedType === 'tv' ? FALLBACK_TV_SHOWS : FALLBACK_MOVIES;
        return genreId ? pool.filter(i => i.genres?.some(g => String(g.id) === String(genreId))) : pool;
    }
    try {
        const { data } = await tmdbClient.get(`/discover/${normalizedType}`, {
            params: {
                with_genres: genreId,
                page,
                sort_by: 'popularity.desc'
            }
        });
        return data.results || [];
    } catch (error) {
        console.warn(`Error fetching ${normalizedType} by genre ${genreId}:`, error?.message);
        return normalizedType === 'tv' ? FALLBACK_TV_SHOWS : FALLBACK_MOVIES;
    }
};

export const getMediaDetails = async (id, type = 'movie') => {
    const normalizedType = type === 'series' ? 'tv' : type;

    if (!id || isNaN(Number(id))) {
        console.warn(`getMediaDetails aborted: Invalid ID structure (${id})`);
        return null;
    }

    if (!['movie', 'tv'].includes(normalizedType)) {
        console.warn(`getMediaDetails aborted: Invalid type parameter "${type}"`);
        return null;
    }

    if (!tmdbToken && !tmdbApiKey) {
        const pool = normalizedType === 'tv' ? FALLBACK_TV_SHOWS : FALLBACK_MOVIES;
        const found = pool.find(item => Number(item.id) === Number(id));
        if (found) {
            return {
                ...found,
                recommendations: { results: pool.filter(item => Number(item.id) !== Number(id)) },
                videos: { results: [{ key: 'dQw4w9WgXcQ', site: 'YouTube', type: 'Trailer', name: 'Official Trailer' }] },
                credits: {
                    cast: [
                        { id: 1, name: 'Lead Actor', character: 'Hero', profile_path: null },
                        { id: 2, name: 'Supporting Star', character: 'Co-Star', profile_path: null }
                    ],
                    crew: [{ id: 3, name: 'Acclaimed Director', job: 'Director' }]
                },
                ...(normalizedType === 'tv' ? {
                    seasons: [{ season_number: 1, episode_count: 8, name: 'Season 1' }],
                    full_seasons_data: [{
                        season_number: 1,
                        episodes: Array.from({ length: 8 }, (_, i) => ({
                            id: i + 1,
                            season_number: 1,
                            episode_number: i + 1,
                            name: `Episode ${i + 1}`,
                            overview: `Thrilling developments unfold in episode ${i + 1}.`
                        }))
                    }]
                } : {})
            };
        }
        return pool[0];
    }

    try {
        const { data } = await tmdbClient.get(`/${normalizedType}/${id}`, {
            params: {
                append_to_response: 'recommendations,videos,credits,similar'
            }
        });

        // For TV, load season data concurrently
        if (normalizedType === 'tv' && data.seasons) {
            const validSeasons = data.seasons.filter(s => s.season_number > 0);
            data.full_seasons_data = await Promise.all(
                validSeasons.map(season =>
                    tmdbClient.get(`/tv/${id}/season/${season.season_number}`)
                        .then(res => res.data)
                        .catch(() => null)
                )
            );
            data.full_seasons_data = data.full_seasons_data.filter(Boolean);
        }

        return data;
    } catch (error) {
        console.error(`Error fetching media details for ${normalizedType} ID ${id}:`, error?.response?.data || error.message);
        const pool = normalizedType === 'tv' ? FALLBACK_TV_SHOWS : FALLBACK_MOVIES;
        return pool.find(item => Number(item.id) === Number(id)) || pool[0];
    }
};

export const GENRES = {
    movie: [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' },
        { id: 14, name: 'Fantasy' },
        { id: 27, name: 'Horror' },
        { id: 9648, name: 'Mystery' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Sci-Fi' },
        { id: 53, name: 'Thriller' }
    ],
    tv: [
        { id: 10759, name: 'Action & Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' },
        { id: 9648, name: 'Mystery' },
        { id: 10765, name: 'Sci-Fi & Fantasy' },
        { id: 10768, name: 'War & Politics' }
    ]
};
