import * as lib from "./lib/lib.js";
import CONSTANTS from "./constants.js";

export default class API {

    static getAllProfiles(){
        return Object.keys(this.getAllProfilesData());
    }

    static getAllProfilesData(){
        return lib.getSetting(CONSTANTS.SETTINGS.MODULE_PROFILES);
    }

    static getProfileData(inProfileName){
        const profile = this.getAllProfilesData()[inProfileName];
        if(!profile){
            ui.notifications.error(`Rest Recovery | Profile "${inProfileName}" does not exist`);
            throw new Error(`Rest Recovery | Profile "${inProfileName}" does not exist`);
        }
        return profile;
    }

    static getActiveProfile(){
        return lib.getSetting(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE)
    }

    static getActiveProfileData(){
        return this.getProfileData(this.getActiveProfile());
    }

    static async setActiveProfile(inProfileName){
        await lib.setSetting(CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE, inProfileName);
        const profile = this.getProfileData(inProfileName);
        const defaultSettings = CONSTANTS.GET_DEFAULT_SETTINGS();
        for(let key of Object.keys(defaultSettings)) {
            const value = profile[key] ?? defaultSettings[key].default;
            await lib.setSetting(key, value);
        }
        return profile;
    }

    static updateProfiles(inProfiles){
        const defaultSettings = CONSTANTS.GET_DEFAULT_SETTINGS();
        for(let profileName of Object.keys(inProfiles)) {
            const profileData = {};
            for (let key of Object.keys(defaultSettings)) {
                profileData[key] = inProfiles[profileName][key] ?? defaultSettings[key].default;
            }
            inProfiles[profileName] = profileData;
        }
        return lib.setSetting(CONSTANTS.SETTINGS.MODULE_PROFILES, inProfiles);
    }

    static updateProfile(inProfileName, inData){
        const profile = this.getProfileData(inProfileName);
        const profiles = this.getAllProfiles();
        const newData = {};
        const defaultSettings = CONSTANTS.GET_DEFAULT_SETTINGS();
        for (let key of Object.keys(defaultSettings)) {
            newData[key] = inData[key] ?? profile[key] ?? defaultSettings[key].default;
        }
        profiles[inProfileName] = newData;
        return lib.setSetting(CONSTANTS.SETTINGS.MODULE_PROFILES, profiles);
    }

}