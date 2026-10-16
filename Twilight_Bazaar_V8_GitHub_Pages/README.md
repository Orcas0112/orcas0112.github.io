# Twilight Bazaar V8 — Collector Arcade

A colorful, independently designed static collector-game site inspired by the *energy* of modern collecting games. **Not a Blacket or Blooket clone**: no code, graphic assets, layouts, or original characters were copied from Blacket. Blooket OG art is linked remotely when the respective URLs load and usage rights permit; no Blook image files are bundled.

## What's new in V8

- Full visual refresh: electric-blue arcade hero, navy collector sidebar, new card system, new colors and type, responsive phone layout.
- **Pack Wall** on the homepage: all 25 existing pack/gallery categories, with search, paid/starter filter, OG Blook image links and one-click pack navigation.
- A live dashboard showing total discovered, pack openings, collection completion, remaining event seals, and rare bonus discovery count.
- Retains V7.2's secret-word entrance (`LANTERN` hidden behind the clickable moon). This is a fun client-side puzzle, not authentication, security, or a way around school filters.
- No changes to the V7.1 harder Mystical trial requirements, local 50-token pack price, odds, shop prices, bonus probabilities, trade desk, achievements, 100-pack Skip, or opening history.
- **318 catalog entries**, identical to V7.2. No fake OG Blooks or unapproved custom artwork added. Unreleased/historical entries remain labeled as simulator-only references.

## IMPORTANT: preserve existing saves

The browser storage key (`twilightBazaarWebSaveV1`) and data format are unchanged. Your tokens, Blooks, Event Hall trials, save progress, and opening history should remain available **if you replace the files on the exact same GitHub Pages website URL and use the same browser**. Before updating, open V7.2 → Vault & settings → **Export save** and keep the JSON as a backup. A different hostname, changed GitHub username, different browser, or cleared site data requires importing a saved JSON.

## Deploy on GitHub Pages (no paid domain)

1. Unzip `Twilight_Bazaar_V8_GitHub_Pages.zip` on your computer.
2. Open **the existing** `https://github.com/orcas0112/orcas0112.github.io` repository.
3. Stay at its top level (where the repository's `index.html` is shown). Select **Add file → Upload files**.
4. Open the extracted V8 folder locally, select **all the individual files inside**, and upload them, not the enclosing folder or ZIP.
5. Choose **Commit changes**. This replaces the matching files in the repository root, adding `v8.js`, `v8.css`, and `v8-gate.css`.
6. Keep **Settings → Pages → Deploy from a branch → main / (root)**. Don't edit Custom domain or change the repository name.
7. Wait for the Pages Actions workflow to turn green and visit `https://orcas0112.github.io/`. Refresh with Ctrl/Command + Shift + R if cached files appear.

**IMPORTANT:** GitHub Pages must have `index.html` directly in the publishing folder. This ZIP contains the files at its top level, not nested under another folder.

## Files

- `index.html`: Website content and front-page entrance.
- `data.js`: Current 318-entry dataset and OG image URL references (unchanged).
- `app.js`: Game state, pack mechanics, Events, Trading, saves (unchanged).
- `v7.js`: V7 special shop and rare bonus mechanic (unchanged).
- `gate.js`, `gate.css`: Secret entrance behavior/style (unchanged).
- `style.css`: Base component styles from V7 (unchanged).
- `v8.css`: Newly designed visual system, sidebar, pack wall, and mobile overrides.
- `v8-gate.css`: Updated entrance appearance.
- `v8.js`: Homepage pack wall, navigation icons and live dashboard.
- `.nojekyll`: Prevents GitHub Pages' Jekyll processing.
- `GITHUB_PAGES_SETUP.md`: Quick publishing checklist.

## Boundaries and limitations

This is an independent **fan-made local simulator**. It doesn't use real player accounts, transfer any Blooks or currency to Blooket, or support online trades. The images remain controlled by their rights holders, and the site may display "OG image unavailable" when a remote link no longer works or access is blocked. A public site using copyrighted art may require permission even if it is free. No original copyrighted Blacket/Blooket visual assets were bundled.

## Test coverage

V8's isolated browser tests cover the entrance puzzle, responsive mobile/desktop view, all 25 pack tiles, searching packs, pack selection, 100-pack bulk opening, results dialog and JavaScript runtime errors. The tests block external images, so remote OG image delivery and live GitHub Pages hosting were **not verified** in the test environment. The underlying V7 save schema and game logic remain unchanged.
