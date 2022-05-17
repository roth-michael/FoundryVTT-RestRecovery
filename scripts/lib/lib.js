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

    const items = actor.items.map(item => {
        const consumableUses = getConsumableItemDayUses(item);
        if(!consumableUses.uses > 0) return false;
        const consumableData = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);
        return { id: item.id, name: item.name, uses: consumableUses.uses, worth: consumableData.worth, type: consumableData.type };
    }).filter(Boolean);

    return {
        foods: items.filter(item => item.type === "food" || item.type === "both"),
        drinks: items.filter(item => item.type === "water" || item.type === "both")
    };

}

export function getConsumableItemDayUses(item){
    const consumableData = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);
    if(!consumableData?.enabled) return 0;
    const worthPerDay = consumableData.worth;
    const path = consumableData.use === "quantity" ? "data.quantity" : "data.uses.value";
    const uses = (getProperty(item.data, path) ?? 0) * worthPerDay;
    return { uses, path, worthPerDay };
}