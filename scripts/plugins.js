import CONSTANTS from "./constants.js";
import { getSetting } from "./lib/lib.js";

export default class plugins {

  static handleExhaustion(actor, data) {
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
  "name": "Exhaustion (One D&D)",
  "description": "With One D&D exhaustion, a creature suffers cumulative -1 penalties per level of exhaustion to all d20 rolls (attack rolls, ability checks, skill checks, and saving throws) and spell DCs. When a creature reaches 10 levels of exhaustion, they die.",
  "img": "icons/svg/downgrade.svg",
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
