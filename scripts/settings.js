import CONSTANTS from "./constants.js";
import SettingsShim from "./formapplications/settings/settings.js";
import { getSetting } from "./lib/lib.js";

export default function registerSettings() {

    game.settings.registerMenu(CONSTANTS.MODULE_NAME, "configureRest", {
        name: "REST-RECOVERY.Settings.Configure.Title",
        label: "REST-RECOVERY.Settings.Configure.Label",
        hint: "REST-RECOVERY.Settings.Configure.Hint",
        icon: "fas fa-bed",
        type: SettingsShim,
        restricted: true
    });

    for (const [name, data] of Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())) {
        game.settings.register(CONSTANTS.MODULE_NAME, name, data);
    }

    let customSettings = !!Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).find(setting => {
        return getSetting(setting[0]) !== setting[1].default;
    })

    game.settings.register(CONSTANTS.MODULE_NAME, CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE, {
        scope: "world",
        config: false,
        default: customSettings ? "Custom" : "Default",
        type: String
    });

    const moduleProfiles = {
        "Default": Object.fromEntries(Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).map(entry => {
            return [entry[0], entry[1].default];
        }))
    };

    if(customSettings){
        moduleProfiles["Custom"] = Object.fromEntries(Object.keys(CONSTANTS.GET_DEFAULT_SETTINGS()).map(key => {
            return [key, getSetting(key)];
        }));
    }

    game.settings.register(CONSTANTS.MODULE_NAME, CONSTANTS.SETTINGS.MODULE_PROFILES, {
        scope: "world",
        config: false,
        default: moduleProfiles,
        type: Object
    });

    game.settings.register(CONSTANTS.MODULE_NAME, CONSTANTS.SETTINGS.QUICK_HD_ROLL, {
        name: "REST-RECOVERY.Settings.QuickHDRoll.Title",
        hint: "REST-RECOVERY.Settings.QuickHDRoll.Hint",
        scope: "client",
        config: true,
        default: true,
        type: Boolean
    });

}