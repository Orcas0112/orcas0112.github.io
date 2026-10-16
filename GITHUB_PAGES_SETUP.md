# Publish Twilight Bazaar using GitHub Pages

1. Export your save backup from the previous website: Vault & Settings → Export Save.
2. At github.com, select New repository. Name it `twilight-bazaar` and make it Public if using GitHub Free.
3. Open the extracted Twilight_Bazaar_GitHub_Pages folder. Select **the files inside it**, not the parent folder, and use `Add file` → `Upload files` on the repository Code tab. Ensure `index.html` is visible at the top level (root) of the repository. Commit changes to `main`.
4. Open repository `Settings` → `Pages` → `Build and deployment`. Choose `Deploy from a branch`, then `main` and `/(root)`, and Save.
5. Open `https://YOUR-USERNAME.github.io/twilight-bazaar/` (replace YOUR-USERNAME with your GitHub username).
6. When changing hosting addresses, import the JSON save under Vault & Settings → Import Save. Browser localStorage is origin-specific and won't move automatically.
7. To publish future versions, replace the old site files in this same repo, commit changes to main, and Pages will publish the update to the same URL.

Note: this includes the fun word-puzzle front page from V7.2. The word is discoverable in client-side JavaScript; it does not provide security or change how school filtering categorizes the site. GitHub Pages is public web hosting; don't place secrets in the files. OG images are external links, and availability/permission is not guaranteed.
