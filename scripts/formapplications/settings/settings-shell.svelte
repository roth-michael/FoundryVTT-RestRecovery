<script>
  import CONSTANTS from "../../constants.js";

  import { getContext } from 'svelte';
  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
  import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
  import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';

  import { getSetting } from "../../lib/lib.js";

  import Setting from "./Setting.svelte";
  import Tabs from "../components/Tabs.svelte";
  import SaveProfileDialog from "./SaveProfileDialog.svelte";
  import API from "../../api.js";

  const { application } = getContext('external');

  export let elementRoot;

  let form;

  let settingsMap = new Map();

  let settings = {};

  let profiles = API.getAllProfilesData();
  let activeProfile = API.getActiveProfile();

  if (profiles[activeProfile] === undefined) {
    activeProfile = "Default";
  }

  loadSettings()
  validateSettings();

  function loadSettings() {
    const profileData = API.getProfileData(activeProfile);
    settings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())
      .map(entry => {
        entry[1].value = profileData[entry[0]] ?? getSetting(entry[0]);
        entry[1].disabled = false;
        settingsMap.set(entry[0], entry[1]);
        return entry;
      }).reduce(function (r, a) {
        r[a[1].group] = r[a[1].group] || [];
        r[a[1].group].push(a);
        return r;
      }, Object.create(null));
  }

  function validateSettings() {
    for (const group of Object.keys(settings)) {
      for (let index = 0; index < settings[group].length; index++) {
        if (!settings[group][index][1].validate) continue;
        settings[group][index][1].disabled = settings[group][index][1].validate(settingsMap);
        if (!settings[group][index][1].disabled) continue;
        settings[group][index][1].value = settings[group][index][1].default;
      }
    }
    profiles[activeProfile] = Object.fromEntries(Array.from(settingsMap).map(entry => {
      return [entry[0], entry[1].value];
    }));
  }

  function resetSetting(group, index) {
    settings[group][index][1].value = settings[group][index][1].default;
    validateSettings();
  }

  async function deleteProfile() {

    const result = await TJSDialog.confirm({
      title: localize("REST-RECOVERY.Dialogs.DeleteProfile.Title"),
      content: localize("REST-RECOVERY.Dialogs.DeleteProfile.Content", { profile: activeProfile }),
      modal: true,
      draggable: false,
      autoClose: true,
      rejectClose: false
    });

    if (!result) {
      return;
    }

    delete profiles[activeProfile];
    activeProfile = "Default";
    profiles = profiles;
    loadProfile();

  }

  async function newProfile() {

    const result = await new Promise(resolve => {
      let options = { resolve };
      new TJSDialog({
        title: localize("REST-RECOVERY.Dialogs.SaveProfile.Title"),
        content: {
          class: SaveProfileDialog,
          props: {
            existingProfiles: Object.keys(profiles)
          }
        },
        label: "Okay",
        modal: true,
        draggable: false,
        autoClose: true,
        close: () => options.resolve?.(null)
      }, options).render(true);
    });

    if (!result) return;

    profiles[result] = foundry.utils.duplicate(profiles[activeProfile]);
    activeProfile = result;
    settings = settings;
    validateSettings();

  }

  function loadProfile() {
    for (let [key, setting] of Array.from(settingsMap)) {
      const profileValue = profiles[activeProfile][key];
      if (profileValue !== undefined) {
        setting.value = profileValue;
      }
    }
    settings = settings;
    validateSettings();
  }

  async function resetDefaultSetting() {

    const result = await TJSDialog.confirm({
      title: localize("REST-RECOVERY.Dialogs.ResetDefaultChanges.Title"),
      content: localize("REST-RECOVERY.Dialogs.ResetDefaultChanges.Content"),
      modal: true,
      draggable: false,
      autoClose: true,
      rejectClose: false
    });

    if (!result) {
      return;
    }

    profiles[activeProfile] = Object.fromEntries(Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).map(entry => {
      return [entry[0], entry[1].default];
    }))

    loadProfile();

  }

  function requestSubmit() {
    form.requestSubmit();
  }

  async function updateSettings() {
    await API.updateProfiles(profiles);
    await API.setActiveProfile(activeProfile);
    application.close();
  }

  let activeTab = "general";

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
  <form bind:this={form} on:submit|once|preventDefault={updateSettings} autocomplete="off">

    <h2 style="text-align: center; margin-bottom: 1rem;">{localize("REST-RECOVERY.Dialogs.ModuleConfig.Title")}</h2>

    <div class="preset-select">
      <label>{localize("REST-RECOVERY.Dialogs.ModuleConfig.ModuleProfile")}</label>
      <select bind:value={activeProfile} on:change={loadProfile}>
        {#each Object.keys(profiles) as profile (profile)}
          <option value="{profile}">{profile}</option>
        {/each}
      </select>
      <button type="button" on:click={newProfile}><i class="fas fa-plus"></i></button>
      <button type="button" class:hidden={activeProfile !== "Default"} on:click={resetDefaultSetting}><i
        class="fas fa-redo"></i></button>
      <button type="button" class:hidden={activeProfile === "Default"} disabled={activeProfile === "Default"}
              on:click={deleteProfile}><i class="fas fa-trash-alt"></i></button>
    </div>

    <Tabs bind:activeTab tabs={[
            { value: "general", label: "REST-RECOVERY.Dialogs.ModuleConfig.General" },
            { value: "longrest", label: "REST-RECOVERY.Dialogs.ModuleConfig.LongRest" },
            { value: "shortrest", label: "REST-RECOVERY.Dialogs.ModuleConfig.ShortRest" },
            { value: "itemnames", label: "REST-RECOVERY.Dialogs.ModuleConfig.ItemNames" },
            { value: "foodandwater", label: "REST-RECOVERY.Dialogs.ModuleConfig.FoodAndWater" },
        ]}/>

    <section class="tab-body">

      {#each Object.keys(settings) as group, index (index)}
        <div class="tab flex" class:active={activeTab === group} data-group="primary" data-tab="{group}">

          {#each settings[group] as [key, setting], setting_index (key)}
            {#if !setting.hidden}
              <div class="setting" on:change={validateSettings}>
                <Setting {group} {setting_index} {key} {setting} {settingsMap} {resetSetting}/>
              </div>
            {/if}
          {/each}

          {#if group === "general"}
            <div style="text-align: center; font-size: 1rem; margin-top:3rem;">
              <p>{localize("REST-RECOVERY.Dialogs.ModuleConfig.MoreToCome")}
              <p>
              <p style="margin-bottom:1rem;">
                <a class="link-text"
                   href="https://github.com/fantasycalendar/FoundryVTT-RestRecovery/issues/new?assignees=&labels=&template=feature_request.md&title="
                   target="_blank"
                >{localize("REST-RECOVERY.Dialogs.ModuleConfig.Request")}</a>
              </p>
              <p>
                {localize("REST-RECOVERY.Dialogs.ModuleConfig.Donate")}
              </p>
              <p>
                <a href="https://ko-fi.com/fantasycomputerworks" target="_blank"
                   style="text-decoration: none !important;">
                  <button class="donate-button" type="button">
                    <img src="https://storage.ko-fi.com/cdn/cup-border.png">
                    <span>Donate</span>
                  </button>
                </a>
              </p>
            </div>
          {/if}

        </div>
      {/each}
    </section>

    <footer>
      <button type="button" on:click={requestSubmit}><i
        class="far fa-save"></i> {localize("REST-RECOVERY.Dialogs.ModuleConfig.Submit")}</button>
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
    margin: 10px auto;

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
