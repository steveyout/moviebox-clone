'use client';

import React from 'react';
import { Container, Typography, Grid, Box, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieCard from './MovieCard';

export default function MovieGridDisplay({ movies }) {
    const featuredMovie = movies[0];

    return (
        <Box sx={{ pb: 6 }}>

            {/* 1. Hero Showcase Spotlight Section */}
            <Box sx={{ width: '100%', mb: { xs: 3, md: 5 } }}>
                <MovieCard movie={featuredMovie} isHero={true} />
            </Box>

            {/* 2. Grid Item Collection Container */}
            <Container maxWidth="xl" sx={{ px: { xs: 2.5, md: 6 } }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2.5
                    }}
                >
                    <Typography variant="h5" component="h2" fontWeight="bold" sx={{ color: '#fff', fontSize: { xs: '1.3rem', md: '1.6rem' } }}>
                        Popular Movie
                    </Typography>

                    <Button
                        endIcon={<ChevronRightIcon />}
                        sx={{
                            color: '#9ca3af',
                            textTransform: 'none',
                            fontWeight: 'medium',
                            borderRadius: '20px',
                            '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                    >
                        <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>All</Box>
                        <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>More</Box>
                    </Button>
                </Box>

                {movies.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                        No items loaded. Check backend configuration variables.
                    </Typography>
                ) : (
                    <Grid container spacing={2.5}>
                        {movies.slice(1, 13).map((movie) => (
                            <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                <MovieCard movie={movie} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}