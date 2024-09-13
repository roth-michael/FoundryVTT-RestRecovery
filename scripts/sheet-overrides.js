import CONSTANTS from "./constants.js";
import ResourceConfig from "./formapplications/resource-config/resource-config.js";
import * as lib from "./lib/lib.js";
import { getSetting } from "./lib/lib.js";

export default function registerSheetOverrides() {
  Hooks.on("renderItemSheet5e", patch_itemSheet);
  Hooks.on("tidy5e-sheet.renderItemSheet", patch_tidyItemSheet);
  Hooks.on("renderActorSheet5e", patch_actorSheet);
  registerTraits();
}

export function registerTraits() {

  CONFIG.DND5E.characterFlags.hitDieBonus = {
    section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
    name: game.i18n.localize("REST-RECOVERY.Traits.HitDieBonus.Title"),
    hint: game.i18n.localize("REST-RECOVERY.Traits.HitDieBonus.Hint"),
    type: String,
    placeholder: "0"
  };

  CONFIG.DND5E.characterFlags.hitDieAdvantage = {
    section: game.i18n.localize("REST-RECOVERY.Traits.Title"),
    name: game.i18n.localize("REST-RECOVERY.Traits.HitDieAdvantage.Title"),
    hint: game.i18n.localize("REST-RECOVERY.Traits.HitDieAdvantage.Hint"),
    type: Boolean,
    placeholder: false
  }

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
  if (app.options.classes.includes("dnd5e")) {
    let border = true;
    let targetElem = html.find(".center-pane .attributes")[0];
    if (!targetElem) {
      border = false;
      targetElem = html.find(".center-pane .resources")[0];
      if (!targetElem) return;
    }
    const elem = $(`<div class="form-group" style="${border ? "border-bottom: 2px groove #eeede0; padding-bottom: 0.25rem;" : "padding-top: 0.25rem;"} flex:0;"  title="Module: Rest Recovery for 5e">
          <label style="flex: none; line-height: 20px; font-weight: bold; margin: 0 10px 0 0;">${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}</label>
          <a class="config-button" title="${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}" style="flex:1;">
              <i class="fas fa-cog" style="float: right; margin-right: 3px; text-align: right; color: #999;"></i>
          </a>
      </div>`);
    elem.insertAfter(targetElem);
    elem.find(".config-button").on("click", function () {
      ResourceConfig.show({ actor });
    });
  } else if (app.options.classes.includes("dnd5e2")) {
    if (!html.hasClass("editable")) return;
    let targetElem = html.find(".favorites")[0];
    if (!targetElem) return;
    let border = false;
    const elem = $(`<div class="form-group" style="${border ? "border-bottom: 2px groove #eeede0; padding-bottom: 0.25rem;" : "padding-top: 0.25rem;"} flex:0;"  title="Module: Rest Recovery for 5e">
          <label style="flex: none; line-height: 20px; font-weight: bold; margin: 0 10px 0 0;">${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}</label>
          <a class="config-button" title="${game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure")}" style="flex:1;">
              <i class="fas fa-cog" style="float: right; margin-right: 3px; text-align: right; color: #999;"></i>
          </a>
      </div>`);
    elem.insertBefore(targetElem);
    elem.find(".config-button").on("click", function () {
      ResourceConfig.show({ actor });
    });
  }
}

function patch_itemSheet(app, html, { item } = {}) {
  if (!app.options.classes.includes("tidy5e-sheet")) {
    if (getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && item.type === "consumable" && item.system.type?.value === "food") {
      patch_itemConsumableInputs(app, html, item);
    }
  }
}

function patch_tidyItemSheet(app, element, { item }, forced) {
  if (getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && item.type === "consumable") {
    patch_tidyItemConsumableInputs(element, item);
  }
}

function getConsumableInputsHtml(item) {
  const customConsumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};
  const uses = Number(foundry.utils.getProperty(item, "system.uses.max"));
  const per = foundry.utils.getProperty(item, "system.uses.per");
  const validUses = uses && uses > 0 && per;
  let idealIsConsumableWidth = game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.IsConsumable").length + 3;
  let idealDayWorthWidth = game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.DayWorth").length;

  return `
    <div class="form-group">
      <div class="form-fields" style="margin-right:0.5rem;">
        <label class="checkbox"">
          <input type="checkbox" name="${CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH}" ${customConsumable.dayWorth ? "checked" : ""}> ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.DayWorth")}
        </label>
      </div>
    </div>
  `
}

function patch_itemConsumableInputs(app, html, item) {
  let targetElem = html.find(".form-group:has(select[name='system.type.subtype'])")?.[0]
  if (!targetElem) return;
  const customConsumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};
  const fullDay = dnd5e.applications.fields.createCheckboxInput(undefined, {
    name: CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH,
    value: customConsumable.dayWorth
  });
  const fullDayGroup = foundry.applications.fields.createFormGroup({
    label: "REST-RECOVERY.Dialogs.ItemOverrides.DayWorth",
    localize: true,
    input: fullDay
  });
  $(fullDayGroup).insertAfter(targetElem);
}

function patch_tidyItemConsumableInputs(element, item) {
  const html = $(element);
  const markupToInject = `
    <div style="display: contents;" data-tidy-render-scheme="handlebars">
      ${getConsumableInputsHtml(item)}
    </div>
  `;
  let targetElem = html.find(".form-header")?.[1];
  if (!targetElem) return;
  $(markupToInject).insertBefore(targetElem);
}
