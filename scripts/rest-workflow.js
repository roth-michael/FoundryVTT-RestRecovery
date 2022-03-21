import CONSTANTS from "./constants.js";
import { determineLongRestMultiplier, determineRoundingMethod, getSetting, ordinalSuffixOf } from "./lib/lib.js";

const rests = new Map();

export default class RestWorkflow {

    constructor(actor, longRest) {
        this.actor = actor;
        this.longRest = longRest;
        this.finished = false;
    }

    async setup(){
        this.fetchHealthData();
        this.fetchFeatures();
        this.fetchSpellData();
        return this;
    }

    get maxHP(){
        return this.actor.data.data.attributes.hp.max + (this.actor.data.data.attributes.hp.tempmax ?? 0)
    }

    get currHP(){
        return this.actor.data.data.attributes.hp.value;
    }

    get healthPercentage() {
        return this.currHP / this.maxHP;
    }

    get healthRegained() {
        return this.currHP - this.healthData.startingHealth;
    }

    get totalHitDice() {
        return this.actor.data.data.attributes.hd;
    }

    get recoveredSlots() {
        return Object.fromEntries(Object.entries(this.spellData.slots).map(entry => {
            return [entry[0], entry[1] ? entry[1].reduce((acc, slot) => {
                return acc + (slot.empty && slot.checked ? 1 : 0);
            }, 0) : 0]
        }).filter(entry => entry[1]));
    }

    static get(actor) {
        return rests.get(actor.uuid);
    }

    static remove(actor) {
        return rests.delete(actor.uuid);
    }

    static make(actor, longRest = false) {
        this.remove(actor);
        const workflow = new this(actor, longRest);
        rests.set(actor.uuid, workflow);
        return workflow.setup();
    }

    static wrapperFn(actor, wrapped, args, fnName, runWrap = true) {

        const workflow = this.get(actor);

        if (!runWrap) {
            if (workflow && workflow[fnName]) {
                return wrapped(workflow[fnName](args));
            }
            return wrapped(args);
        }

        let updates = wrapped(args);
        if (workflow && workflow[fnName]) {
            updates = workflow[fnName](updates, args);
        }

        return updates;

    }

    fetchHealthData() {
        this.healthData = {
            startingHitDice: this.actor.data.data.attributes.hd,
            startingHealth: this.actor.data.data.attributes.hp.value,
            hitDiceSpent: 0
        }
        this.refreshHealthData();
    }

    refreshHealthData(){
        this.healthData.availableHitDice = this.getHitDice();
        this.healthData.totalHitDice = this.totalHitDice;
        if(this.longRest && (getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE) || getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.RECOVERY.FULL)){
            let { hitPointsRecovered } = this.actor._getRestHitPointRecovery();
            this.healthData.hitPointsToRegain = hitPointsRecovered;
        }
    }

    getHitDice() {
        return this.actor.data.items.reduce((hd, item) => {
            if (item.type === "class") {
                const d = item.data.data;
                const denom = d.hitDice || "d6";
                const available = parseInt(d.levels || 1) - parseInt(d.hitDiceUsed || 0);
                hd[denom] = denom in hd ? hd[denom] + available : available;
            }
            return hd;
        }, {});
    }

    async fetchSpellData() {

        this.spellData = {
            slots: {},
            missingSlots: false,
            feature: false,
            pointsSpent: 0,
            pointsTotal: 0,
            className: ""
        };

        const wizardLevel = this.actor.items.find(item => {
            return item.type === "class"
                && (item.name === getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true));
        })?.data?.data?.levels || 0;
        const wizardFeature = this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.ARCANE_RECOVERY, true)) || false;

        const druidLevel = this.actor.items.find(item => {
            return item.type === "class"
                && item.data.data.levels >= 2
                && (item.name === getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true));
        })?.data?.data?.levels || 0;
        const druidFeature = this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY, true)) ?? false;

        for (let [level, slot] of Object.entries(this.actor.data.data.spells)) {
            if ((!slot.max && !slot.override) || level === "pact") {
                continue;
            }
            let levelNum = Number(level.substr(5))
            if (Number(levelNum) > 5) {
                break;
            }
            this.spellData.slots[levelNum] = [];
            for (let i = 0; i < slot.max; i++) {
                this.spellData.slots[levelNum].push({
                    checked: i < slot.value,
                    disabled: false,
                    alwaysDisabled: i < slot.value,
                    empty: i >= slot.value
                });
                this.spellData.missingSlots = this.spellData.missingSlots || i >= slot.value;
            }
        }

        const wizardFeatureUse = wizardLevel && wizardFeature && this.patchSpellFeature(wizardFeature);
        const druidFeatureUse = druidLevel && druidFeature && this.patchSpellFeature(druidFeature);



        if (wizardLevel > druidLevel || (druidLevel > wizardLevel && !druidFeatureUse)) {
            this.spellData.has_feature_use = wizardFeatureUse;
            this.spellData.feature = wizardFeature;
            this.spellData.pointsTotal = Math.ceil(wizardLevel / 2);
            this.spellData.className = getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
        } else if (druidLevel > wizardLevel || (wizardLevel > druidLevel && !wizardFeatureUse)) {
            this.spellData.has_feature_use = druidFeatureUse;
            this.spellData.feature = druidFeature;
            this.spellData.pointsTotal = Math.ceil(druidLevel / 2);
            this.spellData.className = getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true);
        }

    }

    patchSpellFeature(feature) {

        if (feature &&
            (
                feature.data.data.activation.type !== "special" ||
                feature.data.data.uses.value === null ||
                feature.data.data.uses.max === null ||
                feature.data.data.uses.per !== "lr"
            )
        ) {
            this.actor.updateEmbeddedDocuments("Item", [{
                _id: feature.id,
                "data.activation.type": "special",
                "data.uses.value": 1,
                "data.uses.max": 1,
                "data.uses.per": "lr",
            }]);
            ui.notifications.info(game.i18n.format("REST-RECOVERY.PatchedRecovery", {
                actorName: this.actor.name,
                recoveryName: this.spellData.feature.name
            }));
            return true;
        }

        return feature.data.data.uses.value > 0;

    }

    fetchFeatures() {

        this.features = {
            bard: false,
            bardLevel: false,
            songOfRest: false,
            usedSongOfRest: false,
            chef: false,
            usedChef: false
        }

        const ignoreInactivePlayers = getSetting(CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS);

        let characters = game.actors.filter(actor => actor.data.type === "character" && actor.hasPlayerOwner);
        for (let actor of characters) {

            // Only consider the actor if it has more than 0 hp, as features cannot be used if they are unconscious
            if (actor.data.data.attributes.hp.value <= 0) continue;

            if (ignoreInactivePlayers) {
                let found = game.users.find(user => {
                    return actor === user.character && user.active;
                })
                if (!found) continue;
            }

            const bardClass = actor.items.find(item => item.type === "class" && item.name === getSetting(CONSTANTS.SETTINGS.BARD_CLASS, true));
            if (bardClass) {
                const songOfRest = actor.items.getName(getSetting(CONSTANTS.SETTINGS.SONG_OF_REST, true));
                if (songOfRest) {
                    const level = bardClass.data.data.levels;
                    this.features.bard = this.features.bardLevel > level ? this.features.bard : actor;
                    this.features.bardLevel = this.features.bardLevel > level ? this.features.bardLevel : level;

                    if (this.features.bardLevel >= 17) {
                        this.features.songOfRest = "1d12";
                    } else if (this.features.bardLevel >= 13) {
                        this.features.songOfRest = "1d10";
                    } else if (this.features.bardLevel >= 9) {
                        this.features.songOfRest = "1d8";
                    } else if (this.features.bardLevel >= 2) {
                        this.features.songOfRest = "1d6";
                    }
                }
            }

            const chefFeat = actor.items.getName(getSetting(CONSTANTS.SETTINGS.CHEF_FEAT, true));
            const chefTools = getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true) !== "" ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true)) : true;
            if (chefFeat && chefTools) {
                if (!this.features.chef) {
                    this.features.chef = [];
                }
                this.features.chef.push(actor);
            }

        }

    }

    async autoSpendHitDice() {
        const avgHitDiceRegain = this.getAverageHitDiceRoll();
        const threshold = Math.max(Math.max(avgHitDiceRegain, this.healthData.hitPointsToRegain)+5);
        await this.actor.autoSpendHitDice({ threshold });
        this.healthData.availableHitDice = this.getHitDice();
        this.healthData.totalHitDice = this.totalHitDice;
    }

    getAverageHitDiceRoll() {

        const availableHitDice = Object.entries(this.healthData.availableHitDice).filter(entry => entry[1]);

        if(!availableHitDice.length) return 0;

        const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM)
            ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true))
            : false;
        const periapt_mod = periapt && periapt?.data?.data?.attunement === 2 ? 3 : 1

        let durable = getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT)
            ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true))
            : false;
        durable = durable && durable?.data?.type === "feat";

        let blackBlood = getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE)
            ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true))
            : false;
        blackBlood = blackBlood && blackBlood?.data?.type === "feat";

        const conMod = this.actor.data.data.abilities.con.mod;
        const totalHitDice = availableHitDice.reduce((acc, entry) => acc + entry[1], 0);

        return availableHitDice.map(entry => {
            const dieSize = Number(entry[0].split('d')[1]);
            let average = (dieSize/2) + 0.5;
            if(blackBlood){
                average = Array.from(Array(dieSize).keys())
                    .reduce((acc, num) => acc + Math.max(average, num+1), 0) / dieSize;
            }
            average *= periapt_mod;
            if(durable){
                if(conMod <= 0){
                    average += (-2*conMod+1)/dieSize;
                }else{
                    average += (conMod-1)*(conMod)/(2*dieSize);
                }
            }
            return average * entry[1];
        }).reduce((acc, num) => acc + num, 0) / totalHitDice;

    }

    async rollHitDice(hitDice, dialog) {
        const roll = await this.actor.rollHitDie(hitDice, { dialog });
        if (!roll) return;
        this.healthData.availableHitDice = this.getHitDice();
        this.healthData.totalHitDice = this.totalHitDice;

        if (this.longRest) return true;

        let hpRegained = 0;

        if (this.features.songOfRest && !this.features.usedSongOfRest) {
            const roll = new Roll(this.features.songOfRest).evaluate({ async: false });
            hpRegained += roll.total;

            const isOwnBard = this.features.bard === this.actor;
            await roll.toMessage({
                flavor: game.i18n.format("REST-RECOVERY.Chat.SongOfRest" + (isOwnBard ? "Self" : ""), {
                    name: this.actor.name,
                    bard: this.features.bard.name
                }),
                speaker: ChatMessage.getSpeaker({ actor: this.actor })
            })

            this.features.usedSongOfRest = true;
        }

        if (this.features.chef.length > 0 && !this.features.usedChef) {

            const chefActor = this.features.chef[Math.floor(Math.random() * this.features.chef.length)];
            const roll = new Roll('1d8').evaluate({ async: false });
            hpRegained += roll.total;

            const isOwnChef = this.features.bard === this.actor;
            await roll.toMessage({
                flavor: game.i18n.format("REST-RECOVERY.Chat.Chef" + (isOwnChef ? "Self" : ""), {
                    name: this.actor.name,
                    chef: chefActor.name
                }),
                speaker: ChatMessage.getSpeaker({ actor: this.actor })
            })

            this.features.usedChef = true;

        }

        if (hpRegained > 0) {
            const curHP = this.actor.data.data.attributes.hp.value;
            const maxHP = this.actor.data.data.attributes.hp.max + ((this.actor.data.data.attributes.hp.tempmax ?? 0) ?? 0);
            await this.actor.update({ "data.attributes.hp.value": Math.min(maxHP, curHP + hpRegained) })
        }

        return true;

    }

    spendSpellPoint(level, add) {
        this.spellData.pointsSpent += Number(level) * (add ? 1 : -1);
        const pointsLeft = this.spellData.pointsTotal - this.spellData.pointsSpent;
        for (let level of Object.keys(this.spellData.slots)) {
            for (let i = 0; i < this.spellData.slots[level].length; i++) {
                const slot = this.spellData.slots[level][i];
                this.spellData.slots[level][i].disabled = slot.alwaysDisabled || (Number(level) > pointsLeft && !slot.checked);
            }
        }
    }

    async regainHitDice() {

        if (!getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) return;

        let { maxHitDice } = this._getMaxHitDiceRecovery();

        let { updates, hitDiceRecovered } = this.actor._getRestHitDiceRecovery({ maxHitDice, forced: true });

        let hitDiceLeftToRecover = maxHitDice - hitDiceRecovered;

        if (hitDiceLeftToRecover > 0) {
            const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
                return (parseInt(b.data.data.hitDice.slice(1)) || 0) - (parseInt(a.data.data.hitDice.slice(1)) || 0);
            });

            const biggestClass = sortedClasses[0];

            const update = updates.find(update => update._id === biggestClass.id);
            if (update) {
                if (updates[updates.indexOf(update)]["data.hitDiceUsed"] >= 0) {
                    updates[updates.indexOf(update)]["data.hitDiceUsed"] -= hitDiceLeftToRecover;
                }
            } else {
                updates.push({
                    _id: biggestClass.id,
                    "data.hitDiceUsed": hitDiceLeftToRecover * -1
                })
            }
        }

        await this.actor.updateEmbeddedDocuments("Item", updates);

        this.healthData.availableHitDice = this.getHitDice()
        this.healthData.totalHitDice = this.totalHitDice;

    }

    preFinishRestMessage() {
        Hooks.once("preCreateChatMessage", (message, data) => {
            let newContent = `<p>${data.content}</p><p>${game.i18n.localize("REST-RECOVERY.Chat.RegainedSpellSlots")}</p>`;
            newContent += "<ul>";
            for (const [level, num] of Object.entries(this.recoveredSlots)) {
                const numText = game.i18n.localize("REST-RECOVERY.NumberToText." + num);
                const levelText = ordinalSuffixOf(level);
                const localization = "REST-RECOVERY.Chat.SpellSlotList" + (num > 1 ? "Plural" : "");
                newContent += `<li>${game.i18n.format(localization, { number: numText, level: levelText })}</li>`
            }
            newContent += "</ul>";
            message.data.update({
                content: newContent
            });
        });
    }

    _finishedRest(updates) {

        const maxShortRests = getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS);
        if(maxShortRests > 0) {
            if(this.longRest) {
                updates[`flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.currentShortRests`] = 0;
            }else{
                const currentShortRests = this.actor.getFlag(CONSTANTS.MODULE_NAME, CONSTANTS.FLAG_NAME)?.currentShortRests || 0;
                updates[`flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.currentShortRests`] = currentShortRests + 1;
            }
        }

        return updates;
    }

    _evaluateFormula(formula, data){
        const rollFormula = Roll.replaceFormulaData(formula, data, { warn: true });
        return new Roll(rollFormula).evaluate({ async: false }).total;
    }

    _getRestHitPointRecovery(result) {

        if (!this.longRest) {
            result.hitPointsRecovered = Math.max(0, result.hitPointsRecovered);
            return result;
        }

        const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.HP_MULTIPLIER);

        const maxHP = this.actor.data.data.attributes.hp.max + (this.actor.data.data.attributes.hp.tempmax ?? 0);
        const currentHP = this.actor.data.data.attributes.hp.value;

        let recoveredHP = this.healthData.hitPointsToRegain;

        if(!recoveredHP) {
            recoveredHP = typeof multiplier === "string"
                ? Math.floor(this._evaluateFormula(multiplier, foundry.utils.deepClone(this.actor.data.data)))
                : Math.floor(maxHP * multiplier);
        }

        result.updates["data.attributes.hp.value"] = Math.min(maxHP, currentHP + recoveredHP);
        result.hitPointsRecovered = Math.min(maxHP - currentHP, recoveredHP);

        if (getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE)) {
            result.hitPointsRecovered += (currentHP - this.healthData.startingHealth);
        }

        return result;

    }

    _getRestHitDiceRecoveryPre({ maxHitDice = undefined } = {}) {

        if (!this.longRest) return {};

        return this._getMaxHitDiceRecovery({ maxHitDice });

    }

    _getRestHitDiceRecoveryPost(results, { forced = false }={}) {

        if(forced){
            return results;
        }

        const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
            return (parseInt(b.data.data.hitDice.slice(1)) || 0) - (parseInt(a.data.data.hitDice.slice(1)) || 0);
        });

        for (const item of sortedClasses) {
            if (item.data.data.hitDiceUsed < 0) {
                const update = results.updates.find(update => update._id === item.id);
                if (update) {
                    results.updates[results.updates.indexOf(update)]["data.hitDiceUsed"] = 0;
                } else {
                    results.updates.push({
                        _id: item.id,
                        "data.hitDiceUsed": 0
                    })
                }

            } else {
                const update = results.updates.find(update => update._id === item.id);
                if (update) {
                    results.updates.splice(results.updates.indexOf(update), 1);
                }
            }
        }

        results.hitDiceRecovered = Math.max(0, Math.min(this.actor.data.data.details.level, this.totalHitDice) - this.healthData.startingHitDice);

        return results;

    }

    _getMaxHitDiceRecovery({ maxHitDice = undefined } = {}) {

        const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
        const roundingMethod = determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
        const actorLevel = this.actor.data.data.details.level;

        if(typeof multiplier === "string"){

            const customRegain = this._evaluateFormula(multiplier, foundry.utils.deepClone(this.actor.data.data))
            maxHitDice = Math.clamped(roundingMethod(customRegain),0,maxHitDice ?? actorLevel);

        }else {

            maxHitDice = Math.clamped(
                roundingMethod(actorLevel * multiplier),
                multiplier ? 1 : 0,
                maxHitDice ?? actorLevel
            );

        }

        return { maxHitDice };

    }

    _getRestResourceRecovery(updates, { recoverShortRestResources = true, recoverLongRestResources = true } = {}) {

        updates = this._finishedRest(updates);

        const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER);

        if (multiplier === 1.0) return updates;
        if (!multiplier) return {};

        updates = {};

        for (const [key, resource] of Object.entries(this.actor.data.data.resources)) {
            if (Number.isNumeric(resource.max)) {
                if (recoverShortRestResources && resource.sr) {
                    updates[`data.resources.${key}.value`] = Number(resource.max);
                } else if (recoverLongRestResources && resource.lr) {
                    const recoverResources = typeof multiplier === "string"
                        ? this._evaluateFormula(multiplier, { resource: foundry.utils.deepClone(resource) })
                        : Math.max(Math.floor(resource.max * multiplier), 1);
                    updates[`data.resources.${key}.value`] = Math.min(resource.value + recoverResources, resource.max);
                }
            }
        }

        return updates;

    }

    _getRestSpellRecovery(updates, { recoverSpells = true } = {}) {

        // Long rest
        if (recoverSpells) {

            const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.SPELLS_MULTIPLIER);

            for (let [level, slot] of Object.entries(this.actor.data.data.spells)) {
                if (!slot.override && !slot.max) continue;
                let spellMax = slot.override || slot.max;
                let recoverSpells = typeof multiplier === "string"
                    ? Math.max(this._evaluateFormula(multiplier, { slot: foundry.utils.deepClone(slot) }), 1)
                    : Math.max(Math.floor(spellMax * multiplier), multiplier ? 1 : multiplier);
                updates[`data.spells.${level}.value`] = Math.min(slot.value + recoverSpells, spellMax);
            }

        // Short rest
        }else{

            if(this.spellData.feature) {
                for (const [slot, num] of Object.entries(this.recoveredSlots)) {
                    const prop = `data.spells.spell${slot}.value`;
                    updates[prop] = (updates[prop] || foundry.utils.getProperty(this.actor.data, prop) || 0) + num;
                }
            }

        }

        return updates;

    }

    _getRestItemUsesRecovery(updates, args) {

        if (this.longRest) {
            return this.recoverItemsUses(updates, args);
        }

        if (this.spellData.pointsSpent && this.spellData.feature) {
            updates.push({ _id: this.spellData.feature.id, "data.uses.value": 0 });
        }

        return updates;

    }

    recoverItemsUses(updates, args) {
        const { recoverLongRestUses, recoverDailyUses } = args;

        const featsMultiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER);
        const othersMultiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER);
        const dailyMultiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER);

        for (const item of this.actor.items) {
            if (item.data.data.uses) {
                if (recoverLongRestUses && item.data.data.uses.per === "lr") {
                    updates = this.recoverItemUse(updates, item, item.type === "feat" ? featsMultiplier : othersMultiplier);
                } else if (recoverDailyUses && item.data.data.uses.per === "day") {
                    updates = this.recoverItemUse(updates, item, dailyMultiplier);
                }
            } else if (recoverLongRestUses && item.data.data.recharge && item.data.data.recharge.value) {
                updates.push({ _id: item.id, "data.recharge.charged": true });
            }
        }

        return updates;
    }


    recoverItemUse(updates, item, multiplier) {

        const usesMax = item.data.data.uses.max;
        const usesCur = item.data.data.uses.value;

        const amountToRecover = typeof multiplier === "string"
            ? this._evaluateFormula(multiplier, foundry.utils.deepClone(item.data.data))
            : Math.max(Math.floor(usesMax * multiplier), multiplier ? 1 : 0);

        const update = updates.find(update => update._id === item.id);

        const recoverValue = Math.min(usesCur + amountToRecover, usesMax);

        if (update) {
            update["data.uses.value"] = recoverValue;
        } else {
            updates.push({
                _id: item.id,
                "data.uses.value": recoverValue
            });
        }

        return updates;

    }

}