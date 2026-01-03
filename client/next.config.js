/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // Trust Cloudflare proxy headers
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    // Handle headers for Cloudflare proxy
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
    // Ensure proper handling of domain
    async rewrites() {
        return [];
    },
    // Configure for Cloudflare proxy
    poweredByHeader: false,
    compress: true,
};

module.exports = nextConfig;