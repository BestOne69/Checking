/** @type {import('next').NextConfig} */

// VIBEGUARD TEST FIXTURE
// BUG #10 (planted): wildcard CORS header applied to ALL API routes.
// This means any website on the internet can make authenticated
// requests to this app's API from JavaScript running on a completely
// different domain — a common copy-pasted "fix" for local CORS errors
// during development that never gets removed before shipping.

const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

// A correctly configured version restricts origin to a known domain:
//   { key: "Access-Control-Allow-Origin", value: "https://shopgram.in" }
