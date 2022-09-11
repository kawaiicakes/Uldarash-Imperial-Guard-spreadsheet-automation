/**

* @OnlyCurrentDoc

*/
  
  import * as handlers from './handlers.js'

  //const tierColumn = editedSheet.getRange( row, 8 ); put this somewhere lol
  
  function triggerEdit(e){ //Called upon (user) edit of spreadsheet. Event object e is used
  
    const editedSheet = e.range.getSheet();//These establish properties about the actual edit
    const editedColumn = e.range.getColumn();
    const editedRow = e.range.getRow();
    const validColumns = [4,5,6,7,9];
  
    if (editedSheet.getName() == "Training log" && validColumns.indexOf(editedColumn) !== -1 && editedRow !== 1 ){ //Checks for user edit in training log
  
      editedSheet.getRange(editedRow, 1).setValue(new Date()); //Updates the same row of the time column as the edit on the training log with the time of edit.
      Logger.log("Date updated for row " + editedRow);
  
      const tierCopier = handlers.sheetGet("Training log").getRange(editedRow, 4, 1, 4).getDisplayValues(); //Calculates someone's tier
      const tierConversion = tierCopier[0].map( (x) => tiers.getNum(x) );
      const tierSum = Math.round( tierConversion[0] * 2.5 + tierConversion[1] + tierConversion[2] + tierConversion[3] * 0.5 );
      const tierConverted = tiers.numToTier(tierSum);
      const tierColumn = editedSheet.getRange(editedRow, 8);
  
        tierConversion.includes(-1) ? //Tests to see if any tier columns are empty
          tierColumn.setValue("UNRATED") :
          tierColumn.setValue(tierConverted);
    }
  };
  
  function triggerSubmit(e) { //Called when a form is submitted
  
    const editedSheet = e.range.getSheet();//These establish properties about the actual edit
    const editedColumn = e.range.getColumn();
    const editedRow = e.range.getRow();
    const submitLocation = editedSheet.getName();
  
      if (submitLocation == 'Enlistment form responses') { //This is what must occur when someone enlists
          const personnel = handlers.sps.getSheetByName('Personnel').getRange(editedRow, 1);
          const idGen = Math.floor(Math.random() * 4294967295).toString(16);
          personnel.setValue(idGen.toUpperCase());
          const createCheckbox = handlers.management.getRange(editedRow + 1, 5);
          createCheckbox.setValue("ACTIVE");
          createCheckbox.setDataValidation(rulesCheckbox);
          /*
          const createRanks = handlers.management.getRange(70, 6);
          createRanks.setValue("ELIGIBLE");
          createRanks.setDataValidation(rulesRanks);
          return Logger.log("big penis 69");
          */
      }
  };
  