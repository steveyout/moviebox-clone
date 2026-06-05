import React from 'react';
import ThemeRegistry from '../theme/ThemeRegistry';
import AppLayoutClient from '../components/AppLayoutClient';
import { GoogleAnalytics } from '@next/third-parties/google';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
    metadataBase: new URL('https://moviebox.watch'),
    title: {
        default: 'MovieBox - Watch Popular Movies, TV Series & Streaming Trends',
        template: '%s | MovieBox Watch'
    },
    description: 'Stream trending watch, popular series, novel adaptations, and interactive highlights online on MovieBox. Watch high-quality movie trailers, check ratings, and stay up to date.',
    keywords: [
        'moviebox',
        'moviebox watch',
        'moviebox app',
        'watch watch free',
        'trending series',
        'moviebox stream',
        'popular tv shows'
    ],
    authors: [{ name: 'MovieBox Watch Team' }],
    creator: 'MovieBox Engineering',
    openGraph: {
        title: 'MovieBox - Watch Popular Movies & TV Series Online',
        description: 'Explore the latest trending watch, popular TV series, novel adaptations, and gaming highlights on MovieBox.',
        url: 'https://moviebox.watch',
        siteName: 'MovieBox Watch',
        images: [
            {
                url: '/og-default-banner.png',
                width: 1200,
                height: 630,
                alt: 'MovieBox Watch Premium Media Catalog Layout',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MovieBox - Watch Popular Movies & TV Series',
        description: 'Explore trending media highlights and lookups on MovieBox Watch.',
        images: ['/og-default-banner.png'],
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

export default function RootLayout({ children }) {
    return (
        <html lang="en" style={{ overflowX: 'hidden', height: '100%' }}>
        <body style={{ margin: 0, padding: 0, backgroundColor: '#111827', height: '100%', overflowX: 'hidden' }}>

        {/* Navigation Progress Bar Configuration */}
        <NextTopLoader
            color="#00e676"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #00e676, 0 0 5px #00e676"
        />

        <ThemeRegistry>
            <AppLayoutClient>
                {children}
            </AppLayoutClient>
        </ThemeRegistry>
        </body>

        {/* Google Analytics Global Tag Placement */}
        <GoogleAnalytics gaId="G-LP4N16J7NZ" />
        </html>
    );
}