/* "/" — the existing portfolio homepage.
   <App> is client-only (shaders / Lenis / reveal engine never run in SSR, so
   today's behaviour is preserved exactly). A small <Head> sets the homepage's
   canonical title/description so client-side navigation back from a guide
   restores them, and the pre-rendered shell carries a canonical link. */

import { ClientOnly, Head } from "vite-react-ssg";
import App from "../App.jsx";
import { SITE, absUrl } from "../blog/site";

const TITLE = "Taif Ur Rahman — Front-End Engineer";
const DESCRIPTION =
  "Taif Ur Rahman — front-end engineer building interfaces that watch, adapt, and include. ProctorLess, Senior Mode, and selected front-end work.";

export default function HomeRoute() {
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={absUrl("/")} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={absUrl("/")} />
        <meta property="og:image" content={absUrl(SITE.ogImage)} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={absUrl(SITE.ogImage)} />
      </Head>
      <ClientOnly>{() => <App />}</ClientOnly>
    </>
  );
}

// Lazy-route entry: react-router reads `Component` from the imported module.
export { HomeRoute as Component };
