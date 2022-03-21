<script>
    import { getContext } from 'svelte';
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
    import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';

    import HealthBar from "../components/HealthBar.svelte";
    import Dialog from "../components/Dialog.svelte";
    import HitDieRoller from "../components/HitDieRoller.svelte";

    import RestWorkflow from "../../rest-workflow.js";
    import { getSetting } from "../../lib/lib.js";

    const { application } = getContext('external');

    export let elementRoot;
    export let actor;
    let currHP;
    let maxHP;
    let healthPercentage;
    let form;
    let startedShortRest = false;

    $: application.reactive.headerButtonNoClose = startedShortRest;

    let newDay = false;
    let promptNewDay = game.settings.get("dnd5e", "restVariant") !== "epic";

    const workflow = RestWorkflow.get(actor);

    let healthData = workflow.healthData;
    let spellData = workflow.spellData;

    let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

    updateHealthBar();

    export async function requestSubmit() {
        if(workflow.healthPercentage < 0.5 && workflow.healthRegained === 0 && workflow.totalHitDice > 0){
            const doContinue = await TJSDialog.confirm({
                title: localize("REST-RECOVERY.Dialogs.ShortRestWarning.Title"),
                content: {
                    class: Dialog,
                    props: {
                        icon: "fas fa-exclamation-triangle",
                        header: localize("REST-RECOVERY.Dialogs.ShortRestWarning.Title"),
                        content: localize("REST-RECOVERY.Dialogs.ShortRestWarning.Content")
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
        application.options.reject();
        application.close();
    }

    async function rollHitDice(event){
        const rolled = await workflow.rollHitDice(selectedHitDice, event.ctrlKey === getSetting("quick-hd-roll"));
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

    export async function updateHealthBar(){
        if(!startedShortRest){
            workflow.fetchHealthData();
            healthData = workflow.healthData;
        }
        currHP = workflow.currHP;
        maxHP = workflow.maxHP;
        healthPercentage = currHP / maxHP;
    }

</script>


<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
    <form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete=off id="short-rest-hd" class="dialog-content">

        <p>{localize("DND5E.ShortRestHint")}</p>

        <HitDieRoller
            selectedHitDice="{selectedHitDice}"
            healthData="{healthData}"
            isAtMaxHP="{currHP >= maxHP}"
            onHitDiceFunction="{rollHitDice}"
            onAutoFunction="{autoRollHitDie}"
        />

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

        <HealthBar text="HP: {currHP} / {maxHP}" progress="{healthPercentage}"/>

        <footer class="flexrow" style="margin-top:0.5rem;">
            <button type="button" class="dialog-button" on:click={requestSubmit}><i class="fas fa-bed"></i> {localize("DND5E.Rest")}</button>
            {#if !startedShortRest}
                <button type="button" class="dialog-button" on:click={cancel}><i class="fas fa-times"></i> {localize("Cancel")}</button>
            {/if}
        </footer>

    </form>
</ApplicationShell>