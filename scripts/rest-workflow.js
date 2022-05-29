import CONSTANTS from "./constants.js";
import * as lib from "./lib/lib.js";

const rests = new Map();

export default class RestWorkflow {

    static itemsListened = new Map()

    constructor(actor, longRest) {
        this.actor = actor;
        this.longRest = longRest;
        this.finished = false;

        this.spellSlotsRegainedMessage = "";
        this.itemsRegainedMessages = [];
        this.resourcesRegainedMessages = [];
        this.foodAndWaterMessage = [];

        this.consumableData = { items: [] };
    }

    get maxHP() {
        return this.actor.data.data.attributes.hp.max + (this.actor.data.data.attributes.hp.tempmax ?? 0)
    }

    get currHP() {
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

    static initialize() {

        Hooks.on("dnd5e.restCompleted", (actor) => {
            RestWorkflow.remove(actor);
        });

        this._setupFoodListeners();

    }

    static get(actor) {
        return rests.get(actor.uuid);
    }

    static remove(actor) {
        const rest = this.get(actor);
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

    async setup() {
        this.fetchHealthData();
        this.fetchFeatures();
        this.fetchSpellData();
        return this;
    }

    fetchHealthData() {
        this.healthData = {
            startingHitDice: this.actor.data.data.attributes.hd,
            startingHealth: this.actor.data.data.attributes.hp.value,
            hitDiceSpent: 0
        }
        this.refreshHealthData();
    }

    refreshHealthData() {
        this.healthData.availableHitDice = this.getHitDice();
        this.healthData.totalHitDice = this.totalHitDice;
        if (this.longRest && (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE) || lib.getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.RECOVERY.FULL)) {
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

    fetchSpellData() {

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
                && (item.name === lib.getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true));
        })?.data?.data?.levels || 0;
        const wizardFeature = this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.ARCANE_RECOVERY, true)) || false;

        const druidLevel = this.actor.items.find(item => {
            return item.type === "class"
                && item.data.data.levels >= 2
                && (item.name === lib.getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true));
        })?.data?.data?.levels || 0;
        const druidFeature = this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY, true)) ?? false;

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

        const wizardFeatureUse = wizardLevel && wizardFeature && this.patchSpellFeature(wizardFeature, "wizard");
        const druidFeatureUse = druidLevel && druidFeature && this.patchSpellFeature(druidFeature, "druid");

        if (wizardLevel > druidLevel || (druidLevel > wizardLevel && !druidFeatureUse)) {
            this.spellData.has_feature_use = wizardFeatureUse;
            this.spellData.feature = wizardFeature;
            this.spellData.pointsTotal = lib.evaluateFormula(wizardFeature.data.data.formula || "ceil(@classes.wizard.levels/2)", foundry.utils.deepClone(this.actor.data.data))?.total ?? 0?.total;
            this.spellData.className = lib.getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
        } else if (druidLevel > wizardLevel || (wizardLevel > druidLevel && !wizardFeatureUse)) {
            this.spellData.has_feature_use = druidFeatureUse;
            this.spellData.feature = druidFeature;
            this.spellData.pointsTotal = lib.evaluateFormula(druidFeature.data.data.formula || "ceil(@classes.druid.levels/2)", foundry.utils.deepClone(this.actor.data.data))?.total ?? 0?.total;
            this.spellData.className = lib.getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true);
        }

    }

    patchSpellFeature(feature, className) {

        if (feature &&
            (
                feature.data.data.activation.type !== "special" ||
                feature.data.data.uses.value === null ||
                feature.data.data.uses.max === null ||
                feature.data.data.uses.per !== "lr" ||
                feature.data.data.actionType !== "util" ||
                feature.data.data.formula === ""
            )
        ) {
            this.actor.updateEmbeddedDocuments("Item", [{
                _id: feature.id,
                "data.activation.type": "special",
                "data.uses.value": feature.data.data.uses.value ?? 1,
                "data.uses.max": 1,
                "data.uses.per": "lr",
                "data.actionType": "util",
                "data.formula": `ceil(@classes.${className}.levels/2)`
            }]);
            ui.notifications.info(game.i18n.format("REST-RECOVERY.PatchedRecovery", {
                actorName: this.actor.name,
                recoveryName: this.spellData.feature.name
            }));
            return (feature.data.data.uses.value ?? 1) > 0;
        }

        return feature.data.data.uses.value > 0;

    }

    fetchFeatures() {

        this.features = {
            bard: false,
            bardFeature: false,
            usedBardFeature: false,
            chef: false,
            usedChef: false
        }

        const ignoreInactivePlayers = lib.getSetting(CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS);

        let bardLevel = false;
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

            const bardClass = actor.items.find(item => item.type === "class" && item.name === lib.getSetting(CONSTANTS.SETTINGS.BARD_CLASS, true));
            if (bardClass) {
                const songOfRest = actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.SONG_OF_REST, true));
                if (songOfRest) {
                    const level = bardClass.data.data.levels;
                    this.features.bard = bardLevel > level ? this.features.bard : actor;
                    bardLevel = bardLevel > level ? bardLevel : level;
                    this.features.bardFeature = songOfRest;
                }
            }

            const chefFeat = actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.CHEF_FEAT, true));
            const chefTools = lib.getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true) !== "" ? actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true)) : true;
            if (chefFeat && chefTools) {
                if (!this.features.chef) {
                    this.features.chef = [];
                }
                this.features.chef.push(actor);
            }

        }

        if (this.features.bardFeature) {
            if (bardLevel >= 17) {
                this.features.songOfRest = "1d12";
            } else if (bardLevel >= 13) {
                this.features.songOfRest = "1d10";
            } else if (bardLevel >= 9) {
                this.features.songOfRest = "1d8";
            } else if (bardLevel >= 2) {
                this.features.songOfRest = "1d6";
            }
        }

    }

    async autoSpendHitDice() {
        const avgHitDiceRegain = this.getAverageHitDiceRoll();
        const threshold = Math.max(Math.max(avgHitDiceRegain, this.healthData.hitPointsToRegain) + 5);
        await this.actor.autoSpendHitDice({ threshold });
        this.healthData.availableHitDice = this.getHitDice();
        this.healthData.totalHitDice = this.totalHitDice;
    }

    getAverageHitDiceRoll() {

        const availableHitDice = Object.entries(this.healthData.availableHitDice).filter(entry => entry[1]);

        if (!availableHitDice.length) return 0;

        const periapt = lib.getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM)
            ? this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true))
            : false;
        const blessing = lib.getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING)
            ? this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true))
            : false;
        const periapt_mod = (periapt && periapt?.data?.data?.attunement === 2) || (blessing && blessing?.data?.type === "feat") ? 3 : 1

        let durable = lib.getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT)
            ? this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true))
            : false;
        durable = durable && durable?.data?.type === "feat";

        let blackBlood = lib.getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE)
            ? this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true))
            : false;
        blackBlood = blackBlood && blackBlood?.data?.type === "feat";

        const conMod = this.actor.data.data.abilities.con.mod;
        const totalHitDice = availableHitDice.reduce((acc, entry) => acc + entry[1], 0);

        return availableHitDice.map(entry => {
            const dieSize = Number(entry[0].split('d')[1]);
            let average = (dieSize / 2) + 0.5;
            if (blackBlood) {
                average = Array.from(Array(dieSize).keys())
                    .reduce((acc, num) => acc + Math.max(average, num + 1), 0) / dieSize;
            }
            average *= periapt_mod;
            if (durable) {
                if (conMod <= 0) {
                    average += (-2 * conMod + 1) / dieSize;
                } else {
                    average += (conMod - 1) * (conMod) / (2 * dieSize);
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

        if (!lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) return;

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

    _finishedRest() {

        let updates = {};

        const maxShortRests = lib.getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS);
        if (maxShortRests > 0) {
            if (this.longRest) {
                updates[`${CONSTANTS.FLAGS.BASE}.currentShortRests`] = 0;
            } else {
                const currentShortRests = getProperty(this.actor.data, `${CONSTANTS.FLAGS.BASE}.currentShortRests`) || 0;
                updates[`${CONSTANTS.FLAGS.BASE}.currentShortRests`] = currentShortRests + 1;
            }
        }

        if(this.longRest){
            updates = this._handleFoodWaterExhaustion(updates);
        }

        return updates;
    }

    _handleFoodWaterExhaustion(updates){

        if(lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) {

            let actorInitialExhaustion = getProperty(this.actor.data, "data.attributes.exhaustion") ?? 0;
            let actorExhaustion = actorInitialExhaustion;
            let exhaustionToRemove = 1;

            let totalFoodEatenToday = 0;
            let totalWaterDrankToday = 0;

            if(lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) {

                const {
                    actorRequiredFood,
                    actorRequiredWater,
                    actorFoodSatedValue,
                    actorWaterSatedValue
                } = lib.getActorConsumableValues(this.actor);

                let actorDaysWithoutFood = getProperty(this.actor.data, CONSTANTS.FLAGS.STARVATION) ?? 0;

                const items = this.consumableData.items.filter(item => item.amount);
                let foodItems = items.filter(item => item.type === "both" || item.type === "food");
                let waterItems = items.filter(item => item => item.type === "both" || item.type === "water");

                if(actorRequiredFood) {

                    let actorExhaustionThreshold = lib.evaluateFormula(
                        lib.getSetting(CONSTANTS.SETTINGS.HALF_FOOD_DURATION_MODIFIER),
                        foundry.utils.deepClone(this.actor.data.data)
                    )?.total ?? 4;

                    if(this.consumableData.hasAccessToFood) {
                        totalFoodEatenToday = this.consumableData.halfFood === "full"
                            ? actorRequiredFood
                            : actorRequiredFood/2;
                    } else {
                        totalFoodEatenToday = foodItems.reduce((acc, item) => {
                            acc += item.consumable.dayWorth ? actorRequiredFood : item.amount;
                            return acc;
                        }, actorFoodSatedValue);
                    }

                    totalFoodEatenToday = Math.min(actorRequiredFood, totalFoodEatenToday);

                    if (totalFoodEatenToday <= (actorRequiredFood / 2)) {
                        if (totalFoodEatenToday === 0) {
                            exhaustionToRemove = 0;
                            actorDaysWithoutFood += 1;
                            this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.FoodNone"));
                        }else {
                            actorDaysWithoutFood += 0.5;
                            this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.FoodHalf"));
                        }
                    } else {
                        actorDaysWithoutFood = 0;
                        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.FoodFull"));
                    }

                    if (actorDaysWithoutFood > actorExhaustionThreshold) {
                        actorExhaustion++;
                    }

                    setProperty(updates, CONSTANTS.FLAGS.STARVATION, actorDaysWithoutFood);

                }

                if(actorRequiredWater) {

                    if(this.consumableData.hasAccessToWater) {
                        totalWaterDrankToday = this.consumableData.halfWater === "full"
                            ? actorRequiredWater
                            : actorRequiredWater/2;
                    } else {
                        totalWaterDrankToday = waterItems.reduce((acc, item) => {
                            acc += item.consumable.dayWorth ? actorRequiredWater : item.amount;
                            return acc;
                        }, actorWaterSatedValue);
                    }

                    totalWaterDrankToday = Math.min(actorRequiredWater, totalWaterDrankToday);

                    if (totalWaterDrankToday === 0) {
                        actorExhaustion += actorExhaustion > 0 ? 2 : 1;
                        exhaustionToRemove = 0;
                        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.WaterNone"));
                    } else if (totalWaterDrankToday <= (actorRequiredWater/2)) {
                        // TODO: automate con save here
                        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.WaterHalf"));
                    }else{
                        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.WaterFull"));
                    }
                }

                if(actorExhaustion > actorInitialExhaustion){
                    this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.Exhaustion", {
                        exhaustion: actorExhaustion - actorInitialExhaustion
                    }));
                }

                setProperty(updates, CONSTANTS.FLAGS.SATED_FOOD, 0);
                setProperty(updates, CONSTANTS.FLAGS.SATED_WATER, 0);

            }

            setProperty(updates, 'data.attributes.exhaustion', Math.max(0, Math.min(actorExhaustion - exhaustionToRemove, 6)));

        }

        if(this.foodAndWaterMessage.length){
            this.foodAndWaterMessage = this.foodAndWaterMessage.map(str => (`<p>${str}</p>`));
        }

        return updates;

    }

    _displayRestResultMessage(chatMessage){

        chatMessage.then((message) => {
            let extra = this.spellSlotsRegainedMessage
                + this.itemsRegainedMessages.join("")
                + this.resourcesRegainedMessages.join("")
            if (extra.length) {
                extra = `<p>${game.i18n.localize('REST-RECOVERY.Chat.RegainedUses')}</p>` + extra;
            }
            if (this.foodAndWaterMessage.length) {
                extra += this.foodAndWaterMessage.join("");
            }
            message.update({
                content: `<p>${message.data.content}</p>` + extra
            });
        });

        return chatMessage;

    }

    _getRestHitPointRecovery(result) {

        if (!this.longRest) {
            result.hitPointsRecovered = Math.max(0, result.hitPointsRecovered);
            return result;
        }

        const multiplier = lib.determineLongRestMultiplier(CONSTANTS.SETTINGS.HP_MULTIPLIER);

        const maxHP = this.actor.data.data.attributes.hp.max;
        const currentHP = this.actor.data.data.attributes.hp.value;

        let recoveredHP = this.finished ? this.healthData.hitPointsToRegain : 0;

        if (!recoveredHP) {
            recoveredHP = typeof multiplier === "string"
                ? Math.floor(lib.evaluateFormula(multiplier, foundry.utils.deepClone(this.actor.data.data))?.total)
                : Math.floor(maxHP * multiplier);
        }

        result.updates["data.attributes.hp.value"] = Math.min(maxHP, currentHP + recoveredHP);
        result.hitPointsRecovered = Math.min(maxHP - currentHP, recoveredHP);

        if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE)) {
            result.hitPointsRecovered += (currentHP - this.healthData.startingHealth);
        }

        return result;

    }

    _getRestHitDiceRecoveryPre({ maxHitDice = undefined } = {}) {

        if (!this.longRest) return {};

        return this._getMaxHitDiceRecovery({ maxHitDice });

    }

    _getRestHitDiceRecoveryPost(results, { forced = false } = {}) {

        if (forced) {
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

        const multiplier = lib.determineLongRestMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
        const roundingMethod = lib.determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
        const actorLevel = this.actor.data.data.details.level;

        if (typeof multiplier === "string") {

            const customRegain = lib.evaluateFormula(multiplier, foundry.utils.deepClone(this.actor.data.data))?.total;
            maxHitDice = Math.clamped(roundingMethod(customRegain), 0, maxHitDice ?? actorLevel);

        } else {

            maxHitDice = Math.clamped(
                roundingMethod(actorLevel * multiplier),
                multiplier ? 1 : 0,
                maxHitDice ?? actorLevel
            );

        }

        return { maxHitDice };

    }

    _getRestResourceRecovery(updates, { recoverShortRestResources = true, recoverLongRestResources = true } = {}) {

        const finishedRestUpdates = this._finishedRest(updates);

        const actorCopy = foundry.utils.deepClone(this.actor.data.data);

        const customRecoveryResources = Object.entries(this.actor.data.data.resources).filter(entry => {
            return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && getProperty(this.actor.data, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`)
        });

        const regularResources = Object.entries(this.actor.data.data.resources).filter(entry => {
            return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && !getProperty(this.actor.data, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`)
        });

        for (const [key, resource] of customRecoveryResources) {
            if ((recoverShortRestResources && resource.sr) || (recoverLongRestResources && resource.lr)) {
                const customFormula = getProperty(this.actor.data, `${CONSTANTS.FLAGS.RESOURCES}.${key}.formula`);
                const customRoll = lib.evaluateFormula(customFormula, actorCopy);
                finishedRestUpdates[`data.resources.${key}.value`] = Math.min(resource.value + customRoll.total, resource.max);

                const chargeText = `<a class="inline-roll roll" onClick="return false;" title="${customRoll.formula} (${customRoll.total})">${Math.min(resource.max - resource.value, customRoll.total)}</a>`;
                this.resourcesRegainedMessages.push(`<li>${game.i18n.format("REST-RECOVERY.Chat.RecoveryNameNum", {
                    name: resource.label,
                    number: chargeText
                })}</li>`)
            }
        }

        if (this.resourcesRegainedMessages.length) {
            this.resourcesRegainedMessages.unshift('<ul>')
            this.resourcesRegainedMessages.push('</ul>');
        }

        const multiplier = lib.determineLongRestMultiplier(CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER);
        if (multiplier === 1.0) return { ...updates, ...finishedRestUpdates };
        if (!multiplier) return finishedRestUpdates;

        for (const [key, resource] of regularResources) {
            if (recoverShortRestResources && resource.sr) {
                finishedRestUpdates[`data.resources.${key}.value`] = Number(resource.max);
            } else if (recoverLongRestResources && resource.lr) {
                const recoverResources = typeof multiplier === "string"
                    ? lib.evaluateFormula(multiplier, { resource: foundry.utils.deepClone(resource) })?.total
                    : Math.max(Math.floor(resource.max * multiplier), 1);

                finishedRestUpdates[`data.resources.${key}.value`] = Math.min(resource.value + recoverResources, resource.max);
            }
        }

        return finishedRestUpdates;

    }

    _getRestSpellRecovery(updates, { recoverSpells = true } = {}) {

        // Long rest
        if (recoverSpells) {

            const multiplier = lib.determineLongRestMultiplier(CONSTANTS.SETTINGS.SPELLS_MULTIPLIER);

            for (let [level, slot] of Object.entries(this.actor.data.data.spells)) {
                if (!slot.override && !slot.max) continue;
                let spellMax = slot.override || slot.max;
                let recoverSpells = typeof multiplier === "string"
                    ? Math.max(lib.evaluateFormula(multiplier, { slot: foundry.utils.deepClone(slot) })?.total, 1)
                    : Math.max(Math.floor(spellMax * multiplier), multiplier ? 1 : multiplier);
                updates[`data.spells.${level}.value`] = Math.min(slot.value + recoverSpells, spellMax);
            }

            // Short rest
        } else {

            if (this.spellData.feature) {

                if (!foundry.utils.isObjectEmpty(this.recoveredSlots)) {

                    for (const [slot, num] of Object.entries(this.recoveredSlots)) {
                        const prop = `data.spells.spell${slot}.value`;
                        updates[prop] = (updates[prop] || foundry.utils.getProperty(this.actor.data, prop) || 0) + num;
                    }

                    this.spellSlotsRegainedMessage = "<ul>";
                    for (const [level, num] of Object.entries(this.recoveredSlots)) {
                        const numText = game.i18n.localize("REST-RECOVERY.NumberToText." + num);
                        const levelText = lib.ordinalSuffixOf(level);
                        const localization = "REST-RECOVERY.Chat.SpellSlotList" + (num > 1 ? "Plural" : "");
                        this.spellSlotsRegainedMessage += `<li>${game.i18n.format(localization, {
                            number: numText,
                            level: levelText
                        })}</li>`
                    }
                    this.spellSlotsRegainedMessage += "</ul>";

                }

            }

        }

        return updates;

    }

    _getRestItemUsesRecovery(updates, args) {

        updates = this._recoverItemsUses(updates, args);

        if (!this.longRest && this.spellData.pointsSpent && this.spellData.feature) {
            updates.push({ _id: this.spellData.feature.id, "data.uses.value": 0 });
        }

        return updates;

    }

    _recoverItemsUses(updates, args) {

        const { recoverLongRestUses, recoverDailyUses } = args;

        const featsMultiplier = lib.determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER);
        const othersMultiplier = lib.determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER);
        const dailyMultiplier = lib.determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER);

        const clonedActor = foundry.utils.deepClone(this.actor.data.data);

        for (const item of this.actor.items) {
            if (item.data.data.uses) {
                const customRecovery = item.data.flags?.[CONSTANTS.MODULE_NAME]?.[CONSTANTS.FLAG_NAME]?.recovery?.enabled;
                if (recoverLongRestUses && item.data.data.uses.per === "lr") {
                    updates = this._recoverItemUse(clonedActor, updates, item, item.type === "feat" ? featsMultiplier : othersMultiplier);
                } else if (recoverDailyUses && item.data.data.uses.per === "day") {
                    updates = this._recoverItemUse(clonedActor, updates, item, dailyMultiplier);
                } else if (customRecovery) {
                    updates = this._recoverItemUse(clonedActor, updates, item);
                }
            } else if (recoverLongRestUses && item.data.data.recharge && item.data.data.recharge.value) {
                updates.push({ _id: item.id, "data.recharge.charged": true });
            }
        }

        if (this.itemsRegainedMessages.length) {
            this.itemsRegainedMessages.sort((a, b) => {
                return a[0] > b[0] || a[1] > b[1] ? -1 : 1;
            });
            this.itemsRegainedMessages = this.itemsRegainedMessages.map(line => line[1]);
            this.itemsRegainedMessages.unshift(`<ul>`)
            this.itemsRegainedMessages.push('</ul>');
        }

        if(recoverLongRestUses) {
            updates = this._handleFoodAndWaterItems(updates);
        }

        return updates;
    }


    _recoverItemUse(actor, updates, item, multiplier = 1.0) {

        const usesMax = item.data.data.uses.max;
        const usesCur = item.data.data.uses.value;

        if (usesCur === usesMax) return updates;

        const customRecovery = item.data.flags?.[CONSTANTS.MODULE_NAME]?.[CONSTANTS.FLAG_NAME]?.recovery?.enabled;
        const customFormula = item.data.flags?.[CONSTANTS.MODULE_NAME]?.[CONSTANTS.FLAG_NAME]?.recovery?.custom_formula ?? "";

        let recoverValue;
        if (customRecovery) {
            const customRoll = lib.evaluateFormula(customFormula, {
                actor: actor,
                item: foundry.utils.deepClone(item.data.data)
            });
            recoverValue = Math.max(0, Math.min(usesCur + customRoll.total, usesMax));
            const chargeText = `<a class="inline-roll roll" onClick="return false;" title="${customRoll.formula} (${customRoll.total})">${Math.min(usesMax - usesCur, customRoll.total)}</a>`;
            this.itemsRegainedMessages.push([item.type, `<li>${game.i18n.format("REST-RECOVERY.Chat.RecoveryNameNum", {
                name: item.name,
                number: chargeText
            })}</li>`])
        } else {
            recoverValue = typeof multiplier === "string"
                ? lib.evaluateFormula(multiplier, foundry.utils.deepClone(item.data.data))?.total
                : Math.max(Math.floor(usesMax * multiplier), multiplier ? 1 : 0);
            recoverValue = Math.max(0, Math.min(usesCur + recoverValue, usesMax));
        }

        const update = updates.find(update => update._id === item.id);

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

    _handleFoodAndWaterItems(updates) {

        if(!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return updates;

        const {
            actorRequiredFood,
            actorRequiredWater
        } = lib.getActorConsumableValues(this.actor);

        if((!actorRequiredFood && !actorRequiredWater) || !this.consumableData.items.length) return updates;

        let itemsToDelete = [];

        for(const item of this.consumableData.items){

            const itemD = item.data;

            let updateIndex = updates.findIndex(update => update._id === itemD.id);
            let update = updates[updateIndex] ?? {
                _id: item.data.id
            };

            const newUses = getProperty(update, "data.uses.value") ?? item.usesLeft - item.amount;
            update["data.uses.value"] = newUses;

            if(updateIndex) {
                updates.splice(updateIndex, 1);
            }

            const consumeQuantity = getProperty(itemD.data, 'data.uses.autoDestroy') ?? false;
            const quantity = getProperty(itemD.data, "data.quantity");

            if(consumeQuantity && quantity <= 1 && newUses === 0){
                itemsToDelete.push(itemD.id);
            }else{
                if(consumeQuantity && newUses === 0){
                    setProperty(update, "data.uses.value", getProperty(itemD.data, "data.uses.max") ?? 1);
                    setProperty(update, "data.quantity", quantity - 1);
                }
                updates.push(update);
            }
        }

        this.actor.deleteEmbeddedDocuments("Item", itemsToDelete);

        return updates;
    }

    static _setupFoodListeners(){

        Hooks.on("closeApplication", (app) => {
            if(!app?.item) return;
            const item = app.item;
            const consumable = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);
            if(!consumable?.enabled) return;
            let consumeFull = true;
            const element = app.element.find('input[name="consumeAmount"]:checked');
            if(element.length){
                consumeFull = element.val() === "full";
            }
            this.itemsListened.set(item.id, consumeFull);
            setTimeout(() => {
                this.itemsListened.delete(item.id)
            }, 150);
        });

        Hooks.on('preUpdateItem', (item, data) => {
            if(getProperty(data, CONSTANTS.FLAGS.CONSUMABLE)?.enabled && !lib.isRealNumber(getProperty(item.data, "data.uses.max"))){
                return this._patchConsumableItem(item, data);
            }
            if(!this.itemsListened.has(item.id)) return;
            const consumable = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);
            if(!consumable?.enabled) return;
            return this._handleConsumableItem(item, data);
        });
    }

    static _patchConsumableItem(item, data){
        data["data.uses.value"] = 1;
        data["data.uses.max"] = 1;
        data["data.uses.per"] = "charges";
        ui.notifications.info(game.i18n.format("REST-RECOVERY.PatchedConsumable", {
            itemName: item.name
        }));
    }

    static _handleConsumableItem(item, data){

        const consumable = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);

        const actorUpdates = {};

        let {
            actorRequiredFood,
            actorRequiredWater,
            actorFoodSatedValue,
            actorWaterSatedValue
        } = lib.getActorConsumableValues(item.parent);

        const currCharges = getProperty(item.data, "data.uses.value");
        const newCharges = getProperty(data, "data.uses.value") ?? (currCharges - 1.0);
        const chargesUsed = currCharges < newCharges ? currCharges : currCharges - newCharges;

        let message;

        if(consumable.type === "both") {

            actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? actorRequiredFood : actorFoodSatedValue + chargesUsed;
            actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? actorRequiredWater : actorWaterSatedValue + chargesUsed;

            const localize = "REST-RECOVERY.Chat.FoodAndWater.ConsumedBoth" + (consumable.dayWorth ? "DayWorth" : "")
            message = "<p>" + game.i18n.format(localize, {
                actorName: item.parent.name,
                itemName: item.name,
                charges: chargesUsed
            }) + "</p>";

            if(!consumable.dayWorth) {
                message += actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] >= actorRequiredFood
                    ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.FoodAndWater.SatedFood") + "</p>"
                    : "<p>" + game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.RequiredSatedFood", { units: actorRequiredFood - actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] }) + "</p>"
                message += actorUpdates[CONSTANTS.FLAGS.SATED_WATER] >= actorRequiredWater
                    ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.FoodAndWater.SatedWater") + "</p>"
                    : "<p>" + game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.RequiredSatedWater", { units: actorRequiredWater - actorUpdates[CONSTANTS.FLAGS.SATED_WATER] }) + "</p>"
            }

        }else if(consumable.type === "food"){

            actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? actorRequiredFood : actorFoodSatedValue + chargesUsed;

            const localize = "REST-RECOVERY.Chat.FoodAndWater.ConsumedFood" + (consumable.dayWorth ? "DayWorth" : "")
            message = "<p>" + game.i18n.format(localize, {
                actorName: item.parent.name,
                itemName: item.name,
                charges: chargesUsed
            }) + "</p>";

            message += actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] >= actorRequiredFood
                ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.FoodAndWater.SatedFood") + "</p>"
                : "<p>" + game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.RequiredSatedFood", { units: actorRequiredFood - actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] }) + "</p>"

        }else if(consumable.type === "water"){

            actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? actorRequiredWater : actorWaterSatedValue + chargesUsed;

            const localize = "REST-RECOVERY.Chat.FoodAndWater.ConsumedWater" + (consumable.dayWorth ? "DayWorth" : "")
            message = "<p>" + game.i18n.format(localize, {
                actorName: item.parent.name,
                itemName: item.name,
                charges: chargesUsed
            }) + "</p>";

            message += actorUpdates[CONSTANTS.FLAGS.SATED_WATER] >= actorRequiredWater
                ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.FoodAndWater.SatedWater") + "</p>"
                : "<p>" + game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.RequiredSatedWater", { units: actorRequiredWater - actorUpdates[CONSTANTS.FLAGS.SATED_WATER] }) + "</p>"
        }

        if(!foundry.utils.isObjectEmpty(actorUpdates)){
            item.parent.update(actorUpdates);
        }

        if(message){
            setTimeout(() => {
                ChatMessage.create({
                    flavor: "Rest Recovery",
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker({ actor: item.parent }),
                    content: message,
                });
            }, 450)
        }

    }

}