<script>

    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import CONSTANTS from "../../constants.js";

    export let settingsMap
    export let setting;
    export let group;
    export let setting_index;
    export let resetSetting;

    let customFormulaSetting = settingsMap.get(setting.customFormula);

</script>



<div class="form-group flexrow">

    <div class="label-side">
        <label>{localize(setting.name)} <a><i title="Reset setting" class="fas fa-undo reset-setting" on:click={() => { resetSetting(group, setting_index)}}></i></a></label>
        <p class="notes">{localize(setting.hint)}</p>
    </div>

    <div class="form-fields input-side">

        {#if setting.type === Boolean}

            <input type="checkbox" bind:checked={setting.value} disabled={setting.disabled}>

        {:else if setting.choices}

            <div class="choice-container">
                <select name={setting.key} bind:value={setting.value} disabled={setting.disabled}>
                    {#each Object.entries(setting.choices) as [key, choice], index (index)}
                        <option value="{key}">{localize(choice)}</option>
                    {/each}
                </select>

                {#if customFormulaSetting && setting.value === CONSTANTS.RECOVERY.CUSTOM}
                    <input name="{setting.customFormula}" type="text" required bind:value={customFormulaSetting.value} class:invalid={customFormulaSetting.value === ''} disabled={setting.disabled}>
                {/if}
            </div>

        {:else if setting.type === Number}

            <input type="number" required bind:value={setting.value} class:invalid={!setting.value && setting.value !== 0} disabled={setting.disabled}>

        {:else}

            <div class="setting-container">
                <input type="text" required bind:value={setting.value} disabled={setting.disabled}>
                {#if setting.localize}
                    <input type="text" disabled value={localize(setting.value)}>
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
    &:hover{
      opacity: 1.0;
    }
  }

  .invalid{
    border: 2px solid #d93131;
  }

  label {
    flex: 1 0 auto;
  }

  .form-fields{
    flex: 0 1 auto;
  }

  select {
    min-width: 200px;
  }

  .setting-container{
    display:flex;
    flex-direction: column;
    input:first-child{
      margin-bottom: 0.25rem;
    }
  }

  .label-side{
    flex:1;
    margin-right:1rem;
  }

  .choice-container {
    max-width: 200px;
  }

  .setting-container{
    min-width: 300px;
  }

  input[type="number"]{
    min-width: 100px;
  }

</style>