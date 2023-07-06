function onOpenFunctions() {
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const dashboard = spreadSheet.getSheetByName("ダッシュボード");
  const statusBar = dashboard.getRange("G2");
  statusBar.setValue("DB更新中...");

  try{
    updateAllDb();
  }catch(e){
    console.log(e);
    dashboard.getRange("G2").setValue("エラー");
    return;
  }



  const updateTime = Utilities.formatDate(new Date(),"Asia/Tokyo","MM/dd HH:mm");
  dashboard.getRange("G2").setValue(updateTime);
}
