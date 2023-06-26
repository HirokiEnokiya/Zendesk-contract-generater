function doPost(e) {
  // WebHookで取得したJSONデータをオブジェクト化し、取得
  let response = JSON.parse(e.postData.contents);
  console.log("response:");
  console.log(response);
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName("契約書作成");
  
  try{
    const ticketData = response.ticket;
    const ticketId = Number(ticketData.id); 
    const subject = ticketData.subject;
    const ticketForm = ticketData.ticket_form;
    if(!ticketForm){
      return;
    }

    const ticketIdList = sheet.getRange(1,1,sheet.getLastRow(),1).getValues().flat();
    let ticketIdIndex = ticketIdList.indexOf(ticketId);
    if(ticketIdIndex == -1){
      sheet.insertRows(2);
      sheet.getRange(2,1,1,3).setValues([[ticketId,new Date(),subject]]);
      sheet.getRange(2,4).insertCheckboxes();
    }else{
      const row = Number(ticketIdIndex) + 1;
      sheet.getRange(row,1,1,3).setValues([[ticketId,new Date(),subject]]);
      sheet.getRange(row,4).insertCheckboxes();
    }

      
  }catch(ERROR){
    console.log(ERROR);
  }

}
