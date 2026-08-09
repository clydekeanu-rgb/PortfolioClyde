# Google Sheet lead capture

Leads from **Leave a message** and **Book a discovery call** POST to `/api/lead`.

## Storage model

1. **Primary:** Supabase `leads` table (required for the form to succeed)
2. **Secondary:** Google Apps Script → Sheet (best-effort sync; failures are logged and do not block the form)

## 1. Create the Supabase table (required)

In the Supabase SQL editor, run [`docs/supabase-leads.sql`](supabase-leads.sql).

Confirm Vercel already has:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 2. Create the Sheet (optional sync)

Create a Google Sheet with a header row on the **first tab**:

| timestamp | type | name | email | message | preferred_date | preferred_time | timezone | user_agent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Copy the **Spreadsheet ID** from the URL:

`https://docs.google.com/spreadsheets/d/`**`THIS_IS_THE_ID`**`/edit`

## 3. Apps Script (optional sync)

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

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: "portfolio-leads" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Save, then **Deploy → New deployment** (Web app, Execute as Me, Who has access: **Anyone**). Copy the `/exec` URL.

Open `/exec` in a browser — expect `{"ok":true,"service":"portfolio-leads"}`.

## 4. Env vars

```bash
# Required for form success
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional Sheet sync
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

Redeploy after changes.

## 5. Smoke test

```bash
curl -i -X POST https://www.clydeabenojar.site/api/lead/ \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"message\",\"name\":\"Test\",\"email\":\"you@example.com\",\"message\":\"Hello\"}"
```

Expect `{ "ok": true }` and a row in Supabase `leads`. If Sheets sync is configured correctly, a Sheet row appears too.
