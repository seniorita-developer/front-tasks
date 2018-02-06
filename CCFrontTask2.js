/**
 * Type representing a Rune 
 */
class RuneObject {
  constructor(rune, power, cannotLinkWith) {
    this.rune = rune;
    this.power = power;
    this.cannotLinkWith = cannotLinkWith;
  }
}

/**
 * Global list of all available runes
 */
const AllRunes = [
  new RuneObject("El", 28, "Ort"),
  new RuneObject("Eld", 33, "Sur"),
  new RuneObject("Tir", 9, "Eth"),
  new RuneObject("Nef", 7, "Ist"),
  new RuneObject("Eth", 31, "Tir"),
  new RuneObject("Ith", 22, "Pul"),
  new RuneObject("Tal", 8, "Io"),
  new RuneObject("Ral", 25, "Um"),
  new RuneObject("Ort", 18, "El"),
  new RuneObject("Thul", 13, "Sol"),
  new RuneObject("Amn", 6, "Fal"),
  new RuneObject("Sol", 10, "Thu"),
  new RuneObject("Shael", 17, "Lem"),
  new RuneObject("Dol", 11, "Hel"),
  new RuneObject("Hel", 12, "Dol"),
  new RuneObject("Io", 20, "Tal"),
  new RuneObject("Lum", 32, "Gul"),
  new RuneObject("Ko", 27, "Mal"),
  new RuneObject("Fal", 14, "Amn"),
  new RuneObject("Lem", 26, "Shall"),
  new RuneObject("Pul", 15, "Ith"),
  new RuneObject("Um", 16, "Ral"),
  new RuneObject("Mal", 21, "Ko"),
  new RuneObject("Ist", 4, "Nef"),
  new RuneObject("Gul", 23, "Lum"),
  new RuneObject("Vex", 24, "Ohm"),
  new RuneObject("Ohm", 1, "Vex"),
  new RuneObject("Lo", 2, "Cham"),
  new RuneObject("Sur", 30, "Eld"),
  new RuneObject("Ber", 3, null),
  new RuneObject("Jah", 5, "Zod"),
  new RuneObject("Cham", 29, "Lo"),
  new RuneObject("Zod", 19, "Jah")];

/**
 * Returns word in runic word format from runes
 * @param {Array<RuneObject>} runes 
 * @return {string} String in Rune Word format
 */
function printRunicName(runes) {
  return runes.map(runeObject => runeObject.rune).join("-");
}

/**
 * Comparison of powers for further sorting the array
 * @param {RuneObject} runeA 
 * @param {RuneObject} runeB 
 * @return {number} 1 if runeB has bigger power, -1 if smaller, 0 if equal
 */
function compareByPower(runeA, runeB) {
  const powerA = runeA.power;
  const powerB = runeB.power;

  let comparison = 0;
  if (powerA < powerB) {
    comparison = 1;
  } else if (powerA > powerB) {
    comparison = -1;
  }
  return comparison;
}

/**
 * Returns an object from array of runes (by the rune name)
 * @param {Array<RuneObject>} runeObjects 
 * @param {string} runeString 
 * @return {RuneObject}
 */
function getObjectByRune(runeObjects, runeString) {
  return runeObjects.find(x => x.rune == runeString);
};


/**
 * Returns true if the rune can be linked with all runes in array
 * @param {Array<RuneObject>} arr Array of RuneObjects
 * @param {RuneObject} runeObject Tested rune
 * @return {boolean} True if can be linked
 */
function canAddToRuneWord(arr, runeObject) {
  return arr.some(runeObj => runeObj.cannotLinkWith == runeObject.rune) == false;
}

/**
 * Returns the power of a given runic word
 * @param {string} stringRunicWord Word in the runic format
 * @return {number} Power of the word
 */
function measureRunicWordPower(stringRunicWord) {
  let runicPhrases = stringRunicWord.split("-");
  let runicPower = 0;

  for (let i = 0; i < runicPhrases.length; i++) {
    runicObject = getObjectByRune(AllRunes, runicPhrases[i]);
    runicPower += runicObject.power;
  }
  return runicPower;
}

/**
 * Generates as many Runic Words as it can (up to 10) sorted by power.
 * Returns an empty array if cannot create any words.
 * @param {number} length Runic word length
 * @return {Array<{word,power}>} Array of Rune Words
 */
exports.generateRunicWords = length => {
  
  if(length === null || length === undefined || typeof(length) !== "number") {
    return "length has to be number";
  }

  if (length <= 0) {
    return "length has to greater than 0";
  }

  if (length > AllRunes.length) {
    return "length has to be smaller than " + AllRunes.length;
  }

  // get a copy of sorted runes 
  let availableRunes = [];
  for (let i = 0; i < AllRunes.length; i++) {
    availableRunes.push(AllRunes[i]);
  }

  availableRunes.sort(compareByPower);

  let runicWords = [];

  while (runicWords.length < 10) {

    // return if there are fewer elements in sorted than length
    if (availableRunes.length < length) break;

    // generate new runic word from available runes
    let selectedRunes = [availableRunes[0]];
    for (let i = 1; i < availableRunes.length; i++) {
      let runeObject = availableRunes[i];
      if (canAddToRuneWord(selectedRunes, runeObject)) {
        selectedRunes.push(runeObject);
      }

      if (selectedRunes.length == length)
        break;
    }

    if (selectedRunes.length < length) {
      break;
    }
    // construct new runic word
    var newWord = printRunicName(selectedRunes);
    runicWords.push(newWord);

    // remove all used runes
    availableRunes = availableRunes.filter((rune) => {
      return selectedRunes.includes(rune) == false;
    });
  }

  if(runicWords.length === 0) {
    return "Could not create any Runic Words with a length of " + length;
  }

  return runicWords.map(r => ({word: r, power:measureRunicWordPower(r)}));
}

/**
 * Validates the runic word and return its power
 * @param {string} runicWord String in Runic Word format
 * @return {number} Power of the runic word
 */
exports.checkRunicWord = runicWord => {

  if (runicWord === null || runicWord === undefined || typeof(runicWord) !== "string") {
    return "runicWord has to be a string in Runic Word Format";
  }

  if (runicWord.length === 0) {
    return "runicWord cannot be an empty string";
  }

  let splitRunes = runicWord.split("-");
  
  if(splitRunes.length === 0) {
    return "runicWord has to be in Runic Word Format";
  }

  let firstRuneObject = AllRunes.find(x => x.rune === splitRunes[0]);

  if (firstRuneObject === null || firstRuneObject === undefined) {
    return "runicWord has to contain only Runes from the list. Cannot use " + splitRunes[0];
  }

  let runeObjects = [firstRuneObject];

  for(let i = 0; i < splitRunes.length; i++) {
    let nextRune = AllRunes.find(x => x.rune === splitRunes[i]);
    if (nextRune === null || nextRune === undefined) {
      return "runicWord has to contain only Runes from the list. Cannot use " + splitRunes[i];
    }

    if (canAddToRuneWord(runeObjects, nextRune) === false) {
      return "This runicWord has an illegal combination of Runes";
    }

    runeObjects.push(nextRune);
  }

  return measureRunicWordPower(runicWord);
}