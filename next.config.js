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
  async headers() {
    return [
      {
        source: "/api/og-screenshot",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
