#!/usr/bin/env python3
import argparse
from PIL import Image, ImageDraw, ImageFont

W, H = 1536, 864
LEFT = 78
TEXT_MAX_X = 790
TITLE_TOP = 330
TITLE_BOTTOM = 610

REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def font(path, size):
    return ImageFont.truetype(path, size=size)

def fit_title(draw, title):
    words = title.split()
    best = None
    for i in range(1, len(words)-1):
        for j in range(i+1, len(words)):
            lines = [" ".join(words[:i]), " ".join(words[i:j]), " ".join(words[j:])]
            if not all(lines):
                continue
            for size in range(66, 43, -1):
                f = font(BOLD, size)
                widths = [draw.textbbox((0,0), line, font=f)[2] for line in lines]
                line_h = int(size * 1.16)
                total_h = line_h * 3
                if max(widths) <= (TEXT_MAX_X - LEFT) and TITLE_TOP + total_h <= TITLE_BOTTOM:
                    score = max(widths) + (max(widths)-min(widths))*0.35 - size*4
                    cand = (score, size, line_h, lines)
                    if best is None or cand[0] < best[0]:
                        best = cand
                    break
    if best:
        return best[1], best[2], best[3]

    size = 46
    f = font(BOLD, size)
    lines, current = [], ""
    for word in words:
        trial = (current + " " + word).strip()
        if current and draw.textbbox((0,0), trial, font=f)[2] > (TEXT_MAX_X-LEFT):
            lines.append(current)
            current = word
        else:
            current = trial
    if current: lines.append(current)
    return size, int(size*1.16), lines[:3]

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--output", required=True)
    p.add_argument("--title", required=True)
    p.add_argument("--category", required=True)
    p.add_argument("--content-type", required=True)
    p.add_argument("--tagline", required=True)
    a = p.parse_args()

    im = Image.open(a.input).convert("RGB").resize((W,H), Image.Resampling.LANCZOS)

    # Dark left gradient: strong enough for text, fades before hero object.
    overlay = Image.new("RGBA", (W,H), (0,0,0,0))
    px = overlay.load()
    for x in range(W):
        if x < 610:
            alpha = 224
        elif x < 930:
            alpha = int(224 * (1 - (x-610)/320))
        else:
            alpha = 0
        for y in range(H):
            px[x,y] = (4, 13, 27, alpha)
    im = Image.alpha_composite(im.convert("RGBA"), overlay)

    draw = ImageDraw.Draw(im)

    # Category pill
    cat_font = font(BOLD, 28)
    cat_w = draw.textbbox((0,0), a.category, font=cat_font)[2]
    pill_w = max(250, cat_w + 100)
    pill = (LEFT, 92, LEFT + pill_w, 162)
    draw.rounded_rectangle(pill, radius=35, fill=(76,39,22,238), outline=(153,76,31,210), width=2)
    # compact shield glyph
    sx, sy = LEFT+26, 108
    shield = [(sx+16,sy),(sx+32,sy+7),(sx+32,sy+24),(sx+16,sy+39),(sx,sy+24),(sx,sy+7)]
    draw.line(shield+[shield[0]], fill=(255,181,84,255), width=4, joint="curve")
    draw.line([(sx+8,sy+20),(sx+14,sy+27),(sx+25,sy+13)], fill=(255,181,84,255), width=4)
    draw.text((LEFT+72,111), a.category, font=cat_font, fill=(255,211,164,255))

    # Editorial label
    label_font = font(BOLD, 24)
    label = f"TEKNOPRAKTIS  ·  {a.content_type.upper()}"
    draw.text((LEFT, 252), label, font=label_font, fill=(165,189,225,255))

    # Balanced title
    title_size, line_h, lines = fit_title(draw, a.title)
    title_font = font(BOLD, title_size)
    y = TITLE_TOP
    for line in lines:
        draw.text((LEFT, y), line, font=title_font, fill=(255,255,255,255), stroke_width=0)
        y += line_h

    # Tagline
    draw.rounded_rectangle((LEFT, 696, LEFT+112, 701), radius=2, fill=(249,115,22,255))
    tag_font = font(REGULAR, 28)
    max_tag_w = 660
    tag = a.tagline
    if draw.textbbox((0,0), tag, font=tag_font)[2] > max_tag_w:
        tag_font = font(REGULAR, 25)
    draw.text((LEFT, 737), tag, font=tag_font, fill=(198,211,231,255))

    im.convert("RGB").save(a.output, "WEBP", quality=92, method=6)

if __name__ == "__main__":
    main()
