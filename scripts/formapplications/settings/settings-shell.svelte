<script>
    import { getContext } from 'svelte';
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
    import CONSTANTS from "../../constants.js";
    import { getSetting } from "../../lib/lib.js";
    import Setting from "./Setting.svelte";

    const { application } = getContext('external');

    export let elementRoot;
    let form;

    let settingsMap = new Map();
    let settings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())
    .map(entry => {
        entry[1].value = getSetting(entry[0]);
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

    function requestSubmit(){
        form.requestSubmit();
    }

    async function updateSettings(){
        for(let group of Object.values(settings)) {
            for (let [key, setting] of group) {
                await game.settings.set(CONSTANTS.MODULE_NAME, key, setting.value);
            }
        }
        application.close();
    }

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
    <form bind:this={form} on:submit|once|preventDefault={updateSettings} autocomplete="off">

        <h2 style="text-align: center; margin-bottom: 1rem;">{localize("REST-RECOVERY.Dialogs.ModuleConfig.Title")}</h2>

        <nav class="tabs" data-group="primary">
            <a class="item active" data-tab="general">{localize("REST-RECOVERY.Dialogs.ModuleConfig.General")}</a>
            <a class="item" data-tab="longrest">{localize("REST-RECOVERY.Dialogs.ModuleConfig.LongRest")}</a>
            <a class="item" data-tab="shortrest">{localize("REST-RECOVERY.Dialogs.ModuleConfig.ShortRest")}</a>
            <a class="item" data-tab="itemnames">{localize("REST-RECOVERY.Dialogs.ModuleConfig.ItemNames")}</a>
        </nav>

        <section class="tab-body">

            {#each Object.keys(settings) as group, index (index)}
            <div class="tab flex" data-group="primary" data-tab="{group}">

                {#each settings[group] as [key, setting], setting_index (key)}
                    {#if !setting.hidden}
                        <div class="setting" on:change={validateSettings}>
                            <Setting {group} {setting_index} {key} {setting} {settingsMap} {resetSetting}/>
                        </div>
                    {/if}
                {/each}

                {#if settings[group].length < 4}
                <div style="text-align: center; font-size: 1rem; margin-top:3rem;">
                    <p>{localize("REST-RECOVERY.Dialogs.ModuleConfig.MoreToCome")}<p>
                    <p>
                        <a
                            style="color: var(--color-text-hyperlink);"
                            href="https://github.com/fantasycalendar/FoundryVTT-RestRecovery/issues/new?assignees=&labels=&template=feature_request.md&title="
                            target="_blank"
                        >{localize("REST-RECOVERY.Dialogs.ModuleConfig.Request")}</a>
                    </p>
                </div>
                {/if}

            </div>
            {/each}
        </section>

        <footer>
            <button type="button" on:click={requestSubmit}><i class="far fa-save"></i> {localize("REST-RECOVERY.Dialogs.ModuleConfig.Submit")}</button>
        </footer>
    </form>
</ApplicationShell>

<style lang="scss">

  .tabs {
    border-bottom: 1px solid rgba(0,0,0,0.25);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .tab-body {
    max-height: 660px;
    min-height: 660px;
    overflow-y: scroll;
    padding: 5px;
  }

  .setting:not(:last-child){
    border-bottom: 1px solid rgba(0,0,0,0.25);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }

  footer{
    border-top: 1px solid rgba(0,0,0,0.25);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }

</style>