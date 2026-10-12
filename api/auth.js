/* =========================================================================
   GitHub OAuth — step 1 (Vercel serverless function)
   -------------------------------------------------------------------------
   Decap CMS opens /api/auth in a popup. We redirect to GitHub's authorize
   screen. After the user approves, GitHub sends them to /api/callback.

   Requires env vars (set in Vercel → Settings → Environment Variables):
     OAUTH_GITHUB_CLIENT_ID
     OAUTH_GITHUB_CLIENT_SECRET   (used in callback.js)
   ========================================================================= */

import crypto from "node:crypto";

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("Missing OAUTH_GITHUB_CLIENT_ID environment variable.");
    return;
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/callback`;
  const state = crypto.randomBytes(16).toString("hex");

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", "repo,user"); // repo => commit content
  authorize.searchParams.set("state", state);

  // Short-lived cookie to verify the state on the way back (CSRF guard).
  res.setHeader(
    "Set-Cookie",
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  res.writeHead(302, { Location: authorize.toString() });
  res.end();
}
