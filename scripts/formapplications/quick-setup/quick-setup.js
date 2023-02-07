import CustomSvelteApplication from "../custom-svelte-application.js";
import QuickSetupShell from "./quick-setup-shell.svelte";

export class QuickSetup extends CustomSvelteApplication {

  constructor(options = {}) {
    super({
      close: () => this.options.reject(),
      ...options
    });
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize("REST-RECOVERY.Dialogs.QuickSetup.Title"),
      zIndex: 102,
      svelte: {
        class: QuickSetupShell,
        target: document.body
      },
      closeOnSubmit: false,
      id: "rest-quick-setup-app",
      width: 350,
      height: "auto",
      classes: ["dnd5e dialog"],
      resizable: false
    })
  }
}


export class QuickSetupShim extends FormApplication {

  /**
   * @inheritDoc
   */
  constructor() {
    super({});
    QuickSetup.show();
  }

  async _updateObject(event, formData) {
  }

  render() {
    this.close();
  }

}
