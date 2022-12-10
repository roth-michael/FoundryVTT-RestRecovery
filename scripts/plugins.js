import CONSTANTS from "./constants.js";

export default class plugins {

  static _integrationMap = {
    [CONSTANTS.MODULES.DFREDS + "-exhaustion"]: this.handleDFredsConvenientEffects,
    [CONSTANTS.MODULES.CUB + "-exhaustion"]: this.handleCombatUtilityBelt
  }

  static handleIntegration(integration, ...args) {
    if (!this._integrationMap[integration]) return;
    return this._integrationMap[integration](...args);
  }

  static async handleDFredsConvenientEffects(actor, data) {

    if (!game.modules.get(CONSTANTS.MODULES.DFREDS)?.active) return;
    if (!game?.dfreds?.effectInterface) return;
    const DFREDS = game?.dfreds?.effectInterface;

    const exhaustionLevel = getProperty(data, "data.attributes.exhaustion");
    const exhaustionEffectName = `Exhaustion ${exhaustionLevel}`;
    const actorUuid = actor.uuid;

    for (let level = 1; level <= 5; level++) {
      let levelName = `Exhaustion ${level}`;
      if (levelName !== exhaustionEffectName && DFREDS.hasEffectApplied(levelName, actorUuid)) {
        await DFREDS.removeEffect({
          effectName: levelName, uuid: actorUuid
        });
      }
    }

    if (exhaustionLevel >= 1 && exhaustionLevel <= 5) {
      await DFREDS.addEffect({ effectName: exhaustionEffectName, uuid: actorUuid });
    }
  }

  static async handleCombatUtilityBelt(actor, data) {

    if (!game.modules.get(CONSTANTS.MODULES.CUB)?.active) return;
    if (!game?.cub?.enhancedConditions?.supported) return;
    const CUB = game.cub;

    const exhaustionLevel = getProperty(data, "data.attributes.exhaustion");
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
}
