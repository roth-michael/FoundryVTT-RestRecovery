<script>
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { getSetting } from "../../lib/lib.js";
    import CONSTANTS from "../../constants.js";

    const settings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())
        .filter(entry => entry[1].customSettingsDialog)
        .map(entry => {
            entry[1].value = getSetting(entry[0]);
            return entry[1];
        });

</script>

<div>

    <h3>{localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title")}</h3>

    <p>{localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Content")}</p>

    <table>
        <tr>
            <th>Setting</th>
            <th>Value</th>
        </tr>
        {#each settings as setting, index (index)}
        <tr>
            <td>{localize(setting.name)}</td>
            <td>{localize(setting.choices[setting.value])}</td>
        </tr>
        {/each}
    </table>

</div>
<style lang="scss">

  table {
    text-align: center;
    th:first-child {
      width: 250px;
    }
  }

</style>