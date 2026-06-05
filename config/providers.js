// config/providers.js

export const providers = [
    {
        id: 'vidlink',
        name: 'Server 1 (VidLink Pro)',
        baseUrl: 'https://vidlink.pro',
        enabled: true,
    },
    {
        id: 'vidsrc_to',
        name: 'Server 2 (VIP)',
        baseUrl: 'https://vidsrc.to/embed',
        enabled: true,
    },
    {
        id: 'vidnest',
        name: 'Server 3 (VidNest)',
        baseUrl: 'https://vidnest.fun',
        enabled: true,
    },
    {
        id: 'vidfast',
        name: 'Server 3 (VidFast)',
        baseUrl: 'https://vidfast.net',
        enabled: true,
    },
    {
        id: 'videasy',
        name: 'Server 3 (VidEasy)',
        baseUrl: 'https://player.videasy.net',
        enabled: true,
    },
    {
        id: 'vidsrc_me',
        name: 'Server 4 (Vidsrc)',
        baseUrl: 'https://vsembed.ru/embed',
        enabled: true,
    },
    {
        id: 'vidup',
        name: 'Server 5 (Vidup)',
        baseUrl: 'https://vidup.to',
        enabled: true,
    },
    {
        id: 'rivestream',
        name: 'Server 6 (Rive)',
        baseUrl: 'https://rivestream.org/embed',
        enabled: true,
    },
];

export const DEFAULT_PROVIDER_ID = 'videasy';

/**
 * Builds the URL based on media structure and selected server.
 */
export const getEmbedUrl = (
    providerId,
    type,
    tmdbId,
    season = 1,
    episode = 1
) => {
    const selected = providers.find((p) => p.id === providerId);
    if (!selected) return '';

    if (type === 'movie') {
        // Standard movie format: BASE_URL/movie/TMDB_ID
        return `${selected.baseUrl}/movie/${tmdbId}`;
    }

    // General TV Show format: BASE_URL/tv/TMDB_ID/SEASON/EPISODE
    return `${selected.baseUrl}/tv/${tmdbId}/${season}/${episode}`;
};