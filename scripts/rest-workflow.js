import CONSTANTS from "./constants.js";
import * as lib from "./lib/lib.js";
import { custom_warning, getSetting } from "./lib/lib.js";
import plugins from "./plugins.js";
import FoodWater from "./formapplications/rest-steps/FoodWater.svelte";
import SpellRecovery from "./formapplications/rest-steps/SpellRecovery.svelte";
import LongRestDialog from "./formapplications/long-rest/long-rest.js";
import ShortRestDialog from "./formapplications/short-rest/short-rest.js";
import RestPromptDialog from "./formapplications/prompt-rest/prompt-rest.js";

const rests = new Map();

export default class RestWorkflow {

  static itemsListened = new Map()

  constructor(actor, longRest, config = {}) {
    this.actor = actor;
    this.longRest = longRest;
    this.finished = false;
    this.preRestRegainHitDice = false;
    this.newExhaustionValue = false;
    this.restVariant = getSetting(CONSTANTS.SETTINGS.REST_VARIANT);

    this.spellSlotsRegainedMessage = "";
    this.hitDiceMessage = "";
    this.itemsRegainedMessages = [];
    this.resourcesRegainedMessages = [];
    this.foodAndWaterMessage = [];
    this.steps = [];
    this.config = config;
    this.exhaustionRoll = false;

    this.consumableData = { items: [] };
    this.foodAndWaterCost = 0;
  }

  static get LongRestItemNameHandlers() {
    return {
      [lib.getSetting(CONSTANTS.SETTINGS.POWER_SURGE, true)]: "_handlePowerSurgeFeature"
    }
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
    return this.actor.type === 'npc' ? this.actor.system.attributes.hd.value : this.actor.system.attributes.hd;
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
      if (!lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) return;
      const rest = RestWorkflow.get(actor);
      const exhaustion = rest?.newExhaustionValue ?? foundry.utils.getProperty(data, "system.attributes.exhaustion");
      if (exhaustion === undefined) return;
      return plugins.handleExhaustion(actor, data);
    });

    let cachedDenomination = false;
    Hooks.on("dnd5e.preRollHitDie", (actor, config, denomination) => {

      if (RestWorkflow.get(actor)) {
        cachedDenomination = denomination;
      }

      const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM)
        ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true))
        : false;
      const blessing = getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING)
        ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true))
        : false;
      const hasWoundClosure = (periapt && (foundry.utils.isNewerVersion("3.2.0", game.system.version) ? (periapt?.system?.attunement === 2) : periapt?.system?.attuned)) || (blessing && blessing?.type === "feat");
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

      config.formula = `max(0, ${formula})`;

      if (hasWoundClosure && multiplyTotal) {
        config.formula = `(${formula})*2`;
      }

      if (hdMult !== 1 && multiplyTotal) {
        config.formula = `floor((${formula})*${hdMult})`;
      }

    });

    Hooks.on("dnd5e.rollHitDie", (actor, roll, updates) => {

      const workflow = RestWorkflow.get(actor);
      if (!workflow) return;

      const denomination = cachedDenomination;

      const hitDice = updates.class?.["system.hitDiceUsed"] - 1;

      const clsItem = actor.items.find(i => {
        return i.system.hitDice === denomination && i.system.hitDiceUsed === hitDice;
      });

      if (!clsItem) return;

      const bufferDice = foundry.utils.getProperty(clsItem, CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG);

      if ((bufferDice ?? 0) > 0) {
        delete updates.class["system.hitDiceUsed"];
        updates.class[CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG] = bufferDice - 1;
      } else if (bufferDice === 0) {
        updates.class[`-=${CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG}`] = null;
      }

    });

    Hooks.on("dnd5e.preShortRest", (actor, config) => {

      if (actor.type === 'group') {
        const actors = actor.system.members.map(currMember => currMember.actor);
        const potentialActors = Object.fromEntries(actors.map(currActor => [currActor.uuid, []]));
        for (const currActor of actors) {
          for (const [userId, permissions] of Object.entries(currActor.ownership)) {
            if (userId === "default") {
              if (permissions < 3) continue;
              const allPlayers = game.users.filter(user => !user.isGM);
              if (!allPlayers.length) continue;
              potentialActors[currActor.uuid] = allPlayers; 
              break;
            }
            const user = game.users.get(userId);
            if (!user) continue;
            if (user.isGM || permissions < 3) continue;
            potentialActors[currActor.uuid].push(user);
          }
        }
        const trueActors = [];
        for (const currActor of actors) {
          const potentialUsers = potentialActors[currActor.uuid];
          const actualUser = potentialUsers.find(currUser => currUser.active && currUser.character.uuid === currActor.uuid);
          const firstOnlineUser = potentialUsers.find(currUser => currUser.active);
          let bestUser;
          if (actualUser) {
            bestUser = actualUser;
          } else if (firstOnlineUser) {
            bestUser = firstOnlineUser;
          } else {
            bestUser = potentialUsers[0];
          }
          if (!bestUser) bestUser = game.users.activeGM;
          if (bestUser) trueActors.push([bestUser.id + "-" + currActor.id, `${currActor.name} (${bestUser.name})`]);
        }
        RestPromptDialog.show({actorList: trueActors});
        return false;
      }

      if (foundry.utils.getProperty(this, CONSTANTS.FLAGS.DAE.PREVENT_SHORT_REST) && !config.ignoreFlags) {
        custom_warning("REST-RECOVERY.Warnings.PreventedShortRest");
        return false;
      }

      if (getSetting(CONSTANTS.SETTINGS.PREVENT_USER_REST) && !game.user.isGM && !config.restPrompted) {
        custom_warning("REST-RECOVERY.Warnings.NotPromptedShortRest");
        return false;
      }

      if (getSetting(CONSTANTS.SETTINGS.REST_VARIANT) === "custom") {
        config.duration = (getSetting(CONSTANTS.SETTINGS.CUSTOM_SHORT_REST_DURATION_HOURS) ?? 1) * 60;
      }

      let workflow = RestWorkflow.make(actor, false, config);
      
      if (!config.dialog) return true;

      if (foundry.utils.isNewerVersion('3.2.0', game.system.version) && actor.type === "npc") return true;
      
      workflow.then((workflow) => {
  
        const hd0 = actor.system.attributes.hd;
        const hp0 = actor.system.attributes.hp.value;
  
        ShortRestDialog.show({ ...config, actor }).then(async (newDay) => {
  
          config.newDay = newDay;

          if (workflow._shouldRollForFoodWaterExhaustion()) {
  
            const halfWaterSaveDC = lib.getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
  
            workflow.exhaustionRoll = await actor.rollAbilitySave("con", {
              targetValue: halfWaterSaveDC,
              fastForward: false
            });
            if (!workflow.exhaustionRoll) {
              workflow.exhaustionRoll = await actor.rollAbilitySave("con", {
                targetValue: halfWaterSaveDC,
                fastForward: true
              });
            }
          }
  
          const dhd = actor.type === 'npc' ? (actor.system.attributes.hd.value - hd0.value) : (actor.system.attributes.hd - hd0);
          const dhp = actor.system.attributes.hp.value - hp0;
  
          return actor._rest(config, {dhd, dhp});
  
        });
      });
      return false;

    });

    Hooks.on("dnd5e.preLongRest", (actor, config) => {
      if (actor.type === 'group') {
        const actors = actor.system.members.map(currMember => currMember.actor);
        const potentialActors = Object.fromEntries(actors.map(currActor => [currActor.uuid, []]));
        for (const currActor of actors) {
          for (const [userId, permissions] of Object.entries(currActor.ownership)) {
            if (userId === "default") {
              if (permissions < 3) continue;
              const allPlayers = game.users.filter(user => !user.isGM);
              if (!allPlayers.length) continue;
              potentialActors[currActor.uuid] = allPlayers; 
              break;
            }
            const user = game.users.get(userId);
            if (!user) continue;
            if (user.isGM || permissions < 3) continue;
            potentialActors[currActor.uuid].push(user);
          }
        }
        const trueActors = [];
        for (const currActor of actors) {
          const potentialUsers = potentialActors[currActor.uuid];
          const actualUser = potentialUsers.find(currUser => currUser.active && currUser.character.uuid === currActor.uuid);
          const firstOnlineUser = potentialUsers.find(currUser => currUser.active);
          let bestUser;
          if (actualUser) {
            bestUser = actualUser;
          } else if (firstOnlineUser) {
            bestUser = firstOnlineUser;
          } else {
            bestUser = potentialUsers[0];
          }
          if (!bestUser) bestUser = game.users.activeGM;
          if (bestUser) trueActors.push([bestUser.id + "-" + currActor.id, `${currActor.name} (${bestUser.name})`]);
        }
        RestPromptDialog.show({actorList: trueActors});
        return false;
      }

      if (foundry.utils.getProperty(this, CONSTANTS.FLAGS.DAE.PREVENT_LONG_REST) && !config.ignoreFlags) {
        custom_warning("REST-RECOVERY.Warnings.PreventedLongRest");
        return false;
      }

      if (getSetting(CONSTANTS.SETTINGS.PREVENT_USER_REST) && !game.user.isGM && !config.restPrompted) {
        custom_warning("REST-RECOVERY.Warnings.NotPromptedLongRest");
        return false;
      }

      if (getSetting(CONSTANTS.SETTINGS.REST_VARIANT) === "custom") {
        config.duration = (getSetting(CONSTANTS.SETTINGS.CUSTOM_LONG_REST_DURATION_HOURS) ?? 1) * 60;
      }

      let workflow = RestWorkflow.make(actor, true, config);

      if (!config.dialog) return true;

      if (foundry.utils.isNewerVersion('3.2.0', game.system.version) && actor.type === "npc") return true;

      workflow.then((workflow) => {
        LongRestDialog.show({ ...config, actor }).then(async (newDay) => {
  
          config.newDay = newDay;
  
          if (workflow._shouldRollForFoodWaterExhaustion()) {
  
            const halfWaterSaveDC = lib.getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
  
            workflow.exhaustionRoll = await actor.rollAbilitySave("con", {
              targetValue: halfWaterSaveDC,
              fastForward: false
            });
            if (!workflow.exhaustionRoll) {
              workflow.exhaustionRoll = await actor.rollAbilitySave("con", {
                targetValue: halfWaterSaveDC,
                fastForward: true
              });
            }
          }
  
          return actor._rest(config);
  
        });
      });

      return false;

    })

    Hooks.on("dnd5e.restCompleted", async (actor, results) => {
      await actor.deleteEmbeddedDocuments("Item", results?.deleteItems ?? [], { isRest: true });
      await actor.createEmbeddedDocuments("Item", results?.createItems ?? [], { isRest: true });
      if (game.modules.get('magicitems')?.api && game.modules.get('magicitems').api.execActorLongRest) {
        if (results.longRest) {
          game.modules.get('magicitems').api.execActorLongRest(actor, results.newDay);
        } else {
          game.modules.get('magicitems').api.execActorShortRest(actor, results.newDay);
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
      if (foundry.utils.isNewerVersion('3.2.0', game.system.version) && actor.type === "npc") return true;
      const workflow = RestWorkflow.get(actor);
      if (workflow) {
        workflow.patchRestResults(results).then(async () => {
          workflow.updateActorCurrency();
          await actor.update(results.updateData, { isRest: true });
          await actor.updateEmbeddedDocuments("Item", results.updateItems, { isRest: true });

          if (config.advanceTime && (config.duration > 0) && game.user.isGM) await game.time.advance(60 * config.duration);
          if (config.chat) {
            const result = await actor._displayRestResultMessage(results, config.type == "long")
            await workflow._displayRestResultMessage(result);
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
    const hasSpells = Object.values(this.actor.classes).some(cls => !['none', 'pact'].includes(cls.system.spellcasting.progression));
    this.steps = [
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.Rest.Title",
        required: true,
      },
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.FoodWater.Title",
        required: lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)
          && (this.foodWaterRequirement.actorRequiredFood > 0 || this.foodWaterRequirement.actorRequiredWater > 0)
          && (lib.getSetting(CONSTANTS.SETTINGS.FOODWATER_PROMPT_NEWDAY) ? this.config.newDay : (this.longRest || this.restVariant === "gritty")),
        component: FoodWater
      },
      {
        title: "REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.Title",
        required: hasSpells && this.spellData.missingSlots
          && (
            (!this.longRest && this.spellData.feature)
            ||
            (this.longRest && lib.getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY))
          ),
        component: SpellRecovery
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
    return this.actor.items.reduce((hd, item) => {
      if (item.type === "class") {
        const d = item.system;
        const denom = d.hitDice || "d6";
        let available = parseInt(d.levels || 1) - parseInt(d.hitDiceUsed || 0);
        if (this.longRest && lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
          const hitDiceBuffer = foundry.utils.getProperty(item, CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG) ?? 0;
          available += hitDiceBuffer;
        }
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

    for (let [level, slot] of Object.entries(this.actor.system.spells)) {
      if ((!slot.max && !slot.override) || level === "pact") {
        continue;
      }
      let levelNum = Number(level.substr(5))
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
      return;
    }

    const wizardLevel = this.actor.items.find(item => {
      return item.type === "class"
        && (item.name === lib.getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true));
    })?.system?.levels || 0;
    const wizardFeature = this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.ARCANE_RECOVERY, true)) || false;

    const druidLevel = this.actor.items.find(item => {
      return item.type === "class"
        && item.system.levels >= 2
        && (item.name === lib.getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true));
    })?.system?.levels || 0;
    const druidFeature = this.actor.items.getName(lib.getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY, true)) ?? false;


    const wizardFeatureUse = wizardLevel && wizardFeature && this.patchSpellFeature(wizardFeature, "wizard");
    const druidFeatureUse = druidLevel && druidFeature && this.patchSpellFeature(druidFeature, "druid");

    if (wizardFeature && (wizardLevel > druidLevel || (druidLevel > wizardLevel && !druidFeatureUse))) {
      this.spellData.has_feature_use = wizardFeatureUse;
      this.spellData.feature = wizardFeature;
      this.spellData.pointsTotal = wizardFeature
        ? (await lib.evaluateFormula(wizardFeature.system.formula || "ceil(@classes.wizard.levels/2)", this.actor.getRollData()))?.total
        : 0;
      this.spellData.className = lib.getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
    } else if (druidFeature && (druidLevel > wizardLevel || (wizardLevel > druidLevel && !wizardFeatureUse))) {
      this.spellData.has_feature_use = druidFeatureUse;
      this.spellData.feature = druidFeature;
      this.spellData.pointsTotal = druidFeature
        ? (await lib.evaluateFormula(druidFeature.system.formula || "ceil(@classes.druid.levels/2)", this.actor.getRollData()))?.total
        : 0;
      this.spellData.className = lib.getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true);
    }

  }

  patchSpellFeature(feature, className) {

    if (feature &&
      (
        feature.system.activation.type !== "special" ||
        feature.system.uses.value === null ||
        feature.system.uses.max === null ||
        feature.system.uses.per !== "lr" ||
        feature.system.actionType !== "util" ||
        feature.system.formula === ""
      )
    ) {
      this.actor.updateEmbeddedDocuments("Item", [{
        _id: feature.id,
        "system.activation.type": "special",
        "system.uses.value": feature.system.uses.value ?? 1,
        "system.uses.max": 1,
        "system.uses.per": "lr",
        "system.actionType": "util",
        "system.formula": `ceil(@classes.${className.toLowerCase()}.levels/2)`
      }]);
      ui.notifications.info("Rest Recovery for 5e | " + game.i18n.format("REST-RECOVERY.PatchedRecovery", {
        actorName: this.actor.name,
        recoveryName: this.spellData.feature.name
      }));
      return (feature.system.uses.value ?? 1) > 0;
    }

    return feature.system.uses.value > 0;

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
        : Math.floor((this.actor.type === "npc" ? this.actor.system.attributes.hd.max : this.actor.system.details.level) * maxHitDiceSpendMultiplier);
    } else {
      minSpendHitDice = getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0;
      const maxHitDiceSpendMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND);
      maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string"
        ? Math.floor((await lib.evaluateFormula(maxHitDiceSpendMultiplier, this.actor.getRollData()))?.total ?? 0)
        : Math.floor((this.actor.type === "npc" ? this.actor.system.attributes.hd.max : this.actor.system.details.level) * maxHitDiceSpendMultiplier);
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
    const periapt_mod = (periapt && (foundry.utils.isNewerVersion("3.2.0", game.system.version) ? (periapt?.system?.attunement === 2) : periapt?.system?.attuned)) || (blessing && blessing?.type === "feat") ? 3 : 1

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
    const roll = await this.actor.rollHitDie(hitDice, { dialog });
    if (!roll) return;
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;
    this.healthData.hitDiceSpent++;

    if (this.longRest) return true;

    let hpRegained = 0;

    if (!this.features.usedBardFeature && this.features.bardFeature) {
      const formula = foundry.utils.getProperty(this.features.bardFeature, "system.damage.parts")?.[0]?.[0] ?? "1@scale.bard.song-of-rest";
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
      const maxHP = this.actor.system.attributes.hp.max + ((this.actor.system.attributes.hp.tempmax ?? 0) ?? 0);
      await this.actor.update({ "system.attributes.hp.value": Math.min(maxHP, curHP + hpRegained) })
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

  async patchRestResults(results) {

    results.deleteItems = [];
    results.createItems = [];

    await this._finishedRest(results);
    await this._getRestHitPointRecovery(results);
    await this._handleExhaustion(results);
    await this._getRestResourceRecovery(results, {
      recoverShortRestResources: !results.longRest,
      recoverLongRestResources: results.longRest,
    });
    await this._getRestSpellRecovery(results, {
      recoverSpells: results.longRest,
    });
    await this._getRestItemUsesRecovery(results, {
      recoverLongRestUses: results.longRest,
      recoverDailyUses: results.newDay,
      rolls: results.rolls
    });
    this._handleFoodAndWaterItems(results);

    if(foundry.utils.hasProperty(results.updateData, "system.attributes.exhaustion")) {
      this.newExhaustionValue = results.updateData['system.attributes.exhaustion'];
    }

  }

  async regainHitDice() {

    if (!lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) return;

    this.preRestRegainHitDice = true;
    const maxHitDice = await this._getMaxHitDiceRecovery();
    let { updates=[], actorUpdates, hitDiceRecovered } = this.actor._getRestHitDiceRecovery({ maxHitDice });
    this.preRestRegainHitDice = false;

    let hitDiceLeftToRecover = Math.max(0, maxHitDice - hitDiceRecovered);

    if (hitDiceLeftToRecover > 0) {

      const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
        return (parseInt(b.system.hitDice.slice(1)) || 0) - (parseInt(a.system.hitDice.slice(1)) || 0);
      });

      const biggestClass = sortedClasses[0];

      lib.addToUpdates(updates, {
        _id: biggestClass.id,
        [CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG]: hitDiceLeftToRecover
      })

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
    let remainingCost = this.foodAndWaterCost.toFixed(2);
    let actorCurrency = foundry.utils.deepClone(this.actor.system.currency);
    let ppRequired = Math.floor(remainingCost * 0.1);
    remainingCost = (remainingCost - (ppRequired / 0.1)).toFixed(2);
    let gpRequired = Math.floor(remainingCost);
    remainingCost = (remainingCost - (gpRequired)).toFixed(2);
    let epRequired = Math.floor(remainingCost * 2);
    remainingCost = (remainingCost - (epRequired / 2)).toFixed(2);
    let spRequired = Math.floor(remainingCost * 10);
    remainingCost = (remainingCost - (spRequired / 10)).toFixed(2);
    let cpRequired = Math.floor(remainingCost * 100);
    remainingCost = (remainingCost - (cpRequired / 100)).toFixed(2);

    // Break higher into lower
    if (actorCurrency.cp < cpRequired) {
      if (actorCurrency.sp > 0) {
        actorCurrency.sp -= 1;
        actorCurrency.cp += 10;
      } else if (actorCurrency.ep > 0) {
        actorCurrency.ep -= 1;
        actorCurrency.sp += 4;
        actorCurrency.cp += 10;
      } else if (actorCurrency.gp > 0) {
        actorCurrency.gp -= 1;
        actorCurrency.ep += 1;
        actorCurrency.sp += 4;
        actorCurrency.cp += 10;
      } else {
        actorCurrency.pp -= 1;
        actorCurrency.gp += 9;
        actorCurrency.ep += 1;
        actorCurrency.sp += 4;
        actorCurrency.cp += 10;
      }
    }
    actorCurrency.cp -= cpRequired;

    // Combine lower into higher
    while (actorCurrency.sp < spRequired && actorCurrency.cp >= 10) {
      actorCurrency.cp -= 10;
      actorCurrency.sp += 1;
    }
    // Break higher into lower
    if (actorCurrency.sp < spRequired) {
      if (actorCurrency.ep > 0) {
        actorCurrency.ep -= 1;
        actorCurrency.sp += 5;
      } else if (actorCurrency.gp > 0) {
        actorCurrency.gp -= 1;
        actorCurrency.ep += 1;
        actorCurrency.sp += 5;
      } else {
        actorCurrency.pp -= 1;
        actorCurrency.gp += 9;
        actorCurrency.ep += 1;
        actorCurrency.sp += 5;
      }
    }
    actorCurrency.sp -= spRequired;

    // Combine lower into higher
    while (actorCurrency.ep < epRequired && (actorCurrency.cp / 10) + actorCurrency.sp >= 5) {
      if (actorCurrency.sp >= 5) {
        actorCurrency.sp -= 5;
        actorCurrency.ep += 1;
      } else if (actorCurrency.cp >= 10) {
        actorCurrency.cp -= 10;
        actorCurrency.sp += 1;
      }
    }
    // Break higher into lower
    if (actorCurrency.ep < epRequired) {
      if (actorCurrency.gp > 0) {
        actorCurrency.gp -= 1;
        actorCurrency.ep += 2;
      } else {
        actorCurrency.pp -= 1;
        actorCurrency.gp += 9;
        actorCurrency.ep += 2;
      }
    }
    actorCurrency.ep -= epRequired;

    // Combine lower into higher
    while (actorCurrency.gp < gpRequired && (actorCurrency.cp / 50) + (actorCurrency.sp / 5) + actorCurrency.gp >= 2) {
      if (actorCurrency.ep >= 2) {
        actorCurrency.ep -= 2;
        actorCurrency.gp += 1;
      } else if (actorCurrency.sp >= 5) {
        actorCurrency.sp -= 5;
        actorCurrency.ep += 1;
      } else if (actorCurrency.cp >= 10) {
        actorCurrency.cp -= 10;
        actorCurrency.sp += 1;
      }
    }
    // Break higher into lower
    if (actorCurrency.gp < gpRequired) {
      actorCurrency.pp -= 1;
      actorCurrency.gp += 10;
    }
    actorCurrency.gp -= gpRequired;

    // Combine lower into higher - the second part of this check shouldn't be necessary but will keep it just in case somehow there's a math error or something
    while (actorCurrency.pp < ppRequired && (actorCurrency.cp / 100) + (actorCurrency.sp / 10) + (actorCurrency.ep / 2) + actorCurrency.gp >= 10) {
      if (actorCurrency.gp >= 10) {
        actorCurrency.gp -= 10;
        actorCurrency.pp += 1;
      } else if (actorCurrency.ep >= 2) {
        actorCurrency.ep -= 2;
        actorCurrency.gp += 1;
      } else if (actorCurrency.sp >= 5) {
        actorCurrency.sp -= 5;
        actorCurrency.ep += 1;
      } else if (actorCurrency.cp >= 10) {
        actorCurrency.cp -= 10;
        actorCurrency.sp += 1;
      }
    }
    actorCurrency.pp -= ppRequired;

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
        if(Object.keys(results.updateItems[i]).includes("system.hitDiceUsed")){
          results.updateItems.splice(i, 1);
        }
      }

      const maxHitDice = await this._getMaxHitDiceRecovery();
      let { updates=[], actorUpdates, hitDiceRecovered } = this.actor._getRestHitDiceRecovery({ maxHitDice });

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
      if (actorUpdates) {
        await this.actor.update(actorUpdates);
      }
      results.dhd = hitDiceRecovered;
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
      let waterItems = items.filter(item => item.consumable.type === "both" || item.consumable.type === "water");

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
    let exhaustionToRemove = 1;

    if (lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && this.config.dialog && shouldDoFoodWater) {

      let {
        actorRequiredFood,
        actorRequiredWater,
        actorFoodSatedValue,
        actorWaterSatedValue
      } = lib.getActorConsumableValues(this.actor, this.restVariant === "gritty" && this.longRest);

      let actorDaysWithoutFood = foundry.utils.getProperty(this.actor, CONSTANTS.FLAGS.STARVATION) ?? 0;

      const items = this.consumableData.items.filter(item => item.amount);
      let foodItems = items.filter(item => item.consumable.type === "both" || item.consumable.type === "food");
      let waterItems = items.filter(item => item.consumable.type === "both" || item.consumable.type === "water");

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
            exhaustionToRemove = 0;
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
            exhaustionToRemove = 0;
          } else {
            const halfWaterSaveDC = lib.getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
            if (halfWaterSaveDC) {
              exhaustionToRemove = 0;
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

    if ((this.longRest || (shouldDoFoodWater && automateFoodwaterExhaustion)) &&lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) {

      if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_EXHAUSTION) && actorExhaustion > 0) {
        const armor = this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.type?.value) > -1 && item.system.equipped);
        if (armor && !this.healthData.removeNonLightArmor) {
          exhaustionToRemove = 0;
          this.foodAndWaterMessage.push(game.i18n.localize("REST-RECOVERY.Chat.ExhaustionArmor"));
        }
      }

      if (lib.getSetting(CONSTANTS.SETTINGS.PREVENT_LONG_REST_EXHAUSTION_RECOVERY)) {
        exhaustionToRemove = 0;
      }

      if (foundry.utils.getProperty(this, CONSTANTS.FLAGS.DAE.PREVENT_EXHAUSTION_RECOVERY) && !this.config.ignoreFlags) {
        exhaustionToRemove = 0;
      }

      if (exhaustionGain) {
        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.Exhaustion", {
          exhaustion: actorExhaustion - actorInitialExhaustion
        }));
      } else if (exhaustionSave) {
        this.foodAndWaterMessage.push(game.i18n.localize("REST-RECOVERY.Chat.NoExhaustion"));
      }

      const maxExhaustion = lib.getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION) ? 10 : 6;

      results.updateData['system.attributes.exhaustion'] = Math.max(0, Math.min(actorExhaustion - exhaustionToRemove, maxExhaustion));

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

  _displayRestResultMessage(chatMessage) {
    if (!this.longRest && lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_HP_MULTIPLIER) && !this.healthData.hitDiceSpent && this.healthRegained > 0) {
      chatMessage.content = game.i18n.format('REST-RECOVERY.Chat.AlternateShortRestResult', {name: this.actor.name, health: this.healthRegained});
    }
    let flavor = chatMessage.flavor;
    if (!this.config.newDay) {
      let duration;
      let units;
      if (this.config.duration % 1440 === 0) {
        duration = this.config.duration / 1440;
        units = duration > 1 ? 'Days' : 'Day';
      } else if (this.config.duration % 60 === 0) {
        duration = this.config.duration / 60;
        units = duration > 1 ? 'Hours' : 'Hour';
      } else {
        duration = this.config.duration;
        units = duration > 1 ? 'Minutes' : 'Minute';
      }
      flavor = game.i18n.format(`REST-RECOVERY.Chat.Flavor.${this.longRest ? 'Long' : 'Short'}RestNormal`, {duration: duration, units: units});
    } else if (!this.longRest) {
      flavor = game.i18n.localize("REST-RECOVERY.Chat.Flavor.ShortRestNewday");
    }

    let extra = this.spellSlotsRegainedMessage
      + this.itemsRegainedMessages.join("")
      + this.resourcesRegainedMessages.join("")
    if (extra.length) {
      extra = `<p>${game.i18n.localize('REST-RECOVERY.Chat.RegainedUses')}</p>` + extra;
    }

    if (this.foodAndWaterMessage.length) {
      extra += this.foodAndWaterMessage.join("");
    }

    let newChatMessageContent = `<p>${chatMessage.content}${this.hitDiceMessage ? " " + this.hitDiceMessage : ""}</p>` + extra;

    if (lib.getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_NOTES) && (this.config.restPrompted || !lib.getSetting(CONSTANTS.SETTINGS.SIMPLE_CALENDAR_NOTES_ONLY_PROMPTED))) {
      let endDateTime = SimpleCalendar.api.currentDateTime();
      let restDuration = this.config.duration;
      let startDateTime = (this.config.restPrompted || this.config.advanceTime) ? SimpleCalendar.api.timestampToDate(SimpleCalendar.api.timestamp() - (restDuration * 60)) : endDateTime;

      SimpleCalendar.api.addNote(`${this.longRest ? 'Long' : 'Short'} rest: ${this.actor.name}`, newChatMessageContent, startDateTime, endDateTime, false, 0, [], "active", null, ['default']);
    }

    chatMessage.update({
      flavor: flavor,
      content: newChatMessageContent
    }).then(() => {
      ui.chat.scrollBottom();
    });

    return chatMessage;
  }

  async _getRestHitPointRecovery(results = { updateData: {}, dhp: 0 }) {

    const maxHP = this.actor.system.attributes.hp.max;
    const currentHP = this.actor.system.attributes.hp.value;

    const multiplier = lib.determineMultiplier(this.longRest ? CONSTANTS.SETTINGS.HP_MULTIPLIER : CONSTANTS.SETTINGS.SHORT_HP_MULTIPLIER);

    results.hitPointsToRegainFromRest = typeof multiplier === "string"
      ? Math.floor((await lib.evaluateFormula(multiplier, this.actor.getRollData()))?.total)
      : Math.floor(maxHP * multiplier);

    results.updateData["system.attributes.hp.value"] = Math.min(maxHP, currentHP + results.hitPointsToRegainFromRest);
    results.hitPointsRecovered = results.updateData["system.attributes.hp.value"] - this.healthData.startingHealth;

    results.dhp = results.hitPointsRecovered;

    return results.hitPointsToRegainFromRest;

  }

  async _getMaxHitDiceRecovery({ maxHitDice = undefined } = {}) {

    if (!this.preRestRegainHitDice && lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) return 0;

    let multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
    let roundingMethod = lib.determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
    const actorLevel = this.actor.type === "npc" ? this.actor.system.attributes.hd.max : this.actor.system.details.level;

    if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE)) {
      const armor = this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.type?.value) > -1 && item.system.equipped);
      if (armor && !this.healthData.removeNonLightArmor) {
        multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE);
        roundingMethod = lib.determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
      }
    }

    if (typeof multiplier === "string") {

      const customRegain = (await lib.evaluateFormula(multiplier, this.actor.getRollData()))?.total;
      maxHitDice = Math.clamped(roundingMethod(customRegain), 0, maxHitDice ?? actorLevel);

    } else {

      maxHitDice = Math.clamped(
        roundingMethod(actorLevel * multiplier),
        multiplier ? 1 : 0,
        maxHitDice ?? actorLevel
      );

    }

    if (!lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
      const maximumHitDiceToRecover = Number(Object.values(this.actor.classes).reduce((acc, cls) => {
        acc += cls.system?.hitDiceUsed ?? 0;
        return acc;
      }, 0));
      maxHitDice = Math.min(maximumHitDiceToRecover, maxHitDice);
    }

    if (this.healthData.hitDiceSpent > 0 && lib.getSetting(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE)) {
      maxHitDice = 0;
    }

    return maxHitDice;

  }

  async _getRestResourceRecovery(results, { recoverShortRestResources = true, recoverLongRestResources = true } = {}) {

    const customRecoveryResources = Object.entries(this.actor.system.resources).filter(entry => {
      return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && foundry.utils.getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`)
    });

    const regularResources = Object.entries(this.actor.system.resources).filter(entry => {
      return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && !getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`)
    });

    for (const [key, resource] of customRecoveryResources) {
      if ((recoverShortRestResources && resource.sr) || (recoverLongRestResources && resource.lr)) {
        const customFormula = foundry.utils.getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${key}.formula`);
        const customRoll = await lib.evaluateFormula(customFormula, this.actor.getRollData());
        results.updateData[`system.resources.${key}.value`] = Math.min(resource.value + customRoll.total, resource.max);

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
    if (multiplier === 1.0 || !multiplier) return;

    for (const [key, resource] of regularResources) {
      if (recoverShortRestResources && resource.sr) {
        results.updateData[`system.resources.${key}.value`] = Number(resource.max);
      } else if (recoverLongRestResources && resource.lr) {
        const recoverResources = typeof multiplier === "string"
          ? (await lib.evaluateFormula(multiplier, { resource: foundry.utils.deepClone(resource) }))?.total
          : Math.max(Math.floor(resource.max * multiplier), 1);

        results.updateData[`system.resources.${key}.value`] = Math.min(resource.value + recoverResources, resource.max);
      }
    }

  }

  async _getRestSpellRecovery(results, { recoverSpells = true } = {}) {

    const customSpellRecovery = lib.getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY) && this.config.dialog;
    let actorRollData = this.actor.getRollData();

    // Long rest
    if (recoverSpells) {

      const spellMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER);
      const pactMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER);

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

      // Short rest
    } else {

      const pactMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER);

      for (let [level, slot] of Object.entries(this.actor.system.spells)) {
        if (!slot.override && !slot.max || level !== "pact") continue;
        let spellMax = slot.override || slot.max;
        let recoverSpells = typeof pactMultiplier === "string"
          ? Math.max((await lib.evaluateFormula(pactMultiplier, { ...actorRollData, slot: foundry.utils.deepClone(slot) }))?.total, 1)
          : Math.max(Math.floor(spellMax * pactMultiplier), pactMultiplier ? 1 : pactMultiplier);
        results.updateData[`system.spells.${level}.value`] = Math.min(slot.value + recoverSpells, spellMax);
      }

    }

    if ((!this.longRest && this.spellData.feature) || (this.longRest && customSpellRecovery)) {

      if (!foundry.utils.isEmpty(this.recoveredSlots)) {

        for (const [slot, num] of Object.entries(this.recoveredSlots)) {
          const prop = `system.spells.spell${slot}.value`;
          results.updateData[prop] = (results.updateData[prop] || foundry.utils.getProperty(this.actor, prop) || 0) + num;
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

  async _getRestItemUsesRecovery(results, args) {

    await this._recoverItemsUses(results, args);

    if (!this.longRest && this.spellData.pointsSpent && this.spellData.feature) {
      lib.addToUpdates(results.updateItems, {
        _id: this.spellData.feature.id,
        "system.uses.value": 0
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

    const longRestItemNameHandlers = RestWorkflow.LongRestItemNameHandlers;

    for (const item of this.actor.items) {
      const itemHandlerFn = longRestItemNameHandlers[item.name];
      if (recoverLongRestUses && itemHandlerFn) {
        this[itemHandlerFn](actorRollData, results.updateItems, item, rolls);
      } else if (item.system.uses) {
        if (recoverDailyUses && item.system.uses.per === "day") {
          await this._recoverItemUse(actorRollData, results.updateItems, item, dailyMultiplier, rolls);
        } else if (recoverLongRestUses && item.system.uses.per === "lr") {
          await this._recoverItemUse(actorRollData, results.updateItems, item, item.type === "feat" ? longFeatsMultiplier : longOthersMultiplier, rolls);
        } else if (item.system.uses.per === "sr") {
          await this._recoverItemUse(actorRollData, results.updateItems, item, item.type === "feat" ? shortFeatsMultiplier : shortOthersMultiplier, rolls);
        }
      } else if (recoverLongRestUses && item.system.recharge && item.system.recharge.value) {
        lib.addToUpdates(results.updateItems, { _id: item.id, "system.recharge.charged": true });
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

  }

  async _recoverItemUse(actorRollData, updateItems, item, multiplier = 1.0, rolls) {

    const usesMax = item.system.uses.max;
    const usesCur = item.system.uses.value;

    if (usesCur === usesMax) return;

    const customRecovery = foundry.utils.getProperty(item, CONSTANTS.FLAGS.RECOVERY_ENABLED);
    const customFormula = foundry.utils.getProperty(item, CONSTANTS.FLAGS.RECOVERY_FORMULA);

    let recoverValue;
    if (customRecovery && customFormula) {
      const customRoll = await lib.evaluateFormula(customFormula, {
        actor: actorRollData,
        item: foundry.utils.deepClone(item.system)
      });
      rolls.push(customRoll)
      recoverValue = Math.max(0, Math.min(usesCur + customRoll.total, usesMax));
      const chargeText = `<a class="inline-roll roll" onClick="return false;" title="${customRoll.formula} (${customRoll.total})">${Math.min(usesMax - usesCur, customRoll.total)}</a>`;
      this.itemsRegainedMessages.push([item.type, `<li>${game.i18n.format("REST-RECOVERY.Chat.RecoveryNameNum", {
        name: item.name,
        number: chargeText
      })}</li>`])
    } else {
      recoverValue = typeof multiplier === "string"
        ? (await lib.evaluateFormula(multiplier, foundry.utils.deepClone(item.system)))?.total
        : Math.max(Math.floor(usesMax * multiplier), multiplier ? 1 : 0);
      recoverValue = Math.max(0, Math.min(usesCur + recoverValue, usesMax));
    }

    lib.addToUpdates(updateItems, {
      _id: item.id,
      "system.uses.value": recoverValue
    })

  }

  _handlePowerSurgeFeature(actorRollData, updateItems, item) {

    const numSurges = foundry.utils.getProperty(item, "system.uses.value");
    if (numSurges === 1) return;

    lib.addToUpdates(updateItems, {
      _id: item.id,
      "system.uses.value": 1
    })

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

      const maxUses = foundry.utils.getProperty(update, "system.uses.max") ?? foundry.utils.getProperty(item, "system.uses.max") ?? 1;
      const currentUses = foundry.utils.getProperty(update, "system.uses.value") ?? foundry.utils.getProperty(item, "system.uses.value") ?? 1;
      const currentQuantity = foundry.utils.getProperty(update, "system.quantity") ?? foundry.utils.getProperty(item, "system.quantity");
      const consumeQuantity = foundry.utils.getProperty(item, 'system.uses.autoDestroy') ?? false;

      if(consumeQuantity) {

        const currentTotalUses = ((maxUses * currentQuantity) - (maxUses - currentUses));
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
          update["system.uses.value"] = usesLeft;

        }

      }else{

        update["system.uses.value"] = Math.max(0, currentUses - consumableData.amount);

      }

      if (updateIndex > -1) {
        results.updateItems.splice(updateIndex, 1);
      }

      results.updateItems.push(update);

    }
  }

  static _setupFoodListeners() {

    Hooks.on("closeApplication", (app) => {
      if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
      if (!app?.item) return;
      const item = app.item;
      const consumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
      if (!consumable?.enabled) return;
      let consumeFull = true;
      const element = app.element.find('input[name="consumeAmount"]:checked');
      if (element.length) {
        consumeFull = element.val() === "full";
      }
      this.itemsListened.set(item.id, consumeFull);
      setTimeout(() => {
        this.itemsListened.delete(item.id)
      }, 150);
    });

    Hooks.on('preUpdateItem', (item, data) => {
      if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
      if (foundry.utils.getProperty(data, CONSTANTS.FLAGS.CONSUMABLE)?.enabled && !lib.isRealNumber(foundry.utils.getProperty(item, "system.uses.max"))) {
        return this._patchConsumableItem(item, data);
      }
      if (!this.itemsListened.has(item.id)) return;
      const consumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
      if (!consumable?.enabled) return;
      return this._handleConsumableItem(item, data, this);
    });

    Hooks.on('deleteItem', (item, data) => {
      if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
      if (!this.itemsListened.has(item.id)) return;
      const consumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
      if (!consumable?.enabled) return;
      return this._handleConsumableItem(item, data, this);
    })
  }

  static patchAllConsumableItems(actor) {

    const items = actor.items.filter(item => (item.name === "Rations" || item.name === "Rations (1 day)" || item.name === "Waterskin") && foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) === undefined);

    const updates = items.map(item => {
      if (item.name.startsWith("Rations")) {
        return {
          "_id": item.id,
          "system.uses.value": foundry.utils.getProperty(item, "system.uses.value") ?? 1,
          "system.uses.max": foundry.utils.getProperty(item, "system.uses.max") ?? 1,
          "system.uses.per": foundry.utils.getProperty(item, "system.uses.per") ?? "charges",
          [CONSTANTS.FLAGS.CONSUMABLE_ENABLED]: true,
          [CONSTANTS.FLAGS.CONSUMABLE_TYPE]: CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD
        }
      }

      return {
        "_id": item.id,
        "system.uses.value": 1,
        "system.uses.max": 1,
        "system.uses.per": "charges",
        [CONSTANTS.FLAGS.CONSUMABLE_ENABLED]: true,
        [CONSTANTS.FLAGS.CONSUMABLE_TYPE]: CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER
      }
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
    updates["system.uses.value"] = 1;
    updates["system.uses.max"] = 1;
    updates["system.uses.per"] = "charges";
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

    const currCharges = foundry.utils.getProperty(item, "system.uses.value");
    const newCharges = foundry.utils.getProperty(data, "system.uses.value") ?? (currCharges - 1.0);
    const chargesUsed = currCharges < newCharges ? currCharges : currCharges - newCharges;

    let message;

    if (consumable.type === "both") {

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

    } else if (consumable.type === "food") {

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

    } else if (consumable.type === "water") {

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
