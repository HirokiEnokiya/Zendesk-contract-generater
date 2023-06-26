function myFunction() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('契約書作成');
  sheet.insertRows(2);
}

function test(){
  const transpose = a=> a[0].map((_, c) => a.map(r => r));
 
  var array = [['北海道', '札幌市'], ['栃木県','宇都宮市'], ['愛知県','名古屋市'], ['鹿児島県','鹿児島市']];
  console.log(array);
  array = transpose(array);
  console.log(array);
}
