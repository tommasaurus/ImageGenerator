/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mvmqldluvkkncmorrsno.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "v3.fal.media",
        port: "",
        pathname: "/files/**",
      },
    ],
  },
};

module.exports = nextConfig;
