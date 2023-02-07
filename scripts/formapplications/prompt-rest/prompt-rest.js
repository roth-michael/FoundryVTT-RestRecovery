import PromptRestShell from './prompt-rest-shell.svelte';
import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

export default class PromptRestDialog extends SvelteApplication {

  constructor(options = {}, dialogData = {}) {
    super({
      title: game.i18n.localize("REST-RECOVERY.Dialogs.PromptRest.Title"),
      zIndex: 102,
      svelte: {
        class: PromptRestShell,
        target: document.body
      },
      close: () => this.options.reject(),
      ...options
    }, dialogData);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      id: "rest-request-app",
      width: 350,
      height: "auto",
      classes: ["dnd5e dialog rest-recovery-request-app"],
      resizable: true
    })
  }

  static getActiveApp() {
    return Object.values(ui.windows).find(app => app.id === "rest-request-app");
  }

  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp();
    if (app) return app.render(false, { focus: true });
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(options, dialogData).render(true, { focus: true });
    });
  }
}
