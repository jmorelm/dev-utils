/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/dev-utils",
    output: "export",
    experimental: {
        externalDir: true
    },
    reactStrictMode: true,
    compress: true,
    poweredByHeader: false,
}

module.exports = nextConfig