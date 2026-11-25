// lib/metadata.js

const BASE_URL = 'https://moviebox.watch';

/**
 * Generates rich SEO metadata for movie and TV show watch pages
 * @param {Object} media - The movie or TV show data object
 * @param {string} type - 'movie' or 'tv'
 * @returns {Object} Next.js Metadata object
 */
export function generateMetadataBase(media, type = 'movie') {
    if (!media) {
        return {
            title: 'Media Not Found | MovieBox Watch',
            description: 'The requested title could not be found on MovieBox.',
        };
    }

    const title = media.title || media.name || 'Untitled';
    const releaseYear = (media.release_date || media.first_air_date || '2026').split('-')[0];
    const isTv = type === 'tv';
    const mediaLabel = isTv ? 'TV Series' : 'Movie';
    const genres = media.genres ? media.genres.map(g => g.name).join(', ') : 'Popular';
    const pageUrl = `${BASE_URL}/watch/${type}/${media.id}`;

    const seoTitle = `Watch ${title} (${releaseYear}) Online Free | ${mediaLabel} - MovieBox`;
    const seoDescription = media.overview
        ? `${title} (${releaseYear}): ${media.overview.slice(0, 155)}... Stream in Full HD on MovieBox with subtitles.`
        : `Stream ${title} (${releaseYear}) ${mediaLabel} online in full HD for free on MovieBox. Watch trailer, view episodes, and read synopsis.`;

    const backdropPath = media.backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path}`
        : `${BASE_URL}/og-default-banner.png`;

    const posterPath = media.poster_path
        ? `https://image.tmdb.org/t/p/w780${media.poster_path}`
        : backdropPath;

    return {
        title: seoTitle,
        description: seoDescription,
        keywords: [
            `watch ${title.toLowerCase()} online`,
            `${title.toLowerCase()} free stream`,
            `watch ${title.toLowerCase()} ${releaseYear}`,
            `${title.toLowerCase()} hd`,
            `${title.toLowerCase()} full ${mediaLabel.toLowerCase()}`,
            'moviebox watch',
            'moviebox pro',
            'free movies online',
            genres.toLowerCase()
        ],
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title: seoTitle,
            description: seoDescription,
            url: pageUrl,
            siteName: 'MovieBox Watch',
            type: isTv ? 'video.tv_show' : 'video.movie',
            images: [
                {
                    url: backdropPath,
                    width: 1280,
                    height: 720,
                    alt: `${title} (${releaseYear}) Banner`,
                },
                {
                    url: posterPath,
                    width: 780,
                    height: 1170,
                    alt: `${title} Poster`,
                }
            ],
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: seoTitle,
            description: seoDescription,
            images: [backdropPath],
            creator: '@MovieBoxWatch',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}
