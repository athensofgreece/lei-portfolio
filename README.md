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
- Images: put the file in `public/images/` and write `images/name.jpg` in the sheet, or use a full https link.
- Showing your work (Creative Studio, `social_projects` tab):
  - `image` can hold one or several files separated by `|`, e.g. `images/cover.jpg | images/post-1.jpg | videos/reel.mp4`. Pictures and videos (`.mp4` or `.webm`) can be mixed.
    The first file is the tile cover. All of them appear in the panel that opens when a tile is clicked.
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
