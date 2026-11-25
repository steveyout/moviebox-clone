'use client';

import React, { useState } from 'react';
import { Box, Card, CardMedia, Typography, IconButton } from '@mui/material';
import Link from 'next/link';
import StarIcon from '@mui/icons-material/Star';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export default function MovieCard({ movie }) {
    const [imgSrc, setImgSrc] = useState(
        movie?.poster_path
            ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
            : '/fallback-poster.svg'
    );
    const [isBookmarked, setIsBookmarked] = useState(false);

    if (!movie) return null;

    // Use TMDB title or title fallbacks for television items securely
    const cardTitle = movie.title || movie.name || 'Untitled Content';

    // Resolve dates and release parameters cleanly
    const releaseYear = movie.release_date || movie.first_air_date
        ? (movie.release_date || movie.first_air_date).split('-')[0]
        : '2026';

    // Formats ratings beautifully (e.g., 7.6)
    const ratingScore = movie.vote_average ? Number(movie.vote_average).toFixed(1) : null;

    const resolvedType = (
        movie.mediaType ||
        movie.media_type ||
        (movie.first_air_date || movie.name ? 'tv' : 'movie')
    ).toLowerCase();

    return (
        <Card
            component={Link}
            href={`/watch/${resolvedType}/${movie.id}`}
            title={`Watch ${cardTitle} online on MovieBox`}
            sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderRadius: '16px',
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'block',
                position: 'relative',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 14px 30px rgba(0, 0, 0, 0.6)',
                    '& .poster-img': {
                        transform: 'scale(1.06)',
                        filter: 'brightness(0.7)'
                    },
                    '& .hover-overlay': {
                        transform: 'translateY(0)',
                        opacity: 1
                    }
                }
            }}
        >
            <Box sx={{ position: 'relative', aspectRatio: '2/3', width: '100%', overflow: 'hidden', borderRadius: '16px', backgroundColor: '#1f2937' }}>

                {/* 1. POSTER ART */}
                <CardMedia
                    component="img"
                    image={imgSrc}
                    alt={`${cardTitle} poster`}
                    className="poster-img"
                    onError={() => setImgSrc('/fallback-poster.svg')}
                    sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease, filter 0.4s ease',
                    }}
                />

                {/* 2. DYNAMIC LANGUAGE TOP-RIGHT BADGE */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: 'rgba(17, 24, 39, 0.75)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        px: 1.2,
                        py: 0.4,
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        zIndex: 3
                    }}
                >
                    {movie.original_language ? movie.original_language.toUpperCase() : 'HD'}
                </Box>

                {/* 3. CINEMATIC GRADIENT HOVER OVERLAY BOX */}
                <Box
                    className="hover-overlay"
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: '40%',
                        background: 'linear-gradient(to top, rgba(17, 24, 39, 0.98) 15%, rgba(17, 24, 39, 0.7) 65%, rgba(17, 24, 39, 0))',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 1.8,
                        pb: 2,
                        zIndex: 2,
                        opacity: { xs: 1, md: 0 },
                        transform: { xs: 'none', md: 'translateY(20%)' },
                        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease'
                    }}
                >
                    {/* Meta Info Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8, flexWrap: 'wrap' }}>
                        <Box
                            sx={{
                                backgroundColor: '#00e676',
                                color: '#000',
                                fontSize: '0.6rem',
                                px: 1,
                                py: 0.2,
                                borderRadius: '8px',
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
                            fontSize: '0.9rem',
                            lineHeight: 1.25,
                            mb: 0.8,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {cardTitle}
                    </Typography>

                    {/* Star Rating Layout Indicator Row */}
                    {ratingScore && Number(ratingScore) > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <StarIcon sx={{ color: '#ffd700', fontSize: 15 }} />
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

            {/* 4. BASE PERMANENT UNDER-TEXT TITLE LABEL */}
            <Typography
                variant="body2"
                sx={{
                    color: '#f3f4f6',
                    fontWeight: '600',
                    mt: 1,
                    px: 0.5,
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    transition: 'color 0.2s ease',
                    '.MuiCard-root:hover &': {
                        color: '#00e676'
                    }
                }}
            >
                {cardTitle}
            </Typography>
        </Card>
    );
}
