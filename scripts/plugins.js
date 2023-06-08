import CONSTANTS from "./constants.js";
import { getSetting } from "./lib/lib.js";

export default class plugins {

  static _integrationMap = {
    [CONSTANTS.MODULES.DFREDS + "-exhaustion"]: this.handleDFredsConvenientEffects,
    [CONSTANTS.MODULES.CUB + "-exhaustion"]: this.handleCombatUtilityBelt
  }

  static handleIntegration(integration, ...args) {
    if (!this._integrationMap[integration]) return;
    return this._integrationMap[integration](...args);
  }

  static handleExhaustion(...args) {
    const integration = getSetting(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION);
    const integrationFunction = this._integrationMap[integration+"-exhaustion"];
    if (integrationFunction) {
      return integrationFunction(...args);
    }
    return this.handleNativeExhaustion(...args);
  }

  static async handleDFredsConvenientEffects(actor, data) {

    if (!game.modules.get(CONSTANTS.MODULES.DFREDS)?.active) return;
    if (!game?.dfreds?.effectInterface) return;
    const DFREDS = game?.dfreds?.effectInterface;

    const oneDndExhaustionEnabled = getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION);

    const exhaustionLevel = getProperty(data, "system.attributes.exhaustion");

    const actorUuid = actor.uuid;

    if (!oneDndExhaustionEnabled) {
      for (let level = 1; level <= 6; level++) {
        let levelName = `Exhaustion ${level}`;
        if (levelName !== `Exhaustion ${exhaustionLevel}` && DFREDS.hasEffectApplied(levelName, actorUuid)) {
          await DFREDS.removeEffect({
            effectName: levelName, uuid: actorUuid
          });
        }
      }

      if (exhaustionLevel >= 1 && exhaustionLevel <= 6) {
        await DFREDS.addEffect({ effectName: `Exhaustion ${exhaustionLevel}`, uuid: actorUuid });
      }
    } else {
      const presetEffect = game?.dfreds?.effects.customEffects.find(effect => {
        return getProperty(effect.flags, "rest-recovery.exhaustion-effect");
      });
      if (exhaustionLevel >= 1) {
        await DFREDS.addEffect({
          effectName: presetEffect.name,
          uuid: actorUuid
        });
      } else {
        await DFREDS.removeEffect({
          effectName: presetEffect.name,
          uuid: actorUuid
        });
      }
    }
  }

  static async createConvenientEffect() {
    if (game?.dfreds?.effects.customEffects.find(effect => {
      return getProperty(effect.flags, "rest-recovery.exhaustion-effect");
    })) {
      return;
    }
    return game?.dfreds?.effectInterface.createNewCustomEffectsWith({
      activeEffects: [oneDndExhaustionEffectData]
    });
  }

  static async handleCombatUtilityBelt(actor, data) {

    if (!game.modules.get(CONSTANTS.MODULES.CUB)?.active) return;
    if (!game?.cub?.enhancedConditions?.supported) return;
    const CUB = game.cub;

    const exhaustionLevel = getProperty(data, "system.attributes.exhaustion");
    const exhaustionEffectName = `Exhaustion ${exhaustionLevel}`;

    for (let level = 1; level <= 5; level++) {
      let levelName = `Exhaustion ${level}`;
      if (levelName !== exhaustionEffectName && CUB.hasCondition(levelName, actor, { warn: false })) {
        await CUB.removeCondition(levelName, actor, { warn: false });
      }
    }

    if (exhaustionLevel >= 1 && exhaustionLevel <= 5) {
      await CUB.addCondition(exhaustionEffectName, actor);
    }
  }

  static handleNativeExhaustion(actor, data) {
    const oneDndExhaustionEnabled = getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION);
    if (!oneDndExhaustionEnabled) return;
    const exhaustionLevel = getProperty(data, "data.attributes.exhaustion");
    const actorExhaustionEffect = actor.effects.find(effect => getProperty(effect, "flags.rest-recovery.exhaustion-effect"));
    if (exhaustionLevel > 0 && !actorExhaustionEffect) {
      return actor.createEmbeddedDocuments("ActiveEffect", [oneDndExhaustionEffectData]);
    } else if (exhaustionLevel <= 0 && actorExhaustionEffect) {
      return actor.deleteEmbeddedDocuments("ActiveEffect", [actorExhaustionEffect.id]);
    }
  }
}

const oneDndExhaustionEffectData = {
  "label": "Exhaustion (One D&D)",
  "description": "One D&D exhaustion applies a -1 penalty to Ability Checks, Attack Rolls, Saving Throws, and the character's Spell Save DC per exhaustion level. Once a character reaches 10 levels of exhaustion, they perish.",
  "icon": "icons/svg/downgrade.svg",
  "tint": null,
  "seconds": null,
  "rounds": null,
  "turns": null,
  "isDynamic": false,
  "isViewable": true,
  "flags": {
    "isCustomConvenient": true,
    "convenientDescription": "One D&D exhaustion applies a -1 penalty to Ability Checks, Attack Rolls, Saving Throws, and the character's Spell Save DC per exhaustion level. Once a character reaches 10 levels of exhaustion, they perish.",
    "rest-recovery": {
      "exhaustion-effect": true
    }
  },
  "changes": [{
    "key": "system.bonuses.msak.attack",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }, {
    "key": "system.bonuses.mwak.attack",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  },  {
    "key": "system.bonuses.rsak.attack",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  },  {
    "key": "system.bonuses.rwak.attack",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }, {
    "key": "system.bonuses.abilities.save",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }, {
    "key": "system.bonuses.abilities.check",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }, {
    "key": "system.bonuses.spell.dc",
    "value": "-@attributes.exhaustion",
    "mode": 2,
    "priority": 20
  }]
}
