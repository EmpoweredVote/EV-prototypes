/**
 * Google Apps Script for Politician Stance Data Entry
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Spreadsheet
 * 2. Create three sheets named: "Politicians", "Issues", "Stances"
 * 3. Add the column headers from BUILD_INSTRUCTIONS.md to each sheet
 * 4. Go to Extensions > Apps Script
 * 5. Copy this entire code into the script editor
 * 6. Deploy as a web app:
 *    - Click Deploy > New deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy the web app URL and paste it into data-entry/src/config.js
 */

// Sheet names
const POLITICIANS_SHEET = 'Politicians';
const ISSUES_SHEET = 'Issues';
const STANCES_SHEET = 'Stances';

// Lock timeout in milliseconds (10 minutes)
const LOCK_TIMEOUT_MS = 10 * 60 * 1000;

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action || 'getData';

  let result;
  try {
    switch (action) {
      case 'getData':
        result = getData();
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (error) {
    result = { error: error.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  let result;
  try {
    switch (action) {
      case 'addPolitician':
        result = addPolitician(data);
        break;
      case 'addStance':
        result = addStance(data);
        break;
      case 'updateStance':
        result = updateStance(data);
        break;
      case 'submitForReview':
        result = submitForReview(data);
        break;
      case 'acquireLock':
        result = acquireLock(data);
        break;
      case 'releaseLock':
        result = releaseLock(data);
        break;
      case 'approveReview':
        result = approveReview(data);
        break;
      case 'editAndResubmit':
        result = editAndResubmit(data);
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
  } catch (error) {
    result = { error: error.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get all data from all sheets
 */
function getData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  return {
    politicians: getSheetData(ss.getSheetByName(POLITICIANS_SHEET)),
    issues: getSheetData(ss.getSheetByName(ISSUES_SHEET)),
    stances: getSheetData(ss.getSheetByName(STANCES_SHEET))
  };
}

/**
 * Convert sheet data to array of objects
 */
function getSheetData(sheet) {
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map((row, index) => {
    const obj = { _rowIndex: index + 2 }; // 1-indexed, plus header row
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}

/**
 * Add a new politician
 */
function addPolitician(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(POLITICIANS_SHEET);

  const newRow = [
    '', // external_id (blank for new entries)
    data.full_name,
    data.party,
    data.office,
    data.office_level,
    data.added_by,
    new Date().toISOString()
  ];

  sheet.appendRow(newRow);

  return { success: true, message: 'Politician added successfully' };
}

/**
 * Generate a unique ID for new politicians without external_id
 */
function generatePoliticianId(name) {
  const timestamp = Date.now();
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `new_${cleanName}_${timestamp}`;
}

/**
 * Add a new stance
 */
function addStance(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STANCES_SHEET);

  // Generate context_key
  const politicianId = data.politician_external_id || generatePoliticianId(data.politician_name);
  const contextKey = `${politicianId}|${data.topic_key}`;

  const newRow = [
    contextKey,
    data.politician_name,
    data.politician_external_id || '',
    data.topic_key,
    data.stance,
    data.reasoning,
    data.sources,
    'draft', // status
    data.added_by,
    new Date().toISOString(),
    '', // reviewed_by
    0,  // review_count
    '', // locked_by
    ''  // locked_at
  ];

  sheet.appendRow(newRow);

  return { success: true, message: 'Stance added successfully', context_key: contextKey };
}

/**
 * Update an existing stance
 */
function updateStance(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STANCES_SHEET);

  const rowIndex = findStanceRow(sheet, data.context_key);
  if (rowIndex === -1) {
    return { error: 'Stance not found' };
  }

  // Update specific columns
  sheet.getRange(rowIndex, 5).setValue(data.stance); // stance column
  sheet.getRange(rowIndex, 6).setValue(data.reasoning); // reasoning column
  sheet.getRange(rowIndex, 7).setValue(data.sources); // sources column

  return { success: true, message: 'Stance updated successfully' };
}

/**
 * Submit a stance for review
 */
function submitForReview(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STANCES_SHEET);

  const rowIndex = findStanceRow(sheet, data.context_key);
  if (rowIndex === -1) {
    return { error: 'Stance not found' };
  }

  // Update status to needs_review
  sheet.getRange(rowIndex, 8).setValue('needs_review');

  // Clear lock
  sheet.getRange(rowIndex, 13).setValue('');
  sheet.getRange(rowIndex, 14).setValue('');

  return { success: true, message: 'Submitted for review' };
}

/**
 * Acquire a lock on a stance row
 */
function acquireLock(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STANCES_SHEET);

  const rowIndex = findStanceRow(sheet, data.context_key);
  if (rowIndex === -1) {
    return { error: 'Stance not found' };
  }

  // Check current lock
  const currentLockBy = sheet.getRange(rowIndex, 13).getValue();
  const currentLockAt = sheet.getRange(rowIndex, 14).getValue();

  if (currentLockBy && currentLockAt) {
    const lockTime = new Date(currentLockAt).getTime();
    const now = Date.now();

    if (now - lockTime < LOCK_TIMEOUT_MS && currentLockBy !== data.volunteer_name) {
      return {
        success: false,
        locked: true,
        locked_by: currentLockBy,
        message: `Currently being edited by ${currentLockBy}`
      };
    }
  }

  // Acquire lock
  sheet.getRange(rowIndex, 13).setValue(data.volunteer_name);
  sheet.getRange(rowIndex, 14).setValue(new Date().toISOString());

  return { success: true, message: 'Lock acquired' };
}

/**
 * Release a lock on a stance row
 */
function releaseLock(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STANCES_SHEET);

  const rowIndex = findStanceRow(sheet, data.context_key);
  if (rowIndex === -1) {
    return { error: 'Stance not found' };
  }

  // Clear lock
  sheet.getRange(rowIndex, 13).setValue('');
  sheet.getRange(rowIndex, 14).setValue('');

  return { success: true, message: 'Lock released' };
}

/**
 * Approve a review
 */
function approveReview(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STANCES_SHEET);

  const rowIndex = findStanceRow(sheet, data.context_key);
  if (rowIndex === -1) {
    return { error: 'Stance not found' };
  }

  // Get current reviewed_by and review_count
  let reviewedBy = sheet.getRange(rowIndex, 11).getValue() || '';
  let reviewCount = sheet.getRange(rowIndex, 12).getValue() || 0;

  // Add reviewer to list
  if (reviewedBy) {
    reviewedBy += ',' + data.volunteer_name;
  } else {
    reviewedBy = data.volunteer_name;
  }

  // Increment count
  reviewCount++;

  // Update sheet
  sheet.getRange(rowIndex, 11).setValue(reviewedBy);
  sheet.getRange(rowIndex, 12).setValue(reviewCount);

  // Check if approved (2 reviews needed)
  if (reviewCount >= 2) {
    sheet.getRange(rowIndex, 8).setValue('approved');
  }

  // Clear lock
  sheet.getRange(rowIndex, 13).setValue('');
  sheet.getRange(rowIndex, 14).setValue('');

  return {
    success: true,
    message: reviewCount >= 2 ? 'Stance approved!' : 'Review recorded. Needs one more approval.',
    review_count: reviewCount,
    status: reviewCount >= 2 ? 'approved' : 'needs_review'
  };
}

/**
 * Edit and resubmit a stance
 */
function editAndResubmit(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(STANCES_SHEET);

  const rowIndex = findStanceRow(sheet, data.context_key);
  if (rowIndex === -1) {
    return { error: 'Stance not found' };
  }

  // Update fields
  sheet.getRange(rowIndex, 5).setValue(data.stance);
  sheet.getRange(rowIndex, 6).setValue(data.reasoning);
  sheet.getRange(rowIndex, 7).setValue(data.sources);

  // Set new author
  sheet.getRange(rowIndex, 9).setValue(data.volunteer_name);
  sheet.getRange(rowIndex, 10).setValue(new Date().toISOString());

  // Reset review tracking
  sheet.getRange(rowIndex, 11).setValue(''); // reviewed_by
  sheet.getRange(rowIndex, 12).setValue(0);  // review_count

  // Clear lock
  sheet.getRange(rowIndex, 13).setValue('');
  sheet.getRange(rowIndex, 14).setValue('');

  return { success: true, message: 'Edited and resubmitted for review' };
}

/**
 * Find the row index for a stance by context_key
 */
function findStanceRow(sheet, contextKey) {
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === contextKey) {
      return i + 1; // Convert to 1-indexed row number
    }
  }

  return -1;
}
