import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import SettingsShim from "./formapplications/settings/settings.js";
import CONSTANTS from "./constants.js";

Hooks.once("init", () => {
    registerSettings();
    registerLibwrappers();
    console.log("Rest Recovery 5e | Initialized");
});

/*Hooks.on("ready", () => {
    new SettingsShim().render(true);
})*/

Hooks.on('updateActor', (actor) => {
    const workflow = RestWorkflow.get(actor);
    if (workflow && workflow.finished) {
        workflow.preFinishRestMessage();
    }
});

Hooks.on("restCompleted", (actor) => {
    RestWorkflow.remove(actor);
});

Hooks.on("renderItemSheet5e", (app, html, { item }={}) => {
    const customRecovery = item.flags?.[CONSTANTS.MODULE_NAME]?.[CONSTANTS.FLAG_NAME]?.recovery?.enabled;
    const customFormula = item.flags?.[CONSTANTS.MODULE_NAME]?.[CONSTANTS.FLAG_NAME]?.recovery?.custom_formula ?? "";
    let targetElem = html.find('.uses-per')?.[0];
    if(!targetElem) return;
    $(`
    <div class="form-group">
        <label title="Module: Rest Recovery for 5e">Uses Custom Recovery <i class="fas fa-info-circle"></i></label>
        <div class="form-fields">
            <label class="checkbox">
                <input type="checkbox" name="flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.recovery.enabled" ${customRecovery ? "checked" : ""}>
                Enabled
            </label>
            <span style="flex: 0 0 auto; margin: 0 0.25rem;">|</span>
            <span class="sep" style="flex: 0 0 auto; margin-right: 0.25rem;">Formula:</span>
            <input type="text" name="flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.recovery.custom_formula" ${!customRecovery ? "disabled" : ""} value="${customRecovery ? customFormula : ""}">
        </div>
    </div>
    `).insertAfter(targetElem);
})