import CONSTANTS from "../constants.js";

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function debug(msg, args = "") {
    if (getSetting("debug")){
        console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args)
    }
}

export function custom_notify(message) {
    message = `${CONSTANTS.MODULE_NAME} | ${message}`;
    ui.notifications.notify(message);
    console.log(message.replace("<br>", "\n"));
}

export function custom_warning(warning, notify = false) {
    warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
    if (notify) ui.notifications.warn(warning);
    console.warn(warning.replace("<br>", "\n"));
}

export function custom_error(error, notify = true) {
    error = `${CONSTANTS.MODULE_NAME} | ${error}`;
    if (notify) ui.notifications.error(error);
    return new Error(error.replace("<br>", "\n"));
}

export function ordinalSuffixOf(i) {
    let j = i % 10;
    let k = i % 100;
    if(j === 1 && k !== 11) {
        return i + 'st';
    }
    if(j === 2 && k !== 12) {
        return i + 'nd';
    }
    if(j === 3 && k !== 13) {
        return i + 'rd';
    }
    return i + 'th';
}

export function dialogLayout({
        title = "Short Rest",
        message,
        icon = "fas fa-exclamation-triangle",
    } = {}) {
    return `
    <div style="margin-bottom: 1rem; font-size: 0.9rem; text-align: center;">
        <p><i style="font-size:3rem;" class="${icon}"></i></p>
        <p style="margin-bottom: 1rem"><strong style="font-size:1.2rem;">${title}</strong></p>
        <p>${message}</p>
    </div>
    `;
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

export function determineRoundingMethod(settingKey){
    const rounding = getSetting(settingKey);
    switch(rounding){
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

export function getSetting(key, localize = false){
    const value = game.settings.get(CONSTANTS.MODULE_NAME, key);
    if(localize) return game.i18n.localize(value);
    return value;
}