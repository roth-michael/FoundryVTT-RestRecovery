const CONSTANTS = {
  MODULE_NAME: "rest-recovery",
  FLAG_NAME: "data",
  SETTINGS: {
    
    MIGRATION_VERSION: "migration-version",
    
    /*-------------------------------------------*
     *          Global Module Settings           *
     *-------------------------------------------*/
    MODULE_PROFILES: "module-profiles",
    ACTIVE_MODULE_PROFILE: "active-module-profile",
    PROMPT_REST_CONFIG: "prompt-rest-config",
    
    /*-------------------------------------------*
     *           General Rest Settings           *
     *-------------------------------------------*/
    QUICK_HD_ROLL: "quick-hd-roll",
    SHOW_PLAYER_LIST_REST_BUTTON: "show-player-list-rest-button",
    ENABLE_AUTO_ROLL_HIT_DICE: "enable-auto-roll-hit-dice",
    ENABLE_SIMPLE_CALENDAR_INTEGRATION: "enable-simple-calendar-integration",
    
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
    
    MAX_HIT_DICE_SPEND_FORMULA: "max-hit-die-spend-formula",
    SHORT_RESOURCES_MULTIPLIER_FORMULA: "short-recovery-resources-formula",
    SHORT_USES_OTHERS_MULTIPLIER_FORMULA: "short-recovery-uses-others-formula",
    SHORT_USES_FEATS_MULTIPLIER_FORMULA: "short-recovery-uses-feats-formula",
    SHORT_PACT_SPELLS_MULTIPLIER_FORMULA: "short-recovery-pact-spells-formula",
    
    /*-------------------------------------------*
     *             Long Rest Settings            *
     *-------------------------------------------*/
    AUTOMATE_EXHAUSTION: "automate-exhaustion",
    EXHAUSTION_INTEGRATION: "exhaustion-integration",
    ONE_DND_EXHAUSTION: "one-dnd-exhaustion",
    LONG_REST_ROLL_HIT_DICE: "long-rest-roll-hit-dice",
    PRE_REST_REGAIN_HIT_DICE: "pre-rest-regain-hit-dice",
    PRE_REST_REGAIN_BUFFER: "pre-rest-regain-hit-dice-buffer",
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
    EXTERNAL_WATER_ACCESS: "external-water-access",
    AUTOMATE_FOODWATER_EXHAUSTION: "automate-foodwater-exhaustion",
    NO_FOOD_DURATION_MODIFIER: "no-food-duration-modifier",
    HALF_WATER_SAVE_DC: "half-water-save-dc",
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
    CUB: "combat-utility-belt"
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
  
  /*-------------------------------------------*
   *           General Rest Settings           *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.General.EnableAutoRollButton.Title",
    hint: "REST-RECOVERY.Settings.General.EnableAutoRollButton.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: true,
    type: Boolean
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
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value
    },
    config: false,
    type: String,
    choices: {
      [CONSTANTS.FRACTIONS.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.MODULES.DFREDS]: "REST-RECOVERY.Modules.DFreds",
      [CONSTANTS.MODULES.CUB]: "REST-RECOVERY.Modules.CUB",
    },
    default: CONSTANTS.FRACTIONS.NONE,
  },
  [CONSTANTS.SETTINGS.ONE_DND_EXHAUSTION]: {
    name: "REST-RECOVERY.Settings.LongRest.OneDnDExhaustion.Title",
    hint: "REST-RECOVERY.Settings.LongRest.OneDnDExhaustion.Hint",
    scope: "world",
    group: "longrest",
    dependsOn: [CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION, CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION).value
          || settings.get(CONSTANTS.SETTINGS.EXHAUSTION_INTEGRATION).value === CONSTANTS.MODULES.CUB;
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
    dependsOn: [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE).value
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
    dependsOn: [CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE],
    validate: (settings) => {
      return !settings.get(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE).value
    },
    config: false,
    default: false,
    type: Boolean
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
  }
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

// DAE Flags
const daeFlag = `flags.dae.${CONSTANTS.MODULE_NAME}.`
CONSTANTS.FLAGS.DAE = {};
CONSTANTS.FLAGS.DAE.PREVENT = daeFlag + "prevent.";
CONSTANTS.FLAGS.DAE.PREVENT_LONG_REST = CONSTANTS.FLAGS.DAE.PREVENT + "longRest";
CONSTANTS.FLAGS.DAE.PREVENT_SHORT_REST = CONSTANTS.FLAGS.DAE.PREVENT + "shortRest";
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
