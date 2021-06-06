import newShortRestDialog from "./new-short-rest.js";
import { damageRoll } from "../../../systems/dnd5e/module/dice.js";
import { register_settings } from "./settings.js";
import { libWrapper } from "../lib/libWrapper/shim.js";

Hooks.on("init", () => {

    register_settings();
    patch_RollHitDie()
    patch_shortRest();
    patch_rest();
    patch_displayRestResultsMessage();
    console.log("Short Rest Recovery | Initialized");

});

function ordinal_suffix_of(i) {
    var j, k;
    j = i % 10;
    k = i % 100;
    if(j === 1 && k !== 11) {
        return i + 'st';
    }
    if(j === 2 && k !== 12) {
        return i + 'nd';
    }
    if(j === 3 && k !== 13) {
        return i + 'rd';
    }
    return i + 'th';
};

function patch_RollHitDie() {

    libWrapper.register(
        "short-rest-recovery",
        "CONFIG.Actor.documentClass.prototype.rollHitDie",
        async function patchedRollHitDie(...args) {

            let [denomination, dialog = !game.settings.get("short-rest-recovery", "quickHDRoll")] = args ?? [];

            // If no denomination was provided, choose the first available
            let cls = null;
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
                ui.notifications.error(game.i18n.format("DND5E.HitDiceWarn", {name: this.name, formula: denomination}));
                return null;
            }

            let parts = [`1${denomination}`, "@abilities.con.mod"];

            let periapt = this.items.find(item => {
                return item.name.toLowerCase() === game.i18n.format("DND5E.Periapt").toLowerCase()
                    && item.data.type === "equipment"
                    && item.data.data.attunement === 2
            });

            let durable = this.items.find(item => {
                return item.name.toLowerCase() === game.i18n.format("DND5E.DurableFeat").toLowerCase() && item.data.type === "feat"
            });

            if (periapt && durable) {

                parts = [`{1${denomination}+@abilities.con.mod,@abilities.con.mod}kh*2`]

            } else {

                if (periapt) {
                    parts[0] = "(" + parts[0];
                    parts[1] += ")*2";
                }

                if (durable) {
                    parts[0] = "{" + parts[0]
                    parts[1] += ",@abilities.con.mod*2}kh"
                }
            }

            const title = game.i18n.localize("DND5E.HitDiceRoll");
            const rollData = foundry.utils.deepClone(this.data.data);

            // Call the roll helper utility
            const roll = await damageRoll({
                event: new Event("hitDie"),
                parts: parts,
                data: rollData,
                title: title,
                allowCritical: false,
                fastForward: !dialog,
                dialogOptions: {width: 350},
                messageData: {
                    speaker: ChatMessage.getSpeaker({actor: this}),
                    "flags.dnd5e.roll": {type: "hitDie"}
                }
            });
            if (!roll) return null;

            // Adjust actor data
            await cls.update({"data.hitDiceUsed": cls.data.data.hitDiceUsed + 1});
            const hp = this.data.data.attributes.hp;
            const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
            await this.update({"data.attributes.hp.value": hp.value + dhp});
            return roll;
        },
        "OVERRIDE"
    );

}

function patch_shortRest(){

    // This must be overwritten due to it calling newShortRestDialog.displayDialog
    libWrapper.register(
        "short-rest-recovery",
        "CONFIG.Actor.documentClass.prototype.shortRest",
        async function patchedShortRest(...args) {

            let [dialog=true, chat=true, autoHD=false, autoHDThreshold=3] = args ?? [];

            // Take note of the initial hit points and number of hit dice the Actor has
            const hp = this.data.data.attributes.hp;
            const hd0 = this.data.data.attributes.hd;
            const hp0 = hp.value;
            let rest_data = {
                newDay: false,
                levels_regained: false
            };

            let recovery_item = this.items.find(i => {
                return i.name.toLowerCase().indexOf(game.i18n.format("DND5E.WizardRecovery").toLowerCase()) > -1 ||
                       i.name.toLowerCase().indexOf(game.i18n.format("DND5E.DruidRecovery").toLowerCase()) > -1
            });

            if(recovery_item &&
                (
                    recovery_item.data.data.activation.type !== "special" ||
                    recovery_item.data.data.uses.value === null ||
                    recovery_item.data.data.uses.max === null ||
                    recovery_item.data.data.uses.per !== "lr"
                )
            ){
                await this.updateEmbeddedDocuments("Item", [{
                    _id: recovery_item.id,
                    "data.activation.type": "special",
                    "data.uses.value": 1,
                    "data.uses.max": 1,
                    "data.uses.per": "lr",
                }]);
                ui.notifications.info(game.i18n.format("DND5E.PatchedRecovery", {
                    actor_name: this.name,
                    recovery_name: recovery_item.name
                }));
            }

            // Display a Dialog for rolling hit dice
            if ( dialog ) {
                try {
                    rest_data = await newShortRestDialog.displayDialog({actor: this, canRoll: hd0 > 0});
                } catch(err) {
                    return;
                }
            }

            // Automatically spend hit dice
            else if ( autoHD ) {
                while ( (hp.value + autoHDThreshold) <= hp.max ) {
                    const r = await this.rollHitDie(undefined, {dialog: false});
                    if ( r === null ) break;
                }
            }

            let updateData = {};
            let updateItems = [];

            if(rest_data.levels_regained){

                let level = 0;
                for (let [k, v] of Object.entries(this.data.data.spells)) {

                    if(!v.max && !v.override){
                        continue;
                    }
                    level++;

                    if(rest_data.levels_regained[level]){

                        updateData[`data.spells.${k}.value`] = v.value + rest_data.levels_regained[level];

                    }
                }

                if(recovery_item) {
                    updateItems.push({
                        _id: recovery_item.id,
                        "data.uses.value": 0
                    })
                }
            }

            // Return data summarizing the rest effects
            return this._rest(
                chat,
                rest_data.newDay,
                false,
                this.data.data.attributes.hd - hd0,
                this.data.data.attributes.hp.value - hp0,
                updateData,
                updateItems
            );
        },
        "OVERRIDE"
    );
}

function patch_rest(){

    // This too cannot be wrapped, as it calls `_displayRestResultMessage` inside of it, whose parameters we need to modify
    libWrapper.register(
        "short-rest-recovery",
        "CONFIG.Actor.documentClass.prototype._rest",
        async function patched_rest(...args) {

            const [chat, newDay, longRest, dhd=0, dhp=0, updateData={}, updateItems=[]] = args ?? [];

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
                newDay: newDay
            }

            result.updateData = foundry.utils.mergeObject(result.updateData, updateData);
            result.updateItems = result.updateItems.concat(updateItems);

            // Perform updates
            await this.update(result.updateData);
            await this.updateEmbeddedDocuments("Item", result.updateItems);

            // Display a Chat Message summarizing the rest effects
            if ( chat ) await this._displayRestResultMessage(result, longRest);

            // Return data summarizing the rest effects
            return result;

        },
        "OVERRIDE"
    );

}

function patch_displayRestResultsMessage(){
    libWrapper.register(
        "short-rest-recovery",
        "CONFIG.Actor.documentClass.prototype._displayRestResultMessage",
        async function patched_displayRestResultsMessage(wrapper, ...args){

            let chatMessage = await wrapper(...args);

            let longRest = args[1] ?? false;
            let spells = args[0]?.updateData?.data?.spells ?? false;

            let content = chatMessage.data.content;

            if(spells && !longRest){
                spells = Object.entries(spells).filter(spell => {
                    return spell[0] !== "pact";
                });
                if(spells.length) {
                    let spellSlotsString = "<ul>";
                    for (let [type, numbers] of spells){
                        if (type === "pact") continue;
                        let level = Number(type.replace('spell', ''));
                        spellSlotsString += `<li>${game.i18n.format('DND5E.SpellLevelSlotCount', {
                            number: game.i18n.localize(`${numbers.value}`),
                            slot: ordinal_suffix_of(level)
                        })}</li>`;
                    }
                    spellSlotsString += "</ul>";

                    content += game.i18n.format("DND5E.ShortRestSpellResult", {spellslots: spellSlotsString});

                    await chatMessage.update({content: content});
                }
            }

            return chatMessage;

        },
        "WRAPPER"
    );
}