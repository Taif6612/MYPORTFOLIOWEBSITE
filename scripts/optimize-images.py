"""Generate the WebP images the site actually serves, from the original sources.

    npm run images        (= python scripts/optimize-images.py)

Editable originals live OUTSIDE public/ (in assets-src/) so they're never
deployed; this writes the sized WebP files the site references into public/.
Re-run after adding or replacing a screenshot / photo. Needs Pillow
(`pip install pillow`).

  assets-src/shots/<id>.jpg   -> public/projects/shots/<id>-800.webp, -1440.webp  (plate posters)
  assets-src/logos/<name>.png -> public/projects/<name>.webp at display size       (logo cards)
  public/taif-portrait.jpeg   -> public/taif-portrait-480.webp, -960.webp         (About)

The portrait original stays in public/ because it's also the og:image.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src"
PUBLIC = ROOT / "public"


def save_webp(im: Image.Image, out: Path, width: int, quality: int = 80, lossless: bool = False) -> None:
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, "WEBP", quality=quality, method=6, lossless=lossless)
    print(f"  {out.relative_to(ROOT)}  {im.width}x{im.height}  {out.stat().st_size // 1024} KB")


def main() -> None:
    print("plate posters")
    for src in sorted((SRC / "shots").glob("*.jpg")):
        im = Image.open(src).convert("RGB")
        for w in (800, 1440):
            save_webp(im, PUBLIC / "projects" / "shots" / f"{src.stem}-{w}.webp", w, quality=78)

    print("logo cards")
    # Logo cards render at most 230px wide (see .plate-logocard img) -> 2x = 460.
    for src in sorted((SRC / "logos").glob("*.png")):
        im = Image.open(src).convert("RGBA")
        small = im.width <= 160  # tiny icons compress best losslessly
        save_webp(im, PUBLIC / "projects" / f"{src.stem}.webp", 460, quality=90, lossless=small)

    print("portrait")
    src = PUBLIC / "taif-portrait.jpeg"
    im = Image.open(src).convert("RGB")
    for w in (480, 960):
        save_webp(im, PUBLIC / f"{src.stem}-{w}.webp", w, quality=80)


if __name__ == "__main__":
    main()
