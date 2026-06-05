'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function HeroBanner({ featuredMovies = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Fallback protection if data array is empty
    if (!featuredMovies || featuredMovies.length === 0) return null;

    const currentMovie = featuredMovies[currentIndex];
    const backdropUrl = `https://image.tmdb.org/t/p/original${currentMovie?.backdrop_path}`;

    // Centralized index changing utility with keyframe reset animation triggers
    const triggerSlideChange = useCallback((newIndex) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex(newIndex);

        // Matches the CSS transition duration precisely
        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    }, [isAnimating]);

    const handleNext = useCallback(() => {
        const nextIndex = (currentIndex + 1) % featuredMovies.length;
        triggerSlideChange(nextIndex);
    }, [currentIndex, featuredMovies.length, triggerSlideChange]);

    const handlePrev = useCallback(() => {
        const prevIndex = (currentIndex - 1 + featuredMovies.length) % featuredMovies.length;
        triggerSlideChange(prevIndex);
    }, [currentIndex, featuredMovies.length, triggerSlideChange]);

    // Autoplay implementation cycle
    useEffect(() => {
        const autoPlayTimer = setInterval(() => {
            handleNext();
        }, 6000); // Transitions automatically every 6 seconds

        return () => clearInterval(autoPlayTimer);
    }, [handleNext]);

    return (
        <Box
            sx={{
                width: '100%',
                height: { xs: '40vh', sm: '45vh', md: '60vh' },
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                px: { xs: 3, md: 6 },
                pb: { xs: 4, md: 6 },
                backgroundColor: '#111827',
                overflow: 'hidden'
            }}
        >
            {/* 1. ANIMATED BACKDROP LAYER */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `linear-gradient(to right, rgba(17,24,39,0.95) 15%, rgba(17,24,39,0.3) 60%, rgba(17,24,39,0.95)), linear-gradient(to bottom, rgba(17,24,39,0) 40%, #111827), url(${backdropUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    // Fluid hardware-accelerated crossfade
                    transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isAnimating ? 'scale(1.02)' : 'scale(1)',
                    opacity: isAnimating ? 0.8 : 1,
                    zIndex: 1
                }}
            />

            {/* Slider Left Arrow Control - Pill Circular Button */}
            <IconButton
                onClick={handlePrev}
                sx={{
                    position: 'absolute',
                    left: 24,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    width: 46,
                    height: 46,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: { xs: 'none', md: 'inline-flex' },
                    zIndex: 10,
                    transition: 'all 0.2s ease',
                    '&:hover': { backgroundColor: 'rgba(0, 230, 118, 0.2)', color: '#00e676', border: '1px solid #00e676' }
                }}
            >
                <ArrowBackIosNewIcon fontSize="small" sx={{ ml: 0.5 }} />
            </IconButton>

            {/* 2. TEXT LAYER WITH MOTION DELAY TRANSITIONS */}
            <Box
                sx={{
                    maxWidth: '750px',
                    zIndex: 2,
                    mb: { xs: 1, md: 0 },
                    // Slide up transition matching active changes
                    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                    transform: isAnimating ? 'translateY(15px)' : 'translateY(0px)',
                    opacity: isAnimating ? 0 : 1,
                }}
            >
                <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                        fontWeight: 'bold',
                        mb: 1.8,
                        color: '#fff',
                        fontSize: { xs: '1.85rem', sm: '2.8rem', md: '3.8rem' },
                        lineHeight: 1.15,
                        textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}
                >
                    {currentMovie?.title || currentMovie?.name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#9ca3af', fontSize: '0.85rem' }}>
                    <Box
                        component="span"
                        sx={{
                            border: '1px solid #00e676',
                            px: 1,
                            py: 0.2,
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            color: '#00e676',
                            backgroundColor: 'rgba(0, 230, 118, 0.08)'
                        }}
                    >
                        FEATURED
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: '600', color: '#e5e7eb' }}>
                        {currentMovie?.release_date ? currentMovie.release_date.split('-')[0] : '2026'}
                    </Typography>
                    <Box component="span" sx={{ color: 'rgba(255,255,255,0.2)' }}>•</Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        Rating: {currentMovie?.vote_average ? currentMovie.vote_average.toFixed(1) : '0.0'}/10
                    </Typography>
                </Box>
            </Box>

            {/* Slider Right Arrow Control - Pill Circular Button */}
            <IconButton
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    right: 24,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    width: 46,
                    height: 46,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: { xs: 'none', md: 'inline-flex' },
                    zIndex: 10,
                    transition: 'all 0.2s ease',
                    '&:hover': { backgroundColor: 'rgba(0, 230, 118, 0.2)', color: '#00e676', border: '1px solid #00e676' }
                }}
            >
                <ArrowForwardIosIcon fontSize="small" />
            </IconButton>

            {/* 3. SHIFTING PILL PAGINATION DOTS */}
            <Box sx={{ position: 'absolute', bottom: 28, right: 48, display: { xs: 'none', md: 'flex' }, gap: 1, zIndex: 10 }}>
                {featuredMovies.slice(0, 8).map((_, i) => {
                    const isActive = i === currentIndex;
                    return (
                        <Box
                            key={i}
                            onClick={() => triggerSlideChange(i)}
                            sx={{
                                width: isActive ? 28 : 8, // Active bar expands smoothly into a wide pill accent
                                height: 8,
                                borderRadius: '10px',
                                backgroundColor: isActive ? '#00e676' : 'rgba(255,255,255,0.25)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                '&:hover': {
                                    backgroundColor: isActive ? '#00e676' : 'rgba(255,255,255,0.5)'
                                }
                            }}
                        />
                    );
                })}
            </Box>
        </Box>
    );
}