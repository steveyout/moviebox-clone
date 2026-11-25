// app/search/page.js
import React from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import { searchMedia } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import SearchIcon from '@mui/icons-material/Search';

export async function generateMetadata({ searchParams }) {
    const resolvedParams = await searchParams;
    const query = resolvedParams?.q || '';

    if (query) {
        return {
            title: `Search results for "${query}" | MovieBox Watch`,
            description: `Stream movies and TV shows matching "${query}" online free on MovieBox.`,
            robots: { index: false, follow: true }, // Standard SEO practice for internal search pages to prevent thin duplicate content
        };
    }

    return {
        title: 'Search Movies & TV Shows | MovieBox Watch',
        description: 'Search and find any movie or TV series online on MovieBox.',
    };
}

export default async function SearchPage({ searchParams }) {
    const resolvedParams = await searchParams;
    const query = resolvedParams?.q || '';
    const results = query ? await searchMedia(query) : [];

    return (
        <Box sx={{ pb: 8, pt: 3 }}>
            <Container maxWidth="xl" sx={{ px: { xs: 2.5, md: 6 } }}>
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' }, color: '#fff', mb: 1 }}
                    >
                        {query ? `Search Results for "${query}"` : 'Search MovieBox'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                        {query
                            ? `Found ${results.length} title${results.length === 1 ? '' : 's'} matching your search.`
                            : 'Enter a movie title, TV show, or actor name in the search bar above.'}
                    </Typography>
                </Box>

                {results.length > 0 ? (
                    <Grid container spacing={2.5}>
                        {results.map((item) => (
                            <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                                <MovieCard movie={item} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            px: 2,
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 60, color: '#4b5563', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mb: 1 }}>
                            {query ? 'No matching titles found' : 'Ready to search'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#9ca3af', maxWidth: '450px', mx: 'auto' }}>
                            {query
                                ? 'Try checking your spelling or searching with alternative keywords like actor names or general terms.'
                                : 'Use the search box above to discover thousands of movies and TV shows instantly.'}
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
