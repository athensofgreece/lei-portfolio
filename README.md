# Lei Picones Portfolio (React + Vite + Google Sheets)

Light mode = social media management. Dark mode = automation and web development.
Your content can live in a Google Sheet, so you update the site by editing rows.

## 1. Set up the Google Sheet (about 5 minutes)
1. Go to sheets.google.com, then File > Import > Upload, and choose `portfolio-content-sheet.xlsx`.
   Pick "Create new spreadsheet". Keep every tab name exactly as it is.
2. Select all cells (Ctrl+A) and set Format > Number > Plain text on each tab.
3. Click Share > General access > "Anyone with the link" > Viewer. (Anyone with the link can read it, so keep private info out.)
4. Copy the Sheet ID from the address bar: the long code between `/d/` and `/edit`.
5. Open `src/sheet.config.js` and paste it between the quotes: `export const SHEET_ID = 'your-id-here'`
6. Push to GitHub. Done. From now on, edit the sheet and the live site updates within a few minutes.

## 2. Day to day
- Add a project: add a row. Remove one: delete the row, or type `no` in its `show` column.
- Lists in a single cell use a pipe: `Form response | Airtable row | Email alert`
- Images: put the file in `public/images/` and write `images/name.jpg` in the sheet (a leading `public/` is also accepted), or use a full https link.
- Showing your work (Creative Studio, `social_projects` tab):
  - `image` can hold one or several files separated by `|`, e.g. `images/cover.jpg | images/post-1.jpg | videos/reel.mp4`. Pictures and videos (`.mp4` or `.webm`) can be mixed.
    The first file is the tile cover. All of them appear in the panel that opens when a tile is clicked.
  - Optional `cover` column: add a column named `cover` to `social_projects` to choose the picture shown behind each tile. Leave a cell empty for a plain pink or lilac tile,
    which suits screenshots and reports that are too busy to sit behind the title. The panel still shows everything listed in `image`. Without a `cover` column, the first `image` is the cover.
  - A file that cannot be found is skipped quietly (the tile falls back to its plain colour) instead of showing a broken-image icon.
  - `link` adds a "View the work" button, for a TikTok, Facebook, YouTube or Canva link.
  - Keep pictures under about 300 KB (around 1200 px wide) and videos under about 15 MB (15 to 30 seconds, 720p, H.264 MP4).
    For longer videos, upload them to YouTube (unlisted) or Facebook and paste the link in `link`.
- Showing your work (Technology Lab, `auto_demos` tab): optional `tools` (comma separated, e.g. `Zapier, Airtable`) and `link` (demo video or write-up) columns.
  Add the column header in the first row and fill it in. Rows without them still display normally.
- Editing `src/data.js` still works. It is the fallback if the sheet can't be reached.

## 3. Run it on your computer
Install Node.js (LTS), then: `npm install` and `npm run dev`

## 4. Publish on GitHub Pages
1. Push this folder to the `main` branch of your repo (e.g. `athensofgreece.github.io`).
2. Settings > Pages > Source: **GitHub Actions**. Every push rebuilds the site.

## Troubleshooting
- Still seeing old content? Open the site, press Ctrl+Shift+R, and check the browser console for lines starting with `[sheet]`.
- To test your sheet, open this address in a browser (replace the ID and tab name):
  `https://docs.google.com/spreadsheets/d/YOUR_ID/gviz/tq?tqx=out:csv&sheet=settings`
  It should show your rows as plain text. If it asks you to sign in, the sharing step wasn't done.
- A section that is missing from the sheet, or has a renamed header, just keeps its data.js content.

## Before launching
- Replace the bracketed note in the first social project with real numbers.
- Keep automation demos labeled as demos until you have client results.
- Check images for client names or logos.

## Analytics (GoatCounter, optional)

Visitor stats are switched off until you add a site code.

1. Create a free account at https://www.goatcounter.com and choose a site code (for example `lei`). Your dashboard will then be `https://lei.goatcounter.com`.
2. Open `src/analytics.config.js` and put the code between the quotes: `export const GOATCOUNTER_CODE = 'lei'`.
3. Commit and push. A small "Privacy-friendly stats, no cookies" note then appears in the footer.

You will see visits, where visitors came from, countries and devices. The site also reports a few named clicks as events: the hero buttons
("cta: work with me", "cta: see work"), the Studio / Lab switch ("mode: creative studio", "mode: technology lab"), opening a project
("project: ..."), project, demo and website links, and the email, copy-email and GitHub links.
No cookies are used. Visitors who send Do Not Track or Global Privacy Control are not counted, and ad blockers hide some visits, so treat the numbers as a minimum.
To turn it off, empty the code again.

## Security notes

- **Content-security policy.** `index.html` tells browsers which sites this page may load from: itself, Google Sheets (your content), Google Fonts and GoatCounter.
  If you ever add a new outside service (an embed, another analytics tool, a font host), add its address to that policy or the browser will block it.
  If something stops loading, open the browser console (F12) and look for a message starting "Refused to ...". If your sheet ever stops updating after a change,
  the `connect-src` part of that line is the place to check. Removing the whole `Content-Security-Policy` line switches the policy off.
- **Links from the sheet.** Links typed into the sheet are only used if they are normal web addresses (`https://...` or `http://...`).
  Anything else, such as `javascript:...`, is ignored, and the matching button or icon is simply not shown.
- **Updates.** `.github/dependabot.yml` makes GitHub open a pull request each week when a package or workflow action is out of date.
  Nothing changes on your site until you review and merge one.
- **Accounts and the sheet.** Turn on two-factor authentication for GitHub and for the Google account that owns the sheet. Share the sheet as
  "Anyone with the link: Viewer", never Editor, and keep private details out of every tab. Remove location data from photos before adding them to `public/images`.
