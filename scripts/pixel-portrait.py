# Makes public/room/taif-pixel.png, the pixel portrait that opens when tiny Taif is clicked, from the About photo:
# trace him out of the background, grade it warm and lo-fi, reduce it to an 80-pixel grid and a small palette, outline him.
# python scripts/pixel-portrait.py 80 24, then copy portrait-80.png to public/room/taif-pixel.png
import sys
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter
W = int(sys.argv[1]) if len(sys.argv) > 1 else 64
src = Image.open("C:/Github/MYPORTFOLIOWEBSITE/public/taif-portrait.jpeg").convert("RGB").crop((500, 20, 1260, 860))
POLY = [(300,45),(360,32),(420,40),(470,70),(495,120),(505,175),(500,220),(490,265),(478,310),(465,365),(440,415),(420,450),(440,470),(500,490),(600,520),(655,560),(675,640),(685,840),
        (0,840),(0,560),(60,520),(150,490),(205,468),(232,450),(228,400),(222,330),(212,270),(203,230),(208,180),(218,140),(245,90)]
mask = Image.new("L", src.size, 0); ImageDraw.Draw(mask).polygon(POLY, fill=255)
# a lo-fi grade: a little more contrast, warm highlights, cool violet shadows
im = ImageEnhance.Contrast(src.filter(ImageFilter.MedianFilter(7))).enhance(1.12) # smooth the photo first: cleaner clusters of colour
px = im.load()
for y in range(im.height):
    for x in range(im.width):
        r, g, b = px[x, y]; l = (0.3 * r + 0.59 * g + 0.11 * b) / 255
        hi, lo = max(0, l - 0.55) / 0.45, max(0, 0.45 - l) / 0.45
        r = r + (255 - r) * 0.10 * hi - r * 0.0 * lo + (52 - r) * 0.28 * lo; g = g + (226 - g) * 0.08 * hi + (36 - g) * 0.28 * lo; b = b + (190 - b) * 0.02 * hi + (78 - b) * 0.30 * lo
        px[x, y] = (int(r), int(g), int(b))
# his tee is lilac: the light, greyish pixels of the shirt (below the collar) go onto a lilac ramp by brightness
sp = im.load(); mk = mask.load()
for y in range(470, im.height):
    for x in range(im.width):
        if not mk[x, y]: continue
        r, g, b = sp[x, y]; mx, mn = max(r, g, b), min(r, g, b)
        if mx > 150 and mx - mn < 60:
            l = (0.3 * r + 0.59 * g + 0.11 * b) / 255; lo, hi = (128, 104, 156), (206, 186, 218); k = max(0, min(1, (l - 0.55) / 0.42))
            sp[x, y] = tuple(int(lo[i] + (hi[i] - lo[i]) * k) for i in range(3))
h = round(W * src.height / src.width)
small = im.resize((W, h), Image.LANCZOS)
m = mask.resize((W, h), Image.BOX).point(lambda v: 255 if v > 118 else 0)
small = small.filter(ImageFilter.UnsharpMask(1, 90, 3)) # crisp eyes and smile at pixel size
fillc = small.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
only = Image.composite(small, Image.new("RGB", small.size, (190, 170, 205)), m) # the palette is spent on him, not the backdrop
subj = only.quantize(colors=int(sys.argv[2]) if len(sys.argv) > 2 else 22, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
# the backdrop: dusk in the room's colours, banded like the site's sky, a warm glow where the lamp would be
bg = Image.new("RGB", (W, h)); bp = bg.load()
top, bot, glow = (36, 30, 62), (92, 66, 104), (232, 168, 112)
for y in range(h):
    k = y / (h - 1); k = round(k * 6) / 6
    for x in range(W):
        c = tuple(int(top[i] + (bot[i] - top[i]) * k) for i in range(3))
        dx, dy = (x - W * 0.12) / W, (y - h * 0.3) / h; gk = max(0, 0.55 - (dx * dx + dy * dy) ** 0.5) / 0.55; gk = round(gk * 3) / 3 * 0.25
        bp[x, y] = tuple(int(c[i] + (glow[i] - c[i]) * gk) for i in range(3))
out = Image.composite(subj, bg, m)
# a dark warm outline round him where he meets the backdrop
op = out.load(); mp = m.load(); edge = []
for y in range(h):
    for x in range(W):
        if mp[x, y]: continue
        if any(0 <= x + dx < W and 0 <= y + dy < h and mp[x + dx, y + dy] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): edge.append((x, y))
for x, y in edge: op[x, y] = (30, 20, 34)
out.save(f"portrait-{W}.png"); out.resize((W * 6, h * 6), Image.NEAREST).save(f"portrait-{W}-big.png"); print(W, h, len(edge))
