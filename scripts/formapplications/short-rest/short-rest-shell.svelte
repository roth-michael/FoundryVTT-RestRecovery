<script>
    import { getContext } from 'svelte';
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import RestWorkflow from "../../rest-workflow.js";
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
    import { dialogLayout } from "../../lib/lib.js";
    import CONSTANTS from "../../constants.js";

    const progress = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });

    const { application } = getContext('external');

    export let actor;
    let form;
    let hasSpentHitDice = false;

    // This is a reactive statement. When `draggable` changes `foundryApp.reactive.draggable` is set.
    $: application.reactive.headerButtonNoClose = hasSpentHitDice;

    let newDay = false;
    let promptNewDay = game.settings.get("dnd5e", "restVariant") !== "epic";

    const workflow = RestWorkflow.get(actor);

    let healthData = workflow.healthData;
    let spellData = workflow.spellData;

    let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];
    progress.set(workflow.healthPercentage);

    export async function requestSubmit() {
        if(workflow.healthPercentage < 0.5 && workflow.healthRegained === 0 && workflow.totalHitDice > 0){
            const doContinue = await TJSDialog.confirm({
                title: "Finish Short Rest?",
                content: dialogLayout({
                    title: "Finish Short Rest?",
                    message: "You haven't spent any hit dice to regain hit points, are you sure you want to finish your short rest?"
                }),
                modal: true,
                draggable: false
            })
            if(!doContinue) return false;
        }
        form.requestSubmit();
    }

    async function updateSettings(){
        application.options.resolve(newDay);
        application.close();
    }

    async function cancel(){
        application.options.reject();
        application.close();
    }

    async function rollHitDice(event){
        const rolled = await workflow.rollHitDice(selectedHitDice, event.ctrlKey === game.settings.get(CONSTANTS.MODULE_NAME, "quick-hd-roll"));
        if(!rolled) return;
        healthData = workflow.healthData;
        hasSpentHitDice = true;
        await progress.set(workflow.healthPercentage);
    }

    function spendSpellPoint(event, level){
        workflow.spendSpellPoint(level, event.target.checked);
        spellData = workflow.spellData;
    }

</script>


<svelte:options accessors={true}/>

<form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete=off id="short-rest-hd" class="dialog-content">

    <p>{localize("DND5E.ShortRestHint")}</p>

    <div class="form-group">
        <label>{localize("DND5E.ShortRestSelect")}</label>
        <div class="form-fields">
            <select name="hd" bind:value={selectedHitDice}>
            {#each Object.entries(healthData.availableHitDice) as [hitDice, num], index (index)}
                <option value="{hitDice}">{hitDice} ({num} {localize("DND5E.available")})</option>
            {/each}
            </select>
            <button type="button" disabled="{healthData.totalHitDice === 0 || healthData.availableHitDice[selectedHitDice] === 0 || actor.data.data.attributes.hp.value >= actor.data.data.attributes.hp.max}" on:click={rollHitDice}>
                <i class="fas fa-dice-d20"></i> {localize("DND5E.Roll")}
            </button>
        </div>
        {#if healthData.totalHitDice === 0}
        <p class="notes">{localize("DND5E.ShortRestNoHD")}</p>
        {/if}
        {#if actor.data.data.attributes.hp.value >= actor.data.data.attributes.hp.max}
        <p class="notes">{localize("REST-RECOVERY.Dialogs.ShortRest.FullHealth")}</p>
        {/if}
    </div>

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
                                    on:change="{spendSpellPoint(event, level, slotIndex)}"
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

    <div class="healthbar">
        <div class="progress" style="width:{$progress*100}%;"></div>
        <div class="overlay"></div>
    </div>

    <footer class="flexrow" style="margin-top:0.5rem;">
        <button type="button" class="dialog-button" on:click={requestSubmit}><i class="fas fa-bed"></i> {localize("DND5E.Rest")}</button>
        {#if !hasSpentHitDice}
            <button type="button" class="dialog-button" on:click={cancel}><i class="fas fa-times"></i> {localize("Cancel")}</button>
        {/if}
    </footer>

</form>

<style lang="scss">

    .healthbar{
      width: 100%;
      height: 10px;
      border-radius: 5px;
      overflow: hidden;
      background-color: #a7a7a7;

      > div {
        height: 100%;
      }

      .progress {
        background-color: #f34c4c;
      }

      .overlay{
        position: relative;
        top: -10px;
        width: 100%;
        box-shadow: 0 0 2px 2px inset rgb(0 0 0 / 25%);
      }
    }

</style>