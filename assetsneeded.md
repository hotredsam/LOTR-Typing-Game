# Assets Needed — LOTR Typing Game

This document specifies the art (and optional audio) assets to create for the visual
upgrade. **Today the game draws everything procedurally** (no image/audio files ship),
so any asset here is a strict improvement. The game already loads these paths and
**falls back to the procedural version if a file is missing**, so you can upload
incrementally and nothing breaks.

---

## Where to upload (exact folders)

Place files in the repo under **`public/assets/<category>/`**. Vite serves `public/`
at the web root, so `public/assets/sprites/hero_32x32.png` loads from
`/assets/sprites/hero_32x32.png` — which is exactly what `src/game/BootScene.ts` requests.

```
public/assets/
  backgrounds/   # parallax layers
  tiles/         # ground/rock tiles
  sprites/       # hero + enemies
  particles/     # spark textures
  ui/            # panel/button/frame skins
  icons/         # HUD icons
  audio/         # optional sound effects + music
```

**Filenames must match exactly** (including the size suffix) — the renderer keys off them.

---

## Art direction

- **Theme:** Lord of the Rings / Middle-earth.
- **Style:** Pixel art, hard edges, **no anti-aliasing**, limited cohesive palette.
- **Tone:** Warm golds + earthy browns to match the existing Terraria-style UI; cool
  blues/greys for distance and night.
- **Format:** **PNG-32 with alpha** unless marked "opaque".
- **Backgrounds & tiles:** must be **seamlessly tileable horizontally** (left edge meets
  right edge) — they repeat across the 800px-wide canvas and scroll for parallax.
- **Readability:** sprites must read clearly at their native small size (no fine detail
  that turns to mush). Sizes are **exact** — please match them.

Priority: **P0** = highest impact, do first → **P2** = nice-to-have.

---

## 1. Backgrounds — `public/assets/backgrounds/`  (P0)

Four parallax layers, far → near. Each tiles horizontally and scrolls at a different speed.

| File | Size (px) | Alpha | Description |
|------|-----------|-------|-------------|
| `bg_sky_256x128.png` | 256 × 128 | Opaque | Farthest layer. Night/dusk sky gradient over Middle-earth with a few faint stars. No hard horizon (other layers sit on top). |
| `bg_far_256x128.png` | 256 × 128 | Transparent | Distant Misty-Mountains ridge silhouette. Fully transparent **above** the ridgeline. Cool blue-grey. |
| `bg_mid_256x160.png` | 256 × 160 | Transparent | Nearer hills / forest treeline silhouette, a bit lighter/greener than `bg_far`. Transparent above the tree line. |
| `bg_near_256x96.png` | 256 × 96 | Transparent | Foreground strip: grass tufts, small rocks along the very bottom. Transparent above the strip. |

> Used in `MainScene.drawParallaxBackground()` as tiled, slow-scrolling layers.

## 2. Tiles — `public/assets/tiles/`  (P1)

| File | Size | Alpha | Description |
|------|------|-------|-------------|
| `ground_32x32.png` | 32 × 32 | Opaque | Seamless grassy-dirt ground tile (Shire green on top, soil below). Repeats across the floor. |
| `rock_32x32.png` | 32 × 32 | Transparent | Optional stone/rock accent that can sit on the ground line. |

## 3. Hero — `public/assets/sprites/`  (P0)

A single small character shown at the bottom-center who reacts to your typing.

| File | Size | Alpha | Description |
|------|------|-------|-------------|
| `hero_32x32.png` | 32 × 32 | Transparent | Idle pose. A ranger or wizard (your call) facing the screen. Feet near the bottom edge. |
| `hero_attack_32x32.png` | 32 × 32 | Transparent | Attack pose (raised sword/staff, small burst). Shown ~150 ms each time a word is completed. Same anchor/size as idle. |
| `hero_hurt_32x32.png` | 32 × 32 | Transparent | Hurt/recoil pose. Shown briefly when a word reaches the floor and a life is lost. |

> Keep the figure consistently positioned across all three frames so swaps don't jump.

## 4. Enemies — `public/assets/sprites/`  (P1)

A small enemy rides just **above** each falling word, themed to the word's category.
Transparent background; should read at small size.

| File | Size | Alpha | Suggested creature | Maps to word category |
|------|------|-------|--------------------|-----------------------|
| `enemy_basic_24x24.png` | 24 × 24 | Transparent | Orc | creature |
| `enemy_fast_24x24.png` | 24 × 24 | Transparent | Goblin / scout | character |
| `enemy_armored_32x32.png` | 32 × 32 | Transparent | Uruk-hai (armored) | place |
| `enemy_mage_24x24.png` | 24 × 24 | Transparent | Dark sorcerer | item |
| `enemy_boss_64x64.png` | 64 × 64 | Transparent | Nazgûl / Balrog | phrases & high levels |

> If you'd rather not theme by category, just make 5 distinct enemies; I'll map them.

## 5. Particles — `public/assets/particles/`  (P0)

Tiny spark textures emitted on events. Centered, soft-ish but still pixel.

| File | Size | Alpha | Use |
|------|------|-------|-----|
| `particle_gold_8x8.png` | 8 × 8 | Transparent | Word-complete burst. |
| `particle_red_8x8.png` | 8 × 8 | Transparent | Miss / danger burst. |
| `particle_white_8x8.png` | 8 × 8 | Transparent | Generic / typing sparkle. |

## 6. UI skins — `public/assets/ui/`  (P2, optional)

9-slice-friendly panel/button art to replace the procedurally drawn panels.

| File | Size | Alpha | Notes |
|------|------|-------|-------|
| `panel_32x32.png` | 32 × 32 | Transparent | 9-slice panel; keep a ~8px non-stretch border. |
| `button_128x32.png` | 128 × 32 | Transparent | Button background (normal state). |
| `frame_64x64.png` | 64 × 64 | Transparent | Optional ornate corner frame. |

## 7. Icons — `public/assets/icons/`  (P2, optional)

| File | Size | Alpha | Use |
|------|------|-------|-----|
| `icon_score_16x16.png` | 16 × 16 | Transparent | HUD score label. |
| `icon_wpm_16x16.png` | 16 × 16 | Transparent | HUD WPM label. |
| `icon_combo_16x16.png` | 16 × 16 | Transparent | HUD combo label. |

## 8. Audio — `public/assets/audio/`  (P2, optional)

Currently all sound is synthesized in-browser. If you provide samples, they'll be
preferred with the synth as fallback. Use `.ogg` or `.mp3`, short and low-bitrate.

| File | Use |
|------|-----|
| `sfx_type.ogg` | Per-keystroke tick (very short, quiet). |
| `sfx_complete.ogg` | Word completed. |
| `sfx_combo.ogg` | Combo milestone. |
| `sfx_miss.ogg` | Wrong key / miss. |
| `sfx_powerup.ogg` | Power-up triggered. |
| `sfx_levelup.ogg` | Level up. |
| `sfx_gameover.ogg` | Game over. |
| `bgm_loop.ogg` | Looping background music (seamless loop). |

---

## Recommended order

1. **P0:** backgrounds (4) + hero (3) + particles (3) — biggest visual jump.
2. **P1:** enemies (5) + ground tile.
3. **P2:** UI skins, icons, audio.

## After you upload

Commit the files to `public/assets/...` on the branch (or hand them to me). I'll wire each
in (`BootScene` already references every filename above) and confirm they render, keeping the
procedural fallback intact. Anything missing simply uses the current procedural version.
</content>
