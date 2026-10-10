# ClearBank — prototype

A horizontal prototype of a mobile banking app, built for a university HCI assignment (COMPX324, University of Waikato). It looks and feels like a real app, but every number in it is fake, hard-coded data — there's no backend, no login, and no connection to a real bank.

## Running it

You don't need to install anything.

1. Open this folder (`Website/`) in VS Code.
2. Right-click `index.html` and choose **Open with Live Server** — or just double-click `index.html` to open it straight in a browser.
3. For the best view, open Chrome DevTools (`F12`), click the device toolbar icon, and pick **iPhone 14** from the device list. The app is designed for a 390×844 screen; on a wider window it centres itself inside a phone-shaped frame.

## Publishing to GitHub Pages

1. Create a new repository on GitHub and upload the contents of this `Website/` folder (`index.html`, `styles.css`, `data.js`, `app.js`).
2. In the repository, go to **Settings → Pages**.
3. Under "Build and deployment", set the source to **Deploy from a branch**, pick the `main` branch and the `/ (root)` folder, then save.
4. GitHub gives you a live URL a minute or two later.

## Demo scenario

This is the main path to test end to end:

1. **Dashboard** loads — after about a second, a popup appears about a Spotify price increase. Click **OK**.
2. Tap **Transfer** in the bottom nav.
3. Click **Add new payee**.
4. Enter the name **S Tipene** and the account number `12-3456-7890123-00` (it auto-formats as you type). Click **Check**.
5. You should see a green "Name matches: S Tipene ✓" — the payee is added and selected automatically.
6. Enter an amount, e.g. `180`, and click **Continue**.
7. Review the read-back screen, then click **Confirm and pay**.
8. Wait for the "Processing…" spinner (~1.2 seconds), then the green tick and completion message. Click **OK**.
9. Back on the Dashboard, the Everyday balance is now lower and the new payment shows up in Recent transactions.
10. Tap **Subscriptions** and click on Spotify to see its price history expand in place.

Also worth trying:

- **Wrong name / scam warning:** Add new payee → "S Tipene" + account `12-9999-0000000-00` → Check → amber warning ("registered to K Morrison") → **Pause and check**.
- **History:** tap **History**, tick a transaction or two, click **Assign category** (try creating a new category, or ticking "Also apply to all transactions from this merchant"), then **Save**.
- **Export:** tick some transactions in History and click **Export** — a real `.csv` file downloads, and a popup confirms how many rows were saved.

## Files

- `index.html` — all the screens and popups (one `<section>` per screen; only one is visible at a time).
- `styles.css` — all the styling. Colours are defined as CSS variables at the top — change those to re-theme the whole app.
- `data.js` — every piece of fake data (accounts, payees, transactions, subscriptions, the Confirmation-of-Payee register). Nothing here talks to a real bank; it's all hard-coded so the app behaves the same way every time it's opened.
- `app.js` — all the behaviour: screen switching, rendering data into HTML, form validation, and everything the buttons do.

State lives only in memory — reloading the page resets everything back to the starting data in `data.js`.
