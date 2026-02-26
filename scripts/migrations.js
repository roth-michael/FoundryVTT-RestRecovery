import { getSetting, setSetting } from "./lib/lib.js";
import CONSTANTS from "./constants.js";

let oldSettings;
export default async function migrate() {

  oldSettings = game.settings.storage.get("world").filter(setting => setting.key.includes('rest-recovery'))

  const sortedMigrations = Object.entries(migrations).sort((a, b) => {
    return foundry.utils.isNewerVersion(b[0], a[0]) ? -1 : 1;
  });

  for (const [version, migration] of sortedMigrations) {
    const migrationVersion = getSetting(CONSTANTS.SETTINGS.MIGRATION_VERSION);
    if (!foundry.utils.isNewerVersion(version, migrationVersion)) continue;
    await migration();
  }

  const moduleVersion = game.modules.get(CONSTANTS.MODULE_NAME).version;
  await setSetting(CONSTANTS.SETTINGS.MIGRATION_VERSION, moduleVersion);

}

function findOldSettingValue(oldSettingKey) {
  return oldSettings.find(setting => setting.key.endsWith(oldSettingKey))?.value;
}


const migrations = {

  "1.3.3": async () => {

    if (findOldSettingValue("recovery-hitpoints-formula")) {
      await setSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA, findOldSettingValue("recovery-hitpoints-formula"));
      await setSetting(CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA, findOldSettingValue("recovery-hitdice-formula"));
      // await setSetting(CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER_FORMULA, findOldSettingValue("recovery-resources-formula"));
      await setSetting(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA, findOldSettingValue("recovery-spells-formula"));
    }

  },

  // "1.4.4": async () => {

  //   if(game.modules.get("simple-calendar")?.active){
  //     await setSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION, true);
  //   }

  // },

  "1.11.0": async () => {
    let oldSetting = findOldSettingValue("short-rest-recovery-hd");
    if (oldSetting) {
      await setSetting(CONSTANTS.SETTINGS.HD_EFFECTIVE_MULTIPLIER, oldSetting);
    }
  },

  "5.0.0": async () => {
    const existingConfig = foundry.utils.getProperty(game.user, CONSTANTS.FLAGS.PROMPT_REST_CONFIG);
    if (existingConfig) {
      const newConfig = Array.from(new Set(existingConfig.map(i => i.split("-")[1]).filter(i => i)))
      await game.user.update({[CONSTANTS.FLAGS.PROMPT_REST_CONFIG]: newConfig});
    }
    let oldSimpleCalendarSetting = findOldSettingValue("enable-simple-calendar-integration");
    if (oldSimpleCalendarSetting) {
      await setSetting(CONSTANTS.SETTINGS.ENABLE_CALENDAR_INTEGRATION, oldSimpleCalendarSetting);
    }
  },

  "5.2.0": async () => {
    if (findOldSettingValue("enable-simple-calendar-notes")) {
      await setSetting(CONSTANTS.SETTINGS.ENABLE_CALENDARIA_NOTES, findOldSettingValue("enable-simple-calendar-notes"));
    }
    if (findOldSettingValue("simple-calendar-notes-only-prompted")) {
      await setSetting(CONSTANTS.SETTINGS.CALENDARIA_NOTES_ONLY_PROMPTED, findOldSettingValue("simple-calendar-notes-only-prompted"));
    }
  }

}
