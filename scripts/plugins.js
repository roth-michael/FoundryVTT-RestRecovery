import CONSTANTS from "./constants.js";
import { getSetting } from "./lib/lib.js";

export default class plugins {

  static _integrationMap = {
    [CONSTANTS.MODULES.DFREDS + "-exhaustion"]: this.handleDFredsConvenientEffects
  }

  static handleIntegration(integration, ...args) {
    if (!this._integrationMap[integration]) return;
    return this._integrationMap[integration](...args);
  }

  static handleExhaustion(...args) {
    const integration = getSetting(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION);
    const integrationFunction = this._integrationMap[integration+"-exhaustion"];
    if (integrationFunction && false) { // Temporarily disable integrations, since we're hiding the setting but not getting rid of it
      return integrationFunction(...args);
    }
    return this.handleNativeExhaustion(...args);
  }

  static async handleDFredsConvenientEffects(actor, data) {

    if (!game.modules.get(CONSTANTS.MODULES.DFREDS)?.active) return;
    if (!game?.dfreds?.effectInterface) return;
    const DFREDS = game?.dfreds?.effectInterface;

    const oneDndExhaustionEnabled = getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION);

    const exhaustionLevel = foundry.utils.getProperty(data, "system.attributes.exhaustion");

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
        return foundry.utils.getProperty(effect.flags, "rest-recovery.exhaustion-effect");
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
      return foundry.utils.getProperty(effect.flags, "rest-recovery.exhaustion-effect");
    })) {
      return;
    }
    return game?.dfreds?.effectInterface.createNewCustomEffectsWith({
      activeEffects: [oneDndExhaustionEffectData]
    });
  }

  static handleNativeExhaustion(actor, data) {
    const oneDndExhaustionEnabled = getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION);
    const exhaustionLevel = foundry.utils.getProperty(data, "system.attributes.exhaustion");
    const actorExhaustionEffect = actor.effects.find(effect => foundry.utils.getProperty(effect, "flags.rest-recovery.exhaustion-effect"));
    if (!oneDndExhaustionEnabled && actorExhaustionEffect) {
      return actor.deleteEmbeddedDocuments("ActiveEffect", [actorExhaustionEffect.id]);
    }
    if (!oneDndExhaustionEnabled) return;
    if (exhaustionLevel > 0 && !actorExhaustionEffect) {
      oneDndExhaustionEffectData.label = game.i18n.localize("REST-RECOVERY.OneDnDExhaustionEffect.Name");
      oneDndExhaustionEffectData.description = game.i18n.localize("REST-RECOVERY.OneDnDExhaustionEffect.Description");
      oneDndExhaustionEffectData.flags.convenientDescription = game.i18n.localize("REST-RECOVERY.OneDnDExhaustionEffect.Description");
      return actor.createEmbeddedDocuments("ActiveEffect", [oneDndExhaustionEffectData]);
    } else if (exhaustionLevel <= 0 && actorExhaustionEffect) {
      return actor.deleteEmbeddedDocuments("ActiveEffect", [actorExhaustionEffect.id]);
    }
  }
}

const oneDndExhaustionEffectData = {
  "label": "Exhaustion (One D&D)",
  "description": "With One D&D exhaustion, a creature suffers cumulative -1 penalties per level of exhaustion to all d20 rolls (attack rolls, ability checks, skill checks, and saving throws) and spell DCs. When a creature reaches 10 levels of exhaustion, they die.",
  "icon": "icons/svg/downgrade.svg",
  "tint": null,
  "seconds": null,
  "rounds": null,
  "turns": null,
  "isDynamic": false,
  "isViewable": true,
  "flags": {
    "isCustomConvenient": true,
    "convenientDescription": "With One D&D exhaustion, a creature suffers cumulative -1 penalties per level of exhaustion to all d20 rolls (attack rolls, ability checks, skill checks, and saving throws) and spell DCs. When a creature reaches 10 levels of exhaustion, they die.",
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
