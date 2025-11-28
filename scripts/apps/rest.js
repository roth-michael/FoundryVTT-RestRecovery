import CONSTANTS from "../constants";
import { capitalizeFirstLetter, customDialog, determineMultiplier, getConsumableItemsFromActor, getSetting, getTimeChanges, localize, settingsDialog } from "../lib/lib";
import RestWorkflow from "../rest-workflow";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class RestApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static PARTS = {
    dialog: {
      classes: ["dialog"],
      template: "modules/rest-recovery/templates/rest.hbs"
    }
  }

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
    tag: "form",
    classes: ["rest-recovery-rest-workflow", "standard-form"],
    position: {
      width: 400
    },
    actions: {
      startLongRest: RestApplication.#onStartLongRest,
      prevStep: RestApplication.#onPrevStep,
      nextStep: RestApplication.#onNextStep,
      finish: RestApplication.#onFinish,
      showCustomRulesDialog: RestApplication.#onShowCustomRulesDialog,
      rollHitDie: RestApplication.#onRollHitDie,
      autoRollHitDice: RestApplication.#onAutoRollHitDice,
      clickStep: RestApplication.#onClickStep,
      addConsumable: RestApplication.#onAddConsumable,
      removeConsumable: RestApplication.#onRemoveConsumable
    }
  }, { inplace: false })

  typeIndex = { "both": 2, "food": 1, "water": 0 };

  constructor(options = {}) {
    super(options);
    this.resolve = options.resolve;
    this.reject = options.reject;
    this.actor = options.actor;
    this.workflow = RestWorkflow.get(this.actor);
    const useCalendar = getSetting(CONSTANTS.SETTINGS.ENABLE_CALENDAR_INTEGRATION);
    const timeChanges = getTimeChanges(!!this.workflow.longRest);
    this.maxShortRests = getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS);
    this.currentShortRests = foundry.utils.getProperty(this.actor, CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS) || 0;
    this.enableShortRest = !this.workflow.longRest && ((this.maxShortRests === 0) || (this.currentShortRests < this.maxShortRests));
    this.activeStep = 0;
    this.showStartLongRestButton = this.workflow.longRest && getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);
    this.promptNewDay = !useCalendar
      && options.promptNewDay
      && (
        (this.workflow.longRest && (this.workflow.restVariant !== "gritty")) || 
        (!this.workflow.longRest && (this.workflow.restVariant !== "epic"))
      );
    if (this.workflow.longRest) {
      this.enableRollHitDice = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
    } else {
      this.enableRollHitDice = !getSetting(CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE);
    }
    this.newDay = options.request ? options.newDay : (useCalendar ? timeChanges.isNewDay : (options.newDay ?? true));
    this.minSpendHitDice = this.enableRollHitDice ? (getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0) : 0;
    let maxSpendHitDice;
    const maxHitDiceSetting = this.workflow.longRest ? CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND : CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND;
    const maxHitDiceSpendMultiplier = determineMultiplier(maxHitDiceSetting);
    if (typeof maxHitDiceSpendMultiplier === "string") {
      const rollFormula = Roll.replaceFormulaData(maxHitDiceSpendMultiplier, this.actor.getRollData(), { warn: true });
      maxSpendHitDice = Math.floor(new Roll(rollFormula).evaluateSync({ strict: false }).total);
    } else {
      maxSpendHitDice = Math.floor(this.actor.system.attributes.hd.max * maxHitDiceSpendMultiplier);
    }
    this.maxSpendHitDice = Math.max(this.minSpendHitDice, maxSpendHitDice);
    this.usingDefaultSettings = CONSTANTS.USING_DEFAULT_LONG_REST_SETTINGS();
    this.legacyRules = game.settings.get("dnd5e", "rulesVersion") === "legacy";
    this.showHealthBar = this.workflow.longRest && (this.enableRollHitDice || getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.FRACTIONS.FULL);
    this.showArmorCheckbox = getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && this.workflow.healthData.hasNonLightArmor;

    this.selectedHitDice = Object.entries(this.workflow.healthData.availableHitDice).filter(i => i[1])?.[0]?.[0];
    this.autoRollEnabled = getSetting(CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE);

    this.spellRecoveryText = localize(`REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.SpellSlot${this.workflow.spellData.feature ? "Feature" : "Rule"}`, {
      featureName: this.workflow.spellData?.feature?.name ?? ""
    });

    // Food/Water
    this.externalFoodSourceAccess = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_ACCESS);
    this.externalWaterSourceAccess = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_ACCESS);
    this.externalFoodSourceHasCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_HAS_COST);
    this.externalWaterSourceHasCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_HAS_COST);
    this.externalFoodSourceFullCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_FULL_COST);
    this.externalFoodSourceFullCurrency = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_FULL_COST_CURRENCY);
    this.externalWaterSourceFullCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_FULL_COST);
    this.externalWaterSourceFullCurrency = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_FULL_COST_CURRENCY);
    this.externalFoodSourceHalfCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_HALF_COST);
    this.externalFoodSourceHalfCurrency = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_HALF_COST_CURRENCY);
    this.externalWaterSourceHalfCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_HALF_COST);
    this.externalWaterSourceHalfCurrency = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_HALF_COST_CURRENCY);
    this.hasAccessToFood = false;
    this.hasAccessToWater = false;
    this.halfFood = false;
    this.halfWater = false;
    this.foodCost = 0;
    this.foodCurrency = "gp";
    this.waterCost = 0;
    this.waterCurrency = "gp";
    this.newFoodSatedValue = this.workflow.foodWaterRequirement.actorFoodSatedValue;
    this.newWaterSatedValue = this.workflow.foodWaterRequirement.actorWaterSatedValue;
    this.consumableItems = [];
    this.actorConsumableItems = [];
    this.selectedItem = "";
    this.enableAutomatedExhaustion = getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION);
    this.actorDaysWithoutFood = foundry.utils.getProperty(this.actor, CONSTANTS.FLAGS.STARVATION) ?? 0;
    this.actorExhaustionThreshold = new Roll(Roll.replaceFormulaData(getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER), this.actor.getRollData())).evaluateSync({strict: false})?.total ?? 4;
    this.halfRequiredWater = this.workflow.foodWaterRequirement.actorRequiredWater / 2;
    this.halfWaterSaveDC = getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);
    this.actorExhaustion = foundry.utils.getProperty(this.actor, "system.attributes.exhaustion") ?? 0;

    if (getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER)) {
      RestWorkflow.patchAllConsumableItems(this.actor).then(() => {
        this.refreshConsumableItems();
        this.calculateCanAfford();
      });
    }
  }

  get title() {
    return `${localize(`DND5E.REST.${this.workflow.longRest ? "Long" : "Short"}.Label`)}: ${this.actor.name}`;
  }

  get enableRollButton() {
    return this.workflow.healthData.availableHitDice[this.selectedHitDice] > 0
      && this.workflow.currHP < this.workflow.maxHP
      && ((this.maxSpendHitDice === 0) || (this.workflow.healthData.hitDiceSpent < this.maxSpendHitDice))
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.workflow = this.workflow;
    context.maxShortRests = this.maxShortRests;
    context.currentShortRests = this.currentShortRests;
    context.enableShortRest = this.enableShortRest;
    context.activeStep = this.activeStep;
    context.activeStepPartial = this.workflow.steps[this.activeStep].partial;
    context.maxIndex = this.workflow.steps.length - 1;
    context.remainingShortRests = this.maxShortRests - this.currentShortRests;
    context.showStartLongRestButton = this.showStartLongRestButton;
    context.promptNewDay = this.promptNewDay;
    context.newDay = this.newDay;
    context.minSpendHitDice = this.minSpendHitDice;
    context.remainMinSpend = this.minSpendHitDice - this.workflow.healthData.hitDiceSpent;
    context.maxSpendHitDice = this.maxSpendHitDice;
    context.remainMaxSpend = this.maxSpendHitDice - this.workflow.healthData.hitDiceSpent;
    context.usingDefaultSettings = this.usingDefaultSettings;
    context.legacyRules = this.legacyRules;
    context.showHealthBar = this.showHealthBar;
    context.showArmorCheckbox = this.showArmorCheckbox;
    context.enableRollHitDice = this.enableRollHitDice;

    // context.potentialMax = 0;
    // context.maxLeft = 0;
    context.potentialMin = 100 * this.workflow.healthData.hitPointsToRegainFromRest / this.workflow.maxHP;
    context.progressBar = 100 * this.workflow.currHP / this.workflow.maxHP;
    context.hpToRegain = Math.min(this.workflow.healthData.hitPointsToRegainFromRest, this.workflow.maxHP - this.workflow.currHP);

    context.selectedHitDice = this.selectedHitDice;
    context.enableRollButton = this.enableRollButton;
    context.autoRollEnabled = this.autoRollEnabled;
    context.disableAutoButton = !this.workflow.healthData.enableAutoRollHitDice;

    context.spellRecoveryText = this.spellRecoveryText;
    context.slotsLeft = (this.workflow.spellData?.pointsTotal ?? 0) - (this.workflow.spellData?.pointsSpent ?? 0);
    
    // Food/Water
    context.canAfford = this.canAfford; // TODO: set somewhere
    context.remainingFood = this.workflow.foodWaterRequirement.actorRequiredFood - this.workflow.foodWaterRequirement.actorFoodSatedValue;
    context.remainingWater = this.workflow.foodWaterRequirement.actorRequiredWater - this.workflow.foodWaterRequirement.actorWaterSatedValue;
    context.foodRequirementText = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodRequirement", {
      food: Math.max(0, this.workflow.foodWaterRequirement.actorRequiredFood - this.newFoodSatedValue)
    });
    context.waterRequirementText = localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.WaterRequirement", {
      water: Math.max(0, this.workflow.foodWaterRequirement.actorRequiredWater - this.newWaterSatedValue)
    });
    context.externalFoodSourceAccess = this.externalFoodSourceAccess;
    context.externalWaterSourceAccess = this.externalWaterSourceAccess;
    context.hasAccessToFood = this.hasAccessToFood;
    context.hasAccessToWater = this.hasAccessToWater;
    context.halfFood = this.halfFood;
    context.halfWater = this.halfWater;
    context.externalFoodSourceHasCost = this.externalFoodSourceHasCost;
    context.externalWaterSourceHasCost = this.externalWaterSourceHasCost;
    context.foodCost = this.foodCost;
    context.waterCost = this.waterCost;
    context.foodCurrency = this.foodCurrency;
    context.waterCurrency = this.waterCurrency;
    context.newFoodSatedValue = this.newFoodSatedValue;
    context.newWaterSatedValue = this.newWaterSatedValue;
    context.consumableItems = this.consumableItems;
    context.actorConsumableItems = this.actorConsumableItems;
    context.selectedItem = this.selectedItem;
    context.enableAutomatedExhaustion = this.enableAutomatedExhaustion;
    context.actorDaysWithoutFood = this.actorDaysWithoutFood;
    context.actorExhaustionThreshold = this.actorExhaustionThreshold;
    context.foodAlmostExhaustionDays = (this.actorExhaustionThreshold - this.actorDaysWithoutFood) * ((this.newFoodSatedValue > 0) && (this.newFoodSatedValue <= (this.workflow.foodWaterRequirement.actorRequiredFood / 2)) ? 2 : 1);
    context.halfRequiredWater = this.halfRequiredWater;
    context.halfWaterSaveDC = this.halfWaterSaveDC;
    context.actorExhaustion = this.actorExhaustion;

    return context;
  }

  async _onRender(context, options) {
    new foundry.applications.ux.DragDrop.implementation({
      dropSelector: ".dragDropBox",
      permissions: {
        dragstart: () => false,
        drop: () => true
      },
      callbacks: {
        drop: this._onDrop.bind(this)
      }
    }).bind(this.element);
    return super._onRender(context, options);
  }

  async _onDrop(event) {
    event.preventDefault();
    let drop;
    try {
      drop = JSON.parse(event.dataTransfer.getData("text/plain"));
    } catch (err) {
      return false;
    }

    if (drop.type !== "Item") return;
    const dropSource = fromUuidSync(drop.uuid) ?? game.actors.get(drop.actorId);
    const actor = dropSource?.parent ?? dropSource;
    if (!actor) return;
    this._addConsumable(dropSource.id);
  }

  _onClose(options) {
    if (!this.resolved) this.reject();
  }

  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);
    const target = event.target;
    if (target?.dataset?.step === "spell-recovery") {
      const { level, index } = target.dataset;
      this.workflow.spendSpellPoint(level, index, target.checked);
    } else if (target?.name === "removeNonLightArmor") {
      this.workflow.healthData.removeNonLightArmor = target.checked;
    } else if (target?.name === "hasAccessToFood") {
      this.hasAccessToFood = target.checked;
      this.halfFood = this.hasAccessToFood ? this.externalFoodSourceAccess : false;
      this.calcFood();
    } else if (target?.name === "hasAccessToWater") {
      this.hasAccessToWater = target.checked;
      this.halfWater = this.hasAccessToWater ? this.externalWaterSourceAccess : false;
      this.calcWater();
    } else if (target?.name === "halfFood") {
      this.halfFood = target.value;
      this.calcFood();
    } else if (target?.name === "halfWater") {
      this.halfWater = target.value;
      this.calcWater();
    } else if (target?.name?.startsWith("consumable")) {
      const itemId = target.name.split("-")[1];
      const item = this.consumableItems.find(i => i.id === itemId);
      item.amount = Math.clamp(target.value, 1, item.totalUsesLeft);
      if (["both", "food"].includes(item.type)) this.calcFood();
      if (["both", "water"].includes(item.type)) this.calcWater();
    } else if (target?.name === "selectedItem") {
      this.selectedItem = target.value;
    } else if (target?.name === "hd") {
      this.selectedHitDice = target.value;
    }
    this.render();
  }

  static async #onStartLongRest() {
    this.showStartLongRestButton = false;
    await this.workflow.regainHitDice();
    this.render();
  }

  static #onPrevStep() {
    this.activeStep = Math.max(0, this.activeStep - 1);
    this.render();
  }

  static #onNextStep() {
    this.activeStep = Math.min(this.workflow.steps.length, this.activeStep + 1);
    this.render();
  }

  static async #onFinish() {
    if (!this.workflow.longRest) {
      if (this.minSpendHitDice > 0 && this.workflow.healthData.hitDiceSpent < this.minSpendHitDice) {
        if (this.workflow.totalHitDice <= 0) {
          await customDialog({
            title: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Title"),
            icon: "fa-solid fa-exclamation-triangle",
            header: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Title"),
            content: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Content", { num_dice: this.minSpendHitDice - this.workflow.healthData.hitDiceSpent })
          }, true);
          return false;
        }
        const doContinue = await customDialog({
          title: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Title"),
          icon: "fa-solid fa-exclamation-triangle",
          header: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Title"),
          content: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Content", { num_dice: this.minSpendHitDice - this.workflow.healthData.hitDiceSpent })
        });
        if (!doContinue) return false;
        await this.rollHitDice();
      }
      if (this.workflow.healthPercentage <= 0.75 && this.workflow.healthRegained === 0 && this.workflow.totalHitDice > 0 && this.enableRollHitDice) {
        const doContinue = await customDialog({
          title: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
          header: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
          content: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Content"),
          icon: "fa-solid fa-exclamation-triangle"
        });
        if (!doContinue) return false;
      }
    } else if (this.enableRollHitDice
      && this.workflow.healthData.hitDiceSpent === 0
      && ((this.workflow.currHP + this.workflow.healthData.hitPointsToRegainFromRest) / this.workflow.maxHP) < 0.75
      && this.workflow.healthRegained === 0
      && this.workflow.totalHitDice > 0
    ) {
      const doContinue = await customDialog({
        title: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
        icon: "fa-solid fa-exclamation-triangle",
        header: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
        content: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Content")
      });
      if (!doContinue) return false;
    }
    this.resolve(this.newDay);
    this.resolved = true;
    this.close();
  }

  static #onShowCustomRulesDialog() {
    settingsDialog(localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title"));
  }

  static async #onRollHitDie(event) {
    await this.rollHitDice(event);
  }

  async rollHitDice(event) {
    const rolled = await this.workflow.rollHitDice(this.selectedHitDice, event?.ctrlKey === getSetting(CONSTANTS.SETTINGS.QUICK_HD_ROLL));
    if (!rolled) return;
    this.render();
  }

  static async #onAutoRollHitDice() {
    await this.workflow.autoSpendHitDice();
    this.render();
  }

  static #onClickStep(event) {
    const clickedStep = event.target?.dataset.step ?? this.activeStep;
    this.activeStep = Number(clickedStep);
    this.render();
  }

  // Food/Water
  calcFood() {
    if (this.halfFood === "full") {
      this.newFoodSatedValue = this.workflow.foodWaterRequirement.actorRequiredFood;
      this.foodCost = this.externalFoodSourceFullCost;
      this.foodCurrency = this.externalFoodSourceFullCurrency;
    } else if (this.halfFood === "half") {
      this.newFoodSatedValue = this.workflow.foodWaterRequirement.actorFoodSatedValue + (this.workflow.foodWaterRequirement.actorRequiredFood / 2);
      this.foodCost = this.externalFoodSourceHalfCost;
      this.foodCurrency = this.externalFoodSourceHalfCurrency;
    } else {
      this.newFoodSatedValue = this.workflow.foodWaterRequirement.actorFoodSatedValue;
      this.foodCost = 0;
    }
    this.calculateAmountOfItems();
    this.refreshConsumableItems();
    this.calculateCanAfford();
  }

  calcWater() {
    if (this.halfWater === "full") {
      this.newWaterSatedValue = this.workflow.foodWaterRequirement.actorRequiredWater;
      this.waterCost = this.externalWaterSourceFullCost;
      this.waterCurrency = this.externalWaterSourceFullCurrency;
    } else if (this.halfWater === "half") {
      this.newWaterSatedValue = this.workflow.foodWaterRequirement.actorWaterSatedValue + (this.workflow.foodWaterRequirement.actorRequiredWater / 2);
      this.waterCost = this.externalWaterSourceHalfCost;
      this.waterCurrency = this.externalWaterSourceHalfCurrency;
    } else {
      this.newWaterSatedValue = this.workflow.foodWaterRequirement.actorWaterSatedValue;
      this.waterCost = 0;
    }
    this.calculateAmountOfItems();
    this.refreshConsumableItems();
    this.calculateCanAfford();
  }

  calculateCanAfford() {
    let actorWealth = 0;
    let necessaryWealth = 0;
    for (const [currencyKey, currencyData] of Object.entries(CONFIG.DND5E.currencies)) {
      actorWealth += this.actor.system.currency[currencyKey] / currencyData.conversion;
      if (this.externalFoodSourceHasCost && this.foodCurrency === currencyKey) {
        necessaryWealth += this.foodCost / currencyData.conversion;
      }
      if (this.externalWaterSourceHasCost && this.waterCurrency === currencyKey) {
        necessaryWealth += this.waterCost / currencyData.conversion;
      }
    }
    this.canAfford = (actorWealth >= necessaryWealth);
    this.workflow.foodAndWaterCost = necessaryWealth;
  }

  _addConsumable(itemId) {
    const item = this.actor.items.get(itemId);
    if (!item) return;

    const consumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);
    if (!CONSTANTS.CONSUMABLE_TYPES.includes(item.system.type?.subtype)) return;

    const foodRequired = Math.max(0.5, this.workflow.foodWaterRequirement.actorRequiredFood - this.newFoodSatedValue);
    const waterRequired = Math.max(0.5, this.workflow.foodWaterRequirement.actorRequiredWater, this.newWaterSatedValue);
    const maxBothRequired = Math.max(foodRequired, waterRequired);
    const consumeQuantity = foundry.utils.getProperty(item, "system.uses.autoDestroy") ?? false;

    const maxUses = foundry.utils.getProperty(item, "system.uses.max") ?? 1;
    const usesSpent = foundry.utils.getProperty(item, "system.uses.spent") ?? 1;
    const quantity = foundry.utils.getProperty(item, "system.quantity") ?? 1;
    let countsAs = 1;
    let requiredNum = 1;
    if (consumable.dayWorth) {
      switch (item.system.type.subtype) {
        case "both":
          requiredNum = maxBothRequired;
          break;
        case "food":
          requiredNum = foodRequired;
          break;
        case "water":
          requiredNum = waterRequired;
          break;
      }
      countsAs = Math.ceil(requiredNum / (this.workflow.restVariant === "gritty" ? 7 : 1));
    }

    const totalUsesLeft = consumeQuantity ? ((maxUses * quantity) - usesSpent) : (maxUses - usesSpent);

    if (totalUsesLeft <= 0) {
      ui.notifications.warn(localize("REST-RECOVERY.Warnings.ItemNoUses", { item: item.name }));
      return;
    }

    const existingItem = this.consumableItems.find(existingItem => existingItem.id === item.id);
    if (existingItem) {
      existingItem.amount += 1;
      return;
    }

    const consumableItem = {
      id: item.id,
      item,
      index: this.typeIndex[item.system.type.subtype],
      fullName: `${item.name} (${localize(`REST-RECOVERY.Misc.${capitalizeFirstLetter(item.system.type.subtype)}`)}) - ${totalUsesLeft} left`,
      amount: Math.ceil(requiredNum / countsAs),
      countsAs,
      totalUsesLeft,
      quantity,
      consumable,
      type: item.system.type.subtype,
      capitalizedType: capitalizeFirstLetter(item.system.type.subtype)
    };

    consumableItem["amount"] = Math.min(totalUsesLeft, consumableItem["amount"]);

    this.consumableItems.push(consumableItem);
    this.consumableItems.sort((a, b) => {
      if (a.index === b.index) {
        return b.name > a.name ? -1 : 1;
      }
      return b.index - a.index;
    });

    this.calculateAmountOfItems();
    this.refreshConsumableItems();
    this.render();
  }

  calculateAmountOfItems() {
    if (!this.hasAccessToFood) {
      this.newFoodSatedValue = this.workflow.foodWaterRequirement.actorFoodSatedValue;
      this.foodCost = 0;
    }

    if (!this.hasAccessToWater) {
      this.newWaterSatedValue = this.workflow.foodWaterRequirement.actorWaterSatedValue;
      this.waterCost = 0;
    }

    for (const item of this.consumableItems) {
      if (!this.hasAccessToFood && (["both", "food"].includes(item.type))) {
        this.newFoodSatedValue += item.countsAs * item.amount;
      }
      if (!this.hasAccessToWater && (["both", "water"].includes(item.type))) {
        this.newWaterSatedValue += item.countsAs * item.amount;
      }
    }

    this.workflow.consumableData = {
      items: this.consumableItems,
      hasAccessToFood: this.hasAccessToFood,
      hasAccessToWater: this.hasAccessToWater,
      halfFood: this.halfFood,
      halfWater: this.halfWater
    }
  }

  refreshConsumableItems() {
    this.actorConsumableItems = getConsumableItemsFromActor(this.actor)
      .filter(item => !this.consumableItems.find(consumableItem => consumableItem.id === item.id))
      .sort((a, b) => {
        if (a.type === b.type) {
          return b.name > a.name ? -1 : 1;
        }
        return this.typeIndex[b.type] - this.typeIndex[a.type];
      });
    if (!this.actorConsumableItems.find(item => item.id === this.selectedItem)) {
      this.selectedItem = this.actorConsumableItems[0]?.id ?? "";
    }
  }

  static #onAddConsumable() {
    this._addConsumable(this.selectedItem);
  }

  static #onRemoveConsumable(event) {
    const itemId = event.target?.dataset?.id;
    const idx = this.consumableItems.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      this.consumableItems.splice(idx, 1);
    }
    this.calculateAmountOfItems();
    this.refreshConsumableItems();
    this.render();
  }
}