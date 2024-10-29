import CONSTANTS from "./constants.js";
import { getSetting } from "./lib/lib.js";

export async function configureOneDndExhaustion() {
  updateStatusEffects();
  if (!getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) return;
  if (game.modules.get(CONSTANTS.MODULES.ALTERNATIVE_EXHAUSTION)?.active) return;
  if (getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION)) {
    if (CONFIG.DND5E.conditionEffects.halfMovement.has("exhaustion-2")) {
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
            padding-right:6px;
          }
          .pips[data-prop="system.attributes.exhaustion"]:nth-child(3) {
            column-gap:1px;
            padding-left:6px;
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
      foundry.utils.mergeObject(CONFIG.statusEffects.find(e => e.id === "exhaustion"), CONFIG.DND5E.conditionTypes.exhaustion, {insertKeys: false});
    }
    if (false && getSetting(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION).value === CONSTANTS.MODULES.DFREDS) { // Temporarily disable integrations, since we're hiding the setting but not getting rid of it
      await plugins.createConvenientEffect();
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
      foundry.utils.mergeObject(CONFIG.statusEffects.find(e => e.id === "exhaustion"), CONFIG.DND5E.conditionTypes.exhaustion, {insertKeys: false});
    }
    if (game.modules.get("tidy5e-sheet")?.active) {
      await updateTidy5e();
    }
  }
}

export async function updateTidy5e() {
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

export function updateStatusEffects() {
  // Just in case DFreds installed - can remove once DFreds CE has exhaustion fixed
  if (!CONFIG.statusEffects.find(eff => eff.id == "exhaustion")) CONFIG.statusEffects.push(foundry.utils.mergeObject({id: 'exhaustion', _id: "dnd5eexhaustion0", name: 'Exhaustion'}, CONFIG.DND5E.conditionTypes.exhaustion));
}

export async function configureExhaustionHooks() {
  let ac5eShouldControl = game.modules.get("automated-conditions-5e")?.active && game.settings.get("automated-conditions-5e", "autoExhaustion");
  let alternativeExhaustionActive = game.modules.get(CONSTANTS.MODULES.ALTERNATIVE_EXHAUSTION)?.active;
  if (getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION) || ac5eShouldControl || alternativeExhaustionActive) {
    if (Hooks.events["dnd5e.preRollAbilityTest"]) Hooks.off("dnd5e.preRollAbilityTest", _preAbilityCheck);
    if (Hooks.events["dnd5e.preRollSkill"]) Hooks.off("dnd5e.preRollSkill", _preSkill);
    if (Hooks.events["dnd5e.preRollAbilitySave"]) Hooks.off("dnd5e.preRollAbilitySave", _preAbilitySaveOrConcentration);
    if (Hooks.events["dnd5e.preRollConcentration"]) Hooks.off("dnd5e.preRollConcentration", _preAbilitySaveOrConcentration);
    if (Hooks.events["dnd5e.preRollDeathSave"]) Hooks.off("dnd5e.preRollDeathSave", _preDeathSave);
    if (Hooks.events["dnd5e.preRollAttack"]) Hooks.off("dnd5e.preRollAttack", _preAttack);
  } else {
    // Take em off first just in case, that way we're always last
    if (Hooks.events["dnd5e.preRollAbilityTest"]) Hooks.off("dnd5e.preRollAbilityTest", _preAbilityCheck);
    if (Hooks.events["dnd5e.preRollSkill"]) Hooks.off("dnd5e.preRollSkill", _preSkill);
    if (Hooks.events["dnd5e.preRollAbilitySave"]) Hooks.off("dnd5e.preRollAbilitySave", _preAbilitySaveOrConcentration);
    if (Hooks.events["dnd5e.preRollConcentration"]) Hooks.off("dnd5e.preRollConcentration", _preAbilitySaveOrConcentration);
    if (Hooks.events["dnd5e.preRollDeathSave"]) Hooks.off("dnd5e.preRollDeathSave", _preDeathSave);
    if (Hooks.events["dnd5e.preRollAttack"]) Hooks.off("dnd5e.preRollAttack", _preAttack);

    Hooks.on("dnd5e.preRollAbilityTest", _preAbilityCheck);
    Hooks.on("dnd5e.preRollSkill", _preSkill);
    Hooks.on("dnd5e.preRollAbilitySave", _preAbilitySaveOrConcentration);
    Hooks.on("dnd5e.preRollConcentration", _preAbilitySaveOrConcentration);
    Hooks.on("dnd5e.preRollDeathSave", _preDeathSave);
    Hooks.on("dnd5e.preRollAttack", _preAttack);
  }
}

function _handleGivingDisadvantage(rollType, config) {
  let shouldUseSpecialKeys = 
    game.modules.get("ready-set-roll-5e")?.active &&
    config.event &&
    game.settings.get("ready-set-roll-5e", `enable${rollType}QuickRoll`);

  // If not getting the jQuery-normalized event (which has setters for xKey parameters), change it accordingly 
  if (config.event instanceof PointerEvent) config.event = $.event.fix(config.event);
    
  if (!shouldUseSpecialKeys) {
    config.fastForward = config.fastForward || 
                         config.event?.shiftKey ||
                         config.event?.altKey ||
                         config.event?.metaKey ||
                         config.event?.ctrlKey;
    config.advantage = config.advantage ||
                       config.event?.altKey;
  }
  if (config.event) {
    foundry.utils.mergeObject(config.event, {
      shiftKey: false,
      altKey: false,
      metaKey: false,
      ctrlKey: false
    });
  }
  config.disadvantage = true;
  if (config.advantage && config.disadvantage) {
    config.advantage = false;
    config.disadvantage = false;
  }
}

function _preSkill(actor, config) {
  if (!actor.statuses.has("exhaustion")) return;
  _handleGivingDisadvantage("Skill", config);
}

function _preAbilityCheck(actor, config) {
  if (!actor.statuses.has("exhaustion")) return;
  _handleGivingDisadvantage("Ability", config);
}

function _preAbilitySaveOrConcentration(actor, config) {
  if (!actor?.statuses?.has("exhaustion")) return;
  if (!(actor?.system?.attributes?.exhaustion >= 3)) return;
  _handleGivingDisadvantage("Ability", config);
}

function _preDeathSave(actor, config) {
  if (!actor?.statuses?.has("exhaustion")) return;
  if (!(actor?.system?.attributes?.exhaustion >= 3)) return;
  _handleGivingDisadvantage("Death", config);
}

function _preAttack(item, config) {
  let actor = config.sourceActor ?? config.actor;
  if (!actor) return;
  if (!actor?.statuses?.has("exhaustion")) return;
  if (!(actor?.system?.attributes?.exhaustion >= 3)) return;
  // First arg only matters if config.event is defined, which is only the case in RSR
  // if vanilla quickrolls are enabled and that's how this is being rolled
  _handleGivingDisadvantage("Vanilla", config);
}