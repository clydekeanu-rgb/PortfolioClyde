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
    var data = JSON.parse(e.postData.contents);

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

Save the project.

## 3. Deploy the web app

1. **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Deploy and copy the **Web app URL**

## 4. Set the env var

Locally (`.env.local`) and on Vercel:

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
```

Redeploy after adding the Vercel env var.

## 5. Smoke test

```bash
curl -X POST http://localhost:3000/api/lead/ \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"message\",\"name\":\"Test\",\"email\":\"you@example.com\",\"message\":\"Hello\"}"
```

A new row should appear in the Sheet within a few seconds.
