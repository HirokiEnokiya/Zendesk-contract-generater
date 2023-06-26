/**
 * コンテナのgoogleフォームの回答から労働条件通知書を生成する関数
 * @param {Object} inputobject 成形したオブジェクト
 * @returns {pdf} 労働条件通知書のpdfのURL
 */
function makeContract(object) {

//送信されたフォームから回答、メールアドレス、タイムスタンプを取得
  const today = formatTimestamp(new Date());

  // 条件分岐からテンプレートを選択

  const srcDoc = selectTemplate(object);
  // const folder = selectFolder(senderEmail);
  const folder = DriveApp.getFolderById("1_ntJpHl91XbrV3VSPAi6P6IRFB9L2ZSq");
  const fileName = createFileName(object,today);
  const replacedDoc   = srcDoc.makeCopy(fileName, folder);
  const replacedDocId = replacedDoc.getId();
  console.log(replacedDocId);

// ドキュメント内のプレースホルダーを置換
  replaceTextDoc(replacedDocId,object,today);

//ドキュメントをpdfでエクスポート
  const pdf = replacedDoc.getAs('application/pdf').setName(fileName);
  const contract = folder.createFile(pdf); //GoogleドライブにPDFに変換したデータを保存

// 複製したファイルをゴミ箱へ移動
  replacedDoc.setTrashed(true);

// // 回答者にフォルダーの編集権限を付与
//   drivePermissionInsert(senderEmail,folder.getId());

  const ticketId = object["ticketId"];
  console.log(ticketId);

  // addPrivateTicketComment(ticketId,`{"body:${contract.getUrl()}}`);
  addPrivateTicketComment(ticketId,contract.getUrl());
  console.log(contract.getUrl());
}

/** 
 * タイムスタンプを年月日の表記の文字列にする関数
 * @param {DATE} timestamp 送信時のタイムスタンプ
 * @return {String} *年*月*日の表記にした文字列
*/
function formatTimestamp(timestamp){
  const year = timestamp.getFullYear();
  const month = timestamp.getMonth() + 1;
  const day = timestamp.getDate();

  return `${year}年${month}月${day}日`;
}

/** 
 * オブジェクトからテンプレートを判別する関数
 * @param {object} inputObject
 * @return {Document} templateId テンプレートドキュメントID
*/
function selectTemplate(inputObject) {

  const branchsArray = getBranchDataArray();
  let templateId;

  // 条件分岐を1つずつ検証
  for(i=0;i<branchsArray.length;i++){
    const branchObject = branchsArray[i];
    // フォームでの分岐
    if(inputObject['ticketFormId'] === branchObject['ticketFormId']){
      console.log("フォームが合致");
      const fieldBranches = branchObject.fieldBranches;
      console.log(fieldBranches);
      let counter = 0;
      for(id in fieldBranches){
        console.log(inputObject[id]);
        console.log(fieldBranches[id]);
        if(inputObject[id] === fieldBranches[id] || id === ""){counter++}
        console.log(counter);
      }
      if(counter === Object.keys(fieldBranches).length){
        // 条件クリア
        templateId = branchObject['templateId'];
      }
    }
  }

  try{
    const templateFile = DriveApp.getFileById(templateId);
    console.log(templateFile.getName());
    return templateFile;
  }catch(e){
    console.log("適切なテンプレートが設定されていません。");
    return;
  }
}

/**
 * スプレッドシートの条件分岐のデータをオブジェクトにして、それを格納した配列を返す関数
 */
function getBranchDataArray(){
  const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  const branchSheet = spreadSheet.getSheetByName("BranchDB");
  const tableValues = branchSheet.getRange(2,1,branchSheet.getLastRow()-1,12).getValues();

  let branchsArray = [];

  for(i=0;i<tableValues.length;i++){
    const rowBranchData = tableValues[i];
    const branchObj = {
      templateId : rowBranchData[0],
      ticketFormId : rowBranchData[2],
      fieldBranches : {
        [rowBranchData[4]]: rowBranchData[5], //分岐1
        [rowBranchData[7]]: rowBranchData[8], //分岐2
        [rowBranchData[10]]: rowBranchData[11], //分岐3
      }
    }
    delete branchObj.fieldBranches[""];
    console.log(branchObj);
    branchsArray.push(branchObj);
  }

  return branchsArray;
}

/**
 * オブジェクトからファイル名を生成する関数
 * @param {object} inputObjcet 質問と回答を格納したオブジェクト
 * @param {String} date 送信時の日付
 * @returns {String} 労働条件通知書のファイル名
 * @exmaple 労働条件通知書_デモ太郎_02月15日
 * 
 */
function createFileName(inputObject,date) {
  return `契約書_${inputObject['12706711489177']}_${date}`;
}

/**
 * ドキュメント上でオブジェクトのキーに一致する文字列を置換する関数
 * @param {Document} targetDocId 置換対象のドキュメントのID
 * @param {object} answers 質問と回答を格納したオブジェクト
 * @param {DATE} today 送信時の日付
 */
function replaceTextDoc(targetDocId,answers,today) {
  console.log(answers);
  try {
    const targetDoc = DocumentApp.openById(targetDocId);
    console.log(targetDoc.getName());
    const targetDocBody = targetDoc.getBody();
    targetDocBody.replaceText(`{タイムスタンプ}`, today);
// ドキュメント内のプレースホルダーを置換
    for(const key in answers){
      if(answers[key] !== null){
        targetDocBody.replaceText(`{${key}}`,answers[key]);   
      }
    }

    targetDocBody.replaceText('{.*?}','');

    //置換したドキュメントを保存
    targetDoc.saveAndClose();


  }catch (error) {
    console.log('文書を正しく置換できません：' + error.message);
    throw new error('Failed to repace text.');
  }
}


