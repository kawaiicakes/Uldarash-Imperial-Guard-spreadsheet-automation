/**

* @OnlyCurrentDoc

*/

var sps = SpreadsheetApp.getActive(); 
var columnNumToLetter = ["A","B","C","D","E","F", "G", "H"]; //This array allows conversion from a column number to its equivalent letter.
var management = sps.getSheetByName("Management");
var rulesCheckbox = SpreadsheetApp.newDataValidation()
    .requireCheckbox("ACTIVE", "DISCHARGE")
    .setAllowInvalid(false)
    .setHelpText('CLICK THE CHECKMARK SMH MY HEAD >:(')
    .build();

/*var rulesRanks = SpreadsheetApp.newDataValidation()
    .requireCheckbox()
    .setAllowInvalid(false)
    .setHelpText('penis')
    .build();
*/

function triggerEdit(e){ //Called upon (user) edit of spreadsheet. Event object e is used

  var editedSheet = e.range.getSheet();//These establish properties about the actual edit
  var editedColumn = e.range.getColumn();
  var editedRow = e.range.getRow();

  var editedCell = editedSheet.getName() + "!"+ columnNumToLetter[editedColumn - 1] + editedRow; //This spits out a string for the edited cell in A1 notation
  let desiredCell = "INFO!B32"; //declaring this variable using let in case i want to easily change args in a conditional statement without having 9,000,000,000 different variables. Used to define the cell name we want (as a string) in A1 notation. i need to learn how to use Promise() and async before i can use await for this purpose (async only works with Node.js rip)

  if (editedSheet.getName() == "Training log" && editedColumn !== 1 && editedRow !== 1 ){ //Checks if edited sheet is the training one and the edited rows/columns are not row/column 1
    Logger.log("Date updated for row " + editedRow);
    editedSheet.getRange(editedRow, 1).setValue(new Date()); //Updates the same row of the time column as the edit on the training log with the time of edit.

  } else if ( editedCell == desiredCell ){ 
      Logger.log("B32 edited!");
      var createCheckbox = management.getRange(70, 5);
      var createRanks = management.getRange(70, 6);
      createCheckbox.setValue("ACTIVE");
      createCheckbox.setDataValidation(rulesCheckbox);
      /*
      createRanks.setValue("ELIGIBLE");
      createRanks.setDataValidation(rulesRanks);
      return Logger.log("big penis 69");
      */

  } else {
      return Logger.log("NO CRITERIA SATISFIED");
  }
};

function triggerSubmit(e) {

  var editedSheet = e.range.getSheet();//These establish properties about the actual edit
  var editedColumn = e.range.getColumn();
  var editedRow = e.range.getRow();
  var submitLocation = editedSheet.getName();

    if (submitLocation == 'Enlistment form responses') {
        sps.getRange('INFO!B24').copyTo(sps.getSheetByName('Personnel').getRange(editedRow, 1), SpreadsheetApp.CopyPasteType.PASTE_VALUES, false)
    } else if (submitLocation == 'Officer form responses') {
        return
    }
};