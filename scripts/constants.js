const CONSTANTS = {
  MODULE_NAME: "rest-recovery",
  FLAG_NAME: "data",
  EXHAUSTION_CORE_PATH: "systems/dnd5e/icons/svg/statuses/exhaustion.svg",
  EXHAUSTION_ONE_DND_PATH: "modules/rest-recovery/assets/exhaustion.svg",
  STYLE_ELEMENT_ID: "rest-recovery-style-element",
  SETTINGS: {
    
    MIGRATION_VERSION: "migration-version",

    /*-------------------------------------------*
     *          Global Module Settings           *
     *-------------------------------------------*/
    MODULE_PROFILES: "module-profiles",
    ACTIVE_MODULE_PROFILE: "active-module-profile",
    PROMPT_REST_CONFIG: "prompt-rest-config",

    CUSTOM_LONG_REST_DURATION_HOURS: "custom-long-rest-duration",
    CUSTOM_SHORT_REST_DURATION_HOURS: "custom-short-rest-duration",
    REST_VARIANT: "rest-variant",

    /*-------------------------------------------*
     *           General Rest Settings           *
     *-------------------------------------------*/
    QUICK_HD_ROLL: "quick-hd-roll",
    SHOW_PLAYER_LIST_REST_BUTTON: "show-player-list-rest-button",
    ENABLE_AUTO_ROLL_HIT_DICE: "enable-auto-roll-hit-dice",
    ENABLE_PROMPT_REST_TIME_PASSING: "enable-prompt-rest-time-passing",
    ENABLE_SIMPLE_CALENDAR_INTEGRATION: "enable-simple-calendar-integration",
    ENABLE_SIMPLE_CALENDAR_NOTES: "enable-simple-calendar-notes",
    SIMPLE_CALENDAR_NOTES_ONLY_PROMPTED: "simple-calendar-notes-only-prompted",
    PREVENT_USER_REST: "prevent-user-rest",
    PERIAPT_ROLL_MECHANICS: "periapt-roll-mechanics",
    HIT_DIE_ROLL_FORMULA: "hit-die-roll-formula",
    HD_EFFECTIVE_MULTIPLIER: "hd-effective-multiplier",

    /*-------------------------------------------*
     *            Short Rest Settings            *
     *-------------------------------------------*/
    IGNORE_INACTIVE_PLAYERS: "ignore-inactive-players",
    MAX_SHORT_RESTS: "max-short-rests-per-long-rest",
    MIN_HIT_DIE_SPEND: "minimum-hit-die-spend",
    MAX_HIT_DICE_SPEND: "maximum-hit-die-spend",
    DISABLE_SHORT_REST_HIT_DICE: "disable-short-rest-hit-dice",
    SHORT_RESOURCES_MULTIPLIER: "short-rest-recovery-resources",
    SHORT_USES_OTHERS_MULTIPLIER: "short-rest-recovery-uses-others",
    SHORT_USES_FEATS_MULTIPLIER: "short-rest-recovery-uses-feats",
    SHORT_PACT_SPELLS_MULTIPLIER: "short-rest-recovery-pact-spells",
    SONG_OF_REST_MULTIUSE: "song-of-rest-multiuse",
    SHORT_HP_MULTIPLIER: "short-recovery-hitpoints",

    MAX_HIT_DICE_SPEND_FORMULA: "max-hit-die-spend-formula",
    SHORT_RESOURCES_MULTIPLIER_FORMULA: "short-recovery-resources-formula",
    SHORT_USES_OTHERS_MULTIPLIER_FORMULA: "short-recovery-uses-others-formula",
    SHORT_USES_FEATS_MULTIPLIER_FORMULA: "short-recovery-uses-feats-formula",
    SHORT_PACT_SPELLS_MULTIPLIER_FORMULA: "short-recovery-pact-spells-formula",
    SHORT_HP_MULTIPLIER_FORMULA: "short-recovery-hitpoints-formula",

    /*-------------------------------------------*
     *             Long Rest Settings            *
     *-------------------------------------------*/
    AUTOMATE_EXHAUSTION: "automate-exhaustion",
    EXHAUSTION_INTEGRATION: "exhaustion-integration",
    ONE_DND_EXHAUSTION: "one-dnd-exhaustion",
    PREVENT_LONG_REST_EXHAUSTION_RECOVERY: "long-rest-prevent-exhaustion-recovery",
    LONG_REST_ROLL_HIT_DICE: "long-rest-roll-hit-dice",
    PRE_REST_REGAIN_HIT_DICE: "pre-rest-regain-hit-dice",
    PREVENT_REST_REGAIN_HIT_DICE: "prevent-rest-regain-hit-dice",
    PRE_REST_REGAIN_BUFFER: "pre-rest-regain-hit-dice-buffer",
    LONG_MAX_HIT_DICE_SPEND: "long-rest-maximum-hit-die-spend",
    HD_ROUNDING: "recovery-rounding",
    HP_MULTIPLIER: "recovery-hitpoints",
    HD_MULTIPLIER: "recovery-hitdice",
    LONG_RESOURCES_MULTIPLIER: "recovery-resources",
    LONG_SPELLS_MULTIPLIER: "recovery-spells",
    LONG_CUSTOM_SPELL_RECOVERY: "long-recovery-custom-spell-points",
    LONG_PACT_SPELLS_MULTIPLIER: "long-recovery-pact-spells",
    LONG_USES_OTHERS_MULTIPLIER: "recovery-uses-others",
    LONG_USES_FEATS_MULTIPLIER: "recovery-uses-feats",
    LONG_USES_DAILY_MULTIPLIER: "recovery-day",

    LONG_REST_ARMOR_AUTOMATION: "long-rest-heavy-armor-automation",
    LONG_REST_ARMOR_HIT_DICE: "long-rest-heavy-armor-recovery-hitdice",
    LONG_REST_ARMOR_EXHAUSTION: "long-rest-heavy-armor-exhaustion",

    LONG_MAX_HIT_DICE_SPEND_FORMULA: "long-max-hit-die-spend-formula",
    HP_MULTIPLIER_FORMULA: "long-recovery-hitpoints-formula",
    HD_MULTIPLIER_FORMULA: "long-recovery-hitdice-formula",
    LONG_RESOURCES_MULTIPLIER_FORMULA: "long-recovery-resources-formula",
    LONG_SPELLS_MULTIPLIER_FORMULA: "long-recovery-spells-formula",
    LONG_PACT_SPELLS_MULTIPLIER_FORMULA: "long-pact-recovery-spells-formula",
    LONG_USES_OTHERS_MULTIPLIER_FORMULA: "long-recovery-uses-others-formula",
    LONG_USES_FEATS_MULTIPLIER_FORMULA: "long-recovery-uses-feats-formula",
    LONG_USES_DAILY_MULTIPLIER_FORMULA: "long-recovery-day-formula",
    LONG_REST_ARMOR_HIT_DICE_FORMULA: "long-recovery-heavy-armor-hitdice-formula",

    /*-------------------------------------------*
     *               Item names                  *
     *-------------------------------------------*/
    WIZARD_CLASS: "wizard-class-name",
    DRUID_CLASS: "druid-class-name",
    BARD_CLASS: "bard-class-name",
    ARCANE_RECOVERY: "arcane-recovery-feature-name",
    POWER_SURGE: "power-surge-feature-name",
    NATURAL_RECOVERY: "natural-recovery-feature-name",
    SONG_OF_REST: "song-of-rest-name",
    CHEF_FEAT: "chef-feat-name",
    CHEF_TOOLS: "chef-tools-name",
    DURABLE_FEAT: "durable-feat-name",
    PERIAPT_ITEM: "periapt-item-name",
    WOUND_CLOSURE_BLESSING: "wound-closure-blessing-name",
    BLACK_BLOOD_FEATURE: "black-blood-feature-name",

    /*-------------------------------------------*
     *          Food and Water Settings          *
     *-------------------------------------------*/
    ENABLE_FOOD_AND_WATER: "enable-food-and-water",
    FOOD_UNITS_PER_DAY: "food-units-per-day",
    WATER_UNITS_PER_DAY: "water-units-per-day",
    EXTERNAL_FOOD_ACCESS: "external-food-access",
    EXTERNAL_FOOD_HAS_COST: "external-food-has-cost",
    EXTERNAL_FOOD_FULL_COST: "external-food-full-cost",
    EXTERNAL_FOOD_HALF_COST: "external-food-half-cost",
    EXTERNAL_FOOD_FULL_COST_CURRENCY: "external-food-full-cost-currency",
    EXTERNAL_FOOD_HALF_COST_CURRENCY: "external-food-half-cost-currency",
    EXTERNAL_WATER_ACCESS: "external-water-access",
    EXTERNAL_WATER_HAS_COST: "external-water-has-cost",
    EXTERNAL_WATER_FULL_COST: "external-water-full-cost",
    EXTERNAL_WATER_HALF_COST: "external-water-half-cost",
    EXTERNAL_WATER_FULL_COST_CURRENCY: "external-water-full-cost-currency",
    EXTERNAL_WATER_HALF_COST_CURRENCY: "external-water-half-cost-currency",
    AUTOMATE_FOODWATER_EXHAUSTION: "automate-foodwater-exhaustion",
    NO_FOOD_DURATION_MODIFIER: "no-food-duration-modifier",
    HALF_WATER_SAVE_DC: "half-water-save-dc",
    FOODWATER_PROMPT_NEWDAY: "foodwater-prompt-newday",
  },
  
  FRACTIONS: {
    FULL: "full",
    HALF: "half",
    QUARTER: "quarter",
    NONE: "none",
    CUSTOM: "custom_formula",
    
    UP: "up",
    DOWN: "down",
  },
  
  MODULES: {
    DFREDS: "dfreds-convenient-effects",
    ALTERNATIVE_EXHAUSTION: "alternative-exhaustion-5e"
  },

  PERIAPT_MECHANICS: {
    MULTIPLY_ROLL: "multiply-roll",
    MULTIPLY_TOTAL: "multiply-total"
  },

  REST_VARIANTS: {
    NORMAL: "normal",
    GRITTY: "gritty",
    EPIC: "epic",
    CUSTOM: "custom"
  },

  ROLL_FORMULAS: {
    NORMAL: "normal",
    ADVANTAGE: "advantage",
    MAXIMIZED: "maximized"
  },

  CURRENCIES: {
    COPPER: "cp",
    ELECTRUM: "ep",
    GOLD: "gp",
    PLATINUM: "pp",
    SILVER: "sp"
  },
  
  USING_DEFAULT_LONG_REST_SETTINGS() {
    const settings = this.GET_DEFAULT_SETTINGS();
    for (const [key, setting] of Object.entries(settings)) {
      if (setting.group !== "longrest") continue;
      if (game.settings.get(this.MODULE_NAME, key) !== setting.default) return false;
    }
    return true;
  },
  
  GET_DEFAULT_SETTINGS() {
    return foundry.utils.deepClone(CONSTANTS.DEFAULT_SETTINGS)
  }
}

CONSTANTS.DEFAULT_SETTINGS = {
  
  /*-------------------------------------------*
   *          Global Module Settings           *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.MIGRATION_VERSION]: {
    scope: "world",
    config: false,
    default: "0.0.0",
    type: String
  },
  [CONSTANTS.SETTINGS.PROMPT_REST_CONFIG]: {
    scope: "client",
    config: false,
    default: [],
    type: Array
  },
  [CONSTANTS.SETTINGS.CUSTOM_LONG_REST_DURATION_HOURS]: {
    scope: "world",
    config: false,
    default: 8,
    type: Number
  },
  [CONSTANTS.SETTINGS.CUSTOM_SHORT_REST_DURATION_HOURS]: {
    scope: "world",
    config: false,
    default: 1,
    type: Number
  },
  [CONSTANTS.SETTINGS.REST_VARIANT]: {
    scope: "world",
    config: false,
    default: CONSTANTS.REST_VARIANTS.NORMAL,
    type: String,
    choices: {
      [CONSTANTS.REST_VARIANTS.NORMAL]: "SETTINGS.5eRestPHB",
      [CONSTANTS.REST_VARIANTS.GRITTY]: "SETTINGS.5eRestGritty",
      [CONSTANTS.REST_VARIANTS.EPIC]: "SETTINGS.5eRestEpic",
      [CONSTANTS.REST_VARIANTS.CUSTOM]: "REST-RECOVERY.Dialogs.QuickSetup.5eRestCustom.Title",
    }
  },
  
  /*-------------------------------------------*
   *           General Rest Settings           *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.PREVENT_USER_REST]: {
    name: "REST-RECOVERY.Settings.General.PreventUserRest.Title",
    hint: "REST-RECOVERY.Settings.General.PreventUserRest.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.General.EnableAutoRollButton.Title",
    hint: "REST-RECOVERY.Settings.General.EnableAutoRollButton.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: true,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.ENABLE_PROMPT_REST_TIME_PASSING]: {
    name: "REST-RECOVERY.Settings.General.EnablePromptRestTimePassing.Title",
    hint: "REST-RECOVERY.Settings.General.EnablePromptRestTimePassing.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: true,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION]: {
    name: "REST-RECOVERY.Settings.General.EnableSimpleCalendarIntegration.Title",
    hint: "REST-RECOVERY.Settings.General.EnableSimpleCalendarIntegration.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: false,
    type: Boolean,
    moduleIntegration: { label: "Simple Calendar", key: "foundryvtt-simple-calendar" },
    validate: () => {
      return !game.modules.get("foundryvtt-simple-calendar")?.active;
    },
  },
  [CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_NOTES]: {
    name: "REST-RECOVERY.Settings.General.EnableSimpleCalendarNotes.Title",
    hint: "REST-RECOVERY.Settings.General.EnableSimpleCalendarNotes.Hint",
    hint2: "REST-RECOVERY.Settings.General.EnableSimpleCalendarNotes.Hint2",
    scope: "world",
    group: "general",
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION],
    moduleIntegration: { label: "Simple Calendar", key: "foundryvtt-simple-calendar" },
    validate: (settings) => {
      return !(settings.get(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION).value && game.modules.get("foundryvtt-simple-calendar")?.active);
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.SIMPLE_CALENDAR_NOTES_ONLY_PROMPTED]: {
    name: "REST-RECOVERY.Settings.General.SimpleCalendarNotesOnlyPrompted.Title",
    hint: "REST-RECOVERY.Settings.General.SimpleCalendarNotesOnlyPrompted.Hint",
    scope: "world",
    group: "general",
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION, CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_NOTES],
    moduleIntegration: { label: "Simple Calendar", key: "foundryvtt-simple-calendar" },
    validate: (settings) => {
      return !(settings.get(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION).value && settings.get(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_NOTES).value && game.modules.get("foundryvtt-simple-calendar")?.active);
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PERIAPT_ROLL_MECHANICS]: {
    name: "REST-RECOVERY.Settings.General.PeriaptRollMechanics.Title",
    hint: "REST-RECOVERY.Settings.General.PeriaptRollMechanics.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: CONSTANTS.PERIAPT_MECHANICS.MULTIPLY_ROLL,
    type: String,
    choices: {
      [CONSTANTS.PERIAPT_MECHANICS.MULTIPLY_ROLL]: "REST-RECOVERY.Settings.General.PeriaptRollMechanics.Options.MultiplyRoll",
      [CONSTANTS.PERIAPT_MECHANICS.MULTIPLY_TOTAL]: "REST-RECOVERY.Settings.General.PeriaptRollMechanics.Options.MultiplyTotal",
    }
  },
  [CONSTANTS.SETTINGS.HIT_DIE_ROLL_FORMULA]: {
    name: "REST-RECOVERY.Settings.General.HitDieRollFormula.Title",
    hint: "REST-RECOVERY.Settings.General.HitDieRollFormula.Hint",
    scope: "world",
    group: "general",
    config: false,
    type: String,
    choices: {
      [CONSTANTS.ROLL_FORMULAS.NORMAL]: "REST-RECOVERY.RollFormula.Normal",
      [CONSTANTS.ROLL_FORMULAS.ADVANTAGE]: "REST-RECOVERY.RollFormula.Advantage",
      [CONSTANTS.ROLL_FORMULAS.MAXIMIZED]: "REST-RECOVERY.RollFormula.Maximized",
    },
    default: CONSTANTS.ROLL_FORMULAS.NORMAL
  },
  [CONSTANTS.SETTINGS.HD_EFFECTIVE_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.General.HDRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.General.HDRecoveryFraction.Hint",
    scope: "world",
    group: "general",
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full"
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  
  /*-------------------------------------------*
   *            Short Rest Settings            *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS]: {
    name: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Hint",
    scope: "world",
    group: "shortrest",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.MAX_SHORT_RESTS]: {
    name: "REST-RECOVERY.Settings.ShortRest.MaxShortRests.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.MaxShortRests.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    config: false,
    default: 0,
    type: Number
  },
  [CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.ShortRest.NoHitDice.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.NoHitDice.Hint",
    scope: "world",
    group: "shortrest",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND]: {
    name: "REST-RECOVERY.Settings.ShortRest.MinHitDieSpend.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.MinHitDieSpend.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE],
    validate: (settings) => {
      return settings.get(CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE).value;
    },
    config: false,
    default: 0,
    type: Number
  },
  [CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND]: {
    name: "REST-RECOVERY.Settings.ShortRest.MaxHitDieSpend.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.MaxHitDieSpend.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE],
    validate: (settings) => {
      return settings.get(CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE).value;
    },
    customFormula: CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@details.level",
  },
  [CONSTANTS.SETTINGS.SHORT_RESOURCES_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.ResourcesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.ResourcesRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customFormula: CONSTANTS.SETTINGS.SHORT_RESOURCES_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.SHORT_RESOURCES_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@resource.max",
  },
  [CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.ItemUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.ItemUsesRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customFormula: CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.SHORT_USES_OTHERS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max",
  },
  [CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.FeatUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.FeatUsesRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customFormula: CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.SHORT_USES_FEATS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max",
  },
  [CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.PactSpellSlotsLongRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.PactSpellSlotsLongRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.SHORT_PACT_SPELLS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "@slot.max",
  },
  [CONSTANTS.SETTINGS.SONG_OF_REST_MULTIUSE]: {
    name: "REST-RECOVERY.Settings.ShortRest.SongOfRestMultiuse.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.SongOfRestMultiuse.Hint",
    scope: "world",
    group: "shortrest",
    config: false,
    type: Boolean,
    default: false
  },
  [CONSTANTS.SETTINGS.SHORT_HP_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.ShortRest.HitPointsRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.HitPointsRecoveryFraction.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.SHORT_HP_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.NONE,
  },
  [CONSTANTS.SETTINGS.SHORT_HP_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "shortrest",
    config: false,
    hidden: true,
    type: String,
    default: "floor(@attributes.hp.max / 2)",
  },
  
  /*-------------------------------------------*
   *             Long Rest Settings            *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.LongRest.AutomateExhaustion.Title",
    hint: "REST-RECOVERY.Settings.LongRest.AutomateExhaustion.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION]: {
    name: "REST-RECOVERY.Settings.LongRest.ExhaustionIntegration.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ExhaustionIntegration.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION, CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value || settings.get(CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION).value
    },
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.MODULES.DFREDS]: "REST-RECOVERY.Modules.DFreds"
    },
    default: CONSTANTS.FRACTIONS.NONE,
    hidden: true // For now, since was only DFreds CE and that's not currently compatible with any type of exhaustion automation
  },
  [CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.LongRest.OneDnDExhaustion.Title",
    hint: "REST-RECOVERY.Settings.LongRest.OneDnDExhaustion.Hint",
    hint2: "REST-RECOVERY.Settings.LongRest.OneDnDExhaustion.Hint2",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value || game.modules.get(CONSTANTS.MODULES.ALTERNATIVE_EXHAUSTION)?.active;
    },
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PREVENT_LONG_REST_EXHAUSTION_RECOVERY]: {
    name: "REST-RECOVERY.Settings.LongRest.PreventLongRestExhaustionRecovery.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreventLongRestExhaustionRecovery.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value;
    },
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.RollHitDice.Title",
    hint: "REST-RECOVERY.Settings.LongRest.RollHitDice.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE, CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE).value || settings.get(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE).value
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER]: {
    name: "REST-RECOVERY.Settings.LongRest.PreRegainHitDiceBuffer.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreRegainHitDiceBuffer.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE, CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE).value || settings.get(CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE).value
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PREVENT_REST_REGAIN_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.PreventRegainHitDice.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreventRegainHitDice.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE, CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE).value || settings.get(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE).value
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND]: {
    name: "REST-RECOVERY.Settings.LongRest.MaxHitDieSpend.Title",
    hint: "REST-RECOVERY.Settings.LongRest.MaxHitDieSpend.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE).value;
    },
    customFormula: CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "floor(@details.level/2)",
  },
  [CONSTANTS.SETTINGS.HP_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@attributes.hp.max",
  },
  [CONSTANTS.SETTINGS.HD_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.HALF,
  },
  [CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@details.level / 2",
  },
  [CONSTANTS.SETTINGS.HD_ROUNDING]: {
    name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.DOWN]: "REST-RECOVERY.Rounding.RoundDown",
      [CONSTANTS.FRACTIONS.UP]: "REST-RECOVERY.Rounding.RoundUp",
    },
    default: CONSTANTS.FRACTIONS.DOWN,
  },
  [CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.LONG_RESOURCES_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@resource.max",
  },
  [CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@slot.max",
  },
  [CONSTANTS.SETTINGS.LONG_CUSTOM_SPELL_RECOVERY]: {
    name: "REST-RECOVERY.Settings.LongRest.CustomSpellSlotRecovery.Title",
    hint: "REST-RECOVERY.Settings.LongRest.CustomSpellSlotRecovery.Hint",
    dependsOn: [CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER],
    validate: (settings) => {
      return settings.get(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER).value !== CONSTANTS.FRACTIONS.CUSTOM;
    },
    callback: (settings) => {
      const setting = settings.get(CONSTANTS.SETTINGS.LONG_SPELLS_MULTIPLIER_FORMULA);
      if(setting.value === "@slot.max"){
        setting.store.set("ceil(min(17, @details.level+1)/2)*2");
      }
    },
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    nonDefaultSetting: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.PactSpellSlotsLongRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PactSpellSlotsLongRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.LONG_PACT_SPELLS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@slot.max",
  },
  [CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.LONG_USES_OTHERS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max",
  },
  [CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.LONG_USES_FEATS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max",
  },
  [CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.FULL,
  },
  [CONSTANTS.SETTINGS.LONG_USES_DAILY_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max",
  },
  [CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION]: {
    name: "REST-RECOVERY.Settings.LongRest.AutomateArmor.Title",
    hint: "REST-RECOVERY.Settings.LongRest.AutomateArmor.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    nonDefaultSetting: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.ArmorHitDiceRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ArmorHitDiceRecoveryFraction.Hint",
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION).value;
    },
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    nonDefaultSetting: true,
    customFormula: CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.FRACTIONS.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
    },
    default: CONSTANTS.FRACTIONS.QUARTER,
  },
  [CONSTANTS.SETTINGS.LONG_REST_ARMOR_HIT_DICE_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@details.level / 4",
  },
  [CONSTANTS.SETTINGS.LONG_REST_ARMOR_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.LongRest.AutomateArmorExhaustion.Title",
    hint: "REST-RECOVERY.Settings.LongRest.AutomateArmorExhaustion.Hint",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION, CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value
          || !settings.get(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION).value;
    },
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    nonDefaultSetting: true,
    config: false,
    default: false,
    type: Boolean
  },
  
  /*-------------------------------------------*
   *               Item names                  *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.WIZARD_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.WizardClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.WizardClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.ClassNames.Wizard",
    type: String
  },
  [CONSTANTS.SETTINGS.DRUID_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.DruidClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.DruidClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.ClassNames.Druid",
    type: String
  },
  [CONSTANTS.SETTINGS.BARD_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.BardClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.BardClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.ClassNames.Bard",
    type: String
  },
  [CONSTANTS.SETTINGS.ARCANE_RECOVERY]: {
    name: "REST-RECOVERY.Settings.ItemNames.ArcaneRecovery.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ArcaneRecovery.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.ArcaneRecovery",
    type: String
  },
  [CONSTANTS.SETTINGS.POWER_SURGE]: {
    name: "REST-RECOVERY.Settings.ItemNames.PowerSurge.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.PowerSurge.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.PowerSurge",
    type: String
  },
  [CONSTANTS.SETTINGS.NATURAL_RECOVERY]: {
    name: "REST-RECOVERY.Settings.ItemNames.NaturalRecovery.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.NaturalRecovery.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.NaturalRecovery",
    type: String
  },
  [CONSTANTS.SETTINGS.SONG_OF_REST]: {
    name: "REST-RECOVERY.Settings.ItemNames.SongOfRest.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.SongOfRest.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.SongOfRest",
    type: String
  },
  [CONSTANTS.SETTINGS.CHEF_FEAT]: {
    name: "REST-RECOVERY.Settings.ItemNames.ChefFeat.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ChefFeat.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.ChefFeat",
    type: String
  },
  [CONSTANTS.SETTINGS.CHEF_TOOLS]: {
    name: "REST-RECOVERY.Settings.ItemNames.ChefTools.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ChefTools.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.ChefTools",
    type: String
  },
  [CONSTANTS.SETTINGS.DURABLE_FEAT]: {
    name: "REST-RECOVERY.Settings.ItemNames.DurableFeat.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.DurableFeat.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.DurableFeat",
    type: String
  },
  [CONSTANTS.SETTINGS.PERIAPT_ITEM]: {
    name: "REST-RECOVERY.Settings.ItemNames.PeriaptItem.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.PeriaptItem.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.PeriaptItem",
    type: String
  },
  [CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING]: {
    name: "REST-RECOVERY.Settings.ItemNames.WoundClosureBlessing.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.WoundClosureBlessing.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.WoundClosureBlessing",
    type: String
  },
  [CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE]: {
    name: "REST-RECOVERY.Settings.ItemNames.BlackBloodFeature.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.BlackBloodFeature.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    localize: true,
    default: "REST-RECOVERY.FeatureNames.BlackBloodFeature",
    type: String
  },
  
  
  /*-------------------------------------------*
   *          Food and Water Settings          *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.EnableFoodAndWater.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.EnableFoodAndWater.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.FOOD_UNITS_PER_DAY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.FoodUnitsPerDay.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.FoodUnitsPerDay.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value
    },
    config: false,
    default: 1,
    type: Number
  },
  [CONSTANTS.SETTINGS.WATER_UNITS_PER_DAY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.WaterUnitsPerDay.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.WaterUnitsPerDay.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value
    },
    config: false,
    default: 1,
    type: Number
  },
  [CONSTANTS.SETTINGS.EXTERNAL_FOOD_ACCESS]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodAccess.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodAccess.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value
    },
    choices: {
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None"
    },
    default: "full",
    type: String
  },
  [CONSTANTS.SETTINGS.EXTERNAL_FOOD_HAS_COST]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodHasCost.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodHasCost.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    type: Boolean,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER, CONSTANTS.SETTINGS.EXTERNAL_FOOD_ACCESS],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value || settings.get(CONSTANTS.SETTINGS.EXTERNAL_FOOD_ACCESS).value === CONSTANTS.FRACTIONS.NONE
    },
    default: false
  },
  [CONSTANTS.SETTINGS.EXTERNAL_FOOD_FULL_COST_CURRENCY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodFullCostCurrency.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodFullCostCurrency.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: false,
    customFormula: CONSTANTS.SETTINGS.EXTERNAL_FOOD_FULL_COST,
    config: false,
    numberAndChoiceType: true,
    type: String,
    dependsOn: [CONSTANTS.SETTINGS.EXTERNAL_FOOD_HAS_COST],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.EXTERNAL_FOOD_HAS_COST).value
    },
    choices: {
      [CONSTANTS.CURRENCIES.COPPER]: "REST-RECOVERY.Currencies.Copper",
      [CONSTANTS.CURRENCIES.SILVER]: "REST-RECOVERY.Currencies.Silver",
      [CONSTANTS.CURRENCIES.ELECTRUM]: "REST-RECOVERY.Currencies.Electrum",
      [CONSTANTS.CURRENCIES.GOLD]: "REST-RECOVERY.Currencies.Gold",
      [CONSTANTS.CURRENCIES.PLATINUM]: "REST-RECOVERY.Currencies.Platinum",
    },
    default: CONSTANTS.CURRENCIES.GOLD
  },
  [CONSTANTS.SETTINGS.EXTERNAL_FOOD_FULL_COST]: {
    scope: "world",
    group: "foodandwater",
    config: false,
    hidden: true,
    type: Number,
    default: 0
  },
  [CONSTANTS.SETTINGS.EXTERNAL_FOOD_HALF_COST_CURRENCY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodHalfCostCurrency.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalFoodHalfCostCurrency.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: false,
    customFormula: CONSTANTS.SETTINGS.EXTERNAL_FOOD_HALF_COST,
    config: false,
    numberAndChoiceType: true,
    type: String,
    dependsOn: [CONSTANTS.SETTINGS.EXTERNAL_FOOD_HAS_COST],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.EXTERNAL_FOOD_HAS_COST).value
    },
    choices: {
      [CONSTANTS.CURRENCIES.COPPER]: "REST-RECOVERY.Currencies.Copper",
      [CONSTANTS.CURRENCIES.SILVER]: "REST-RECOVERY.Currencies.Silver",
      [CONSTANTS.CURRENCIES.ELECTRUM]: "REST-RECOVERY.Currencies.Electrum",
      [CONSTANTS.CURRENCIES.GOLD]: "REST-RECOVERY.Currencies.Gold",
      [CONSTANTS.CURRENCIES.PLATINUM]: "REST-RECOVERY.Currencies.Platinum",
    },
    default: CONSTANTS.CURRENCIES.GOLD
  },
  [CONSTANTS.SETTINGS.EXTERNAL_FOOD_HALF_COST]: {
    scope: "world",
    group: "foodandwater",
    config: false,
    hidden: true,
    type: Number,
    default: 0
  },
  [CONSTANTS.SETTINGS.EXTERNAL_WATER_ACCESS]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterAccess.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterAccess.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value
    },
    choices: {
      [CONSTANTS.FRACTIONS.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.FRACTIONS.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None"
    },
    default: "full",
    type: String
  },
  [CONSTANTS.SETTINGS.EXTERNAL_WATER_HAS_COST]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterHasCost.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterHasCost.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    type: Boolean,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER, CONSTANTS.SETTINGS.EXTERNAL_WATER_ACCESS],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value || settings.get(CONSTANTS.SETTINGS.EXTERNAL_WATER_ACCESS).value === CONSTANTS.FRACTIONS.NONE
    },
    default: false
  },
  [CONSTANTS.SETTINGS.EXTERNAL_WATER_FULL_COST_CURRENCY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterFullCostCurrency.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterFullCostCurrency.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: false,
    customFormula: CONSTANTS.SETTINGS.EXTERNAL_WATER_FULL_COST,
    config: false,
    numberAndChoiceType: true,
    type: String,
    dependsOn: [CONSTANTS.SETTINGS.EXTERNAL_WATER_HAS_COST],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.EXTERNAL_WATER_HAS_COST).value
    },
    choices: {
      [CONSTANTS.CURRENCIES.COPPER]: "REST-RECOVERY.Currencies.Copper",
      [CONSTANTS.CURRENCIES.SILVER]: "REST-RECOVERY.Currencies.Silver",
      [CONSTANTS.CURRENCIES.ELECTRUM]: "REST-RECOVERY.Currencies.Electrum",
      [CONSTANTS.CURRENCIES.GOLD]: "REST-RECOVERY.Currencies.Gold",
      [CONSTANTS.CURRENCIES.PLATINUM]: "REST-RECOVERY.Currencies.Platinum",
    },
    default: CONSTANTS.CURRENCIES.GOLD
  },
  [CONSTANTS.SETTINGS.EXTERNAL_WATER_FULL_COST]: {
    scope: "world",
    group: "foodandwater",
    config: false,
    hidden: true,
    type: Number,
    default: 0
  },
  [CONSTANTS.SETTINGS.EXTERNAL_WATER_HALF_COST_CURRENCY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterHalfCostCurrency.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.ExternalWaterHalfCostCurrency.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: false,
    customFormula: CONSTANTS.SETTINGS.EXTERNAL_WATER_HALF_COST,
    config: false,
    numberAndChoiceType: true,
    type: String,
    dependsOn: [CONSTANTS.SETTINGS.EXTERNAL_WATER_HAS_COST],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.EXTERNAL_WATER_HAS_COST).value
    },
    choices: {
      [CONSTANTS.CURRENCIES.COPPER]: "REST-RECOVERY.Currencies.Copper",
      [CONSTANTS.CURRENCIES.SILVER]: "REST-RECOVERY.Currencies.Silver",
      [CONSTANTS.CURRENCIES.ELECTRUM]: "REST-RECOVERY.Currencies.Electrum",
      [CONSTANTS.CURRENCIES.GOLD]: "REST-RECOVERY.Currencies.Gold",
      [CONSTANTS.CURRENCIES.PLATINUM]: "REST-RECOVERY.Currencies.Platinum",
    },
    default: CONSTANTS.CURRENCIES.GOLD
  },
  [CONSTANTS.SETTINGS.EXTERNAL_WATER_HALF_COST]: {
    scope: "world",
    group: "foodandwater",
    config: false,
    hidden: true,
    type: Number,
    default: 0
  },
  [CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.AutomateFoodWaterExhaustion.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.AutomateFoodWaterExhaustion.Hint",
    scope: "world",
    group: "foodandwater",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION, CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value
        || !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value;
    },
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.NoFoodDuration.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.NoFoodDuration.Hint",
    scope: "world",
    group: "foodandwater",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION).value
    },
    config: false,
    default: "3+max(1,@abilities.con.mod)",
    type: String
  },
  [CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.HalfWaterSaveDC.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.HalfWaterSaveDC.Hint",
    scope: "world",
    group: "foodandwater",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION).value
    },
    config: false,
    default: 15,
    type: Number
  },
  [CONSTANTS.SETTINGS.FOODWATER_PROMPT_NEWDAY]: {
    name: "REST-RECOVERY.Settings.FoodAndWater.FoodWaterPromptNewDay.Title",
    hint: "REST-RECOVERY.Settings.FoodAndWater.FoodWaterPromptNewDay.Hint",
    scope: "world",
    group: "foodandwater",
    customSettingsDialog: true,
    config: false,
    type: Boolean,
    dependsOn: [CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER).value
    },
    default: false
  },
};

const baseFlag = `flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.`

CONSTANTS.FLAGS = {}
CONSTANTS.FLAGS.RESOURCES = baseFlag + "resources";

CONSTANTS.FLAGS.RECOVERY = baseFlag + "recovery";
CONSTANTS.FLAGS.RECOVERY_ENABLED = CONSTANTS.FLAGS.RECOVERY + ".enabled";
CONSTANTS.FLAGS.RECOVERY_FORMULA = CONSTANTS.FLAGS.RECOVERY + ".custom_formula";

CONSTANTS.FLAGS.CONSUMABLE = baseFlag + "consumable";
CONSTANTS.FLAGS.CONSUMABLE_ENABLED = CONSTANTS.FLAGS.CONSUMABLE + ".enabled";
CONSTANTS.FLAGS.CONSUMABLE_TYPE = CONSTANTS.FLAGS.CONSUMABLE + ".type";
CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH = CONSTANTS.FLAGS.CONSUMABLE + ".dayWorth";
CONSTANTS.FLAGS.CONSUMABLE_TYPE_FOOD = "food";
CONSTANTS.FLAGS.CONSUMABLE_TYPE_WATER = "water";
CONSTANTS.FLAGS.CONSUMABLE_TYPE_BOTH = "both";

CONSTANTS.FLAGS.STARVATION = baseFlag + "starvation";
CONSTANTS.FLAGS.SATED_FOOD = baseFlag + "sated.food";
CONSTANTS.FLAGS.SATED_WATER = baseFlag + "sated.water";
CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS = baseFlag + "currentShortRests";

CONSTANTS.FLAGS.HIT_DICE_BUFFER_FLAG = baseFlag + `hitDiceBuffer`;
CONSTANTS.FLAGS.REMOVE_HIT_DICE_BUFFER_FLAG = baseFlag + `-=hitDiceBuffer`;

CONSTANTS.FLAGS.PROMPT_REST_CONFIG = baseFlag + "promptRestConfig";


// DAE Flags
const daeFlag = `flags.dae.${CONSTANTS.MODULE_NAME}.`
const daeFlagPrevent = daeFlag + "prevent.";
CONSTANTS.FLAGS.DAE = {};
CONSTANTS.FLAGS.DAE.PREVENT_LONG_REST = daeFlagPrevent + "longRest";
CONSTANTS.FLAGS.DAE.PREVENT_SHORT_REST = daeFlagPrevent + "shortRest";
CONSTANTS.FLAGS.DAE.PREVENT_EXHAUSTION_RECOVERY = daeFlagPrevent + "exhaustionRecovery";
CONSTANTS.FLAGS.DAE.NEEDS_NO_FOOD = daeFlag + "force.noFood";
CONSTANTS.FLAGS.DAE.NEEDS_NO_WATER = daeFlag + "force.noWater";
CONSTANTS.FLAGS.DAE.REQUIRED_FOOD = daeFlag + "require.food";
CONSTANTS.FLAGS.DAE.REQUIRED_WATER = daeFlag + "require.water";
CONSTANTS.FLAGS.DAE.MAXIMISE_HIT_DIE_ROLL = daeFlag + "force.maximiseHitDieRoll";

// D&D 5e Flags
const dndFlag = `flags.dnd5e.`
CONSTANTS.FLAGS.DND = {}
CONSTANTS.FLAGS.DND.NEEDS_NO_FOOD_AND_WATER = dndFlag + "noFoodWater";
CONSTANTS.FLAGS.DND.REQUIRED_FOOD = dndFlag + "foodUnits";
CONSTANTS.FLAGS.DND.REQUIRED_WATER = dndFlag + "waterUnits";

CONSTANTS.CONSUMABLE = {
  NONE: "none",
  REGULAR: "regular"
}

CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;

export default CONSTANTS;
