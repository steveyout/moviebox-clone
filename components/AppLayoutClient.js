'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    InputBase,
    Button,
    IconButton,
    Paper,
    BottomNavigation,
    BottomNavigationAction,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Stack,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

// Navigation Icon Set
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import LaptopIcon from '@mui/icons-material/Laptop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { searchMedia } from '@/lib/tmdb';

export default function AppLayoutClient({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    // Download App Dialog
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [downloadTab, setDownloadTab] = useState(0);

    // Debounced search query
    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(async () => {
            try {
                const results = await searchMedia(searchQuery);
                setSearchResults(results.slice(0, 6));
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setIsSearching(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle search submission
    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setIsSearchOpen(false);
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Calculate active bottom nav index
    const getNavIndex = () => {
        if (pathname === '/') return 0;
        if (pathname.startsWith('/movies')) return 1;
        if (pathname.startsWith('/tv')) return 2;
        if (pathname.startsWith('/trending')) return 3;
        if (pathname.startsWith('/watchlist')) return 4;
        return 0;
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', overflow: 'hidden' }}>

            {/* 1. ADAPTIVE TOP NAVIGATION BAR */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1.5, md: 0 },
                        py: { xs: 1.5, md: 1.2 },
                        px: { xs: 2, md: 3 },
                        minHeight: { md: '72px' }
                    }}
                >
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>

                        {/* Brand Logo Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ display: { md: 'none' } }}>
                                <MenuIcon />
                            </IconButton>
                            <Box
                                component={Link}
                                href="/"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.8,
                                    textDecoration: 'none',
                                    color: '#fff'
                                }}
                            >
                                <PlayCircleFilledIcon sx={{ color: '#00e676', fontSize: 34 }} />
                                <Box component="span" sx={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                                    Movie<span style={{ color: '#00e676' }}>Box</span>
                                </Box>
                            </Box>
                        </Box>

                        {/* Desktop Only Search Input Bar */}
                        <Box
                            ref={searchRef}
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '30px',
                                px: 2.5,
                                py: 0.8,
                                width: '45%',
                                position: 'relative',
                                border: '1px solid rgba(255,255,255,0.08)',
                                transition: 'all 0.2s ease',
                                '&:focus-within': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                    borderColor: '#00e676'
                                }
                            }}
                        >
                            <SearchIcon sx={{ color: '#9ca3af', mr: 1, fontSize: 20 }} />
                            <InputBase
                                placeholder="Search movies, TV shows, actors..."
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onKeyDown={handleSearchSubmit}
                                onFocus={() => setIsSearchOpen(true)}
                                sx={{ color: 'white', fontSize: '0.9rem' }}
                            />
                            {isSearching && <CircularProgress size={16} sx={{ color: '#00e676', mr: 1 }} />}

                            {/* Live Search Suggestions Dropdown */}
                            {isSearchOpen && searchResults.length > 0 && (
                                <Paper
                                    elevation={8}
                                    sx={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        mt: 1,
                                        backgroundColor: '#1f2937',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        zIndex: 1400,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <List sx={{ p: 0 }}>
                                        {searchResults.map((item) => {
                                            const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                                            const title = item.title || item.name;
                                            const year = (item.release_date || item.first_air_date || '').split('-')[0];
                                            return (
                                                <ListItem
                                                    key={item.id}
                                                    component={Link}
                                                    href={`/watch/${type}/${item.id}`}
                                                    onClick={() => {
                                                        setIsSearchOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                    sx={{
                                                        color: '#fff',
                                                        textDecoration: 'none',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                        '&:hover': { backgroundColor: 'rgba(0, 230, 118, 0.1)' }
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            variant="rounded"
                                                            src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : '/fallback-poster.svg'}
                                                            alt={title}
                                                            sx={{ width: 36, height: 50, mr: 1 }}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={title}
                                                        secondary={`${type.toUpperCase()} • ${year || '2026'}`}
                                                        primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}
                                                        secondaryTypographyProps={{ fontSize: '0.75rem', color: '#9ca3af' }}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                        <ListItem
                                            component={Link}
                                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                            onClick={() => setIsSearchOpen(false)}
                                            sx={{
                                                justifyContent: 'center',
                                                backgroundColor: 'rgba(0, 230, 118, 0.08)',
                                                color: '#00e676',
                                                cursor: 'pointer',
                                                py: 1.2,
                                                '&:hover': { backgroundColor: 'rgba(0, 230, 118, 0.15)' }
                                            }}
                                        >
                                            <Typography variant="caption" fontWeight="bold">
                                                View all results for &quot;{searchQuery}&quot; →
                                            </Typography>
                                        </ListItem>
                                    </List>
                                </Paper>
                            )}
                        </Box>

                        {/* Desktop Actions Layout */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<SystemUpdateAltIcon />}
                                onClick={() => setIsDownloadOpen(true)}
                                sx={{
                                    backgroundColor: '#00e676',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    borderRadius: '30px',
                                    px: 2.5,
                                    py: 0.8,
                                    '&:hover': { backgroundColor: '#00c853' }
                                }}
                            >
                                Download App
                            </Button>

                            <Button
                                color="inherit"
                                startIcon={<LanguageIcon />}
                                endIcon={<ArrowDropDownIcon />}
                                sx={{
                                    textTransform: 'none',
                                    color: '#9ca3af',
                                    fontWeight: 'medium',
                                    borderRadius: '30px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    px: 2,
                                    py: 0.8
                                }}
                            >
                                ENGLISH
                            </Button>
                        </Box>
                    </Box>

                    {/* Mobile Only Search Bar */}
                    <Box
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '30px',
                            px: 2.5,
                            py: 0.8,
                            width: '100%',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <SearchIcon sx={{ color: '#9ca3af', mr: 1, fontSize: 20 }} />
                        <InputBase
                            placeholder="Search movies/ TV Shows"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            sx={{ color: 'white', fontSize: '0.95rem' }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* 2. DESKTOP ONLY SIDEBAR RAIL */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    width: 70,
                    backgroundColor: '#111827',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                    position: 'fixed',
                    top: 72,
                    bottom: 0,
                    left: 0,
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 2.5,
                    gap: 2.5,
                    zIndex: 1200
                }}
            >
                {/* Home */}
                <Tooltip title="Home" placement="right">
                    <IconButton
                        component={Link}
                        href="/"
                        sx={{
                            color: pathname === '/' ? '#00e676' : '#6b7280',
                            borderLeft: pathname === '/' ? '3px solid #00e676' : '3px solid transparent',
                            borderRadius: 0,
                            width: '100%',
                            py: 1,
                            '&:hover': { color: '#fff' }
                        }}
                    >
                        <HomeIcon />
                    </IconButton>
                </Tooltip>

                {/* Movies */}
                <Tooltip title="Movies" placement="right">
                    <IconButton
                        component={Link}
                        href="/movies"
                        sx={{
                            color: pathname.startsWith('/movies') ? '#00e676' : '#6b7280',
                            borderLeft: pathname.startsWith('/movies') ? '3px solid #00e676' : '3px solid transparent',
                            borderRadius: 0,
                            width: '100%',
                            py: 1,
                            '&:hover': { color: '#fff' }
                        }}
                    >
                        <MovieIcon />
                    </IconButton>
                </Tooltip>

                {/* TV Shows */}
                <Tooltip title="TV Series" placement="right">
                    <IconButton
                        component={Link}
                        href="/tv"
                        sx={{
                            color: pathname.startsWith('/tv') ? '#00e676' : '#6b7280',
                            borderLeft: pathname.startsWith('/tv') ? '3px solid #00e676' : '3px solid transparent',
                            borderRadius: 0,
                            width: '100%',
                            py: 1,
                            '&:hover': { color: '#fff' }
                        }}
                    >
                        <TvIcon />
                    </IconButton>
                </Tooltip>

                {/* Trending */}
                <Tooltip title="Trending Now" placement="right">
                    <IconButton
                        component={Link}
                        href="/trending"
                        sx={{
                            color: pathname.startsWith('/trending') ? '#00e676' : '#6b7280',
                            borderLeft: pathname.startsWith('/trending') ? '3px solid #00e676' : '3px solid transparent',
                            borderRadius: 0,
                            width: '100%',
                            py: 1,
                            '&:hover': { color: '#fff' }
                        }}
                    >
                        <WhatshotIcon />
                    </IconButton>
                </Tooltip>

                {/* Watchlist */}
                <Tooltip title="My Watchlist" placement="right">
                    <IconButton
                        component={Link}
                        href="/watchlist"
                        sx={{
                            color: pathname.startsWith('/watchlist') ? '#00e676' : '#6b7280',
                            borderLeft: pathname.startsWith('/watchlist') ? '3px solid #00e676' : '3px solid transparent',
                            borderRadius: 0,
                            width: '100%',
                            py: 1,
                            '&:hover': { color: '#fff' }
                        }}
                    >
                        <BookmarkIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* 3. Main Content Display Wrapper */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: { xs: '0px', md: '70px' },
                    marginTop: { xs: '130px', md: '72px' },
                    width: { xs: '100%', md: 'calc(100% - 70px)' },
                    pb: { xs: 8, md: 0 },
                    overflowX: 'hidden'
                }}
            >
                {children}
            </Box>

            {/* 4. MOBILE ONLY BOTTOM NAVIGATION BAR */}
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: { xs: 'block', md: 'none' },
                    zIndex: 1300,
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: '#1f2937'
                }}
                elevation={3}
            >
                <BottomNavigation
                    showLabels
                    value={getNavIndex()}
                    sx={{
                        backgroundColor: '#1f2937',
                        '& .MuiBottomNavigationAction-root': { color: '#9ca3af', minWidth: 'auto' },
                        '& .Mui-selected': { color: '#00e676 !important' }
                    }}
                >
                    <BottomNavigationAction component={Link} href="/" label="Home" icon={<HomeIcon />} />
                    <BottomNavigationAction component={Link} href="/movies" label="Movies" icon={<MovieIcon />} />
                    <BottomNavigationAction component={Link} href="/tv" label="TV" icon={<TvIcon />} />
                    <BottomNavigationAction component={Link} href="/trending" label="Trending" icon={<WhatshotIcon />} />
                    <BottomNavigationAction component={Link} href="/watchlist" label="Saved" icon={<BookmarkIcon />} />
                </BottomNavigation>
            </Paper>

            {/* 5. DOWNLOAD APP / PWA INSTALLATION MODAL */}
            <Dialog
                open={isDownloadOpen}
                onClose={() => setIsDownloadOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { backgroundColor: '#1f2937', borderRadius: '20px', color: '#fff' }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PlayCircleFilledIcon sx={{ color: '#00e676', fontSize: 28 }} />
                        <Typography variant="h6" fontWeight="bold">
                            Get the MovieBox App
                        </Typography>
                    </Stack>
                    <IconButton onClick={() => setIsDownloadOpen(false)} sx={{ color: '#9ca3af' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 3, pt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2.5 }}>
                        Experience fast, buffer-free streaming with offline mode support, notification alerts for new episodes, and 4K playback.
                    </Typography>

                    <Tabs
                        value={downloadTab}
                        onChange={(e, v) => setDownloadTab(v)}
                        variant="fullWidth"
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            mb: 3,
                            '& .MuiTabs-indicator': { backgroundColor: '#00e676' },
                            '& .Mui-selected': { color: '#00e676 !important' }
                        }}
                    >
                        <Tab icon={<AndroidIcon />} label="Android" sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 'bold' }} />
                        <Tab icon={<AppleIcon />} label="iOS / Safari" sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 'bold' }} />
                        <Tab icon={<LaptopIcon />} label="Desktop PWA" sx={{ color: '#9ca3af', textTransform: 'none', fontWeight: 'bold' }} />
                    </Tabs>

                    {downloadTab === 0 && (
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#00e676' }}>
                                Android APK &amp; PWA:
                            </Typography>
                            <Stack spacing={1.5} sx={{ color: '#d1d5db', fontSize: '0.88rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Open Chrome on your Android device.</span>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Tap the <strong>three dots</strong> menu in the top right.</span>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</span>
                                </Box>
                            </Stack>
                        </Box>
                    )}

                    {downloadTab === 1 && (
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#00e676' }}>
                                iPhone &amp; iPad (iOS):
                            </Typography>
                            <Stack spacing={1.5} sx={{ color: '#d1d5db', fontSize: '0.88rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Open <strong>Safari</strong> and navigate to MovieBox.</span>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Tap the <strong>Share</strong> button at the bottom of the screen.</span>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.</span>
                                </Box>
                            </Stack>
                        </Box>
                    )}

                    {downloadTab === 2 && (
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: '#00e676' }}>
                                Windows, Mac &amp; Chromebook:
                            </Typography>
                            <Stack spacing={1.5} sx={{ color: '#d1d5db', fontSize: '0.88rem' }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Open Chrome, Edge, or Brave browser.</span>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Click the <strong>Install MovieBox</strong> icon in the address bar.</span>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#00e676', fontSize: 20, mt: 0.2 }} />
                                    <span>Enjoy standalone desktop app window without browser tabs.</span>
                                </Box>
                            </Stack>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => setIsDownloadOpen(false)}
                        sx={{
                            mt: 3,
                            backgroundColor: '#00e676',
                            color: '#000',
                            fontWeight: 'bold',
                            borderRadius: '30px',
                            py: 1.2,
                            '&:hover': { backgroundColor: '#00c853' }
                        }}
                    >
                        Got It
                    </Button>
                </DialogContent>
            </Dialog>

        </Box>
    );
}
