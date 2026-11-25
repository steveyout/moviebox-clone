// app/sitemap.js
import { getTrendingMovies, getTrendingTvShows, getPopularMovies, getPopularTvShows } from '@/lib/tmdb';

export default async function sitemap() {
    const baseUrl = 'https://moviebox.watch';
    const currentDate = new Date();

    // Fetch movies & TV shows in parallel safely
    const [trendingMovies, trendingTv, popularMovies, popularTv] = await Promise.all([
        getTrendingMovies().catch(() => []),
        getTrendingTvShows().catch(() => []),
        getPopularMovies().catch(() => []),
        getPopularTvShows().catch(() => []),
    ]);

    // Core static navigation routes
    const coreRoutes = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'always',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/movies`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/tv`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/trending`,
            lastModified: currentDate,
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Deduplicate and map movie entries
    const movieMap = new Map();
    [...trendingMovies, ...popularMovies].forEach(movie => {
        if (movie && movie.id && !movieMap.has(movie.id)) {
            movieMap.set(movie.id, {
                url: `${baseUrl}/watch/movie/${movie.id}`,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 0.8,
            });
        }
    });

    // Deduplicate and map TV entries
    const tvMap = new Map();
    [...trendingTv, ...popularTv].forEach(tv => {
        if (tv && tv.id && !tvMap.has(tv.id)) {
            tvMap.set(tv.id, {
                url: `${baseUrl}/watch/tv/${tv.id}`,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 0.8,
            });
        }
    });

    return [
        ...coreRoutes,
        ...Array.from(movieMap.values()),
        ...Array.from(tvMap.values()),
    ];
}
