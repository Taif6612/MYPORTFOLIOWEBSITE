/* =========================================================================
   GitHub OAuth — step 2 (Vercel serverless function)
   -------------------------------------------------------------------------
   GitHub redirects here with ?code=...  We exchange it for an access token,
   then hand the token to the Decap CMS window via the postMessage handshake.

   The token has `repo` scope, so the handshake only ever talks to this
   site's own origin (where /admin lives): it ignores messages from any other
   origin and never posts the token to "*". Otherwise any page that opened
   /api/auth in a popup could collect the owner's token.
   ========================================================================= */

/** JSON for embedding inside an inline <script>: escape `<` so no string in
    the payload (e.g. an error message) can close the tag. */
const scriptJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

function renderHandshake(origin, status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  // Decap handshake: the popup announces "authorizing:github" to its opener;
  // the CMS echoes it back; the popup then posts the result. Both directions
  // are pinned to this site's origin.
  return `<!doctype html><html><head><meta charset="utf-8" /><title>Authorizing…</title></head>
<body>
<p>${status === "success" ? "Authorized — you can close this window." : "Authorization failed."}</p>
<script>
  (function () {
    var origin = ${scriptJson(origin)};
    var message = ${scriptJson(message)};
    if (!window.opener) return;
    function receiveMessage(e) {
      if (e.origin !== origin || e.source !== window.opener || e.data !== "authorizing:github") return;
      window.removeEventListener("message", receiveMessage, false);
      window.opener.postMessage(message, origin);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", origin);
  })();
</script>
</body></html>`;
}

export default async function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  const { code, state } = req.query || {};

  // /admin is served from the same host as this function (Vercel routes the
  // apex to www before either runs), so our own origin is the CMS origin.
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const origin = `${proto}://${host}`;
  const reply = (status, httpStatus, content) =>
    res.status(httpStatus).send(renderHandshake(origin, status, content));

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // The state cookie is single-use: expire it whatever the outcome.
  res.setHeader("Set-Cookie", "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");

  if (!clientId || !clientSecret) {
    reply("error", 500, { message: "Missing OAuth env vars on the server." });
    return;
  }
  if (!code) {
    reply("error", 400, { message: "Missing authorization code." });
    return;
  }

  // CSRF: the state GitHub echoes back must match the cookie set by /api/auth.
  // Both must be present — a missing cookie or param is a failure, not a pass.
  const saved = /(?:^|;\s*)oauth_state=([^;]+)/.exec(req.headers.cookie || "");
  if (!saved || !state || saved[1] !== state) {
    reply("error", 400, { message: "Invalid or expired OAuth state. Please try logging in again." });
    return;
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = await tokenRes.json();

    if (data.access_token) {
      reply("success", 200, { token: data.access_token, provider: "github" });
    } else {
      reply("error", 401, {
        message: data.error_description || "GitHub did not return an access token.",
      });
    }
  } catch (err) {
    reply("error", 500, { message: String(err) });
  }
}
