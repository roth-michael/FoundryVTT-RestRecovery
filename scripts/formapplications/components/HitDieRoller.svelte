<script>
  import { localize } from '#runtime/svelte/helper';
  import { getSetting } from "../../lib/lib.js";
  import CONSTANTS from "../../constants.js";

  export let workflow;
  export let healthData;
  export let selectedHitDice;
  export let onHitDiceFunction = () => {
  };
  export let onAutoFunction = () => {
  };

  export let minSpendHitDice = 0;
  export let maxSpendHitDice = 0;

  let autoRollEnabled = getSetting(CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE);
  let disableAutoButton;
  let enableRollButton;

  $: {
    disableAutoButton = !healthData.enableAutoRollHitDice;
  }

  $: {
    enableRollButton = healthData.availableHitDice[selectedHitDice] > 0
      && workflow.currHP < workflow.maxHP
      && (minSpendHitDice === 0 || (minSpendHitDice > healthData.hitDiceSpent || (maxSpendHitDice === 0 || healthData.hitDiceSpent < maxSpendHitDice)))
      && (maxSpendHitDice === 0 || healthData.hitDiceSpent < maxSpendHitDice);
  }


</script>

<div class="form-group">
  <div class="flexcol">
    <div>
      <label>{localize("DND5E.ShortRestSelect")}</label>
    </div>
    <div class="form-fields">
      <select name="hd" bind:value={selectedHitDice} style="height:26px;">
        {#each Object.entries(healthData.availableHitDice) as [hitDice, num], index (index)}
          <option value="{hitDice}">{hitDice} ({num} {localize("DND5E.available")})</option>
        {/each}
      </select>
      <button type="button" disabled={!enableRollButton} on:click={(event) => { onHitDiceFunction(event) }}>
        <i class="fas fa-dice-d20"></i> {localize("DND5E.Roll")}
      </button>
      {#if autoRollEnabled}
        <button type="button" disabled="{disableAutoButton || !enableRollButton}"
                on:click={(event) => { onAutoFunction(event) }}>
          <i class="fas fa-redo"></i> {localize("REST-RECOVERY.Dialogs.ShortRest.AutoRoll")}
        </button>
      {/if}
    </div>
    {#if healthData.totalHitDice === 0}
      <p class="notes">{localize("DND5E.ShortRestNoHD")}</p>
    {/if}
  </div>
</div>
