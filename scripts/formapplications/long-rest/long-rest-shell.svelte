<script>
  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
  import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
  import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
  import { TJSDocument } from '@typhonjs-fvtt/runtime/svelte/store';

  import { getContext } from 'svelte';

  import HealthBar from "../components/HealthBar.svelte";
  import Dialog from "../components/Dialog.svelte";
  import CustomSettings from "./CustomSettingsDialog.svelte";
  import HitDieRoller from "../components/HitDieRoller.svelte";
  import Tabs from "../components/Tabs.svelte";

  import FoodWaterTab from "./FoodWaterTab.svelte";
  import RestWorkflow from "../../rest-workflow.js";
  import { getActorConsumableValues, getSetting } from "../../lib/lib.js";
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

  const workflow = RestWorkflow.get(actor);

  let activeTab = "rest";

  $: application.reactive.headerButtonNoClose = startedLongRest;

  let variant = game.settings.get("dnd5e", "restVariant");
  let promptNewDay = variant !== "gritty";
  let newDay = variant === "normal";

  let usingDefaultSettings = CONSTANTS.USING_DEFAULT_LONG_REST_SETTINGS();
  let enableRollHitDice = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
  let showHealthBar = enableRollHitDice || getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.FRACTIONS.FULL;
  let showStartLongRestButton = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);

  const actorNeedsNoFoodWater = getProperty(actor, `flags.dnd5e.noFoodWater`);
  const enableFoodAndWater = getSetting(CONSTANTS.SETTINGS.ENABLE_FOOD_AND_WATER) && !actorNeedsNoFoodWater;

  const showArmorCheckbox = getSetting(CONSTANTS.SETTINGS.LONG_REST_ARMOR_AUTOMATION) && workflow.healthData.hasNonLightArmor;

  let {
    actorRequiredFood,
    actorRequiredWater,
    actorFoodSatedValue,
    actorWaterSatedValue
  } = getActorConsumableValues(actor);

  let healthData = workflow.healthData;
  updateHealthBarText();

  let selectedHitDice = Object.entries(healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

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
    const { data } = doc.updateOptions;
    const hpUpdate = getProperty(data, "system.attributes.hp");
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
      modal: true,
      draggable: false,
      options: {
        height: "auto",
        width: "350",
        headerButtonNoClose: true
      }
    })
  }

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
  <form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete=off id="short-rest-hd"
        class="dialog-content">

    {#if enableFoodAndWater}
      <Tabs bind:activeTab tabs={[
            { value: "rest", icon: "fas fa-bed", label: "REST-RECOVERY.Dialogs.LongRest.RestTab" },
            {
                value: "foodwater", icon: "fas fa-drumstick-bite", label: "REST-RECOVERY.Dialogs.LongRest.FoodAndWaterTab",
                highlight: (actorRequiredFood && actorFoodSatedValue < actorRequiredFood) || (actorRequiredWater && actorWaterSatedValue < actorRequiredWater)
            }
        ]}/>
    {/if}

    <section class="tab-body">

      <div class="tab" class:active={activeTab === "rest"} data-group="primary" data-tab="rest">

        {#if usingDefaultSettings}
          <p>{localize("DND5E.LongRestHint")}</p>
        {:else}
          <p>{localize("REST-RECOVERY.Dialogs.LongRest.CustomRules")}</p>
          <p class="notes"><a style="color: var(--color-text-hyperlink);"
                              on:click={showCustomRulesDialog}>{localize("REST-RECOVERY.Dialogs.LongRest.CustomRulesLink")}</a>
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

      {#if enableFoodAndWater && (actorRequiredFood || actorRequiredWater)}
        <div class="tab" class:active={activeTab === "foodwater"} data-group="primary" data-tab="foodwater">
          <FoodWaterTab {actor} {workflow}/>
        </div>
      {/if}

    </section>

    {#if showArmorCheckbox}
      <div class="form-group">
        <label>{localize("REST-RECOVERY.Dialogs.LongRest.ArmorRecovery")}</label>
        <input type="checkbox" bind:checked={healthData.removeNonLightArmor}/>
        <p class="hint">{localize("REST-RECOVERY.Dialogs.LongRest.ArmorRecoveryHint")}</p>
      </div>
    {/if}

    {#if showStartLongRestButton && activeTab !== "foodwater"}
      <div class="form-group" style="margin: 0.5rem 0;">
        <p class="notes">{localize("REST-RECOVERY.Dialogs.LongRest.BeginExplanation")}</p>
      </div>
    {/if}
    <footer class="flexrow" style="margin-top:0.5rem;">
      {#if !showStartLongRestButton}
        <button type="button" class="dialog-button" on:click={requestSubmit}><i
          class="fas fa-bed"></i> {localize("REST-RECOVERY.Dialogs.LongRest.FinishRest")}</button>
      {:else}
        <button type="button" class="dialog-button" on:click={startLongRest}>
          <i class="fas fa-bed"></i> {localize("REST-RECOVERY.Dialogs.LongRest.Begin")}
        </button>
      {/if}
      <button type="button" class="dialog-button" on:click={cancel}><i class="fas fa-times"></i> {localize("Cancel")}
      </button>
    </footer>

  </form>
</ApplicationShell>