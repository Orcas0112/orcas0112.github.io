# Publish Twilight Bazaar V8 to your existing GitHub Pages site

1. **Backup first:** On the current site, Vault & settings → **Export save**.
2. Unzip V8. Open its extracted folder. Select **every file inside** (not the folder).
3. In `https://github.com/orcas0112/orcas0112.github.io`, stay in the main repository directory, click **Add file → Upload files**, and upload the individual files.
4. Click **Commit changes** to `main`.
5. **Don't change Pages settings**: `main / (root)` should already be configured; leave Custom domain blank.
6. When the newest Pages run under **Actions** is green, open `https://orcas0112.github.io/`, and hard-refresh if necessary.

If you accidentally upload everything inside another folder, return to your repository's main directory and upload the **contents** of the ZIP there. You do not need to delete the previous nested folder for the root site to work.

Your browser save stays tied to the same website URL/browser. Use **Import save** from your JSON backup if you change domains/browsers.
