import CONSTANTS from "../constants";
import { getSetting, localize, setSetting } from "../lib/lib.js";
import { gameSettings } from "../settings.js";
import { SettingsApplication } from "./settings.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
export class QuickSetupApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(options = {}) {
    super(options);
    this.restVariant = getSetting(CONSTANTS.SETTINGS.REST_VARIANT);
    this.longRestCustomLength = getSetting(CONSTANTS.SETTINGS.CUSTOM_LONG_REST_DURATION_HOURS);
    this.shortRestCustomLength = getSetting(CONSTANTS.SETTINGS.CUSTOM_SHORT_REST_DURATION_HOURS);
    this.slowHealingEnabled = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE)
      && (getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) === CONSTANTS.FRACTIONS.NONE);
    this.bufferEnabled = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);
  }

  static PARTS = {
    form: {
      classes: ["dialog"],
      template: "modules/rest-recovery/templates/quick-setup.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    }
  }

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    tag: "form",
    classes: ["rest-recovery-quick-setup", "standard-form"],
    window: {
      title: "REST-RECOVERY.Dialogs.QuickSetup.Title"
    },
    position: {
      width: 350
    },
    form: {
      handler: QuickSetupApplication.submit,
      submitOnChange: false,
      closeOnSubmit: false
    },
    actions: {
      openSettings: QuickSetupApplication.#onOpenSettings
    }
  }, { inplace: false })

  static async submit(event, form, formData) {
    if (this.restVariant === "custom") {
      await gameSettings.set(CONSTANTS.SETTINGS.CUSTOM_LONG_REST_DURATION_HOURS, this.longRestCustomLength);
      await gameSettings.set(CONSTANTS.SETTINGS.CUSTOM_SHORT_REST_DURATION_HOURS, this.shortRestCustomLength);
    } else {
      await game.settings.set("dnd5e", "restVariant", this.restVariant);
    }
    await gameSettings.set(CONSTANTS.SETTINGS.REST_VARIANT, this.restVariant);
    await gameSettings.set(CONSTANTS.SETTINGS.HP_MULTIPLIER, this.slowHealingEnabled ? CONSTANTS.FRACTIONS.NONE : CONSTANTS.FRACTIONS.FULL);
    await gameSettings.set(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE, this.slowHealingEnabled);
    await gameSettings.set(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE, this.bufferEnabled);
    this.close();
  }

  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);
    const target = event.target;
    if (!target?.name) return this.render();
    if (target.type === "checkbox") {
      this[target.name] = target.checked;
    } else {
      this[target.name] = target.value;
    }
    this.render();
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.restVariant = this.restVariant;
    context.variants = {
      normal: "SETTINGS.DND5E.VARIANT.Rest.Normal",
      gritty: "SETTINGS.DND5E.VARIANT.Rest.Gritty",
      epic: "SETTINGS.DND5E.VARIANT.Rest.Epic",
      custom: "REST-RECOVERY.Dialogs.QuickSetup.5eRestCustom.Title"
    }
    context.longRestCustomLength = this.longRestCustomLength;
    context.shortRestCustomLength = this.shortRestCustomLength;
    context.slowHealingEnabled = this.slowHealingEnabled;
    context.bufferEnabled = this.bufferEnabled;
    context.buttons = [
      { type: "submit", icon: "fa-solid fa-check", label: localize("Submit") },
      { type: "button", icon: "fa-solid fa-cog", label: localize("REST-RECOVERY.Dialogs.QuickSetup.OpenSettings"), action: "openSettings" }
    ]
    return context;
  }

  static #onOpenSettings() {
    new SettingsApplication().render(true);
    this.close();
  }
}