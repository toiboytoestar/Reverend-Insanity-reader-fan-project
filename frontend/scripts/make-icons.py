"""Generate PWA icons for the Reverend Insanity Reader."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pathlib import Path

OUT = Path(__file__).parent.parent / "public" / "icons"
OUT.mkdir(parents=True, exist_ok=True)

BG = (10, 12, 16, 255)
GLOW = (236, 139, 96, 255)
GOLD = (201, 164, 94, 255)
CREAM = (241, 228, 198, 255)


def find_font(size):
    for path in [
        "/usr/share/fonts/truetype/dejavu/DejaVu-Serif-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def make(size, mono=False, name=None):
    img = Image.new("RGBA", (size, size), BG if not mono else (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx = cy = size // 2

    if not mono:
        # radial orange glow (approximated with concentric alpha circles)
        glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        for r in range(size // 2, 0, -6):
            a = max(0, int(80 * (r / (size / 2)) * 0.35))
            gd.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(GLOW[0], GLOW[1], GLOW[2], a))
        glow = glow.filter(ImageFilter.GaussianBlur(size // 20))
        img = Image.alpha_composite(img, glow)
        draw = ImageDraw.Draw(img)

    # Outer gold ring
    stroke = max(3, size // 60)
    pad = size // 10
    ring_color = GOLD if not mono else (255, 255, 255, 255)
    draw.ellipse((pad, pad, size - pad, size - pad), outline=ring_color, width=stroke)

    # Inner hair-thin ring
    inner_pad = pad + stroke * 2
    inner_color = (GOLD[0], GOLD[1], GOLD[2], 140) if not mono else (255, 255, 255, 140)
    draw.ellipse((inner_pad, inner_pad, size - inner_pad, size - inner_pad),
                 outline=inner_color, width=max(1, stroke // 3))

    # Monogram "R"
    letter = "R"
    font = find_font(int(size * 0.52))
    bbox = draw.textbbox((0, 0), letter, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    text_color = CREAM if not mono else (255, 255, 255, 255)
    draw.text((cx - w / 2 - bbox[0], cy - h / 2 - bbox[1]),
              letter, font=font, fill=text_color)

    out_name = name or f"icon-{size}.png"
    img.save(OUT / out_name, "PNG")
    print(f"wrote {out_name}")


if __name__ == "__main__":
    for s in (192, 256, 384, 512, 1024):
        make(s)
    make(512, mono=True, name="icon-monochrome-512.png")
    # Favicon
    make(64, name="favicon-64.png")
