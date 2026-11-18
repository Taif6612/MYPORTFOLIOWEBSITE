/* Runs in <head> before first paint (a plain blocking script, loaded from this
   file rather than inline so the Content-Security-Policy needs no 'unsafe-inline'). */

/* Hero sky for the visitor's local hour, set before first paint so there's no
   flash before three.js loads. Mirrors the sky column of KEYS in
   src/components/pixelRoom.js; Hero.jsx keeps it current afterwards. */
(function () {
  var d = new Date(), h = d.getHours() + d.getMinutes() / 60, i = 0;
  var k = [[0, "0e1326"], [5, "141a36"], [6.5, "e79a7f"], [9, "8ec2ef"], [15, "86bdf0"], [18, "e98a55"], [19.6, "2a2a55"], [21, "0e1326"], [24, "0e1326"]];
  while (h >= k[i + 1][0]) i++;
  var t = (h - k[i][0]) / (k[i + 1][0] - k[i][0]), L = 0, hex = "#", w = [0.2126, 0.7152, 0.0722];
  for (var c = 0; c < 3; c++) {
    var a = Math.pow(parseInt(k[i][1].substr(c * 2, 2), 16) / 255, 2.2), b = Math.pow(parseInt(k[i + 1][1].substr(c * 2, 2), 16) / 255, 2.2), v = a + (b - a) * t;
    L += w[c] * v; hex += ("0" + Math.round(Math.pow(v, 1 / 2.2) * 255).toString(16)).slice(-2);
  }
  var s = document.documentElement.style;
  s.setProperty("--hero-bg", hex); s.setProperty("--hero-fg", L > 0.18 ? "#14171a" : "#f1ede4");
})();

/* The boot screen (homepage only): see the #boot comment in index.html. Hero calls
   __bootDone once the room has drawn its first frame (or can't run), never sooner
   than 0.9 s and never later than 4.5 s after load. */
(function () {
  if (location.pathname !== "/") return;
  var html = document.documentElement, t0 = Date.now(), ended = false;
  html.classList.add("booting");
  window.__bootDone = function () {
    if (ended) return; ended = true;
    setTimeout(function () {
      var b = document.getElementById("boot"); html.classList.remove("booting");
      if (b) { b.style.display = "grid"; b.classList.add("is-out"); setTimeout(function () { b.remove(); }, 700); }
    }, Math.max(0, 900 - (Date.now() - t0)));
  };
  addEventListener("load", function () { setTimeout(window.__bootDone, 4500); });
})();

/* Vercel Web Analytics queue: calls made before /_vercel/insights/script.js loads are kept and replayed. */
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
