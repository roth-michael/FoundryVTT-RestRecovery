import { localize } from "../lib/lib.js";
import { gameSettings } from "../settings.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
export class SaveProfileApplication extends HandlebarsApplicationMixin(ApplicationV2) {

  constructor(options = {}) {
    super(options);
    this.profileName = options.profileName ?? "New Preset";
    this.existingProfiles = Object.keys(gameSettings.profiles);
    this.resolve = options.resolve;
  }
  static PARTS = {
    dialog: {
      classes: ["dialog"],
      template: "modules/rest-recovery/templates/saveProfile/input.hbs"
    },
    errors: {
      classes: ["rest-recovery-errors"],
      template: "modules/rest-recovery/templates/saveProfile/errors.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    }
  }

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    tag: "form",
    classes: ["rest-recovery-save-profile", "standard-form"],
    window: {
      title: "REST-RECOVERY.Dialogs.SaveProfile.Title"
    },
    position: {
      width: 400
    },
    form: {
      handler: SaveProfileApplication.savePreset,
      submitOnChange: false,
      closeOnSubmit: true
    }
  }, {inplace: false})

  static async savePreset(event, form, formData) {
    const profileName = formData.object?.profileName;
    this.resolve(profileName);
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.profileName = this.profileName;
    context.duplicateProfileName = !!this.existingProfiles.find(i => i === context.profileName);
    context.buttons = [
      { type: "submit", icon: "fa-solid fa-save", label: localize("Okay"), disabled: !context.profileName?.length || context.duplicateProfileName }
    ];
    return context;
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const profileNameInput = this.element.querySelector('input[name="profileName"]');
    profileNameInput?.addEventListener("input", e => {
      this.profileName = e.currentTarget.value;
      this.render({
        parts: ["errors", "footer"]
      });
    })
  }

  _onClose(options) {
    if (!options.submitted) this.resolve(null);
  }
}