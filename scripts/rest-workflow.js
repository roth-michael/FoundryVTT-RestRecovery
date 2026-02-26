import CONSTANTS from "./constants.js";
import * as lib from "./lib/lib.js";
import { custom_warning, getSetting } from "./lib/lib.js";
import plugins from "./plugins.js";
import { PromptRestApplication } from "./apps/promptRest.js";
import { RestApplication } from "./apps/rest.js";
import { getRestFlavor } from "./helpers.js";

const rests = new Map();

export default class RestWorkflow {

  static itemsListened = new Map()

  constructor(actor, longRest, config = {}) {
    this.actor = actor;
    this.longRest = longRest;
    this.finished = false;
    this.preRestRegainHitDice = false;
    this.restVariant = getSetting(CONSTANTS.SETTINGS.REST_VARIANT);

    this.hitDiceMessage = "";
    this.foodAndWaterMessage = [];
    this.steps = [];
    this.config = config;
    this.exhaustionRoll = false;

    this.consumableData = { items: [] };
    this.foodAndWaterCost = 0;
  }

  get maxPossibleHP() {
    return this.actor.system.attributes.hp.max + Math.max(0, this.actor.system.attributes.hp.tempmax ?? 0);
  }

  get maxHP() {
    return this.actor.system.attributes.hp.max + (this.actor.system.attributes.hp.tempmax ?? 0)
  }

  get currHP() {
    return this.actor.system.attributes.hp.value;
  }

  get healthPercentage() {
    return this.currHP / this.maxHP;
  }

  get healthRegained() {
    return this.currHP - this.healthData.startingHealth;
  }

  get totalHitDice() {
    return this.actor.system.attributes.hd.value;
  }

  get recoveredSlots() {
    return Object.fromEntries(Object.entries(this.spellData.slots).map(entry => {
      return [entry[0], entry[1] ? entry[1].reduce((acc, slot) => {
        return acc + (slot.empty && slot.checked ? 1 : 0);
      }, 0) : 0]
    }).filter(entry => entry[1]));
  }

  static initialize() {

    CONFIG.DND5E.consumableTypes.food.subtypes = {
      food: "REST-RECOVERY.Misc.Food",
      water: "REST-RECOVERY.Misc.Water",
      both: "REST-RECOVERY.Misc.Both"
    }

    Hooks.on("dnd5e.restCompleted", (actor) => {
      RestWorkflow.remove(actor);
    });

    Hooks.on("preUpdateActor", (actor, data) => {
      const exhaustion = foundry.utils.getProperty(data, "system.attributes.exhaustion");
      if (exhaustion === undefined) return;
      return plugins.handleExhaustion(actor, data);
    });

    let cachedDenomination = false;
    Hooks.on("dnd5e.preRollHitDieV2", ({subject: actor, rolls: [{parts: formulaParts}], denomination}) => {
      if (RestWorkflow.get(actor)) {
        cachedDenomination = denomination;
      }

      const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM)
        ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true))
        : false;
      const blessing = getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING)
        ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true))
        : false;
      const hasWoundClosure = (periapt && periapt?.system?.attuned) || (blessing && blessing?.type === "feat");
      const multiplyTotal = getSetting(CONSTANTS.SETTINGS.PERIAPT_ROLL_MECHANICS) === CONSTANTS.PERIAPT_MECHANICS.MULTIPLY_TOTAL;

      const durable = getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT)
        ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true))
        : false;
      const isDurable = durable && durable?.type === "feat";

      const blackBlood = getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE)
        ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true))
        : false;
      const hasBlackBlood = blackBlood && blackBlood?.type === "feat";

      const conMod = actor.system.abilities.con.mod;
      const durableMod = Math.max(2, conMod * 2);

      const forceMaxRoll = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.MAXIMISE_HIT_DIE_ROLL);
      const forceAdvantage = actor.getFlag("dnd5e", "hitDieAdvantage") || false;
      const rollFormula = getSetting(CONSTANTS.SETTINGS.HIT_DIE_ROLL_FORMULA);
      const isMaxed = (rollFormula === CONSTANTS.ROLL_FORMULAS.MAXIMIZED) || forceMaxRoll;

				
      const hdMult = lib.determineMultiplier(CONSTANTS.SETTINGS.HD_EFFECTIVE_MULTIPLIER);

			let formula = "1" + denomination;

			if (rollFormula === CONSTANTS.ROLL_FORMULAS.ADVANTAGE || forceAdvantage) {
				formula = "2" + denomination;
			}

			if (isMaxed) {
				formula = denomination.slice(1);
			}
			
      if (hasBlackBlood && !isMaxed) {
        formula += "r<3";
      }

      if (!isMaxed && (rollFormula === CONSTANTS.ROLL_FORMULAS.ADVANTAGE || forceAdvantage)) {
				formula = formula + "kh"
			}

      if (hasWoundClosure && !multiplyTotal) {
        formula = "(" + formula + "*2)";
      }

      if (hdMult !== 1 && !multiplyTotal) {
        formula = `floor(${formula}*${hdMult})`;
      }

      formula += "+@abilities.con.mod";

      const hitDiceBonus = actor.getFlag("dnd5e", "hitDieBonus") ?? 0;
      if (hitDiceBonus) {
        formula += `+${hitDiceBonus}`;
      }

      if (isDurable) {
        formula = `max(${formula},${durableMod})`
      }

      const minHpRecovery = game.settings.get("dnd5e", "rulesVersion") === "modern" ? 1 : 0;

      formulaParts[0] = `max(${minHpRecovery}, ${formula})`;

      if (hasWoundClosure && multiplyTotal) {
        formulaParts[0] = `(${formula})*2`;
      }

      if (hdMult !== 1 && multiplyTotal) {
        formulaParts[0] = `floor((${formula})*${hdMult})`;
      }

    });

    Hooks.on("dnd5e.rollHitDieV2", (rolls, {subject: actor, updates}) => {

      const workflow = RestWorkflow.get(actor);
      if (!workflow) return;

      const denomination = cachedDenomination;

      const hitDice = updates.class?.["system.hd.spent"] - 1;

      const clsItem = actor.itemTypes.class.find(i => {
        return i.system.hd?.denomination === denomination && i.system.hd?.spent === hitDice;
      });

      if (!clsItem) return;

      const bufferDice = foundry.utils.getProperty(clsItem, CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG);

      if ((bufferDice ?? 0) > 0) {
        delete updates.class["system.hd.spent"];
        updates.class[CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG] = bufferDice - 1;
      } else if (bufferDice === 0) {
        updates.class[REMOVE_HIT_DICE_BUFFER_FLAG] = null;
      }

    });

    Hooks.on("dnd5e.preShortRest", (actor, config) => {

      if (actor.type === "group") {
        const actorList = actor.system.members.map(currMember => [currMember.actor.id, currMember.actor.name]);
        new PromptRestApplication({actorList, groupActor: actor, forcedType: config.type}).render(true);
        return false;
      }

      if (foundry.utils.getProperty(this, CONSTANTS.FLAGS.DAE.PREVENT_SHORT_REST) && !config.ignoreFlags) {
        custom_warning("REST-RECOVERY.Warnings.PreventedShortRest");
        return false;
      }

      if (getSetting(CONSTANTS.SETTINGS.REST_VARIANT) === "custom") {
        config.duration = (getSetting(CONSTANTS.SETTINGS.CUSTOM_SHORT_REST_DURATION_HOURS) ?? 1) * 60;
      }

      let workflow = RestWorkflow.make(actor, false, config);
      
      if (!config.dialog) return true;
      
      workflow.then((workflow) => {
  
        const hd0 = actor.system.attributes.hd.value;
        const hp0 = actor.system.attributes.hp.value;

        const shortRestPromise = new Promise((resolve, reject) => {
          new RestApplication({ ...config, actor, workflow, resolve, reject}).render(true)
        });
  
        shortRestPromise.then(async (newDay) => {
  
          config.newDay = newDay;

          if (workflow._shouldRollForFoodWaterExhaustion()) {
  
            const halfWaterSaveDC = lib.getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
  
            [workflow.exhaustionRoll] = await actor.rollSavingThrow({
              ability: "con",
              target: halfWaterSaveDC
            }) ?? [];
            if (!workflow.exhaustionRoll) {
              [workflow.exhaustionRoll] = await actor.rollSavingThrow({
                ability: "con",
                target: halfWaterSaveDC
              }, { configure: false}) ?? [];
            }
          }
  
          const hitDice = actor.system.attributes.hd.value - hd0;
          const hitPoints = actor.system.attributes.hp.value - hp0;

          if (Hooks.call("dnd5e.shortRest", actor, config) === false) return;
  
          return actor._rest(config, {deltas: {hitDice, hitPoints}});
  
        }, () => {});
      });
      return false;

    });

    Hooks.on("dnd5e.preLongRest", (actor, config) => {
      if (actor.type === "group") {
        const actorList = actor.system.members.map(currMember => [currMember.actor.id, currMember.actor.name]);
        new PromptRestApplication({actorList, groupActor: actor, forcedType: config.type}).render(true);
        return false;
      }

      if (foundry.utils.getProperty(this, CONSTANTS.FLAGS.DAE.PREVENT_LONG_REST) && !config.ignoreFlags) {
        custom_warning("REST-RECOVERY.Warnings.PreventedLongRest");
        return false;
      }

      if (getSetting(CONSTANTS.SETTINGS.REST_VARIANT) === "custom") {
        config.duration = (getSetting(CONSTANTS.SETTINGS.CUSTOM_LONG_REST_DURATION_HOURS) ?? 1) * 60;
      }

      let workflow = RestWorkflow.make(actor, true, config);

      if (!config.dialog) return true;

      workflow.then((workflow) => {
        const longRestPromise = new Promise((resolve, reject) => {
          new RestApplication({ ...config, actor, workflow, resolve, reject}).render(true)
        });
        longRestPromise.then(async (newDay) => {
  
          config.newDay = newDay;
  
          if (workflow._shouldRollForFoodWaterExhaustion()) {
  
            const halfWaterSaveDC = lib.getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);

            [workflow.exhaustionRoll] = await actor.rollSavingThrow({
              ability: "con",
              target: halfWaterSaveDC
            }) ?? [];
            if (!workflow.exhaustionRoll) {
              [workflow.exhaustionRoll] = await actor.rollSavingThrow({
                ability: "con",
                target: halfWaterSaveDC
              }, { configure: false}) ?? [];
            }
          }

          if (Hooks.call("dnd5e.longRest", actor, config) === false) return;
  
          return actor._rest(config);
  
        }, () => {});
      });

      return false;

    })

    Hooks.on("dnd5e.restCompleted", async (actor, results) => {
      await actor.deleteEmbeddedDocuments("Item", results?.deleteItems ?? [], { isRest: true });
      await actor.createEmbeddedDocuments("Item", results?.createItems ?? [], { isRest: true });
      if (game.modules.get("magicitems")?.api && game.modules.get("magicitems").api.execActorLongRest) {
        if (results.type === "long") {
          game.modules.get("magicitems").api.execActorLongRest(actor, results.newDay);
        } else {
          game.modules.get("magicitems").api.execActorShortRest(actor, results.newDay);
        }
      }
    });

    this._setupFoodListeners();

  }

  static async preRestCompleted(actor, results) {
    const workflow = RestWorkflow.get(actor);
    if (workflow) {
      await workflow.patchRestResults(results);
      workflow.updateActorCurrency();
    }
  }

  static ready() {
    Hooks.on("dnd5e.preRestCompleted", (actor, results, config) => {
      const workflow = RestWorkflow.get(actor);
      if (workflow) {
        workflow.patchRestResults(results).then(async () => {
          workflow.updateActorCurrency();
          await actor.update(results.updateData, { isRest: true });
          await actor.updateEmbeddedDocuments("Item", results.updateItems, { isRest: true });

          if (config.advanceTime && (config.duration > 0) && game.user.isGM) await game.time.advance(60 * config.duration);
          if (config.chat) {
            const result = await actor._displayRestResultMessage(config, results);
            const chatMessage = await workflow._displayRestResultMessage(result);
            if (config.request && chatMessage instanceof ChatMessage) {
              await chatMessage.setFlag("dnd5e", "requestResult", { actorId: actor.id, requestId: config.request.id })
            }
          };
          Hooks.callAll("dnd5e.restCompleted", actor, results, config);
        })
      }
      return false;
    });
  }

  static get(actor) {
    return rests.get(actor.uuid);
  }

  static remove(actor) {
    rests.delete(actor.uuid);
  }

  static async make(actor, longRest = false, config = {}) {
    this.remove(actor);
    const workflow = new this(actor, longRest, config);
    rests.set(actor.uuid, workflow);
    return await workflow.setup();
  }

  async setup() {
    await this.fetchHealthData();
    this.fetchFeatures();
    await this.fetchSpellData();
    this.determineSteps();
    return this;
  }

  determineSteps() {
    const hasSpells = Object.values({...this.actor.classes, ...this.actor.subclasses}).some(cls => !['none', 'pact'].includes(cls.system.spellcasting.progression));
    this.steps = [
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.Rest.Title",
        partial: this.longRest ? "long-rest-default" : "short-rest-default",
        required: true,
      },
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.FoodWater.Title",
        partial: "food-water",
        required: lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)
          && (this.foodWaterRequirement.actorRequiredFood > 0 || this.foodWaterRequirement.actorRequiredWater > 0)
          && (lib.getSetting(CONSTANTS.SETTINGS.FOODWATER_PROMPT_NEWDAY) ? this.config.newDay : (this.longRest || this.restVariant === "gritty"))
      },
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.Title",
        partial: "spell-recovery",
        required: hasSpells && this.spellData.missingSlots
          && (
            (!this.longRest && this.spellData.feature)
            ||
            (this.longRest && lib.getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY))
          )
          && !globalThis.getSpellPointsItem?.(this.actor)
      }
    ].filter(step => step.required);
  }

  async fetchHealthData() {

    const actorHasNonLightArmor = !!this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.type?.value) > -1 && item.system.equipped)

    this.healthData = {
      level: this.actor.type === "npc" ? this.actor.system.attributes.hd.max : this.actor.system.details.level,
      startingHitDice: this.actor.system.attributes.hd,
      startingHealth: this.actor.system.attributes.hp.value,
      hitDiceSpent: 0,
      hitPointsToRegainFromRest: 0,
      hitPointsToRegain: 0,
      enableAutoRollHitDice: false,
      hasNonLightArmor: actorHasNonLightArmor && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION),
      removeNonLightArmor: !(actorHasNonLightArmor && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION))
    }

    const longRestRollHitDice = this.longRest && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
    const longRestNotFullHitPoints = longRestRollHitDice && lib.getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.FRACTIONS.FULL;

    if (!this.longRest || longRestRollHitDice || longRestNotFullHitPoints) {
      this.healthData.hitPointsToRegainFromRest = await this._getRestHitPointRecovery();
    }

    this.foodWaterRequirement = lib.getActorConsumableValues(this.actor, this.restVariant === "gritty" && this.longRest);

    this.refreshHealthData();
  }

  refreshHealthData() {
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;

    if (lib.getSetting(CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE)) {
      let avgHitDiceRegain = this.getAverageHitDiceRoll();
      let missingHP = this.maxHP - this.currHP;
      let probableHitDiceLeftToRoll = Math.floor(missingHP / avgHitDiceRegain);

      this.healthData.enableAutoRollHitDice = (this.currHP + this.healthData.hitPointsToRegainFromRest) < this.maxHP
        && probableHitDiceLeftToRoll > 0 && this.healthData.totalHitDice > 0;

    }
  }

  getHitDice() {
    if (this.actor.type === "npc") {
      let denomination = `d${this.actor.system.attributes.hd.denomination}`;
      return {
        [denomination]: this.actor.system.attributes.hd.value
      }
    }
    return this.actor.system.attributes.hd.classes.reduce((hd, item) => {
      const d = item.system.hd;
      const denom = d.denomination;
      let available = d.value;
      if (this.longRest && lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
        const hitDiceBuffer = foundry.utils.getProperty(item, CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG) ?? 0;
        available += hitDiceBuffer;
      }
      hd[denom] = (hd[denom] ?? 0) + available;
      return hd;
    }, {});
  }

  _refreshSlotData() {
    const pointsLeft = this.spellData.pointsTotal - this.spellData.pointsSpent;
    for (let level of Object.keys(this.spellData.slots)) {
      for (let i = 0; i < this.spellData.slots[level].length; i++) {
        const slot = this.spellData.slots[level][i];
        this.spellData.slots[level][i].disabled = slot.alwaysDisabled || (Number(level) > pointsLeft && !slot.checked);
      }
    }
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

    for (let [level, slot] of Object.entries(this.actor.system.spells)) {
      if ((!slot.max && !slot.override) || level === "pact") {
        continue;
      }
      let levelNum = Number(level.slice(5))
      if (!this.longRest && Number(levelNum) > 5) {
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

    if (this.longRest && lib.getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY)) {
      const actorSpecificFormula = this.actor.getFlag("dnd5e", "longRestSpellPointsFormula") || false;
      const formula = actorSpecificFormula || lib.getSetting(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA);
      this.spellData.pointsTotal = (await lib.evaluateFormula(
        formula || "ceil(min(17, @details.level+1)/2)*2",
        this.actor.getRollData(),
        false
      ))?.total + (this.actor.getFlag("dnd5e", "longRestSpellPointsBonus") ?? 0);
      this._refreshSlotData();
      return;
    }

    const wizardLevel = this.actor.items.find(item => {
      return item.type === "class"
        && (item.name === lib.getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true));
    })?.system?.levels || 0;
    const wizardFeature = this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.ARCANE_RECOVERY, true)) || false;
    const wizardBuff = this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.ARCANE_GRIMOIRE, true)) || false;

    const druidLevel = this.actor.items.find(item => {
      return item.type === "class"
        && item.system.levels >= 2
        && (item.name === lib.getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true));
    })?.system?.levels || 0;
    const druidFeature = this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY, true)) ?? false;


    const wizardFeatureUse = wizardLevel && wizardFeature && this.patchSpellFeature(wizardFeature, "wizard");
    const druidFeatureUse = druidLevel && druidFeature && this.patchSpellFeature(druidFeature, "druid");

    if (wizardFeature && (wizardLevel > druidLevel || (druidLevel > wizardLevel && !druidFeatureUse))) {
      this.spellData.hasFeatureUse = wizardFeatureUse;
      this.spellData.feature = wizardFeature;
      this.spellData.pointsTotal = wizardFeature
        ? (await lib.evaluateFormula(wizardFeature.system.activities.getByType("utility")[0]?.roll.formula || "ceil(@classes.wizard.levels/2)", this.actor.getRollData()))?.total
        : 0;
      if (wizardBuff?.system?.attuned) this.spellData.pointsTotal += 1;
      this._refreshSlotData();
      this.spellData.className = lib.getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
    } else if (druidFeature && (druidLevel > wizardLevel || (wizardLevel > druidLevel && !wizardFeatureUse))) {
      this.spellData.hasFeatureUse = druidFeatureUse;
      this.spellData.feature = druidFeature;
      this.spellData.pointsTotal = druidFeature
        ? (await lib.evaluateFormula(druidFeature.system.activities.getByType("utility")[0]?.roll.formula || "ceil(@classes.druid.levels/2)", this.actor.getRollData()))?.total
        : 0;
      this._refreshSlotData();
      this.spellData.className = lib.getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true);
    }

  }

  patchSpellFeature(feature, className) {
    // TODO: Does patching need to happen? Feels risky with recovery activities

    // if (feature &&
    //   (
    //     feature.system.activation.type !== "special" ||
    //     feature.system.uses.value === null ||
    //     feature.system.uses.max === null ||
    //     feature.system.uses.per !== "lr" ||
    //     feature.system.actionType !== "util" ||
    //     feature.system.formula === ""
    //   )
    // ) {
    //   this.actor.updateEmbeddedDocuments("Item", [{
    //     _id: feature.id,
    //     "system.activation.type": "special",
    //     "system.uses.value": feature.system.uses.value ?? 1,
    //     "system.uses.max": 1,
    //     "system.uses.per": "lr",
    //     "system.actionType": "util",
    //     "system.formula": `ceil(@classes.${className.toLowerCase()}.levels/2)`
    //   }]);
    //   ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedRecovery", {
    //     actorName: this.actor.name,
    //     recoveryName: this.spellData.feature.name
    //   }));
    //   return (feature.system.uses.value ?? 1) > 0;
    // }
    let max = feature.system.uses.max;
    let spent = feature.system.uses.spent;
    if (!max) {
      // If not natural recovery, misconfigured
      if (feature.name !== lib.getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY, true)) return false;
      // If natural recovery, grab appropriate activity name
      let activity = feature.system.activities.getName(lib.getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY_ACTIVITY, true));
      max = activity?.uses.max;
      if (!max) return false;
      spent = activity.uses.spent;
    }
    if (typeof max === 'string') max = new Roll(max, feature.getRollData()).evaluateSync().total;

    return spent < max;

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
    let characters = this.config?.options?.actorsToRest?.length
      ? this.config?.options?.actorsToRest.map(uuid => fromUuidSync(uuid))
      : game.actors.filter(actor => actor.type === "character" && actor.hasPlayerOwner);

    for (let actor of characters) {

      // Only consider the actor if it has more than 0 hp, as features cannot be used if they are unconscious
      if (actor.system.attributes.hp.value <= 0) continue;

      if (ignoreInactivePlayers) {
        let found = game.users.find(user => {
          return actor === user.character && user.active;
        })
        if (!found) continue;
      }

      const bardClass = actor.items.find(item => item.type === "class" && item.name === lib.getSetting(CONSTANTS.SETTINGS.BARD_CLASS, true));
      if (bardClass) {
        const songOfRest = actor.items.find(item => item.name.startsWith(lib.getSetting(CONSTANTS.SETTINGS.SONG_OF_REST, true)));
        if (songOfRest) {
          const level = bardClass.system.levels;
          if (level > bardLevel) {
            bardLevel = level;
            this.features.bard = actor;
            this.features.bardFeature = songOfRest;
          }
        }
      }

      const chefFeat = actor.items.find(item => item.name.startsWith(lib.getSetting(CONSTANTS.SETTINGS.CHEF_FEAT, true)));
      const chefTools = lib.getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true) !== "" ? actor.items.find(item => item.name.startsWith(lib.getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true))) : true;
      if (chefFeat && chefTools) {
        if (!this.features.chef) {
          this.features.chef = [];
        }
        this.features.chef.push(actor);
      }

    }

  }

  async autoSpendHitDice() {
    let avgHitDiceRegain = this.getAverageHitDiceRoll();
    let missingHP = this.maxHP - this.currHP;
    let probableHitDiceLeftToRoll = Math.floor(missingHP / avgHitDiceRegain);
    let minSpendHitDice = 0;
    let maxSpendHitDice = Infinity;

    if (this.longRest) {
      const maxHitDiceSpendMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND);
      maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string"
        ? Math.floor((await lib.evaluateFormula(maxHitDiceSpendMultiplier, this.actor.getRollData()))?.total ?? 0)
        : Math.floor(this.actor.system.attributes.hd.max * maxHitDiceSpendMultiplier);
    } else {
      minSpendHitDice = getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0;
      const maxHitDiceSpendMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND);
      maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string"
        ? Math.floor((await lib.evaluateFormula(maxHitDiceSpendMultiplier, this.actor.getRollData()))?.total ?? 0)
        : Math.floor(this.actor.system.attributes.hd.max * maxHitDiceSpendMultiplier);
      maxSpendHitDice = Math.max(minSpendHitDice, maxSpendHitDice);
    }

    // While the character is missing at least 10% of its hp, and we predict we can roll hit dice, and we have some left, roll hit dice
    while (missingHP && probableHitDiceLeftToRoll > 0 && this.healthData.totalHitDice > 0 && avgHitDiceRegain > 0) {
      if (this.healthData.hitDiceSpent >= maxSpendHitDice) break;
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
    const periapt_mod = (periapt && periapt?.system?.attuned) || (blessing && blessing?.type === "feat") ? 3 : 1

    let durable = lib.getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT)
      ? this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true))
      : false;
    durable = durable && durable?.type === "feat";

    let blackBlood = lib.getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE)
      ? this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true))
      : false;
    blackBlood = blackBlood && blackBlood?.type === "feat";

    const conMod = this.actor.system.abilities.con.mod;
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
    const roll = await this.actor.rollHitDie({denomination: hitDice}, { dialog });
    if (!roll) return;
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;
    this.healthData.hitDiceSpent++;

    if (this.longRest) return true;

    let hpRegained = 0;

    if (!this.features.usedBardFeature && this.features.bardFeature) {
      const formula = this.features.bardFeature.system.activities.getByType("heal")[0]?.healing.formula ?? "@scale.bard.song-of-rest";
      const roll = await lib.evaluateFormula(formula, this.features.bard.getRollData());
      hpRegained += roll.total;

      const isOwnBard = this.features.bard === this.actor;
      await roll.toMessage({
        flavor: game.i18n.format("REST-RECOVERY.Chat.SongOfRest" + (isOwnBard ? "Self" : ""), {
          name: this.actor.name,
          bard: this.features.bard.name,
          songOfRestName: lib.getSetting(CONSTANTS.SETTINGS.SONG_OF_REST, true)
        }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });

      if (!getSetting(CONSTANTS.SETTINGS.SONG_OF_REST_MULTIUSE)) this.features.usedBardFeature = true;
    }

    if (this.features.chef.length > 0 && !this.features.usedChef) {

      const chefActor = this.features.chef[Math.floor(Math.random() * this.features.chef.length)];
      const roll = await new Roll('1d8').evaluate();
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
      const curHP = this.actor.system.attributes.hp.value;
      const maxHP = this.maxHP;
      await this.actor.update({ "system.attributes.hp.value": Math.min(maxHP, curHP + hpRegained) })
    }

    return true;

  }

  spendSpellPoint(level, index, add) {
    this.spellData.pointsSpent += Number(level) * (add ? 1 : -1);
    this.spellData.slots[level][index].checked = add;
    this._refreshSlotData();
  }

  async patchRestResults(results) {

    results.deleteItems ??= [];
    results.createItems ??= [];
    const longRest = results.type === "long";

    await this._finishedRest(results);
    await this._getRestHitPointRecovery(results);
    await this._handleExhaustion(results);
    await this._getRestSpellRecovery(results, {longRest});
    await this._getRestItemUsesRecovery(results, {
      recoverLongRestUses: longRest,
      recoverDailyUses: results.newDay,
      rolls: results.rolls
    });
    this._handleFoodAndWaterItems(results);
  }

  async regainHitDice() {

    if (!lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) return;

    this.preRestRegainHitDice = true;
    const maxHitDice = await this._getMaxHitDiceRecovery();
    const hdResult = {};
    this.actor._getRestHitDiceRecovery({ maxHitDice, type: this.longRest ? "long" : "short" }, hdResult);
    const updates = hdResult.updateItems ?? [];
    const actorUpdates = hdResult.updateData;
    const hitDiceRecovered = hdResult.deltas?.hitDice ?? 0;
    this.preRestRegainHitDice = false;

    let hitDiceLeftToRecover = Math.max(0, maxHitDice - hitDiceRecovered);

    if (hitDiceLeftToRecover > 0) {

      const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
        return (parseInt(b.system.hd.denomination.slice(1)) || 0) - (parseInt(a.system.hd.denomination.slice(1)) || 0);
      });

      const biggestClass = sortedClasses[0];

      if (biggestClass) {
        lib.addToUpdates(updates, {
          _id: biggestClass.id,
          [CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG]: hitDiceLeftToRecover
        });
      }
    }

    await this.actor.updateEmbeddedDocuments("Item", updates);
    if (actorUpdates) {
      await this.actor.update(actorUpdates);
    }

    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;

  }

  async updateActorCurrency() {
    if (this.foodAndWaterCost == 0) return;
    let remainingCost = this.foodAndWaterCost;
    let actorCurrency = foundry.utils.deepClone(this.actor.system.currency);
    let currencyArray = Object.entries(CONFIG.DND5E.currencies).map(i => ({abbr: i[0], conv: i[1].conversion})).filter(i => i.conv).sort((a,b) => b.conv - a.conv)
    let requiredCurrency = []
    for (let i = currencyArray.length - 1; i >= 0; i--) {
      requiredCurrency.unshift(Math.floor(remainingCost * currencyArray[i].conv));
      remainingCost = (remainingCost - (requiredCurrency[0] / currencyArray[i].conv));
    }

    for (let i = 0; i < currencyArray.length; i++) {
      while (actorCurrency[currencyArray[i].abbr] < requiredCurrency[i] && (currencyArray.slice(0,i).reduce((acc,currCurrency) => acc + actorCurrency[currCurrency.abbr] / currCurrency.conv, 0) >= (1/currencyArray[i].conv))) {
        for (let j = i - 1; j >= 0; j--) {
          if (actorCurrency[currencyArray[j].abbr] / currencyArray[j].conv >= (1 / currencyArray[j + 1].conv)) {
            actorCurrency[currencyArray[j].abbr] -= (currencyArray[j].conv / currencyArray[j + 1].conv);
            actorCurrency[currencyArray[j + 1].abbr] += 1;
            break;
          }
        }
      }
      if (actorCurrency[currencyArray[i].abbr] < requiredCurrency[i]) {
        for (let j = i + 1; j < currencyArray.length; j++) {
          if (actorCurrency[currencyArray[j].abbr]) {
            for (let k = j; k > i; k--) {
              actorCurrency[currencyArray[k].abbr] -= 1;
              actorCurrency[currencyArray[k - 1].abbr] += currencyArray[k - 1].conv / currencyArray[k].conv;
            }
            break;
          }
        }
      }
      actorCurrency[currencyArray[i].abbr] -= requiredCurrency[i];
    }
    return await this.actor.update({"system.currency": actorCurrency});
  }

  async _finishedRest(results) {

    const maxShortRests = lib.getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS) || 0;
    if (maxShortRests > 0) {
      if (this.longRest) {
        results.updateData[CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS] = 0;
      } else {
        const currentShortRests = foundry.utils.getProperty(this.actor, CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS) || 0;
        results.updateData[CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS] = currentShortRests + 1;
      }
    }

    if (this.longRest) {

      for(let i = results.updateItems.length-1; i >= 0; i--){
        if(Object.keys(results.updateItems[i]).includes("system.hd.spent")){
          results.updateItems.splice(i, 1);
        }
      }

      const maxHitDice = await this._getMaxHitDiceRecovery();
      const hdResult = {};
      this.actor._getRestHitDiceRecovery({ maxHitDice, type: "long" }, hdResult);
      const updates = hdResult.updateItems ?? [];
      const actorUpdates = hdResult.updateData;
      const hitDiceRecovered = hdResult.deltas?.hitDice ?? 0;

      updates.forEach(update => lib.addToUpdates(results.updateItems, update));

      if (this.healthData.hitDiceSpent > 0 && hitDiceRecovered === 0 && lib.getSetting(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE)) {

        this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.PreventedHitDiceRecovery");

      } else if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE)) {
        const armor = this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.type?.value) > -1 && item.system.equipped);
        if (armor) {
          if (!this.healthData.removeNonLightArmor) {
            if (maxHitDice === 0) {
              this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.NoHitDiceArmor");
            } else if (hitDiceRecovered) {
              this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.HitDiceArmor");
            }
          } else {
            this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.HitDiceNoArmor");
          }
        }
      }
      // Resourceful
      const resourceful = this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.RESOURCEFUL, true)) || false;
      if (resourceful && this.actor.type === "character" && !this.actor.system.attributes.inspiration) {
        foundry.utils.setProperty(results, "updateData.system.attributes.inspiration", true);
      }
      if (actorUpdates) {
        await this.actor.update(actorUpdates);
      }
      foundry.utils.setProperty(results, 'deltas.hitDice', hitDiceRecovered);
      // TODO: remove this when system stops looking for it
      foundry.utils.setProperty(results, 'dhd', hitDiceRecovered);
    }


  }

  _shouldRollForFoodWaterExhaustion() {

    if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return false;
    
    if (!lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION)) return false;

    if (lib.getSetting(CONSTANTS.SETTINGS.FOODWATER_PROMPT_NEWDAY)) {
      if (!this.config.newDay) return false;
    } else if (!(this.longRest || this.restVariant === "gritty")) {
      return false;
    }

    const halfWaterSaveDC = lib.getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);

    if (!halfWaterSaveDC) return false;

    let {
      actorRequiredWater,
      actorWaterSatedValue
    } = lib.getActorConsumableValues(this.actor, this.restVariant === "gritty" && this.longRest);

    if (!actorRequiredWater) return false;

    if (this.consumableData.hasAccessToWater) {

      actorWaterSatedValue += this.consumableData.halfWater === "full"
        ? actorRequiredWater
        : actorRequiredWater / 2;

    } else {

      const items = this.consumableData.items.filter(item => item.amount);
      let waterItems = items.filter(item => item.type === "both" || item.type === "water");

      actorWaterSatedValue = waterItems.reduce((acc, item) => {
        acc += item.consumable.dayWorth ? actorRequiredWater : item.amount;
        return acc;
      }, actorWaterSatedValue);

    }

    actorWaterSatedValue = Math.min(actorRequiredWater, actorWaterSatedValue);

    if (actorWaterSatedValue >= actorRequiredWater) return false;

    return actorWaterSatedValue >= (actorRequiredWater / 2);

  }

  async _handleExhaustion(results) {
    let foodWaterPromptNewday = lib.getSetting(CONSTANTS.SETTINGS.FOODWATER_PROMPT_NEWDAY);
    let automateFoodwaterExhaustion = lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION);
    let shouldDoFoodWater =
      (this.longRest && // Long rest:
        ((foodWaterPromptNewday && this.config.newDay) || // Prompt new day & is new day?
        !foodWaterPromptNewday) // No prompt new day - default is yes
      ) ||
      (!this.longRest && // Short rest:
        (foodWaterPromptNewday && this.config.newDay) // Prompt new day & is new day
      );

    if (!(this.longRest || this.restVariant === "gritty") && !shouldDoFoodWater) return;

    let actorInitialExhaustion = foundry.utils.getProperty(this.actor, "system.attributes.exhaustion") ?? 0;
    let actorExhaustion = actorInitialExhaustion;
    let exhaustionGain = false;
    let exhaustionSave = false;
    let exhaustionDelta = CONFIG.DND5E.restTypes[results.type]?.exhaustionDelta ?? 0;

    if (lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && this.config.dialog && shouldDoFoodWater) {

      let {
        actorRequiredFood,
        actorRequiredWater,
        actorFoodSatedValue,
        actorWaterSatedValue
      } = lib.getActorConsumableValues(this.actor, this.restVariant === "gritty" && this.longRest);

      let actorDaysWithoutFood = foundry.utils.getProperty(this.actor, CONSTANTS.FLAGS.STARVATION) ?? 0;

      const items = this.consumableData.items.filter(item => item.amount);
      let foodItems = items.filter(item => item.type === "both" || item.type === "food");
      let waterItems = items.filter(item => item.type === "both" || item.type === "water");

      if (actorRequiredFood) {

        let localize = "REST-RECOVERY.Chat.Food"

        let actorExhaustionThreshold = (await lib.evaluateFormula(
          lib.getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER),
          this.actor.getRollData()
        ))?.total ?? 4;

        if (this.consumableData.hasAccessToFood) {

          if (actorFoodSatedValue >= (actorRequiredFood / 2)) {
            localize += actorFoodSatedValue >= actorRequiredFood ? "Full" : "Half";
          } else {
            localize += "None";
          }

          localize += lib.capitalizeFirstLetter(this.consumableData.halfFood);

          actorFoodSatedValue += this.consumableData.halfFood === "full"
            ? actorRequiredFood
            : actorRequiredFood / 2;

        } else {

          actorFoodSatedValue += foodItems.reduce((acc, item) => {
            acc += item.consumable.dayWorth ? 100000000000 : item.amount;
            return acc;
          }, actorFoodSatedValue);

          if (actorFoodSatedValue >= (actorRequiredFood / 2)) {
            localize += actorFoodSatedValue >= actorRequiredFood ? "Full" : "Half";
          } else {
            localize += "None";
          }

          localize += "None";
        }

        this.foodAndWaterMessage.push(game.i18n.localize(localize));

        actorFoodSatedValue = Math.min(actorRequiredFood, actorFoodSatedValue);

        if (automateFoodwaterExhaustion) {

          if (actorFoodSatedValue <= (actorRequiredFood / 2)) {
            exhaustionDelta = 0;
            actorDaysWithoutFood += actorFoodSatedValue === 0 ? 1 : 0.5;
          } else {
            actorDaysWithoutFood = 0;
          }

          if (actorDaysWithoutFood > actorExhaustionThreshold) {
            actorExhaustion++;
            exhaustionGain = true;
          }

          results.updateData[CONSTANTS.FLAGS.STARVATION] = actorDaysWithoutFood;

        }

      }

      if (actorRequiredWater) {

        let localize = "REST-RECOVERY.Chat.Water"

        if (this.consumableData.hasAccessToWater) {

          if (actorWaterSatedValue >= (actorRequiredWater / 2)) {
            localize += actorWaterSatedValue >= actorRequiredWater ? "Full" : "Half"
          } else {
            localize += "None"
          }

          localize += lib.capitalizeFirstLetter(this.consumableData.halfWater);

          actorWaterSatedValue += this.consumableData.halfWater === "full"
            ? actorRequiredWater
            : actorRequiredWater / 2;

        } else {

          actorWaterSatedValue = waterItems.reduce((acc, item) => {
            acc += item.consumable.dayWorth ? actorRequiredWater : item.amount;
            return acc;
          }, actorWaterSatedValue);

          if (actorWaterSatedValue >= (actorRequiredWater / 2)) {
            localize += actorWaterSatedValue >= actorRequiredWater ? "Full" : "Half"
          } else {
            localize += "None"
          }

          localize += "None";

        }

        this.foodAndWaterMessage.push(game.i18n.localize(localize));

        actorWaterSatedValue = Math.min(actorRequiredWater, actorWaterSatedValue);

        if (actorWaterSatedValue < actorRequiredWater && automateFoodwaterExhaustion) {
          if (actorWaterSatedValue < (actorRequiredWater / 2)) {
            actorExhaustion += actorExhaustion > 0 ? 2 : 1;
            exhaustionGain = true;
            exhaustionDelta = 0;
          } else {
            const halfWaterSaveDC = lib.getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
            if (halfWaterSaveDC) {
              exhaustionDelta = 0;
              if (this.exhaustionRoll.total < halfWaterSaveDC) {
                actorExhaustion += actorExhaustion > 0 ? 2 : 1;
                exhaustionGain = true;
              } else {
                exhaustionSave = true;
              }
            }
          }
        }
      }

      results.updateData[CONSTANTS.FLAGS.SATED_FOOD] = 0;
      results.updateData[CONSTANTS.FLAGS.SATED_WATER] = 0;

    }

    if ((this.longRest || (shouldDoFoodWater && automateFoodwaterExhaustion))) {

      if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_EXHAUSTION) && actorExhaustion > 0) {
        const armor = this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.type?.value) > -1 && item.system.equipped);
        if (armor && !this.healthData.removeNonLightArmor) {
          exhaustionDelta = 0;
          this.foodAndWaterMessage.push(game.i18n.localize("REST-RECOVERY.Chat.ExhaustionArmor"));
        }
      }

      if (lib.getSetting(CONSTANTS.SETTINGS.PREVENT_LONG_REST_EXHAUSTION_RECOVERY)) {
        exhaustionDelta = 0;
      }

      if (foundry.utils.getProperty(this, CONSTANTS.FLAGS.DAE.PREVENT_EXHAUSTION_RECOVERY) && !this.config.ignoreFlags) {
        exhaustionDelta = 0;
      }

      if (exhaustionGain) {
        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.Exhaustion", {
          exhaustion: actorExhaustion - actorInitialExhaustion
        }));
      } else if (exhaustionSave) {
        this.foodAndWaterMessage.push(game.i18n.localize("REST-RECOVERY.Chat.NoExhaustion"));
      }

      const maxExhaustion = CONFIG.DND5E.conditionTypes.exhaustion.levels ?? 6;

      results.updateData['system.attributes.exhaustion'] = Math.clamp(actorExhaustion + exhaustionDelta, 0, maxExhaustion);

      if (results.updateData['system.attributes.exhaustion'] === maxExhaustion) {
        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.ExhaustionDeath", {
          actorName: this.actor.name,
          max_levels: maxExhaustion
        }));
      }
    }

    if (this.foodAndWaterMessage.length) {
      this.foodAndWaterMessage = this.foodAndWaterMessage.map(str => (`<p>${str}</p>`));
    }

  }

  async _displayRestResultMessage(chatMessage) {
    if (!this.longRest && lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_HP_MULTIPLIER) && !this.healthData.hitDiceSpent && this.healthRegained > 0) {
      chatMessage.content = game.i18n.format('REST-RECOVERY.Chat.AlternateShortRestResult', {name: this.actor.name, health: this.healthRegained});
    }
    const newDeltas = chatMessage.system.deltas;
    if (newDeltas.actor?.length) {
      newDeltas.actor = newDeltas.actor.filter(d => !d.keyPath?.startsWith(`flags.${CONSTANTS.MODULE_NAME}`));
    }
    const flavor = getRestFlavor(this.config.duration, this.config.newDay, this.longRest);

    let extra = '';
    if (this.foodAndWaterMessage.length) {
      extra += this.foodAndWaterMessage.join("");
    }

    let newChatMessageContent = `<p>${chatMessage.content}${this.hitDiceMessage ? " " + this.hitDiceMessage : ""}</p>` + extra;

    if (lib.getSetting(CONSTANTS.SETTINGS.ENABLE_CALENDARIA_NOTES) && (this.config.request || lib.getSetting(CONSTANTS.SETTINGS.CALENDARIA_NOTES_ONLY_PROMPTED)) && CALENDARIA) {
      const endDateTimestamp = game.time.worldTime;
      const restDuration = this.config.duration;
      const startDateTimestamp = (this.config.request || this.config.advanceTime) ? endDateTimestamp - (restDuration * 60) : endDateTimestamp;

      let deltas = dnd5e.dataModels.chatMessage.fields.ActorDeltasField.processDeltas.call(chatMessage.system.deltas, this.actor, chatMessage.rolls);

      let noteContent = newChatMessageContent;
      if (deltas.length) {
        noteContent += `
          <strong>${game.i18n.localize("DND5E.CHATMESSAGE.Deltas.Recovery")}</strong>
          <ul class="unlist">
            ${deltas.map(i => `
              <li>
                <span class="label">${i.label}</span>
                <span class="value">${i.delta}</span>
              </li>
            `).join('')}
          </ul>
        `;
      }

      await CALENDARIA.api.createNote({
        name: `${game.i18n.localize(`REST-RECOVERY.Dialogs.PromptRest.${this.longRest ? 'Long' : 'Short'}`)}: ${this.actor.name}`,
        content: noteContent,
        startDate: CALENDARIA.api.timestampToDate(startDateTimestamp),
        endDate: CALENDARIA.api.timestampToDate(endDateTimestamp),
        allDay: false,
        openSheet: false
      });
    }

    await chatMessage.update({
      flavor,
      content: newChatMessageContent,
      system: {
        deltas: newDeltas
      }
    }).then(() => {
      ui.chat.scrollBottom();
    });

    return chatMessage;
  }

  async _getRestHitPointRecovery(results = { updateData: {}, deltas: {hitPoints: 0} }) {

    const maxHP = this.maxHP;
    const currentHP = this.actor.system.attributes.hp.value;

    const multiplier = lib.determineMultiplier(this.longRest ? CONSTANTS.SETTINGS.HP_MULTIPLIER : CONSTANTS.SETTINGS.SHORT_HP_MULTIPLIER);

    results.hitPointsToRegainFromRest = typeof multiplier === "string"
      ? Math.floor((await lib.evaluateFormula(multiplier, this.actor.getRollData()))?.total)
      : Math.floor(maxHP * multiplier);

    results.updateData["system.attributes.hp.value"] = Math.min(this.maxPossibleHP, currentHP + results.hitPointsToRegainFromRest);
    results.hitPointsRecovered = results.updateData["system.attributes.hp.value"] - this.healthData.startingHealth;

    foundry.utils.setProperty(results, 'deltas.hitPoints', results.hitPointsRecovered);
    // TODO: remove this when system stops looking for it
    foundry.utils.setProperty(results, 'dhp', results.hitPointsRecovered);

    return results.hitPointsToRegainFromRest;

  }

  async _getMaxHitDiceRecovery({ maxHitDice = undefined } = {}) {

    if (!this.preRestRegainHitDice && lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) return 0;

    let multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
    let roundingMethod = lib.determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
    const actorLevel = this.actor.system.attributes.hd.max;

    if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE)) {
      const armor = this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.type?.value) > -1 && item.system.equipped);
      if (armor && !this.healthData.removeNonLightArmor) {
        multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE);
        roundingMethod = lib.determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
      }
    }

    if (typeof multiplier === "string") {

      const customRegain = (await lib.evaluateFormula(multiplier, this.actor.getRollData()))?.total;
      maxHitDice = Math.clamp(roundingMethod(customRegain), 0, maxHitDice ?? actorLevel);

    } else {

      maxHitDice = Math.clamp(
        roundingMethod(actorLevel * multiplier),
        multiplier ? 1 : 0,
        maxHitDice ?? actorLevel
      );

    }

    if (!lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
      const maximumHitDiceToRecover = Number(Object.values(this.actor.classes).reduce((acc, cls) => {
        acc += cls.system?.hd?.spent ?? 0;
        return acc;
      }, 0));
      maxHitDice = Math.min(maximumHitDiceToRecover, maxHitDice);
    }

    if (this.healthData.hitDiceSpent > 0 && lib.getSetting(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE)) {
      maxHitDice = 0;
    }

    return maxHitDice;

  }

  async _getRestSpellRecovery(results, { longRest = true } = {}) {

    const customSpellRecovery = lib.getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY) && this.config.dialog;
    let actorRollData = this.actor.getRollData();

    const spellMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS[`${longRest ? "LONG" : "SHORT"}_SPELLS_MULTIPLIER`]);
    const pactMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS[`${longRest ? "LONG" : "SHORT"}_PACT_SPELLS_MULTIPLIER`])

    for (let [level, slot] of Object.entries(this.actor.system.spells)) {
      if (!slot.override && !slot.max) continue;
      let multiplier = level === "pact" ? pactMultiplier : spellMultiplier;
      if (level !== "pact" && customSpellRecovery) {
        results.updateData[`system.spells.${level}.value`] = slot.value;
        continue;
      }
      let spellMax = slot.override || slot.max;
      let recoverSpells = typeof multiplier === "string"
        ? Math.max((await lib.evaluateFormula(multiplier, { ...actorRollData, slot: foundry.utils.deepClone(slot) }))?.total, 1)
        : Math.max(Math.floor(spellMax * multiplier), multiplier ? 1 : multiplier);
      results.updateData[`system.spells.${level}.value`] = Math.min(slot.value + recoverSpells, spellMax);
    }

    if ((!this.longRest && this.spellData.feature) || (this.longRest && customSpellRecovery)) {

      if (!foundry.utils.isEmpty(this.recoveredSlots)) {

        for (const [slot, num] of Object.entries(this.recoveredSlots)) {
          const prop = `system.spells.spell${slot}.value`;
          results.updateData[prop] = (results.updateData[prop] || foundry.utils.getProperty(this.actor, prop) || 0) + num;
        }
      }

    }

  }

  async _getRestItemUsesRecovery(results, args) {

    await this._recoverItemsUses(results, args);

    if (!this.longRest && this.spellData.pointsSpent && this.spellData.feature) {
      let max = this.spellData.feature.system.uses.max;
      let updateString = "system.uses.spent";
      if (!max) {
        if (this.spellData.feature.name === lib.getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY, true)) {
          let activity = this.spellData.feature.system.activities.getName(lib.getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY_ACTIVITY, true));
          max = activity?.uses.max;
          updateString = `system.activities.${activity.id}.uses.spent`;
        }
      }
      if (typeof max === 'string' && max.length) max = new Roll(max, this.spellData.feature.getRollData()).evaluateSync().total;
      lib.addToUpdates(results.updateItems, {
        _id: this.spellData.feature.id,
        [updateString]: max
      })
    }

    if (this.longRest && lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
      Object.values(this.actor.classes).forEach(cls => {
        lib.addToUpdates(results.updateItems, {
          _id: cls.id,
          [CONSTANTS.FLAGS.REMOVE_HIT_DICE_BUFFER_FLAG]: null
        });
      })
    }

  }

  async _recoverItemsUses(results, args) {

    const { recoverLongRestUses, recoverDailyUses, rolls } = args;

    const longFeatsMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER);
    const longOthersMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER);

    const shortFeatsMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER);
    const shortOthersMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER);

    const dailyMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER);

    const actorRollData = this.actor.getRollData();

    const trueFeatsMultiplier = recoverLongRestUses ? longFeatsMultiplier : shortFeatsMultiplier;
    const trueOthersMultiplier = recoverLongRestUses ? longOthersMultiplier : shortOthersMultiplier;

    const recoveryPeriods = ["sr", "recharge"];
    if (recoverLongRestUses) recoveryPeriods.unshift("lr");
    if (recoverDailyUses) recoveryPeriods.unshift("day", "dawn", "dusk"); // TODO: see about dawn/dusk SC integration

    for (const item of this.actor.items) {
      if (item.system.uses) {
        const recoveryActivities = item.system.uses.recovery.map(act => act.period);
        await this._recoverItemUse(actorRollData, recoveryPeriods, results.updateItems, item, recoveryActivities.includes("day") ? dailyMultiplier : (item.type === "feat" ? trueFeatsMultiplier : trueOthersMultiplier), rolls);
      }
    }

  }

  async _recoverItemUse(actorRollData, recoveryPeriods, updateItems, item, multiplier = 1.0, rolls) {

    let usesMax = item.system.uses.max;
    if (typeof usesMax === 'string') {
      if (!usesMax.length) return;
      usesMax = new Roll(usesMax, item.getRollData()).evaluateSync().total;
    }
    const oldSpent = item.system.uses.spent;

    if (foundry.utils.getType(item.system.recoverUses) !== "function") return;
    actorRollData.item = {...item.system}
    let profile;
    findPeriod: {
      for (const period of recoveryPeriods) {
        for (const recovery of item.system.uses.recovery) {
          if (recovery.period === period) {
            profile = recovery;
            break findPeriod;
          }
        }
      }
    }
    if (!profile) return;

    let itemUpdates = {};
    let recoverAmount;
    let numDays = Math.floor(this.config.duration / 1440);
    let numDaysMult = ["day", "dawn", "dusk"].includes(profile.period) ? Math.max(1, numDays) : 1;
    let newSpent = oldSpent;
    if (profile.type === "recoverAll") {
      recoverAmount = Math.floor(multiplier * usesMax * numDaysMult);
      newSpent = Math.clamp(oldSpent - recoverAmount, 0, usesMax);
    } else if (profile.type === "loseAll") {
      newSpent = usesMax;
    } else if (profile.formula) {
      let roll = new dnd5e.dice.BasicRoll(profile.formula, actorRollData);
      roll.options.delta = {
        item: item.id,
        keyPath: "system.uses.spent"
      };
      roll.alter(numDaysMult, 0, {multiplyNumeric: true});
      recoverAmount = Math.floor(multiplier * (await roll.evaluate()).total);
      newSpent = Math.clamp(oldSpent - recoverAmount, 0, usesMax);
      if (rolls.length) rolls[0] = roll;
      else rolls.push(roll);
    }

    if ((newSpent !== oldSpent) || updateItems.find((i => i._id === item.id))) foundry.utils.mergeObject(itemUpdates, {"system.uses.spent": newSpent});

    lib.addToUpdates(updateItems, {
      _id: item.id,
      ...itemUpdates
    });

  }

  _handleFoodAndWaterItems(results) {

    if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;

    if (lib.getSetting(CONSTANTS.SETTINGS.FOODWATER_PROMPT_NEWDAY)) {
      if (!this.config.newDay) return;
    } else if (!(this.longRest || this.restVariant === "gritty")) {
      return;
    }

    const {
      actorRequiredFood,
      actorRequiredWater
    } = lib.getActorConsumableValues(this.actor, this.restVariant === "gritty" && this.longRest);

    if ((!actorRequiredFood && !actorRequiredWater) || !this.consumableData.items.length) return;

    const createItems = {};

    for (const consumableData of this.consumableData.items) {

      const item = consumableData.item;

      let updateIndex = results.updateItems.findIndex(update => update._id === item.id);
      let update = results.updateItems[updateIndex] ?? {
        _id: item.id
      };

      // TOOD: Does this need accounting for a dynamic max uses? Can't think of when food/water would have dynamic maxes...
      const maxUses = foundry.utils.getProperty(update, "system.uses.max") ?? foundry.utils.getProperty(item, "system.uses.max") ?? 1;
      const currentSpent = foundry.utils.getProperty(update, "system.uses.spent") ?? foundry.utils.getProperty(item, "system.uses.spent") ?? 0;
      const currentQuantity = foundry.utils.getProperty(update, "system.quantity") ?? foundry.utils.getProperty(item, "system.quantity");
      const consumeQuantity = foundry.utils.getProperty(item, 'system.uses.autoDestroy') ?? false;

      if(consumeQuantity) {

        const currentTotalUses = ((maxUses * currentQuantity) - currentSpent);
        const newTotalUses = currentTotalUses - consumableData.amount;

        const totalQuantityLeft = newTotalUses / maxUses;
        const fractionLeft = totalQuantityLeft - Math.floor(totalQuantityLeft);
        let usesLeft = maxUses;
        if (fractionLeft > 0) {
          usesLeft = Math.max(1, Math.round(maxUses * fractionLeft));
        }

        if ((totalQuantityLeft <= 0 || (totalQuantityLeft === 1 && usesLeft <= 0))) {

          if (!results.deleteItems.includes(consumableData.id)) {
            results.deleteItems.push(consumableData.id);
          }

        } else {

          update["system.quantity"] = Math.ceil(totalQuantityLeft);
          update["system.uses.spent"] = maxUses - usesLeft;

        }

      }else{

        update["system.uses.spent"] = Math.min(maxUses, currentSpent + consumableData.amount);

      }

      if (updateIndex > -1) {
        results.updateItems.splice(updateIndex, 1);
      }

      results.updateItems.push(update);

    }
  }

  static _setupFoodListeners() {

    Hooks.on("dnd5e.activityConsumption", (activity) => {
      if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
      if (!activity?.item) return;
      const item = activity.item;
      if (!CONSTANTS.CONSUMABLE_TYPES.includes(item.system.type?.subtype)) return;
      let consumeFull = true;
      // const element = app.element.find('input[name="consumeAmount"]:checked');
      // if (element.length) {
      //   consumeFull = element.val() === "full";
      // }
      this.itemsListened.set(item.id, consumeFull);
      setTimeout(() => {
        this.itemsListened.delete(item.id)
      }, 150);
    });

    Hooks.on('preUpdateItem', (item, data) => {
      if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
      if (CONSTANTS.CONSUMABLE_TYPES.includes(data.system?.type?.subtype) && !lib.isRealNumber(foundry.utils.getProperty(item, "system.uses.max"))) {
        return this._patchConsumableItem(item, data);
      }
      if (!this.itemsListened.has(item.id)) return;
      if (!CONSTANTS.CONSUMABLE_TYPES.includes(item.system.type?.subtype)) return;
      return this._handleConsumableItem(item, data, this);
    });

    Hooks.on('deleteItem', (item, data) => {
      if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
      if (!this.itemsListened.has(item.id)) return;
      if (!CONSTANTS.CONSUMABLE_TYPES.includes(item.system.type?.subtype)) return;
      return this._handleConsumableItem(item, data, this);
    })
  }

  static async patchAllConsumableItems(actor) {
    const potentialItems = ["Rations", "Rations (1 day)", "Waterskin", "Water (Pint)"]
    const items = actor.items.filter(item => potentialItems.includes(item.name) && item.type !== "container" && !CONSTANTS.CONSUMABLE_TYPES.includes(foundry.utils.getProperty(item, "system.type.subtype")));

    const updates = items.map(item => {
      const currUpdates = {
        "_id": item.id,
        "system.uses.spent": foundry.utils.getProperty(item, "system.uses.spent") ?? 0,
        "system.uses.max": foundry.utils.getProperty(item, "system.uses.max") ?? 1,
        "system.type.value": "food",
        [CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH]: false
      }
      if (item.name.startsWith("Rations")) {
        currUpdates["system.type.subtype"] = CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD;
      } else {
        currUpdates["system.type.subtype"] = CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER;
      }

      return currUpdates;
    });

    if (updates.length) {
      ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedConsumable", {
        itemName: [...new Set(items.map(item => item.name))].join(', ')
      }));
    }

    return actor.updateEmbeddedDocuments("Item", updates);

  }

  static _patchConsumableItem(item, updates) {
    if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
    updates["system.uses.spent"] = 0;
    updates["system.uses.max"] = 1;
    ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedConsumable", {
      itemName: item.name
    }));
  }

  static _consumableItemHelper(item, data, workflow, consumingActor) {
    if (!workflow) workflow = this;
    if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return [];

    const consumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);

    const actorUpdates = {};

    let {
      actorRequiredFood,
      actorRequiredWater,
      actorFoodSatedValue,
      actorWaterSatedValue
    } = lib.getActorConsumableValues(consumingActor, workflow.restVariant === "gritty" && workflow.longRest);

    const oldSpent = foundry.utils.getProperty(item, "system.uses.spent");
    const newSpent = foundry.utils.getProperty(data, "system.uses.spent");
    const oldQuantity = foundry.utils.getProperty(item, "system.quantity");
    const newQuantity = foundry.utils.getProperty(data, "system.quantity");
    let chargesUsed = newSpent > oldSpent ? newSpent - oldSpent : oldQuantity - newQuantity;
    if (isNaN(chargesUsed)) chargesUsed = 1;

    let message;

    if (item.system.type?.subtype === "both") {

      actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? actorFoodSatedValue : actorFoodSatedValue + chargesUsed;
      actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? actorWaterSatedValue : actorWaterSatedValue + chargesUsed;

      const localize = "REST-RECOVERY.Chat.ConsumedBoth" + (consumable.dayWorth ? "DayWorth" : "")
      message = "<p>" + game.i18n.format(localize, {
        actorName: consumingActor.name,
        itemName: item.name,
        charges: chargesUsed
      }) + "</p>";

      if (!consumable.dayWorth) {
        message += actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] >= actorRequiredFood
          ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedFood") + "</p>"
          : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedFood", { units: actorRequiredFood - actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] }) + "</p>"
        message += actorUpdates[CONSTANTS.FLAGS.SATED_WATER] >= actorRequiredWater
          ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedWater") + "</p>"
          : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedWater", { units: actorRequiredWater - actorUpdates[CONSTANTS.FLAGS.SATED_WATER] }) + "</p>"
      }

    } else if (item.system.type?.subtype === "food") {

      actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? 100000000000 : actorFoodSatedValue + chargesUsed;

      const localize = "REST-RECOVERY.Chat.ConsumedFood" + (consumable.dayWorth ? "DayWorth" : "")
      message = "<p>" + game.i18n.format(localize, {
        actorName: consumingActor.name,
        itemName: item.name,
        charges: chargesUsed
      }) + "</p>";

      message += actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] >= actorRequiredFood
        ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedFood") + "</p>"
        : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedFood", { units: actorRequiredFood - actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] }) + "</p>"

    } else if (item.system.type?.subtype === "water") {

      actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? 100000000000 : actorWaterSatedValue + chargesUsed;

      const localize = "REST-RECOVERY.Chat.ConsumedWater" + (consumable.dayWorth ? "DayWorth" : "")
      message = "<p>" + game.i18n.format(localize, {
        actorName: consumingActor.name,
        itemName: item.name,
        charges: chargesUsed
      }) + "</p>";

      message += actorUpdates[CONSTANTS.FLAGS.SATED_WATER] >= actorRequiredWater
        ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedWater") + "</p>"
        : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedWater", { units: actorRequiredWater - actorUpdates[CONSTANTS.FLAGS.SATED_WATER] }) + "</p>"
    }
    return [actorUpdates, message];
  }

  static _handleConsumableItem(item, data, workflow, consumingActor) {
    if (!consumingActor) consumingActor = item.parent;

    let [actorUpdates, message] = this._consumableItemHelper(item, data, workflow, consumingActor);

    if (!foundry.utils.isEmpty(actorUpdates)) {
      consumingActor.update(actorUpdates);
    }

    if (message) {
      setTimeout(() => {
        ChatMessage.implementation.create({
          flavor: "Rest Recovery",
          user: game.user.id,
          speaker: ChatMessage.getSpeaker({ actor: consumingActor }),
          content: message,
        });
      }, 1000)
    }

  }

}
