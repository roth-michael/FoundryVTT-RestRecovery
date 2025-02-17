import CONSTANTS from "./constants.js";
import { getSetting } from "./lib/lib.js";

export async function configureOneDndExhaustion() {
  if (!getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) return;
  if (game.modules.get(CONSTANTS.MODULES.ALTERNATIVE_EXHAUSTION)?.active) return;
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
      delete CONFIG.DND5E.conditionTypes.exhaustion.reduction;
    }
    if (game.modules.get("tidy5e-sheet")?.active) {
      await updateTidy5e();
    }
  } else {
    if (CONFIG.DND5E.conditionTypes.exhaustion.levels !== 6) {
      let styleElement = document.getElementById(CONSTANTS.STYLE_ELEMENT_ID);
      if (styleElement) {
        styleElement.remove();
      }
      CONFIG.DND5E.conditionTypes.exhaustion.levels = 6;
      CONFIG.DND5E.conditionTypes.exhaustion.icon = CONSTANTS.EXHAUSTION_CORE_PATH;
      CONFIG.DND5E.conditionTypes.exhaustion.reference = CONFIG.DND5E.conditionTypes.exhaustion.oldReference ?? CONFIG.DND5E.conditionTypes.exhaustion.reference;
      CONFIG.DND5E.conditionEffects.halfMovement.add("exhaustion-2");
      CONFIG.DND5E.conditionEffects.halfHealth.add("exhaustion-4");
      CONFIG.DND5E.conditionEffects.noMovement.add("exhaustion-5");
      CONFIG.DND5E.conditionTypes.exhaustion.reduction = {rolls: 2, speed: 5};
    }
    if (game.modules.get("tidy5e-sheet")?.active) {
      await updateTidy5e();
    }
  }
}

export async function updateTidy5e() {
  if (!game.user?.isGM) return;
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
  let ac5eShouldControl = game.modules.get("automated-conditions-5e")?.active && game.settings.get("automated-conditions-5e", "autoExhaustion");
  let alternativeExhaustionActive = game.modules.get(CONSTANTS.MODULES.ALTERNATIVE_EXHAUSTION)?.active;
  let modernRules = game.settings.get("dnd5e", "rulesVersion") === "modern";
  if (getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION) || ac5eShouldControl || alternativeExhaustionActive || modernRules) {
    if (Hooks.events["dnd5e.preRollAbilityCheckV2"]) Hooks.off("dnd5e.preRollAbilityCheckV2", _preAbilityCheck);
    if (Hooks.events["dnd5e.preRollSavingThrowV2"]) Hooks.off("dnd5e.preRollSavingThrowV2", _preAbilitySave);
    if (Hooks.events["dnd5e.preRollDeathSaveV2"]) Hooks.off("dnd5e.preRollDeathSaveV2", _preDeathSave);
    if (Hooks.events["dnd5e.preRollAttackV2"]) Hooks.off("dnd5e.preRollAttackV2", _preAttack);
  } else {
    // Take em off first just in case, that way we're always last
    if (Hooks.events["dnd5e.preRollAbilityCheckV2"]) Hooks.off("dnd5e.preRollAbilityCheckV2", _preAbilityCheck);
    if (Hooks.events["dnd5e.preRollSavingThrowV2"]) Hooks.off("dnd5e.preRollSavingThrowV2", _preAbilitySave);
    if (Hooks.events["dnd5e.preRollDeathSaveV2"]) Hooks.off("dnd5e.preRollDeathSaveV2", _preDeathSave);
    if (Hooks.events["dnd5e.preRollAttackV2"]) Hooks.off("dnd5e.preRollAttackV2", _preAttack);

    Hooks.on("dnd5e.preRollAbilityCheckV2", _preAbilityCheck);
    Hooks.on("dnd5e.preRollSavingThrowV2", _preAbilitySave);
    Hooks.on("dnd5e.preRollDeathSaveV2", _preDeathSave);
    Hooks.on("dnd5e.preRollAttackV2", _preAttack);
  }
}

function _preAbilityCheck(config) {
  if (!config.subject?.statuses.has("exhaustion")) return;
  config.rolls[0].options.disadvantage = true;
}

function _preAbilitySave(config) {
  if (!config.subject?.statuses?.has("exhaustion")) return;
  if (!(config.subject?.system?.attributes?.exhaustion >= 3)) return;
  config.rolls[0].options.disadvantage = true;
}

function _preDeathSave(config) {
  if (!config.subject?.statuses?.has("exhaustion")) return;
  if (!(config.subject?.system?.attributes?.exhaustion >= 3)) return;
  config.rolls[0].options.disadvantage = true;
}

function _preAttack(config) {
  let actor = config.subject?.actor;
  if (!actor) return;
  if (!actor?.statuses?.has("exhaustion")) return;
  if (!(actor?.system?.attributes?.exhaustion >= 3)) return;
  config.rolls[0].options.disadvantage = true;
}