// app/movies/page.js
import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { getPopularMovies, getTopRatedMovies, getTrendingMovies } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { generateBreadcrumbSchema } from '@/lib/schema';

export const metadata = {
    title: 'Watch Movies Online Free in HD | Latest & Popular Films - MovieBox',
    description: 'Browse and watch thousands of full-length movies online in HD on MovieBox. Stream popular blockbusters, new releases, and all-time top-rated cinema free with subtitles.',
    keywords: [
        'watch movies online',
        'free hd movies',
        'moviebox movies',
        'stream full movies',
        'top rated movies',
        'new release movies',
        'blockbuster movies'
    ],
    alternates: {
        canonical: 'https://moviebox.watch/movies',
    },
    openGraph: {
        title: 'Watch Movies Online Free in HD | MovieBox Watch',
        description: 'Explore trending blockbusters, new cinema releases, and top-rated movies streaming now.',
        url: 'https://moviebox.watch/movies',
    },
};

export default async function MoviesPage() {
    const [popularMovies, topRatedMovies, trendingMovies] = await Promise.all([
        getPopularMovies(),
        getTopRatedMovies(),
        getTrendingMovies(),
    ]);

    const breadcrumbJsonLd = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Movies', url: '/movies' },
    ]);

    const sections = [
        { title: 'Popular Movies', data: popularMovies },
        { title: 'Top Rated Classics & Hits', data: topRatedMovies },
        { title: 'Trending This Week', data: trendingMovies },
    ];

    return (
        <Box sx={{ pb: 8, pt: 3 }}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <Container maxWidth="xl" sx={{ px: { xs: 2.5, md: 6 } }}>
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, color: '#fff', mb: 1 }}
                    >
                        Explore Movies
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#9ca3af', maxWidth: '700px' }}>
                        Stream the newest cinema hits, timeless classics, and fan-favorite movies in 1080p Full HD with multiple streaming servers and English subtitles.
                    </Typography>
                </Box>

                {sections.map((section, idx) => (
                    <Box key={idx} component="section" sx={{ mb: 6 }}>
                        <Typography
                            variant="h5"
                            component="h2"
                            fontWeight="bold"
                            sx={{ color: '#fff', fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 2.5 }}
                        >
                            {section.title}
                        </Typography>

                        <Grid container spacing={2.5}>
                            {section.data.slice(0, 12).map((movie) => (
                                <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                    <MovieCard movie={{ ...movie, media_type: 'movie' }} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
            </Container>
        </Box>
    );
}
