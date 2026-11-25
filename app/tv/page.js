// app/tv/page.js
import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { getPopularTvShows, getTopRatedTvShows, getTrendingTvShows } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { generateBreadcrumbSchema } from '@/lib/schema';

export const metadata = {
    title: 'Watch TV Series & Shows Online Free in HD | MovieBox Watch',
    description: 'Stream full seasons and episodes of trending TV series, drama, sci-fi, and popular television shows online free in HD on MovieBox.',
    keywords: [
        'watch tv shows online',
        'free tv series stream',
        'moviebox tv shows',
        'stream full episodes',
        'binge watch tv series',
        'popular series'
    ],
    alternates: {
        canonical: 'https://moviebox.watch/tv',
    },
    openGraph: {
        title: 'Watch TV Series & Shows Online Free in HD | MovieBox',
        description: 'Explore full seasons and episodes of the hottest TV series and television shows on MovieBox.',
        url: 'https://moviebox.watch/tv',
    },
};

export default async function TvShowsPage() {
    const [popularTv, topRatedTv, trendingTv] = await Promise.all([
        getPopularTvShows(),
        getTopRatedTvShows(),
        getTrendingTvShows(),
    ]);

    const breadcrumbJsonLd = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'TV Series', url: '/tv' },
    ]);

    const sections = [
        { title: 'Popular TV Series', data: popularTv },
        { title: 'Top Rated Shows of All Time', data: topRatedTv },
        { title: 'Trending Series This Week', data: trendingTv },
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
                        TV Shows &amp; Series
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#9ca3af', maxWidth: '700px' }}>
                        Binge-watch full seasons and new episodes of top television series, anime, mini-series, and dramas without interruptions.
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
                            {section.data.slice(0, 12).map((show) => (
                                <Grid key={show.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                    <MovieCard movie={{ ...show, media_type: 'tv' }} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
            </Container>
        </Box>
    );
}
