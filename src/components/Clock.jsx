import { useEffect, useRef } from "react";

/* Real-time analog clock showing the VIEWER's local time. Ticks and hands are
   built imperatively so they rotate crisply around the centre; time is read
   from Intl in the visitor's own timezone and updated every second. */
export default function Clock() {
  // Label the clock with the viewer's timezone city (e.g. "NEW YORK").
  const cityLabel = (() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      const city = tz.split("/").pop().replace(/_/g, " ");
      return (city || "Local").toUpperCase();
    } catch {
      return "LOCAL";
    }
  })();

  const wrapRef = useRef(null);
  const ticksRef = useRef(null);
  const handsRef = useRef(null);
  const dayRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const ticksBox = ticksRef.current;
    const handsBox = handsRef.current;
    const dayEl = dayRef.current;
    const numEl = numRef.current;
    if (!wrap || !ticksBox || !handsBox) return;

    // 60 ticks (every 5th major), each in a full-face wrapper rotated about centre
    ticksBox.innerHTML = "";
    for (let i = 0; i < 60; i++) {
      const major = i % 5 === 0;
      const w = document.createElement("div");
      w.style.cssText = `position:absolute;inset:0;transform:rotate(${i * 6}deg)`;
      const t = document.createElement("span");
      t.style.cssText =
        `position:absolute;left:50%;top:0;transform:translateX(-50%);margin-top:6%;` +
        `width:${major ? "2px" : "1px"};height:${major ? "9%" : "4.5%"};border-radius:2px;` +
        `background:${major ? "rgba(21,20,15,.7)" : "rgba(21,20,15,.16)"}`;
      w.appendChild(t);
      ticksBox.appendChild(w);
    }

    // hands
    handsBox.innerHTML = "";
    const mkHand = (width, len, color, z, capRound) => {
      const h = document.createElement("div");
      h.style.cssText =
        `position:absolute;left:${-width / 2}px;bottom:${-width / 2}px;width:${width}px;` +
        `height:${len}px;background:${color};border-radius:${capRound ? width + "px" : "2px"};` +
        `transform-origin:50% calc(100% - ${width / 2}px);transform:rotate(0deg);z-index:${z}`;
      handsBox.appendChild(h);
      return h;
    };
    let R = wrap.clientWidth / 2 || 170;
    const hourH = mkHand(5, R * 0.52, "var(--ink)", 3, true);
    const minH = mkHand(3.5, R * 0.74, "var(--ink)", 4, true);
    const secH = mkHand(2, R * 0.82, "var(--signal)", 5, false);
    const tail = document.createElement("div");
    tail.style.cssText =
      `position:absolute;left:-1px;bottom:-1px;width:2px;height:${R * 0.2}px;background:var(--signal);` +
      `transform-origin:50% calc(100% - 1px);transform:rotate(180deg);z-index:5`;
    handsBox.appendChild(tail);
    const cap = document.createElement("div");
    cap.style.cssText =
      "position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;" +
      "background:var(--signal);box-shadow:0 0 0 3px var(--paper-3);z-index:6";
    handsBox.appendChild(cap);

    // No timeZone option → the viewer's own local time.
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      weekday: "short",
      day: "numeric",
      hour12: false,
    });
    const tick = () => {
      const parts = {};
      fmt.formatToParts(new Date()).forEach((p) => (parts[p.type] = p.value));
      const hh = parseInt(parts.hour, 10) % 12;
      const mm = parseInt(parts.minute, 10);
      const ss = parseInt(parts.second, 10);
      const secDeg = ss * 6;
      const minDeg = mm * 6 + ss * 0.1;
      const hourDeg = hh * 30 + mm * 0.5;
      hourH.style.transform = `rotate(${hourDeg}deg)`;
      minH.style.transform = `rotate(${minDeg}deg)`;
      secH.style.transform = `rotate(${secDeg}deg)`;
      tail.style.transform = `rotate(${secDeg + 180}deg)`;
      if (dayEl) dayEl.textContent = (parts.weekday || "").toUpperCase();
      if (numEl) numEl.textContent = parts.day || "";
    };
    tick();
    const id = setInterval(tick, 1000);

    const onResize = () => {
      R = wrap.clientWidth / 2 || R;
      hourH.style.height = `${R * 0.52}px`;
      minH.style.height = `${R * 0.74}px`;
      secH.style.height = `${R * 0.82}px`;
      tail.style.height = `${R * 0.2}px`;
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      clearInterval(id);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="clock-wrap" ref={wrapRef} aria-label="Your current local time">
      <div className="clock-face">
        <div className="clock-ticks" ref={ticksRef} />
        <div className="clock-date">
          <span className="clock-date-day mono" ref={dayRef}>
            SUN
          </span>
          <span className="clock-date-num mono" ref={numRef}>
            21
          </span>
        </div>
        <span className="clock-city mono">{cityLabel}</span>
        <div className="clock-hands" ref={handsRef} />
      </div>
    </div>
  );
}
