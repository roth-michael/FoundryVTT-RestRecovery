import CONSTANTS from "./constants.js";
import ResourceConfig from "./formapplications/resource-config/resource-config.js";
import * as lib from "./lib/lib.js";
import { getSetting } from "./lib/lib.js";

export default function registerSheetOverrides() {
  Hooks.on("renderItemSheet5e", patch_itemSheet);
  Hooks.on("renderActorSheet5e", patch_actorSheet);
  registerTraits();
}

function registerTraits() {

  CONFIG.DND5E.characterFlags.hitDieBonus = {
    section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
    name: game.i18n.localize("REST-RECOVERY.Traits.HitDieBonus.Title"),
    hint: game.i18n.localize("REST-RECOVERY.Traits.HitDieBonus.Hint"),
    type: String,
    placeholder: "0"
  };

  if (getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY)) {
    CONFIG.DND5E.characterFlags.longRestSpellPointsBonus = {
      section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
      name: game.i18n.localize("REST-RECOVERY.Traits.LongRestSpellPointsBonus.Title"),
      hint: game.i18n.localize("REST-RECOVERY.Traits.LongRestSpellPointsBonus.Hint"),
      type: String,
      placeholder: "0"
    };

    CONFIG.DND5E.characterFlags.longRestSpellPointsFormula = {
      section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
      name: game.i18n.localize("REST-RECOVERY.Traits.LongRestSpellPointsFormula.Title"),
      hint: game.i18n.localize("REST-RECOVERY.Traits.LongRestSpellPointsFormula.Hint"),
      type: String,
      placeholder: getSetting(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA)
    };
  }

  if (getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) {

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

let styleTag = false;

function patch_actorSheet(app, html, data) {

  let actor = game.actors.get(data.actor._id);

  if(game.modules.get("tidy5e-sheet")?.active && lib.getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION)){

    if(!styleTag) {
      styleTag = document.createElement("style");
      document.head.appendChild(styleTag);
      styleTag.type = "text/css";
      styleTag.appendChild(document.createTextNode(`
    .tidy5e.sheet.actor .exhaustion-container:hover .exhaustion-wrap {
      width: 254px;
    }`));
    }

    const exhaustionElem = [
      $(`<li data-elvl="7">7</li>`),
      $(`<li data-elvl="8">8</li>`),
      $(`<li data-elvl="9">9</li>`),
      $(`<li data-elvl="10">10</li>`)
    ]

    exhaustionElem.forEach(elem => {
      elem.on("click", async function(event) {
        event.preventDefault();
        let target = event.currentTarget;
        let value = Number(target.dataset.elvl);
        await actor.update({ "system.attributes.exhaustion": value });
      })
    })

    html.find(".exhaust-level").append(exhaustionElem)

  }

  let border = true;
  let targetElem = html.find('.center-pane .attributes')[0];
  if (!targetElem) {
    border = false;
    targetElem = html.find('.center-pane .resources')[0];
    if (!targetElem) return;
  }
  const elem = $(`<div class="form-group" style="${border ? "border-bottom: 2px groove #eeede0; padding-bottom: 0.25rem;" : "padding-top: 0.25rem;"} flex:0;"  title="Module: Rest Recovery for 5e">
        <label style="flex: none; line-height: 20px; font-weight: bold; margin: 0 10px 0 0;">${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}</label>
        <a class="config-button" title="${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}" style="flex:1;">
            <i class="fas fa-cog" style="float: right; margin-right: 3px; text-align: right; color: #999;"></i>
        </a>
    </div>`);
  elem.insertAfter(targetElem);
  elem.find('.config-button').on('click', function () {
    ResourceConfig.show({ actor });
  });
}

function patch_itemSheet(app, html, { item } = {}) {

  if (getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && item.type === "consumable") {
    patch_itemConsumableInputs(app, html, item);
  }

  patch_itemCustomRecovery(app, html, item);
}

function patch_itemConsumableInputs(app, html, item) {

  const customConsumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};
  const uses = Number(foundry.utils.getProperty(item, "system.uses.max"));
  const per = foundry.utils.getProperty(item, "system.uses.per");
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

function patch_itemCustomRecovery(app, html, item) {

  const customRecovery = foundry.utils.getProperty(item, `${CONSTANTS.FLAGS.RECOVERY_ENABLED}`) ?? false;
  const customFormula = foundry.utils.getProperty(item, `${CONSTANTS.FLAGS.RECOVERY_FORMULA}`) ?? "";
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
