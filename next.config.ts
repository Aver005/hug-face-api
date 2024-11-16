import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    publicRuntimeConfig: 
    {
        NEXT_PUBLIC_HF_TOKEN: process.env.NEXT_PUBLIC_HF_TOKEN,
        NEXT_PUBLIC_ENDPOINT_URL: process.env.NEXT_PUBLIC_ENDPOINT_URL,
    },
};

export default nextConfig;
