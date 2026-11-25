// lib/schema.js
/**
 * Structured Data (Schema.org / JSON-LD) Generators for Search Engines
 * Used for rich snippets, star ratings, carousel listings, and sitelinks search.
 */

const BASE_URL = 'https://moviebox.watch';

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MovieBox Watch',
        url: BASE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

export function generateBreadcrumbSchema(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${BASE_URL}${item.url}`,
        })),
    };
}

export function generateMediaSchema(media, type = 'movie') {
    if (!media) return null;

    const title = media.title || media.name || 'Untitled';
    const isTv = type === 'tv';
    const releaseDate = media.release_date || media.first_air_date;
    const posterUrl = media.poster_path
        ? `https://image.tmdb.org/t/p/w780${media.poster_path}`
        : `${BASE_URL}/og-default-banner.png`;
    const ratingValue = media.vote_average ? Number(media.vote_average.toFixed(1)) : null;
    const ratingCount = media.vote_count || 100;

    const director = media.credits?.crew?.find(c => c.job === 'Director');
    const actors = media.credits?.cast?.slice(0, 5).map(a => ({
        '@type': 'Person',
        name: a.name,
    }));

    const genres = media.genres ? media.genres.map(g => g.name) : [];

    const schema = {
        '@context': 'https://schema.org',
        '@type': isTv ? 'TVSeries' : 'Movie',
        name: title,
        description: media.overview || `Watch ${title} online in HD on MovieBox.`,
        image: posterUrl,
        datePublished: releaseDate,
        inLanguage: media.original_language || 'en',
        genre: genres,
    };

    if (ratingValue && ratingValue > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: ratingValue,
            bestRating: '10',
            worstRating: '1',
            ratingCount: ratingCount,
        };
    }

    if (director) {
        schema.director = {
            '@type': 'Person',
            name: director.name,
        };
    }

    if (actors && actors.length > 0) {
        schema.actor = actors;
    }

    if (isTv && media.number_of_seasons) {
        schema.numberOfSeasons = media.number_of_seasons;
        schema.numberOfEpisodes = media.number_of_episodes;
    }

    return schema;
}

export function generateFAQSchema(media) {
    if (!media) return null;
    const title = media.title || media.name || 'this title';
    const releaseYear = (media.release_date || media.first_air_date || '2026').split('-')[0];

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `Where can I stream ${title} online for free?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `You can stream ${title} (${releaseYear}) in high definition online directly on MovieBox with multiple high-speed servers and subtitles.`,
                },
            },
            {
                '@type': 'Question',
                name: `Is ${title} available in HD quality?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Yes, ${title} is available in full 1080p and 720p HD streaming with crisp audio and adaptive bitrate switching.`,
                },
            },
            {
                '@type': 'Question',
                name: `What is the release year and rating for ${title}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${title} was released in ${releaseYear} with an audience score of ${media.vote_average ? media.vote_average.toFixed(1) : '8.0'}/10.`,
                },
            },
        ],
    };
}
