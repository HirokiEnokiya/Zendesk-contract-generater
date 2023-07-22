function myFunction() {

  const key = "13729524994457"
  // const string = "{aiueo#これは注釈です}"
  const array = ["#姓{13729524994457}","これは注釈です{aiueo}","#これは注釈です{aeo}","{13729524994457}"];
  for(string of array){
    const regex = new RegExp(`(#.*)?(\\s)*\\{${key}\\}`);
    const result = string.replace(/(#.*)?(\s)*\{13729524994457\}/,"answers[key]");
    console.log(regex.toString());
  }

}

function test(){
  // callZendeskApiV2("GET","tickets/35/comments",null);
  // const ticketForm = callZendeskApiV2("GET","tickets/35.json",null).ticket.ticket_form;
  console.log(getDataByTicketFormId(20347867994905).ticket_form.name);
}
