import { localize } from "../lib/lib";
import { gameSettings } from "../settings";
import { SaveProfileApplication } from "./saveProfile";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class SettingsApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  
  static PARTS = {
    header: {
      template: "modules/rest-recovery/templates/settings/header.hbs"
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs"
    },
    general: {
      template: "modules/rest-recovery/templates/settings/settings-tab.hbs",
      scrollable: [""]
    },
    longRest: {
      template: "modules/rest-recovery/templates/settings/settings-tab.hbs",
      scrollable: [""]
    },
    shortRest: {
      template: "modules/rest-recovery/templates/settings/settings-tab.hbs",
      scrollable: [""]
    },
    itemNames: {
      template: "modules/rest-recovery/templates/settings/settings-tab.hbs",
      scrollable: [""]
    },
    foodAndWater: {
      template: "modules/rest-recovery/templates/settings/settings-tab.hbs",
      scrollable: [""]
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    }
  }

  static TABS = {
    sheet: {
      tabs: [
        { id: "general" },
        { id: "longRest" },
        { id: "shortRest" },
        { id: "itemNames" },
        { id: "foodAndWater" }
      ],
      initial: "general",
      labelPrefix: "REST-RECOVERY.Dialogs.ModuleConfig.TABS"
    }
  }

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    id: "rest-recovery-app",
    classes: ["rest-recovery-settings-app"],
    window: {
      title: "Rest Recovery",
      contentClasses: ["standard-form"],
      resizable: true,
    },
    position: {
      width: 600,
      height: 900
    },
    tag: "form",
    form: {
      handler: SettingsApplication.persistSettings,
      submitOnChange: false,
      closeOnSubmit: true
    },
    actions: {
      exportProfile: SettingsApplication.#onExportProfile,
      importProfile: SettingsApplication.#onImportProfile,
      newProfile: SettingsApplication.#onNewProfile,
      resetDefault: SettingsApplication.#onResetDefault,
      deleteProfile: SettingsApplication.#onDeleteProfile,
      resetSetting: SettingsApplication.#onResetSetting
    }
  }, { inplace: false })

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.buttons = [{type: "submit", icon: "fa-solid fa-floppy-disk", label: "REST-RECOVERY.Dialogs.ModuleConfig.Submit"}];
    context.profiles = gameSettings.profiles;
    context.activeProfile = gameSettings.activeProfile;
    return context;
  }

  async _preparePartContext(partId, context) {
    const partContext = await super._preparePartContext(partId, context);
    if (partId in partContext.tabs) {
      partContext.tab = partContext.tabs[partId];
      partContext.settings = gameSettings.groupedSettings.get(partId);
    }
    return partContext;
  }

  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);
    const target = event.target;
    if (target.id === "active-profile") {
      const newValue = target.value;
      return gameSettings.setActiveProfile(newValue, true).then(() => this.render());
    }
    const setting = gameSettings.settings.get(target.name);
    if (!setting) return this.render();
    if (target.type === "checkbox") {
      setting.value = target.checked;
    } else {
      setting.value = target.value;
    }
    if (setting.callback) setting.callback(gameSettings.settings);
    this.render();
  }

  _getHeaderControls() {
    const controls = super._getHeaderControls();
    controls.push({
      icon: "fa-solid fa-file-export",
      label: "REST-RECOVERY.Dialogs.ModuleConfig.ExportProfile",
      action: "exportProfile"
    }, {
      icon: "fa-solid fa-file-import",
      label: "REST-RECOVERY.Dialogs.ModuleConfig.ImportProfile",
      action: "importProfile"
    });
    return controls;
  }

  _onClose(options) {
    gameSettings.cleanup();
  }

  static async persistSettings(event, form, formData) {
    await gameSettings.persistSettings();
  }

  static #onExportProfile() {
    const selectedProfile = gameSettings.activeProfile;
    const profileData = gameSettings.activeProfileData;
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(profileData)], { type: "text/json" });
    a.href = URL.createObjectURL(file);
    a.download = selectedProfile + ".json";
    a.click();
    a.remove();
  }

  static #onImportProfile() {
    const profiles = gameSettings.profiles;
    const input = document.createElement("input");
    input.type = "file";

    input.addEventListener("change", e => {
      input.remove();

      // getting a hold of the file reference
      const file = e.target.files[0];
      const fileName = file.name;

      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        try {
          const newProfileName = await new Promise(resolve => {
            new SaveProfileApplication({
              profileName: fileName.split(".")[0],
              resolve
            }).render(true);
          });

          const newProfile = foundry.utils.duplicate(profiles["Default"]);

          const profileData = JSON.parse(reader.result);

          for (const [key, value] of Object.entries(profileData)) {
            newProfile[key] = value;
          }

          gameSettings.createProfile(newProfileName, newProfile, true, true);

          this.render(true);
        } catch (err) {
          console.error(err);
        }
      });

      reader.readAsText(file);
    });

    input.click();
  }

  static async #onNewProfile() {
    const result = await new Promise(resolve => {
      new SaveProfileApplication({
        resolve
      }).render(true);
    });

    if (!result) return;
    const newProfile = foundry.utils.duplicate(gameSettings.activeProfileData);
    await gameSettings.createProfile(result, newProfile, true);
    this.render();
  }

  static async #onResetDefault() {
    const result = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: localize("REST-RECOVERY.Dialogs.ResetDefaultChanges.Title")
      },
      content: localize("REST-RECOVERY.Dialogs.ResetDefaultChanges.Content")
    });
    if (!result) return;

    gameSettings.resetAll();
    this.render();
  }

  static async #onDeleteProfile() {
    const result = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: localize("REST-RECOVERY.Dialogs.DeleteProfile.Title")
      },
      content: localize("REST-RECOVERY.Dialogs.DeleteProfile.Content", { profile: gameSettings.activeProfile })
    })

    if (!result) {
      return;
    }

    await gameSettings.deleteProfile(gameSettings.activeProfile);
    this.render();
  }

  static #onResetSetting(event) {
    const key = event.target.dataset?.key;
    if (!key) return;
    gameSettings.reset(key);
    this.render();
  }
}