/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add webpack configuration to handle external dependencies
  webpack: (config, { isServer}) => {
    // Only apply this change on the server-side build (where Sequelize runs)
    if (isServer) {
      // Tell Next.js/Webpack to exclude the 'pg' module from the bundle
      // and treat it as a Node.js runtime dependency.
      config.externals.push('pg');
      config.externals.push('pg-hstore'); // Good practice to include both
    }

    return config;
  },
};

module.exports = nextConfig;