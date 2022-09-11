/**

* @OnlyCurrentDoc

*/

function quickLog(){ //im using this for testing purposes easily since you can just run it from here
    Logger.log(tiers.getNum("A+"))
    Logger.log(tiers.getTier(3))
    const penis = management.getRange(7, 4, 1, 4).getDisplayValues()
    Logger.log(tierRange)
    const test = tierRange[0]
    Logger.log(typeof test)
    Logger.log( tiers.numToTier(86))
    Logger.log( catalogue.getIGN("a54be91e845747a78aa6bb0f99a47002") )
    Logger.log( sheetGet("Personnel").getRange(1,1,sheetGet("Personnel").getMaxRows()).getA1Notation() )
      const searchRange = sheetGet("Personnel").getRange(2,1,sheetGet("Personnel").getLastRow());
      const searchValues = searchRange.getValues();
      Logger.log(searchValues)
          const searchFind = searchRange.createTextFinder("FFC2D071").findNext()
          Logger.log(searchFind.getRow())
    const fuckpoop = {
      name: "",
      id: "",
      balls: "",
    }
  }
  
  const sps = SpreadsheetApp.getActive(); //These constants are pretty important and are used consistently everywhere
  const management = sps.getSheetByName("Management");
  const sheetGet = (sheetname) => sps.getSheetByName(sheetname); //ashley, fucking simplify getting Sheet objects lol (takes string)
  
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step)); /*
  generates an array of a sequence of numbers from start to stop (inclusive) in increments of step
  stole it from mozilla javascript documentation lol
  it'll prolly come in handy for something else later */
  
  const rulesCheckbox = SpreadsheetApp.newDataValidation()
      .requireCheckbox("ACTIVE", "DISCHARGE")
      .setAllowInvalid(false)
      .setHelpText('CLICK THE CHECKMARK SMH MY HEAD >:(')
      .build();
  
  /* fix this, validation rules for ranks
    const rulesRanks = SpreadsheetApp.newDataValidation()
      .requireCheckbox()
      .setAllowInvalid(false)
      .setHelpText('penis')
      .build();
  */
  
  function triggerEdit(e){ //Called upon (user) edit of spreadsheet. Event object e is used
  
    const editedSheet = e.range.getSheet();//These establish properties about the actual edit
    const editedColumn = e.range.getColumn();
    const editedRow = e.range.getRow();
    const validColumns = [4,5,6,7,9];
  
    if (editedSheet.getName() == "Training log" && validColumns.indexOf(editedColumn) !== -1 && editedRow !== 1 ){ //Checks for user edit in training log
  
      editedSheet.getRange(editedRow, 1).setValue(new Date()); //Updates the same row of the time column as the edit on the training log with the time of edit.
      Logger.log("Date updated for row " + editedRow);
  
      const tierCopier = sheetGet("Training log").getRange(editedRow, 4, 1, 4).getDisplayValues(); //Calculates someone's tier
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
          const personnel = sps.getSheetByName('Personnel').getRange(editedRow, 1);
          const idGen = Math.floor(Math.random() * 4294967295).toString(16);
          personnel.setValue(idGen.toUpperCase());
          const createCheckbox = management.getRange(editedRow + 1, 5);
          createCheckbox.setValue("ACTIVE");
          createCheckbox.setDataValidation(rulesCheckbox);
          /*
          const createRanks = management.getRange(70, 6);
          createRanks.setValue("ELIGIBLE");
          createRanks.setDataValidation(rulesRanks);
          return Logger.log("big penis 69");
          */
      }
  };
  