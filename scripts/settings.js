import CONSTANTS from "./constants.js";
import SettingsShim from "./formapplications/settings/settings.js";
import { getSetting } from "./lib/lib.js";
import { writable } from "svelte/store";
import plugins from "./plugins.js";

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
    return this.profiles?.[this.activeProfile];
  }

  get(key, localize = false) {
    const value = game.settings.get(this.namespace, key);
    if (localize) return game.i18n.localize(value);
    return value;
  }

  set(key, value) {
    if (this.settings.get(key)) {
      this.settings.get(key).store.set(value);
    }
    return game.settings.set(this.namespace, key, value);
  }

  register(key, options) {
    game.settings.register(this.namespace, key, options);
    if (!options.group) return;
    const value = getSetting(key);
    const store = writable(value);
    const setting = {
      ...options, store, key, value,
      disabled: writable(false)
    };
    this.settings.set(key, setting);
    store.subscribe((val) => {
      if (!this.initialized) return;
      setting.value = val;
      this.activeProfileData[key] = val;
      this.validateSettings(key);
    });
    if (setting.hidden) return;
    const group = this.groupedSettings.get(options.group) ?? [];
    group.push(setting);
    this.groupedSettings.set(options.group, group);
  }

  reset(key) {
    const setting = this.settings.get(key);
    setting.store.set(setting.default);
  }

  resetAll() {
    for (const key of this.settings.keys()) {
      this.reset(key);
    }
  }

  validateSettings(changedSettingKey = false) {
    const settingsToValidate = Array.from(this.settings).filter(([_, setting]) => {
      return setting?.dependsOn && (!changedSettingKey || setting?.dependsOn.includes(changedSettingKey))
    });
    for (const [key, setting] of settingsToValidate) {
      const disabled = setting.validate(this.settings);
      setting.disabled.set(disabled);
      if (disabled) {
        this.reset(key)
      }
    }
  }

  async updateSettingsFromActiveProfile(persist = false) {
    for (const [key, setting] of this.settings) {
      const value = this.activeProfileData[key];
      setting.store.set(value);
      if (persist) {
        await this.set(key, value)
      }
    }
  }

  async setActiveProfile(inProfile, persist = false) {
    this.activeProfile = inProfile;
    await this.updateSettingsFromActiveProfile(persist);
    if (!persist) return;
    return this.set(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE, this.activeProfile);
  }

  async createProfile(inProfile, inProfileData, setActive = false, persist = false) {
    this.profiles[inProfile] = inProfileData;
    await this.updateProfiles(this.profiles, persist);
    if (setActive) {
      await this.setActiveProfile(inProfile, persist);
    }
  }

  async updateProfiles(inProfiles, persist = false) {
    this.profiles = inProfiles;
    await this.updateSettingsFromActiveProfile(persist);
    if (!persist) return;
    return this.set(CONSTANTS.SETTINGS.MODULE_PROFILES, this.profiles)
  }

  async deleteProfile(inProfile, persist = false) {
    delete this.profiles[inProfile];
    await this.updateProfiles(this.profiles, persist);
    return this.setActiveProfile("Default", persist);
  }

  async persistSettings() {
    await this.updateProfiles(this.profiles, true);
    await this.setActiveProfile(this.activeProfile, true);
    if (this.settings.get(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION).value
      && this.settings.get(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION).value === CONSTANTS.MODULES.DFREDS) {
      await plugins.createConvenientEffect();
    }
  }

  cleanup() {
    for (const [key, setting] of this.settings) {
      setting.store.set(getSetting(key));
      if (!setting.customFormula) continue;
      setting.customFormulaSetting = this.settings.get(setting.customFormula);
    }
    this.validateSettings();
    this.activeProfile = this.get(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE);
    this.profiles = foundry.utils.deepClone(this.get(CONSTANTS.SETTINGS.MODULE_PROFILES));
    this.initialized = true;
  }

  initialize() {

    game.settings.registerMenu(this.namespace, "configureRest", {
      name: "REST-RECOVERY.Settings.Configure.Title",
      label: "REST-RECOVERY.Settings.Configure.Label",
      hint: "REST-RECOVERY.Settings.Configure.Hint",
      icon: "fas fa-bed",
      type: SettingsShim,
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
      scope: "client",
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
