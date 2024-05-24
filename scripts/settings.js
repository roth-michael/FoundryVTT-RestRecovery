import CONSTANTS from "./constants.js";
import SettingsShim from "./formapplications/settings/settings.js";
import { getSetting, setSetting } from "./lib/lib.js";
import { get, writable } from "svelte/store";
import plugins from "./plugins.js";
import { QuickSetupShim } from "./formapplications/quick-setup/quick-setup.js";
import { configureOneDndExhaustion, configureExhaustionHooks } from "./helpers.js";

class RestRecoverySettings {

  constructor() {
    this.namespace = CONSTANTS.MODULE_NAME;
    this.settings = new Map();
    this.groupedSettings = new Map();
    this.activeProfileStore = writable("");
    this.profilesStore = writable({});
    this.initialized = false;
  }

  get profiles(){
    return get(this.profilesStore);
  }

  set profiles(profiles){
    this.profilesStore.set(profiles);
  }

  get activeProfile(){
    return get(this.activeProfileStore);
  }

  set activeProfile(activeProfile){
    this.activeProfileStore.set(activeProfile);
  }

  get activeProfileData() {
    return this.profiles?.[this.activeProfile] ?? {};
  }

  setProfileData(key, value){
    this.profilesStore.update(data => {
      data[this.activeProfile][key] = value;
      return data;
    })
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
      this.setProfileData(key, val);
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
      setting.disabled.set(disabled);
      if (disabled) {
        this.reset(key)
      }
    }
  }

  async updateSettingsFromActiveProfile(persist = false) {
    for (const [key, setting] of this.settings) {
      const value = this.activeProfileData?.[key] ?? setting.default;
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
    this.profilesStore.update(profiles => {
      profiles[inProfile] = inProfileData;
      return profiles;
    })
    await this.updateProfiles(persist);
    if (setActive) {
      await this.setActiveProfile(inProfile, persist);
    }
  }

  async updateProfiles(persist = false) {
    await this.updateSettingsFromActiveProfile(persist);
    if (!persist) return;
    return this.set(CONSTANTS.SETTINGS.MODULE_PROFILES, this.profiles)
  }

  async deleteProfile(inProfile, persist = false) {
    this.profilesStore.update(profiles => {
      delete profiles[inProfile];
      return profiles;
    })
    await this.updateProfiles(persist);
    return this.setActiveProfile("Default", persist);
  }

  async persistSettings() {
    await this.updateProfiles(true);
    await this.setActiveProfile(this.activeProfile, true);
    await configureOneDndExhaustion();
    await configureExhaustionHooks();
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

    game.settings.registerMenu(this.namespace, "quickSetup", {
      name: "REST-RECOVERY.Settings.QuickSetup.Title",
      label: "REST-RECOVERY.Settings.QuickSetup.Label",
      hint: "REST-RECOVERY.Settings.QuickSetup.Hint",
      icon: "fas fa-cog",
      type: QuickSetupShim,
      restricted: true
    });

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
