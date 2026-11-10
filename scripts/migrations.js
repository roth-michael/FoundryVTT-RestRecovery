import { getSetting, setSetting } from "./lib/lib.js";
import CONSTANTS from "./constants.js";

let oldSettings;
export default async function migrate() {

  oldSettings = game.settings.storage.get("world").filter(setting => setting.key.includes('rest-recovery'))

  const sortedMigrations = Object.entries(migrations).sort((a, b) => {
    return foundry.utils.isNewerVersion(b[0], a[0]) ? -1 : 1;
  });

  let migrationAlert;

  for (const [version, migration] of sortedMigrations) {
    const migrationVersion = getSetting(CONSTANTS.SETTINGS.MIGRATION_VERSION);
    if (!foundry.utils.isNewerVersion(version, migrationVersion)) continue;
    migrationAlert ??= ui.notifications.info("REST-RECOVERY.MigrationBegun", {permanent: true, localize: true});
    await migration();
  }
  if (migrationAlert) {
    migrationAlert.remove();
    ui.notifications.success("REST-RECOVERY.MigrationComplete", {localize: true});
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
  },

  "5.2.0": async () => {
    if (findOldSettingValue("enable-simple-calendar-notes")) {
      await setSetting(CONSTANTS.SETTINGS.ENABLE_CALENDARIA_NOTES, findOldSettingValue("enable-simple-calendar-notes"));
    }
    if (findOldSettingValue("simple-calendar-notes-only-prompted")) {
      await setSetting(CONSTANTS.SETTINGS.CALENDARIA_NOTES_ONLY_PROMPTED, findOldSettingValue("simple-calendar-notes-only-prompted"));
    }
  },

  "7.0.0": async () => {
    const createBatch = (parent, items) => {
      const updates = [];
      for (const item of items) {
        if (item.type !== "consumable") continue;
        if (item.system?.type?.value !== "food") continue;
        const isFood = ["food", "both"].includes(item.system.type.subtype);
        const isWater = ["water", "both"].includes(item.system.type.subtype);
        const isDaysWorth = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH);
        if (!isFood && !isWater && !isDaysWorth) continue;
        const update = {_id: item.id, system: {properties: [...item.system.properties]}};
        if (isFood) {
          foundry.utils.setProperty(update, "system.type.subtype", "");
          update.system.properties.push("nutritious");
        }
        if (isWater) {
          foundry.utils.setProperty(update, "system.type.subtype", "");
          update.system.properties.push("hydrating");
        }
        if (isDaysWorth) {
          foundry.utils.setProperty(update, CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH, _del);
          update.system.properties.push("daysWorth");
        }
        updates.push(update);
      }
      if (!updates.length) return null;
      return {
        updates,
        action: "update",
        documentName: "Item",
        parent
      };
    }
    const allSyntheticActors = game.scenes.map(s => s.tokens.filter(t => t.actor?.isToken).map(t => t.actor)).flat();
    const allWorldActors = allSyntheticActors.concat(...game.actors).filter(Boolean);
    const operations = [];
    const worldItemOperation = createBatch(null, game.items);
    if (worldItemOperation) operations.push(worldItemOperation);
    for (const actor of allWorldActors) {
      const actorOperation = createBatch(actor, actor.items);
      if (actorOperation) operations.push(actorOperation);
    }
    if (operations.length) await foundry.documents.modifyBatch(operations);
  }

}
