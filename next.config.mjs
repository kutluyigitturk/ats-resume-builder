/** @type {import('next').NextConfig} */
const nextConfig = {
  // @sparticuz/chromium resolves its binary from import.meta.url, which the
  // build's static file tracing cannot follow - so the 60MB Chromium archive
  // was left out of the deployed function and every PDF export failed there
  // while working locally. Naming the directory puts it back in the bundle.
  outputFileTracingIncludes: {
    "/api/generate-pdf": [
      "./node_modules/@sparticuz/chromium/bin/**",
      // Read by path at request time, so tracing cannot infer these either.
      "./assets/pdf-fonts/*.woff2",
    ],
  },

  // The framework version is not something visitors need to know.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop a browser from second-guessing a declared content type.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the origin to other sites, never the full path someone was on.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here needs a camera, a microphone or a location.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
