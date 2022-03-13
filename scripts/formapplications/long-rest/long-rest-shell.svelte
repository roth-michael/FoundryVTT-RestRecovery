<script>
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
    import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';

    import { getContext } from 'svelte';

    import RestWorkflow from "../../rest-workflow.js";
    import { dialogLayout, getSetting } from "../../lib/lib.js";
    import CONSTANTS from "../../constants.js";
    import HealthBar from "../components/HealthBar.svelte";

    const { application } = getContext('external');

    export let elementRoot;
    export let actor;
    let currHP;
    let maxHP;
    let healthPercentage;
    let form;
    let startedLongRest = false;

    // This is a reactive statement. When `draggable` changes `foundryApp.reactive.draggable` is set.
    $: application.reactive.headerButtonNoClose = startedLongRest;

    let variant = game.settings.get("dnd5e", "restVariant");
    let promptNewDay = variant !== "gritty";
    let newDay = variant === "normal";

    let enableRollHitDice = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
    let showStartLongRestButton = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);

    const workflow = RestWorkflow.get(actor);

    let healthData = workflow.healthData;
    updateHealthBar();

    let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

    export async function requestSubmit() {
        if (workflow.healthPercentage < 0.5 && workflow.healthRegained === 0 && workflow.totalHitDice > 0) {
            const doContinue = await TJSDialog.confirm({
                title: "Finish Long Rest?",
                content: dialogLayout({
                    title: "Finish Long Rest?",
                    message: "You haven't spent any hit dice to regain hit points, are you sure you want to finish your long rest?"
                }),
                modal: true,
                draggable: false
            })
            if (!doContinue) return false;
        }
        form.requestSubmit();
    }

    async function updateSettings() {
        application.options.resolve(newDay);
        application.close();
    }

    async function cancel() {
        workflow.finished = true;
        application.options.reject();
        application.close();
    }

    async function rollHitDice(event) {
        const rolled = await workflow.rollHitDice(selectedHitDice, event.ctrlKey === getSetting("quick-hd-roll"));
        if (!rolled) return;
        healthData = workflow.healthData;
        startedLongRest = true;
    }

    async function startLongRest() {
        showStartLongRestButton = false;
        startedLongRest = true;
        await workflow.regainHitDice();
        healthData = workflow.healthData;
    }

    export async function updateHealthBar() {
        currHP = actor.data.data.attributes.hp.value;
        maxHP = actor.data.data.attributes.hp.max;
        healthPercentage = currHP / maxHP;
    }

</script>


<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
    <form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete=off id="short-rest-hd" class="dialog-content">

        <p>{localize("DND5E.LongRestHint")}</p>
        {#if showStartLongRestButton}
            <div class="form-group" style="margin: 1rem 0;">
                <button type="button" style="flex:0 1 auto;" on:click={startLongRest}>
                    <i class="fas fa-bed"></i> {localize("REST-RECOVERY.Dialogs.LongRest.Begin")}
                </button>
                <p class="notes">{localize("REST-RECOVERY.Dialogs.LongRest.BeginExplanation")}</p>
            </div>
        {:else}
        {#if enableRollHitDice}
            <div class="form-group">
                <label>{localize("DND5E.ShortRestSelect")}</label>
                <div class="form-fields">
                    <select name="hd" bind:value={selectedHitDice}>
                        {#each Object.entries(healthData.availableHitDice) as [hitDice, num], index (index)}
                            <option value="{hitDice}">{hitDice} ({num} {localize("DND5E.available")})</option>
                        {/each}
                    </select>
                    <button type="button" disabled="{currHP >= maxHP || healthData.totalHitDice === 0 || healthData.availableHitDice[selectedHitDice] === 0}" on:click={(event) => { rollHitDice(event) }}>
                        <i class="fas fa-dice-d20"></i> {localize("DND5E.Roll")}
                    </button>
                </div>
                {#if healthData.totalHitDice === 0}
                    <p class="notes">{localize("DND5E.ShortRestNoHD")}</p>
                {/if}
                {#if currHP >= maxHP}
                    <p class="notes">{localize("REST-RECOVERY.Dialogs.ShortRest.FullHealth")}</p>
                {/if}
            </div>
            {/if}

            {#if promptNewDay}
                <div class="form-group">
                    <label>{localize("DND5E.NewDay")}</label>
                    <input type="checkbox" name="newDay" bind:checked={newDay}/>
                    <p class="hint">{localize("DND5E.NewDayHint")}</p>
                </div>
            {/if}
        {/if}

        {#if enableRollHitDice}
            <HealthBar text="HP: {currHP} / {maxHP}" progress="{healthPercentage}"/>
        {/if}

        <footer class="flexrow" style="margin-top:0.5rem;">
            {#if !showStartLongRestButton}
            <button type="button" class="dialog-button" on:click={requestSubmit}><i class="fas fa-bed"></i> {localize("DND5E.Rest")}</button>
            {/if}
            {#if !startedLongRest}
                <button type="button" class="dialog-button" on:click={cancel}><i class="fas fa-times"></i> {localize("Cancel")}</button>
            {/if}
        </footer>

    </form>
</ApplicationShell>