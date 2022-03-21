const CONSTANTS = {
    MODULE_NAME: "rest-recovery",
    FLAG_NAME: "data",
    SETTINGS: {
        /*-------------------------------------------*
         *           General Rest Settings           *
         *-------------------------------------------*/
        ENABLE_AUTO_ROLL_HIT_DICE: "enable-auto-roll-hit-dice",

        /*-------------------------------------------*
         *            Short Rest Settings            *
         *-------------------------------------------*/
        IGNORE_INACTIVE_PLAYERS: "ignore-inactive-players",
        MAX_SHORT_RESTS: "max-short-rests-per-long-rest",

        /*-------------------------------------------*
         *             Long Rest Settings            *
         *-------------------------------------------*/
        LONG_REST_ROLL_HIT_DICE: "long-rest-roll-hit-dice",
        PRE_REST_REGAIN_HIT_DICE: "pre-rest-regain-hit-dice",
        HD_ROUNDING: "recovery-rounding",
        HP_MULTIPLIER: "recovery-hitpoints",
        HD_MULTIPLIER: "recovery-hitdice",
        RESOURCES_MULTIPLIER: "recovery-resources",
        SPELLS_MULTIPLIER: "recovery-spells",
        USES_OTHERS_MULTIPLIER: "recovery-uses-others",
        USES_FEATS_MULTIPLIER: "recovery-uses-feats",
        USES_DAILY_MULTIPLIER: "recovery-day",

        HP_MULTIPLIER_FORMULA: "recovery-hitpoints-formula",
        HD_MULTIPLIER_FORMULA: "recovery-hitdice-formula",
        RESOURCES_MULTIPLIER_FORMULA: "recovery-resources-formula",
        SPELLS_MULTIPLIER_FORMULA: "recovery-spells-formula",
        USES_OTHERS_MULTIPLIER_FORMULA: "recovery-uses-others-formula",
        USES_FEATS_MULTIPLIER_FORMULA: "recovery-uses-feats-formula",
        USES_DAILY_MULTIPLIER_FORMULA: "recovery-day-formula",

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
        BLACK_BLOOD_FEATURE: "black-blood-feature-name",
    },

    RECOVERY: {
        FULL: "full",
        HALF: "half",
        QUARTER: "quarter",
        NONE: "none",
        CUSTOM: "custom_formula",

        UP: "up",
        DOWN: "down",
    },

    USING_DEFAULT_LONG_REST_SETTINGS(){
        const settings = this.GET_DEFAULT_SETTINGS();
        for(const [key, setting] of Object.entries(settings)){
            if(setting.group !== "longrest") continue;
            if(game.settings.get(this.MODULE_NAME, key) !== setting.default) return false;
        }
        return true;
    },

    GET_DEFAULT_SETTINGS() {
        return foundry.utils.deepClone(CONSTANTS.DEFAULT_SETTINGS)
    }
}

CONSTANTS.DEFAULT_SETTINGS = {

    /*-------------------------------------------*
     *           General Rest Settings           *
     *-------------------------------------------*/
    [CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE]: {
        name: "REST-RECOVERY.Settings.LongRest.EnableAutoRollButton.Title",
        hint: "REST-RECOVERY.Settings.LongRest.EnableAutoRollButton.Hint",
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

    /*-------------------------------------------*
     *             Long Rest Settings            *
     *-------------------------------------------*/
    [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE]: {
        name: "REST-RECOVERY.Settings.LongRest.RollHitDice.Title",
        hint: "REST-RECOVERY.Settings.LongRest.RollHitDice.Hint",
        scope: "world",
        group: "longrest",
        config: false,
        default: false,
        type: Boolean
    },
    [CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE]: {
        name: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Title",
        hint: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Hint",
        scope: "world",
        group: "longrest",
        validate: CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE,
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
            [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
            [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
            [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
            [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
            [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
        },
        default: "full",
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
            [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
            [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
            [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
            [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
            [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
        },
        default: "half",
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
            down: "REST-RECOVERY.Rounding.RoundDown",
            up: "REST-RECOVERY.Rounding.RoundUp",
        },
        default: "down",
    },
    [CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        customSettingsDialog: true,
        customFormula: CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER_FORMULA,
        config: false,
        type: String,
        choices: {
            [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
            [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
            [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
            [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
            [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
        },
        default: "full",
    },
    [CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER_FORMULA]: {
        scope: "world",
        group: "longrest",
        config: false,
        hidden: true,
        type: String,
        default: "@resource.max",
    },
    [CONSTANTS.SETTINGS.SPELLS_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        customSettingsDialog: true,
        customFormula: CONSTANTS.SETTINGS.SPELLS_MULTIPLIER_FORMULA,
        config: false,
        type: String,
        choices: {
            [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
            [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
            [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
            [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
            [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
        },
        default: "full",
    },
    [CONSTANTS.SETTINGS.SPELLS_MULTIPLIER_FORMULA]: {
        scope: "world",
        group: "longrest",
        config: false,
        hidden: true,
        type: String,
        default: "@slot.max",
    },
    [CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        customSettingsDialog: true,
        customFormula: CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER_FORMULA,
        config: false,
        type: String,
        choices: {
            [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
            [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
            [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
            [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
            [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
        },
        default: "full",
    },
    [CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER_FORMULA]: {
        scope: "world",
        group: "longrest",
        config: false,
        hidden: true,
        type: String,
        default: "@uses.max",
    },
    [CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        customSettingsDialog: true,
        customFormula: CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER_FORMULA,
        config: false,
        type: String,
        choices: {
            [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
            [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
            [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
            [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
            [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
        },
        default: "full",
    },
    [CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER_FORMULA]: {
        scope: "world",
        group: "longrest",
        config: false,
        hidden: true,
        type: String,
        default: "@uses.max",
    },
    [CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        customSettingsDialog: true,
        customFormula: CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER_FORMULA,
        config: false,
        type: String,
        choices: {
            [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
            [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
            [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
            [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
            [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom",
        },
        default: "full",
    },
    [CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER_FORMULA]: {
        scope: "world",
        group: "longrest",
        config: false,
        hidden: true,
        type: String,
        default: "@uses.max",
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
        default: "REST-RECOVERY.ClassNames.Wizard",
        type: String
    },
    [CONSTANTS.SETTINGS.DRUID_CLASS]: {
        name: "REST-RECOVERY.Settings.ItemNames.DruidClassName.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.DruidClassName.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.ClassNames.Druid",
        type: String
    },
    [CONSTANTS.SETTINGS.BARD_CLASS]: {
        name: "REST-RECOVERY.Settings.ItemNames.BardClassName.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.BardClassName.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.ClassNames.Bard",
        type: String
    },
    [CONSTANTS.SETTINGS.ARCANE_RECOVERY]: {
        name: "REST-RECOVERY.Settings.ItemNames.ArcaneRecovery.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.ArcaneRecovery.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.FeatureNames.ArcaneRecovery",
        type: String
    },
    [CONSTANTS.SETTINGS.NATURAL_RECOVERY]: {
        name: "REST-RECOVERY.Settings.ItemNames.NaturalRecovery.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.NaturalRecovery.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.FeatureNames.NaturalRecovery",
        type: String
    },
    [CONSTANTS.SETTINGS.SONG_OF_REST]: {
        name: "REST-RECOVERY.Settings.ItemNames.SongOfRest.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.SongOfRest.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.FeatureNames.SongOfRest",
        type: String
    },
    [CONSTANTS.SETTINGS.CHEF_FEAT]: {
        name: "REST-RECOVERY.Settings.ItemNames.ChefFeat.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.ChefFeat.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.FeatureNames.ChefFeat",
        type: String
    },
    [CONSTANTS.SETTINGS.CHEF_TOOLS]: {
        name: "REST-RECOVERY.Settings.ItemNames.ChefTools.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.ChefTools.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.FeatureNames.ChefTools",
        type: String
    },
    [CONSTANTS.SETTINGS.DURABLE_FEAT]: {
        name: "REST-RECOVERY.Settings.ItemNames.DurableFeat.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.DurableFeat.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.FeatureNames.DurableFeat",
        type: String
    },
    [CONSTANTS.SETTINGS.PERIAPT_ITEM]: {
        name: "REST-RECOVERY.Settings.ItemNames.PeriaptItem.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.PeriaptItem.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.FeatureNames.PeriaptItem",
        type: String
    },
    [CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE]: {
        name: "REST-RECOVERY.Settings.ItemNames.BlackBloodFeature.Title",
        hint: "REST-RECOVERY.Settings.ItemNames.BlackBloodFeature.Hint",
        scope: "world",
        group: "itemnames",
        config: false,
        default: "REST-RECOVERY.FeatureNames.BlackBloodFeature",
        type: String
    }
};

CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;

export default CONSTANTS;