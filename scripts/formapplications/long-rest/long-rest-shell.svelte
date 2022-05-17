<script>
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
    import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
    import { TJSDocument }  from '@typhonjs-fvtt/runtime/svelte/store';

    import HealthBar from "../components/HealthBar.svelte";
    import Dialog from "../components/Dialog.svelte";
    import CustomSettings from "./CustomSettingsDialog.svelte";
    import HitDieRoller from "../components/HitDieRoller.svelte";
    import Tabs from "../components/Tabs.svelte";

    import { getContext } from 'svelte';

    import RestWorkflow from "../../rest-workflow.js";
    import { evaluateFormula, getConsumableItemsFromActor, getSetting } from "../../lib/lib.js";
    import CONSTANTS from "../../constants.js";

    const { application } = getContext('external');

    export let elementRoot;
    export let actor;
    let healthBarText;
    let currHP;
    let maxHP;
    let healthPercentage;
    let healthPercentageToGain;
    let form;
    let startedLongRest = false;

    let activeTab = "rest";

    $: application.reactive.headerButtonNoClose = startedLongRest;

    let variant = game.settings.get("dnd5e", "restVariant");
    let promptNewDay = variant !== "gritty";
    let newDay = variant === "normal";

    let usingDefaultSettings = CONSTANTS.USING_DEFAULT_LONG_REST_SETTINGS();
    let enableRollHitDice = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
    let showHealthBar = enableRollHitDice || getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.RECOVERY.FULL;
    let showStartLongRestButton = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);

    const enableFoodAndWater = getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER);
    const enableAutomatedExhaustion = getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION) && getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION);
    const halfWaterSaveDC = getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);

    const actorExhaustion = getProperty(actor.data, "data.attributes.exhaustion") ?? 0;
    const actorDaysWithoutFood = getProperty(actor.data, CONSTANTS.FLAGS.STARVATION) ?? 0;
    const actorExhaustionThreshold = evaluateFormula(
        getSetting(CONSTANTS.SETTINGS.HALF_FOOD_DURATION_MODIFIER),
        foundry.utils.deepClone(actor.data.data)
    )?.total ?? 4;

    let { foods, drinks } = getConsumableItemsFromActor(actor);

    let selectedFood = foods[0]?.id ?? CONSTANTS.CONSUMABLE.REGULAR;
    let selectedDrink = drinks[0]?.id ?? CONSTANTS.CONSUMABLE.REGULAR;
    let foodLevel = 1;
    let drinkLevel = 1;

    const workflow = RestWorkflow.get(actor);

    let healthData = workflow.healthData;
    updateHealthBarText();

    let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

    export async function requestSubmit() {
        if (enableRollHitDice && healthData.hitDiceSpent === 0 && healthPercentageToGain < 0.75 && workflow.healthRegained === 0 && workflow.totalHitDice > 0) {
            const doContinue = await TJSDialog.confirm({
                title: localize("REST-RECOVERY.Dialogs.LongRestWarning.Title"),
                content: {
                    class: Dialog,
                    props: {
                        icon: "fas fa-exclamation-triangle",
                        header: localize("REST-RECOVERY.Dialogs.LongRestWarning.Title"),
                        content: localize("REST-RECOVERY.Dialogs.LongRestWarning.Content")
                    }
                },
                modal: true,
                draggable: false,
                options: {
                    height: "auto",
                    headerButtonNoClose: true
                }
            })
            if (!doContinue) return false;
        }
        form.requestSubmit();
    }

    async function updateSettings() {
        if(enableFoodAndWater){
            workflow.food = selectedFood;
            workflow.drink = selectedDrink;
        }
        workflow.finished = true;
        application.options.resolve(newDay);
        application.close();
    }

    async function cancel() {
        RestWorkflow.remove(actor);
        application.options.reject();
        application.close();
    }

    async function rollHitDice(event) {
        const rolled = await workflow.rollHitDice(selectedHitDice, event.ctrlKey === getSetting("quick-hd-roll"));
        if (!rolled) return;
        healthData = workflow.healthData;
    }

    async function startLongRest() {
        showStartLongRestButton = false;
        startedLongRest = true;
        await workflow.regainHitDice();
        healthData = workflow.healthData;
    }

    async function autoRollHitDie(){
        await workflow.autoSpendHitDice();
        healthData = workflow.healthData;
        startedLongRest = true;
    }

    const doc = new TJSDocument(actor);

    $:
    {
        $doc;
        const hpUpdate = getProperty(doc.updateOptions, "data.data.attributes.hp");
        if(hpUpdate){
            actorUpdated();
        }
    }

    async function actorUpdated() {
        if(!startedLongRest){
            workflow.refreshHealthData();
            healthData = workflow.healthData;
        }
        updateHealthBarText();
    }

    function updateHealthBarText(){
        currHP = workflow.currHP;
        maxHP = workflow.maxHP;
        healthPercentage = currHP / maxHP;
        healthPercentageToGain = (currHP + healthData.hitPointsToRegain) / maxHP;
        healthBarText = `HP: ${currHP} / ${maxHP}`
        if(healthData.hitPointsToRegain){
            healthBarText += ` (+${healthData.hitPointsToRegain})`;
        }
    }

    function showCustomRulesDialog(){
        TJSDialog.prompt({
            title: localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title"),
            content: {
                class: CustomSettings
            },
            label: "Okay",
            modal: true,
            draggable: false,
            options: {
                height: "auto",
                headerButtonNoClose: true
            }
        })
    }

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
    <form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete=off id="short-rest-hd" class="dialog-content">

        {#if enableFoodAndWater}
        <Tabs bind:activeTab tabs={[
            { value: "rest", icon: "fas fa-bed", label: "REST-RECOVERY.Dialogs.LongRest.RestTab" },
            { value: "foodwater", icon: "fas fa-drumstick-bite", label: "REST-RECOVERY.Dialogs.LongRest.FoodAndWaterTab" }
        ]} />
        {/if}

        <section class="tab-body">

            <div class="tab" class:active={activeTab === "rest"} data-group="primary" data-tab="rest">

                {#if usingDefaultSettings}
                    <p>{localize("DND5E.LongRestHint")}</p>
                {:else}
                    <p>{localize("REST-RECOVERY.Dialogs.LongRest.CustomRules")}</p>
                    <p class="notes"><a style="color: var(--color-text-hyperlink);" on:click={showCustomRulesDialog}>{localize("REST-RECOVERY.Dialogs.LongRest.CustomRulesLink")}</a></p>
                {/if}

                {#if showStartLongRestButton}
                    <div class="form-group" style="margin: 1rem 0;">
                        <button type="button" style="flex:0 1 auto;" on:click={startLongRest}>
                            <i class="fas fa-bed"></i> {localize("REST-RECOVERY.Dialogs.LongRest.Begin")}
                        </button>
                        <p class="notes">{localize("REST-RECOVERY.Dialogs.LongRest.BeginExplanation")}</p>
                    </div>
                {:else}
                    {#if enableRollHitDice}
                        <HitDieRoller
                            bind:selectedHitDice="{selectedHitDice}"
                            healthData="{healthData}"
                            isAtMaxHP="{currHP >= maxHP}"
                            onHitDiceFunction="{rollHitDice}"
                            onAutoFunction="{autoRollHitDie}"
                        />
                    {/if}

                    {#if promptNewDay}
                        <div class="form-group">
                            <label>{localize("DND5E.NewDay")}</label>
                            <input type="checkbox" name="newDay" bind:checked={newDay}/>
                            <p class="hint">{localize("DND5E.NewDayHint")}</p>
                        </div>
                    {/if}
                {/if}

                {#if showHealthBar}
                    <HealthBar text="{healthBarText}" progress="{healthPercentage}" progressGhost="{healthPercentageToGain}"/>
                {/if}

            </div>

            {#if enableFoodAndWater}
            <div class="tab" class:active={activeTab === "foodwater"} data-group="primary" data-tab="foodwater">

                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.FoodWaterRequirement", {
                    food: getSetting(CONSTANTS.SETTINGS.FOOD_POUNDS_PER_DAY),
                    water: getSetting(CONSTANTS.SETTINGS.WATER_GALLONS_PER_DAY)
                })}</p>

                <div class="flex">
                    <div>
                        <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.EatToday")}</p>
                        <select style="width:100%;" bind:value={selectedFood}>
                            {#each foods as food (food.id)}
                                <option value={food.id}>{food.name} ({food.uses} left, worth {food.worth})</option>
                            {/each}
                            <option value={CONSTANTS.CONSUMABLE.REGULAR}>Access to external food source</option>
                            <option value={CONSTANTS.CONSUMABLE.NONE}>{@html localize("REST-RECOVERY.Fractions.None")}</option>
                        </select>
                        <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.FoodAmount")}</p>
                        <div>
                            <label class="checkbox" style="margin-right:1rem;">
                                <input type="radio" disabled={selectedFood === CONSTANTS.CONSUMABLE.NONE} bind:group={foodLevel} value={1}>
                                {@html localize("REST-RECOVERY.Fractions.Full")}
                            </label>
                            <label class="checkbox">
                                <input type="radio" disabled={selectedFood === CONSTANTS.CONSUMABLE.NONE} bind:group={foodLevel} value={0.5}>
                                {@html localize("REST-RECOVERY.Fractions.Half")}
                            </label>
                        </div>

                        {#if enableAutomatedExhaustion && (selectedFood === CONSTANTS.CONSUMABLE.NONE || foodLevel === 0.5)}
                            {#if actorDaysWithoutFood > actorExhaustionThreshold}
                                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.NoFood")}</p>
                            {:else}
                                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.HalfFood", {
                                    days: Math.ceil(actorExhaustionThreshold - actorDaysWithoutFood) / (selectedFood === CONSTANTS.CONSUMABLE.NONE ? 1 : foodLevel)
                                })}</p>
                            {/if}
                        {/if}
                    </div>
                    <div>
                        <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.DrinkToday")}</p>
                        <select style="width:100%;" bind:value={selectedDrink}>
                            {#each drinks as drink (drink.id)}
                                <option value={drink.id}>{drink.name} - {drink.uses} left, worth {drink.worth} days</option>
                            {/each}
                            <option value={CONSTANTS.CONSUMABLE.REGULAR}>Access to external water source</option>
                            <option value={CONSTANTS.CONSUMABLE.NONE}>{@html localize("REST-RECOVERY.Fractions.None")}</option>
                        </select>
                        <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.DrinkAmount")}</p>
                        <div>
                            <label class="checkbox" style="margin-right:1rem;">
                                <input type="radio" disabled={selectedDrink === CONSTANTS.CONSUMABLE.NONE} bind:group={drinkLevel} value={1}>
                                {@html localize("REST-RECOVERY.Fractions.Full")}
                            </label>
                            <label class="checkbox">
                                <input type="radio" disabled={selectedDrink === CONSTANTS.CONSUMABLE.NONE} bind:group={drinkLevel} value={0.5}>
                                {@html localize("REST-RECOVERY.Fractions.Half")}
                            </label>
                        </div>
                        {#if enableAutomatedExhaustion && (selectedDrink === CONSTANTS.CONSUMABLE.NONE || drinkLevel === 0.5)}
                            {#if selectedDrink === CONSTANTS.CONSUMABLE.NONE}
                                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.NoDrink", {
                                    exhaustion: actorExhaustion > 0 ? 2 : 1
                                })}</p>
                            {:else if drinkLevel === 0.5}
                                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.HalfDrink", {
                                    dc: halfWaterSaveDC,
                                    exhaustion: actorExhaustion > 0 ? 2 : 1
                                })}</p>
                            {/if}
                        {/if}
                    </div>
                </div>

            </div>
            {/if}

        </section>


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