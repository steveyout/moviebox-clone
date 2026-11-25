'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    Stack,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Dialog,
    DialogContent,
    DialogTitle,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Breadcrumbs
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MovieCard from './MovieCard';
import { providers, DEFAULT_PROVIDER_ID, getEmbedUrl } from '@/config/providers';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PeopleIcon from '@mui/icons-material/People';

// Codename mappings to mask standard provider indexing
const SERVER_CODENAMES = ['Alpha (Fast)', 'Bravo (HD)', 'Charlie (Multi-sub)', 'Delta', 'Echo', 'Foxtrot', 'Golf'];

export default function MoviePlayerDisplay({ media, mediaType }) {
    const isTvShow = mediaType === 'tv';
    const router = useRouter();

    // 1. Local Interactive Player & Layout State Management
    const [selectedProviderId, setSelectedProviderId] = useState(DEFAULT_PROVIDER_ID);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [shareText, setShareText] = useState('Share');
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Watchlist persistence
    useEffect(() => {
        if (!media) return;
        try {
            const savedList = JSON.parse(localStorage.getItem('moviebox_watchlist') || '[]');
            const exists = savedList.some(item => Number(item.id) === Number(media.id));
            setIsSaved(exists);
        } catch (e) {
            console.error('Error reading watchlist:', e);
        }
    }, [media]);

    const toggleWatchlist = () => {
        if (!media) return;
        try {
            const savedList = JSON.parse(localStorage.getItem('moviebox_watchlist') || '[]');
            let updated;
            if (isSaved) {
                updated = savedList.filter(item => Number(item.id) !== Number(media.id));
                setIsSaved(false);
            } else {
                updated = [
                    {
                        id: media.id,
                        title: media.title || media.name,
                        poster_path: media.poster_path,
                        vote_average: media.vote_average,
                        release_date: media.release_date || media.first_air_date,
                        media_type: mediaType
                    },
                    ...savedList
                ];
                setIsSaved(true);
            }
            localStorage.setItem('moviebox_watchlist', JSON.stringify(updated));
        } catch (e) {
            console.error('Error saving watchlist:', e);
        }
    };

    if (!media) return null;

    const titleString = media.title || media.name || 'Untitled Content';
    const ratingScore = media.vote_average ? Number(media.vote_average).toFixed(1) : 'N/A';
    const releaseYear = (media.release_date || media.first_air_date || '2026').split('-')[0];
    const runtime = media.runtime ? `${Math.floor(media.runtime / 60)}h ${media.runtime % 60}m` : null;

    // Recommendations & Credits
    const recommendations = media.recommendations?.results?.slice(0, 12) || [];
    const castList = media.credits?.cast?.slice(0, 10) || [];

    // Find YouTube Trailer
    const trailerVideo = media.videos?.results?.find(
        v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    ) || media.videos?.results?.[0];

    // Dynamic embed URL for selected server
    const embedUrl = getEmbedUrl(
        selectedProviderId,
        mediaType,
        media.id,
        selectedSeason,
        selectedEpisode
    );

    const handleEpisodeSelect = (season, episode) => {
        setSelectedSeason(season);
        setSelectedEpisode(episode);
    };

    const handleShare = async () => {
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${titleString} - MovieBox`,
                    text: `Watch ${titleString} in HD on MovieBox!`,
                    url: currentUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(currentUrl);
                setShareText('Copied!');
                setTimeout(() => setShareText('Share'), 2500);
            } catch (err) {
                console.error('Could not copy URL:', err);
            }
        }
    };

    return (
        <Box sx={{ color: 'white', pb: { xs: 6, md: 10 } }}>

            {/* TOP ACTIONS UTILITY CONTROLS */}
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 6 }, py: 1.5 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        width: '100%'
                    }}
                >
                    {/* BREADCRUMB NAVIGATION */}
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        sx={{
                            color: '#9ca3af',
                            fontSize: '0.85rem',
                            '& a': { color: '#9ca3af', textDecoration: 'none', '&:hover': { color: '#00e676' } }
                        }}
                    >
                        <Link href="/">Home</Link>
                        <Link href={isTvShow ? '/tv' : '/movies'}>
                            {isTvShow ? 'TV Series' : 'Movies'}
                        </Link>
                        <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {titleString}
                        </Typography>
                    </Breadcrumbs>

                    {/* CONTROL ICONS & BUTTONS */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        {/* Watchlist Toggle */}
                        <Tooltip title={isSaved ? "In Watchlist" : "Add to Watchlist"}>
                            <Button
                                variant={isSaved ? "contained" : "outlined"}
                                startIcon={isSaved ? <BookmarkIcon sx={{ color: '#000' }} /> : <BookmarkBorderIcon />}
                                onClick={toggleWatchlist}
                                size="small"
                                sx={{
                                    borderRadius: '20px',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    backgroundColor: isSaved ? '#00e676' : 'transparent',
                                    color: isSaved ? '#000' : '#e5e7eb',
                                    borderColor: isSaved ? '#00e676' : 'rgba(255,255,255,0.2)',
                                    '&:hover': {
                                        backgroundColor: isSaved ? '#00c853' : 'rgba(0,230,118,0.1)',
                                        borderColor: '#00e676'
                                    }
                                }}
                            >
                                {isSaved ? 'Saved' : 'Watchlist'}
                            </Button>
                        </Tooltip>

                        {/* Trailer Button */}
                        {trailerVideo && (
                            <Button
                                variant="outlined"
                                startIcon={<PlayArrowIcon />}
                                onClick={() => setIsTrailerOpen(true)}
                                size="small"
                                sx={{
                                    borderRadius: '20px',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#e5e7eb',
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    '&:hover': { borderColor: '#00e676', backgroundColor: 'rgba(0,230,118,0.05)' }
                                }}
                            >
                                Trailer
                            </Button>
                        )}

                        {/* Theater Mode Toggle */}
                        <Tooltip title={isTheaterMode ? "Normal Mode" : "Theater Mode"}>
                            <IconButton
                                onClick={() => setIsTheaterMode(!isTheaterMode)}
                                sx={{
                                    color: isTheaterMode ? '#00e676' : '#9ca3af',
                                    backgroundColor: isTheaterMode ? 'rgba(0, 230, 118, 0.1)' : 'transparent',
                                    '&:hover': { color: '#00e676', backgroundColor: 'rgba(0, 230, 118, 0.05)' }
                                }}
                            >
                                {isTheaterMode ? <LiveTvIcon fontSize="small" /> : <PersonalVideoIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        {/* Share Button */}
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
                                }
                            }}
                        >
                            <span>{shareText}</span>
                        </Button>
                    </Stack>
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
                boxShadow: '0 12px 50px rgba(0,0,0,0.8)',
                transition: 'max-width 0.3s ease-in-out'
            }}>
                <iframe
                    src={embedUrl}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '0' }}
                    allowFullScreen
                    referrerPolicy="origin"
                    title={`${titleString} Video Player`}
                />
            </Box>

            {/* 2. MEDIA CONTROLS & CONTENT INTERACTION GRID */}
            <Container maxWidth="xl" sx={{ mt: { xs: 3, md: 5 }, px: { xs: 2, sm: 3, md: 6 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>

                    {/* Main Info Column */}
                    <Grid size={isTheaterMode ? { xs: 12 } : { xs: 12, lg: 8 }}>

                        {/* Header Title Metadata Block */}
                        <Box sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <Typography variant="h3" component="h1" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, color: '#fff' }}>
                                    {titleString}
                                </Typography>
                                {isTvShow && (
                                    <Chip
                                        label={`S${selectedSeason} E${selectedEpisode}`}
                                        size="small"
                                        sx={{ backgroundColor: '#be123c', color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}
                                    />
                                )}
                            </Stack>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#9ca3af', fontSize: '0.85rem', mt: 1.5, flexWrap: 'wrap' }}>
                                <Typography variant="body2" color="#6b7280" fontWeight="600">{releaseYear}</Typography>
                                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }}/>
                                <Typography variant="body2" color="#ffd700" fontWeight="700">★ {ratingScore}/10</Typography>
                                {runtime && (
                                    <>
                                        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }}/>
                                        <Typography variant="body2">{runtime}</Typography>
                                    </>
                                )}
                                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }}/>
                                <Typography variant="body2">{media.original_language?.toUpperCase() || 'EN'}</Typography>
                                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }}/>
                                <Chip label="Ultra HD" size="small" sx={{ backgroundColor: 'rgba(0, 230, 118, 0.15)', color: '#00e676', fontWeight: 'bold', fontSize: '0.7rem' }} />
                            </Box>

                            {/* Genres Row */}
                            {media.genres && media.genres.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                                    {media.genres.map(genre => (
                                        <Chip
                                            key={genre.id}
                                            label={genre.name}
                                            size="small"
                                            sx={{
                                                backgroundColor: 'rgba(255,255,255,0.06)',
                                                color: '#d1d5db',
                                                fontSize: '0.75rem',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>

                        {/* A. Server Selection */}
                        <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, backgroundColor: '#1f2937', borderRadius: '16px', mb: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#e5e7eb', fontSize: '0.85rem' }}>
                                    Streaming Servers (Switch if buffering or unavailable)
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#00e676', fontWeight: 'bold' }}>
                                    ● Server Active
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap' }}>
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
                                                px: 2.2,
                                                py: 0.5,
                                                backgroundColor: isActive ? '#00e676' : '#111827',
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
                                    Episodes & Seasons
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
                                                px: 2.5,
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
                                            );
                                        })
                                    }
                                </Grid>
                            </Box>
                        )}

                        {/* C. Synopsis Section */}
                        <Paper elevation={0} sx={{ p: { xs: 3, md: 3.5 }, backgroundColor: '#1f2937', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', mb: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, color: '#e5e7eb' }}>
                                <InfoOutlinedIcon fontSize="small" sx={{ color: '#00e676' }} />
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                                    Storyline & Synopsis
                                </Typography>
                            </Stack>
                            <Typography variant="body1" sx={{ color: '#d1d5db', lineHeight: 1.7, fontSize: '0.92rem' }}>
                                {media.overview || 'No description available for this title.'}
                            </Typography>
                        </Paper>

                        {/* D. Top Cast & Crew */}
                        {castList.length > 0 && (
                            <Paper elevation={0} sx={{ p: { xs: 3, md: 3.5 }, backgroundColor: '#1f2937', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', mb: 3 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: '#e5e7eb' }}>
                                    <PeopleIcon fontSize="small" sx={{ color: '#00e676' }} />
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                                        Featured Cast
                                    </Typography>
                                </Stack>
                                <Grid container spacing={2}>
                                    {castList.map(actor => (
                                        <Grid key={actor.id} size={{ xs: 6, sm: 4, md: 2.4 }}>
                                            <Box sx={{ textAlign: 'center' }}>
                                                <Box
                                                    component="img"
                                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/fallback-poster.svg'}
                                                    alt={actor.name}
                                                    sx={{
                                                        width: 72,
                                                        height: 72,
                                                        borderRadius: '50%',
                                                        objectFit: 'cover',
                                                        mx: 'auto',
                                                        mb: 1,
                                                        border: '2px solid rgba(0, 230, 118, 0.3)'
                                                    }}
                                                />
                                                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.8rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {actor.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {actor.character}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        )}

                        {/* E. SEO FAQs Section */}
                        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, backgroundColor: '#111827', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', mb: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: '#e5e7eb' }}>
                                <HelpOutlineOutlinedIcon fontSize="small" sx={{ color: '#00e676' }} />
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontSize: '1rem' }}>
                                    Frequently Asked Questions (FAQs)
                                </Typography>
                            </Stack>

                            <Accordion sx={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff', mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9ca3af' }} />}>
                                    <Typography fontWeight="600" sx={{ fontSize: '0.88rem' }}>
                                        Where can I stream {titleString} online for free?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                        You can stream {titleString} ({releaseYear}) in high definition online right here on MovieBox. Choose between our fast playback servers without mandatory sign-up or paywalls.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff', mb: 1, borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9ca3af' }} />}>
                                    <Typography fontWeight="600" sx={{ fontSize: '0.88rem' }}>
                                        What should I do if a stream buffers or fails to load?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                        If your video buffers, switch to another server using the &quot;Streaming Servers&quot; pills above (Server Alpha, Bravo, Charlie, etc.). Each server provides separate CDNs and mirror sources.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#9ca3af' }} />}>
                                    <Typography fontWeight="600" sx={{ fontSize: '0.88rem' }}>
                                        Does MovieBox support subtitles and multi-language audio?
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                        Yes! Most player streams include multi-language subtitles (English, Spanish, French, German, Arabic, etc.) accessible directly from the player control bar (CC/Subtitles icon).
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    </Grid>

                    {/* Right Side Sidebar Details Column */}
                    {!isTheaterMode && (
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <Paper elevation={0} sx={{ p: 3, backgroundColor: '#1f2937', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 90 }}>
                                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '2/3', borderRadius: '12px', overflow: 'hidden', mb: 2.5 }}>
                                    <Box
                                        component="img"
                                        src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : '/fallback-poster.svg'}
                                        alt={titleString}
                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <Box sx={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#00e676', color: '#000', fontWeight: 'bold', fontSize: '0.75rem', px: 1.2, py: 0.3, borderRadius: '8px' }}>
                                        1080p Full HD
                                    </Box>
                                </Box>

                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mb: 2, fontSize: '1.1rem' }}>
                                    Title Information
                                </Typography>

                                <Stack spacing={1.5} sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Type:</span>
                                        <span style={{ color: '#fff', fontWeight: 600 }}>{isTvShow ? 'TV Series' : 'Movie'}</span>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Status:</span>
                                        <span style={{ color: '#00e676', fontWeight: 600 }}>{media.status || 'Released'}</span>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Release Date:</span>
                                        <span style={{ color: '#fff' }}>{media.release_date || media.first_air_date || 'N/A'}</span>
                                    </Box>
                                    {runtime && (
                                        <>
                                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Runtime:</span>
                                                <span style={{ color: '#fff' }}>{runtime}</span>
                                            </Box>
                                        </>
                                    )}
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Rating:</span>
                                        <span style={{ color: '#ffd700', fontWeight: 'bold' }}>★ {ratingScore}/10</span>
                                    </Box>
                                </Stack>

                                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                        onClick={toggleWatchlist}
                                        sx={{
                                            backgroundColor: isSaved ? '#be123c' : '#00e676',
                                            color: isSaved ? '#fff' : '#000',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            borderRadius: '30px',
                                            py: 1,
                                            '&:hover': { backgroundColor: isSaved ? '#9f1239' : '#00c853' }
                                        }}
                                    >
                                        {isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                                    </Button>

                                    {trailerVideo && (
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<PlayArrowIcon />}
                                            onClick={() => setIsTrailerOpen(true)}
                                            sx={{
                                                borderColor: 'rgba(255,255,255,0.2)',
                                                color: '#fff',
                                                fontWeight: '600',
                                                textTransform: 'none',
                                                borderRadius: '30px',
                                                py: 1,
                                                '&:hover': { borderColor: '#00e676', backgroundColor: 'rgba(0,230,118,0.05)' }
                                            }}
                                        >
                                            Watch Official Trailer
                                        </Button>
                                    )}
                                </Box>
                            </Paper>
                        </Grid>
                    )}

                    {/* Full-width Recommendation Section */}
                    <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                        <Box component="section">
                            <Typography
                                variant="h5"
                                component="h2"
                                fontWeight="bold"
                                sx={{ color: '#fff', fontSize: { xs: '1.25rem', md: '1.5rem' }, letterSpacing: '0.3px', mb: 2.5 }}
                            >
                                More Like This (Recommended)
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
                                                title: item.title || item.name,
                                                media_type: mediaType
                                            }} />
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                                    No recommendations found for this catalog mapping.
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                </Grid>
            </Container>

            {/* TRAILER POPUP DIALOG */}
            <Dialog
                open={isTrailerOpen}
                onClose={() => setIsTrailerOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { backgroundColor: '#111827', borderRadius: '16px', overflow: 'hidden' }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
                    <Typography variant="h6" fontWeight="bold">
                        {titleString} - Official Trailer
                    </Typography>
                    <IconButton onClick={() => setIsTrailerOpen(false)} sx={{ color: '#9ca3af' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, position: 'relative', pt: '56.25%', backgroundColor: '#000' }}>
                    {trailerVideo && (
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${titleString} Trailer`}
                        />
                    )}
                </DialogContent>
            </Dialog>

        </Box>
    );
}
