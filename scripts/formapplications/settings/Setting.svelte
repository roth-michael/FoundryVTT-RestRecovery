<script>

  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
  import CONSTANTS from "../../constants.js";
  import { gameSettings } from "../../settings.js";
  import { writable } from "svelte/store";

  export let key;
  const setting = gameSettings.settings.get(key);
  const customFormulaStore = setting.customFormula ? setting.customFormulaSetting.store : writable('');
  const store = setting.store;
  const disabled = setting.disabled;

  function callback(){
    if(!setting.callback) return;
    setting.callback(gameSettings.settings);
  }

</script>


<div class="form-group flexrow">

  <div class="label-side">
    <label>{localize(setting.name)}
      <a>
        <i title="Reset setting" class="fas fa-undo reset-setting" on:click={() => { gameSettings.reset(key)}}></i>
      </a>
    </label>
    <p class="notes">{localize(setting.hint)}</p>
  </div>

  <div class="form-fields input-side">

    {#if setting.type === Boolean}

      <input type="checkbox" bind:checked={$store} disabled={$disabled} on:change={callback}>

    {:else if setting.choices}

      <div class="choice-container">
        <select name={setting.key} bind:value={$store} disabled={$disabled} on:change={callback}>
          {#each Object.entries(setting.choices) as [key, choice], index (index)}
            <option value="{key}">{localize(choice)}</option>
          {/each}
        </select>

        {#if setting.customFormulaSetting && $store === CONSTANTS.FRACTIONS.CUSTOM}
          <input name="{setting.customFormula}" type="text" bind:value={$customFormulaStore}
                 class:invalid={$customFormulaStore === ''} disabled={$disabled}>
        {/if}
      </div>

    {:else if setting.type === Number}

      <input type="number" bind:value={$store} class:invalid={!$store && $store !== 0}
             disabled={$disabled} on:change={callback}>

    {:else}

      <div class="setting-container">
        <input type="text" bind:value={$store} disabled={$disabled} on:change={callback}>
        {#if setting.localize}
          <input type="text" disabled value={localize($store)}>
        {/if}
      </div>

    {/if}
  </div>

</div>


<style lang="scss">

  .reset-setting {
    font-size: 0.75rem;
    margin-left: 0.5rem;
    opacity: 0.5;
    transition: opacity 250ms;

    &:hover {
      opacity: 1.0;
    }
  }

  .invalid {
    border: 2px solid #d93131;
  }

  label {
    flex: 1 0 auto;
  }

  .form-fields {
    flex: 0 1 auto;
  }

  select {
    min-width: 200px;
  }

  .setting-container {
    display: flex;
    flex-direction: column;

    input:first-child {
      margin-bottom: 0.25rem;
    }
  }

  .label-side {
    flex: 1;
    margin-right: 1rem;
  }

  .choice-container {
    max-width: 200px;
  }

  .setting-container {
    min-width: 300px;
  }

  input[type="number"] {
    min-width: 100px;
  }

</style>
