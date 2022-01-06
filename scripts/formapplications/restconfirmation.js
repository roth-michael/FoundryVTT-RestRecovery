import CONSTANTS from "../constants.js";

export default class RestConfirmation extends FormApplication {

    /** @inheritdoc */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: game.i18n.localize("ITEM-PILES.DropItem.Title"),
            classes: ["dialog", "rest-recovery-application"],
            template: `${CONSTANTS.PATH}templates/rest-settings.html`,
            width: 530,
            height: "auto",
            resizable: false,
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-body", initial: "mainsettings" }]
        });
    }

}