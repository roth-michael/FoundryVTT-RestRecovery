import CONSTANTS from "./constants.js";
import * as lib from "./lib/lib.js";
import { getSetting } from "./lib/lib.js";
import plugins from "./plugins.js";
import FoodWater from "./formapplications/rest-steps/FoodWater.svelte";
import SpellRecovery from "./formapplications/rest-steps/SpellRecovery.svelte";

const rests = new Map();

export default class RestWorkflow {

  static itemsListened = new Map()

  constructor(actor, longRest) {
    this.actor = actor;
    this.longRest = longRest;
    this.finished = false;
    this.restVariant = game.settings.get("dnd5e", "restVariant");

    this.spellSlotsRegainedMessage = "";
    this.hitDiceMessage = "";
    this.itemsRegainedMessages = [];
    this.resourcesRegainedMessages = [];
    this.foodAndWaterMessage = [];
    this.steps = [];

    this.consumableData = { items: [] };
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
    return this.actor.system.attributes.hd;
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
      const exhaustion = getProperty(data, "system.attributes.exhaustion");
      if (exhaustion === undefined) return;
      return plugins.handleExhaustion(actor, data);
    });

    let cachedDenomination = false;
    Hooks.on("dnd5e.preRollHitDie", (actor, config, denomination) => {

      const workflow = RestWorkflow.get(actor);
      if (!workflow) return;

      cachedDenomination = denomination;

      const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM)
        ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true))
        : false;
      const blessing = getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING)
        ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true))
        : false;
      const hasWoundClosure = (periapt && periapt?.system?.attunement === 2) || (blessing && blessing?.type === "feat");

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

      const forceMaxRoll = getProperty(actor, CONSTANTS.FLAGS.DAE.MAXIMISE_HIT_DIE_ROLL);

      let formula = !forceMaxRoll ? "1" + denomination : denomination.slice(1);

      if (hasBlackBlood) {
        formula += "r<3";
      }

      if (hasWoundClosure) {
        formula = "(" + formula + "*2)";
      }

      formula += "+@abilities.con.mod";

      const hitDiceBonus = actor.getFlag("dnd5e", "hitDieBonus") ?? 0;
      if (hitDiceBonus) {
        formula += `+${hitDiceBonus}`;
      }

      if (isDurable) {
        formula = `{${formula},${durableMod}}kh`
      }

      config.formula = `max(0, ${formula})`;

    });

    Hooks.on("dnd5e.rollHitDie", (actor, roll, updates) => {

      const workflow = RestWorkflow.get(actor);
      if (!workflow) return;

      const denomination = cachedDenomination;

      const hitDice = updates.class["system.hitDiceUsed"]-1;

      const clsItem = actor.items.find(i => {
        return i.system.hitDice === denomination && i.system.hitDiceUsed === hitDice;
      });

      if(!clsItem) return;

      const bufferDice = getProperty(clsItem, CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG);

      if((bufferDice ?? 0) > 0){
        delete updates.class["system.hitDiceUsed"];
        updates.class[CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG] = bufferDice-1;
      }else if(bufferDice === 0){
        updates.class[`-=${CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG}`] = null;
      }

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
          && (this.longRest || this.restVariant === "gritty")
          && this.foodWaterRequirement.actorRequiredFood > 0
          && this.foodWaterRequirement.actorRequiredWater > 0,
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

  fetchHealthData() {

    const actorHasNonLightArmor = !!this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.armor?.type) > -1 && item.system.equipped)

    this.healthData = {
      level: this.actor.system.details.level,
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
      let { hitPointsToRegainFromRest } = this.actor._getRestHitPointRecovery();
      this.healthData.hitPointsToRegainFromRest = hitPointsToRegainFromRest;
    }

    this.foodWaterRequirement = lib.getActorConsumableValues(this.actor, this.longRest && this.restVariant === "gritty");

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
    return this.actor.items.reduce((hd, item) => {
      if (item.type === "class") {
        const d = item.system;
        const denom = d.hitDice || "d6";
        let available = parseInt(d.levels || 1) - parseInt(d.hitDiceUsed || 0);
        if(this.longRest && lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)){
          const hitDiceBuffer = getProperty(item, CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG) ?? 0;
          available += hitDiceBuffer;
        }
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
      this.spellData.pointsTotal = lib.evaluateFormula(
        formula || "ceil(min(17, @details.level+1)/2)*2",
        this.actor.getRollData(),
        false
      )?.total + (this.actor.getFlag("dnd5e", "longRestSpellPointsBonus") ?? 0);
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
        ? lib.evaluateFormula(wizardFeature.system.formula || "ceil(@classes.wizard.levels/2)", this.actor.getRollData())?.total
        : 0;
      this.spellData.className = lib.getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
    } else if (druidFeature && (druidLevel > wizardLevel || (wizardLevel > druidLevel && !wizardFeatureUse))) {
      this.spellData.has_feature_use = druidFeatureUse;
      this.spellData.feature = druidFeature;
      this.spellData.pointsTotal = druidFeature
        ? lib.evaluateFormula(druidFeature.system.formula || "ceil(@classes.druid.levels/2)", this.actor.getRollData())?.total
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
    let characters = game.actors.filter(actor => actor.type === "character" && actor.hasPlayerOwner);

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
        ? Math.floor(lib.evaluateFormula(maxHitDiceSpendMultiplier, this.actor.getRollData())?.total ?? 0)
        : Math.floor(this.actor.system.details.level * maxHitDiceSpendMultiplier);
    } else {
      minSpendHitDice = getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0;
      const maxHitDiceSpendMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND);
      maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string"
        ? Math.floor(lib.evaluateFormula(maxHitDiceSpendMultiplier, this.actor.getRollData())?.total ?? 0)
        : Math.floor(this.actor.system.details.level * maxHitDiceSpendMultiplier);
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
    const periapt_mod = (periapt && periapt?.system?.attunement === 2) || (blessing && blessing?.type === "feat") ? 3 : 1

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

    if (!this.features.usedSongOfRest && this.features.bardFeature) {
      const formula = getProperty(this.features.bardFeature, "system.damage.parts")?.[0]?.[0] ?? "1@scale.bard.song-of-rest";
      const roll = lib.evaluateFormula(formula, this.features.bard.getRollData());
      hpRegained += roll.total;

      const isOwnBard = this.features.bard === this.actor;
      await roll.toMessage({
        flavor: game.i18n.format("REST-RECOVERY.Chat.SongOfRest" + (isOwnBard ? "Self" : ""), {
          name: this.actor.name,
          bard: this.features.bard.name
        }),
        speaker: ChatMessage.getSpeaker({ actor: this.actor })
      });

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

  static async asyncWrappedFn(actor, wrapped, args, fnName, runWrap = true) {

    const workflow = this.get(actor);

    if (!runWrap) {
      if (workflow && workflow[fnName]) {
        return wrapped(workflow[fnName](args));
      }
      return wrapped(args);
    }

    let updates = await wrapped(args);
    if (workflow && workflow[fnName]) {
      updates = workflow[fnName](updates, args);
    }

    return updates;

  }

  async regainHitDice() {

    if (!lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) return;

    let { maxHitDice } = this._getMaxHitDiceRecovery();

    let { updates, hitDiceRecovered } = this.actor._getRestHitDiceRecovery(true);

    let hitDiceLeftToRecover = Math.max(0, maxHitDice - hitDiceRecovered);

    if (hitDiceLeftToRecover > 0) {
      const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
        return (parseInt(b.system.hitDice.slice(1)) || 0) - (parseInt(a.system.hitDice.slice(1)) || 0);
      });

      const biggestClass = sortedClasses[0];

      updates.push({
        _id: biggestClass.id,
        [CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG]: hitDiceLeftToRecover
      });

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
        const currentShortRests = getProperty(this.actor, CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS) || 0;
        updates[CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS] = currentShortRests + 1;
      }
    }

    let { maxHitDice } = this._getMaxHitDiceRecovery();
    let { hitDiceRecovered } = this.actor._getRestHitDiceRecovery(true);

    if (this.longRest) {

      if (this.healthData.hitDiceSpent > 0 && hitDiceRecovered === 0 && lib.getSetting(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE)) {

        this.hitDiceMessage = game.i18n.localize("REST-RECOVERY.Chat.PreventedHitDiceRecovery");

      } else if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE)) {
        const armor = this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.armor?.type) > -1 && item.system.equipped);
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
    }

    return updates;
  }

  async _handleExhaustion(updates) {

    if (!(this.longRest || this.restVariant === "gritty")) return updates;

    let actorInitialExhaustion = getProperty(this.actor, "system.attributes.exhaustion") ?? 0;
    let actorExhaustion = actorInitialExhaustion;
    let exhaustionGain = false;
    let exhaustionSave = false;
    let exhaustionToRemove = 1;

    if (lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) {

      let {
        actorRequiredFood,
        actorRequiredWater,
        actorFoodSatedValue,
        actorWaterSatedValue
      } = lib.getActorConsumableValues(this.actor);

      let actorDaysWithoutFood = getProperty(this.actor, CONSTANTS.FLAGS.STARVATION) ?? 0;

      const items = this.consumableData.items.filter(item => item.amount);
      let foodItems = items.filter(item => item.consumable.type === "both" || item.consumable.type === "food");
      let waterItems = items.filter(item => item.consumable.type === "both" || item.consumable.type === "water");

      if (actorRequiredFood) {

        let localize = "REST-RECOVERY.Chat.Food"

        let actorExhaustionThreshold = lib.evaluateFormula(
          lib.getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER),
          this.actor.getRollData()
        )?.total ?? 4;

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

        if (lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION)) {

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

        if (actorWaterSatedValue < actorRequiredWater && lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION)) {
          if (actorWaterSatedValue < (actorRequiredWater / 2)) {
            actorExhaustion += actorExhaustion > 0 ? 2 : 1;
            exhaustionGain = true;
            exhaustionToRemove = 0;
          } else {
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

      updates[CONSTANTS.FLAGS.SATED_FOOD] = 0;
      updates[CONSTANTS.FLAGS.SATED_WATER] = 0;

    }

    if (this.longRest && lib.getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)) {

      if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_EXHAUSTION) && actorExhaustion > 0) {
        const armor = this.actor.items.find(item => item.type === "equipment" && ["heavy", "medium"].indexOf(item.system?.armor?.type) > -1 && item.system.equipped);
        if (armor && !this.healthData.removeNonLightArmor) {
          exhaustionToRemove = 0;
          this.foodAndWaterMessage.push(game.i18n.localize("REST-RECOVERY.Chat.ExhaustionArmor"));
        }
      }

      if (exhaustionGain) {
        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.Exhaustion", {
          exhaustion: actorExhaustion - actorInitialExhaustion
        }));
      } else if (exhaustionSave) {
        this.foodAndWaterMessage.push(game.i18n.localize("REST-RECOVERY.Chat.NoExhaustion"));
      }

      const maxExhaustion = lib.getSetting(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION) ? 10 : 6;

      updates['system.attributes.exhaustion'] = Math.max(0, Math.min(actorExhaustion - exhaustionToRemove, maxExhaustion));
      if (updates['system.attributes.exhaustion'] === maxExhaustion) {
        this.foodAndWaterMessage.push(game.i18n.format("REST-RECOVERY.Chat.ExhaustionDeath", {
          actorName: this.actor.name,
          max_levels: maxExhaustion
        }));
      }
    }

    if (this.foodAndWaterMessage.length) {
      this.foodAndWaterMessage = this.foodAndWaterMessage.map(str => (`<p>${str}</p>`));
    }

    return updates;

  }

  _displayRestResultMessage(chatMessage) {

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
      content: `<p>${chatMessage.content}${this.hitDiceMessage ? " " + this.hitDiceMessage : ""}</p>` + extra
    }).then(() => {
      ui.chat.scrollBottom();
    });

    return chatMessage;
  }

  _getRestHitPointRecovery(result) {

    const maxHP = this.actor.system.attributes.hp.max;
    const currentHP = this.actor.system.attributes.hp.value;

    if (!this.longRest) {
      result.hitPointsRecovered = currentHP - this.healthData.startingHealth;
      result.hitPointsToRegainFromRest = 0;
      return result;
    }

    const multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.HP_MULTIPLIER);

    result.hitPointsToRegainFromRest = typeof multiplier === "string"
      ? Math.floor(lib.evaluateFormula(multiplier, this.actor.getRollData())?.total)
      : Math.floor(maxHP * multiplier);

    result.updates["system.attributes.hp.value"] = Math.min(maxHP, currentHP + result.hitPointsToRegainFromRest);
    result.hitPointsRecovered = result.updates["system.attributes.hp.value"] - this.healthData.startingHealth;

    return result;

  }

  _getRestHitDiceRecovery(results, forced = false) {

    if (forced || !getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) {
      return results;
    }

    results.hitDiceRecovered = Math.max(0, Math.min(this.actor.system.details.level, this.totalHitDice) - this.healthData.startingHitDice);
    results.updates = [];

    return results;

  }

  _getMaxHitDiceRecovery({ maxHitDice = undefined } = {}) {

    let multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
    let roundingMethod = lib.determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
    const actorLevel = this.actor.system.details.level;

    if (lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && lib.getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE)) {
      const armor = this.actor.items.find(item => item.type === "equipment" && item.system?.armor?.type === "heavy" && item.system.equipped);
      if (armor && !this.healthData.removeNonLightArmor) {
        multiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE);
        roundingMethod = lib.determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
      }
    }

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

    return { maxHitDice };

  }

  _getRestResourceRecovery(updates, { recoverShortRestResources = true, recoverLongRestResources = true } = {}) {

    const finishedRestUpdates = this._finishedRest(updates);

    const customRecoveryResources = Object.entries(this.actor.system.resources).filter(entry => {
      return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`)
    });

    const regularResources = Object.entries(this.actor.system.resources).filter(entry => {
      return Number.isNumeric(entry[1].max) && entry[1].value !== entry[1].max && !getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${entry[0]}.formula`)
    });

    for (const [key, resource] of customRecoveryResources) {
      if ((recoverShortRestResources && resource.sr) || (recoverLongRestResources && resource.lr)) {
        const customFormula = getProperty(this.actor, `${CONSTANTS.FLAGS.RESOURCES}.${key}.formula`);
        const customRoll = lib.evaluateFormula(customFormula, this.actor.getRollData());
        finishedRestUpdates[`system.resources.${key}.value`] = Math.min(resource.value + customRoll.total, resource.max);

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
        finishedRestUpdates[`system.resources.${key}.value`] = Number(resource.max);
      } else if (recoverLongRestResources && resource.lr) {
        const recoverResources = typeof multiplier === "string"
          ? lib.evaluateFormula(multiplier, { resource: foundry.utils.deepClone(resource) })?.total
          : Math.max(Math.floor(resource.max * multiplier), 1);

        finishedRestUpdates[`system.resources.${key}.value`] = Math.min(resource.value + recoverResources, resource.max);
      }
    }

    return finishedRestUpdates;

  }

  _getRestSpellRecovery(updates, { recoverSpells = true } = {}) {

    const customSpellRecovery = lib.getSetting(CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY);

    // Long rest
    if (recoverSpells) {

      const spellMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER);
      const pactMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER);

      for (let [level, slot] of Object.entries(this.actor.system.spells)) {
        if (!slot.override && !slot.max) continue;
        let multiplier = level === "pact" ? pactMultiplier : spellMultiplier;
        if (level !== "pact" && customSpellRecovery) {
          updates[`system.spells.${level}.value`] = 0;
          continue;
        }
        let spellMax = slot.override || slot.max;
        let recoverSpells = typeof multiplier === "string"
          ? Math.max(lib.evaluateFormula(multiplier, { slot: foundry.utils.deepClone(slot) })?.total, 1)
          : Math.max(Math.floor(spellMax * multiplier), multiplier ? 1 : multiplier);
        updates[`system.spells.${level}.value`] = Math.min(slot.value + recoverSpells, spellMax);
      }

      // Short rest
    } else {

      const pactMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER);

      for (let [level, slot] of Object.entries(this.actor.system.spells)) {
        if (!slot.override && !slot.max || level !== "pact") continue;
        let spellMax = slot.override || slot.max;
        let recoverSpells = typeof pactMultiplier === "string"
          ? Math.max(lib.evaluateFormula(pactMultiplier, { slot: foundry.utils.deepClone(slot) })?.total, 1)
          : Math.max(Math.floor(spellMax * pactMultiplier), pactMultiplier ? 1 : pactMultiplier);
        updates[`system.spells.${level}.value`] = Math.min(slot.value + recoverSpells, spellMax);
      }

    }

    if ((!this.longRest && this.spellData.feature) || (this.longRest && customSpellRecovery)) {

      if (!foundry.utils.isEmpty(this.recoveredSlots)) {

        for (const [slot, num] of Object.entries(this.recoveredSlots)) {
          const prop = `system.spells.spell${slot}.value`;
          updates[prop] = (updates[prop] || foundry.utils.getProperty(this.actor, prop) || 0) + num;
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

    return updates;

  }

  _getRestItemUsesRecovery(updates, args) {

    updates = this._recoverItemsUses(updates, args);

    if (!this.longRest && this.spellData.pointsSpent && this.spellData.feature) {
      updates.push({ _id: this.spellData.feature.id, "system.uses.value": 0 });
    }

    if(this.longRest && lib.getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER)) {
      Object.values(this.actor.classes).forEach(cls => {
        updates.push({ _id: cls.id, [CONSTANTS.FLAGS.REMOVE_HIT_DICE_BUFFER_FLAG]: null });
      })
    }

    return updates;

  }

  _recoverItemsUses(updates, args) {

    const { recoverLongRestUses, recoverDailyUses, rolls } = args;

    const longFeatsMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER);
    const longOthersMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER);

    const shortFeatsMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER);
    const shortOthersMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER);

    const dailyMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER);

    const actorRollData = this.actor.getRollData();

    for (const item of this.actor.items) {
      if (item.system.uses) {
        if (recoverDailyUses && item.system.uses.per === "day") {
          this._recoverItemUse(actorRollData, updates, item, dailyMultiplier, rolls);
        } else if (recoverLongRestUses && item.system.uses.per === "lr") {
          this._recoverItemUse(actorRollData, updates, item, item.type === "feat" ? longFeatsMultiplier : longOthersMultiplier, rolls);
        } else if (item.system.uses.per === "sr") {
          this._recoverItemUse(actorRollData, updates, item, item.type === "feat" ? shortFeatsMultiplier : shortOthersMultiplier, rolls);
        }
      } else if (recoverLongRestUses && item.system.recharge && item.system.recharge.value) {
        updates.push({ _id: item.id, "system.recharge.charged": true });
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


  _recoverItemUse(actor, updates, item, multiplier = 1.0, rolls) {

    const usesMax = item.system.uses.max;
    const usesCur = item.system.uses.value;

    if (usesCur === usesMax) return;

    const customRecovery = getProperty(item, CONSTANTS.FLAGS.RECOVERY_ENABLED);
    const customFormula = getProperty(item, CONSTANTS.FLAGS.RECOVERY_FORMULA);

    let recoverValue;
    if (customRecovery && customFormula) {
      const customRoll = lib.evaluateFormula(customFormula, {
        actor: actor,
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
        ? lib.evaluateFormula(multiplier, foundry.utils.deepClone(item.system))?.total
        : Math.max(Math.floor(usesMax * multiplier), multiplier ? 1 : 0);
      recoverValue = Math.max(0, Math.min(usesCur + recoverValue, usesMax));
    }

    const update = updates.find(update => update._id === item.id);

    if (update) {
      update["system.uses.value"] = recoverValue;
    } else {
      updates.push({
        _id: item.id,
        "system.uses.value": recoverValue
      });
    }

  }

  async _handleFoodAndWaterItems(updates) {

    if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return updates;

    if (!(this.longRest || this.restVariant === "gritty")) return updates;

    const {
      actorRequiredFood,
      actorRequiredWater
    } = lib.getActorConsumableValues(this.actor);

    if ((!actorRequiredFood && !actorRequiredWater) || !this.consumableData.items.length) return updates;

    let itemsToDelete = [];

    for (const consumableData of this.consumableData.items) {

      const item = consumableData.item;

      let updateIndex = updates.findIndex(update => update._id === item.id);
      let update = updates[updateIndex] ?? {
        _id: item.id
      };

      const newUses = getProperty(update, "system.uses.value") ?? consumableData.usesLeft - consumableData.amount;
      update["system.uses.value"] = newUses;

      if (updateIndex > -1) {
        updates.splice(updateIndex, 1);
      }

      const consumeQuantity = getProperty(item, 'system.uses.autoDestroy') ?? false;
      const quantity = getProperty(item, "system.quantity");

      if (consumeQuantity && quantity <= 1 && newUses === 0) {
        itemsToDelete.push(consumableData.id);
      } else {
        if (consumeQuantity && newUses === 0) {
          update["system.uses.value"] = getProperty(item, "system.uses.max") ?? 1;
          update["system.quantity"] = quantity - 1;
        }
        updates.push(update);
      }
    }

    await this.actor.deleteEmbeddedDocuments("Item", itemsToDelete);

    return updates;
  }

  static _setupFoodListeners() {

    Hooks.on("closeApplication", (app) => {
      if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;
      if (!app?.item) return;
      const item = app.item;
      const consumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
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
      if (getProperty(data, CONSTANTS.FLAGS.CONSUMABLE)?.enabled && !lib.isRealNumber(getProperty(item, "system.uses.max"))) {
        return this._patchConsumableItem(item, data);
      }
      if (!this.itemsListened.has(item.id)) return;
      const consumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
      if (!consumable?.enabled) return;
      return this._handleConsumableItem(item, data);
    });
  }

  static patchAllConsumableItems(actor) {

    const items = actor.items.filter(item => (item.name === "Rations" || item.name === "Waterskin") && getProperty(item, CONSTANTS.FLAGS.CONSUMABLE) === undefined);

    const updates = items.map(item => {
      if (item.name.startsWith("Rations")) {
        return {
          "_id": item.id,
          "system.uses.value": getProperty(item, "system.uses.value") ?? 1,
          "system.uses.max": getProperty(item, "system.uses.max") ?? 1,
          "system.uses.per": getProperty(item, "system.uses.per") ?? "charges",
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

  static _handleConsumableItem(item, data) {

    if (!lib.getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) return;

    const consumable = getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);

    const actorUpdates = {};

    let {
      actorRequiredFood,
      actorRequiredWater,
      actorFoodSatedValue,
      actorWaterSatedValue
    } = lib.getActorConsumableValues(item.parent);

    const currCharges = getProperty(item, "system.uses.value");
    const newCharges = getProperty(data, "system.uses.value") ?? (currCharges - 1.0);
    const chargesUsed = currCharges < newCharges ? currCharges : currCharges - newCharges;

    let message;

    if (consumable.type === "both") {

      actorUpdates[CONSTANTS.FLAGS.SATED_FOOD] = consumable.dayWorth ? 100000000000 : actorFoodSatedValue + chargesUsed;
      actorUpdates[CONSTANTS.FLAGS.SATED_WATER] = consumable.dayWorth ? 100000000000 : actorWaterSatedValue + chargesUsed;

      const localize = "REST-RECOVERY.Chat.ConsumedBoth" + (consumable.dayWorth ? "DayWorth" : "")
      message = "<p>" + game.i18n.format(localize, {
        actorName: item.parent.name,
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
        actorName: item.parent.name,
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
        actorName: item.parent.name,
        itemName: item.name,
        charges: chargesUsed
      }) + "</p>";

      message += actorUpdates[CONSTANTS.FLAGS.SATED_WATER] >= actorRequiredWater
        ? "<p>" + game.i18n.localize("REST-RECOVERY.Chat.SatedWater") + "</p>"
        : "<p>" + game.i18n.format("REST-RECOVERY.Chat.RequiredSatedWater", { units: actorRequiredWater - actorUpdates[CONSTANTS.FLAGS.SATED_WATER] }) + "</p>"
    }

    if (!foundry.utils.isEmpty(actorUpdates)) {
      item.parent.update(actorUpdates);
    }

    if (message) {
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
