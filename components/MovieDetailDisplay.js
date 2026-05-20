'use client'; // Protects server boundaries from Material UI v6 client hooks

import React from 'react';
import { Container, Typography, Box, Grid, Chip, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function MovieDetailDisplay({ movie, backdropUrl }) {
    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#111827', color: '#fff', pb: 8 }}>

            {/* 1. Backdrop Hero Image Header */}
            {backdropUrl && (
                <Box
                    sx={{
                        width: '100%',
                        height: { xs: '35vh', md: '50vh' },
                        position: 'relative',
                        backgroundImage: `linear-gradient(to bottom, rgba(17,24,39,0.1), #111827), url(${backdropUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center top',
                    }}
                >
                    {/* Back Action Floating Button */}
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            position: 'absolute',
                            top: 24,
                            left: 24,
                            backgroundColor: 'rgba(17,24,39,0.7)',
                            color: '#fff',
                            borderRadius: '30px',
                            textTransform: 'none',
                            backdropFilter: 'blur(4px)',
                            '&:hover': { backgroundColor: 'rgba(17,24,39,0.9)' }
                        }}
                    >
                        Back to Home
                    </Button>
                </Box>
            )}

            {/* 2. Main Details Content Frame */}
            <Container maxWidth="lg" sx={{ mt: backdropUrl ? -8 : 4, position: 'relative', zIndex: 2, px: 3 }}>
                <Grid container spacing={4}>

                    {/* Left Side: Poster Column */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box
                            component="img"
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            sx={{
                                width: '100%',
                                borderRadius: '12px', // Rounded edges matching home cards
                                boxShadow: '0px 10px 30px rgba(0,0,0,0.5)',
                                aspectRatio: '2/3',
                                objectFit: 'cover'
                            }}
                        />
                    </Grid>

                    {/* Right Side: Information Matrix */}
                    <Grid
                        size={{ xs: 12, md: 8 }}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                fontSize: { xs: '2rem', md: '3.5rem' }
                            }}
                        >
                            {movie.title}
                        </Typography>

                        {/* Metadata Pill Badges */}
                        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Chip
                                label={`Released: ${movie.release_date || 'N/A'}`}
                                sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af', borderRadius: '20px', fontWeight: '500' }}
                            />
                            <Chip
                                label={`Rating: ${movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}/10`}
                                sx={{ backgroundColor: '#00e676', color: '#000', fontWeight: 'bold', borderRadius: '20px' }}
                            />
                            {movie.runtime && (
                                <Chip
                                    label={`${movie.runtime} mins`}
                                    sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af', borderRadius: '20px' }}
                                />
                            )}
                        </Box>

                        {/* Premium Pill Action Play Button */}
                        <Button
                            variant="contained"
                            startIcon={<PlayArrowIcon />}
                            sx={{
                                backgroundColor: '#00e676',
                                color: '#000',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                borderRadius: '30px', // Uniform rounded pill design
                                width: 'fit-content',
                                px: 4,
                                py: 1.2,
                                mb: 4,
                                fontSize: '1rem',
                                '&:hover': { backgroundColor: '#00c853' }
                            }}
                        >
                            Watch Trailer
                        </Button>

                        <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#f3f4f6' }}>
                            Overview
                        </Typography>

                        <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#9ca3af', maxWidth: '650px' }}>
                            {movie.overview || 'No description available for this title.'}
                        </Typography>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}