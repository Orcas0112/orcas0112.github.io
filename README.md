# Twilight Bazaar V9.1.1 — Shiny Surge + Fusion Reborn

An independent, noncommercial browser-local Blook collection simulator. Not affiliated with Blooket. All tokens and rewards remain virtual.

## New in V9.1

**Shiny variants:** After each regular pack selects its Blook using the **unchanged pack odds**, that copy independently has a **0.9%** chance to be Shiny. Shinies are existing Blook images with a gold Shiny presentation, not newly drawn creatures. Each Shiny is a separate copy in `save.v91.shinies`; pack results, opening history, and the collection mark Shiny copies independently. The existing 34 packs and 50-token price remain unchanged.

**Shiny Forge:** Choose a regular non-Mystical Blook with at least three normal copies. Keep one normal copy safe. Spend **two extra copies + 100 Twilight Shards** for **25%** success, **three extra copies + 100 shards** for **40%**, or **four extra copies + 100 shards** for **55%**. Whether successful or not, the spare copies and shards are consumed; the one protected base Blook and all Shiny variants remain safe. The result, total forges and successful forges are saved.

**Fusion Reborn:** Any two **normal, non-Mystical** Blooks, including two of the same Blook when you own enough copies, can be fused. Five published outcome rarities vary with the selected pair. Higher rarity inputs now have progressively higher rarity floors: **Chroma + Chroma guarantees a random Chroma**, while lower-tier combinations have lower jackpot odds. Balanced and Jackpot risk modes and up to three extra booster Blooks remain. Confirm the risk and protect your last regular copies by default. **Mysticals are never ingredients or outcomes**, and **Shiny copies are never consumed by Fusion, trading or salvaging**. The 5 original hard Mystical trials remain unchanged.

## Existing features preserved

- Original themed packs, starter packs and simulator-only archive packs, with no returning fan-made custom packs. All 386 non-Mystical catalog entries remain obtainable through positive-probability pack routes; the other five are the hard original Mystical trials.
- OG published pack probability tables and 50-token prices are not changed by the independent Shiny roll. The simulator-only archive rates are not official Blooket probabilities.
- Admin panel (`Orcas0112` for **local** control; not secure authentication), collection, trade desk, 100-pack opening, image checker and local storage key `twilightBazaarWebSaveV1`.
- Legacy V9 and V6 opening-history records remain compatible. Existing regular owned Blooks are **not** automatically converted to Shiny when updating.

## Install via GitHub Pages

1. In the existing live website, export a backup through **Vault & Settings**.
2. Extract the ZIP and upload **all the files inside**, not the folder/ZIP, to the root of `orcas0112/orcas0112.github.io` on branch `main`.
3. Commit. Keep publishing from **main / (root)**. Visit https://orcas0112.github.io/ and hard-refresh (**Command + Shift + R** on Mac) if the header has an older version.
4. Confirm the header says **V9.1.1 SHINY SURGE**. Check the **Shiny Forge** sidebar tab and **Fusion Lab**.

Local saves are in your browser on the existing website origin; updating files does not erase them. The `.nojekyll` file may be hidden in Finder. Some historic Blook pictures still depend on unavailable remote URLs; Shiny effects do not manufacture missing images.

## Unique Shiny recolors (V9.1.1)
Every non-Mystical Blook has a stable, ID-specific alternate-color treatment. In the Shiny Forge, **Original vs Shiny** previews show the difference before an attempt. Existing downloaded/remote art is recolored in the browser using SVG color matrices (no image downloads or new AI pictures). A separate Shiny copy is saved as before. This is a browser-generated color treatment, not a hand-painted official alternate sprite. If source art is unavailable, the game cannot create a recolor until the link is repaired.
