'use client';

import React from 'react';
import { Box, Card, CardMedia, Typography } from '@mui/material';
import Link from 'next/link';
import StarIcon from '@mui/icons-material/Star';

export default function MovieCard({ movie }) {
    if (!movie) return null;

    // Use TMDB title or title fallbacks for television items securely
    const cardTitle = movie.title || movie.name || 'Untitled Content';

    // Resolve dates and release parameters cleanly
    const releaseYear = movie.release_date || movie.first_air_date
        ? (movie.release_date || movie.first_air_date).split('-')[0]
        : '2026';

    // Bumps to w400 asset resolution endpoints for sharper high-density responsive devices
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
        : '/fallback-poster.png';

    // Formats ratings beautifully (e.g., 7.6)
    const ratingScore = movie.vote_average ? movie.vote_average.toFixed(1) : null;

    /**
     * Contextual Link Resolver Strategy:
     * Inspects properties to determine if the target route requires a 'tv' or 'movie' sub-path.
     */
    const resolvedType = (
        movie.mediaType ||
        movie.media_type ||
        (movie.first_air_date || movie.name ? 'tv' : 'movie')
    ).toLowerCase();

    return (
        <Card
            component={Link}
            href={`/watch/${resolvedType}/${movie.id}`}
            sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderRadius: '16px', // Slightly larger curves for modern aesthetic
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'block',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', // Snappy premium ease-out bezier curve
                '&:hover': {
                    transform: 'translateY(-6px)', // Lifts up elegantly off the page grid layout
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
                    '& .poster-img': {
                        transform: 'scale(1.08) cubic-bezier(0.16, 1, 0.3, 1)',
                        filter: 'brightness(0.7) blur(1px)'
                    },
                    '& .hover-overlay': {
                        transform: 'translateY(0)',
                        opacity: 1
                    }
                }
            }}
        >
            <Box sx={{ position: 'relative', aspectRatio: '2/3', width: '100%', overflow: 'hidden', borderRadius: '16px' }}>

                {/* 1. ANIMATING POSTER ART */}
                <CardMedia
                    component="img"
                    image={posterUrl}
                    alt={cardTitle}
                    className="poster-img"
                    sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease, filter 0.5s ease',
                        willChange: 'transform'
                    }}
                />

                {/* 2. DYNAMIC LANGUAGE TOP-RIGHT BADGE */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(17, 24, 39, 0.65)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        zIndex: 3
                    }}
                >
                    {movie.original_language || 'EN'}
                </Box>

                {/* 3. CINEMATIC GRADIENT HOVER OVERLAY BOX */}
                <Box
                    className="hover-overlay"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: '40%', // Takes up lower portion of image card frame on interaction
                        background: 'linear-gradient(to top, rgba(17, 24, 39, 0.95) 10%, rgba(17, 24, 39, 0.75) 60%, rgba(17, 24, 39, 0))',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 2,
                        pb: 2.5,
                        zIndex: 2,
                        opacity: { xs: 1, md: 0 }, // Always shown on mobile for touch usability, hidden on desktop until hover
                        transform: { xs: 'none', md: 'translateY(25%)' }, // Slides upward into sight frame
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease'
                    }}
                >
                    {/* Meta Info Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8, flexWrap: 'wrap' }}>
                        <Box
                            sx={{
                                backgroundColor: '#00e676',
                                color: '#000',
                                fontSize: '0.6rem',
                                px: 1,
                                py: 0.2,
                                borderRadius: '10px',
                                fontWeight: '800',
                            }}
                        >
                            {resolvedType.toUpperCase()}
                        </Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 'bold' }}>
                            {releaseYear}
                        </Typography>
                    </Box>

                    {/* Content Title Inside Overlay */}
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            lineHeight: 1.2,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {cardTitle}
                    </Typography>

                    {/* Star Rating Layout Indicator Row */}
                    {ratingScore && ratingScore > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ color: '#ffd700', fontSize: 16 }} />
                            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                {ratingScore}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
                                /10
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* 4. BASE PERMANENT UNDER-TEXT TITLE LABEL (Fallback visibility anchor) */}
            <Typography
                variant="body2"
                sx={{
                    color: '#f3f4f6',
                    fontWeight: '600',
                    mt: 1.2,
                    px: 0.5,
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: { xs: 'block', md: 'block' }, // Kept active so standard non-hover view remains perfectly readable
                    transition: 'color 0.3s ease',
                    '.MuiCard-root:hover &': {
                        color: '#00e676' // Lights up the brand color on hover
                    }
                }}
            >
                {cardTitle}
            </Typography>
        </Card>
    );
}