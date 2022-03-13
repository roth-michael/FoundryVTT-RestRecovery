const CONSTANTS = {
    MODULE_NAME: "rest-recovery",
    FLAG_NAME: "data",
    SETTINGS: {
        IGNORE_INACTIVE_PLAYERS: "ignore-inactive-players",
        LONG_REST_ROLL_HIT_DICE: "long-rest-roll-hit-dice",
        HP_MULTIPLIER: "recovery-hitpoints",
        HD_MULTIPLIER: "recovery-hitdice",
        HD_ROUNDING: "recovery-rounding",
        RESOURCES_MULTIPLIER: "recovery-resources",
        SPELLS_MULTIPLIER: "recovery-spells",
        USES_OTHERS_MULTIPLIER: "recovery-uses-others",
        USES_FEATS_MULTIPLIER: "recovery-uses-feats",
        USES_DAILY_MULTIPLIER: "recovery-day"
    },
    get DEFAULT_SETTINGS() {
        return {
            [CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS]: {
                name: "REST-RECOVERY.Settings.IgnoreInactive.Title",
                hint: "REST-RECOVERY.Settings.IgnoreInactive.Hint",
                scope: "world",
                group: "shortrest",
                config: false,
                default: false,
                type: Boolean
            },
            [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE]: {
                name: "REST-RECOVERY.Settings.LongRestRollHitDice.Title",
                hint: "REST-RECOVERY.Settings.LongRestRollHitDice.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                default: false,
                type: Boolean
            },
            [CONSTANTS.SETTINGS.HP_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.HitPointsRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.HitPointsRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.HD_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.HitDiceRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.HitDiceRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "half",
            },
            [CONSTANTS.SETTINGS.HD_ROUNDING]: {
                name: "REST-RECOVERY.Settings.HitDiceRecoveryRounding.Title",
                hint: "REST-RECOVERY.Settings.HitDiceRecoveryRounding.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                type: String,
                choices: {
                    down: "REST-RECOVERY.Rounding.RoundDown",
                    up: "REST-RECOVERY.Rounding.RoundUp",
                },
                default: "down",
            },
            [CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.ResourcesRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.ResourcesRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.SPELLS_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.SpellSlotsRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.SpellSlotsRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.ItemUsesRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.ItemUsesRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.FeatUsesRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.FeatUsesRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
            [CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER]: {
                name: "REST-RECOVERY.Settings.DailyUsesRecoveryFraction.Title",
                hint: "REST-RECOVERY.Settings.DailyUsesRecoveryFraction.Hint",
                scope: "world",
                group: "longrest",
                config: false,
                type: String,
                choices: {
                    none: "REST-RECOVERY.Fractions.None",
                    quarter: "REST-RECOVERY.Fractions.Quarter",
                    half: "REST-RECOVERY.Fractions.Half",
                    full: "REST-RECOVERY.Fractions.Full",
                },
                default: "full",
            },
        };
    }
}
CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;

export default CONSTANTS;