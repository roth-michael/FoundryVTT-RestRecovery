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
        case "none":
            return 0;
        case "quarter":
            return 0.25;
        case "half":
            return 0.5;
        case "full":
            return 1.0;
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