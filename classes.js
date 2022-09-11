import * as handlers from './handlers.js'

class Tiers { //This class has properties and methods relating to tiers and their number equivalents

    static Tiers = ["UNRATED", "F-", "F", "F+", "D-", "D", "D+", "C-", "C", "C+",
    "B-", "B", "B+", "A-", "A", "A+", "S-", "S", "S+"];

    static getTier( tiernum ) {
    return this.Tiers[ tiernum ]; //takes number and converts it to string tier
  };

    static getNum( tierchr ) {
    return this.Tiers.indexOf( tierchr ) //takes string and converts it to (integer) base score of a tier
  };
  
    static numToTier( num ) {

        const lastTierArrayIndex = 18; //This is the total number of elements in the tier array; one for each tier (including with +/- modifiers)
        const tierRange = []; 
        for (let i = 0; i < lastTierArrayIndex; i++) {
              tierRange[i]= handlers.range(1+5*i,5+5*i,1);
            };
        tierRange.unshift([0]); //Returns a two dimensional array of numeric tier score ranges whose indices line up with their respective tiers

        for (i = 0; i < tierRange.length; i++ ) {
          if( tierRange[i].includes( num ) == true ) {
          return this.Tiers[i]; //This returns the tier of the score range.
      };
    };
  }; //convert a tier score to tier, takes a number from 0-90

    static tierCalculator( row ) { //row param refers to the row number someone sits on.
        const tierCopier = handlers.getSheet("Training log").getRange( row, 4, 1, 4 ).getDisplayValues(); //Obtains 2D array of tier letters, [1] is useless
        const tierConversion = tierCopier[0].map( x => Tiers.getNum(x) ); //maps every element of array [0] (the one we want) and converts to number
        const tierSum = Math.round( tierConversion[0] * 2.5 + tierConversion[1] + tierConversion[2] + tierConversion[3] * 0.5 ); //applies weighting, then sums
        for (const loop of tierConversion) {
          if ( !loop > 0 ) {
        return Tiers.numToTier(0); //This immediately terminates tierCalculator and returns "UNRATED"
            };
        };
        return Tiers.numToTier( tierSum );
    };
};

class Catalogue { //This class has properties and methods regarding personnel; including rank and CQ status

  static stream = { //the stream is the position in the hierarchy one is in, from most senior to least
    officer: { //ranks are listed from most senior to least
      rank: ["Aegis", "Vanguard Aegis", "Captain", "Bannarette", "Vanguard Bannarette"],
      abrv: ["Ags.", "VgAgs.", "Cpt.", "Bnr.", "VgBnr."]
    },
    nco: {
      rank: ["Maven Princeps", "Maven"],
      abrv: ["MvnPcp.", "Mvn."]
    },
    enlisted: {
      rank: ["Eques", "Legionary", "Knight", "Armet", "Cadet"],
      abrv: ["Eqs.", "Lgn.", "Knt.", "Amt.", "Cdt."]
    },
  };

  static CQtier = handlers.sheetGet("INFO").getRange("B23").getDisplayValue(); //Returns display value of CQ tier selector as a string.

  static getPlayerFromIGN = ign => { //takes an IGN and converts it to a simple player object. see getPlayerFromUUID
    try {
      return JSON.parse( UrlFetchApp.fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`).getContentText() );
    } catch {
      return "Invalid IGN!"
    };
  };

  /* takes a UUID and converts it to a simple player object. Note the 
  recursion from getUUID as the APIs provide differently formatted player objects;
  this redundancy is intended.
  Player objects appear as following: {id=a54be91e845747a78aa6bb0f99a47002, name=TheAsianAimbot} 
  p.s. im gonna try and dynamically generate more complex player objects with more info */

  static getPlayerFromUUID = uuid => { 
    try {
      const ign = JSON.parse( UrlFetchApp.fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`) ).name;
      return this.getUUID(ign);
    } catch {
        return "Invalid UUID!"
    };
  };

  static getPlayerRow = id => {
  /* Returns the row # on the Personnel sheet where an ID lives. The ID is (almost certainly) unique and 
  is therefore used to identify each entry on the sheet. If a UUID/Discord has more than one ID,
  something is wrong and any tractor accounts should be discharged ASAP after investigation.
  DO NOT delete the row. Just navigate to Management > Discharge? If we get a duplicate ID then
  we should totally buy a lottery ticket */
    const searchRange = handlers.sheetGet("Personnel").getRange(2,1,sheetGet("Personnel").getLastRow()); //Checks column 1 (IDs) starting from row 2
    const searchMatches = searchRange.createTextFinder(id).findAll();
    const searchLength = searchMatches.length();
    switch (searchLength) {
        case 1:
            return searchMatches[0].getRow();
        case 0:
            return "Invalid ID!";
        default: //it's unlikely that this will ever be needed (except due to script error ;)) 
            return searchMatches.map( x => x.getRow() );
        }
    };

  static isQualified = row => {
    const searchRange = handlers.sheetGet("Personnel").getRange(row, 7).getDisplayValue(); //Checks column 7 (Tiers) at param row
    if ( Tiers.getNum( searchRange ) >= Tiers.getNum( Tiers.CQtier ) ){
        return "ACTIVE";
    } else {
        return "UNQUALIFIED";
    };
  }; //Obtains the CQ status of someone

  static isDischarged = row => {
    const searchRange = handlers.sheetGet("Management").getRange(row + 1, 5).getDisplayValue(); //Checks column 5 (Status) at param row + 1 (management rows are offset by 1)
    return searchRange === "DISCHARGED"
  };

  static isUntested = row => {
    const searchRange = handlers.sheetGet("Training log").getRange(row, 8).getDisplayValue(); //Checks column 8 (Overall tier) at param row
    return searchRange === "UNRATED"
  };

  static isOfficer = row => {
    const searchRange = handlers.sheetGet("Training log").getRange(row, 8).getDisplayValue(); //Checks column 8 (Overall tier) at param row
    return searchRange === "UNRATED"
  };
};

class RowBuilder { //Properties and methods to actually build stuff on the sheet.

    static setStatus = row => { //takes personnel row number as param

        const paste = function(val){ 
            handlers.getSheet("Personnel").getRange(row, 8).setValue(val); //column 8 is where personnel status column is
        };

        if ( !Catalogue.isDischarged(row) && !Catalogue.isUntested(row) ){
            return paste( Catalogue.isQualified(row) );
        } else if ( Catalogue.isUntested(row) && !Catalogue.isDischarged(row) ){
            return this.paste("UNTESTED");
        } else {
            return this.paste("DISCHARGED");
        };
    };

    static setRank = row => {

        const paste = function(val){ 
            handlers.getSheet("Personnel").getRange(row, 6).setValue(val); //column 6 is where rank column is
        };



    }
};

export * from './classes.js'