const lastTierArrayIndex = 18; //This is the total number of elements in the tier array; one for each tier (including with +/- modifiers)
const tierRange = []; 
for (let i = 0; i < lastTierArrayIndex; i++) {
 	 tierRange[i]= range(1+5*i,5+5*i,1);
	};
tierRange.unshift([0]); //Returns a two dimensional array of numeric tier score ranges whose indices line up with their respective tiers

const Tiers = { //This object has properties and methods relating to tiers and their number equivalents
  tier:["UNRATED","F-","F","F+","D-","D","D+","C-","C","C+",
  "B-","B","B+","A-","A","A+","S-","S","S+"],
  getTier: function(tiernum) {
    return this.tier[tiernum] //takes number and converts it to string tier
  },
  getNum: function(tierchr){
    return this.tier.indexOf(tierchr) //takes string and converts it to (integer) base score of a tier
  },
  numToTier: function(num){
    for (i = 0; i < tierRange.length; i++ ) {
      if( tierRange[i].includes(num) == true ) {
        return this.tier[i];
      }
    }
  } //convert a tier score to tier, takes number
};

const catalogue = { //This object has properties and methods regarding personnel; including rank and CQ status
  getBody: { //the stream is the position in the hierarchy one is in, from most senior to least
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
  },

  getCQtier: sheetGet("INFO").getRange("B23").getDisplayValue(), //Returns display value of CQ tier selector as a string.

  getPlayerFromIGN: ign => { //takes an IGN and converts it to a simple player object.
    try {
      return JSON.parse( UrlFetchApp.fetch(`https://api.mojang.com/users/profiles/minecraft/${ign}`).getContentText() );
    } catch {
      return "Invalid IGN!"
    };
  },

  getPlayerFromUUID: uuid => { /* takes a UUID and converts it to a simple player object. I used
  recursion from getUUID here as the API provides differently formatted player objects,
  so this redundancy is intended.
  Player objects appear as following: {id=a54be91e845747a78aa6bb0f99a47002, name=TheAsianAimbot} 
  p.s. im gonna try and dynamically generate more complex player objects with more info */
    try {
      const ign = JSON.parse( UrlFetchApp.fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`) ).name;
      return catalogue.getUUID(ign);
    } catch {
        return "Invalid UUID!"
    };
  },

  getPlayerRow: id => {
  /* Gets the row on the Personnel sheet where an ID lives. The ID is (almost certainly) unique and 
  is therefore used to identify each entry on the sheet. If a UUID/Discord has more than one ID,
  something is wrong and any tractor accounts should be discharged ASAP after investigation.
  DO NOT delete the row. Just navigate to Management > Discharge? If we get a duplicate ID then
  we should totally buy a lottery ticket */
    const searchRange = sheetGet("Personnel").getRange(2,1,sheetGet("Personnel").getLastRow()); //Checks column 1 (IDs) starting from row 2
    return searchRange.createTextFinder(id).findNext.getRow();
  },

  isQualified: player => {
    const tierCopier = editedSheet.getRange(editedRow, 4, 1, 4).getDisplayValues(); //Calculates someone's tier
    const tierConversion = tierCopier[0].map( (x) => tiers.getNum(x) );
    const tierSum = Math.round( tierConversion[0] * 2.5 + tierConversion[1] + tierConversion[2] + tierConversion[3] * 0.5 );
    const tierConverted = tiers.numToTier(tierSum);
    const tierColumn = editedSheet.getRange(editedRow, 8);
    return
  }, //Obtains the CQ status of someone
};