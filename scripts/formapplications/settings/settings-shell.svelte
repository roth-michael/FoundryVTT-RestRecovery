<script>
    import { getContext } from 'svelte';
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
    import CONSTANTS from "../../constants.js";

    const { application } = getContext('external');

    export let elementRoot;
    let form;

    let settingsMap = new Map();
    let settings = Object.entries(CONSTANTS.DEFAULT_SETTINGS).map(entry => {
        entry[1].value = game.settings.get(CONSTANTS.MODULE_NAME, entry[0]);
        entry[1].disabled = false;
        settingsMap.set(entry[0], entry[1]);
        return entry;
    }).reduce(function (r, a) {
        r[a[1].group] = r[a[1].group] || [];
        r[a[1].group].push(a);
        return r;
    }, Object.create(null));

    validateSettings();

    function validateSettings(){
        for(const group of Object.keys(settings)){
            for(let index = 0; index < settings[group].length; index++){
                if(!settings[group][index][1].validate) continue;
                settings[group][index][1].disabled = !settingsMap.get(settings[group][index][1].validate).value;

                if(!settings[group][index][1].disabled) continue;
                settings[group][index][1].value = settings[group][index][1].default;
            }
        }
    }

    function resetSetting(group, index){
        settings[group][index][1].value = settings[group][index][1].default;
        validateSettings();
    }

    async function requestSubmit(){
        for(let group of Object.values(settings)) {
            for (let [key, setting] of group) {
                await game.settings.set(CONSTANTS.MODULE_NAME, key, setting.value);
            }
        }
        form.requestSubmit();
    }

    function updateSettings(){
        application.close();
    }

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
    <form bind:this={form} on:submit|once|preventDefault={updateSettings} autocomplete="off">

        <h2 style="text-align: center; margin-bottom: 1rem;">{localize("REST-RECOVERY.Dialogs.ModuleConfig.Title")}</h2>

        <nav class="tabs" data-group="primary">
            <a class="item active" data-tab="longrest">{localize("REST-RECOVERY.Dialogs.ModuleConfig.LongRest")}</a>
            <a class="item" data-tab="shortrest">{localize("REST-RECOVERY.Dialogs.ModuleConfig.ShortRest")}</a>
            <!--<a class="item" data-tab="other">{localize("REST-RECOVERY.Dialogs.ModuleConfig.Other")}</a>-->
        </nav>

        <section class="tab-body">

            {#each Object.keys(settings) as group, index (index)}
            <div class="tab flex" data-group="primary" data-tab="{group}">

                {#each settings[group] as [key, setting], setting_index (key)}
                <div class="form-group">
                    <label>{localize(setting.name)} <a><i title="Reset setting" class="fas fa-undo reset-setting" on:click={() => { resetSetting(group, setting_index)}}></i></a></label>
                    <div class="form-fields">
                        {#if typeof setting.value === "boolean"}

                            <input type="checkbox" bind:checked={setting.value} disabled={setting.disabled} on:change={validateSettings}>

                        {:else if setting.choices}

                            <select bind:value={setting.value} on:change={validateSettings}>
                            {#each Object.entries(setting.choices) as [key, choice], index (index)}
                                <option value="{key}">{localize(choice)}</option>
                            {/each}
                            </select>

                        {:else}

                            <input bind:value={setting.value} on:change={validateSettings}>

                        {/if}
                    </div>
                    <p class="notes">{localize(setting.hint)}</p>
                </div>
                {/each}

            </div>
            {/each}
        </section>

        <footer>
            <button type="button" on:click={requestSubmit}><i class="far fa-save"></i> {localize("REST-RECOVERY.Dialogs.ModuleConfig.Submit")}</button>
        </footer>
    </form>
</ApplicationShell>

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

  .tabs {
    border-bottom: 1px solid rgba(0,0,0,0.25);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .tab-body {
    max-height: 400px;
    min-height: 400px;
    overflow-y: scroll;
    padding: 5px;
  }

  .form-group:not(:last-child){
    border-bottom: 1px solid rgba(0,0,0,0.25);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }

  label {
    flex: 1 0 auto;
  }

  .form-fields{
    flex: 0 1 auto;
  }

  select {
    min-width: 200px;
    max-width: 200px;
  }

  footer{
    border-top: 1px solid rgba(0,0,0,0.25);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }

</style>