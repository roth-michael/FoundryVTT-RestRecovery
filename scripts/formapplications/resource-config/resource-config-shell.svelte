<script>

  import { getContext } from 'svelte';
  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
  import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';

  import * as lib from "../../lib/lib.js";
  import CONSTANTS from "../../constants.js";

  const { application } = getContext('external');

  export let elementRoot;
  export let actor;
  let form;

  const count = actor.system.resources['count']?.value ?? 3;

  const resources = Object.entries(actor.system.resources)
    .map(entry => {
      let resource = entry[1];
      resource.path = `system.resources.${entry[0]}`;
      resource.flagPath = `flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.resources.${entry[0]}.formula`;
      resource.formula = foundry.utils.getProperty(actor, `${resource.flagPath}`) ?? "";
      return resource;
    })
    .filter((resource, index) => resource.path !== "count" && index < count);

  function requestSubmit() {
    let valid = true;
    const actorData = actor.getRollData();
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      if (!resource.formula) continue;
      try {
        const roll = lib.evaluateFormula(resource.formula, actorData);
        if (!roll) {
          valid = false;
        }
      } catch (err) {
        const resourceName = resource.label ? `Resource "${resource.label}"` : 'Resource ' + (i + 1);
        ui.notifications.warn(`Rest Recovery for 5e: ${resourceName} has a problem with its formula, please fix this.`);
        valid = false;
      }
    }
    if (!valid) return false;
    form.requestSubmit();
  }

  async function updateSettings() {
    const flagUpdates = Object.fromEntries(resources.map(resource => {
      return [resource.flagPath, resource.formula];
    }));
    const resourceUpdates = Object.fromEntries(resources.map(resource => {
      return [resource.path, {
        label: resource.label,
        value: Number(resource.value),
        max: Number(resource.max),
        sr: resource.sr,
        lr: resource.lr
      }];
    }));
    await actor.update({
      ...flagUpdates,
      ...resourceUpdates
    })
    application.options.resolve();
    application.close();
  }

</script>


<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>

  <form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete="off">

    <div class="container">

      <table>

        <tr>
          <th style="width:auto;">{localize("REST-RECOVERY.Dialogs.Resources.Name")}</th>
          <th style="width:20%;">{localize("REST-RECOVERY.Dialogs.Resources.Value")}</th>
          <th style="width:auto;">{localize("REST-RECOVERY.Dialogs.Resources.Short")}</th>
          <th style="width:auto;">{localize("REST-RECOVERY.Dialogs.Resources.Long")}</th>
          <th style="width:auto;">{localize("REST-RECOVERY.Dialogs.Resources.RecoveryFormula")}</th>
        </tr>

        {#each resources as resource, index (index)}
          <tr>
            <td>
              <input type="text" bind:value={resource.label} placeholder="Resource {index+1}"/>
            </td>
            <td>
              <div class="flexrow">
                <input type="number" style="text-align: right;" bind:value={resource.value}/>
                <span class="sep">/</span>
                <input type="number" bind:value={resource.max}/>
              </div>
            </td>
            <td class="text-center">
              <input type="checkbox" bind:checked={resource.sr}>
            </td>
            <td class="text-center">
              <input type="checkbox" bind:checked={resource.lr}>
            </td>
            <td>
              <input type="text" bind:value={resource.formula}>
            </td>
          </tr>
        {/each}

      </table>

    </div>

    <footer class="flexrow" style="margin-top:0.5rem;">
      <button type="button" class="dialog-button" on:click={requestSubmit}><i
        class="fas fa-check"></i> {localize("Submit")}</button>
    </footer>

  </form>
</ApplicationShell>

<style>

    .container {
        max-height: 400px;
        overflow: auto;
    }

    .sep {
        flex: 0;
        margin: 0 3px;
    }

    .text-center {
        text-align: center;
    }
</style>
