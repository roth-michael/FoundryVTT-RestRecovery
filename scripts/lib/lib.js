import CONSTANTS from "../constants.js";

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function debug(msg, args = "") {
    if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")){
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