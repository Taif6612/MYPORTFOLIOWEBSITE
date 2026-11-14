import { useEffect } from "react";
import { useRouteError } from "react-router-dom";

/* Every deploy renames the page chunks and the static-loader-data files. A tab (or a back-button page) from an
   earlier deploy then asks for files that no longer exist and gets the 404 page where JSON or a script was
   expected: "Unexpected token '<' … is not valid JSON", "Failed to fetch dynamically imported module".
   Those reload once, which picks up the current build and lands on the same URL. Anything else, or a second
   failure within a minute, gets a plain message with a reload link instead of the router's default screen. */
const STALE = /not valid JSON|Unexpected token '<'|dynamically imported module|Importing a module script failed|ChunkLoadError/i;
const KEY = "route-error-reloaded-at";

const reloadedRecently = () => { try { return Date.now() - Number(sessionStorage.getItem(KEY) || 0) < 60_000; } catch { return true; } };

export default function RouteError() {
  const error = useRouteError() as { message?: string } | undefined;
  const stale = STALE.test(String(error?.message ?? error ?? "")) && !reloadedRecently();

  useEffect(() => {
    if (!stale) return;
    try { sessionStorage.setItem(KEY, String(Date.now())); } catch { /* private mode: reload anyway, the check above stops a loop */ }
    window.location.reload();
  }, [stale]);

  if (stale) return null;
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeContent: "center", gap: "1rem", padding: "2rem", textAlign: "center", background: "#f1ede4", color: "#14171a", fontFamily: "Inter, system-ui, sans-serif" }}>
      <p style={{ font: "0.75rem/1.6 Silkscreen, ui-monospace, monospace", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>Something didn’t load</p>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 600 }}>The site was updated while this page was open.</h1>
      <p><a href={typeof window !== "undefined" ? window.location.href : "/"} style={{ color: "#b33a0f", fontWeight: 600 }}>Reload the page</a></p>
    </main>
  );
}
