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
        <label style="flex: none; line-height: 20px; font-weight: bold; margin: 0 10px 0 0;">${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}</label>
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

    if(item.type === "consumable"){
        applyItemConsumableInputs(app, html, item);
    }

    applyItemCustomRecovery(app, html, item);
}

function applyItemConsumableInputs(app, html, item){

    const customConsumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};

    let targetElem = html.find('.form-header')?.[1];
    if (!targetElem) return;
    $(`
        <div class="form-header">Rest Recovery: Food & Water</div>
        <div class="form-group">
            <div class="form-fields" style="margin-right:0.5rem;">
                <label class="checkbox" style="font-size:13px;">
                    <input type="checkbox" name="${CONSTANTS.FLAGS.CONSUMABLE}.enabled" ${customConsumable.enabled ? "checked" : ""}> Item is consumable
                </label>
            </div>
            <div class="form-fields">
                <label style="flex:0 1 auto;">Use type:</label>
                <select name="${CONSTANTS.FLAGS.CONSUMABLE}.use" ${!customConsumable.enabled ? "disabled" : ""}>
                    <option ${customConsumable.use === "quantity" ? "selected" : ""} value="quantity">Quantity</option>
                    <option ${customConsumable.use === "charges" ? "selected" : ""} value="charges">Charges</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <div class="form-fields" style="margin-right:0.5rem;">
                <label style="flex:0 1 auto;">Worth in days:</label>
                <input type="text" data-dtype="Number" name="${CONSTANTS.FLAGS.CONSUMABLE}.worth" value="${customConsumable.worth ?? '1'}" ${!customConsumable.enabled ? "disabled" : ""}>
            </div>
            <div class="form-fields">
                <label style="flex:0 1 auto;">Type of consumable:</label>
                <select name="${CONSTANTS.FLAGS.CONSUMABLE}.type" ${!customConsumable.enabled ? "disabled" : ""}>
                    <option ${customConsumable.type === "food" ? "selected" : ""} value="food">Food</option>
                    <option ${customConsumable.type === "water" ? "selected" : ""} value="water">Water</option>
                    <option ${customConsumable.type === "both" ? "selected" : ""} value="both">Both</option>
                </select>
            </div>
        </div>
    `).insertBefore(targetElem);

}

function applyItemCustomRecovery(app, html, item){

    const customRecovery = getProperty(item, `${CONSTANTS.FLAGS.RECOVERY}.enabled`) ?? false;
    const customFormula =  getProperty(item, `${CONSTANTS.FLAGS.RECOVERY}.custom_formula`) ?? "";
    let targetElem = html.find('.uses-per')?.[0];
    if (!targetElem) return;
    $(`<div class="form-group" title="Module: Rest Recovery for 5e">
        <label>Uses Custom Recovery <i class="fas fa-info-circle"></i></label>
        <div class="form-fields">
            <label class="checkbox">
                <input type="checkbox" name="${CONSTANTS.FLAGS.RECOVERY}.enabled" ${customRecovery ? "checked" : ""}>
                Enabled
            </label>
            <span style="flex: 0 0 auto; margin: 0 0.25rem;">|</span>
            <span class="sep" style="flex: 0 0 auto; margin-right: 0.25rem;">Formula:</span>
            <input type="text" name="${CONSTANTS.FLAGS.RECOVERY}.custom_formula" ${!customRecovery ? "disabled" : ""} value="${customRecovery ? customFormula : ""}">
        </div>
    </div>`).insertAfter(targetElem);

}