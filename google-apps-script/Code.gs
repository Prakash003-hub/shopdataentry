/**
 * SUBI Online Service - Google Apps Script Backend REST API
 * -------------------------------------------------------------
 * Target Google Sheets: Budget, CustomerFeedback, CustomerData
 * Target Google Drive Folder: "Customer Documents"
 * 
 * Instructions:
 * 1. Open your Google Sheet -> Extensions -> Apps Script.
 * 2. Paste this complete Code.gs script into the Apps Script editor.
 * 3. Click "Deploy" -> "New deployment" -> Select "Web app".
 * 4. Execute as: "Me", Who has access: "Anyone".
 * 5. Copy the Web App URL and paste it into the SUBI PWA Settings.
 */

var APP_PASSWORD = "132003";
var FOLDER_NAME = "Customer Documents";

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var contents = e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
    var parameter = e ? e.parameter : {};
    var action = contents.action || parameter.action || "";

    // Route matching
    switch (action) {
      case "login":
        return jsonResponse(doLogin(contents));

      // Budget APIs
      case "budget_add":
        return jsonResponse(addBudget(contents));
      case "budget_list":
        return jsonResponse(getBudgetList());
      case "budget_update":
        return jsonResponse(updateBudget(contents));
      case "budget_delete":
        return jsonResponse(deleteBudget(contents));

      // Customer Feedback APIs
      case "feedback_add":
        return jsonResponse(addFeedback(contents));
      case "feedback_list":
        return jsonResponse(getFeedbackList());
      case "feedback_update":
        return jsonResponse(updateFeedback(contents));
      case "feedback_delete":
        return jsonResponse(deleteFeedback(contents));

      // Customer Data APIs
      case "customer_add":
        return jsonResponse(addCustomer(contents));
      case "customer_list":
        return jsonResponse(getCustomerList());
      case "customer_update":
        return jsonResponse(updateCustomer(contents));
      case "customer_delete":
        return jsonResponse(deleteCustomer(contents));

      // Drive Upload API
      case "upload":
        return jsonResponse(uploadFiles(contents));

      // Dashboard Stats API
      case "dashboard":
        return jsonResponse(getDashboardStats());

      default:
        return jsonResponse({ success: false, message: "Invalid action route: " + action });
    }
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ----------------- AUTHENTICATION -----------------
function doLogin(data) {
  if (data.password === APP_PASSWORD) {
    return { success: true, message: "Login successful", token: "subi_session_" + Date.now() };
  } else {
    return { success: false, message: "Invalid password" };
  }
}

// ----------------- SHEET UTILITIES -----------------
function getOrCreateSheet(sheetName, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#16A34A").setFontColor("#FFFFFF");
    }
  }
  return sheet;
}

function getBudgetSheet() {
  return getOrCreateSheet("Budget", ["ID", "Date", "Transaction Type", "Category", "Description", "Amount", "Balance", "Created Time", "Updated Time"]);
}

function getFeedbackSheet() {
  return getOrCreateSheet("CustomerFeedback", ["ID", "Name", "Phone", "Service", "Description", "Date", "Created Time"]);
}

function getCustomerSheet() {
  return getOrCreateSheet("CustomerData", ["ID", "Name", "Aadhaar", "Phone", "Drive File IDs", "Drive URLs", "File Names", "Status", "Created Time"]);
}

// ----------------- RECALCULATE RUNNING BALANCE -----------------
function recalculateBalances() {
  var sheet = getBudgetSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return;

  var runningBalance = 0;
  for (var i = 1; i < data.length; i++) {
    var type = String(data[i][2]).trim();
    var amount = parseFloat(data[i][5]) || 0;

    if (type === "Starting Amount" || type === "Income" || type === "Fund") {
      runningBalance += amount;
    } else if (type === "Investment" || type === "Expense") {
      runningBalance -= amount;
    }

    sheet.getRange(i + 1, 7).setValue(runningBalance);
  }
}

function formatLocalDate(val) {
  if (!val) return "";
  if (val instanceof Date) {
    try {
      return Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } catch(e) {
      return val.getFullYear() + "-" + String(val.getMonth() + 1).padStart(2, '0') + "-" + String(val.getDate()).padStart(2, '0');
    }
  }
  return String(val).split("T")[0];
}

// ----------------- BUDGET CONTROLLERS -----------------
function addBudget(data) {
  var sheet = getBudgetSheet();
  var id = "BGD_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  var now = new Date().toISOString();

  var dateVal = data.date || formatLocalDate(new Date());
  var type = data.type || "Income";
  var category = data.category || "";
  var description = data.description || "";
  var amount = parseFloat(data.amount) || 0;

  sheet.appendRow([id, dateVal, type, category, description, amount, 0, now, now]);
  recalculateBalances();

  return { success: true, message: "Budget record added successfully", id: id };
}

function getBudgetList() {
  var sheet = getBudgetSheet();
  var data = sheet.getDataRange().getValues();
  var results = [];

  for (var i = 1; i < data.length; i++) {
    results.push({
      id: data[i][0],
      date: formatLocalDate(data[i][1]),
      type: data[i][2],
      category: data[i][3],
      description: data[i][4],
      amount: parseFloat(data[i][5]) || 0,
      balance: parseFloat(data[i][6]) || 0,
      createdTime: data[i][7],
      updatedTime: data[i][8]
    });
  }

  return { success: true, data: results };
}

function updateBudget(data) {
  var sheet = getBudgetSheet();
  var values = sheet.getDataRange().getValues();
  var targetId = data.id;

  for (var i = 1; i < values.length; i++) {
    if (values[i][0] == targetId) {
      if (data.date) sheet.getRange(i + 1, 2).setValue(data.date);
      if (data.type) sheet.getRange(i + 1, 3).setValue(data.type);
      if (data.category !== undefined) sheet.getRange(i + 1, 4).setValue(data.category);
      if (data.description !== undefined) sheet.getRange(i + 1, 5).setValue(data.description);
      if (data.amount !== undefined) sheet.getRange(i + 1, 6).setValue(parseFloat(data.amount) || 0);
      sheet.getRange(i + 1, 9).setValue(new Date().toISOString());

      recalculateBalances();
      return { success: true, message: "Budget updated successfully" };
    }
  }
  return { success: false, message: "Record not found" };
}

function deleteBudget(data) {
  var sheet = getBudgetSheet();
  var values = sheet.getDataRange().getValues();
  var targetId = data.id;

  for (var i = 1; i < values.length; i++) {
    if (values[i][0] == targetId) {
      sheet.deleteRow(i + 1);
      recalculateBalances();
      return { success: true, message: "Budget record deleted successfully" };
    }
  }
  return { success: false, message: "Record not found" };
}

// ----------------- CUSTOMER FEEDBACK CONTROLLERS -----------------
function addFeedback(data) {
  var sheet = getFeedbackSheet();
  var id = "FB_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  var now = new Date().toISOString();

  sheet.appendRow([
    id,
    data.name || "",
    data.phone || "",
    data.service || "",
    data.description || "",
    data.date || formatLocalDate(new Date()),
    now
  ]);

  return { success: true, message: "Feedback added successfully", id: id };
}

function getFeedbackList() {
  var sheet = getFeedbackSheet();
  var data = sheet.getDataRange().getValues();
  var results = [];

  for (var i = 1; i < data.length; i++) {
    results.push({
      id: data[i][0],
      name: data[i][1],
      phone: String(data[i][2]),
      service: data[i][3],
      description: data[i][4],
      date: formatLocalDate(data[i][5]),
      createdTime: data[i][6]
    });
  }

  return { success: true, data: results };
}

function updateFeedback(data) {
  var sheet = getFeedbackSheet();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (values[i][0] == data.id) {
      if (data.name) sheet.getRange(i + 1, 2).setValue(data.name);
      if (data.phone) sheet.getRange(i + 1, 3).setValue(data.phone);
      if (data.service) sheet.getRange(i + 1, 4).setValue(data.service);
      if (data.description !== undefined) sheet.getRange(i + 1, 5).setValue(data.description);
      if (data.date) sheet.getRange(i + 1, 6).setValue(data.date);

      return { success: true, message: "Feedback updated" };
    }
  }
  return { success: false, message: "Feedback not found" };
}

function deleteFeedback(data) {
  var sheet = getFeedbackSheet();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (values[i][0] == data.id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: "Feedback deleted" };
    }
  }
  return { success: false, message: "Feedback not found" };
}

function getColumnMap(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return {};
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    map[String(headers[i]).trim().toLowerCase()] = i + 1; // 1-indexed column number
  }
  return map;
}

function ensureStatusColumn(sheet) {
  var colMap = getColumnMap(sheet);
  if (!colMap["status"]) {
    // If Status column does not exist in existing sheet, insert it at column 8
    sheet.insertColumnBefore(8);
    sheet.getRange(1, 8).setValue("Status").setFontWeight("bold").setBackground("#16A34A").setFontColor("#FFFFFF");
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 8, lastRow - 1, 1).setValue("Pending");
    }
  }
}

// ----------------- CUSTOMER DATA CONTROLLERS -----------------
function addCustomer(data) {
  var sheet = getCustomerSheet();
  ensureStatusColumn(sheet);
  var id = "CST_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  var now = new Date().toISOString();

  sheet.appendRow([
    id,
    data.name || "",
    data.aadhaar || "",
    data.phone || "",
    JSON.stringify(data.driveFileIds || []),
    JSON.stringify(data.driveUrls || []),
    JSON.stringify(data.fileNames || []),
    data.status || "Pending",
    now
  ]);

  return { success: true, message: "Customer data saved successfully", id: id };
}

function getCustomerList() {
  var sheet = getCustomerSheet();
  ensureStatusColumn(sheet);

  var data = sheet.getDataRange().getValues();
  var results = [];
  if (data.length <= 1) return { success: true, data: [] };

  var colMap = getColumnMap(sheet);
  var idCol = (colMap["id"] || 1) - 1;
  var nameCol = (colMap["name"] || 2) - 1;
  var aadhaarCol = (colMap["aadhaar"] || 3) - 1;
  var phoneCol = (colMap["phone"] || 4) - 1;
  var fileIdsCol = (colMap["drive file ids"] || 5) - 1;
  var urlsCol = (colMap["drive urls"] || 6) - 1;
  var namesCol = (colMap["file names"] || 7) - 1;
  var statusCol = (colMap["status"] || 8) - 1;
  var createdCol = (colMap["created time"] || 9) - 1;

  for (var i = 1; i < data.length; i++) {
    var fileIds = [];
    var urls = [];
    var names = [];
    try { fileIds = JSON.parse(data[i][fileIdsCol]); } catch(e) { fileIds = data[i][fileIdsCol] ? [data[i][fileIdsCol]] : []; }
    try { urls = JSON.parse(data[i][urlsCol]); } catch(e) { urls = data[i][urlsCol] ? [data[i][urlsCol]] : []; }
    try { names = JSON.parse(data[i][namesCol]); } catch(e) { names = data[i][namesCol] ? [data[i][namesCol]] : []; }

    var statusVal = String(data[i][statusCol] || "Pending").trim();
    if (!statusVal || statusVal.includes("T") || statusVal.length > 20) {
      statusVal = "Pending";
    }

    results.push({
      id: data[i][idCol],
      name: data[i][nameCol],
      aadhaar: String(data[i][aadhaarCol]),
      phone: String(data[i][phoneCol]),
      driveFileIds: fileIds,
      driveUrls: urls,
      fileNames: names,
      status: statusVal,
      createdTime: data[i][createdCol] || new Date().toISOString()
    });
  }

  return { success: true, data: results };
}

function updateCustomer(data) {
  var sheet = getCustomerSheet();
  ensureStatusColumn(sheet);

  var values = sheet.getDataRange().getValues();
  var colMap = getColumnMap(sheet);

  var idCol = (colMap["id"] || 1) - 1;
  var nameColNum = colMap["name"] || 2;
  var aadhaarColNum = colMap["aadhaar"] || 3;
  var phoneColNum = colMap["phone"] || 4;
  var fileIdsColNum = colMap["drive file ids"] || 5;
  var urlsColNum = colMap["drive urls"] || 6;
  var namesColNum = colMap["file names"] || 7;
  var statusColNum = colMap["status"] || 8;

  var targetId = String(data.id || "").trim();

  for (var i = 1; i < values.length; i++) {
    var rowId = String(values[i][idCol] || values[i][0] || "").trim();
    if (rowId === targetId) {
      if (data.name) sheet.getRange(i + 1, nameColNum).setValue(data.name);
      if (data.aadhaar !== undefined) sheet.getRange(i + 1, aadhaarColNum).setValue(data.aadhaar);
      if (data.phone) sheet.getRange(i + 1, phoneColNum).setValue(data.phone);
      if (data.driveFileIds) sheet.getRange(i + 1, fileIdsColNum).setValue(JSON.stringify(data.driveFileIds));
      if (data.driveUrls) sheet.getRange(i + 1, urlsColNum).setValue(JSON.stringify(data.driveUrls));
      if (data.fileNames) sheet.getRange(i + 1, namesColNum).setValue(JSON.stringify(data.fileNames));
      if (data.status) sheet.getRange(i + 1, statusColNum).setValue(data.status);

      SpreadsheetApp.flush();
      return { success: true, message: "Customer updated" };
    }
  }
  return { success: false, message: "Customer record not found" };
}

function deleteCustomer(data) {
  var sheet = getCustomerSheet();
  var values = sheet.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    if (values[i][0] == data.id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: "Customer deleted" };
    }
  }
  return { success: false, message: "Customer record not found" };
}

// ----------------- GOOGLE DRIVE FILE UPLOAD -----------------
function getTargetFolder() {
  var folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(FOLDER_NAME);
  }
}

function uploadFiles(data) {
  var folder = getTargetFolder();
  var files = data.files || [];
  var uploadedResults = [];

  for (var i = 0; i < files.length; i++) {
    var fileObj = files[i];
    var base64Data = fileObj.base64.split(",")[1] || fileObj.base64;
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, fileObj.mimeType || "application/octet-stream", fileObj.name);
    
    var createdFile = folder.createFile(blob);
    createdFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    uploadedResults.push({
      fileName: createdFile.getName(),
      driveLink: createdFile.getUrl(),
      fileId: createdFile.getId()
    });
  }

  return { success: true, files: uploadedResults };
}

// ----------------- DASHBOARD ANALYTICS API -----------------
function getDashboardStats() {
  var budgetSheet = getBudgetSheet();
  var bData = budgetSheet.getDataRange().getValues();
  var today = formatLocalDate(new Date());

  var currentBalance = 0;
  var todayIncome = 0;
  var todayExpense = 0;
  var todayInvestment = 0;
  var todayFund = 0;
  var todayTransactions = 0;

  if (bData.length > 1) {
    // Current balance from last row's balance column (col 7 index 6)
    currentBalance = parseFloat(bData[bData.length - 1][6]) || 0;

    for (var i = 1; i < bData.length; i++) {
      var rowDate = formatLocalDate(bData[i][1]);
      var type = String(bData[i][2]).trim();
      var amount = parseFloat(bData[i][5]) || 0;

      if (rowDate === today) {
        todayTransactions++;
        if (type === "Income") todayIncome += amount;
        if (type === "Expense") todayExpense += amount;
        if (type === "Investment") todayInvestment += amount;
        if (type === "Fund") todayFund += amount;
      }
    }
  }

  var feedbackSheet = getFeedbackSheet();
  var fData = feedbackSheet.getDataRange().getValues();
  var totalFeedback = Math.max(0, fData.length - 1);

  var customerSheet = getCustomerSheet();
  var cData = customerSheet.getDataRange().getValues();
  var totalCustomers = Math.max(0, cData.length - 1);

  return {
    success: true,
    currentBalance: currentBalance,
    todayIncome: todayIncome,
    todayExpense: todayExpense,
    todayInvestment: todayInvestment,
    todayFund: todayFund,
    todayTransactions: todayTransactions,
    totalCustomers: totalCustomers,
    totalFeedback: totalFeedback
  };
}
