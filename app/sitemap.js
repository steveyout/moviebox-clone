import { getTrendingMovies } from '@/lib/tmdb';

export default async function sitemap() {
    const baseUrl = 'https://moviebox.watch';

    // Request the trending elements directly from TMDB data utilities
    const trendingMovies = await getTrendingMovies().catch(() => []);

    const movieEntries = trendingMovies.map((movie) => ({
        url: `${baseUrl}/movies/${movie.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8, // Priority boost for active movie target details pages
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        ...movieEntries,
    ];
}