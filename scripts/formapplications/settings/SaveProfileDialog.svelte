<script>
    import { getContext } from 'svelte';
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

    import { getSetting } from "../../lib/lib.js";
    import CONSTANTS from "../../constants.js";

    const { application } = getContext('external');

    export let form;
    export let existingProfiles;
    let profileName = "New Preset";


    export async function requestSubmit() {
        form.requestSubmit();
        if(profileName === "Default"){
            ui.notifications.error();
            return false;
        }
    }

    export async function savePreset() {
        application.options.resolve(profileName);
        application.close();
    }

</script>

<svelte:options accessors={true}/>

<form bind:this={form} on:submit|preventDefault={savePreset} autocomplete=off class="dialog-content">

    <div class="form-control">
        <label>Enter preset name:</label>
        <input type="text" bind:value={profileName}>
    </div>

    {#if profileName === ""}
        <div class="notification error">{@html localize("REST-RECOVERY.Dialogs.SaveProfile.Empty")}</div>
    {:else if existingProfiles.indexOf(profileName) > -1}
        <div class="notification error">{@html localize("REST-RECOVERY.Dialogs.SaveProfile.OverrideProfile")}</div>
    {/if}

    <footer>
        <button type="button" disabled={profileName === "" || existingProfiles.indexOf(profileName) > -1} on:click={requestSubmit}>{localize("Okay")}</button>
    </footer>

</form>

<style lang="scss">

  .notification {
    margin-top: 1rem;
    padding: 0.5rem;
    opacity: 1.0;
    color: white;
  }

  .form-control {
    margin: 0.5rem 0;
  }

  footer {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0,0,0,0.25);
  }

</style>