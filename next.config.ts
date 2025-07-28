import type { NextConfig } from "next";
import path from "path";


const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.resolve.alias['@icons'] = path.join(__dirname, 'public/icons');
    config.resolve.alias['@images'] = path.join(__dirname, 'public/images');

    return config;
  },
};

export default nextConfig;
