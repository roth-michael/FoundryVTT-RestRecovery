<script>
  import { localize } from '#runtime/svelte/helper';
  import { TJSDialog } from '#runtime/svelte/application';
  import { ApplicationShell } from '#runtime/svelte/component/core';
  import { TJSDocument } from '#runtime/svelte/store/fvtt/document';

  import { getContext } from 'svelte';

  import HealthBar from "../components/HealthBar.svelte";
  import Dialog from "../components/Dialog.svelte";
  import CustomSettings from "../custom-settings-dialog/CustomSettingsDialog.svelte";
  import HitDieRoller from "../components/HitDieRoller.svelte";
  import RestWorkflow from "../../rest-workflow.js";
  import * as lib from "../../lib/lib.js";
  import { getSetting } from "../../lib/lib.js";
  import CONSTANTS from "../../constants.js";
  import Steps from "../rest-steps/Steps.svelte";

  const { application } = getContext('#external');

  export let elementRoot;
  const actor = application.options.actor;
  let healthBarText;
  let currHP;
  let maxHP;
  let healthPercentage;
  let healthPercentageToGain;
  let form;
  let startedLongRest = false;

  const workflow = RestWorkflow.get(actor);
  let canAfford = true;
  let storedCanAfford = true;
  let storedFoodAndWaterCost = 0;

  let activeTab = "rest";

  $: application.reactive.headerButtonNoClose = startedLongRest;

  const simpleCalendarActive = lib.getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
  const timeChanges = lib.getTimeChanges(true);
  let newDay = application.options.restPrompted ? application.options.newDay : (simpleCalendarActive ? timeChanges.isNewDay : application.options.newDay ?? true);
  let promptNewDay = !simpleCalendarActive && workflow.restVariant !== "gritty" && application.options.promptNewDay;

  let usingDefaultSettings = CONSTANTS.USING_DEFAULT_LONG_REST_SETTINGS();
  let enableRollHitDice = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
  let showHealthBar = enableRollHitDice || getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.FRACTIONS.FULL;
  let showStartLongRestButton = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);

  const maxHitDiceSpendMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.LONG_MAX_HIT_DICE_SPEND);
  // TODO: Does this work?
  let maxSpendHitDice;
  if (typeof maxHitDiceSpendMultiplier === "string") {
    lib.evaluateFormula(maxHitDiceSpendMultiplier, actor.getRollData()).then(res => {
      maxSpendHitDice = Math.floor(res?.total ?? 0);
    });
  } else {
    maxSpendHitDice = Math.floor((actor.type === "npc" ? actor.system.attributes.hd.max : actor.system.details.level) * maxHitDiceSpendMultiplier);
  }
  // const maxSpendHitDice = typeof maxHitDiceSpendMultiplier === "string"
  //   ? Math.floor(lib.evaluateFormula(maxHitDiceSpendMultiplier, actor.getRollData())?.total ?? 0)
  //   : Math.floor(actor.system.details.level * maxHitDiceSpendMultiplier);

  const showArmorCheckbox = getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && workflow.healthData.hasNonLightArmor;

  let healthData = workflow.healthData;
  updateHealthBarText();

  let selectedHitDice = Object.entries(healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

  async function nextStep() {
    activeStep = Math.min(workflow.steps.length, activeStep + 1);
    if (workflow.steps[activeStep].title === "REST-RECOVERY.Dialogs.RestSteps.FoodWater.Title") {
      canAfford = storedCanAfford;
      workflow.foodAndWaterCost = storedFoodAndWaterCost;
    }
  }

  async function prevStep() {
    if (workflow.steps[activeStep].title === "REST-RECOVERY.Dialogs.RestSteps.FoodWater.Title") {
      storedCanAfford = canAfford;
      canAfford = true;
      storedFoodAndWaterCost = workflow.foodAndWaterCost;
      workflow.foodAndWaterCost = 0;
    }
    activeStep = Math.max(0, activeStep - 1);
  }

  async function requestSubmit() {

    if (enableRollHitDice
      && healthData.hitDiceSpent === 0
      && healthPercentageToGain < 0.75
      && workflow.healthRegained === 0
      && workflow.totalHitDice > 0
    ) {
      const doContinue = await TJSDialog.confirm({
        title: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
        content: {
          class: Dialog,
          props: {
            icon: "fas fa-exclamation-triangle",
            header: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Title"),
            content: localize("REST-RECOVERY.Dialogs.RestHealthWarning.Content")
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

  async function autoRollHitDie() {
    await workflow.autoSpendHitDice();
    healthData = workflow.healthData;
    startedLongRest = true;
  }

  const doc = new TJSDocument(actor);

  $: {
    $doc;
    const { data, renderData } = doc.updateOptions;
    const hpUpdate = foundry.utils.getProperty(data ?? renderData, "system.attributes.hp");
    if (hpUpdate) {
      updateHealthData();
    }
  }

  async function updateHealthData() {
    if (!startedLongRest) {
      await workflow.refreshHealthData();
      healthData = workflow.healthData;
    }
    updateHealthBarText();
  }

  function updateHealthBarText() {
    currHP = workflow.currHP;
    maxHP = workflow.maxHP;
    healthPercentage = currHP / maxHP;
    healthPercentageToGain = (currHP + healthData.hitPointsToRegainFromRest) / maxHP;
    healthBarText = `HP: ${currHP} / ${maxHP}`
    if (healthData.hitPointsToRegainFromRest) {
      healthBarText += ` (+${healthData.hitPointsToRegainFromRest})`;
    }
  }

  function showCustomRulesDialog() {
    TJSDialog.prompt({
      title: localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title"),
      content: {
        class: CustomSettings
      },
      label: "Okay",
      options: {
        height: "auto",
        width: "350",
        headerButtonNoClose: true,
	      zIndex: 10
      }
    })
  }

  let activeStep = 0;

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
  <form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete=off id="short-rest-hd"
        class="dialog-content">

    {#if workflow.steps.length > 1}
      <Steps steps={workflow.steps} bind:activeStep={activeStep}/>
    {/if}

    {#if activeStep === 0}

      {#if usingDefaultSettings}
        <p>{localize("DND5E.LongRestHint")}</p>
      {:else}
        <p>{localize("REST-RECOVERY.Dialogs.LongRest.CustomRules")}</p>
        <p class="notes">
          <a style="color: var(--color-text-hyperlink);"
             on:click={showCustomRulesDialog}>
            {localize("REST-RECOVERY.Dialogs.LongRest.CustomRulesLink")}
          </a>
        </p>
      {/if}

      {#if !showStartLongRestButton}
        {#if enableRollHitDice}
          <HitDieRoller
            bind:selectedHitDice="{selectedHitDice}"
            bind:healthData="{healthData}"
            onHitDiceFunction="{rollHitDice}"
            onAutoFunction="{autoRollHitDie}"
            workflow="{workflow}"
            maxSpendHitDice="{maxSpendHitDice}"
          />
        {/if}

        {#if promptNewDay || newDay}
          <div class="form-group">
            <label>
              {localize(!promptNewDay && newDay ? "REST-RECOVERY.Dialogs.LongRest.ForcedNewDayTitle" : "DND5E.NewDay")}
            </label>
            {#if promptNewDay}
              <input type="checkbox" bind:checked={newDay}/>
            {/if}
            <p class="hint">
              {localize(!promptNewDay && newDay ? "REST-RECOVERY.Dialogs.LongRest.ForcedNewDayHint" : "DND5E.NewDayHint")}
            </p>
          </div>
        {/if}

      {/if}

      {#if showHealthBar}
        <HealthBar text="{healthBarText}" progress="{healthPercentage}" progressGhost="{healthPercentageToGain}"/>
      {/if}

      {#if maxSpendHitDice > 0 && maxSpendHitDice !== healthData.level}
        <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.MaxHitDiceSpend", {
          max_spend: maxSpendHitDice,
          current: maxSpendHitDice - healthData.hitDiceSpent
        })}</p>
      {/if}

      {#if showArmorCheckbox}
        <div class="form-group">
          <label>{localize("REST-RECOVERY.Dialogs.LongRest.ArmorRecovery")}</label>
          <input type="checkbox" bind:checked={healthData.removeNonLightArmor}/>
          <p class="hint">{localize("REST-RECOVERY.Dialogs.LongRest.ArmorRecoveryHint")}</p>
        </div>
      {/if}

    {:else}

      <svelte:component bind:canAfford this={workflow.steps[activeStep].component} {workflow}/>

    {/if}

    {#if showStartLongRestButton}
      <div class="form-group" style="margin: 0.5rem 0;">
        <p class="notes">{localize("REST-RECOVERY.Dialogs.LongRest.BeginExplanation")}</p>
      </div>
    {/if}

    <footer class="flexrow" style="margin-top:0.5rem;">
      {#if showStartLongRestButton}
        <button type="button" class="dialog-button" on:click={startLongRest}>
          <i class="fas fa-bed"></i> {localize("REST-RECOVERY.Dialogs.LongRest.Begin")}
        </button>
      {:else}
        {#if workflow.steps.length > 1 && !showStartLongRestButton}
          <button type="button" class="dialog-button" disabled={activeStep === 0} on:click={() => { prevStep(); }}>
            <i class="fas fa-chevron-left"></i> {localize("REST-RECOVERY.Dialogs.RestSteps.Prev")}
          </button>
        {/if}

        {#if activeStep === workflow.steps.length - 1}
          <button disabled={canAfford === false} type="button" class="dialog-button" on:click={requestSubmit}>
            <i class="fas fa-bed"></i> {localize("REST-RECOVERY.Dialogs.LongRest.FinishRest")}
          </button>
        {:else}
          <button disabled={canAfford === false} type="button" class="dialog-button" on:click={() => { nextStep(); }}>
            {localize("REST-RECOVERY.Dialogs.RestSteps.Next")} <i class="fas fa-chevron-right"></i>
          </button>
        {/if}

      {/if}
    </footer>

  </form>
</ApplicationShell>

<style lang="scss">

  .dialog-button {

    &:disabled {
      cursor: not-allowed;
    }
  }

</style>
