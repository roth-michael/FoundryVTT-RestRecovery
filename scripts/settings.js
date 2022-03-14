import CONSTANTS from "./constants.js";
import SettingsShim from "./formapplications/settings/settings.js";

export default function registerSettings() {

    game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetToDefaults", {
        name: "REST-RECOVERY.Settings.Reset.Title",
        label: "REST-RECOVERY.Settings.Reset.Label",
        hint: "REST-RECOVERY.Settings.Reset.Hint",
        icon: "fas fa-refresh",
        type: ResetSettingsDialog,
        restricted: true
    });

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

    game.settings.register(CONSTANTS.MODULE_NAME, "quick-hd-roll", {
        name: "REST-RECOVERY.Settings.QuickHDRoll.Title",
        hint: "REST-RECOVERY.Settings.QuickHDRoll.Hint",
        scope: "client",
        config: true,
        default: true,
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
    for (const [name, data] of Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())) {
        await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
    }
    window.location.reload();
}