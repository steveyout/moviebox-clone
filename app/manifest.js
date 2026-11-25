// app/manifest.js

export default function manifest() {
    return {
        name: 'MovieBox - Stream Movies & TV Shows',
        short_name: 'MovieBox',
        description: 'Stream popular movies, TV series, novel adaptations, and trending videos in HD on MovieBox.',
        start_url: '/',
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#00e676',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    };
}
