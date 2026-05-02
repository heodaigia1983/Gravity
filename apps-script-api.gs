const SHEET_ID = '1gIOAMjsJTuEswpNB8vvnfo8V1VuA9mSc3aLOdUctSRw';
const SHEET_NAME = '';

function doGet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheet = SHEET_NAME
    ? spreadsheet.getSheetByName(SHEET_NAME)
    : spreadsheet.getSheets()[0];

  if (!sheet) {
    return jsonResponse({
      ok: false,
      error: 'Sheet not found'
    });
  }

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift() || [];
  const rows = values
    .filter((row) => row.some((cell) => String(cell).trim() !== ''))
    .map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header || `Column ${index + 1}`] = row[index] || '';
      });
      return item;
    });

  return jsonResponse({
    ok: true,
    count: rows.length,
    updatedAt: new Date().toISOString(),
    rows
  });
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
