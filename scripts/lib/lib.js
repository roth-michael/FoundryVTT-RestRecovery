import CONSTANTS from "../constants.js";

export function ordinalSuffixOf(i) {
    let j = i % 10;
    let k = i % 100;
    if (j === 1 && k !== 11) {
        return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'st'}`);
    }else if (j === 2 && k !== 12) {
        return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'nd'}`);
    }else if (j === 3 && k !== 13) {
        return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'rd'}`);
    }
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'th'}`);
}

export function determineLongRestMultiplier(settingKey) {
    const multiplierSetting = getSetting(settingKey);
    switch (multiplierSetting) {
        case CONSTANTS.RECOVERY.NONE:
            return 0;
        case CONSTANTS.RECOVERY.QUARTER:
            return 0.25;
        case CONSTANTS.RECOVERY.HALF:
            return 0.5;
        case CONSTANTS.RECOVERY.FULL:
            return 1.0;
        case CONSTANTS.RECOVERY.CUSTOM:
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

export function evaluateFormula(formula, data){
    const rollFormula = Roll.replaceFormulaData(formula, data, { warn: true });
    return new Roll(rollFormula).evaluate({ async: false });
}

export function getConsumableItemsFromActor(actor){

    return actor.items.map(item => {
        const consumableUses = getConsumableItemDayUses(item);
        if(!consumableUses > 0) return false;
        const consumableData = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);
        return {
            id: item.id,
            name: item.name
        };
    }).filter(Boolean);

}

export function getConsumableItemDayUses(item){
    const consumableData = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);
    if(!consumableData?.enabled) return 0;
    return (getProperty(item.data, "data.uses.value") ?? 1);
}

export function isRealNumber(inNumber) {
    return !isNaN(inNumber)
        && typeof inNumber === "number"
        && isFinite(inNumber);
}

export function getActorConsumableValues(actor){

    let actorFoodSatedValue = getProperty(actor.data, CONSTANTS.FLAGS.SATED_FOOD) ?? 0;
    let actorWaterSatedValue = getProperty(actor.data, CONSTANTS.FLAGS.SATED_WATER) ?? 0;

    let actorNeedsNoFoodWater = getProperty(actor.data, `flags.dnd5e.noFoodWater`);

    let foodUnitsSetting = getSetting(CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY);
    let actorRequiredFoodUnits = getProperty(actor.data, `flags.dnd5e.foodUnits`);
    let actorRequiredFood = isRealNumber(actorRequiredFoodUnits) && foodUnitsSetting !== 0
        ? actorRequiredFoodUnits
        : foodUnitsSetting;

    let waterUnitsSetting = getSetting(CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY);
    let actorRequiredWaterUnits = getProperty(actor.data, `flags.dnd5e.waterUnits`);
    let actorRequiredWater = isRealNumber(actorRequiredWaterUnits) && waterUnitsSetting !== 0
        ? actorRequiredWaterUnits
        : waterUnitsSetting;

    if(actorNeedsNoFoodWater){
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

export function capitalizeFirstLetter(str){
    return str.slice(0,1).toUpperCase() + str.slice(1);
}