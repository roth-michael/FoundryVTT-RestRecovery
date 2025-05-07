import CONSTANTS from "./constants.js";
import { getSetting, setSetting } from "./lib/lib.js";
import { configureOneDndExhaustion, configureExhaustionHooks } from "./helpers.js";
import { registerTraits } from "./sheet-overrides.js";
import { SettingsApplication } from "./apps/settings.js";
import { QuickSetupApplication } from "./apps/quickSetup.js";

class RestRecoverySettings {
  constructor() {
    this.namespace = CONSTANTS.MODULE_NAME;
    this.settings = new Map();
    this.groupedSettings = new Map();
    this.activeProfile = "";
    this.profiles = {};
    this.initialized = false;
  }

  get activeProfileData() {
    return this.profiles?.[this.activeProfile] ?? {};
  }

  setProfileData(key, value){
    this.activeProfileData[key] = value;
  }

  set(key, value, persist = true) {
    if (this.settings.get(key)) {
      this.settings.get(key).value = value;
    }
    if (persist) return setSetting(key, value);
  }

  register(key, options) {
    game.settings.register(this.namespace, key, options);
    if (!options.group) return;
    const value = getSetting(key);
    const that = this;
    const setting = new Proxy({
      ...options, key, value, disabled: false
    }, {
      set(obj, prop, value) {
        obj[prop] = value;
        if (prop === "value") {
          that.setProfileData(key, value);
          that.validateSettings(key);
        }
        return true;
      }
    });
    this.settings.set(key, setting);
    if (setting.hidden) return;
    const group = this.groupedSettings.get(options.group) ?? [];
    group.push(setting);
    this.groupedSettings.set(options.group, group);
  }

  reset(key) {
    const setting = this.settings.get(key);
    setting.value = setting.default;
    if (game.ready) setSetting(key, setting.default); // Shouldn't be necessary.. but seems to be
  }

  resetAll() {
    for (const key of this.settings.keys()) {
      this.reset(key);
    }
  }

  validateSettings(changedSettingKey = false) {
    const settingsToValidate = Array.from(this.settings).filter(([_, setting]) => {
      return setting?.moduleIntegration || (setting?.dependsOn && (!changedSettingKey || setting?.dependsOn.includes(changedSettingKey)))
    });
    for (const [key, setting] of settingsToValidate) {
      const disabled = setting.validate(this.settings);
      setting.disabled = disabled;
      if (disabled && (setting.value !== setting.default)) {
        this.reset(key)
      }
    }
  }

  async updateSettingsFromActiveProfile(persist = false) {
    for (const [key, setting] of this.settings) {
      const value = this.activeProfileData?.[key] ?? setting.default;
      setting.value = value;
      await this.set(key, value, persist);
    }
  }

  async setActiveProfile(inProfile, persist = false) {
    this.activeProfile = inProfile;
    await this.updateSettingsFromActiveProfile(persist);
    return this.set(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE, this.activeProfile, persist);
  }

  async createProfile(inProfile, inProfileData, setActive = false, persist = false) {
    this.profiles[inProfile] = inProfileData;
    await this.updateProfiles(persist);
    if (setActive) {
      await this.setActiveProfile(inProfile, persist);
    }
  }

  async updateProfiles(persist = false) {
    await this.updateSettingsFromActiveProfile(persist);
    return this.set(CONSTANTS.SETTINGS.MODULE_PROFILES, this.profiles, persist)
  }

  async deleteProfile(inProfile, persist = false) {
    delete this.profiles[inProfile];
    await this.setActiveProfile("Default", persist);
    return this.updateProfiles(persist);
  }

  async persistSettings() {
    await this.updateProfiles(true);
    await this.setActiveProfile(this.activeProfile, true);
    await configureOneDndExhaustion();
    await configureExhaustionHooks();
    registerTraits();
  }

  cleanup() {
    for (const [key, setting] of this.settings) {
      setting.value = getSetting(key);
      if (!setting.customFormula) continue;
      setting.customFormulaSetting = this.settings.get(setting.customFormula);
    }
    this.validateSettings();
    this.activeProfile = getSetting(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE);
    this.profiles = foundry.utils.deepClone(getSetting(CONSTANTS.SETTINGS.MODULE_PROFILES));
    this.initialized = true;
  }

  initialize() {

    game.settings.registerMenu(this.namespace, "quickSetup", {
      name: "REST-RECOVERY.Settings.QuickSetup.Title",
      label: "REST-RECOVERY.Settings.QuickSetup.Label",
      hint: "REST-RECOVERY.Settings.QuickSetup.Hint",
      icon: "fas fa-cog",
      type: QuickSetupApplication,
      restricted: true
    });

    game.settings.registerMenu(this.namespace, "configureRest", {
      name: "REST-RECOVERY.Settings.Configure.Title",
      label: "REST-RECOVERY.Settings.Configure.Label",
      hint: "REST-RECOVERY.Settings.Configure.Hint",
      icon: "fas fa-bed",
      type: SettingsApplication,
      restricted: true
    });

    for (const [key, options] of Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())) {
      this.register(key, options);
    }

    let customSettings = !!Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).find(setting => {
      return getSetting(setting[0]) !== setting[1].default;
    })

    this.register(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE, {
      scope: "world",
      config: false,
      default: customSettings ? "Custom" : "Default",
      type: String
    });

    const moduleProfiles = {
      "Default": Object.fromEntries(Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).map(entry => {
        return [entry[0], entry[1].default];
      }))
    };

    if (customSettings) {
      moduleProfiles["Custom"] = Object.fromEntries(Object.keys(CONSTANTS.GET_DEFAULT_SETTINGS()).map(key => {
        return [key, getSetting(key)];
      }));
    }

    this.register(CONSTANTS.SETTINGS.MODULE_PROFILES, {
      scope: "world",
      config: false,
      default: moduleProfiles,
      type: Object
    });

    this.register(CONSTANTS.SETTINGS.SHOW_PLAYER_LIST_REST_BUTTON, {
      name: "REST-RECOVERY.Settings.ShowPlayerListRestButton.Title",
      hint: "REST-RECOVERY.Settings.ShowPlayerListRestButton.Hint",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
    });

    this.register(CONSTANTS.SETTINGS.QUICK_HD_ROLL, {
      name: "REST-RECOVERY.Settings.QuickHDRoll.Title",
      hint: "REST-RECOVERY.Settings.QuickHDRoll.Hint",
      scope: "client",
      config: true,
      default: true,
      type: Boolean
    });

    this.cleanup();

  }

}

export const gameSettings = new RestRecoverySettings();
