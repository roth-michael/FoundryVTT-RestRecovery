import CONSTANTS from "./constants.js";
import { getSetting } from "./lib/lib.js";

export async function configureOneDndExhaustion() {
  if (getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION)) {
    if (CONFIG.DND5E.conditionTypes.exhaustion.levels !== 10) {
      if (!document.getElementById(CONSTANTS.STYLE_ELEMENT_ID)) {
        let styleElement = document.createElement('style');
        styleElement.setAttribute("id", CONSTANTS.STYLE_ELEMENT_ID);
        styleElement.innerHTML = `
          .pips[data-prop="system.attributes.exhaustion"] > .pip {
            width:12px;
            height:12px;
          }
          .pips[data-prop="system.attributes.exhaustion"]:nth-child(1) {
            column-gap:1px;
            padding-right:6px !important;
          }
          .pips[data-prop="system.attributes.exhaustion"]:nth-child(3) {
            column-gap:1px;
            padding-left:6px !important;
          }
        `;
        document.head.appendChild(styleElement);
      }
      CONFIG.DND5E.conditionTypes.exhaustion.levels = 10;
      CONFIG.DND5E.conditionTypes.exhaustion.icon = CONSTANTS.EXHAUSTION_ONE_DND_PATH;
      CONFIG.DND5E.conditionTypes.exhaustion.oldReference = CONFIG.DND5E.conditionTypes.exhaustion.oldReference ?? CONFIG.DND5E.conditionTypes.exhaustion.reference;
      CONFIG.DND5E.conditionTypes.exhaustion.reference = game.i18n.localize("REST-RECOVERY.JournalUuids.Exhaustion");
      CONFIG.DND5E.conditionEffects.halfMovement.delete("exhaustion-2");
      CONFIG.DND5E.conditionEffects.halfHealth.delete("exhaustion-4");
      CONFIG.DND5E.conditionEffects.noMovement.delete("exhaustion-5");
      CONFIG.DND5E.conditionEffects.abilityCheckDisadvantage.delete("exhaustion-1");
      CONFIG.DND5E.conditionEffects.abilitySaveDisadvantage.delete("exhaustion-3");
      CONFIG.DND5E.conditionEffects.attackDisadvantage.delete("exhaustion-3");
      delete CONFIG.DND5E.conditionTypes.exhaustion.reduction;
    }
    if (game.modules.get("tidy5e-sheet")?.active) {
      await updateTidy5e();
    }
  }
}

export function getRestFlavor(durationIn, newDay, longRest) {
  let duration;
  let units;
  if (durationIn % 1440 === 0) {
    duration = durationIn / 1440;
    units = duration > 1 ? 'Days' : 'Day';
  } else if (durationIn % 60 === 0) {
    duration = durationIn / 60;
    units = duration > 1 ? 'Hours' : 'Hour';
  } else {
    duration = durationIn;
    units = duration > 1 ? 'Minutes' : 'Minute';
  }
  return game.i18n.format(`REST-RECOVERY.Chat.Flavor.${longRest ? "Long" : "Short"}Rest${newDay ? "Newday" : "Normal"}`, {duration, units});
  
}

export async function updateTidy5e() {
  if (!game.user?.isGM) return;
  if (!game.settings.settings.has("tidy5e-sheet.exhaustionConfig")) return;
  let isOneDnd = getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION);
  let oldSettings = game.settings.get("tidy5e-sheet", "exhaustionConfig");
  await game.modules.get("tidy5e-sheet").api?.config?.exhaustion?.useSpecificLevelExhaustion({
    totalLevels: isOneDnd ? 10 : 6
  });
  let newSettings = game.settings.get("tidy5e-sheet", "exhaustionConfig");
  let typeChanged = oldSettings.type !== newSettings.type;
  let hintsChanged = oldSettings.hints?.length !== newSettings.hints?.length;
  let levelsChanged = oldSettings.levels !== newSettings.levels;
  if (!typeChanged && !hintsChanged && !levelsChanged) return;
  let chatMessageContent = "<p>" + game.i18n.localize("REST-RECOVERY.Chat.TidyChanged") + "</p>";
  if (typeChanged) {
    chatMessageContent += "<p>" + game.i18n.format("REST-RECOVERY.Chat.TidyTypeChanged", {oldType: oldSettings.type, newType: newSettings.type}) + "</p>";
  }
  if (hintsChanged) {
    chatMessageContent += "<p>" + game.i18n.localize("REST-RECOVERY.Chat.TidyHintsChanged") + "</p>";
  }
  if (levelsChanged) {
    chatMessageContent += "<p>" + game.i18n.format("REST-RECOVERY.Chat.TidyLevelsChanged", {oldLevels: oldSettings.levels, newLevels: newSettings.levels}) + "</p>";
  }
  await ChatMessage.implementation.create({
    flavor: "Rest Recovery",
    user: game.user.id,
    speaker: {alias: "Rest Recovery"},
    content: chatMessageContent,
    whisper: [game.users.activeGM?.id]
  });
}

export async function configureExhaustionHooks() {
  // Take em off first just in case, that way we're always last
  if (Hooks.events["dnd5e.preRollAttackV2"]) Hooks.off("dnd5e.preRollAttackV2", _preAttack);
  Hooks.on("dnd5e.preRollAttackV2", _preAttack);
}

function _preAttack(config) {
  if (config.subject?.actor?.hasConditionEffect("attackDisadvantage")) config.rolls[0].options.disadvantage = true;
}