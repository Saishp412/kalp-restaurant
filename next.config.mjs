/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'b.zmtcdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
