import CONSTANTS from "./constants.js";
import ResourceConfig from "./formapplications/resource-config/resource-config.js";

export default function registerSheetOverrides() {
    Hooks.on("renderItemSheet5e", patchItemSheet);
    Hooks.on("renderActorSheet5e", patchActorSheet);
}

function patchActorSheet(app, html, data){
    let actor = game.actors.get(data.actor._id);
    let border = true;
    let targetElem = html.find('.center-pane .attributes')[0];
    if (!targetElem){
        border = false;
        targetElem = html.find('.center-pane .resources')[0];
        if(!targetElem) return;
    }
    const elem = $(`<div class="form-group" style="${border ? "border-bottom: 2px groove #eeede0; padding-bottom: 0.25rem;" : "padding-top: 0.25rem;"}"  title="Module: Rest Recovery for 5e">
        <label style="flex: none; line-height: 20px; font-weight: bold; margin: 0 10px 0 0;">Configure Resource Recovery</label>
        <a class="config-button" title="Configure Resource Recovery" style="flex:1;">
            <i class="fas fa-cog" style="float: right; margin-right: 3px; text-align: right; color: #999;"></i>
        </a>
    </div>`);
    elem.insertAfter(targetElem);
    elem.find('.config-button').on('click',function() {
        ResourceConfig.show({ actor });
    });
}

function patchItemSheet(app, html, { item } = {}){
    const customRecovery = getProperty(item, `flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.recovery.enabled`) ?? false;
    const customFormula =  getProperty(item, `flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.recovery.custom_formula`) ?? "";
    let targetElem = html.find('.uses-per')?.[0];
    if (!targetElem) return;
    $(`<div class="form-group" title="Module: Rest Recovery for 5e">
        <label>Uses Custom Recovery <i class="fas fa-info-circle"></i></label>
        <div class="form-fields">
            <label class="checkbox">
                <input type="checkbox" name="flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.recovery.enabled" ${customRecovery ? "checked" : ""}>
                Enabled
            </label>
            <span style="flex: 0 0 auto; margin: 0 0.25rem;">|</span>
            <span class="sep" style="flex: 0 0 auto; margin-right: 0.25rem;">Formula:</span>
            <input type="text" name="flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.recovery.custom_formula" ${!customRecovery ? "disabled" : ""} value="${customRecovery ? customFormula : ""}">
        </div>
    </div>`).insertAfter(targetElem);
}