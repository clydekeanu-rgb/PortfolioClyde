# Google Sheet lead capture

Leads from **Leave a message** and **Book a discovery call** POST to `/api/lead`, which forwards rows to a Google Apps Script web app.

## 1. Create the Sheet

Create a Google Sheet with a header row:

| timestamp | type | name | email | message | preferred_date | preferred_time | timezone | user_agent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

`type` will be `message` or `discovery`.

## 2. Paste this Apps Script

In the Sheet: **Extensions → Apps Script**. Replace the default code with:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
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
```

Important: open the script from **the Sheet** via **Extensions → Apps Script** (bound project). A standalone script without the Sheet attached will fail on `getActiveSpreadsheet()`.

Save the project.

## 3. Deploy the web app

1. **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Deploy and copy the **Web app URL** (must end in `/exec`, not `/dev`)

If you change the script later, create a **New deployment** again — editing alone does not update the live `/exec` URL.

## 4. Set the env var

Locally (`.env.local`) and on Vercel:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

Redeploy after adding the Vercel env var. Without this, the form shows “Lead capture is not configured yet.”

## 5. Smoke test

```bash
curl -i -X POST http://localhost:3000/api/lead/ \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"discovery\",\"name\":\"Test\",\"email\":\"you@example.com\",\"preferredDate\":\"2026-08-12\",\"preferredTime\":\"10:00\",\"timezone\":\"Asia/Manila\",\"message\":\"Hello\"}"
```

Expect HTTP 200 and `{ "ok": true }`, plus a new row in the Sheet within a few seconds.

### Common failure: success UI but empty sheet

Older webhook code followed Apps Script’s 302 redirect as a GET, so `doPost` never ran. The API now re-POSTs to the redirect URL. Redeploy the site after pulling that fix.
