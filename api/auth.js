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
    res.status(503).send("Sign-in is not available.");
    return;
  }

  const redirectUri = `${process.env.SITE_URL || "https://www.taif.codes"}/api/callback`;
  const state = crypto.randomBytes(16).toString("hex");
  // PKCE (S256): 32 random bytes -> 43 url-safe chars.
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");

  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", "public_repo"); // least privilege: the content repo is public
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("code_challenge", challenge);
  authorize.searchParams.set("code_challenge_method", "S256");

  // Short-lived cookies to verify the state (CSRF guard) and finish PKCE on the way back.
  res.setHeader("Set-Cookie", [
    `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    `oauth_verifier=${verifier}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  ]);
  res.writeHead(302, { Location: authorize.toString() });
  res.end();
}
