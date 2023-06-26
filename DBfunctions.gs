/**
 * フォーム名とフォームIDの対応のDBを更新する関数
 */
function updateFormDb() {
  const jsonData = callZendeskApiV2("GET",`ticket_forms.json`,null);
  const formList = jsonData.ticket_forms;
  let outputArray = [];
  for(i=0;i<formList.length;i++){
    const formName = formList[i].name;
    const formId = formList[i].id;
    outputArray.push([formId,formName]);
  }
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const formDb = spreadSheet.getSheetByName("FormDB");
  formDb.getRange(2,1,formDb.getLastRow()-1,formDb.getLastColumn()).clearContent();
  formDb.getRange(2,1,outputArray.length,2).setValues(outputArray);

}

/**
 * フィールド名とフィールドIDの対応のDBを更新する関数
 */
function updateFieldDb() {
  const jsonData = callZendeskApiV2("GET",`ticket_fields.json`,null);
  const fieldList = jsonData.ticket_fields;
  let outputArray = [];
  for(i=0;i<fieldList.length;i++){
    const fieldTitle = fieldList[i].title;
    const fieldId = fieldList[i].id;
    const type = fieldList[i].type;
    if(fieldList[i].active === true){
      outputArray.push([fieldId,fieldTitle,type]);
    }
  }
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const fieldDb = spreadSheet.getSheetByName("FieldDB");
  fieldDb.getRange(2,1,fieldDb.getLastRow()-1,fieldDb.getLastColumn()).clearContent();
  fieldDb.getRange(2,1,outputArray.length,3).setValues(outputArray);
  fieldDb.getRange(2,1,outputArray.length,3).sort({column:1,ascending:true});
}

/**
 * プルダウンの選択肢を更新する関数
 */
function updatePulldownOptions(){
  // TODO:なぜかsetDataValidationsできなかったので見直して一気に設定できるようにする
  const dashboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ダッシュボード');
  const formDb = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FormDB');
  const fieldDb = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('FieldDB');

  const formPulldownOptions = formDb.getRange(2,2,formDb.getLastRow()-1,1).getValues().flat();
  const formPulldownRange = dashboard.getRange('E3');
  makeInputValidation(formPulldownRange,formPulldownOptions);

  const fieldPulldownOptions = fieldDb.getRange(2,2,fieldDb.getLastRow()-1,1).getValues().flat();
  for(i=0;i<5;i++){
    const fieldPulldownRange = dashboard.getRange(4+(i*2),5);
    makeInputValidation(fieldPulldownRange,fieldPulldownOptions);
  }

}

/**
 * DBをすべて更新する関数
 */
function updateAllDb(){
  updateFormDb();
  updateFieldDb();
  updatePulldownOptions();

}

/**
 * 条件分岐の追加フィールドの内容をDBに追加する関数
 */
function addBranch(){
   const dashboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ダッシュボード');
   const branchDb = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('BranchDB');
   const dataArray = dashboard.getRange(2,5,12,1).getValues().flat();
   const row = getLastRowInRange(branchDb.getRange(1,1,branchDb.getLastRow(),1))+1;
   const outputArray = [
    dataArray[0],
    dataArray[1],
    `=IF(ISBLANK(B${row}),"",QUERY(FormDB!$A$2:$B,"select A where B = '"&B${row}&"'",false))`,
    dataArray[2],
    `=IF(ISBLANK(D${row}),"",QUERY(FieldDB!$A$2:$B,"select A where B = '"&D${row}&"'",false))`,
    dataArray[3],
    dataArray[4],
    `=IF(ISBLANK(G${row}),"",QUERY(FieldDB!$A$2:$B,"select A where B = '"&G${row}&"'",false))`,
    dataArray[5],
    dataArray[6],
    `=IF(ISBLANK(J${row}),"",QUERY(FieldDB!$A$2:$B,"select A where B = '"&J${row}&"'",false))`,
    dataArray[7],
    dataArray[8],
    `=IF(ISBLANK(M${row}),"",QUERY(FieldDB!$A$2:$B,"select A where B = '"&M${row}&"'",false))`,
    dataArray[9],
    dataArray[10],
    `=IF(ISBLANK(P${row}),"",QUERY(FieldDB!$A$2:$B,"select A where B = '"&P${row}&"'",false))`,
    dataArray[11]
    ];
   branchDb.getRange(row,1,1,18).setValues([outputArray]);

   clearField();

   Browser.msgBox("条件分岐を追加しました。");

}

/**
 * 条件分岐の追加フィールドの内容をクリアする関数
 */
function clearField(){
  const dashboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ダッシュボード');
  dashboard.getRange(2,5,12,1).clearContent();
}