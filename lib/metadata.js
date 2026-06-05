// lib/metadata.js or src/lib/metadata.js

/**
 * Generates base metadata for media pages
 * @param {Object} media - The movie or TV show data object
 * @param {string} type - 'movie' or 'tv'
 * @returns {Object} Next.js Metadata object
 */
export function generateMetadataBase(media, type = 'movie') {
    if (!media) {
        return {
            title: 'Media Not Found',
            description: 'The requested content could not be found.',
        };
    }

    const title = media.title || media.name || 'Untitled';
    const description = media.overview || `Watch ${title} online.`;
    const backdropPath = media.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path}`
        : null;

    return {
        title: `${title} - Stream App`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'video.movie',
            images: backdropPath ? [{ url: backdropPath }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: backdropPath ? [backdropPath] : [],
        },
    };
}