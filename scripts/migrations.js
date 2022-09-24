import { getSetting, setSetting } from "./lib/lib.js";
import CONSTANTS from "./constants.js";

let oldSettings;
export default async function migrate(){
  
  oldSettings = game.settings.storage.get("world").filter(setting => setting.key.includes('rest-recovery'))
  
  await migrate_1_3_3()
  
}

function findOldSettingValue(oldSettingKey){
  return oldSettings.find(setting => setting.key.endsWith(oldSettingKey)).value;
}

async function migrate_1_3_3(){
  
  const moduleVersion = game.modules.get(CONSTANTS.MODULE_NAME).version;
  const migrationVersion = getSetting(CONSTANTS.SETTINGS.MIGRATION_VERSION);
  
  if(!isNewerVersion(moduleVersion, migrationVersion)) return;
  
  await setSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA, findOldSettingValue("recovery-hitpoints-formula"));
  await setSetting(CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA, findOldSettingValue("recovery-hitdice-formula"));
  await setSetting(CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER_FORMULA, findOldSettingValue("recovery-resources-formula"));
  await setSetting(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA, findOldSettingValue("recovery-spells-formula"));
  await setSetting(CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER_FORMULA, findOldSettingValue("recovery-uses-others-formula"));
  await setSetting(CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER_FORMULA, findOldSettingValue("recovery-uses-feats-formula"));
  await setSetting(CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER_FORMULA, findOldSettingValue("recovery-day-formula"));
  
  await setSetting(CONSTANTS.SETTINGS.MIGRATION_VERSION, moduleVersion);
  
}