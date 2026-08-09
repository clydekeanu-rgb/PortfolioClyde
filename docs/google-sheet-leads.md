# Google Sheet lead capture

Leads from **Leave a message** and **Book a discovery call** POST to `/api/lead`, which forwards rows to a Google Apps Script web app.

## 1. Create the Sheet

Create a Google Sheet with a header row on the **first tab**:

| timestamp | type | name | email | message | preferred_date | preferred_time | timezone | user_agent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Copy the **Spreadsheet ID** from the URL:

`https://docs.google.com/spreadsheets/d/`**`THIS_IS_THE_ID`**`/edit`

## 2. Paste this Apps Script (bound to the Sheet)

In the Sheet: **Extensions → Apps Script**. Replace everything with:

```javascript
// Paste your Sheet ID from the browser URL
var SPREADSHEET_ID = "PASTE_SPREADSHEET_ID_HERE";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheets()[0];
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var data = JSON.parse(raw);

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.type || "",
      data.name || "",
      data.email || "",
      data.message || "",
      data.preferred_date || "",
      data.preferred_time || "",
      data.timezone || "",
      data.user_agent || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: open the /exec URL in a browser — should show this JSON
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "portfolio-leads" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Save.

**Why `openById`?** In a deployed web app, `getActiveSpreadsheet()` is often `null`, so rows never append even when the request “succeeds.”

## 3. Deploy the web app

1. **Deploy → New deployment** (always choose **New** after script changes)
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone** (not “Anyone with a Google account”)
5. Deploy → authorize if prompted → copy the URL ending in **`/exec`**

Test the URL in a browser — you should see:

```json
{"ok":true,"service":"portfolio-leads"}
```

## 4. Set the env var

Vercel → Project → Settings → Environment Variables:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

Redeploy Production after saving.

## 5. Smoke test

```bash
curl -i -X POST https://www.clydeabenojar.site/api/lead/ \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"discovery\",\"name\":\"Test\",\"email\":\"you@example.com\",\"preferredDate\":\"2026-08-12\",\"preferredTime\":\"10:00\",\"timezone\":\"Asia/Manila\",\"message\":\"Hello\"}"
```

Expect HTTP 200 and `{ "ok": true }` **and** a new Sheet row.

If the script is wrong, the API now returns **502** instead of a fake success.
