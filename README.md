# Twilight Bazaar V9.0 — Fusion Machine

A browser-local Blook collection simulator, independently developed and not affiliated with Blooket or Blacket. No real money, no accounts, and no transfer of Blooks to an official account.

## New: Fusion Lab (V9.0)

Combine **any owned Rare + any owned Epic** and sacrifice both for **one random existing Blook**. Fusion does **not** create new artwork or hybrid Blooks. The odds are visible before confirming the fusion:

| Category | Chance |
| --- | ---: |
| Random Rare | 50% |
| Random Epic | 35% |
| Other Legendary (not King) | 9.8% |
| King | 5% |
| Random Chroma | 0.2% |
| **Total** | **100%** |

The reward is drawn uniformly from eligible Blooks in that category; eligible candidates come from existing regular Market pack tables with positive published snapshot rates, excluding simulator-only packs, starter galleries, special packs, Mysticals, and unreleased/archive-only references. These are **Twilight Bazaar-only fusion probabilities**, not official pack probabilities.

- Last-copy protection is **on by default**; unchecking it requires confirmation before a last copy is consumed.
- No token cost to fuse. Both ingredients are removed; one result is added to inventory.
- Each fusion is saved, along with up to 40 recent log entries, inside the original JSON save.
- Only **Rare + Epic** is enabled in V9.0. Further recipe tiers were planned for V9.1 but are **not included yet**.
- Existing OG pack odds, 50-token pack cost, 100-pack opening, 5 original hard Mystical trials, and save format are maintained.

## New: Local Admin Panel

Open **Admin panel** from the left navigation and enter the password provided by the project owner. Admin controls allow:

- Setting this browser's token, shard, and Event Seal balances.
- Granting 1–100 copies of existing **non-Mystical** Blooks.
- Locking the admin controls again without leaving the game.

**Critical security limitation:** This is a *cosmetic / casual-access gate only*. GitHub Pages serves its HTML and JavaScript publicly. Visitors can inspect client-side passwords, modify code and browser storage, and change their own saved game. This feature does **not** provide private authenticated administration or centrally control other players. For actual server-side admin authentication, the site would need a backend and authenticated storage, not static GitHub Pages alone.

## Archived custom packs

The fan-made V8 simulator packs and three previous original illustrated packs are hidden from the active pack shop **by default**. No owned Blooks, pack history, previous progress, or the original artwork files are deleted. In **Vault & settings → Archived fan packs**, turn on **Show archived simulator packs** to reopen old packs and continue legacy Mystical trials. Turn it off again to show the OG pack wall.

## Save compatibility

The local storage key remains `twilightBazaarWebSaveV1`, JSON version `1`. V9 only adds the optional `v9` object for `total`, `history`, and `showArchived`. Earlier saves without `v9` load normally; prior save fields remain valid. Export a backup from **Vault & settings** before publishing.

Browser saves are associated with the **specific site URL and browser**. Switching site origins requires Export/Import.

## GitHub Pages update

Upload **every individual file inside** this ZIP to the repository root (`orcas0112.github.io` → `main`). In GitHub, use **Add file → Upload files**, then commit. Include both `v9.js` and `v9.css`, the unchanged older scripts/styles, `.nojekyll`, and all the existing `tb83-*.svg` legacy artwork. Don't change your Pages settings or place these files in a nested folder. The main entry point is `index.html`.

## Tested

Headless Chromium desktop 1440px and mobile 390px with simulated local storage: entrance, fusion options, last-copy protection and explicit confirmation, consumption of both inputs, 5-way table, forced Chroma-branch reward, persistence across simulated reload, wrong/correct admin password, balance changes, Blook grant, admin lock, hidden and restorable legacy packs, and existing 100-pack opening. No browser JavaScript errors. Actual online image loading and live GitHub Pages deployment were not tested.


## Custom packs removed
Custom / fan-made packs no longer appear in the Pack Wall or selection menu, cannot be opened, and their restore toggle was removed. Old Blook collections, histories, and trial progress remain compatible. The original pack data and image assets are retained internally to avoid losing existing save references.
