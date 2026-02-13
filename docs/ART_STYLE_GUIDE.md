# Art Style Guide – Terraria / Type Night Quality

**For:** Image generation agents (ComfyUI / A1111) and content agents.  
**Goal:** Match Terraria-level pixel art quality and Type Night–style typing-game clarity.

---

## Reference Games

- **Terraria:** 2D pixel art, 16–32px sprites, clear silhouettes, limited palette, beveled UI panels, brown/amber/gold UI.
- **Type Night / typing games:** High readability of text, clear contrast between words and background, retro pixel aesthetic.

---

## Pixel Art Rules

1. **Resolution:** Sprites in multiples of 16 or 32 (e.g. 16x16, 32x32, 32x48). No anti-aliased edges; hard pixels only.
2. **Palette:** Limit to 8–16 colors per sprite. Use a defined palette (e.g. browns, greens, gold, dark outlines).
3. **Outline:** 1px dark outline (#1a120d or similar) for characters and important objects.
4. **Readability:** Words and UI text must be legible at game resolution (min 20px equivalent, high contrast).

---

## UI

- **Panels:** Brown (#3d2e24), darker border (#2d1f17), lighter highlight (#6b5344). Beveled/cornered look.
- **Accent:** Gold/amber (#c9a227) for important actions and titles.
- **Font:** Pixel font (e.g. Press Start 2P) for all in-game and menu text.

---

## Prompts for Image Agents

When generating assets, include in every prompt:

- "pixel art, Terraria style"
- "16x16" or "32x32" (specify size)
- "limited palette, no anti-aliasing, crisp pixels"
- "dark 1px outline"
- For UI: "brown wooden panel, game UI, inventory style"

---

## Asset Checklist (for task queue)

- [ ] Hero sprite (idle, 32x32 or 32x48)
- [ ] Enemy sprites x3 (basic, fast, armored) 24x24 or 32x32
- [ ] Parallax layers: far (mountains), mid (trees/hills), ground strip
- [ ] UI panel texture (tileable, brown)
- [ ] Particle / gold burst sprite (8x8 or 16x16)
- [ ] Icon set for HUD (score, WPM, etc.) 16x16
