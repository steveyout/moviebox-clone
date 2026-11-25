// ./app/watch/[type]/[id]/page.js

import React from 'react';
import { notFound } from 'next/navigation';
import { getMediaDetails } from '@/lib/tmdb';
import MoviePlayerDisplay from '@/components/MoviePlayerDisplay';
import { generateMetadataBase } from '@/lib/metadata';
import { generateMediaSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';

// Supported media mappings
const VALID_TYPES = ['movie', 'tv'];

/**
 * Dynamically generates page metadata by safely resolving contextual parameters
 * and pulling real-time media specifications from TMDB.
 */
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    const type = resolvedParams?.type;

    if (!id || isNaN(Number(id)) || !VALID_TYPES.includes(type)) {
        return { title: 'Invalid Media Request | MovieBox' };
    }

    const media = await getMediaDetails(id, type);

    if (!media) {
        return { title: 'Content Not Found | MovieBox' };
    }

    return generateMetadataBase(media, type);
}

/**
 * Server Component responsible for fetching structural media data (Movie or TV Series),
 * assembling JSON-LD schemas for search engines, and rendering the rich player experience.
 */
export default async function MediaWatchPage({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    const type = resolvedParams?.type;

    if (!id || isNaN(Number(id)) || !VALID_TYPES.includes(type)) {
        notFound();
    }

    const mediaItem = await getMediaDetails(id, type);

    if (!mediaItem) {
        notFound();
    }

    const title = mediaItem.title || mediaItem.name || 'Untitled';
    const isTv = type === 'tv';

    // JSON-LD Structured Data
    const mediaJsonLd = generateMediaSchema(mediaItem, type);
    const faqJsonLd = generateFAQSchema(mediaItem);
    const breadcrumbJsonLd = generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: isTv ? 'TV Series' : 'Movies', url: isTv ? '/tv' : '/movies' },
        { name: title, url: `/watch/${type}/${id}` },
    ]);

    return (
        <>
            {mediaJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(mediaJsonLd) }}
                />
            )}
            {breadcrumbJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
                />
            )}
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <MoviePlayerDisplay media={mediaItem} mediaType={type} />
        </>
    );
}
