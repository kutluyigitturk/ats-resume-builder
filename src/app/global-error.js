"use client";

import { useEffect } from "react";

// The last resort: this replaces the root layout, so it runs when even the
// error boundary above could not render. Nothing from the app is available
// here - no fonts, no stylesheet, no components - so it carries its own
// document and its own styles inline.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Root layout failed:", error?.digest ?? error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background: "#f6f6f4",
          color: "#0b1220",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            background: "#fff",
            border: "1px solid #e6e6e3",
            borderRadius: "16px",
            padding: "36px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "25px", fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
            The app did not start
          </h1>
          <p
            style={{
              fontSize: "14.5px",
              lineHeight: 1.6,
              color: "#5b6472",
              margin: "6px 0 24px",
            }}
          >
            Something failed before the page could be built. Reload to try again — nothing you saved
            has been lost.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              height: "47px",
              width: "100%",
              border: "none",
              borderRadius: "12px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
