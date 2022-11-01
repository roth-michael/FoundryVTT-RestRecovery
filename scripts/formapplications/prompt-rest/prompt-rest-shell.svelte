<script>
  import { getContext } from 'svelte';
  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
  import { writable } from "svelte/store";
  import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
  import CONSTANTS from "../../constants.js";
  import * as lib from "../../lib/lib.js";
  import SettingsShim from "../settings/settings.js";
  import SocketHandler from "../../sockets.js";
  import { TJSDialog } from "@typhonjs-fvtt/runtime/_dist/svelte/application/index.js";
  import CustomSettings from "../custom-settings-dialog/CustomSettingsDialog.svelte";

  const { application } = getContext('external');

  export let elementRoot;

  let form;

  const validActors = Object.entries(Array.from(game.actors).reduce((acc, actor) => {
    for(const [userId, permissions] of Object.entries(actor.ownership)){
      if(userId === "default") continue;
      const user = game.users.get(userId);
      if(!user) continue;
      const combinedID = user.id + "-" + actor.id;
      if(user.isGM || permissions < 3) continue;
      acc[combinedID] = `${actor.name} (${user.name})`;
    }
    return acc;
  }, {})).sort((a, b) => (a[0] > b[0] ? -1 : 1));

  let configuration = new Set();
  let validRemainingIds = [];
  const cleanConfig = writable([]);

  cleanConfig.subscribe(values => {
    configuration = new Set(values);
    validRemainingIds = validActors.filter(entry => {
      return !configuration.has(entry[0]);
    }).map(entry => entry[0]);
    foundry.utils.debounce(debounceSave, 150);
  })

  function debounceSave(){
    lib.setSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG, [...configuration]);
  }

  cleanConfig.update(() => {
    return Array.from(lib.getSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG)).filter(entry => {
      return game.users.get(entry.split("-")[0]) && game.actors.get(entry.split("-")[1]);
    });
  })

  function addPlayer(){
    if(!validRemainingIds.length) return;
    cleanConfig.update((values) => {
      values.push(validRemainingIds[0]);
      return values;
    });
  }

  function removePlayer(index){
    cleanConfig.update((values) => {
      values.splice(index, 1);
      return values;
    });
  }

  async function requestSubmit() {
    form.requestSubmit();
  }

  async function submitPrompt() {
    await game.restrecovery.setActiveProfile(activeProfile);
    await lib.setSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG, [...configuration]);
    application.options.resolve();
    SocketHandler.emit(SocketHandler.PROMPT_REST, {
      userActors: [...configuration],
      restType
    })
    application.close();
  }

  function showCustomRulesDialog() {
    TJSDialog.prompt({
      title: localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title"),
      content: {
        class: CustomSettings,
        props: {
          settings: game.restrecovery.getProfileData(activeProfile)
        }
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

  const profiles = game.restrecovery.getAllProfiles();
  let activeProfile = game.restrecovery.getActiveProfile();
  let restType = "longRest";

</script>


<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
  <form bind:this={form} on:submit|preventDefault={submitPrompt} autocomplete=off class="dialog-content">

    <div class="grid-table">
      <div style="font-size:1rem; margin-bottom:0.25rem;">Player characters to prompt rests for</div>
      <div style="text-align: center;">
        <i class="fas fa-plus rest-recovery-clickable-link" style="font-size:1rem;" on:click={() => { addPlayer() }}></i>
      </div>
      {#each $cleanConfig as comboId, index}
        <select bind:value={comboId}>
          {#each validActors.filter(actorEntry => {
            return !configuration.has(actorEntry[0]) || actorEntry[0] === comboId;
          }) as [id, text] (id)}
            <option value={id}>{text}</option>
          {/each}
        </select>
        <div style="text-align: center;">
          <i class="fas fa-times rest-recovery-clickable-link-red" on:click={() => { removePlayer(index) }}></i>
        </div>
      {/each}

    <div style="font-size: 1rem; margin-top:0.5rem; margin-bottom:0.25rem;">Rest Profile</div>
    <div></div>

      <select bind:value={activeProfile}>
        {#each profiles as profile}
          <option>{profile}</option>
        {/each}
      </select>

      <div style="text-align: center;">
        <i class="fas fa-info-circle"
           class:rest-recovery-clickable-link={activeProfile !== "Default"}
           class:rest-recovery-disabled={activeProfile === "Default"}
           style="margin-right:0.25rem;"
           on:click={() => {
            if(activeProfile === "Default") return;
            showCustomRulesDialog();
          }}></i>
        <i class="fas fa-cog rest-recovery-clickable-link" on:click={() => {
          new SettingsShim().render(true);
        }}></i>
      </div>

    </div>

    <footer class="flexrow" style="margin-top:0.5rem;">
      <button type="button" class="dialog-button" on:click={(e) => {
        restType = 'longRest';
        requestSubmit(e);
      }}>
        <i class="fas fa-bed"></i> {localize("REST-RECOVERY.Dialogs.PromptRest.Long")}
      </button>
      <button type="button" class="dialog-button" on:click={(e) => {
        restType = 'shortRest';
        requestSubmit(e);
      }}>
        <i class="fa-solid fa-hourglass-half"></i> {localize("REST-RECOVERY.Dialogs.PromptRest.Short")}
      </button>
      <button type="button" class="dialog-button" on:click={() => { application.close() }}>
        <i class="fas fa-times"></i> {localize("Cancel")}
      </button>
    </footer>

  </form>
</ApplicationShell>

<style lang="scss">

  .grid-table{
    display:grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    column-gap: 0.5rem;

    .line {
      grid-column: 1 / -1;
      height: 1px;
    }

    select, i {
      margin-bottom: 0.25rem;
    }

  }

</style>