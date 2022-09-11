function range(start, stop, step) {
    return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
} /*
generates an array of a sequence of numbers from start to stop (inclusive) in increments of step
stole it from mozilla javascript documentation lol
it'll prolly come in handy for something else later */

const sps = SpreadsheetApp.getActive(); //These constants are pretty important and are used consistently everywhere
const management = sps.getSheetByName("Management");
const sheetGet = sheetname => sps.getSheetByName(sheetname); //ashley, fucking simplify getting Sheet objects lol (takes string)

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
    
export * from "./handlers.js"