'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button, Stack } from '@mui/material';
import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import ExploreIcon from '@mui/icons-material/Explore';

export default function WatchlistPage() {
    const [savedItems, setSavedItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const list = JSON.parse(localStorage.getItem('moviebox_watchlist') || '[]');
            setSavedItems(list);
        } catch (e) {
            console.error('Failed to load watchlist:', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const clearWatchlist = () => {
        localStorage.removeItem('moviebox_watchlist');
        setSavedItems([]);
    };

    return (
        <Box sx={{ pb: 8, pt: 3 }}>
            <Container maxWidth="xl" sx={{ px: { xs: 2.5, md: 6 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: '1.8rem', md: '2.5rem' }, color: '#fff', mb: 1 }}
                        >
                            My Saved Watchlist
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                            {savedItems.length} title{savedItems.length === 1 ? '' : 's'} saved to your local offline library.
                        </Typography>
                    </Box>

                    {savedItems.length > 0 && (
                        <Button
                            variant="outlined"
                            startIcon={<BookmarkRemoveIcon />}
                            onClick={clearWatchlist}
                            sx={{
                                color: '#ef4444',
                                borderColor: 'rgba(239, 68, 68, 0.4)',
                                borderRadius: '30px',
                                textTransform: 'none',
                                fontWeight: '600',
                                '&:hover': {
                                    borderColor: '#ef4444',
                                    backgroundColor: 'rgba(239, 68, 68, 0.08)'
                                }
                            }}
                        >
                            Clear Watchlist
                        </Button>
                    )}
                </Box>

                {isLoaded && savedItems.length > 0 ? (
                    <Grid container spacing={2.5}>
                        {savedItems.map((item) => (
                            <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                <MovieCard movie={item} />
                            </Grid>
                        ))}
                    </Grid>
                ) : isLoaded ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            px: 3,
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff', mb: 1.5 }}>
                            Your watchlist is currently empty
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af', maxWidth: '480px', mx: 'auto', mb: 4 }}>
                            Keep track of movies and series you want to watch. Click the &quot;Watchlist&quot; bookmark button on any title to save it here.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                component={Link}
                                href="/movies"
                                variant="contained"
                                startIcon={<ExploreIcon />}
                                sx={{
                                    backgroundColor: '#00e676',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    borderRadius: '30px',
                                    px: 3,
                                    py: 1,
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#00c853' }
                                }}
                            >
                                Browse Movies
                            </Button>
                            <Button
                                component={Link}
                                href="/tv"
                                variant="outlined"
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontWeight: '600',
                                    borderRadius: '30px',
                                    px: 3,
                                    py: 1,
                                    textTransform: 'none',
                                    '&:hover': { borderColor: '#00e676', backgroundColor: 'rgba(0,230,118,0.05)' }
                                }}
                            >
                                Browse TV Series
                            </Button>
                        </Stack>
                    </Box>
                ) : null}
            </Container>
        </Box>
    );
}
