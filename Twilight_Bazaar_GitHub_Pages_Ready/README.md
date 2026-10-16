# Twilight Bazaar V7.2 — Secret Entrance

This release adds a branded front page with a hidden password clue and keeps V7.1’s harder Mystical requirements. The word is **LANTERN**; tap the moon on the front page to reveal it. Case-insensitive. The puzzle unlocks the game for the current browser tab/session. The “Leave Bazaar” button returns to the entrance.

**This is not secure access control.** Because the site is a static website, the word appears in client-side JavaScript, and the game files are not protected from direct access. It is a fun entrance puzzle, not a way to bypass school content filtering. Securly or school IT may still categorize and block this game. For genuine password protection, use a server-side authentication/access-control provider.

**Saves and progress:** the existing `twilightBazaarWebSaveV1` localStorage save and V7.1 game code are unchanged, so collections, tokens, Mysticals, achievements, and opening history continue normally on the same website address. The gate only uses a separate `sessionStorage` key. Export a save before deploying as a precaution.

**Files:** all original files plus `gate.css` and `gate.js`. To publish, unzip and upload the whole folder to your *existing* Netlify project (not a new site).

---

# Twilight Bazaar V7.1 — Endgame Mystical Trials

A self-contained fan-made static website: no account, paid domain, database, extension, or Blooket API. Its tokens, inventories, trades, and purchases are independent simulations and do not affect any real Blooket account.

## Updating an existing Netlify website

1. **Back up your current collection:** Open the old website, go to Vault & settings → Export save, and keep the JSON download.
2. Unzip the V7 archive and locate the `Twilight_Bazaar_v7_1` folder containing `index.html`, `style.css`, `data.js`, `app.js`, **`v7.js`**, and this README.
3. Sign into Netlify, open your **existing** site, and upload the extracted folder containing `index.html` using that site's manual deploy area. Do **not** create a new site if you want to retain the same URL and same browser storage.
4. Hard-refresh your original URL. Look for `WEB EDITION · V7.1` and `Special Shop` in the navigation. Your old V5/V6 save key remains `twilightBazaarWebSaveV1` and the schema version remains 1.
5. Verify your collection, tokens, shards, event seals, Mystical trials, achievements, and opening history. Retain the JSON backup.

Opening the `index.html` locally also works, but `file://` browser storage may vary, and remote artwork requires internet.

## V7.1 harder Mysticals

V7.1 is a balancing update to V7, not a new website or a save wipe. The five trial requirements are much harder, while normal pack odds, bonuses, and special shop prices are unchanged. Progress counts already in the save carry over. Previously unlocked Mysticals and claimed trial flags stay intact; the harder requirements only affect not-yet-unlocked Mysticals.

## V7 features

- **318 catalog entries** (316 carried forward plus two documented *unreleased historical Blooket references* — `Under Construction` and `Astronaut of the Day Placeholder`). These new two were not publicly released collectible OG pack drops and may have no working artwork URLs. No user-created or AI-generated Blooks added. Do not mistake 318 catalog entries for a claim that 318 Blooks are released in the current official game.
- **Permanent Special Shop:** Every non-Mystical event, retired, seasonal, Unique, and unreleased/historical archive entry can be obtained with local tokens, without waiting for a random daily rotation. Starters can be claimed free individually or with `Claim all free starters`. The Event Hall daily archive offers still exist as optional discounts using seals.
- **Exactly five Mysticals** still use Event Hall trials. In V7.1 their goals are much harder; previously earned Mysticals are never taken away. No Mystical is dropped in paid packs, special bonuses, or the Special Shop. New trial thresholds: Spooky Ghost (750 Spooky opens + own Ghost + 180 seals), Tim the Alien (1,200 Space opens + own Astronaut + 260 seals), Phantom King (1,500 Medieval opens + own King + 320 seals), Hamsta Claus (1,800 Blizzard opens + own Santa Claus + 380 seals), Rainbow Astronaut (3,000 Space opens + own Red Astronaut Chroma + 600 seals). A required Blook is not consumed. Red Astronaut rotates in the Space Pack on Fridays (UTC) in this simulator.
- **Ultra-rare EXTRA bonus discoveries:** For each paid pack, a separate simulator-only roll can award one additional non-Mystical special Blook without replacing the normal pull or altering the existing pack odds. The mutually exclusive bonus probabilities per paid pack are Rare Find **0.30%**, Ultra Rare **0.08%**, Secret Find **0.02%**. Combined bonus chance **0.40%**. Bonus tiers determine which verified existing archive names can be won, and are **not official Blooket pack rates**. Individual bonus Blooks are chosen uniformly from each tier's eligible pool.
- **Reveal improvement:** Rare bonus finds receive a distinct glowing reveal. V6 100-pack Skip remains immediate, results include each of the 100 regular pulls and a separate bonus section. Instant, Fast, Classic, and the 30-session opening history are maintained. Saved V7 histories include bonus pull names and tiers.
- **Preservation:** V5/V6 inventory, tokens, shard balances, favorite flags, trade history/progress, all five Mystical trials, achievements, and existing V6 opening history survive import. V7 adds `v7` to the existing save and a `bonus` array to new V6-style history sessions; older sessions are accepted unchanged. Collection completion targets now count historical shop collectibles because they can be obtained.

### Obtainment table

| OG / simulator category | V7 simulator method |
| --- | --- |
| Regular market pack Blooks | Same 50-token pack and same snapshot probabilities |
| Space Astronaut daily Chromas | Same daily pack rotation |
| Starter/Common Blooks | Free claim in Special Shop |
| Seasonal, historical-event, retired, Unique and archival Blooks | Always available in Special Shop using local tokens; optional Event Hall daily exchange discounts |
| Historical/unreleased OG asset references | Special Shop **in the simulator only**, clearly distinguished from official releases |
| The five original Mysticals | Mystical trials only |

## Sources & limitations

Community references, **not an authoritative live inventory of Blooket's currently obtainable content**:
- https://blooket.fandom.com/wiki/Blooks
- https://blooket.fandom.com/wiki/Unreleased_Blooks
- https://blooket.fandom.com/wiki/Category:Hidden_Blooks
- https://blooket.fandom.com/wiki/Chromas

The original release's pack rates are historical simulator snapshots and have not been comprehensively verified against current live game odds. All OG image references remain external; the website does **not** ship original copyrighted artwork, copy proprietary Blooket code, or claim sponsorship. Remote image URLs may fail; there are no fake substitute images.

## Files

`index.html` — pages, `style.css` — design, `data.js` — documented Blook names and preserved pack probabilities, `app.js` — v5/v6 features & save logic, **`v7.js` — shop, bonus roll/reveal/history integration**, `README.md` — this guide.
