function myFunction() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('契約書作成');
  sheet.insertRows(2);
}

function test(){
  addPrivateTicketComment(6,"更新");
}
