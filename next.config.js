/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/dev-utils",
    output: "export",
    experimental: {
        externalDir: true
    },
    reactStrictMode: true,
}

module.exports = nextConfig