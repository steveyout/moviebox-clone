// app/trending/page.js
import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { getTrendingMovies, getTrendingTvShows } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { generateBreadcrumbSchema } from '@/lib/schema';

export const metadata = {
    title: 'Trending Movies & TV Shows Today | MovieBox Watch',
    description: 'Discover what everyone is watching right now. Stream the hottest trending movies, viral shows, and popular releases online in HD on MovieBox.',
    keywords: [
        'trending movies',
        'trending tv shows',
        'what to watch tonight',
        'popular on moviebox',
        'viral movies free',
        'daily trending movies'
    ],
    alternates: {
        canonical: 'https://moviebox.watch/trending',
    },
    openGraph: {
        title: 'Trending Movies & TV Shows Today | MovieBox Watch',
        description: 'See the most streamed movies and TV series right now on MovieBox.',
        url: 'https://moviebox.watch/trending',
    },
};

export default async function TrendingPage() {
    const [trendingMovies, trendingTv] = await Promise.all([
        getTrendingMovies(),
        getTrendingTvShows(),
    ]);

    const breadcrumbJsonLd = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Trending', url: '/trending' },
    ]);

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
                        Trending Today
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#9ca3af', maxWidth: '700px' }}>
                        The most-watched movies and television series today, updated continuously based on global audience streams.
                    </Typography>
                </Box>

                {/* Trending Movies */}
                <Box component="section" sx={{ mb: 6 }}>
                    <Typography
                        variant="h5"
                        component="h2"
                        fontWeight="bold"
                        sx={{ color: '#fff', fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 2.5 }}
                    >
                        Trending Movies
                    </Typography>
                    <Grid container spacing={2.5}>
                        {trendingMovies.map((movie) => (
                            <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                <MovieCard movie={{ ...movie, media_type: 'movie' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Trending TV Shows */}
                <Box component="section">
                    <Typography
                        variant="h5"
                        component="h2"
                        fontWeight="bold"
                        sx={{ color: '#fff', fontSize: { xs: '1.25rem', md: '1.5rem' }, mb: 2.5 }}
                    >
                        Trending TV Series
                    </Typography>
                    <Grid container spacing={2.5}>
                        {trendingTv.map((show) => (
                            <Grid key={show.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                <MovieCard movie={{ ...show, media_type: 'tv' }} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
