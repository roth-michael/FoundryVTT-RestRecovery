import CONSTANTS from "./constants.js";
import RestConfirmation from "./formapplications/restconfirmation.js";

function defaultSettings() {
    return {
        "ignoreInactivePlayers": {
            name: "REST-RECOVERY.Settings.IgnoreInactive.Title",
            hint: "REST-RECOVERY.Settings.IgnoreInactive.Hint",
            scope: "world",
            config: true,
            default: false,
            type: Boolean
        },
        "quickHDRoll": {
            name: "REST-RECOVERY.Settings.QuickHDRoll.Title",
            hint: "REST-RECOVERY.Settings.QuickHDRoll.Hint",
            scope: "client",
            config: true,
            default: true,
            type: Boolean
        }
    }
}

export default function registerSettings() {

    game.settings.registerMenu(CONSTANTS.MODULE_NAME, "configureRest", {
        name: "REST-RECOVERY.Settings.Configure.Title",
        label: "REST-RECOVERY.Settings.Configure.Label",
        hint: "REST-RECOVERY.Settings.Configure.Hint",
        icon: "fas fa-bed",
        type: RestConfirmation,
        restricted: true
    });

    const settings = defaultSettings();
    for (const [name, data] of Object.entries(settings)) {
        game.settings.register(CONSTANTS.MODULE_NAME, name, data);
    }

    game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
        name: "REST-RECOVERY.Settings.Debug.Title",
        hint: "REST-RECOVERY.Settings.Debug.Label",
        scope: "client",
        config: true,
        default: false,
        type: Boolean
    });

}

class ResetSettingsDialog extends FormApplication {
    constructor(...args) {
        super(...args);
        return new Dialog({
            title: game.i18n.localize("REST-RECOVERY.Dialogs.ResetSettings.Title"),
            content: `<p class="rest-recovery-dialog-important">${game.i18n.localize("REST-RECOVERY.Dialogs.ResetSettings.Content")}</p>`,
            buttons: {
                confirm: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize("REST-RECOVERY.Dialogs.ResetSettings.Confirm"),
                    callback: () => {
                        resetSettings();
                    }
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize("REST-RECOVERY.Dialogs.ResetSettings.Cancel")
                }
            },
            default: "cancel"
        })
    }
}

async function resetSettings() {
    const settings = defaultSettings();
    for (const [name, data] of Object.entries(settings)) {
        await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
    }
    window.location.reload();
}