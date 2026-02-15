import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    reactStrictMode: true,
    compress: true,
    output: "export",
    compiler: {},
    images: {
        unoptimized: true,
    },

    devIndicators: {
        position: "bottom-right",
    },
};

export default nextConfig;
