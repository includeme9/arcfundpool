/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@arcfundpool/config",
    "@arcfundpool/types",
    "@arcfundpool/utils",
    "@arcfundpool/validation",
    "@arcfundpool/web3",
    "@arcfundpool/ui"
  ]
};

export default nextConfig;
