'use client';

import React from 'react';
import { Box, Card, CardMedia, Typography } from '@mui/material';
import Link from 'next/link';
import HeroBanner from './HeroBanner';

export default function MovieCard({ movie, isHero = false }) {
    if (!movie) return null;

    if (isHero) {
        return <HeroBanner featuredMovie={movie} />;
    }

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : '/fallback-poster.png';

    return (
        <Card
            component={Link}
            href={`/movies/${movie.id}`}
            sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderRadius: '12px', // Fully smooth corners for the card wrapper
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'block',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.04)',
                }
            }}
        >
            <Box sx={{ position: 'relative', aspectRatio: '2/3', width: '100%' }}>
                <CardMedia
                    component="img"
                    image={posterUrl}
                    alt={movie.title}
                    sx={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '12px' }}
                />

                {/* Language Badge Overlay - Fully Pill Rounded */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(17, 24, 39, 0.8)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        px: 1.2,
                        py: 0.4,
                        borderRadius: '20px', // Clean pill curves
                        fontWeight: 'bold',
                        letterSpacing: '0.3px',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.08)'
                    }}
                >
                    English
                </Box>
            </Box>

            {/* Truncated Title Placement */}
            <Typography
                variant="body2"
                sx={{
                    color: '#f9fafb',
                    fontWeight: '500',
                    mt: 1.2,
                    px: 0.5,
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
            >
                {movie.title}
            </Typography>
        </Card>
    );
}