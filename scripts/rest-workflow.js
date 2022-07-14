import CONSTANTS from "./constants.js";
import * as lib from "./lib/lib.js";
import plugins from "./plugins.js";
import { getSetting } from "./lib/lib.js";

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

        Hooks.on("preUpdateActor", (actor, data) => {
            if(!lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) return;
            const exhaustion = getProperty(data, "data.attributes.exhaustion");
            if(exhaustion === undefined || !rests.get(actor.uuid)) return;
            const integration = lib.getSetting(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION);
            return plugins.handleIntegration(integration+"-exhaustion", actor, data);
        });

        this._setupFoodListeners();

    }

    static get(actor) {
        return rests.get(actor.uuid);
    }

    static remove(actor) {
        rests.delete(actor.uuid);
    }

    static make(actor, longRest = false) {
        this.remove(actor);
        const workflow = new this(actor, longRest);
        rests.set(actor.uuid, workflow);
        return workflow.setup();
    }

    setup() {
        this.fetchHealthData();
        this.fetchFeatures();
        this.fetchSpellData();
        return this;
    }

    fetchHealthData() {
        this.healthData = {
            level: this.actor.data.data.details.level,
            startingHitDice: this.actor.data.data.attributes.hd,
            startingHealth: this.actor.data.data.attributes.hp.value,
            hitDiceSpent: 0,
            hitPointsToRegainFromRest: 0,
            hitPointsToRegain: 0,
            enableAutoRollHitDice: false
        }

        const longRestRollHitDice = this.longRest && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
        const longRestNotFullHitPoints = longRestRollHitDice && lib.getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.FRACTIONS.FULL;

        if(!this.longRest || longRestRollHitDice || longRestNotFullHitPoints) {
            let { hitPointsToRegainFromRest } = this.actor._getRestHitPointRecovery();
            this.healthData.hitPointsToRegainFromRest = hitPointsToRegainFromRest;
        }

        this.refreshHealthData();
    }

    refreshHealthData() {
        this.healthData.availableHitDice = this.getHitDice();
        this.healthData.totalHitDice = this.totalHitDice;

        if(lib.getSetting(CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE)) {
            let avgHitDiceRegain = this.getAverageHitDiceRoll();
            let missingHP = this.maxHP - this.currHP;
            let probableHitDiceLeftToRoll = Math.floor(missingHP / avgHitDiceRegain);

            this.healthData.enableAutoRollHitDice = (this.currHP + this.healthData.hitPointsToRegainFromRest) < this.maxHP
                && probableHitDiceLeftToRoll > 0 && this.healthData.totalHitDice > 0;

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

        if (wizardFeature && (wizardLevel > druidLevel || (druidLevel > wizardLevel && !druidFeatureUse))) {
            this.spellData.has_feature_use = wizardFeatureUse;
            this.spellData.feature = wizardFeature;
            this.spellData.pointsTotal = wizardFeature
                ? lib.evaluateFormula(wizardFeature.data.data.formula || "ceil(@classes.wizard.levels/2)", this.actor.getRollData())?.total
                : 0;
            this.spellData.className = lib.getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
        } else if (druidFeature && (druidLevel > wizardLevel || (wizardLevel > druidLevel && !wizardFeatureUse))) {
            this.spellData.has_feature_use = druidFeatureUse;
            this.spellData.feature = druidFeature;
            this.spellData.pointsTotal = druidFeature
                ? lib.evaluateFormula(druidFeature.data.data.formula || "ceil(@classes.druid.levels/2)", this.actor.getRollData())?.total
                : 0;
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
                "data.formula": `ceil(@classes.${className.toLowerCase()}.levels/2)`
            }]);
            ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedRecovery", {
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
        let avgHitDiceRegain = this.getAverageHitDiceRoll();
        let missingHP = this.maxHP - this.currHP;
        let probableHitDiceLeftToRoll = Math.floor(missingHP / avgHitDiceRegain);
    
        const minSpendHitDice = getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0;
        const maxHitDiceSpendMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND);
        let maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string"
            ? Math.floor(lib.evaluateFormula(maxHitDiceSpendMultiplier, this.actor.getRollData())?.total ?? 0)
            : Math.floor(this.actor.data.data.details.level * maxHitDiceSpendMultiplier);
        maxSpendHitDice = Math.max(minSpendHitDice, maxSpendHitDice);

        // While the character is missing at least 10% of its hp, and we predict we can roll hit dice, and we have some left, roll hit dice
        while(missingHP && probableHitDiceLeftToRoll > 0 && this.healthData.totalHitDice > 0 && avgHitDiceRegain > 0) {
            if(this.healthData.hitDiceSpent >= maxSpendHitDice) break;
            avgHitDiceRegain = this.getAverageHitDiceRoll();
            await this.rollHitDice(undefined, false);
            missingHP = this.maxHP - this.currHP;
            probableHitDiceLeftToRoll = Math.floor(missingHP / avgHitDiceRegain);
        }

        this.refreshHealthData();
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
        this.healthData.hitDiceSpent++;

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

            await roll.toMessage({
                flavor: game.i18n.format("REST-RECOVERY.Chat.Chef" + (chefActor === this.actor ? "Self" : ""), {
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

        this.healthData.availableHitDice = this.getHitDice();
        this.healthData.totalHitDice = this.totalHitDice;

    }

    _finishedRest() {

        let updates = {};

        const maxShortRests = lib.getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS) || 0;
        if (maxShortRests > 0) {
            if (this.longRest) {
                updates[CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS] = 0;
            } else {
                const currentShortRests = getProperty(this.actor.data, CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS) || 0;
                updates[CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS] = currentShortRests + 1;
            }
        }

        return updates;
    }

    async _handleFoodWaterExhaustion(updates){

        let actorInitialExhaustion = getProperty(this.actor.data, "data.attributes.exhaustion") ?? 0;
        let actorExhaustion = actorInitialExhaustion;
        let exhaustionGain = false;
        let exhaustionSave = false;
        let exhaustionToRemove = 1;

        if(lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) {

            let {
                actorRequiredFood,
                actorRequiredWater,
                actorFoodSatedValue,
                actorWaterSatedValue
            } = lib.getActorConsumableValues(this.actor);

            let actorDaysWithoutFood = getProperty(this.actor.data, CONSTANTS.FLAGS.STARVATION) ?? 0;

            const items = this.consumableData.items.filter(item => item.amount);
            let foodItems = items.filter(item => item.consumable.type === "both" || item.consumable.type === "food");
            let waterItems = items.filter(item => item.consumable.type === "both" || item.consumable.type === "water");

            if(actorRequiredFood) {

                let localize = "REST-RECOVERY.Chat.FoodAndWater.Food"

                let actorExhaustionThreshold = lib.evaluateFormula(
                    lib.getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER),
                    this.actor.getRollData()
                )?.total ?? 4;

                if(this.consumableData.hasAccessToFood) {

                    if(actorFoodSatedValue >= (actorRequiredFood / 2)){
                        localize += actorFoodSatedValue >= actorRequiredFood ? "Full" : "Half";
                    }else{
                        localize += "None";
                    }

                    localize += lib.capitalizeFirstLetter(this.consumableData.halfFood);

                    actorFoodSatedValue += this.consumableData.halfFood === "full"
                        ? actorRequiredFood
                        : actorRequiredFood/2;

                } else {

                    actorFoodSatedValue += foodItems.reduce((acc, item) => {
                        acc += item.consumable.dayWorth ? 100000000000 : item.amount;
                        return acc;
                    }, actorFoodSatedValue);

                    if(actorFoodSatedValue >= (actorRequiredFood / 2)){
                        localize += actorFoodSatedValue >= actorRequiredFood ? "Full" : "Half";
                    }else{
                        localize += "None";
                    }

                    localize += "None";
                }

                this.foodAndWaterMessage.push(game.i18n.localize(localize));

                actorFoodSatedValue = Math.min(actorRequiredFood, actorFoodSatedValue);

                if(lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION)) {

                    if (actorFoodSatedValue <= (actorRequiredFood / 2)) {
                        exhaustionToRemove = 0;
                        actorDaysWithoutFood += actorFoodSatedValue === 0 ? 1 : 0.5;
                    } else {
                        actorDaysWithoutFood = 0;
                    }

                    if (actorDaysWithoutFood > actorExhaustionThreshold) {
                        actorExhaustion++;
                        exhaustionGain = true;
                    }

                    updates[CONSTANTS.FLAGS.STARVATION] = actorDaysWithoutFood;

                }

            }

            if(actorRequiredWater) {

                let localize = "REST-RECOVERY.Chat.FoodAndWater.Water"

                if(this.consumableData.hasAccessToWater) {

                    if(actorWaterSatedValue >= (actorRequiredWater / 2)){
                        localize += actorWaterSatedValue >= actorRequiredWater ? "Full" : "Half"
                    }else{
                        localize += "None"
                    }

                    localize += lib.capitalizeFirstLetter(this.consumableData.halfWater);

                    actorWaterSatedValue += this.consumableData.halfWater === "full"
                        ? actorRequiredWater
                        : actorRequiredWater/2;

                } else {

                    actorWaterSatedValue = waterItems.reduce((acc, item) => {
                        acc += item.consumable.dayWorth ? actorRequiredWater : item.amount;
                        return acc;
                    }, actorWaterSatedValue);

                    if(actorWaterSatedValue >= (actorRequiredWater / 2)){
                        localize += actorWaterSatedValue >= actorRequiredWater ? "Full" : "Half"
                    }else{
                        localize += "None"
                    }

                    localize += "None";

                }

                this.foodAndWaterMessage.push(game.i18n.localize(localize));

                actorWaterSatedValue = Math.min(actorRequiredWater, actorWaterSatedValue);

                if (actorWaterSatedValue < actorRequiredWater && lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION)) {
                    if(actorWaterSatedValue < (actorRequiredWater/2)) {
                        actorExhaustion += actorExhaustion > 0 ? 2 : 1;
                        exhaustionGain = true;
                        exhaustionToRemove = 0;
                    }else{
                        const halfWaterSaveDC = lib.getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
                        if (halfWaterSaveDC) {
                            exhaustionToRemove = 0;
                            let roll = await this.actor.rollAbilitySave("con", {
                                targetValue: halfWaterSaveDC
                            });
                            if (!roll) {
                                roll = await this.actor.rollAbilitySave("con", {
                                    targetValue: halfWaterSaveDC,
                                    fastForward: true
                                });
                            }
                            if (roll.total < halfWaterSaveDC) {
                                actorExhaustion += actorExhaustion > 0 ? 2 : 1;
                                exhaustionGain = true;
                            } else {
                                exhaustionSave = true;
                            }
                        }
                    }
                }
            }

            if(lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION)){
                if(exhaustionGain){
                    this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.Exhaustion", {
                        exhaustion: actorExhaustion - actorInitialExhaustion
                    }));
                }else if(exhaustionSave){
                    this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.NoExhaustion"));
                }
            }

            updates[CONSTANTS.FLAGS.SATED_FOOD] = 0;
            updates[CONSTANTS.FLAGS.SATED_WATER] = 0;

        }

        if(lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) {
            updates['data.attributes.exhaustion'] = Math.max(0, Math.min(actorExhaustion - exhaustionToRemove, 6));
            if(lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION) && updates['data.attributes.exhaustion'] === 6){
                this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.FoodAndWater.ExhaustionDeath", { actorName: this.actor.name }));
            }
        }

        if(this.foodAndWaterMessage.length){
            this.foodAndWaterMessage = this.foodAndWaterMessage.map(str => (`<p>${str}</p>`));
        }

        return updates;

    }

    _displayRestResultMessage(chatMessage){

        let extra = this.spellSlotsRegainedMessage
            + this.itemsRegainedMessages.join("")
            + this.resourcesRegainedMessages.join("")
        if (extra.length) {
            extra = `<p>${game.i18n.localize('REST-RECOVERY.Chat.RegainedUses')}</p>` + extra;
        }

        if (this.foodAndWaterMessage.length) {
            extra += this.foodAndWaterMessage.join("");
        }

        chatMessage.update({
            content: `<p>${chatMessage.data.content}</p>` + extra
        }).then(() => {
            ui.chat.scrollBottom();
        });

        return chatMessage;
    }

    _getRestHitPointRecovery(result) {

        const maxHP = this.actor.data.data.attributes.hp.max;
        const currentHP = this.actor.data.data.attributes.hp.value;

        if (!this.longRest) {
            result.hitPointsRecovered = currentHP - this.healthData.startingHealth;
            result.hitPointsToRegainFromRest = 0;
            return result;
        }

        const multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.HP_MULTIPLIER);

        result.hitPointsToRegainFromRest = typeof multiplier === "string"
            ? Math.floor(lib.evaluateFormula(multiplier, this.actor.getRollData())?.total)
            : Math.floor(maxHP * multiplier);

        result.updates["data.attributes.hp.value"] = Math.min(maxHP, currentHP + result.hitPointsToRegainFromRest);
        result.hitPointsRecovered = result.updates["data.attributes.hp.value"] - this.healthData.startingHealth;

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

        const multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
        const roundingMethod = lib.determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
        const actorLevel = this.actor.data.data.details.level;

        if (typeof multiplier === "string") {

            const customRegain = lib.evaluateFormula(multiplier, this.actor.getRollData())?.total;
            maxHitDice = Math.clamped(roundingMethod(customRegain), 0, maxHitDice ?? actorLevel);

        } else {

            maxHitDice = Math.clamped(
                roundingMethod(actorLevel * multiplier),
                multiplier ? 1 : 0,
                maxHitDice ?? actorLevel
            );

        }
        
        if(!lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)){
          const maximumHitDiceToRecover = Number(Object.values(this.actor.classes).reduce((acc, cls) => {
            acc += cls.data.data?.hitDiceUsed ?? 0;
            return acc;
          }, 0));
          maxHitDice = Math.min(maximumHitDiceToRecover, maxHitDice);
        }

        return { maxHitDice };

    }

    _getRestResourceRecovery(updates, { recoverShortRestResources = true, recoverLongRestResources = true } = {}) {

        const finishedRestUpdates = this._finishedRest(updates);

        const customRecoveryResources = Object.entries(this.actor.data.data.resources).filter(entry => {
            return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && getProperty(this.actor.data, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`)
        });

        const regularResources = Object.entries(this.actor.data.data.resources).filter(entry => {
            return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && !getProperty(this.actor.data, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`)
        });

        for (const [key, resource] of customRecoveryResources) {
            if ((recoverShortRestResources && resource.sr) || (recoverLongRestResources && resource.lr)) {
                const customFormula = getProperty(this.actor.data, `${CONSTANTS.FLAGS.RESOURCES}.${key}.formula`);
                const customRoll = lib.evaluateFormula(customFormula, this.actor.getRollData());
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

        const multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER);
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

            const multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER);

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

        const longFeatsMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER);
        const longOthersMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER);

        const shortFeatsMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER);
        const shortOthersMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER);

        const dailyMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER);

        const actorRollData = this.actor.getRollData();

        for (const item of this.actor.items) {
            if (item.data.data.uses) {
                if(recoverDailyUses && item.data.data.uses.per === "day") {
                    updates = this._recoverItemUse(actorRollData, updates, item, dailyMultiplier);
                }else if(recoverLongRestUses && item.data.data.uses.per === "lr") {
                    updates = this._recoverItemUse(actorRollData, updates, item, item.type === "feat" ? longFeatsMultiplier : longOthersMultiplier);
                }else if (!recoverLongRestUses && item.data.data.uses.per === "sr") {
                    updates = this._recoverItemUse(actorRollData, updates, item, item.type === "feat" ? shortFeatsMultiplier : shortOthersMultiplier);
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

    async _handleFoodAndWaterItems(updates) {

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

            if(updateIndex > -1) {
                updates.splice(updateIndex, 1);
            }

            const consumeQuantity = getProperty(itemD.data, 'data.uses.autoDestroy') ?? false;
            const quantity = getProperty(itemD.data, "data.quantity");

            if(consumeQuantity && quantity <= 1 && newUses === 0){
                itemsToDelete.push(itemD.id);
            }else{
                if(consumeQuantity && newUses === 0){
                    update["data.uses.value"] = getProperty(itemD.data, "data.uses.max") ?? 1;
                    update["data.quantity"] = quantity - 1;
                }
                updates.push(update);
            }
        }

        await this.actor.deleteEmbeddedDocuments("Item", itemsToDelete);

        return updates;
    }

    static _setupFoodListeners(){

        Hooks.on("closeApplication", (app) => {
            if(!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
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
            if(!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
            if(getProperty(data, CONSTANTS.FLAGS.CONSUMABLE)?.enabled && !lib.isRealNumber(getProperty(item.data, "data.uses.max"))){
                return this._patchConsumableItem(item, data);
            }
            if(!this.itemsListened.has(item.id)) return;
            const consumable = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);
            if(!consumable?.enabled) return;
            return this._handleConsumableItem(item, data);
        });
    }

    static patchAllConsumableItems(actor) {

        const items = actor.items.filter(item => (item.name === "Rations" || item.name === "Waterskin") && getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE) === undefined);

        const updates = items.map(item => {
            if(item.name.startsWith("Rations")){
                return {
                    "_id": item.id,
                    "data.uses.value": getProperty(item.data, "data.uses.value") ?? 1,
                    "data.uses.max": getProperty(item.data, "data.uses.max") ?? 1,
                    "data.uses.per": getProperty(item.data, "data.uses.per") ?? "charges",
                    [CONSTANTS.FLAGS.CONSUMABLE_ENABLED]: true,
                    [CONSTANTS.FLAGS.CONSUMABLE_TYPE]: CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD
                }
            }

            return {
                "_id": item.id,
                "data.uses.value": 1,
                "data.uses.max": 1,
                "data.uses.per": "charges",
                [CONSTANTS.FLAGS.CONSUMABLE_ENABLED]: true,
                [CONSTANTS.FLAGS.CONSUMABLE_TYPE]: CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER
            }
        });

        if(updates.length) {
            ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedConsumable", {
                itemName: [...new Set(items.map(item => item.name))].join(', ')
            }));
        }

        return actor.updateEmbeddedDocuments("Item", updates);

    }


    static _patchConsumableItem(item, updates){
        if(!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
        updates["data.uses.value"] = 1;
        updates["data.uses.max"] = 1;
        updates["data.uses.per"] = "charges";
        ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedConsumable", {
            itemName: item.name
        }));
    }

    static _handleConsumableItem(item, data){

        if(!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;

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

            actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? 100000000000 : actorFoodSatedValue + chargesUsed;
            actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? 100000000000 : actorWaterSatedValue + chargesUsed;

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

            actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? 100000000000 : actorFoodSatedValue + chargesUsed;

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

            actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? 100000000000 : actorWaterSatedValue + chargesUsed;

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
            }, 1000)
        }

    }

}