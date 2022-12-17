import CONSTANTS from "../constants.js";

export function custom_warning(message, console = true){
  ui.notifications.warn("Rest Recovery | " + game.i18n.localize(message), { console })
}


export function ordinalSuffixOf(i) {
  let j = i % 10;
  let k = i % 100;
  if (j === 1 && k !== 11) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'st'}`);
  } else if (j === 2 && k !== 12) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'nd'}`);
  } else if (j === 3 && k !== 13) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'rd'}`);
  }
  return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'th'}`);
}

/**
 * @param {string} settingKey
 * @returns {number}
 */
export function determineMultiplier(settingKey) {
  const multiplierSetting = getSetting(settingKey);
  switch (multiplierSetting) {
    case CONSTANTS.FRACTIONS.NONE:
      return 0;
    case CONSTANTS.FRACTIONS.QUARTER:
      return 0.25;
    case CONSTANTS.FRACTIONS.HALF:
      return 0.5;
    case CONSTANTS.FRACTIONS.FULL:
      return 1.0;
    case CONSTANTS.FRACTIONS.CUSTOM:
      return getSetting(CONSTANTS.DEFAULT_SETTINGS[settingKey].customFormula);
    default:
      throw new Error(`Unable to parse recovery multiplier setting for "${settingKey}".`);
  }
}

export function determineRoundingMethod(settingKey) {
  const rounding = getSetting(settingKey);
  switch (rounding) {
    case "down":
      return Math.floor;
    case "up":
      return Math.ceil;
    case "round":
      return Math.round;
    default:
      throw new Error(`Unable to parse rounding setting for "${settingKey}".`);
  }
}

export function getSetting(key, localize = false) {
  const value = game.settings.get(CONSTANTS.MODULE_NAME, key);
  if (localize) return game.i18n.localize(value);
  return value;
}

export function setSetting(key, value) {
  return game.settings.set(CONSTANTS.MODULE_NAME, key, value);
}

/**
 * @param {String/Number} formula
 * @param {Object} data
 * @param {boolean} warn
 * @returns {Roll}
 */
export function evaluateFormula(formula, data, warn = true) {
  const rollFormula = Roll.replaceFormulaData(formula, data, { warn });
  return new Roll(rollFormula).evaluate({ async: false });
}

export function getConsumableItemsFromActor(actor) {

  return actor.items.map(item => {
    const consumableUses = getConsumableItemDayUses(item);
    if (!consumableUses > 0) return false;
    const consumableData = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
    return {
      id: item.id,
      name: item.name + " (" + game.i18n.localize("REST-RECOVERY.Misc." + capitalizeFirstLetter(consumableData.type)) + ")",
    };
  }).filter(Boolean);

}

export function getConsumableItemDayUses(item) {
  const consumableData = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
  if (!consumableData?.enabled) return 0;
  return (getProperty(item, "system.uses.value") ?? 1);
}

export function isRealNumber(inNumber) {
  return !isNaN(inNumber)
    && typeof inNumber === "number"
    && isFinite(inNumber);
}

export function getActorConsumableValues(actor, grittyLongRest) {

  let actorFoodSatedValue = getProperty(actor, CONSTANTS.FLAGS.SATED_FOOD) ?? 0;
  let actorWaterSatedValue = getProperty(actor, CONSTANTS.FLAGS.SATED_WATER) ?? 0;

  let actorNeedsNoFoodWater = getProperty(actor, `flags.dnd5e.noFoodWater`);

  let foodUnitsSetting = getSetting(CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY);
  let actorRequiredFoodUnits = getProperty(actor, `flags.dnd5e.foodUnits`);
  let actorRequiredFood = isRealNumber(actorRequiredFoodUnits) && foodUnitsSetting !== 0
    ? actorRequiredFoodUnits
    : foodUnitsSetting;

  let waterUnitsSetting = getSetting(CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY);
  let actorRequiredWaterUnits = getProperty(actor, `flags.dnd5e.waterUnits`);
  let actorRequiredWater = isRealNumber(actorRequiredWaterUnits) && waterUnitsSetting !== 0
    ? actorRequiredWaterUnits
    : waterUnitsSetting;

  actorRequiredFood *= grittyLongRest ? 7 : 1;
  actorRequiredWater *= grittyLongRest ? 7 : 1;

  if (actorNeedsNoFoodWater) {
    actorRequiredFood = 0;
    actorRequiredWater = 0;
  }

  return {
    actorRequiredFood,
    actorRequiredWater,
    actorFoodSatedValue,
    actorWaterSatedValue
  }

}

export function capitalizeFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function roundHalf(num) {
  return Math.round(num * 2) / 2;
}

export function getTimeChanges(isLongRest) {

  const simpleCalendarActive = game.modules.get("foundryvtt-simple-calendar")?.active;
  const timeConfig = simpleCalendarActive
    ? SimpleCalendar.api.getTimeConfiguration()
    : { hoursInDay: 24, minutesInHour: 60, secondsInMinute: 60 };

  timeConfig.secondsInDay = timeConfig.hoursInDay * timeConfig.minutesInHour * timeConfig.secondsInMinute;

  const hourInSeconds = timeConfig.minutesInHour * timeConfig.secondsInMinute;

  const { hour, minute, seconds } = simpleCalendarActive ? SimpleCalendar.api.currentDateTime() : {
    hour: 0,
    minute: 0,
    seconds: 0
  };
  const currentTime = (hour * hourInSeconds) + (minute * timeConfig.secondsInMinute) + seconds;

  let restTime;
  const restVariant = game.settings.get("dnd5e", "restVariant");
  switch (restVariant) {
    case "epic":
      restTime = isLongRest ? hourInSeconds : timeConfig.secondsInMinute;
      break;
    case "gritty":
      restTime = isLongRest ? timeConfig.hoursInDay * hourInSeconds * 7 : hourInSeconds * 8;
      break;
    default:
      restTime = isLongRest ? hourInSeconds * 8 : hourInSeconds;
      break;
  }

  return {
    restTime,
    isNewDay: simpleCalendarActive
      ? (currentTime + restTime) >= timeConfig.secondsInDay
      : restVariant === "gritty" || (restVariant !== "epic" && isLongRest)
  };

}


export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
