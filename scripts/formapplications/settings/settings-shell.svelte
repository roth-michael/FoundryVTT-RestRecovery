<script>

  import { getContext } from 'svelte';
  import { localize } from '../../lib/lib.js';
  import { ApplicationShell } from '#runtime/svelte/component/core';
  import { gameSettings } from "../../settings.js";
  import Setting from "./Setting.svelte";
  import Tabs from "../components/Tabs.svelte";
  import { QuickSetup } from "../quick-setup/quick-setup.js";
  import { SaveProfileApplication } from '../../apps/saveProfile.js';

  const { application } = getContext('#external');

  gameSettings.cleanup();

  export let elementRoot;

  let form;

  async function deleteProfile() {

    const result = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: localize("REST-RECOVERY.Dialogs.DeleteProfile.Title")
      },
      content: localize("REST-RECOVERY.Dialogs.DeleteProfile.Content", { profile: gameSettings.activeProfile })
    })

    if (!result) {
      return;
    }

    await gameSettings.deleteProfile(gameSettings.activeProfile);

  }

  async function newProfile() {

    const result = await new Promise(resolve => {
      new SaveProfileApplication({
        resolve
      }).render(true);
    });

    if (!result) return;

    const newProfile = foundry.utils.duplicate(gameSettings.activeProfileData);

    await gameSettings.createProfile(result, newProfile, true);

  }

  async function changeProfile(){
    return gameSettings.setActiveProfile(gameSettings.activeProfile);
  }

  async function resetDefaultSetting() {
    const result = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: localize("REST-RECOVERY.Dialogs.ResetDefaultChanges.Title")
      },
      content: localize("REST-RECOVERY.Dialogs.ResetDefaultChanges.Content")
    });
    if (!result) return;

    return gameSettings.resetAll();
  }

  function requestSubmit() {
    form.requestSubmit();
  }

  async function updateSettings() {
    await gameSettings.persistSettings();
    application.close();
  }

  async function openQuickSetup(){
    QuickSetup.show();
    application.close();
	}

  let activeTab = "general";

  const activeProfileStore = gameSettings.activeProfileStore;
  const profileStore = gameSettings.profilesStore;

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
  <form bind:this={form} autocomplete="off" on:submit|once|preventDefault={updateSettings}>

    <h2 style="text-align: center; margin-bottom: 1rem;">{localize("REST-RECOVERY.Dialogs.ModuleConfig.Title")}</h2>

    <div class="preset-select">
      <label>{localize("REST-RECOVERY.Dialogs.ModuleConfig.ModuleProfile")}</label>
      <select bind:value={$activeProfileStore} on:change={() => { changeProfile(); }}>
        {#each Object.keys($profileStore) as profile (profile)}
          <option>{profile}</option>
        {/each}
      </select>
      <button type="button" on:click={newProfile}><i class="fas fa-plus"></i></button>
      <button type="button" class:hidden={gameSettings.activeProfile !== "Default"} on:click={resetDefaultSetting}>
        <i class="fas fa-redo"></i>
      </button>
      <button type="button" class:hidden={gameSettings.activeProfile === "Default"}
              disabled={gameSettings.activeProfile === "Default"} on:click={deleteProfile}>
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>

    <Tabs bind:activeTab tabs={[
            { value: "general", label: "REST-RECOVERY.Dialogs.ModuleConfig.General" },
            { value: "longrest", label: "REST-RECOVERY.Dialogs.ModuleConfig.LongRest" },
            { value: "shortrest", label: "REST-RECOVERY.Dialogs.ModuleConfig.ShortRest" },
            { value: "itemnames", label: "REST-RECOVERY.Dialogs.ModuleConfig.ItemNames" },
            { value: "foodandwater", label: "REST-RECOVERY.Dialogs.ModuleConfig.FoodAndWater" },
        ]}/>

    <section class="tab-body">

      {#each Array.from(gameSettings.groupedSettings.keys()) as group, index (group)}

        <div class="tab flex" class:active={activeTab === group} data-group="primary" data-tab="{group}">

          {#each gameSettings.groupedSettings.get(group) as setting, setting_index (setting.key)}
            <div class="setting">
              <Setting key={setting.key}/>
            </div>
          {/each}

          {#if group === "general"}
						<div style="text-align: center; font-size: 1rem; margin-top: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(0,0,0,0.25)">
							<p>{localize("REST-RECOVERY.Dialogs.ModuleConfig.Confused")}</p>
							<p>
								<a on:click={() => { openQuickSetup() }} class="link-text">
									{localize("REST-RECOVERY.Dialogs.ModuleConfig.QuickSetup")}
								</a>
							</p>
						</div>
          {/if}

        </div>
      {/each}
    </section>

    <footer>
      <button type="button" on:click={requestSubmit}>
        <i class="far fa-save"></i> {localize("REST-RECOVERY.Dialogs.ModuleConfig.Submit")}
      </button>
    </footer>
  </form>
</ApplicationShell>

<style lang="scss">

  .link-text {
    color: var(--color-text-hyperlink);
  }

  .donate-button {
    border: 0;
    border-radius: 9999px;
    background-color: #00bfa5;
    align-items: center;
    font-family: nunito, quicksand, sans-serif;
    font-size: 16px;
    width: max-content;
    justify-content: space-between;
    padding: 5px 15px;
    font-weight: 700;
    cursor: pointer;
    -webkit-border-radius: 100px;
    display: flex;
    margin: 5px auto;

    img {
      border: 0;
      width: 39px;
    }

    span {
      margin-left: 8px;
      color: white !important;
    }
  }

  .preset-select {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;

    align-items: center;

    label {
      flex: 0 1 auto;
      margin-right: 0.5rem;
    }

    select {
      flex: 1;
    }

    button {
      margin-left: 0.25rem;
      flex: 0 1 auto;
      width: auto;
      height: 27px;
      text-align: center;
      line-height: normal;
    }
  }

  .tab-body {
    max-height: 660px;
    min-height: 660px;
    overflow-y: scroll;
    padding: 5px;
  }

  .setting:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }

  footer {
    border-top: 1px solid rgba(0, 0, 0, 0.25);
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }

</style>
