/**
 * 契約書を作成し、リンクをもとのチケットの社内メモに追加する関数
 */
function main(){
  // チケットのデータを取得
  const tidyArray = getDetailsByWaitList();
  // チケット１つずつ処理
  for(i=0;i<tidyArray.length;i++){
    const inputObject = tidyArray[i];
    makeContract(inputObject);
  }
  Browser.msgBox("契約書のリンクをチケットコメントとして追加しました。");
}