import React from 'react';
import { getTrendingMovies } from '../lib/tmdb';
import MovieGridDisplay from '../components/MovieGridDisplay';

export default async function HomePage() {
    // 1. Fetch data on the server side instantly
    const movies = await getTrendingMovies();

    // 2. Safely feed the pure data to the client-rendering component
    return <MovieGridDisplay movies={movies} />;
}
