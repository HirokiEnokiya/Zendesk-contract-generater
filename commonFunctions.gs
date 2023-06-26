/**
 * ZendeskAPIをたたく関数
 * @param {String} method GET,POST,PUT
 * @param {String} endpoint "~api/v2"以降の文字列
 * @param {String} data -dオプションの中身
 */
function callZendeskApiV2(method,endpoint,data){
  const API_TOKEN = PropertiesService.getScriptProperties().getProperty("API_TOKEN");
  const EMAIL_ADRESS = PropertiesService.getScriptProperties().getProperty("EMAIL_ADRESS");

  const url = 'https://choidigiboaas.zendesk.com/api/v2/'+endpoint;
  const options = {
    'method': method,
    'contentType': 'application/json',
    'payload':data,
    'muteHttpExceptions' : false,
    'headers':{
      'Authorization': 'Basic '+ Utilities.base64Encode(`${EMAIL_ADRESS}/token:${API_TOKEN}`)
    },
  };

  console.log(url);
  try{
    const response = UrlFetchApp.fetch(url ,options);
    const json = response.getContentText();
    const jsonData = JSON.parse(json)
    // console.log(jsonData);
    return jsonData;
  }catch(e){
    Logger.log("Error:"+e);
  }


}


/**
 * 範囲内の最終列を取得する関数
 * @param range {Range} 範囲
 * @return lastColumn {Number} 最終列
 */
function getLastColumnInRange(range){
  const matrix = range.getValues();
  const firstColumn = range.getColumn();
  const rangeHeight = range.getLastRow() - range.getRow() + 1;
  let maxRowLength = 0;
  for(i=0;i<rangeHeight;i++){
    let length = matrix[i].filter(value => value).length;
    if(length > maxRowLength){
      maxRowLength = length;
    }
  }
  const lastColumn = firstColumn + maxRowLength - 1;
  return lastColumn;
  
}

/**
 * 範囲内の最終列を取得する関数
 * @param range {Range} 範囲
 * @return lastRow {Number} 最終列
 */
function getLastRowInRange(range){
  let matrix = range.getValues();
  const firstRow = range.getRow();
  const rangeWidth = range.getLastColumn() - range.getColumn() + 1;
  let maxColumnLength = 0;
  matrix = transposeMatrix(matrix);
  console.log(matrix);
  for(i=0;i<rangeWidth;i++){
    let length = matrix[i].filter(value => value).length;
    if(length > maxColumnLength){
      maxColumnLength = length;
    }
  }
  const lastRow = firstRow + maxColumnLength - 1;
  return lastRow;
  
}

/**
 * 引数の配列の要素を選択肢としたプルダウンをつくる関数
 * @param {Range} pulldownRange
 * @param {Array} options
 */
function makeInputValidation(pulldownRange,options){
  const rules = SpreadsheetApp.newDataValidation().requireValueInList(options).build();
  pulldownRange.setDataValidation(rules);
}


/**
 * 行列を転置する関数
 */
function transposeMatrix(matrix) {
  var transposedMatrix = [];
  
  for (var i = 0; i < matrix[0].length; i++) {
    transposedMatrix.push([]);
    for (var j = 0; j < matrix.length; j++) {
      transposedMatrix[i].push(matrix[j][i]);
    }
  }
  
  return transposedMatrix;
}