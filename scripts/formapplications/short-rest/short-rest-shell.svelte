<script>
    import { getContext } from 'svelte';
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
    import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
    import { TJSDocument }  from '@typhonjs-fvtt/runtime/svelte/store';

    import HealthBar from "../components/HealthBar.svelte";
    import Dialog from "../components/Dialog.svelte";
    import HitDieRoller from "../components/HitDieRoller.svelte";

    import RestWorkflow from "../../rest-workflow.js";
    import { getSetting } from "../../lib/lib.js";
    import CONSTANTS from "../../constants.js";

    const { application } = getContext('external');

    export let elementRoot;
    export let actor;
    let currHP;
    let maxHP;
    let healthPercentage;
    let form;
    let startedShortRest = false;

    $: application.reactive.headerButtonNoClose = startedShortRest;

    const maxShortRests = getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS);
    const enableRollHitDice = !getSetting(CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE);
    const currentShortRests = getProperty(actor, CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS) || 0;
    const enableShortRest = maxShortRests === 0 || currentShortRests < maxShortRests;
    const minSpendHitDice = enableRollHitDice ? getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0 : 0;

    let newDay = false;
    let promptNewDay = game.settings.get("dnd5e", "restVariant") !== "epic";

    const workflow = RestWorkflow.get(actor);

    updateHealthBarText();

    let healthData = workflow.healthData;
    let spellData = workflow.spellData;

    let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

    export async function requestSubmit() {
        if(minSpendHitDice > 0 && healthData.hitDiceSpent < minSpendHitDice){
            if(workflow.totalHitDice <= 0){
                await TJSDialog.prompt({
                    title: localize("REST-RECOVERY.Dialogs.ShortRestNoHitDice.Title"),
                    content: {
                        class: Dialog,
                        props: {
                            icon: "fas fa-exclamation-triangle",
                            header: localize("REST-RECOVERY.Dialogs.ShortRestNoHitDice.Title"),
                            content: localize("REST-RECOVERY.Dialogs.ShortRestNoHitDice.Content", { num_dice: minSpendHitDice - healthData.hitDiceSpent })
                        }
                    },
                    modal: true,
                    draggable: false,
                    options: {
                        height: "auto",
                        headerButtonNoClose: true
                    }
                })
                return false;
            }
            const doContinue = await TJSDialog.confirm({
                title: localize("REST-RECOVERY.Dialogs.ShortRestHitDice.Title"),
                content: {
                    class: Dialog,
                    props: {
                        icon: "fas fa-exclamation-triangle",
                        header: localize("REST-RECOVERY.Dialogs.ShortRestHitDice.Title"),
                        content: localize("REST-RECOVERY.Dialogs.ShortRestHitDice.Content", { num_dice: minSpendHitDice - healthData.hitDiceSpent })
                    }
                },
                modal: true,
                draggable: false,
                options: {
                    height: "auto",
                    headerButtonNoClose: true
                }
            })
            if(!doContinue) return false;
            await rollHitDice();
        }
        if(workflow.healthPercentage <= 0.75 && workflow.healthRegained === 0 && workflow.totalHitDice > 0){
            const doContinue = await TJSDialog.confirm({
                title: localize("REST-RECOVERY.Dialogs.ShortRestHealthWarning.Title"),
                content: {
                    class: Dialog,
                    props: {
                        icon: "fas fa-exclamation-triangle",
                        header: localize("REST-RECOVERY.Dialogs.ShortRestHealthWarning.Title"),
                        content: localize("REST-RECOVERY.Dialogs.ShortRestHealthWarning.Content")
                    }
                },
                modal: true,
                draggable: false,
                options: {
                    height: "auto",
                    headerButtonNoClose: true
                }
            })
            if(!doContinue) return false;
        }

        form.requestSubmit();
    }

    async function updateSettings(){
        workflow.finished = true;
        application.options.resolve(newDay);
        application.close();
    }

    async function cancel(){
        RestWorkflow.remove(actor);
        application.options.reject();
        application.close();
    }

    async function rollHitDice(event){
        const rolled = await workflow.rollHitDice(selectedHitDice, event?.ctrlKey === getSetting(CONSTANTS.SETTINGS.QUICK_HD_ROLL));
        if(!rolled) return;
        healthData = workflow.healthData;
        startedShortRest = true;
    }

    async function autoRollHitDie(){
        await workflow.autoSpendHitDice();
        healthData = workflow.healthData;
        startedShortRest = true;
    }

    function spendSpellPoint(event, level){
        workflow.spendSpellPoint(level, event.target.checked);
        spellData = workflow.spellData;
    }

    const doc = new TJSDocument(actor);

    $:
    {
        $doc;
        const hpUpdate = getProperty(doc.updateOptions, "data.data.attributes.hp");
        if (hpUpdate) {
            updateHealthData();
        }
    }

    async function updateHealthData(){
        if (!startedShortRest) {
            await workflow.refreshHealthData();
            healthData = workflow.healthData;
        }
        updateHealthBarText();
    }

    function updateHealthBarText(){
        currHP = workflow.currHP;
        maxHP = workflow.maxHP;
        healthPercentage = currHP / maxHP;
    }

</script>


<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
    <form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete=off id="short-rest-hd" class="dialog-content">

        {#if enableShortRest}

            {#if maxShortRests > 0 && currentShortRests < maxShortRests}
                <div class="form-group">
                    <p>{@html localize("REST-RECOVERY.Dialogs.ShortRest.ShortRestLimit", { num_short_rests: maxShortRests - currentShortRests })}</p>
                </div>

                <p class="notes">{@html localize("REST-RECOVERY.Dialogs.ShortRest.ShortRestLimitSmall", { max_short_rests: maxShortRests })}</p>
            {/if}

            {#if enableRollHitDice}
                <p>{localize("DND5E.ShortRestHint")}</p>

                <HitDieRoller
                    bind:selectedHitDice="{selectedHitDice}"
                    healthData="{healthData}"
                    isAtMaxHP="{currHP >= maxHP}"
                    onHitDiceFunction="{rollHitDice}"
                    onAutoFunction="{autoRollHitDie}"
                />
            {:else}
                <p>{localize("REST-RECOVERY.Dialogs.ShortRest.NoHitDiceRest")}</p>
            {/if}

            {#if spellData.feature}

                <div class="form-group">
                    <label>{localize("REST-RECOVERY.Dialogs.ShortRest.SpellSlotRecovery", { featureName: spellData.feature.name })}</label>
                </div>

                {#if spellData.missingSlots && !spellData.has_feature_use}

                    <p class="notes">{localize("REST-RECOVERY.Dialogs.ShortRest.NoFeatureUse", {
                        featureName: spellData.feature.name
                    })}</p>

                {:else if spellData.missingSlots}

                    {#each Object.entries(spellData.slots) as [level, slots], levelIndex (levelIndex)}
                        <div class="form-group">
                            <div class="form-fields" style="justify-content: flex-start;">
                                <div style="margin-right:5px; flex:0 1 auto;">Level {level}: </div>
                                <div style="flex:0 1 auto;">
                                    {#each slots as slot, slotIndex (slotIndex)}
                                        <input
                                            type='checkbox'
                                            disabled="{slot.disabled || slot.alwaysDisabled}"
                                            bind:checked="{slot.checked}"
                                            on:change="{(event) => { spendSpellPoint(event, level, slotIndex) }}"
                                        >
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/each}

                    <p style="font-style: italic;">{localize("REST-RECOVERY.Dialogs.ShortRest.SpellSlotsLeft", {
                        spellSlotsLeft: spellData.pointsTotal - spellData.pointsSpent,
                    })}</p>

                {:else}

                    <p class="notes">{localize("REST-RECOVERY.Dialogs.ShortRest.FullSpells")}</p>

                {/if}

            {/if}

            {#if promptNewDay}
            <div class="form-group">
                <label>{localize("DND5E.NewDay")}</label>
                <input type="checkbox" name="newDay" bind:checked={newDay}/>
                <p class="hint">{localize("DND5E.NewDayHint")}</p>
            </div>
            {/if}

        {:else}

            <div class="form-group">
                <label>{localize("REST-RECOVERY.Dialogs.ShortRest.NoMoreRests")}</label>
            </div>

            <p class="notes">{localize("REST-RECOVERY.Dialogs.ShortRest.NoMoreRestsSmall", { max_short_rests: maxShortRests })}</p>

        {/if}

        <HealthBar text="HP: {currHP} / {maxHP}" progress="{healthPercentage}"/>

        {#if minSpendHitDice > 0 && healthData.hitDiceSpent < minSpendHitDice}
            <p>{@html localize("REST-RECOVERY.Dialogs.ShortRest.MinHitDiceSpend", { min_spend: minSpendHitDice - healthData.hitDiceSpent })}</p>
        {/if}

        <footer class="flexrow" style="margin-top:0.5rem;">
            {#if enableShortRest}
                <button type="button" class="dialog-button" on:click={requestSubmit}><i class="fas fa-bed"></i> {localize("DND5E.Rest")}</button>
                {#if !startedShortRest}
                    <button type="button" class="dialog-button" on:click={cancel}><i class="fas fa-times"></i> {localize("Cancel")}</button>
                {/if}
            {:else}
                <button type="button" class="dialog-button" on:click={cancel}><i class="fas fa-check"></i> {localize("Okay")}</button>
            {/if}
        </footer>

    </form>
</ApplicationShell>