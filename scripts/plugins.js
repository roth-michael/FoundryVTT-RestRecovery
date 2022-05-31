export async function handleDFredsConvenientEffects(actor, data){

    if(!game?.dfreds?.effectInterface) return;

    const exhaustionLevel = getProperty(data, "data.attributes.exhaustion");

    const exhaustionEffectName = `Exhaustion ${exhaustionLevel}`;
    const actorUuid = actor.uuid;

    for(let level = 1; level <= 5; level++) {
        let levelName = `Exhaustion ${level}`;
        if (levelName !== exhaustionEffectName && game?.dfreds?.effectInterface.hasEffectApplied(levelName, actorUuid)){
            await game?.dfreds?.effectInterface.removeEffect({
                effectName: levelName,
                uuid: actorUuid
            });
        }
    }

    if(exhaustionLevel >= 1 && exhaustionLevel <= 5) {
        await game?.dfreds?.effectInterface.addEffect({ effectName: exhaustionEffectName, uuid: actorUuid });
    }

}

export async function handleCombatUtilityBelt(actor, data){

    if(!game?.cub?.enhancedConditions?.supported) return;

    const exhaustionLevel = getProperty(data, "data.attributes.exhaustion");

    const exhaustionEffectName = `Exhaustion ${exhaustionLevel}`;

    for(let level = 1; level <= 5; level++) {
        let levelName = `Exhaustion ${level}`;
        if (levelName !== exhaustionEffectName && game.cub.hasCondition(levelName, actor, { warn: false })){
            await game.cub.removeCondition(levelName, actor, { warn: false });
        }
    }

    if(exhaustionLevel >= 1 && exhaustionLevel <= 5) {
        await game.cub.addCondition(exhaustionEffectName, actor);
    }

}