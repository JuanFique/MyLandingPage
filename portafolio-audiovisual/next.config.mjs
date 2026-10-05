/** @type {import('next').NextConfig} */
const nextConfig = {
  // Incrusta el CSS en el HTML: elimina la hoja externa que bloquea el primer pintado.
  experimental: { inlineCss: true },
  images: {
    // Next solo optimiza imágenes de dominios que le autorices.
    // i.ytimg.com es donde YouTube guarda las miniaturas de los videos
    // (se usa como imagen del reel cuando no hay public/reel/poster.jpg).
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
    ],
  },
};

export default nextConfig;
