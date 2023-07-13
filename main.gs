/**
 * 契約書を作成し、リンクをもとのチケットの社内メモに追加する関数
 */
function main(){
  // チケットのデータを取得
  const tidyArray = getDetailsByWaitList();
  if(tidyArray === undefined){
    return;
  }
  // チケット１つずつ処理
  try{
    for(i=0;i<tidyArray.length;i++){
      const inputObject = tidyArray[i];
      makeContract(inputObject);
    }
  }catch(e){
    return;
  }
  Browser.msgBox("契約書のリンクをチケットコメントとして追加しました。");
}