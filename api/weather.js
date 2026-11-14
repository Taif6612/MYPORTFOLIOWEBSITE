/* =========================================================================
   Live weather in Dhaka for the hero's pixel room (Vercel serverless function)
   -------------------------------------------------------------------------
   The room rains when it is raining in Dhaka. Open-Meteo needs no key; the
   edge caches this answer for 10 minutes, so visitors never call it directly
   and the page's CSP stays 'self' only.
   ========================================================================= */

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=precipitation,weather_code,cloud_cover&timezone=Asia%2FDhaka";

// WMO weather codes: 51-67 drizzle and rain, 80-82 showers, 95-99 thunderstorms
export const isRaining = ({ precipitation = 0, weather_code: code = 0 }) =>
  precipitation > 0 || (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;

export default async function handler(req, res) {
  try {
    const r = await fetch(OPEN_METEO, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) throw new Error(`open-meteo ${r.status}`);
    const { current: c } = await r.json();
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=1800");
    res.status(200).json({ rain: isRaining(c), code: c.weather_code, cloud: c.cloud_cover, at: c.time });
  } catch (e) {
    console.error("weather:", e);
    res.setHeader("Cache-Control", "public, s-maxage=60");
    res.status(502).json({ rain: null });
  }
}
