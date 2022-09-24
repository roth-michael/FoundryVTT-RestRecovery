<script>
  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
  import { getSetting } from "../../lib/lib.js";
  import CONSTANTS from "../../constants.js";

  const settingsMap = new Map();

  console.log('---------------------------')

  const settings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())
    .map(entry => {
      let [key, setting] = entry;
      setting.name = localize(setting.name)
      setting.value = getSetting(key);
      if(setting.customSettingsDialog) {
        if (typeof setting.value === "boolean") {
          setting.settingText = setting.value ? "Yes" : "No";
        } else if (typeof setting.value === "string") {
          setting.settingText = localize(setting.choices[setting.value])
        }
      }
      settingsMap.set(key, setting);
      return setting;
    })
    .map(setting => {

      setting.visible = setting.customSettingsDialog
        && (setting.validate ? !setting.validate(settingsMap) : true)
        && !!setting?.settingText && !!setting.value && setting.default !== setting.value;

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
    {#each settings.filter(s => s.visible) as setting, index (index)}
      <tr>
        <td>{setting.name}</td>
        <td>{setting.settingText}</td>
      </tr>
    {/each}
  </table>

</div>
<style lang="scss">

  table {
    text-align: center;

    th:first-child {
      width: 300px;
    }
  }

</style>