/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.map$/,
      use: "ignore-loader",
    })
    return config
  },
  images: {
    domains: ["images.unsplash.com"],
  },
}

module.exports = nextConfig
