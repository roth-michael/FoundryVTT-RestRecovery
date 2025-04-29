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

export function localize(key, data) {
  return (data ? game.i18n.format(key, data) : game.i18n.localize(key)) ?? '';
}

/**
 * @returns {Promise<any>}
 */
export function customDialog({ title, header, content, extraContent, icon } = {}, prompt = false) {
  let dialogContent = icon ? `<p class="header-icon"><i class="${icon}"></i></p>\n` : '';
  dialogContent += `
    <p class="header"><strong>${header}</strong></p>
    <p>${content}</p>
  `;
  if (extraContent) dialogContent += `<div>${extraContent}</div>`;
  return foundry.applications.api.DialogV2[prompt ? 'prompt' : 'confirm']({
    window: {
      title
    },
    content: dialogContent,
    classes: ['rest-recovery-custom-dialog']
  });
}

/**
 * @returns {Promise<any>}
 */
export function settingsDialog(title, settings = {}) {
  const settingsMap = new Map();

  const shownSettings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())
    .map(entry => {
      let [key, setting] = entry;
      setting.name = localize(setting.name)
      setting.hint = localize(setting.hint)
      setting.value = settings[key] ?? getSetting(key);
      if (setting.customSettingsDialog) {
        if (typeof setting.value === "boolean") {
          setting.settingText = setting.value ? "Yes" : "No";
        } else if (typeof setting.value === "string") {
          setting.settingText = localize(setting.choices[setting.value])
        } else {
          setting.settingText = setting.value;
        }
      }
      settingsMap.set(key, setting);
      return setting;
    })
    .map(setting => {

      setting.visible = setting.customSettingsDialog
        && (setting.validate ? !setting.validate(settingsMap) : true)
        && !!setting?.settingText && !!setting.value && (setting.default !== setting.value || setting.nonDefaultSetting);

      return setting;
    });

  const content = `
    <h3>${localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title")}</h3>
    <p>${localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Content")}</p>
    <table>
      <tr>
        <th>Setting</th>
        <th>Value</th>
      </tr>
      ${shownSettings.filter(s => s.visible).map(setting => `
        <tr>
          <td data-tooltip="${setting.hint}" data-tooltip-direction="UP"><i class="fa-solid fa-info-circle"></i> ${setting.name}</td>
          <td>${setting.settingText}</td>
        </tr>
      `).join('')}
    </table>
  `;

  return foundry.applications.api.DialogV2.prompt({
    window: {
      title
    },
    content,
    position: {
      width: 350
    },
    modal: true,
    draggable: false,
    classes: ["rest-recovery-settings-dialog"]
  });
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
  if(!localize) {
    const setting = CONSTANTS.DEFAULT_SETTINGS[key];
    if (setting?.moduleIntegration && !game.modules.get(setting.moduleIntegration.key)?.active) {
      return setting.default;
    }
  }
  if (!game.settings.settings.get(`${CONSTANTS.MODULE_NAME}.${key}`)) return;
  const value = game.settings.get(CONSTANTS.MODULE_NAME, key);
  if (localize) return game.i18n.localize(value);
  return value;
}

export function setSetting(key, value) {
  if (!game.settings.settings.get(`${CONSTANTS.MODULE_NAME}.${key}`)) return;
  return game.settings.set(CONSTANTS.MODULE_NAME, key, value);
}

/**
 * @param {String/Number} formula
 * @param {Object} data
 * @param {boolean} warn
 * @returns {Roll}
 */
export async function evaluateFormula(formula, data, warn = true) {
  const rollFormula = Roll.replaceFormulaData(formula, data, { warn });
  return await new Roll(rollFormula).evaluate();
}

export function getConsumableItemsFromActor(actor) {

  return actor.items.map(item => {
    const consumableUses = getConsumableItemDayUses(item);
    if (!consumableUses > 0) return false;
    return {
      id: item.id,
      name: item.name + " (" + game.i18n.localize("REST-RECOVERY.Misc." + capitalizeFirstLetter(item.system.type?.subtype)) + ")",
    };
  }).filter(Boolean);

}

export function getConsumableItemDayUses(item) {
  if (!CONSTANTS.CONSUMABLE_TYPES.includes(item.system.type?.subtype)) return 0;
  const uses = foundry.utils.getProperty(item, "system.uses");
  return (((typeof uses.max === 'string' ? new Roll(uses.max, item.getRollData()).evaluateSync().total : uses.max) ?? 1) - (uses.spent ?? 0));
}

export function isRealNumber(inNumber) {
  return !isNaN(inNumber)
    && typeof inNumber === "number"
    && isFinite(inNumber);
}

/**
 *
 * @param actor
 * @param grittyLongRest
 * @returns {{
 *    actorRequiredWater: Number,
 *    actorWaterSatedValue: Number,
 *    actorRequiredFood: Number,
 *    actorFoodSatedValue: Number
 * }}
 */
export function getActorConsumableValues(actor, grittyLongRest) {

  const actorFoodSatedValue = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.SATED_FOOD) ?? 0;
  const actorWaterSatedValue = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.SATED_WATER) ?? 0;

  const actorNeedsNoFoodWater = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DND.NEEDS_NO_FOOD_AND_WATER);
  const actorNeedsNoFood = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.NEEDS_NO_FOOD);
  const actorNeedsNoWater = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.NEEDS_NO_WATER);

  const foodUnitsSetting = getSetting(CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY);
  const actorRequiredFoodUnits = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.REQUIRED_FOOD)
    ?? foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DND.REQUIRED_FOOD);
  let actorRequiredFood = isRealNumber(actorRequiredFoodUnits) && foodUnitsSetting !== 0
    ? actorRequiredFoodUnits
    : foodUnitsSetting;

  const waterUnitsSetting = getSetting(CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY);
  const actorRequiredWaterUnits = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.REQUIRED_WATER)
    ?? foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DND.REQUIRED_WATER);
  let actorRequiredWater = isRealNumber(actorRequiredWaterUnits) && waterUnitsSetting !== 0
    ? actorRequiredWaterUnits
    : waterUnitsSetting;

  actorRequiredFood *= grittyLongRest ? 7 : 1;
  actorRequiredWater *= grittyLongRest ? 7 : 1;

  actorRequiredFood = actorNeedsNoFoodWater || actorNeedsNoFood ? 0 : actorRequiredFood;
  actorRequiredWater = actorNeedsNoFoodWater || actorNeedsNoWater ? 0 : actorRequiredWater;

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

  const simpleCalendarActive = getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
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
  const restVariant = getSetting(CONSTANTS.SETTINGS.REST_VARIANT);
  switch (restVariant) {
    case "epic":
      restTime = isLongRest ? hourInSeconds : timeConfig.secondsInMinute;
      break;
    case "gritty":
      restTime = isLongRest ? timeConfig.hoursInDay * hourInSeconds * 7 : hourInSeconds * 8;
      break;
    case "custom":
      restTime = isLongRest ? getSetting(CONSTANTS.SETTINGS.CUSTOM_LONG_REST_DURATION_HOURS) * hourInSeconds : getSetting(CONSTANTS.SETTINGS.CUSTOM_SHORT_REST_DURATION_HOURS) * hourInSeconds;
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


export function addToUpdates(updates, toAdd){
  const existingUpdateIndex = updates.findIndex(update => update._id === toAdd._id);
  if(existingUpdateIndex > -1){
    updates[existingUpdateIndex] = foundry.utils.mergeObject(
      updates[existingUpdateIndex],
      toAdd
    )
  }else{
    updates.push(toAdd);
  }
}
