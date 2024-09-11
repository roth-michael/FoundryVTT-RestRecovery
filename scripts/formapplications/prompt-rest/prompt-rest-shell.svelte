<script>
  import { getContext } from 'svelte';
  import { localize } from '#runtime/svelte/helper';
  import { writable } from "svelte/store";
  import { ApplicationShell } from '#runtime/svelte/component/core';
  import CONSTANTS from "../../constants.js";
  import * as lib from "../../lib/lib.js";
  import SettingsShim from "../settings/settings.js";
  import SocketHandler from "../../sockets.js";
  import { TJSDialog } from "#runtime/svelte/application";
  import CustomSettings from "../custom-settings-dialog/CustomSettingsDialog.svelte";

  const { application } = getContext('#external');

  export let elementRoot;

  let form;

  const priorityActors = Array.from(game.scenes.get(game.user.viewedScene)?.tokens?.values()).map(currToken => currToken?.actor).filter(currActor => !!currActor) ?? [];
  const otherActors = Array.from(game.actors).filter(dirActor => !priorityActors.map(priActor => priActor.id).includes(dirActor.id));

  const validActors = [...priorityActors, ...otherActors].reduce((acc, actor) => {
    for (const [userId, permissions] of Object.entries(actor.ownership)) {
      if (userId === "default") {
        if (permissions < 3) continue;
        const allPlayers = game.users.filter(user => !user.isGM);
        if (!allPlayers.length) continue;
        for (const currPlayer of allPlayers) {
          const combinedID = currPlayer.id + "-" + actor.id;
          acc.push([combinedID, `${actor.name} (${currPlayer.name})`]);
        }
        break;
      }
      const user = game.users.get(userId);
      if (!user) continue;
      const combinedID = user.id + "-" + actor.id;
      if (user.isGM || permissions < 3) continue;
      acc.push([combinedID, `${actor.name} (${user.name})`]);
    }
    return acc;
  }, []);
  for (const [currCombined, currName] of (application.options?.actorList ?? [])) {
    if (!validActors.some(curr => curr[0] === currCombined)) validActors.push([currCombined, currName]);
  }

  let configuration = new Set();
  let validRemainingIds = [];
  let forceNewDay = false;

  const cleanConfig = writable([]);

  const simpleCalendarActive = lib.getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
  const longRestWouldBeNewDay = lib.getTimeChanges(true).isNewDay;
  const shortRestWouldBeNewDay = lib.getTimeChanges(false).isNewDay;

  const profiles = game.restrecovery.getAllProfiles();
  let activeProfile = game.restrecovery.getActiveProfile();
  let restType = "longRest";

  cleanConfig.subscribe(values => {
    configuration = new Set(values);
    validRemainingIds = validActors.filter(entry => {
      return !configuration.has(entry[0]);
    }).map(entry => entry[0]);
  })

  cleanConfig.update(() => {
    let maybeSavedConfig = application.options?.actorList?.flatMap(curr => curr[0]) ?? foundry.utils.getProperty(game.user, CONSTANTS.FLAGS.PROMPT_REST_CONFIG);
    let savedConfig = maybeSavedConfig ?? Array.from(lib.getSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG));
    return savedConfig.filter(entry => {
      return game.users.get(entry.split("-")[0]) && game.actors.get(entry.split("-")[1]);
    });
  })

  async function updateRestConfig() {
    if (application.options?.actorList) return;
    await game.user.update({[CONSTANTS.FLAGS.PROMPT_REST_CONFIG]: [...configuration]});
    lib.setSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG, [...configuration]);
  }

  async function addPlayer() {
    if (!validRemainingIds.length) return;
    cleanConfig.update((values) => {
      values.push(validRemainingIds[0]);
      return values;
    });
    await updateRestConfig();
  }

  async function removePlayer(index) {
    cleanConfig.update((values) => {
      values.splice(index, 1);
      return values;
    });
    await updateRestConfig();
  }

  async function requestSubmit() {
    form.requestSubmit();
  }

  async function submitPrompt() {
    await game.restrecovery.setActiveProfile(activeProfile);
    await updateRestConfig();
    const timeChanges = lib.getTimeChanges(restType === "longRest");

    if(lib.getSetting(CONSTANTS.SETTINGS.ENABLE_PROMPT_REST_TIME_PASSING)) {
      await game.time.advance(timeChanges.restTime);
    }

    const trueNewDay = simpleCalendarActive ? timeChanges.isNewDay : forceNewDay;

    if (configuration.size) {
      SocketHandler.emit(SocketHandler.PROMPT_REST, {
        userActors: [...configuration],
        restType,
        newDay: trueNewDay,
        promptNewDay: false
      })
    }

    application.options.resolve();
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

</script>


<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>

  <form bind:this={form} on:submit|preventDefault={submitPrompt} autocomplete=off class="dialog-content">

    <div class="rest-recovery-grid-table">
      <div style="font-size:1rem; margin-bottom:0.25rem;">{localize("REST-RECOVERY.Dialogs.PromptRest.PromptCharactersRest")}</div>
      <div style="text-align: center;">
        <i class="fas fa-plus rest-recovery-clickable-link" style="font-size:1rem;"
           on:click={async () => { await addPlayer() }}></i>
      </div>
      {#each $cleanConfig as comboId, index}
        <select bind:value={comboId} on:change={async () => { await updateRestConfig() }}>
          {#each validActors.filter(actorEntry => {
            return !configuration.has(actorEntry[0]) || actorEntry[0] === comboId;
          }) as [id, text] (id)}
            <option value={id}>{text}</option>
          {/each}
        </select>
        <div style="text-align: center;">
          <i class="fas fa-times rest-recovery-clickable-link-red" on:click={async () => { await removePlayer(index) }}></i>
        </div>
      {/each}

      <div style="font-size: 1rem; margin-top:0.25rem; margin-bottom:0.25rem;">{localize("REST-RECOVERY.Dialogs.PromptRest.RestProfile")}</div>
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


      {#if !simpleCalendarActive}
        <div style="margin-top:0.25rem; grid-column: {simpleCalendarActive ? '1 / 3' : '1'};">
          <span style="font-size: 1rem;">{localize("REST-RECOVERY.Dialogs.PromptRest.NewDayTitle")}</span>
          <p style="font-size: 0.75rem; color: #4b4a44;">
						{localize("REST-RECOVERY.Dialogs.PromptRest.NewDayHint")}
          </p>
        </div>
        {#if !simpleCalendarActive}
          <input type="checkbox" bind:checked={forceNewDay}/>
				{:else}
					<div></div>
        {/if}
			{:else}

				<div style="margin-top:0.25rem; grid-column: {simpleCalendarActive ? '1 / 3' : '1'};">
					<span style="font-size: 1rem;">{@html localize(`REST-RECOVERY.Dialogs.PromptRest.${!longRestWouldBeNewDay && !shortRestWouldBeNewDay ? "No" : ""}NewDayTitle`)}</span>
					<p style="font-size: 0.75rem; color: #4b4a44;">
						{@html localize(`REST-RECOVERY.Dialogs.PromptRest.${!longRestWouldBeNewDay && !shortRestWouldBeNewDay ? "No" : ""}NewDaySimpleCalendarHint`)}
					</p>
				</div>
				<div></div>

      {/if}

    </div>

    <footer class="flexrow" style="margin-top:0.25rem;">
      <button type="button" class="dialog-button" on:click={(e) => {
        restType = 'longRest';
        requestSubmit(e);
      }}>
        <i class="fas fa-bed"></i>
        {localize("REST-RECOVERY.Dialogs.PromptRest.Long")}
        {#if simpleCalendarActive && longRestWouldBeNewDay}
          {localize("REST-RECOVERY.Dialogs.PromptRest.NewDay")}
        {/if}
      </button>
      <button type="button" class="dialog-button" on:click={(e) => {
        restType = 'shortRest';
        requestSubmit(e);
      }}>
        <i class="fa-solid fa-hourglass-half"></i>
        {localize("REST-RECOVERY.Dialogs.PromptRest.Short")}
        {#if simpleCalendarActive && shortRestWouldBeNewDay}
          {localize("REST-RECOVERY.Dialogs.PromptRest.NewDay")}
        {/if}
      </button>
    </footer>

  </form>
</ApplicationShell>

<style lang="scss">

  .rest-recovery-grid-table {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr auto;
    column-gap: 0.5rem;
		max-width: 100%;

    .line {
      grid-column: 1 / -1;
      height: 1px;
    }

    select, i {
      margin-bottom: 0.25rem;
    }

  }

  .form-group p {
    font-weight: normal;
    line-height: 14px;
    font-size: var(--font-size-12);
    color: var(--color-text-dark-secondary);
    padding-right: 1rem;
    margin-top: 0;
    overflow-y: hidden;
    margin-bottom: 0.25rem;
  }
</style>
