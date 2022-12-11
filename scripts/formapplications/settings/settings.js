import { SvelteApplication, TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import SettingsShell from './settings-shell.svelte';
import SaveProfileDialog from "./SaveProfileDialog.svelte";

class Settings extends SvelteApplication {

  constructor(options = {}, dialogData = {}) {

    super({
      id: `rest-recovery-app`,
      title: "Rest Recovery",
      svelte: {
        class: SettingsShell,
        target: document.body
      },
      width: 600,
      ...options
    }, { dialogData });

  }

  static getActiveApp() {
    return Object.values(ui.windows).find(app => app.id === "rest-recovery-app");
  }

  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp()
    if (app) return app.render(false, { focus: true });
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(options, dialogData).render(true, { focus: true });
    })
  }

  _getHeaderButtons() {

    const buttons = super._getHeaderButtons();

    buttons.unshift({
      icon: 'fas fa-file-import',
      title: game.i18n.localize("REST-RECOVERY.Dialogs.ModuleConfig.ImportProfile"),
      label: game.i18n.localize("REST-RECOVERY.Dialogs.ModuleConfig.ImportProfile"),

      onclick: async () => {

        const profiles = this.svelte.applicationShell.profiles;

        const input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => {

          input.remove();

          // getting a hold of the file reference
          const file = e.target.files[0];
          const fileName = file.name;

          const reader = new FileReader();
          reader.addEventListener('load', async () => {
            try {

              const newProfileName = await new Promise(resolve => {
                let options = { resolve };
                new TJSDialog({
                  title: game.i18n.localize("REST-RECOVERY.Dialogs.SaveProfile.Title"),
                  content: {
                    class: SaveProfileDialog,
                    props: {
                      existingProfiles: Object.keys(profiles),
                      profileName: fileName.split(".")[0]
                    }
                  },
                  label: "Okay",
                  modal: true,
                  draggable: false,
                  autoClose: true,
                  close: () => options.resolve?.(null)
                }, options).render(true);
              });

              const newProfile = foundry.utils.duplicate(this.svelte.applicationShell.profiles['Default']);

              const profileData = JSON.parse(reader.result);

              for (const [key, value] of Object.entries(profileData)) {
                newProfile[key] = value;
              }

              this.svelte.applicationShell.profiles[newProfileName] = newProfile;
              this.svelte.applicationShell.selectedProfile = newProfileName;
              this.svelte.applicationShell.profiles = this.svelte.applicationShell.profiles;

            } catch (err) {
              console.error(err);
            }
          });

          reader.readAsText(file);

        }

        input.click();
      }
    });

    buttons.unshift({
      icon: 'fas fa-file-export',
      title: game.i18n.localize("REST-RECOVERY.Dialogs.ModuleConfig.ExportProfile"),
      label: game.i18n.localize("REST-RECOVERY.Dialogs.ModuleConfig.ExportProfile"),

      onclick: async () => {
        const profiles = this.svelte.applicationShell.profiles;
        const selectedProfile = this.svelte.applicationShell.selectedProfile;
        const profile = profiles[selectedProfile];
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(profile)], { type: "text/json" });
        a.href = URL.createObjectURL(file);
        a.download = selectedProfile + ".json";
        a.click();
        a.remove();
      }
    });

    return buttons;

  }

}

export default class SettingsShim extends FormApplication {

  /**
   * @inheritDoc
   */
  constructor() {
    super({});
    Settings.show();
  }

  async _updateObject(event, formData) {
  }

  render() {
    this.close();
  }

}
