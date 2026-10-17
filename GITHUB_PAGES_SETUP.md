# Update the existing Twilight Bazaar website to V9.0

1. Go to the existing GitHub repo `orcas0112/orcas0112.github.io`.
2. In Twilight Bazaar's current **Vault & settings**, click **Export save** to back up your existing inventory.
3. Unzip `Twilight_Bazaar_V9_0_Fusion_Admin_GitHub_Pages.zip`.
4. Select **all files inside** the extracted folder, not the folder itself. Upload all individual files to the **repository root** using **Add file → Upload files**, then commit. Overwrite same-named files when prompted by GitHub's commit workflow.
5. Keep **Settings → Pages → main / (root)** unchanged.
6. Refresh your existing website. Use the **Fusion Lab** and **Admin panel** navigation items.

`v9.js` and `v9.css` are new and **must** be uploaded along with the updated `index.html`, `app.js`, `v8.js`, and all other files. Old `tb83-*.svg` files are included for existing users' art compatibility.

**Security:** Admin controls have a client-side password only; this is not secure on publicly served static GitHub Pages. Admin changes affect only the local browser's save.


## Custom packs removed
Custom / fan-made packs no longer appear in the Pack Wall or selection menu, cannot be opened, and their restore toggle was removed. Old Blook collections, histories, and trial progress remain compatible. The original pack data and image assets are retained internally to avoid losing existing save references.
