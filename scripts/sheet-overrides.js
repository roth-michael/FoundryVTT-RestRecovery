import CONSTANTS from "./constants.js";
import ResourceConfig from "./formapplications/resource-config/resource-config.js";
import { getSetting } from "./lib/lib.js";
import * as lib from "./lib/lib.js";

export default function registerSheetOverrides() {
    Hooks.on("renderItemSheet5e", patch_itemSheet);
    Hooks.on("renderActorSheet5e", patch_actorSheet);
    Hooks.on("renderAbilityUseDialog", patch_AbilityUseDialog)
    registerTraits();
}

function registerTraits(){

    CONFIG.DND5E.characterFlags.hitDieBonus = {
        section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
        name: game.i18n.localize("REST-RECOVERY.Traits.HitDieBonus.Title"),
        hint: game.i18n.localize("REST-RECOVERY.Traits.HitDieBonus.Hint"),
        type: String,
        placeholder: "0"
    };

    if(getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) {

        CONFIG.DND5E.characterFlags.foodUnits = {
            section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
            name: game.i18n.localize("REST-RECOVERY.Traits.FoodUnitsPerDay.Title"),
            hint: game.i18n.localize("REST-RECOVERY.Traits.FoodUnitsPerDay.Hint"),
            type: Number,
            placeholder: getSetting(CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY)
        };

        CONFIG.DND5E.characterFlags.waterUnits = {
            section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
            name: game.i18n.localize("REST-RECOVERY.Traits.WaterUnitsPerDay.Title"),
            hint: game.i18n.localize("REST-RECOVERY.Traits.WaterUnitsPerDay.Hint"),
            type: Number,
            placeholder: getSetting(CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY)
        };

        CONFIG.DND5E.characterFlags.noFoodWater = {
            section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
            name: game.i18n.localize("REST-RECOVERY.Traits.NoFoodWater.Title"),
            hint: game.i18n.localize("REST-RECOVERY.Traits.NoFoodWater.Hint"),
            type: Boolean,
            placeholder: false
        };

    }

}


function patch_actorSheet(app, html, data){
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
        <a class="config-button" title="${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}" style="flex:1;">
            <i class="fas fa-cog" style="float: right; margin-right: 3px; text-align: right; color: #999;"></i>
        </a>
    </div>`);
    elem.insertAfter(targetElem);
    elem.find('.config-button').on('click',function() {
        ResourceConfig.show({ actor });
    });
}

function patch_itemSheet(app, html, { item } = {}){

    if(getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && item.type === "consumable"){
        patch_itemConsumableInputs(app, html, item);
    }

    patch_itemCustomRecovery(app, html, item);
}

function patch_itemConsumableInputs(app, html, item){

    const customConsumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};
    const uses = Number(getProperty(item, "data.uses.max"));
    const per = getProperty(item, "data.uses.per");
    const validUses = uses && uses > 0 && per;

    let targetElem = html.find('.form-header')?.[1];
    if (!targetElem) return;
    $(`
        <div class="form-header">${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.Title")}</div>
        <div class="form-group">
            <div class="form-fields" style="margin-right:0.5rem;">
                <label class="checkbox" style="font-size:13px;">
                    <input type="checkbox" name="${CONSTANTS.FLAGS.CONSUMABLE_ENABLED}" ${customConsumable.enabled ? "checked" : ""}> ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.IsConsumable")}
                </label>
            </div>
            <div class="form-fields" style="margin-right:0.5rem;">
                <label style="flex:0 1 auto;">${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.Type")}</label>
                <select name="${CONSTANTS.FLAGS.CONSUMABLE_TYPE}" ${!customConsumable.enabled ? "disabled" : ""}>
                    <option ${customConsumable.type === CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD ? "selected" : ""} value="${CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD}">${game.i18n.localize("REST-RECOVERY.Misc.Food")}</option>
                    <option ${customConsumable.type === CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER ? "selected" : ""} value="${CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER}">${game.i18n.localize("REST-RECOVERY.Misc.Water")}</option>
                    <option ${customConsumable.type === CONSTANTS.FLAGS.CONSUMABLE_TYPE_BOTH ? "selected" : ""} value="${CONSTANTS.FLAGS.CONSUMABLE_TYPE_BOTH}">${game.i18n.localize("REST-RECOVERY.Misc.Both")}</option>
                </select>
            </div>
        </div>
        
        <div class="form-group">
            <div class="form-fields" style="margin-right:0.5rem;">
                <label class="checkbox" style="font-size:13px;">
                    <input type="checkbox" name="${CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH}" ${customConsumable.dayWorth ? "checked" : ""}> ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.DayWorth")}
                </label>
            </div>
        </div>
        
        <small style="display:${customConsumable.enabled && !validUses ? "block" : "none"}; margin: 0.5rem 0;">
            <i class="fas fa-info-circle" style="color:rgb(217, 49, 49);"></i> ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.ChargesDescription")}
        </small>
    `).insertBefore(targetElem);

}

function patch_itemCustomRecovery(app, html, item){

    const customRecovery = getProperty(item, `${CONSTANTS.FLAGS.RECOVERY_ENABLED}`) ?? false;
    const customFormula =  getProperty(item, `${CONSTANTS.FLAGS.RECOVERY_FORMULA}`) ?? "";
    let targetElem = html.find('.uses-per')?.[0];
    if (!targetElem) return;
    $(`<div class="form-group" title="Module: Rest Recovery for 5e">
        <label>${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.UsesCustomRecovery")} <i class="fas fa-info-circle"></i></label>
        <div class="form-fields">
            <label class="checkbox">
                <input type="checkbox" name="${CONSTANTS.FLAGS.RECOVERY_ENABLED}" ${customRecovery ? "checked" : ""}>
                ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.Enabled")}
            </label>
            <span style="flex: 0 0 auto; margin: 0 0.25rem;">|</span>
            <span class="sep" style="flex: 0 0 auto; margin-right: 0.25rem;">${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.Formula")}</span>
            <input type="text" name="${CONSTANTS.FLAGS.RECOVERY_FORMULA}" ${!customRecovery ? "disabled" : ""} value="${customRecovery ? customFormula : ""}">
        </div>
    </div>`).insertAfter(targetElem);

}

function patch_AbilityUseDialog(app, html){

    if(!app.item) return;

    const customConsumable = getProperty(app.item.data, CONSTANTS.FLAGS.CONSUMABLE) ?? {};

    if(!customConsumable.enabled || !app.item.data.data.uses.max) return;

    let {
        actorRequiredFood,
        actorRequiredWater,
        actorFoodSatedValue,
        actorWaterSatedValue
    } = lib.getActorConsumableValues(app.item.parent);

    if(!actorRequiredFood && !actorRequiredWater) return;

    let content = html.find(".dialog-content");
    let targetElem = content.children().first();

    const fullUseAvailable = app.item.data.data.uses.value >= 1.0;

    let additionalHtml;

    if(customConsumable.dayWorth){

        let localizationString = "REST-RECOVERY.Dialogs.AbilityUse.DayWorthTitle" + lib.capitalizeFirstLetter(customConsumable.type);
        additionalHtml = `<p style='border-top: 1px solid rgba(0,0,0,0.25); margin:0.5rem 0; padding: 0.5rem 0;' class='notes'>
            ${game.i18n.localize(localizationString)}
        </p>`;

    }else{

        additionalHtml = `
        <p>${game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.Title")}</p>
        <div style="margin-bottom:0.5rem;">
            <input type="radio" name="consumeAmount" value="full"
                ${fullUseAvailable ? "checked" : ""}
                ${!fullUseAvailable ? "disabled" : ""}/> ${game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.FullUnit")}
            <input type="radio" name="consumeAmount" value="half" ${!fullUseAvailable ? "checked" : ""}/> ${game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.HalfUnit")}
        </div>`;

        if(actorRequiredFood && (customConsumable.type === "both" || customConsumable.type === "food")) {
            additionalHtml += "<p style='border-top: 1px solid rgba(0,0,0,0.25); margin:0.5rem 0; padding: 0.5rem 0;' class='notes'>";
            if (actorFoodSatedValue >= actorRequiredFood) {
                additionalHtml += game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.SatedFood");
            }else{
                additionalHtml += game.i18n.format("REST-RECOVERY.Dialogs.AbilityUse.NotSatedFood", {
                    units: actorRequiredFood - actorFoodSatedValue
                });
            }
            additionalHtml += "</p>";
        }

        if(actorRequiredWater && customConsumable.type === "water") {
            additionalHtml += "<p style='border-top: 1px solid rgba(0,0,0,0.25); margin:0.5rem 0; padding: 0.5rem 0;' class='notes'>";
            if (actorWaterSatedValue >= actorRequiredWater) {
                additionalHtml += game.i18n.localize("REST-RECOVERY.Dialogs.AbilityUse.SatedWater");
            }else{
                additionalHtml += game.i18n.format("REST-RECOVERY.Dialogs.AbilityUse.NotSatedWater", {
                    units: actorRequiredWater - actorWaterSatedValue
                });
            }
            additionalHtml += "</p>";
        }
    }

    targetElem.append($(additionalHtml));

    app.options.height = "auto";
    app.setPosition();

}