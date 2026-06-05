'use client'; // This directive resolves the unstable_createUseMediaQuery error

import React, { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    InputBase,
    Button,
    IconButton,
    Paper,
    BottomNavigation,
    BottomNavigationAction
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

// Navigation Icon Set
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import BookIcon from '@mui/icons-material/Book';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExtensionIcon from '@mui/icons-material/Extension';

export default function AppLayoutClient({ children }) {
    const [navValue, setNavValue] = useState(0);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', overflow: 'hidden' }}>

            {/* 1. ADAPTIVE TOP NAVIGATION BAR */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: 1.5, md: 0 },
                        // Added balanced padding across screen sizes to prevent hugging the top
                        py: { xs: 1.5, md: 1.2 },
                        px: 2,
                        // Established uniform desktop height boundary
                        minHeight: { md: '72px' }
                    }}
                >
                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>

                        {/* Brand Logo Section */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton edge="start" color="inherit" aria-label="menu">
                                <MenuIcon />
                            </IconButton>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                                <PlayCircleFilledIcon sx={{ color: '#00e676', fontSize: 32 }} />
                                <Box component="span" sx={{ fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                                    MovieBox
                                </Box>
                            </Box>
                        </Box>

                        {/* Desktop Only Search Input Bar */}
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '30px',
                                px: 2.5,
                                py: 0.8, // Slightly expanded vertical inner spacing
                                width: '45%',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                            <InputBase
                                placeholder="Search movies/ TV Shows"
                                fullWidth
                                sx={{ color: 'white', fontSize: '0.9rem' }}
                            />
                        </Box>

                        {/* Desktop Actions Layout */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<SystemUpdateAltIcon />}
                                sx={{
                                    backgroundColor: '#00e676',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    borderRadius: '30px',
                                    px: 3,
                                    py: 1, // Added explicit button height alignment
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
                                    py: 0.8 // Added explicit alignment matching action sets
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
                    top: 72, // Shifted down to cleanly touch under our updated 72px bar height
                    bottom: 0,
                    left: 0,
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 2,
                    gap: 3,
                    zIndex: 1200
                }}
            >
                <IconButton sx={{ color: '#be123c', borderLeft: '3px solid #be123c', borderRadius: 0, width: '100%', py: 1 }}><HomeIcon /></IconButton>
                <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#fff' } }}><TvIcon /></IconButton>
                <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#fff' } }}><MovieIcon /></IconButton>
                <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#fff' } }}><LiveTvIcon /></IconButton>
                <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#fff' } }}><StarBorderIcon /></IconButton>
                <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#fff' } }}><FavoriteBorderIcon /></IconButton>
                <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#fff' } }}><ExtensionIcon /></IconButton>
                <IconButton sx={{ color: '#6b7280', '&:hover': { color: '#fff' } }}><SportsEsportsIcon /></IconButton>
            </Box>

            {/* 3. Main Content Display Wrapper */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: { xs: '0px', md: '70px' },
                    // Adjusted margin tops perfectly to balance out header heights across viewports
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
                    value={navValue}
                    onChange={(event, newValue) => setNavValue(newValue)}
                    sx={{
                        backgroundColor: '#1f2937',
                        '& .MuiBottomNavigationAction-root': { color: '#9ca3af' },
                        '& .Mui-selected': { color: '#00e676 !important' }
                    }}
                >
                    <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Movie" icon={<MovieIcon />} />
                    <BottomNavigationAction label="TV Show" icon={<TvIcon />} />
                    <BottomNavigationAction label="Games" icon={<SportsEsportsIcon />} />
                    <BottomNavigationAction label="Novel" icon={<BookIcon />} />
                </BottomNavigation>
            </Paper>

        </Box>
    );
}