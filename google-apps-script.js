function doPost(e) {
  var sheetId = "1quwMjL8qEUAMTl5Ue8js4slTiwtYZ5E8-4_gB4m8gKc";
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheets()[0];
  
  try {
    var data = e.parameter;
    if (!data.orderId && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {}
    }
    
    var action = data.action || "create";
    var orderId = data.orderId || "";

    // TRƯỜNG HỢP 1: CẬP NHẬT TRẠNG THÁI THANH TOÁN (PAID)
    if (action === "update") {
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        // Cột I (chỉ số 8) là Mã đơn hàng
        if (rows[i][8] == orderId) {
          // Cột F (chỉ số 5) là trạng thái Thanh toán
          sheet.getRange(i + 1, 6).setValue("PAID");
          return ContentService.createTextOutput(JSON.stringify({ "result": "updated" }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ "result": "not_found" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // TRƯỜNG HỢP 2: TẠO ĐƠN HÀNG MỚI (UNPAID)
    var row = [
      new Date(),           // A: Thời gian
      data.name || "",      // B: Họ và tên
      data.phone || "",     // C: Số điện thoại
      data.email || "",     // D: Email
      data.address || "",   // E: Địa chỉ giao hàng
      "UNPAID",             // F: Thanh toán
      "",                   // G: Trống
      "",                   // H: Trống
      orderId               // I: Mã đơn hàng
    ];
    
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ "result": "created" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Google Apps Script v4 (Update Support) is ACTIVE!");
}
