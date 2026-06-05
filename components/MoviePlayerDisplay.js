'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Paper, Button, Stack, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import MovieCard from './MovieCard';
import { providers, DEFAULT_PROVIDER_ID, getEmbedUrl } from '@/config/providers';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import LiveTvIcon from '@mui/icons-material/LiveTv';

// Codename mappings to mask standard provider indexing
const SERVER_CODENAMES = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf'];

export default function MoviePlayerDisplay({ media, mediaType }) {
    const isTvShow = mediaType === 'tv';
    const router = useRouter();

    // 1. Local Interactive Player & Layout State Management
    const [selectedProviderId, setSelectedProviderId] = useState(DEFAULT_PROVIDER_ID);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [shareText, setShareText] = useState('Share');
    const [isTheaterMode, setIsTheaterMode] = useState(false);

    if (!media) return null;

    // Beautiful static evaluations
    const ratingScore = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
    const releaseYear = (media.release_date || media.first_air_date || '2026').split('-')[0];

    // Safely extract recommendations array from TMDB object payload
    const recommendations = media.recommendations?.results?.slice(0, 12) || [];

    // 2. Dynamic URL Generation Logic based on selection
    const embedUrl = getEmbedUrl(
        selectedProviderId,
        mediaType,
        media.id,
        selectedSeason,
        selectedEpisode
    );

    // Helper function for TV: Sets episode and resets state
    const handleEpisodeSelect = (season, episode) => {
        setSelectedSeason(season);
        setSelectedEpisode(episode);
    };

    // Native Browser and Clipboard Share Strategy
    const handleShare = async () => {
        const titleString = media.title || media.name;
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: titleString,
                    text: `Check out ${titleString} on Stream App!`,
                    url: currentUrl,
                });
            } catch (error) {
                console.log('Error sharing content safely:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(currentUrl);
                setShareText('Copied!');
                setTimeout(() => setShareText('Share'), 2500);
            } catch (err) {
                console.error('Could not copy shared route payload:', err);
            }
        }
    };

    return (
        <Box sx={{ color: 'white', pb: { xs: 6, md: 10 } }}>

            {/* TOP ACTIONS UTILITY CONTROLS */}
            <Container maxWidth={isTheaterMode ? "xl" : "xl"} sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 1.5 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1.2fr',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    {/* LEFT COLUMN POSITION: Anchors the back button cleanly to the left edge */}
                    <Box sx={{ justifySelf: 'start' }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => router.push('/')}
                            sx={{
                                color: '#9ca3af',
                                textTransform: 'none',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                letterSpacing: '0.3px',
                                minWidth: 'auto',
                                px: 0,
                                '&:hover': { color: '#fff', backgroundColor: 'transparent' }
                            }}
                        >
                            Home
                        </Button>
                    </Box>

                    {/* RIGHT COLUMN POSITION: Locks control icons safely to the extreme right edge */}
                    <Box sx={{ justifySelf: 'end' }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            {/* Theater Mode Toggle Icon Button */}
                            <Tooltip title={isTheaterMode ? "Normal Mode" : "Theater Mode"}>
                                <IconButton
                                    onClick={() => setIsTheaterMode(!isTheaterMode)}
                                    sx={{
                                        color: isTheaterMode ? '#00e676' : '#9ca3af',
                                        backgroundColor: isTheaterMode ? 'rgba(0, 230, 118, 0.08)' : 'transparent',
                                        '&:hover': { color: '#00e676', backgroundColor: 'rgba(0, 230, 118, 0.05)' }
                                    }}
                                >
                                    {isTheaterMode ? <LiveTvIcon fontSize="small" /> : <PersonalVideoIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>

                            {/* Compact Responsive Share Action Button */}
                            <Button
                                variant="outlined"
                                startIcon={<ShareIcon sx={{ fontSize: '1.1rem !important' }} />}
                                onClick={handleShare}
                                size="small"
                                sx={{
                                    borderRadius: '20px',
                                    textTransform: 'none',
                                    color: '#e5e7eb',
                                    borderColor: 'rgba(255,255,255,0.15)',
                                    fontWeight: '500',
                                    fontSize: '0.75rem',
                                    px: 2,
                                    py: 0.4,
                                    minWidth: 'auto',
                                    '&:hover': {
                                        borderColor: '#00e676',
                                        backgroundColor: 'rgba(0, 230, 118, 0.04)'
                                    },
                                    '& .MuiButton-startIcon': {
                                        marginRight: { xs: 0, sm: '6px' }
                                    },
                                    '& span': {
                                        display: { xs: 'none', sm: 'inline-block' }
                                    }
                                }}
                            >
                                <span>{shareText}</span>
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Container>

            {/* 1. CINEMATIC PLAYER AREA */}
            <Box sx={{
                backgroundColor: '#000',
                width: '100%',
                mx: 'auto',
                maxWidth: isTheaterMode ? '100%' : '1440px',
                position: 'relative',
                pt: { xs: '56.25%', sm: '56.25%' },
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                transition: 'max-width 0.3s ease-in-out'
            }}>
                <iframe
                    src={embedUrl}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '0' }}
                    allowFullScreen
                    referrerPolicy="origin"
                    title={`${media.title || media.name} Video Player`}
                />
            </Box>

            {/* 2. MEDIA CONTROLS & CONTENT INTERACTION GRID */}
            <Container maxWidth="xl" sx={{ mt: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 6 } }}>
                <Grid container spacing={{ xs: 3, md: 5 }}>

                    {/* Main Info Column - Sized flawlessly using modern Grid specifications */}
                    <Grid size={isTheaterMode ? { xs: 12 } : { xs: 12, md: 8 }}>

                        {/* Header Title Metadata Block */}
                        <Box sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <Typography variant="h3" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.4rem' }, color: '#fff' }}>
                                    {media.title || media.name}
                                </Typography>
                                {isTvShow && (
                                    <Chip
                                        label={`S${selectedSeason} E${selectedEpisode}`}
                                        size="small"
                                        sx={{ backgroundColor: '#be123c', color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}
                                    />
                                )}
                            </Stack>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#9ca3af', fontSize: '0.85rem', mt: 1.5 }}>
                                <Typography variant="body2" color="#6b7280">{releaseYear}</Typography>
                                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }}/>
                                <Typography variant="body2" color="#ffd700" fontWeight="600">{ratingScore}/10</Typography>
                                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)' }}/>
                                <Typography variant="body2">{media.original_language?.toUpperCase()}</Typography>
                            </Box>
                        </Box>

                        {/* A. Server Selection (Uses Random Codenames) */}
                        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#1f2937', borderRadius: '16px', mb: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: '#e5e7eb', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                                Server Select (Switch if stream is broken)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                                {providers.filter(p => p.enabled).map((provider, index) => {
                                    const isActive = provider.id === selectedProviderId;
                                    const serverName = SERVER_CODENAMES[index] || `Server ${index + 1}`;

                                    return (
                                        <Button
                                            key={provider.id}
                                            onClick={() => setSelectedProviderId(provider.id)}
                                            variant={isActive ? "contained" : "outlined"}
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '30px',
                                                fontWeight: '600',
                                                fontSize: '0.75rem',
                                                px: 2.5,
                                                py: 0.6,
                                                backgroundColor: isActive ? '#00e676' : '#1f2937',
                                                color: isActive ? '#000' : '#d1d5db',
                                                borderColor: isActive ? '#00e676' : 'rgba(255,255,255,0.1)',
                                                '&:hover': {
                                                    backgroundColor: isActive ? '#00c853' : 'rgba(255,255,255,0.08)'
                                                }
                                            }}
                                        >
                                            {serverName}
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Paper>

                        {/* B. TV Show Episode Guide */}
                        {isTvShow && media.full_seasons_data && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#fff', fontSize: '1.1rem' }}>
                                    Episode Guide
                                </Typography>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        overflowX: 'auto',
                                        pb: 1.5,
                                        mb: 2.5,
                                        WebkitOverflowScrolling: 'touch',
                                        '&::-webkit-scrollbar': { height: '4px' },
                                        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }
                                    }}
                                >
                                    {media.full_seasons_data.map(season => (
                                        <Button
                                            key={season.season_number}
                                            onClick={() => setSelectedSeason(season.season_number)}
                                            variant={season.season_number === selectedSeason ? "contained" : "outlined"}
                                            sx={{
                                                textTransform: 'none',
                                                whiteSpace: 'nowrap',
                                                borderRadius: '20px',
                                                px: 3,
                                                fontSize: '0.8rem',
                                                color: season.season_number === selectedSeason ? '#000' : '#fff',
                                                backgroundColor: season.season_number === selectedSeason ? '#00e676' : 'transparent',
                                                borderColor: season.season_number === selectedSeason ? '#00e676' : 'rgba(255,255,255,0.2)'
                                            }}
                                        >
                                            Season {season.season_number}
                                        </Button>
                                    ))}
                                </Stack>

                                <Grid container spacing={1.5}>
                                    {media.full_seasons_data
                                        .find(s => s.season_number === selectedSeason)
                                        ?.episodes.map(episode => {
                                            const isCurrent = episode.season_number === selectedSeason && episode.episode_number === selectedEpisode;
                                            return (
                                                <Grid key={episode.id} size={isTheaterMode ? { xs: 6, sm: 4, md: 3, lg: 2 } : { xs: 6, sm: 4, md: 4, lg: 3 }}>
                                                    <Paper
                                                        onClick={() => handleEpisodeSelect(episode.season_number, episode.episode_number)}
                                                        elevation={0}
                                                        sx={{
                                                            p: 1.8,
                                                            borderRadius: '12px',
                                                            cursor: 'pointer',
                                                            minHeight: '62px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            backgroundColor: isCurrent ? 'rgba(0, 230, 118, 0.12)' : '#1f2937',
                                                            border: isCurrent ? '2px solid #00e676' : '1px solid rgba(255,255,255,0.05)',
                                                            '&:hover': {
                                                                backgroundColor: isCurrent ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255,255,255,0.06)'
                                                            }
                                                        }}
                                                    >
                                                        <Typography variant="body2" fontWeight="bold" color={isCurrent ? '#00e676' : 'white'} sx={{ fontSize: '0.8rem' }}>
                                                            Episode {episode.episode_number}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mt: 0.2 }}>
                                                            {episode.name}
                                                        </Typography>
                                                    </Paper>
                                                </Grid>
                                            )
                                        })
                                    }
                                </Grid>
                            </Box>
                        )}

                        {/* C. Synopsis Section */}
                        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, backgroundColor: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: '#e5e7eb' }}>
                                <InfoOutlinedIcon fontSize="small"/>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '0.95rem' }}>
                                    Synopsis
                                </Typography>
                            </Stack>
                            <Typography variant="body1" sx={{ color: '#d1d5db', lineHeight: 1.6, fontSize: '0.9rem', fontWeight: '400' }}>
                                {media.overview || 'No description available.'}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Right Side Empty Sidebar Column (Keeps original spacing layout balanced when not in theater mode) */}
                    {!isTheaterMode && <Grid size={{ xs: 12, md: 4 }} />}

                    {/* Full-width Recommendation Section (Displays beautiful rows of exactly 6 cards) */}
                    <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
                        <Box component="section">
                            <Typography
                                variant="h5"
                                component="h2"
                                fontWeight="bold"
                                sx={{ color: '#fff', fontSize: { xs: '1.25rem', md: '1.5rem' }, letterSpacing: '0.3px', mb: 2.5 }}
                            >
                                Recommended Content
                            </Typography>

                            {recommendations.length > 0 ? (
                                <Grid container spacing={2.5}>
                                    {recommendations.map((item) => (
                                        <Grid
                                            key={item.id}
                                            size={{ xs: 6, sm: 4, md: 3, lg: 2 }}
                                        >
                                            <MovieCard movie={{
                                                ...item,
                                                title: item.title || item.name
                                            }} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                                    No direct recommendations found for this catalog mapping.
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}