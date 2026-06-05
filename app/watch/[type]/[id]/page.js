// ./app/watch/[type]/[id]/page.js

import React from 'react';
import { notFound } from 'next/navigation';
import { getMediaDetails } from '@/lib/tmdb';
import MoviePlayerDisplay from '@/components/MoviePlayerDisplay';
import { generateMetadataBase } from '@/lib/metadata';

// Supported media mappings
const VALID_TYPES = ['movie', 'tv'];

/**
 * Dynamically generates page metadata by safely resolving contextual parameters
 * and pulling real-time media specifications from TMDB.
 */
export async function generateMetadata({ params }) {
    // Safely resolve the async params object (Required in Next.js 15+)
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    const type = resolvedParams?.type;

    // Guard clause for missing or malformed route elements
    if (!id || isNaN(Number(id)) || !VALID_TYPES.includes(type)) {
        return { title: 'Invalid Media Request' };
    }

    const media = await getMediaDetails(id, type);

    if (!media) {
        return { title: 'Content Not Found' };
    }

    return generateMetadataBase(media, type);
}

/**
 * Server Component responsible for fetching structural media data (Movie or TV Series)
 * and passing down clean attributes to the responsive playback component.
 */
export default async function MediaWatchPage({ params }) {
    // Safely resolve the async params object to extract parameters cleanly
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    const type = resolvedParams?.type;

    // Reject early if parameters fail structure or routing validations
    if (!id || isNaN(Number(id)) || !VALID_TYPES.includes(type)) {
        notFound();
    }

    // Fetch details directly on the server side (getMediaDetails automatically loads seasons if type === 'tv')
    const mediaItem = await getMediaDetails(id, type);

    // Handle missing entries or backend communication drops immediately
    if (!mediaItem) {
        notFound();
    }

    // Hand over server-side data directly to your client presentation layer
    return <MoviePlayerDisplay media={mediaItem} mediaType={type} />;
}