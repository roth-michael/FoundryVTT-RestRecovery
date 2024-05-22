import { SvelteApplication } from '#runtime/svelte/application';

export default class CustomSvelteApplication extends SvelteApplication {

  constructor(options, dialogData) {
    super(options, dialogData);
  }

  static getActiveApp(actor) {
    return Object.values(ui.windows).find(app => app instanceof this && app?.actor === actor);
  }

  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp(options.actor);
    if (app) {
      app.render(false, { focus: true });
      return new Promise((resolve, reject) => {
        app.options.resolve = resolve;
        app.options.reject = reject;
      });
    }
    return new Promise((resolve, reject) => {
      options.resolve = resolve;
      options.reject = reject;
      const newApp = new this(options, dialogData).render(true, { focus: true });
      newApp.actor = options.actor;
    });
  }

}
