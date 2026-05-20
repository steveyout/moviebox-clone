import React from 'react';
import { getMovieDetails } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import MovieDetailDisplay from '@/components/MovieDetailDisplay';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const movie = await getMovieDetails(id);

    if (!movie) {
        return {
            title: 'Movie Not Found',
            description: 'The requested movie catalog listing could not be found on MovieBox Watch.',
        };
    }

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
        : 'https://moviebox.watch/og-default-banner.png';

    const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '2026';

    return {
        title: `${movie.title} (${releaseYear})`,
        description: movie.overview
            ? movie.overview.slice(0, 150) + '... Watch details on MovieBox.'
            : `Watch reviews, statistical metadata, runtime, and trending information for ${movie.title} on MovieBox Watch.`,
        keywords: [
            movie.title?.toLowerCase(),
            `${movie.title?.toLowerCase()} moviebox`,
            `${movie.title?.toLowerCase()} watch`,
            'moviebox watch'
        ],
        openGraph: {
            title: `Watch ${movie.title} (${releaseYear}) | MovieBox`,
            description: movie.overview || `Stream summary reviews and details for ${movie.title} on MovieBox Watch.`,
            type: 'video.movie',
            url: `https://moviebox.watch/movies/${id}`,
            images: [
                {
                    url: backdropUrl,
                    width: 1280,
                    height: 720,
                    alt: `${movie.title} MovieBox Feature Backdrop Overlay`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `Watch ${movie.title} on MovieBox`,
            description: movie.overview,
            images: [backdropUrl],
        },
    };
}

export default async function MovieDetailPage({ params }) {
    const { id } = await params;
    const movie = await getMovieDetails(id);

    if (!movie) {
        notFound();
    }

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : null;

    return <MovieDetailDisplay movie={movie} backdropUrl={backdropUrl} />;
}