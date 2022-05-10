import ShortRestDialog from "./formapplications/short-rest/short-rest.js";
import CONSTANTS from "./constants.js";
import RestWorkflow from "./rest-workflow.js";
import LongRestDialog from "./formapplications/long-rest/long-rest.js";
import { getSetting } from "./lib/lib.js";

export default function registerLibwrappers() {

    patch_shortRest();
    patch_longRest();
    patch_rollHitDie();

    patch_getRestHitPointRecovery();
    patch_getRestHitDiceRecovery();
    patch_getRestResourceRecovery();
    patch_getRestSpellRecovery();
    patch_getRestItemUsesRecovery();

}

function patch_shortRest() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype.shortRest",
        async function ({ dialog = true, chat = true, autoHD = false, autoHDThreshold = 3 } = {}) {
            // Take note of the initial hit points and number of hit dice the Actor has
            const hd0 = this.data.data.attributes.hd;
            const hp0 = this.data.data.attributes.hp.value;
            let newDay = false;

            RestWorkflow.make(this);

            // Display a Dialog for rolling hit dice
            if (dialog) {
                try {
                    newDay = await ShortRestDialog.show({ actor: this });
                } catch (err) {
                    return;
                }
            }

            // Automatically spend hit dice
            else if (autoHD) {
                await this.autoSpendHitDice({ threshold: autoHDThreshold });
            }

            return this._rest(
                chat,
                newDay,
                false,
                this.data.data.attributes.hd - hd0,
                this.data.data.attributes.hp.value - hp0
            );
        },
        "OVERRIDE"
    );
}

function patch_longRest() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype.longRest",
        async function ({ dialog = true, chat = true, newDay = true } = {}) {

            RestWorkflow.make(this, true);

            if (dialog) {
                try {
                    newDay = await LongRestDialog.show({ actor: this });
                } catch (err) {
                    return;
                }
            }

            return this._rest(
                chat,
                newDay,
                true
            );
        },
        "OVERRIDE"
    );
}

function patch_rollHitDie() {

    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype.rollHitDie",
        async function (denomination, { dialog = true } = {}) {

            // If no denomination was provided, choose the first available
            let cls;
            if (!denomination) {
                cls = this.itemTypes.class.find(c => c.data.data.hitDiceUsed < c.data.data.levels);
                if (!cls) return null;
                denomination = cls.data.data.hitDice;
            }

            // Otherwise locate a class (if any) which has an available hit die of the requested denomination
            else {
                cls = this.items.find(i => {
                    const d = i.data.data;
                    return (d.hitDice === denomination) && ((d.hitDiceUsed || 0) < (d.levels || 1));
                });
            }

            // If no class is available, display an error notification
            if (!cls) {
                ui.notifications.error(game.i18n.format("DND5E.HitDiceWarn", {
                    name: this.name,
                    formula: denomination
                }));
                return null;
            }

            // Prepare roll data
            let parts = [`1${denomination}`, "@abilities.con.mod"];

            const title = `${game.i18n.localize("DND5E.HitDiceRoll")}: ${this.name}`;
            const rollData = foundry.utils.deepClone(this.data.data);

            const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM)
                ? this.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true))
                : false;
            const blessing = getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING)
                ? this.items.getName(getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true))
                : false;
            const woundClosure = (periapt && periapt?.data?.data?.attunement === 2) || (blessing && blessing?.data?.type === "feat");

            const durable = getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT)
                ? this.items.getName(getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true))
                : false;
            const isDurable = durable && durable?.data?.type === "feat";

            const blackBlood = getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE)
                ? this.items.getName(getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true))
                : false;
            let hasBlackBlood = blackBlood && blackBlood?.data?.type === "feat";

            const conMod = this.data.data.abilities.con.mod;
            const durableMod = Math.max(2, conMod * 2);

            if(hasBlackBlood){
                denomination += "r<3";
            }

            if (woundClosure && isDurable) {
                parts = [`{1${denomination}*2+${conMod},${durableMod}}kh`]
            } else if (woundClosure) {
                parts[0] = "(" + parts[0] + "*2)";
            } else if (isDurable) {
                parts = [`{1${denomination}+${conMod},${durableMod}}kh`]
            }

            const hitDieBonus = getProperty(this.data, `flags.dnd5e.hitDieBonus`);
            if(hitDieBonus){
                parts.push(hitDieBonus);
            }

            // Call the roll helper utility
            const roll = await damageRoll({
                event: new Event("hitDie"),
                parts: parts,
                data: rollData,
                title: title,
                allowCritical: false,
                fastForward: !dialog,
                dialogOptions: { width: 350 },
                messageData: {
                    speaker: ChatMessage.getSpeaker({ actor: this }),
                    "flags.dnd5e.roll": { type: "hitDie" }
                }
            });
            if (!roll) return null;

            // Adjust actor data
            await cls.update({ "data.hitDiceUsed": cls.data.data.hitDiceUsed + 1 });
            const hp = this.data.data.attributes.hp;
            const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
            await this.update({ "data.attributes.hp.value": hp.value + dhp });
            return roll;


        },
        "OVERRIDE"
    );
}

function patch_getRestHitPointRecovery() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestHitPointRecovery",
        function (wrapped, args) {
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitPointRecovery")
        }
    )
}

function patch_getRestHitDiceRecovery() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestHitDiceRecovery",
        function (wrapped, args) {
            if (getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) {
                return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitDiceRecoveryPost")
            }
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitDiceRecoveryPre", false)
        }
    )
}

function patch_getRestResourceRecovery() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestResourceRecovery",
        function (wrapped, args) {
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestResourceRecovery")
        }
    )
}

function patch_getRestSpellRecovery() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestSpellRecovery",
        function (wrapped, args) {
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestSpellRecovery")
        }
    )
}

function patch_getRestItemUsesRecovery() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestItemUsesRecovery",
        function (wrapped, args) {
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestItemUsesRecovery")
        }
    )
}

/*
    Shamelessly stolen from the D&D 5e system, as these cannot be imported
 */


async function damageRoll({
                              parts = [],
                              data, // Roll creation
                              critical = false,
                              criticalBonusDice,
                              criticalMultiplier,
                              multiplyNumeric,
                              powerfulCritical,
                              criticalBonusDamage, // Damage customization
                              fastForward = false,
                              event,
                              allowCritical = true,
                              template,
                              title,
                              dialogOptions, // Dialog configuration
                              chatMessage = true,
                              messageData = {},
                              rollMode,
                              speaker,
                              flavor // Chat Message customization
                          } = {}) {

    // Handle input arguments
    const defaultRollMode = rollMode || game.settings.get("core", "rollMode");

    // Construct the DamageRoll instance
    const formula = parts.join(" + ");
    const { isCritical, isFF } = _determineCriticalMode({ critical, fastForward, event });
    const roll = new CONFIG.Dice.DamageRoll(formula, data, {
        flavor: flavor || title,
        critical: isFF ? isCritical : false,
        criticalBonusDice,
        criticalMultiplier,
        criticalBonusDamage,
        multiplyNumeric: multiplyNumeric ?? game.settings.get("dnd5e", "criticalDamageModifiers"),
        powerfulCritical: powerfulCritical ?? game.settings.get("dnd5e", "criticalDamageMaxDice")
    });

    // Prompt a Dialog to further configure the DamageRoll
    if (!isFF) {
        const configured = await roll.configureDialog({
            title,
            defaultRollMode: defaultRollMode,
            defaultCritical: isCritical,
            template,
            allowCritical
        }, dialogOptions);
        if (configured === null) return null;
    }

    // Evaluate the configured roll
    await roll.evaluate({ async: true });

    // Create a Chat Message
    if (speaker) {
        console.warn("You are passing the speaker argument to the damageRoll function directly which should instead be passed as an internal key of messageData");
        messageData.speaker = speaker;
    }
    if (roll && chatMessage) await roll.toMessage(messageData);
    return roll;
}

function _determineCriticalMode({ event, critical = false, fastForward = false } = {}) {
    const isFF = fastForward || (event && (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey));
    if (event?.altKey) critical = true;
    return { isFF, isCritical: critical };
}