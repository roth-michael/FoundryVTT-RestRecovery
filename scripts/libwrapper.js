import ShortRestDialog from "./formapplications/short-rest/short-rest.js";
import CONSTANTS from "./constants.js";
import RestWorkflow from "./rest-workflow.js";
import LongRestDialog from "./formapplications/long-rest/long-rest.js";
import { getSetting } from "./lib/lib.js";

export default function registerLibwrappers() {

    // Actors
    patch_shortRest();
    patch_longRest();
    patch_rest();
    patch_rollHitDie();
    patch_displayRestResultMessage();
    patch_getRestHitPointRecovery();
    patch_getRestHitDiceRecovery();
    patch_getRestResourceRecovery();
    patch_getRestSpellRecovery();
    patch_getRestItemUsesRecovery();

    // Items
    patch_getUsageUpdates();

}

function patch_shortRest() {
    libWrapper.ignore_conflicts(CONSTANTS.MODULE_NAME, ["dnd5e-helpers"], [
        "CONFIG.Actor.documentClass.prototype.shortRest"
    ]);

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
    libWrapper.ignore_conflicts(CONSTANTS.MODULE_NAME, ["dnd5e-helpers"], [
        "CONFIG.Actor.documentClass.prototype.longRest"
    ]);

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

function patch_rest() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._rest",
        async function (chat, newDay, longRest, dhd=0, dhp=0) {
            let hitPointsRecovered = 0;
            let hitPointUpdates = {};
            let hitDiceRecovered = 0;
            let hitDiceUpdates = [];

            // Recover hit points & hit dice on long rest
            if ( longRest ) {
                ({ updates: hitPointUpdates, hitPointsRecovered } = this._getRestHitPointRecovery());
                ({ updates: hitDiceUpdates, hitDiceRecovered } = this._getRestHitDiceRecovery());
            }

            // Figure out the rest of the changes
            const result = {
                dhd: dhd + hitDiceRecovered,
                dhp: dhp + hitPointsRecovered,
                updateData: {
                    ...hitPointUpdates,
                    ...this._getRestResourceRecovery({ recoverShortRestResources: !longRest, recoverLongRestResources: longRest }),
                    ...this._getRestSpellRecovery({ recoverSpells: longRest })
                },
                updateItems: [
                    ...hitDiceUpdates,
                    ...this._getRestItemUsesRecovery({ recoverLongRestUses: longRest, recoverDailyUses: newDay })
                ],
                longRest,
                newDay
            };

            if(longRest){
                const workflow = RestWorkflow.get(this);
                result.updateData = await workflow._handleFoodWaterExhaustion(result.updateData);
                result.updateItems = await workflow._handleFoodAndWaterItems(result.updateItems);
            }

            // Perform updates
            await this.update(result.updateData);
            await this.updateEmbeddedDocuments("Item", result.updateItems);

            // Display a Chat Message summarizing the rest effects
            if ( chat ) await this._displayRestResultMessage(result, longRest);

            if ( Hooks._hooks.restCompleted?.length ) console.warn(
                "The restCompleted hook has been deprecated in favor of dnd5e.restCompleted. "
                + "The original hook will be removed in dnd5e 1.8."
            );

            Hooks.callAll("restCompleted", this, result);

            Hooks.callAll("dnd5e.restCompleted", this, result);

            // Return data summarizing the rest effects
            return result;
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
            const rollData = this.getRollData();

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

function patch_displayRestResultMessage() {
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._displayRestResultMessage",
        async function (wrapped, ...args) {
            const result = await wrapped(...args);
            const workflow = RestWorkflow.get(this);
            if(workflow){
                await workflow._displayRestResultMessage(result)
            }
            return result;
        }
    )

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

function patch_getUsageUpdates(){
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Item.documentClass.prototype._getUsageUpdates",
        function ({consumeQuantity, consumeRecharge, consumeResource, consumeSpellLevel, consumeUsage}) {

            // Reference item data
            const id = this.data.data;
            const actorUpdates = {};
            const itemUpdates = {};
            const resourceUpdates = isNewerVersion("1.5.7", game.system.data.version) ? {} : [];

            // Consume Recharge
            if ( consumeRecharge ) {
                const recharge = id.recharge || {};
                if ( recharge.charged === false ) {
                    ui.notifications.warn(game.i18n.format("DND5E.ItemNoUses", {name: this.name}));
                    return false;
                }
                itemUpdates["data.recharge.charged"] = false;
            }

            // Consume Limited Resource
            if ( consumeResource ) {
                const canConsume = this._handleConsumeResource(itemUpdates, actorUpdates, resourceUpdates);
                if ( canConsume === false ) return false;
            }

            // Consume Spell Slots
            if ( consumeSpellLevel ) {
                if ( Number.isNumeric(consumeSpellLevel) ) consumeSpellLevel = `spell${consumeSpellLevel}`;
                const level = this.actor?.data.data.spells[consumeSpellLevel];
                const spells = Number(level?.value ?? 0);
                if ( spells === 0 ) {
                    const label = game.i18n.localize(consumeSpellLevel === "pact" ? "DND5E.SpellProgPact" : `DND5E.SpellLevel${id.level}`);
                    ui.notifications.warn(game.i18n.format("DND5E.SpellCastNoSlots", {name: this.name, level: label}));
                    return false;
                }
                actorUpdates[`data.spells.${consumeSpellLevel}.value`] = Math.max(spells - 1, 0);
            }

            const consumeFull = RestWorkflow.itemsListened.get(this.id) ?? true;

            // Consume Limited Usage
            if ( consumeUsage ) {
                const uses = id.uses || {};
                const available = Number(uses.value ?? 0);
                let used = false;

                // Reduce usages
                const remaining = Math.max(available - (consumeFull ? 1 : 0.5), 0);
                if ( available > 0 ) {
                    used = true;
                    itemUpdates["data.uses.value"] = remaining;
                }

                // Reduce quantity if not reducing usages or if usages hit 0 and we are set to consumeQuantity
                if ( consumeQuantity && (!used || (remaining === 0)) ) {
                    const q = Number(id.quantity ?? 1);
                    if ( q >= 1 ) {
                        used = true;
                        itemUpdates["data.quantity"] = Math.max(q - 1, 0);
                        itemUpdates["data.uses.value"] = uses.max ?? 1;
                    }
                }

                // If the item was not used, return a warning
                if ( !used ) {
                    ui.notifications.warn(game.i18n.format("DND5E.ItemNoUses", {name: this.name}));
                    return false;
                }
            }

            // Return the configured usage
            return { itemUpdates, actorUpdates, resourceUpdates };
        },
        "OVERRIDE"
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