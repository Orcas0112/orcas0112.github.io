# Twilight Bazaar V9.2 — The Variant Era

An independent, browser-local, noncommercial collector simulator. Not affiliated with Blooket. No purchases, cash-out, or real-money wagering. **All six collectible variant types now exist in one release**: Shiny, Shadow, Glitched, Golden, Prismatic, and Ascended.

## Pack variant chances

Each pack first chooses an existing Blook using that pack's **unchanged Blook probability table**. Then eligible pulls receive **one separate variant roll**. The roll does not change which Blook or rarity was selected.

| Variant | Chance per eligible pack pull | Approx. frequency |
|---|---:|---:|
| Shiny | 0.90% | 1 in 111 |
| Shadow | 0.20% | 1 in 500 |
| Glitched | 0.15% | 1 in 667 |
| Golden | 0.08% | 1 in 1,250 |
| Prismatic | 0.02% | 1 in 5,000 |
| Normal | 98.65% | remainder |
| Ascended | 0% | Forge-only |

**The percentages in the table are simulator variant chances, not official Blooket rates.** The outcomes are mutually exclusive per pull. Ascended is not found in ordinary packs. The 5 original Mysticals are still obtained by their Event Hall trials, not from packs.

## Appearance

- **Shiny**: Blook-specific alternate coloring, as in V9.1.2, with a subtle light sweep. *Not universally gold.*
- **Shadow**: darker violet-tinted recolor, dark background, glowing aura.
- **Glitched**: corrupted alternate tint with cyan/magenta edge separation and scanning distortion.
- **Golden**: consistent metallic gold recolor (a separate variant, just as requested).
- **Prismatic**: a colorful spectral reframing and animated hue effects.
- **Ascended**: luminous awakening treatment and distinct aura, only earned through the Forge.

These are **browser-applied recolor effects on the existing Blook images**, not hand-painted sprites or newly generated characters. If an original Blook picture URL is broken, its variants cannot show an accurate recolor until the original link is fixed. Nothing is misrepresented as official variant artwork.

## Variant Vault and Forge

Open **Variant Vault** in the sidebar. Preview Original vs any of the six variants for any catalog Blook (Mysticals can preview Ascended only). Use the owned-only switch to see your actual variant copies. The collection counts regular copies and all variants separately; variants remain protected from the older sell, trade, and rarity-fusion mechanisms.

Forge requires a chosen Blook and spare **regular** copies; your last regular copy stays safe. A failed roll only consumes the shown extras and resources. Forge chance and costs are displayed before confirmation.

| Variant | Standard spare copies | Shards | Chance with standard / +1 / +2 extras |
|---|---:|---:|---|
| Shiny | 2 | 100 | 25% / 40% / 55% |
| Shadow | 2 | 200 | 22% / 36% / 50% |
| Glitched | 3 | 350 | 16% / 28% / 40% |
| Golden | 4 | 600 | 10% / 18% / 26% |
| Prismatic | 5 | 900 | 6% / 12% / 18% |
| Ascended (non-Mystical) | 6 | 1,800 + 75 Event Seals | 100%, requires owning a Shiny copy |
| Ascended (Mystical) | 0 | 2,000 + 500 Event Seals | 100%, requires owning original Mystical; once per Mystical |

For Ascended, the original Blook (including a required Shiny or Mystical) is **never consumed**. Neither Ascended form has a random pack probability. The separate classic **Shiny Forge** tab still works.

## Fusion and existing features

All old regular rarity fusion works: any two owned regular non-Mystical Blooks, optional boosters and Balanced/Jackpot modes, with higher-rarity reward floors and normal Blook pools. **Mysticals cannot be sacrificed** and neither can Shiny, Shadow, Glitched, Golden, Prismatic, or Ascended variants. The five original difficult Mystical trials are unchanged.

Original 34 pack roster, 50-token prices, bulk opening (including 100), opening history, admin panel, image checker, collection, rewards, trading, achievements and save backups are preserved. Fan-made custom packs are **not** restored.

## Save compatibility

The original local save key `twilightBazaarWebSaveV1` is unchanged. Old V9.1 Shiny copies stay in `save.v91.shinies`. Five new types are stored in `save.v92.types`, with attempts and results. Old opening history remains compatible; new sessions also save a per-pull `variants` field. Variants are not automatically awarded for previously opened packs. Export your old save before updating.

The admin password affects only your local browser game; it is **not secure** authentication on public static GitHub Pages.

## Updating GitHub Pages

1. In the existing website, go to Vault & Settings and **Export Save**.
2. Extract the complete ZIP. Upload **all files inside** (not the ZIP, nor a nested folder) to the repository root at `github.com/orcas0112/orcas0112.github.io`, branch `main`, replacing matching filenames. Commit your changes.
3. Keep Settings → Pages set to `main / (root)`. Visit `https://orcas0112.github.io/` and force refresh on Mac using Command + Shift + R.
4. Confirm header says **V9.2 ALL VARIANTS**, then open **Variant Vault**.

You do **not** need to delete old website files to install this release.
