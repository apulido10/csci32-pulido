/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/api/graphql', destination: 'http://127.0.0.1:4000/api/graphql' },
    ];
  },
};
export default nextConfig;
