'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function HeroBanner({ featuredMovie }) {
    if (!featuredMovie) return null;

    const backdropUrl = `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`;

    return (
        <Box
            sx={{
                width: '100%',
                height: { xs: '35vh', sm: '45vh', md: '55vh' },
                position: 'relative',
                backgroundImage: `linear-gradient(to right, rgba(17,24,39,0.9) 20%, rgba(17,24,39,0.2) 60%, rgba(17,24,39,0.9)), linear-gradient(to bottom, rgba(17,24,39,0) 50%, #111827), url(${backdropUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                display: 'flex',
                alignItems: 'flex-end',
                px: { xs: 3, md: 6 },
                pb: { xs: 4, md: 6 }
            }}
        >
            {/* Slider Left Arrow Control - Pill Circular Button */}
            <IconButton
                sx={{
                    position: 'absolute',
                    left: 24,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    width: 44,
                    height: 44,
                    backdropFilter: 'blur(4px)',
                    display: { xs: 'none', md: 'inline-flex' },
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
            >
                <ArrowBackIosNewIcon fontSize="small" sx={{ ml: 0.5 }} />
            </IconButton>

            {/* Featured Context Details Text Box Info */}
            <Box sx={{ maxWidth: '700px', zIndex: 2, mb: { xs: 1, md: 0 } }}>
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                        fontWeight: 'bold',
                        mb: 1.5,
                        color: '#fff',
                        fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.5rem' },
                        lineHeight: 1.2
                    }}
                >
                    {featuredMovie.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#9ca3af', fontSize: '0.85rem' }}>
                    <Box
                        component="span"
                        sx={{
                            border: '1px solid rgba(255,255,255,0.3)',
                            px: 0.8,
                            py: 0.2,
                            borderRadius: '12px', // Rounded pill tag
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            color: '#fff',
                            backgroundColor: 'rgba(255,255,255,0.05)'
                        }}
                    >
                        TV
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {featuredMovie.release_date ? featuredMovie.release_date.split('-')[0] : '2026'}
                    </Typography>
                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'inline' }, fontWeight: 'medium' }}>
                        Action, Crime, Drama
                    </Typography>
                </Box>
            </Box>

            {/* Slider Right Arrow Control - Pill Circular Button */}
            <IconButton
                sx={{
                    position: 'absolute',
                    right: 24,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    width: 44,
                    height: 44,
                    backdropFilter: 'blur(4px)',
                    display: { xs: 'none', md: 'inline-flex' },
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
                }}
            >
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>

            {/* Slide Pagination Indicator Dots - Rounded Pills */}
            <Box sx={{ position: 'absolute', bottom: 24, right: 48, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                {[...Array(12)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: i === 5 ? 24 : 8,
                            height: 8,
                            borderRadius: '10px',
                            backgroundColor: i === 5 ? '#fff' : 'rgba(255,255,255,0.25)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}