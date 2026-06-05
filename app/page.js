import React from 'react';
import {
    getTrendingMovies,
    getTrendingTvShows,
    getPopularMovies,
    getPopularTvShows // Imported alongside your active data tools
} from '../lib/tmdb';
import MovieGridDisplay from '../components/MovieGridDisplay';
import HeroBanner from '../components/HeroBanner';

export default async function HomePage() {
    // Parallel fetching on the server side keeps load times ultra-fast
    const [trendingMovies, trendingTvShows, popularMovies, popularTvShows] = await Promise.all([
        getTrendingMovies(),
        getTrendingTvShows(),
        getPopularMovies(),
        getPopularTvShows(),
    ]);

    const featuredMovies = trendingMovies.slice(0, 6);

    return (
        <>
            <HeroBanner featuredMovies={featuredMovies} />
            <MovieGridDisplay
                trendingMovies={trendingMovies}
                trendingTvShows={trendingTvShows}
                popularMovies={popularMovies}
                popularTvShows={popularTvShows} // Passed as a clean dataset prop
            />
        </>
    );
}