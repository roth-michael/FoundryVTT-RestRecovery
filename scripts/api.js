import * as lib from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import PromptRestDialog from "./formapplications/prompt-rest/prompt-rest.js";
import { gameSettings } from "./settings.js";
import RestWorkflow from "./rest-workflow.js";

export default class API {

	static get daeFlags() {
		return CONSTANTS.FLAGS.DAE;
	}

  /**
   * Renders the prompt rest UI.
   *
   * @returns {Promise<SvelteApplication>/boolean}
   */
  static renderPromptRestInterface() {
    if (!game.user.isGM) return false;
    return PromptRestDialog.show();
  }

  /**
   * Returns an array containing all the module profile names
   *
   * @returns {string[]}
   */
  static getAllProfiles() {
    return Object.keys(this.getAllProfilesData());
  }

  /**
   * Returns the module profile object with each ones' settings
   *
   * @returns {object}
   */
  static getAllProfilesData() {
    return foundry.utils.deepClone(gameSettings.profiles);
  }

  /**
   * Returns a given module profile's data if it exists
   *
   * @param {string} inProfileName
   * @returns {object/boolean}
   */
  static getProfileData(inProfileName) {
    return gameSettings.activeProfileData ?? false;
  }

  /**
   * Returns the name of the active module profile
   *
   * @returns {string}
   */
  static getActiveProfile() {
    return gameSettings.activeProfile;
  }

  /**
   * Returns the data for the active module profile
   *
   * @returns {object}
   */
  static getActiveProfileData() {
    return this.getProfileData(this.getActiveProfile());
  }

  /**
   * Sets the current active module profile
   *
   * @param {string} inProfileName
   * @returns {Promise<object>}
   */
  static async setActiveProfile(inProfileName) {
    return gameSettings.setActiveProfile(inProfileName, true);
  }

  /**
   * Updates all module profiles with new settings.  This may be a partial update (such as only updating some keys of some profiles).
   *
   * @param {object} inProfiles
   * @returns {Promise<*>}
   */
  static updateProfiles(inProfiles) {
    const defaultSettings = CONSTANTS.GET_DEFAULT_SETTINGS();
    for (let profileName of Object.keys(inProfiles)) {
      const profileData = {};
      const originalProfileData = this.getProfileData(profileName) || {};
      for (let key of Object.keys(defaultSettings)) {
        profileData[key] = inProfiles[profileName][key] ?? originalProfileData[key] ?? defaultSettings[key].default;
      }
      inProfiles[profileName] = profileData;
    }
    return gameSettings.updateProfiles(inProfiles, true);
  }

  /**
   * Applies new settings on a given module profile. This may be a partial update (such as only updating one key of a given profile).
   *
   * @param {string} inProfileName
   * @param {object} inData
   * @returns {Promise<*>}
   */
  static updateProfile(inProfileName, inData) {
    const profile = this.getProfileData(inProfileName);
    const profiles = this.getAllProfilesData();
    const newData = {};
    const defaultSettings = CONSTANTS.GET_DEFAULT_SETTINGS();
    for (let key of Object.keys(defaultSettings)) {
      newData[key] = inData[key] ?? profile[key] ?? defaultSettings[key].default;
    }
    profiles[inProfileName] = newData;
    return gameSettings.updateProfiles(profiles, true);
  }

  /**
   * Sets the food, water, and/or starvation levels of a given actor.
   *
   * @param {Actor} actor
   * @param {number|null} [food] food
   * @param {number|null} [water] water
   * @param {number|null} [starvation] starvation
   * @returns {Promise<boolean>}
   */
  static setActorConsumableValues(actor, { food = null, water = null, starvation } = {}) {
    if (!(actor instanceof game.dnd5e.documents.Actor5e)) {
      throw new Error("actor must instance of Actor5e")
    }
    const update = {};
    if (food !== null) {
      if (!(lib.isRealNumber(food) && food >= 0)) throw new Error("food must be of type number greater or equal than 0")
      update[CONSTANTS.FLAGS.SATED_FOOD] = food;
    }
    if (water !== null) {
      if (!(lib.isRealNumber(water) && water >= 0)) throw new Error("water must be of type number greater or equal than 0")
      update[CONSTANTS.FLAGS.SATED_WATER] = water;
    }
    if (starvation !== null) {
      if (!(lib.isRealNumber(starvation) && starvation >= 0)) throw new Error("starvation must be of type number greater or equal than 0")
      update[CONSTANTS.FLAGS.STARVATION] = starvation;
    }
    return actor.update(update);
  }

  /**
   * Creates actorUpdate & message contents as if the item were consumed by the actor. 
   * Does not consume uses of the item, update the actor, or create a message on its own.
   * 
   * @param {Item} item 
   * @param {Actor} actor 
   * @returns {[Object, string] | []} - Either an empty array or an array with [actorUpdates, messageString]
   */
  static getActorConsumableUpdates(item, actor) {
    if (!actor) actor = item.parent;
    return RestWorkflow._consumableItemHelper(item, undefined, undefined, actor)
  }

}
