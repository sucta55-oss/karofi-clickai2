function doPost(e) {
  // ID của Google Sheet từ yêu cầu của bạn
  var sheetId = "1quwMjL8qEUAMTl5Ue8js4slTiwtYZ5E8-4_gB4m8gKc";
  var ss = SpreadsheetApp.openById(sheetId);
  var sheet = ss.getSheets()[0]; // Lấy sheet đầu tiên
  
  try {
    // Lấy dữ liệu từ request
    var data = JSON.parse(e.postData.contents);
    
    // Tạo mảng dữ liệu theo thứ tự các cột A-F
    // A: Thời gian, B: Họ và tên, C: Số điện thoại, D: Email, E: Địa chỉ giao hàng, F: Thanh toán
    var row = [
      new Date(),       // A: Thời gian
      data.name,        // B: Họ và tên
      data.phone,       // C: Số điện thoại
      data.email,       // D: Email
      data.address,     // E: Địa chỉ giao hàng
      "UNPAID"          // F: Thanh toán (mặc định)
    ];
    
    // Thêm dòng mới vào sheet
    sheet.appendRow(row);
    
    // Trả về kết quả thành công
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Trả về lỗi nếu có
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Hàm test để kiểm tra quyền truy cập (không bắt buộc)
function doGet() {
  return ContentService.createTextOutput("Google Apps Script for Karofi Landing Page is running!");
}
