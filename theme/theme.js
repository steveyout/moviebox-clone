'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#be123c', // MovieBox signature rose/red
        },
        background: {
            default: '#111827', // Dark deep backdrop
            paper: '#1f2937',
        },
        text: {
            primary: '#f9fafb',
            secondary: '#9ca3af',
        },
    },
});

export default theme;