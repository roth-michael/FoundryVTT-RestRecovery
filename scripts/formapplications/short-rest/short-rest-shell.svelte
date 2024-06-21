<script>
  import { getContext } from 'svelte';
  import { localize } from '#runtime/svelte/helper';
  import { TJSDialog } from '#runtime/svelte/application';
  import { ApplicationShell } from '#runtime/svelte/component/core';
  import { TJSDocument } from '#runtime/svelte/store/fvtt/document';

  import HealthBar from "../components/HealthBar.svelte";
  import Dialog from "../components/Dialog.svelte";
  import HitDieRoller from "../components/HitDieRoller.svelte";

  import RestWorkflow from "../../rest-workflow.js";
  import * as lib from "../../lib/lib.js";
  import { getSetting } from "../../lib/lib.js";
  import CONSTANTS from "../../constants.js";
  import Steps from "../rest-steps/Steps.svelte";

  const { application } = getContext('#external');

  export let elementRoot;
  const actor = application.options.actor;
  let currHP;
  let maxHP;
  let healthPercentage;
  let form;
  let startedShortRest = false;

  const workflow = RestWorkflow.get(actor);

  $: application.reactive.headerButtonNoClose = startedShortRest;

  const maxShortRests = getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS);
  const enableRollHitDice = !getSetting(CONSTANTS.SETTINGS.DISABLE_SHORT_REST_HIT_DICE);
  const currentShortRests = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.CURRENT_NUM_SHORT_RESTS) || 0;
  const enableShortRest = maxShortRests === 0 || currentShortRests < maxShortRests;

  const minSpendHitDice = enableRollHitDice ? getSetting(CONSTANTS.SETTINGS.MIN_HIT_DIE_SPEND) || 0 : 0;
  const maxHitDiceSpendMultiplier = lib.determineMultiplier(CONSTANTS.SETTINGS.MAX_HIT_DICE_SPEND);
  let maxSpendHitDice;
  if (typeof maxHitDiceSpendMultiplier === "string") {
    lib.evaluateFormula(maxHitDiceSpendMultiplier, actor.getRollData()).then(res => {
      maxSpendHitDice = Math.floor(res?.total ?? 0);
    });
  } else {
    maxSpendHitDice = Math.floor((actor.type === 'npc' ? actor.system.attributes.hd.max : actor.system.details.level) * maxHitDiceSpendMultiplier);
  }
  maxSpendHitDice = Math.max(minSpendHitDice, maxSpendHitDice);

  const simpleCalendarActive = lib.getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
  const timeChanges = lib.getTimeChanges(false);
  let newDay = application.options.restPrompted ? application.options.newDay : (simpleCalendarActive ? timeChanges.isNewDay : application.options.newDay ?? true);
  let promptNewDay = !simpleCalendarActive && workflow.restVariant !== "epic" && application.options.promptNewDay;

  updateHealthBarText();

  let healthData = workflow.healthData;

  let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

  export async function requestSubmit() {
    if (minSpendHitDice > 0 && healthData.hitDiceSpent < minSpendHitDice) {
      if (workflow.totalHitDice <= 0) {
        await TJSDialog.prompt({
          title: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Title"),
          content: {
            class: Dialog,
            props: {
              icon: "fas fa-exclamation-triangle",
              header: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Title"),
              content: localize("REST-RECOVERY.Dialogs.RestNoHitDice.Content", { num_dice: minSpendHitDice - healthData.hitDiceSpent })
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
        title: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Title"),
        content: {
          class: Dialog,
          props: {
            icon: "fas fa-exclamation-triangle",
            header: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Title"),
            content: localize("REST-RECOVERY.Dialogs.RestSpendHitDice.Content", { num_dice: minSpendHitDice - healthData.hitDiceSpent })
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
      await rollHitDice();
    }
    if (workflow.healthPercentage <= 0.75 && workflow.healthRegained === 0 && workflow.totalHitDice > 0 && enableRollHitDice) {
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

  async function nextStep() {
    activeStep = Math.min(workflow.steps.length, activeStep + 1);
  }

  async function prevStep() {
    activeStep = Math.max(0, activeStep - 1);
  }

  async function rollHitDice(event) {
    const rolled = await workflow.rollHitDice(selectedHitDice, event?.ctrlKey === getSetting(CONSTANTS.SETTINGS.QUICK_HD_ROLL));
    if (!rolled) return;
    healthData = workflow.healthData;
    startedShortRest = true;
  }

  async function autoRollHitDie() {
    await workflow.autoSpendHitDice();
    healthData = workflow.healthData;
    startedShortRest = true;
  }

  const doc = new TJSDocument(actor);

  $:
  {
    $doc;
    const { data, renderData } = doc.updateOptions;
    const hpUpdate = foundry.utils.getProperty(data ?? renderData, "system.attributes.hp");
    if (hpUpdate) {
      updateHealthData();
    }
  }

  async function updateHealthData() {
    if (!startedShortRest) {
      await workflow.refreshHealthData();
      healthData = workflow.healthData;
    }
    updateHealthBarText();
  }

  function updateHealthBarText() {
    currHP = workflow.currHP;
    maxHP = workflow.maxHP;
    healthPercentage = currHP / maxHP;
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

    {#if enableShortRest}

      {#if activeStep === 0}

        {#if maxShortRests > 0 && currentShortRests < maxShortRests}
          <div class="form-group">
            <p>{@html localize("REST-RECOVERY.Dialogs.ShortRest.ShortRestLimit", { num_short_rests: maxShortRests - currentShortRests })}</p>
          </div>

          <p
            class="notes">{@html localize("REST-RECOVERY.Dialogs.ShortRest.ShortRestLimitSmall", { max_short_rests: maxShortRests })}</p>
        {/if}

        {#if enableRollHitDice}
          <p>{localize("DND5E.ShortRestHint")}</p>

          <HitDieRoller
            bind:selectedHitDice="{selectedHitDice}"
            bind:healthData="{healthData}"
            onHitDiceFunction="{rollHitDice}"
            onAutoFunction="{autoRollHitDie}"
            workflow="{workflow}"
            minSpendHitDice="{minSpendHitDice}"
            maxSpendHitDice="{maxSpendHitDice}"
          />
        {:else}
          <p>{localize("REST-RECOVERY.Dialogs.ShortRest.NoHitDiceRest")}</p>
        {/if}

        {#if promptNewDay || newDay}
          <div class="form-group">
            <label>
              {localize(!promptNewDay && newDay ? "REST-RECOVERY.Dialogs.ShortRest.ForcedNewDayTitle" : "DND5E.NewDay")}
            </label>
            <input type="checkbox" bind:checked={newDay} disabled={!promptNewDay}/>
            <p class="hint">
              {localize(!promptNewDay && newDay ? "REST-RECOVERY.Dialogs.ShortRest.ForcedNewDayHint" : "DND5E.NewDayHint")}
            </p>
          </div>
        {/if}

        <HealthBar text="HP: {currHP} / {maxHP}" progress="{healthPercentage}"/>

        {#if minSpendHitDice > 0 && healthData.hitDiceSpent < minSpendHitDice}
          <p>{@html localize("REST-RECOVERY.Dialogs.ShortRest.MinHitDiceSpend", { min_spend: minSpendHitDice - healthData.hitDiceSpent })}</p>
        {/if}

        {#if maxSpendHitDice > 0 && maxSpendHitDice !== healthData.level}
          <p>{@html localize("REST-RECOVERY.Dialogs.ShortRest.MaxHitDiceSpend", {
            max_spend: maxSpendHitDice,
            current: maxSpendHitDice - healthData.hitDiceSpent
          })}</p>
        {/if}


      {:else}

        <svelte:component this={workflow.steps[activeStep].component} {workflow}/>

      {/if}

    {:else}

      <div class="form-group">
        <label>{@html localize("REST-RECOVERY.Dialogs.ShortRest.NoMoreRests")}</label>
      </div>

      <p class="notes">
        {@html localize("REST-RECOVERY.Dialogs.ShortRest.NoMoreRestsSmall", { max_short_rests: maxShortRests })}
      </p>

    {/if}

    <footer class="flexrow" style="margin-top:0.5rem;">

      {#if workflow.steps.length > 1}
        <button type="button" class="dialog-button" disabled={activeStep === 0} on:click={() => { prevStep(); }}>
          <i class="fas fa-chevron-left"></i> {localize("REST-RECOVERY.Dialogs.RestSteps.Prev")}
        </button>
      {/if}

      {#if activeStep === workflow.steps.length - 1}
        <button type="button" class="dialog-button" on:click={requestSubmit}>
          <i class="fas fa-bed"></i> {localize("REST-RECOVERY.Dialogs.ShortRest.FinishRest")}
        </button>
      {:else}
        <button type="button" class="dialog-button" on:click={() => { nextStep(); }}>
          {localize("REST-RECOVERY.Dialogs.RestSteps.Next")} <i class="fas fa-chevron-right"></i>
        </button>
      {/if}

    </footer>

  </form>
</ApplicationShell>
