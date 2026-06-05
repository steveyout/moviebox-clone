'use client';

import React from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieCard from './MovieCard';

export default function MovieGridDisplay({
                                             trendingMovies = [],
                                             trendingTvShows = [],
                                             popularMovies = [],
                                             popularTvShows = [] // Destructured smoothly
                                         }) {

    // Simply added the fourth row array config object here
    const contentSections = [
        { title: 'Trending Movies', data: trendingMovies },
        { title: 'Trending TV Shows', data: trendingTvShows },
        { title: 'Popular Movies', data: popularMovies },
        { title: 'Popular TV Shows', data: popularTvShows }
    ];

    return (
        <Box sx={{ pb: 6, mt: 4 }}>
            <Container maxWidth="xl" sx={{ px: { xs: 2.5, md: 6 }, display: 'flex', flexDirection: 'column', gap: 6 }}>

                {contentSections.map((section, idx) => {
                    const displayData = section.data.slice(0, 12).map(item => ({
                        ...item,
                        title: item.title || item.name // Formats title mapping fallback accurately for series listings
                    }));

                    return (
                        <Box key={idx} component="section">
                            {/* Section Header Utility Bar */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2.5
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    fontWeight="bold"
                                    sx={{ color: '#fff', fontSize: { xs: '1.25rem', md: '1.5rem' }, letterSpacing: '0.3px' }}
                                >
                                    {section.title}
                                </Typography>

                                <Button
                                    endIcon={<ChevronRightIcon />}
                                    sx={{
                                        color: '#9ca3af',
                                        textTransform: 'none',
                                        fontWeight: 'medium',
                                        borderRadius: '30px',
                                        px: 2,
                                        '&:hover': { color: '#00e676', backgroundColor: 'rgba(0,230,118,0.05)' }
                                    }}
                                >
                                    <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>All</Box>
                                    <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>More</Box>
                                </Button>
                            </Box>

                            {/* Section Content Display Logic */}
                            {displayData.length === 0 ? (
                                <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                                    No items found in this section category.
                                </Typography>
                            ) : (
                                <Grid container spacing={2.5}>
                                    {displayData.map((mediaItem) => (
                                        <Grid key={mediaItem.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                            <MovieCard movie={mediaItem} />
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </Box>
                    );
                })}

            </Container>
        </Box>
    );
}