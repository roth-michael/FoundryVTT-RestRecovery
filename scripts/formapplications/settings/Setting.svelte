<script>

    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

    export let setting;
    export let group;
    export let setting_index;
    export let resetSetting;

</script>



<div class="form-group flexrow">

    <div class="label-side">
        <label>{localize(setting.name)} <a><i title="Reset setting" class="fas fa-undo reset-setting" on:click={() => { resetSetting(group, setting_index)}}></i></a></label>
        <p class="notes">{localize(setting.hint)}</p>
    </div>

    <div class="form-fields input-side">
        {#if typeof setting.value === "boolean"}

            <input type="checkbox" bind:checked={setting.value} disabled={setting.disabled}>

        {:else if setting.choices}

            <select bind:value={setting.value}>
                {#each Object.entries(setting.choices) as [key, choice], index (index)}
                    <option value="{key}">{localize(choice)}</option>
                {/each}
            </select>

        {:else if typeof setting.value === 'number'}

            <input type="number" bind:value={setting.value}>

        {:else}

            <div class="setting-container">
                <input type="text" bind:value={setting.value}>
                <input type="text" disabled value={localize(setting.value)}>
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

  input[type="text"], input[type="number"], .setting-container{
    min-width: 300px;
  }

</style>