<script>
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { getSetting } from "../../lib/lib.js";
    import CONSTANTS from "../../constants.js";

    const settings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())
        .filter(setting => setting[1].customSettingsDialog)
        .map(entry => {
            let [key, setting] = entry;
            setting.name = localize(setting.name)
            setting.value = getSetting(key);
            if(typeof setting.value === "boolean"){
                setting.value = setting.value ? "Yes" : "No";
            }else if(typeof setting.value === "string"){
                setting.value = localize(setting.choices[setting.value])
            }
            return setting;
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
            <td>{setting.name}</td>
            <td>{setting.value}</td>
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