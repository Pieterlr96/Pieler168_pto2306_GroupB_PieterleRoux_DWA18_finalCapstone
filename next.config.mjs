/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'content.production.cdn.art19.com',
            
            // port: '',
            // pathname: '/account123/**',
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            // port: '',
            // pathname: '/account123/**',
          },{
            protocol: 'https',
            hostname: 'cdn-icons-png.flaticon.com',

          }
        ],
      },
};

export default nextConfig;
