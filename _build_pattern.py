"""One-shot: build a sparse 5x5 cross pattern SVG and update CSS to use it."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "images" / "ICXC_NIKA.svg"
DST = ROOT / "images" / "ICXC_NIKA_pattern.svg"

# 5x5 grid of cells. Each cell is 260 native units (180-unit cross + 40-unit
# padding on each side). Crosses go in the cells marked X.
#   X . . X .
#   . X . . X
#   . . X . .
#   X . . X .
#   . X . . .
# Edges are arranged so no two crosses end up orthogonally adjacent across the
# tile seam (top<->bottom, left<->right).
GRID = [
    "X . . X .",
    ". X . . X",
    ". . X . .",
    "X . . X .",
    ". X . . .",
]
CELL = 260
PAD = 40  # padding inside each cell, before the cross
COLS = ROWS = 5
TOTAL = CELL * COLS  # 1300

src_text = SRC.read_text(encoding="utf-8")
paths = re.findall(r"<path\s[^>]*?/>", src_text)
assert paths, "no <path> elements extracted"
print(f"extracted {len(paths)} path elements from {SRC.name}")

positions = []
for r, row in enumerate(GRID):
    cells = row.split()
    assert len(cells) == COLS, f"row {r} has {len(cells)} cells, expected {COLS}"
    for c, mark in enumerate(cells):
        if mark == "X":
            positions.append((c * CELL + PAD, r * CELL + PAD))
print(f"placing {len(positions)} crosses")

uses = "\n    ".join(
    f'<use href="#cross" x="{x}" y="{y}"/>' for x, y in positions
)

cross_paths = "\n            ".join(paths)

svg = f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{TOTAL}" height="{TOTAL}" viewBox="0 0 {TOTAL} {TOTAL}">
    <defs>
        <g id="cross">
            {cross_paths}
        </g>
    </defs>
    {uses}
</svg>
"""

DST.write_text(svg, encoding="utf-8")
print(f"wrote {DST}")

# Update CSS in every page: swap to the pattern image and bump tile size.
PAGES = [
    "indexold.html",
    "epikoinonia.html",
    "paidika_tragoudia.html",
    "paidika_paramythia.html",
    "vioi_agion.html",
    "palaia_diathiki.html",
    "kaini_diathiki.html",
    "ekklisiastika_vivlia.html",
    "apokalypseis_erevnes.html",
]
NEW_TILE = 600  # 5 cells * 120px per cell to keep cross visual size unchanged
for fname in PAGES:
    p = ROOT / fname
    text = p.read_text(encoding="utf-8")
    new_text = text.replace(
        'background-image: url("images/ICXC_NIKA.svg");',
        'background-image: url("images/ICXC_NIKA_pattern.svg");',
        1,
    )
    new_text = new_text.replace(
        "background-size: 120px 120px;",
        f"background-size: {NEW_TILE}px {NEW_TILE}px;",
        1,
    )
    if new_text != text:
        p.write_text(new_text, encoding="utf-8")
        print(f"updated CSS in {fname}")
    else:
        print(f"skip {fname}: nothing matched")
