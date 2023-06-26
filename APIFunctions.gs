/**
 * ticketIdを指定してチケットの詳細データを取ってくる関数
 * @param {String} ticketId
 */
function getDataByTicketId(ticketId) {
  const jsonData = callZendeskApiV2("GET",`tickets/${ticketId}.json`,null);
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName("処理用");

  console.log(jsonData);

  // sheet.getRange("A1").setValue(jsonData);
}

/**
 * ticketIdを指定してチケットのフォームidを取ってくる関数
 * @param {String} ticketId
 */
function getFormIdByTicketId(ticketId) {
  const jsonData = callZendeskApiV2("GET",`tickets/${ticketId}.json`,null);
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadSheet.getSheetByName("処理用");

  // sheet.getRange("A1").setValue(jsonData.ticket_form_id);
  console.log(jsonData.ticket.ticket_form_id);
}

/**
 * waitListでチェックボックスが付けられたidのチケットについて詳細データを取ってきて成形したオブジェクトを返す関数
 * @returns {Array} outputArray 成形したオブジェクトを格納した配列
 * @example [{チケット1のデータ},{チケット2のデータ},...]
 */
function getDetailsByWaitList(){
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const waitListSheet = spreadSheet.getSheetByName("契約書作成");
  const waitList = waitListSheet.getRange(2,1,waitListSheet.getLastRow()-1,1).getValues().flat();
  const checkBoxList = waitListSheet.getRange(2,4,waitListSheet.getLastRow()-1,1).getValues().flat();
  let idList = [];
  for(i=0;i<waitList.length;i++){
    if(checkBoxList[i] === true){
      idList.push(waitList[i]);
      waitListSheet.getRange(i+2,4).setValue(false);
    }
  }
  const jsonData = callZendeskApiV2("GET",`tickets/show_many?ids=${idList.join(",")}`);
  console.log(jsonData);

  const SYSTEM_TICKET_FIELD_IDS = {
    subject : 12706711489177,
    description : 12706710476185,
    type : 12706710480409,
    priority : 12706696354201,
    group_id : 12706728070297, //怪しい
    assignee_id : 12706683666329, //怪しい
    status : 12706728062873,
  }

  // データの成形
  let outputArray = [];
  for(i=0;i<jsonData.tickets.length;i++){
    let margedFiledData;
    const ticketInfo = jsonData.tickets[i];

    let systemFieldData = [];
    for(key in SYSTEM_TICKET_FIELD_IDS){
      const tmpObj = {id :SYSTEM_TICKET_FIELD_IDS[key] ,value:ticketInfo[key]};
      systemFieldData.push(tmpObj);
    }
    const customFieldData = ticketInfo.custom_fields;
    margedFiledData = systemFieldData.concat(customFieldData);
    let tidyObj = margedFiledData.reduce((obj, { id, value }) => {
    obj[id] = value;
    return obj;
  }, {});
  tidyObj['ticketFormId']=ticketInfo['ticket_form_id'];
  tidyObj['ticketId']=ticketInfo['id'];
  outputArray.push(tidyObj);
  }

  console.log(outputArray);
  return outputArray;

}

/**
 * 社内メモを追加する関数
 * @param {String} contentText 社内メモの内容
 * @param {Number} ticketId 社内メモを追加するチケットのid
 * TODO:チケットIDをどう特定するか.後々チケットIDを選ぶ関数を実装する可能性もある.
 */
function addPrivateTicketComment(ticketId,contentText){
  let data = JSON.stringify({
    "ticket": {
      "comment": {
        "body": contentText,
        "public": false
      }
    }
  })
  callZendeskApiV2("PUT",`tickets/${ticketId}.json`,data);
}

/**
 * チケットコメントを社内メモにする関数
 * @param {String} ticketCommentId
 */

function eee(){
  addPrivateTicketComment(1,'This Is TEST.');
}



