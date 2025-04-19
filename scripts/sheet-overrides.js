import CONSTANTS from "./constants.js";
import { getSetting } from "./lib/lib.js";

export default function registerSheetOverrides() {
  Hooks.on("renderDocumentSheetV2", patch_itemSheet);
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

function patch_itemSheet(app, html) {
  if (app.document?.documentName !== "Item") return;
  const item = app.item;
  if (!item) return;
  html = html instanceof HTMLElement ? html : html[0];
  if (!getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) || item.type !== "consumable" || item.system.type?.value !== "food") return;
  if (!app.options.classes.includes("tidy5e-sheet")) {
    patch_itemConsumableInputs(html, item);
  } else {
    patch_tidyItemConsumableInputs(html, item);
  }
}

function patch_itemConsumableInputs(html, item) {
  let targetElem = html.querySelector(".form-group:has(select[name='system.type.subtype'])")
  if (!targetElem) return;
  const customConsumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};
  const fullDay = dnd5e.applications.fields.createCheckboxInput(undefined, {
    name: CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH,
    value: customConsumable.dayWorth
  });
  if (!html.classList.contains("editable") && !html.querySelector("form")?.classList.contains("editable")) fullDay.disabled = true;
  const fullDayGroup = foundry.applications.fields.createFormGroup({
    label: "REST-RECOVERY.Dialogs.ItemOverrides.DayWorth",
    localize: true,
    input: fullDay
  });
  targetElem.after(fullDayGroup);
}

function patch_tidyItemConsumableInputs(element, item) {
  let targetElem = element.querySelector(".form-group:has(select[data-tidy-field='system.type.subtype'])");
  if (!targetElem) return;
  let existingElem = element.querySelector(`input[name="${CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH}"]`);
  if (existingElem) return;
  const customConsumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) ?? {};
  const elemToInject = document.createElement("div");
  elemToInject.classList.add("form-group");
  elemToInject.innerHTML = `
    <div class="form-fields">
      <label class="checkbox"">
        <input type="checkbox" name="${CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH}" ${customConsumable.dayWorth ? "checked" : ""}> ${game.i18n.localize("REST-RECOVERY.Dialogs.ItemOverrides.DayWorth")}
      </label>
    </div>
  `;
  targetElem.after(elemToInject);
}
